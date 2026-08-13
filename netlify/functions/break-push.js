/* Juno Tech break-reminder push sender — Netlify Scheduled Function.
 *
 * Runs once a minute (schedule set in netlify.toml). It reads the live
 * timesheet + push subscriptions from Firebase, works out which clocked-in
 * employees are due for a break, and sends a Web Push to their phone — the one
 * channel that reaches a locked screen. The kiosk's in-page siren covers the
 * case where the app is open in front of them; this covers pocketed phones.
 *
 * Required Netlify environment variables:
 *   FIREBASE_DB_URL     e.g. https://your-project.firebaseio.com   (no trailing slash)
 *   VAPID_PRIVATE_KEY   the private key printed when the VAPID pair was generated
 *   VAPID_PUBLIC_KEY    (optional) overrides the built-in public key below
 *   VAPID_SUBJECT       (optional) mailto: contact, defaults to the address below
 */

const webpush = require('web-push');

// Public key is not a secret — it also lives in kiosk.html. Private key MUST come from env.
const VAPID_PUBLIC  = process.env.VAPID_PUBLIC_KEY  || 'BFsSACZIvSVJP5a8rbg_FLT9pJlA55fh-b8uHyrs0ePdiGjjQ2i6_yVQQtrRSgCFLA5yy0uVwQ4hEIGjwUrYgBo';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:info@junotechlaboratory.com';
const DB = (process.env.FIREBASE_DB_URL || '').replace(/\/+$/, '');

// Break thresholds — kept in sync with kiosk.html.
const REST1_HRS = 2.0, MEAL_DUE_HRS = 4.0, REST2_HRS = 6.0, SHIFT_WARN_HRS = 7.5, SHIFT_MAX_HRS = 8.0;
const BREAK_EXEMPT = ['Mylyn', 'Jose', 'Julissa', 'Cristina'];
const REPEAT_MS = 5 * 60 * 1000; // re-nag an ignored reminder at most every 5 minutes

function empKey(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function fbGet(path) {
  const r = await fetch(`${DB}/jtl/${path}`);
  if (!r.ok) return null;
  return r.json();
}
async function fbPut(path, body) {
  return fetch(`${DB}/jtl/${path}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
}
async function fbDelete(path) {
  return fetch(`${DB}/jtl/${path}`, { method: 'DELETE' });
}

// Reconstruct an employee's current open session from their sorted entries.
function openSession(entries) {
  const sorted = entries.slice().sort((a, b) => new Date(a.ts) - new Date(b.ts));
  let clockInTs = null, restTaken = 0, mealTaken = 0, mealWaived = false, inBreak = false, brkType = '', onBreak = false;
  for (const e of sorted) {
    if (e.type === 'in') { clockInTs = e.ts; restTaken = 0; mealTaken = 0; mealWaived = false; inBreak = false; onBreak = false; }
    else if (e.type === 'out') { clockInTs = null; onBreak = false; }
    else if (e.type === 'break_start') { inBreak = true; onBreak = true; brkType = e.breakType || (parseInt(e.note, 10) >= 30 ? 'meal' : 'rest'); }
    else if (e.type === 'break_end') { if (inBreak) { brkType === 'meal' ? mealTaken++ : restTaken++; } inBreak = false; onBreak = false; }
    else if (e.type === 'break_waived' && e.breakType === 'meal') { mealWaived = true; }
  }
  if (!clockInTs) return null;
  return { clockInTs, restTaken, mealTaken, mealWaived, onBreak };
}

// Highest-priority break that is currently due and not yet satisfied.
function dueAlert(s, elapsedHrs) {
  if (elapsedHrs >= SHIFT_MAX_HRS)
    return { id: 'shiftmax', title: '⛔ 8-hour shift limit', body: "You've reached the 8-hour limit. Please clock out now." };
  if (elapsedHrs >= SHIFT_WARN_HRS)
    return { id: 'shiftwarn', title: '🚨 Shift ending soon', body: '30 minutes until your 8-hour limit — start wrapping up.' };
  const mealHandled = s.mealTaken > 0 || s.mealWaived;
  if (elapsedHrs >= MEAL_DUE_HRS && !mealHandled)
    return { id: 'meal', title: '🍽️ Meal break due', body: 'Your 30-minute unpaid meal break is required now.' };
  if (elapsedHrs >= REST2_HRS && s.restTaken < 2)
    return { id: 'rest2', title: '☕ Rest break due', body: 'Time for your 2nd 10-minute paid rest break.' };
  if (elapsedHrs >= REST1_HRS && s.restTaken < 1)
    return { id: 'rest1', title: '☕ Rest break due', body: 'Time for your 1st 10-minute paid rest break.' };
  return null;
}

exports.handler = async function () {
  if (!DB || !VAPID_PRIVATE) {
    console.error('break-push: missing FIREBASE_DB_URL or VAPID_PRIVATE_KEY env var');
    return { statusCode: 200, body: 'not configured' };
  }
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

  // Bounded read: only entries from the last ~20h (keys are ts-sortable strings).
  const sinceKey = new Date(Date.now() - 20 * 3600000).toISOString().slice(0, 10); // YYYY-MM-DD
  const q = `timesheet.json?orderBy=${encodeURIComponent('"$key"')}&startAt=${encodeURIComponent('"' + sinceKey + '"')}`;
  const [tsObj, subs, sentAll] = await Promise.all([fbGet(q), fbGet('pushSubs.json'), fbGet('pushSent.json')]);
  if (!tsObj || !subs) return { statusCode: 200, body: 'nothing to do' };

  // Group entries by employee name.
  const byName = {};
  for (const k in tsObj) {
    const e = tsObj[k];
    if (!e || !e.name || !e.ts || !e.type) continue;
    (byName[e.name] = byName[e.name] || []).push(e);
  }

  const now = Date.now();
  let sent = 0;

  for (const name in byName) {
    if (BREAK_EXEMPT.indexOf(name) !== -1) continue;
    const key = empKey(name);
    const sub = subs[key] && subs[key].sub;
    if (!sub) continue; // employee hasn't enabled alerts on a phone

    const s = openSession(byName[name]);
    if (!s || s.onBreak) continue; // not clocked in, or already on a break

    const elapsedHrs = (now - new Date(s.clockInTs).getTime()) / 3600000;
    const alert = dueAlert(s, elapsedHrs);
    if (!alert) continue;

    // Per-shift dedupe: reset the "sent" map when a new shift starts.
    let rec = sentAll && sentAll[key];
    if (!rec || rec.clockIn !== s.clockInTs) rec = { clockIn: s.clockInTs, sent: {} };
    const last = rec.sent[alert.id] || 0;
    if (now - last < REPEAT_MS) continue; // already nagged recently

    try {
      await webpush.sendNotification(sub, JSON.stringify({ title: alert.title, body: alert.body, tag: 'jtl-' + alert.id }));
      rec.sent[alert.id] = now;
      await fbPut(`pushSent/${key}.json`, rec);
      sent++;
    } catch (err) {
      if (err && (err.statusCode === 404 || err.statusCode === 410)) {
        await fbDelete(`pushSubs/${key}.json`); // subscription expired — drop it
      } else {
        console.error('break-push send failed for', name, err && err.statusCode);
      }
    }
  }

  return { statusCode: 200, body: `sent ${sent}` };
};
