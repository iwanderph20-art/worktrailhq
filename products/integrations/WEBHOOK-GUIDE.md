# Connect Worktrail to your other tools (Webhook)

Worktrail can send every clock-in and clock-out to another app in real time — no
coding, no extra software. Go to **Admin → Settings → Webhook / Integrations**,
paste a webhook URL, and click **Save & Send Test Event**.

Each clock-in/out sends this data:

```json
{
  "event": "clock_in",
  "business": "Your Business",
  "employee": "Jordan Smith",
  "position": "Nurse",
  "employment_type": "w2",
  "type": "in",
  "timestamp": "2026-07-02T14:13:00.000Z",
  "time_local": "7/2/2026, 2:13:00 PM",
  "timezone": "America/New_York",
  "note": "",
  "hasPhoto": true
}
```

## Popular ways to use it

### Google Sheets (log every shift to a spreadsheet)
1. Open a new sheet at **sheets.new**.
2. **Extensions → Apps Script**, paste the script from `google-sheets-webhook.gs`.
3. **Deploy → New deployment → Web app** (Execute as: Me, Access: Anyone), copy the URL.
4. Paste the URL into Worktrail's Webhook field. Done — rows appear automatically.

### Zapier (connect to 6,000+ apps)
1. New Zap → Trigger: **Webhooks by Zapier → Catch Hook**.
2. Copy the custom webhook URL Zapier gives you → paste into Worktrail.
3. Add any action: Slack message, SMS, add to payroll, update your CRM, etc.

### Make.com
1. New scenario → **Webhooks → Custom webhook** → copy the address.
2. Paste into Worktrail → click Save & Send Test Event so Make learns the data shape.

### Slack (instant clock-in alerts to a channel)
Use Zapier or Make (above) with a Slack action, or a Slack **Incoming Webhook** via
a Zapier/Make relay.

### Your own system
Point the webhook at any HTTPS endpoint you control. Worktrail POSTs the JSON above.

---

**Note:** Worktrail runs in the browser, so events send while the kiosk is open and
in use (which is exactly when clock-ins happen). Times follow the timezone you pick
in Settings. Need a custom or always-on integration? Contact us for a quote.
