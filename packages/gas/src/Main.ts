import { logEvent } from './utils/logger';
import { readActiveSheet } from './services/SheetsService';

export function onOpen(): void {
  SpreadsheetApp.getUi()
    .createMenu('OpenChamber')
    .addItem('シートを同期', 'syncActiveSheet')
    .addToUi();
  logEvent('menu_installed');
}

export function syncActiveSheet(): void {
  const data = readActiveSheet();
  logEvent('sync_run', { rows: data.length });
  SpreadsheetApp.getUi().alert(`同期完了: ${data.length} 行`);
}

export function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.TextOutput {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, query: e.parameter }))
    .setMimeType(ContentService.MimeType.JSON);
}
