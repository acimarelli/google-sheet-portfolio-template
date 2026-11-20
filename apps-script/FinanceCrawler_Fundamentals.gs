function refreshFundamentalsFromConfig() {
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

  const attributes = [
    'marketcap',
    'tradetime',
    'datadelay',
    'volumeavg',
    'pe',
    'eps',
    'high52',
    'low52',
    'change',
    'beta',
    'changepct',
    'closeyest',
    'shares',
    'returnytd',
    'netassets',
    'yieldpct',
    'returnday',
    'return1',
    'return4',
    'return13',
    'return52',
    'return156',
    'return260',
    'incomedividend',
    'incomedividenddate',
    'capitalgain',
    'morningstarrating',
    'expenseratio',
  ];
  const header = ['ISIN', 'Ticker', 'FullTicker', 'Name', 'AssetType', 'Price', 'Currency', ...attributes];
  const rowsOut = [];

  data.forEach((row, index) => {
    const ticker = row[2];
    const active = row[10];
    if (active !== 'Y' || !ticker) return;

    const configRow = index + 2;
    const tickerReference = `CONFIG!B${configRow} & ":" & CONFIG!C${configRow}`;
    const financeFormulas = ['price', 'currency', ...attributes].map(
      (attribute) => `=IFERROR(GOOGLEFINANCE(${tickerReference};"${attribute}");"")`,
    );

    rowsOut.push([
      `=CONFIG!A${configRow}`,
      `=CONFIG!C${configRow}`,
      `=${tickerReference}`,
      `=CONFIG!D${configRow}`,
      `=IF(CONFIG!J${configRow}="Y";"FUND";"STOCK")`,
      ...financeFormulas,
    ]);
  });

  const sheetName = 'FUNDAMENTALS';
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  ensureSheetSize_(sheet, rowsOut.length + 1, header.length);
  sheet.getRange(1, 1, 1, header.length).setValues([header]);
  styleSheetTabAndHeader_(sheet, '#43A047');

  if (rowsOut.length > 0) {
    sheet.getRange(2, 1, rowsOut.length, header.length).setValues(rowsOut);
  }
}
