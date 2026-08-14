/* Standalone runner for the break-reminder push sender.
 *
 * The push logic lives in netlify/functions/break-push.js. That function was
 * written for Netlify's scheduled-function runtime, but the live site is served
 * from GitHub Pages (static only), so Netlify never runs it. This runner invokes
 * the exact same handler from a GitHub Actions cron instead — see
 * .github/workflows/break-push.yml — so the same code path sends the pushes.
 *
 * Required env (set as GitHub repo secrets):
 *   VAPID_PRIVATE_KEY   the private key from the VAPID pair            (required)
 *   FIREBASE_DB_URL     Realtime DB URL, no trailing slash   (optional — defaults
 *                       to the lab DB baked into break-push.js)
 *   VAPID_PUBLIC_KEY    (optional) overrides the built-in public key
 *   VAPID_SUBJECT       (optional) mailto: contact
 */
const { handler } = require('../netlify/functions/break-push.js');

(async () => {
  try {
    const res = await handler();
    console.log('break-push:', (res && res.body) || '(no body)');
  } catch (e) {
    console.error('break-push failed:', e);
    process.exit(1);
  }
})();
