/** @OnlyCurrentDoc */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Portafoglio')
    .addItem('RUN ALL (TS + Fundamentals + News)', 'runAll')
    .addSeparator()
    .addItem('TimeSeries Download from CONFIG', 'refreshTimeSeriesFromConfig')
    .addItem('Fundamentals Analysis from CONFIG', 'refreshFundamentalsFromConfig')
    .addItem('News Download from CONFIG', 'refreshNewsFromConfig')
    .addItem('News Global', 'refreshGlobalNewsRaw')
    .addToUi();
}

function runAll() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    ss.toast('Step 1/4: Fundamentals da CONFIG...', 'Portafoglio', 5);
    refreshFundamentalsFromConfig();

    ss.toast('Step 2/4: Time Series da CONFIG...', 'Portafoglio', 5);
    refreshTimeSeriesFromConfig();

    ss.toast('Step 3/4: News per singolo strumento...', 'Portafoglio', 5);
    refreshNewsFromConfig();

    ss.toast('Step 4/4: News globali di mercato...', 'Portafoglio', 5);
    refreshGlobalNewsRaw_();

    ss.toast('RunAll completato ✅', 'Portafoglio', 5);
  } catch (error) {
    ss.toast('Errore in runAll: ' + error, 'Portafoglio - Errore', 10);
    throw error;
  }
}
