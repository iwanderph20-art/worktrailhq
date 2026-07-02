/**
 * Worktrail → Google Sheets
 * Logs every employee clock-in / clock-out to this spreadsheet.
 *
 * ONE-TIME SETUP (about 3 minutes):
 *  1. Open a new Google Sheet (sheets.new).
 *  2. Extensions → Apps Script. Delete anything there and paste ALL of this file.
 *  3. Click Deploy → New deployment.
 *  4. Type: Web app. Execute as: Me. Who has access: Anyone. Click Deploy.
 *  5. Authorize when prompted (it's your own script), then copy the "Web app URL".
 *  6. In Worktrail: Admin → Settings → Webhook / Integrations → paste that URL →
 *     "Save & Send Test Event". A test row appears in your sheet within seconds.
 *
 * From then on, every clock-in/out adds a row automatically.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Add a header row the first time
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Received','Event','Business','Employee','Position',
        'Type','Timestamp (UTC)','Local Time','Timezone','Note','Has Photo','Test?']);
    }

    var d = {};
    try { d = JSON.parse(e.postData.contents); } catch (err) {}

    sheet.appendRow([
      new Date(),
      d.event || '',
      d.business || '',
      d.employee || '',
      d.position || '',
      d.type || '',
      d.timestamp || '',
      d.time_local || '',
      d.timezone || '',
      d.note || '',
      d.hasPhoto ? 'Yes' : 'No',
      d.test ? 'TEST' : ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput(
    'Worktrail webhook is live. Paste this page’s URL into Worktrail → Settings → Webhook URL.'
  );
}
