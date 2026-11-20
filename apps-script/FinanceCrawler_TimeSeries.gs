function refreshTimeSeriesFromConfig() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const config = ss.getSheetByName('CONFIG');
  if (!config) {
    throw new Error('Sheet CONFIG non trovato');
  }

  const lastRow = config.getLastRow();
  if (lastRow < 2) return;

  // A=ISIN, B=StockEx, C=Ticker, D=Name, E=Sparkline, F=Currency,
  // G=RollingVol, H=StartDate, I=Interval, J=IsFund, K=Active (Y/N)
  const data = config.getRange(2, 1, lastRow - 1, 11).getValues();
  const historyColumns = 6;

  data.forEach((row, index) => {
    const isin = row[0];
    const ticker = row[2];
    const active = row[10];
    if (active !== 'Y' || !isin || !ticker) return;

    const configRow = index + 2;
    const sheetName = 'TIME_SERIES_' + ticker;
    const existingSheet = ss.getSheetByName(sheetName);
    const sheet = existingSheet || ss.insertSheet(sheetName);

    ensureSheetSize_(sheet, 1, historyColumns);

    if (existingSheet) {
      // A:F contiene l'output storico, a partire dalla formula in A1.
      sheet.getRange(1, 1, sheet.getMaxRows(), historyColumns).clearContent();
    }

    const formula =
      `=GOOGLEFINANCE(CONFIG!B${configRow} & ":" & CONFIG!C${configRow};"all";CONFIG!H${configRow};TODAY();CONFIG!I${configRow})`;
    sheet.getRange('A1').setFormula(formula);
    styleSheetTabAndHeader_(sheet, '#1E88E5', historyColumns);
  });
}
