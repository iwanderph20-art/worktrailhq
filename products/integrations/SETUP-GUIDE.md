# Worktrail — Setup & Integration Guide

Welcome! Worktrail is **one file** (`worktrail.html`). There's nothing to install
and no monthly fee. This guide gets you running in a few minutes and shows how to
connect it to tools you already use.

---

## Part 1 — Get it running (about 5 minutes)

Worktrail is designed to run **synced across every device**, so employees can clock
in from **their own phones** (or a shared tablet, or your laptop) and everything
lands in one place. This uses a **free Google Firebase** database that **you own** —
we never see or store your data. This is the standard setup; do this.

### Step 1 — Create your free Firebase database (about 2 minutes)
1. Go to **console.firebase.google.com** and sign in with any Google account.
2. Click **Add project** → give it any name → continue (skip Google Analytics).
3. In the left menu: **Build → Realtime Database → Create Database**.
4. Pick a location → choose **Start in test mode** → **Enable**.
5. Copy the database URL at the top — it looks like
   `https://your-project-default-rtdb.firebaseio.com`.

### Step 2 — Set up Worktrail
1. Open `worktrail.html` (double-click it, or host it — see Part 4).
2. Click **Set Up My Kiosk** and follow the 3 steps: business name/logo/color →
   admin password → **paste your Firebase URL** on the last step → Finish.
3. **Set your database security rules** (important — see Part 2).
4. Add your employees (Admin → Employees) and give each a 4-digit PIN.

### Step 3 — Share ONE link with all staff
In **Admin → Settings → Kiosk Link → Share with Employees**, copy the generated
link and send it to everyone. **Whoever opens that link — on any phone or tablet —
is automatically connected to the same synced data.** That's the whole trick: one
link, everyone synced, no accounts for employees.

> **Single-device only?** During setup you can choose "Use on a single device only,"
> but then records stay on that one device and staff can't clock in from their own
> phones. We recommend the synced setup above for almost everyone.

---

## Part 2 — Lock down your database (do this once)

Your records live in **your** Firebase, so you control who can access them. In the
Firebase console → **Realtime Database → Rules**, replace the rules and click
**Publish**.

**Simple (shared kiosk — anyone with the link can read/write):**
```json
{ "rules": { ".read": true, ".write": true } }
```
This is fine for most small businesses: the link is only shared with your staff,
and there's no sensitive data beyond names and times.

**Tighter (read/write only under the Worktrail path):**
```json
{
  "rules": {
    "sd": { ".read": true, ".write": true },
    "$other": { ".read": false, ".write": false }
  }
}
```

If you're unsure, the simple rule is safe to start with. Email
**support@worktrailhq.com** and we'll help you tighten it.

---

## Part 3 — Connect Worktrail to your current software

You do **not** have to replace your payroll or HR system. Worktrail can feed data
into it in three ways, from easiest to most automated:

### 1. Export a file (no setup)
Admin → **Records → CSV** or **PDF**, or **Payroll → Download PDF**. Import the CSV
into QuickBooks, Gusto, ADP, Excel, Google Sheets — anything that takes a spreadsheet.

### 2. Live webhook (no code — recommended for automation)
Admin → **Settings → Webhook / Integrations** → paste a URL → **Save & Send Test Event**.
Every clock-in/out is sent as JSON in real time. Use it with:
- **Google Sheets** — paste-ready script included (`google-sheets-webhook.gs`).
- **Zapier / Make** — "Catch Hook" / "Custom webhook" → route to 6,000+ apps
  (Slack, SMS, your payroll, your CRM).
- **Your own system** — point it at any HTTPS endpoint you control.

See `WEBHOOK-GUIDE.md` for step-by-step.

### 3. Read directly from your Firebase (for developers)
Your clock data sits in your Firebase Realtime Database under the `sd/timesheet`
path. Your own scripts, a BI tool, or Zapier's Firebase integration can read it
directly.

**A note on how it works:** Worktrail runs in the browser, so webhook/exports
happen while the kiosk is open and in use — which is exactly when clock-ins occur.
For 95% of small businesses that's perfect. Need always-on, enterprise-grade sync
or a custom integration? Email **support@worktrailhq.com** for a quote.

---

## Part 4 — Put your kiosk online (so the shared link works everywhere)

For staff to open the **same link on their own phones**, the `worktrail.html` file
must live at a public web address. Pick any free host (2 minutes, no coding):

- **Netlify Drop** — go to **app.netlify.com/drop** and drag `worktrail.html` in.
  You instantly get a public URL. Easiest option.
- **Cloudflare Pages / GitHub Pages** — free static hosting if you already use them.
- **Your existing website** — upload the file to your own domain (e.g.
  `yourbusiness.com/kiosk.html`) and point staff there.

Once it's online, redo **Settings → Kiosk Link → Share with Employees** so the link
uses your public address. Send that link to staff — they bookmark it on their phones
and clock in from anywhere.

> Opening the file by double-click (`file://…`) works only on that one computer, and
> phone cameras stay off. A public **https://** address makes the shared link and
> photo capture work on every device.

---

## Which package do I need?

- **Worktrail — $69:** clock-in/out, photo capture, records, calendar, CSV/PDF
  export, email alerts, webhook integrations.
- **Payroll add-on — $39:** define your W-2/1099 deductions (auto-read a sample
  stub), generate gross-to-net pay reports with PDF.
- **Bundle — $89:** Worktrail + Payroll together (saves $19).

Already bought the add-on or bundle? Admin → **Payroll → Enter license key** to unlock.

---

Questions, problems, or feature ideas? **support@worktrailhq.com** — we read
everything and use it to improve Worktrail.
