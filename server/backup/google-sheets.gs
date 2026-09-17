// Deploy as an Apps Script web app owned by the destination Sheet owner.
// Script properties: SHEET_ID and SHEET_WEBHOOK_SECRET (match Vercel).
function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var expected = props.getProperty('SHEET_WEBHOOK_SECRET');
  var data;
  try { data = JSON.parse(e.postData.contents); } catch (_) { return reply({ok:false}); }
  if (!expected || data.secret !== expected || !/^[0-9a-f-]{36}$/i.test(data.submission_id || '')) return reply({ok:false});
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var book = SpreadsheetApp.openById(props.getProperty('SHEET_ID'));
    var sheet = book.getSheetByName('Leads') || book.insertSheet('Leads');
    if (!sheet.getLastRow()) sheet.appendRow(['submission_id','lead_id','received_at','submitted_at','name','phone','city','email','notes','source','campaign']);
    var rows = sheet.getLastRow();
    var exists = rows > 1 && sheet.getRange(2,1,rows-1,1).createTextFinder(data.submission_id).matchEntireCell(true).findNext();
    if (!exists) {
      var values = [data.submission_id,data.id,new Date().toISOString(),data.created_at,data.full_name,data.phone,data.city,data.email,data.notes,data.utm_source,data.utm_campaign];
      // Preserve phone numbers and prevent spreadsheet formula injection.
      values = values.map(function(v){return "'" + String(v == null ? '' : v);});
      var range = sheet.getRange(sheet.getLastRow()+1,1,1,values.length);
      range.setNumberFormat('@');
      range.setValues([values]);
      SpreadsheetApp.flush();
    }
    return reply({ok:true,submission_id:data.submission_id});
  } finally { lock.releaseLock(); }
}
function reply(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
