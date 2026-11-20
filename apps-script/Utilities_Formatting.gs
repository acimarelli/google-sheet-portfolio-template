/** Estende la griglia del foglio alle dimensioni richieste dall'output. */
function ensureSheetSize_(sheet, rows, columns) {
  const currentRows = sheet.getMaxRows();
  if (currentRows < rows) {
    sheet.insertRowsAfter(currentRows, rows - currentRows);
  }

  const currentColumns = sheet.getMaxColumns();
  if (currentColumns < columns) {
    sheet.insertColumnsAfter(currentColumns, columns - currentColumns);
  }
}

/** Colora la scheda e l'intestazione, con testo bianco in grassetto. */
function styleSheetTabAndHeader_(sheet, color, headerColumns = Math.max(sheet.getLastColumn(), 1)) {
  sheet.setTabColor(color);
  sheet
    .getRange(1, 1, 1, headerColumns)
    .setBackground(color)
    .setFontWeight('bold')
    .setFontColor('#FFFFFF');
}

/** Applica il layout a tutta l'area del feed prima che si popoli. */
function formatNewsSheetLayout_(sheet, totalRows) {
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 350); // Title
  sheet.setColumnWidth(2, 260); // Link
  sheet.setColumnWidth(3, 130); // Published
  sheet.setColumnWidth(4, 500); // Description

  sheet.getRange(1, 1, totalRows, 1).setWrap(true).setVerticalAlignment('top');
  sheet.getRange(1, 4, totalRows, 1).setWrap(true).setVerticalAlignment('top');
  sheet.getRange(1, 3, totalRows, 1).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeights(2, totalRows - 1, 40);
}
