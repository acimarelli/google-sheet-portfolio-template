function refreshGlobalNewsRaw() {
  refreshGlobalNewsRaw_();
}

function refreshGlobalNewsRaw_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const formula =
    `=IMPORTFEED("https://news.google.com/rss/search?q=" & ` +
    `ENCODEURL("stock market OR financial markets OR mercati finanziari OR borsa");"";"";${NEWS_ITEM_LIMIT})`;

  writeNewsSheet_(ss, 'NEWS_GLOBAL', formula, '#E53935');
}
