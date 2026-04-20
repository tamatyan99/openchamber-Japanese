export function readActiveSheet(): unknown[][] {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  return sheet.getDataRange().getValues();
}
