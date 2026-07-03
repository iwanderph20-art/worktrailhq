# Worktrail — Setup & Integration Guide

Welcome! Worktrail is **one file** (`worktrail.html`). There's nothing to install
and no monthly fee. This guide gets you running in a few minutes and shows how to
connect it to tools you already use.

---

## Part 1 — Get it running (2 minutes)

You have two ways to run Worktrail. Pick one:

### Option A — Single device (simplest)
Best if one tablet/computer at the front desk is your kiosk.
1. Double-click `worktrail.html` (or drag it into Chrome/Safari/Edge).
2. Click **Set Up My Kiosk** and follow the 3 steps (business name, logo, color →
   admin password → done).
3. Add your employees (Admin → Employees) and give each a 4-digit PIN.
4. Staff tap their PIN to clock in/out.

Data is saved **on that device only**. Great for a single kiosk; if the device is
wiped, the data goes with it — so if you want a backup or multiple devices, use
Option B.

### Option B — Multiple devices, synced (recommended)
Best if staff clock in from more than one device, or you want the admin dashboard
on your phone while the kiosk runs on a tablet. Uses a **free Google Firebase**
database that **you own** — we never see or store your data.

1. Go to **firebase.google.com** → sign in with a Google account → **Create a project**
   (any name). Skip Google Analytics if asked.
2. In the left menu: **Build → Realtime Database → Create Database**. Choose a
   location, then **Start in test mode** for now.
3. Copy the database URL at the top — it looks like
   `https://your-project-default-rtdb.firebaseio.com`.
4. In Worktrail: **Admin → Settings → Cloud Sync** → paste the URL → **Save & Connect**.
5. **Set your security rules** (important — see Part 2).
6. In **Settings → Kiosk Link → Share with Employees**, copy the generated link and
   send it to staff. Anyone who opens that link is automatically connected to the
   same synced data. Done.

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
If you chose Option B, your clock data sits in your Firebase Realtime Database under
the `sd/timesheet` path. Your own scripts, a BI tool, or Zapier's Firebase
integration can read it directly.

**A note on how it works:** Worktrail runs in the browser, so webhook/exports
happen while the kiosk is open and in use — which is exactly when clock-ins occur.
For 95% of small businesses that's perfect. Need always-on, enterprise-grade sync
or a custom integration? Email **support@worktrailhq.com** for a quote.

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
