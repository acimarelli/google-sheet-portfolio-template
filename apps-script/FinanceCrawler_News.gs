const NEWS_ITEM_LIMIT = 250;

/** Aggiorna NEWS_<Ticker> con una ricerca Google News per ticker o ISIN. */
function refreshNewsFromConfig() {
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

  data.forEach((row, index) => {
    const isin = row[0];
    const ticker = row[2];
    const active = row[10];
    if (active !== 'Y' || !isin || !ticker) return;

    const configRow = index + 2;
    const sheetName = 'NEWS_' + String(ticker).trim();
    const formula =
      `=IMPORTFEED("https://news.google.com/rss/search?q=" & ` +
      `ENCODEURL(CONFIG!C${configRow} & " OR " & CONFIG!A${configRow});"";"";${NEWS_ITEM_LIMIT})`;

    writeNewsSheet_(ss, sheetName, formula, '#FB8C00');
  });
}

function writeNewsSheet_(spreadsheet, sheetName, formula, tabColor) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  const header = ['Title', 'Link', 'Published', 'Description'];
  const totalRows = NEWS_ITEM_LIMIT + 1;
  ensureSheetSize_(sheet, totalRows, header.length);
  sheet.getRange(1, 1, 1, header.length).setValues([header]);
  styleSheetTabAndHeader_(sheet, tabColor);
  sheet.getRange('A2').setFormula(formula);
  formatNewsSheetLayout_(sheet, totalRows);
}
