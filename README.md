# Google Sheets Portfolio Template

Un modello per monitorare strumenti finanziari in Fogli Google. Dal menu **Portafoglio** puoi aggiornare quotazioni e fondamentali, serie storiche e notizie. I dati vengono da `GOOGLEFINANCE` e dai feed RSS di Google News.

## Installazione

1. [Scarica il template Excel](template/GOOGLE_FINANCE_TEMPLATE.xlsx?raw=true), caricalo su Drive e aprilo con Fogli Google. Scegli **File → Salva come foglio Google** per creare il foglio nativo.
2. Nel foglio nativo apri **File → Impostazioni**. In **Impostazioni internazionali** scegli **Italia** e mantieni attiva l’opzione **Usa sempre nomi di funzioni inglesi**. Le formule del progetto usano i nomi inglesi e il separatore `;`.
3. Apri **Estensioni → Apps Script**. Nel progetto associato crea un file di script per ciascuno dei [sei sorgenti](apps-script) e incollane il contenuto. L’editor aggiunge l’estensione `.gs`. Salva il progetto e ricarica il foglio.
4. Apri **CONFIG** e compila gli strumenti. Il modello contiene due esempi dimostrativi, di cui uno attivo.
5. Dal menu **Portafoglio**, esegui **RUN ALL (TS + Fundamentals + News)** e approva la richiesta di autorizzazione di Apps Script, se compare. Se Fogli Google mostra **Consenti accesso** per le funzioni di importazione, conferma anche quel consenso.

[Conversione da Excel](https://support.google.com/docs/answer/9331167?hl=it) · [Impostazioni di Fogli Google](https://support.google.com/docs/answer/58515?hl=it) · [Apps Script associato al foglio](https://developers.google.com/apps-script/guides/bound) · [Consenso per le importazioni](https://support.google.com/docs/answer/12188454?hl=it)

## Configurazione

Mantieni il nome `CONFIG` e l’ordine delle colonne. Usa un ticker univoco fra tutte le righe attive, anche se gli strumenti sono quotati su borse diverse. Il ticker determina il nome delle schede delle serie storiche e delle notizie.

| Colonna | Intestazione | Valore |
| --- | --- | --- |
| A | ISIN | Identificativo dello strumento. Serve per le serie storiche e per la ricerca delle notizie. |
| B | Stock Exchange | Codice del mercato per `GOOGLEFINANCE`, per esempio `NASDAQ`. |
| C | Ticker | Simbolo sul mercato indicato in B, per esempio `MSFT`. |
| D | Name | Nome visualizzato nei fondamentali. |
| E | Sparkline | Mini grafico facoltativo. |
| F | Currency | Valuta di riferimento, per esempio `USD`. In `FUNDAMENTALS` la valuta è restituita da `GOOGLEFINANCE`. |
| G | Rolling Window Volatility | Campo riservato alla finestra della volatilità. Gli script attuali non calcolano la volatilità. |
| H | Download Starting Date | Data di partenza dello storico, inserita come data di Fogli Google. |
| I | Interval | Frequenza dello storico, `DAILY` o `WEEKLY`. |
| J | Is Fund | `Y` classifica lo strumento come `FUND`, `N` come `STOCK`. |
| K | Active | `Y` include lo strumento negli aggiornamenti, `N` lo disattiva. |

Per aggiungere il mini grafico, incolla questa formula in `E2` nel foglio Google e copiala nelle righe desiderate.

```text
=IFERROR(SPARKLINE(GOOGLEFINANCE(B2&":"&C2;"close";H2;TODAY();I2));"")
```

## Aggiornamenti

| Comando nel menu Portafoglio | Scheda aggiornata | Contenuto |
| --- | --- | --- |
| Fundamentals Analysis from CONFIG | `FUNDAMENTALS` | Quotazioni e attributi per i ticker attivi, come prezzo, valuta e capitalizzazione. |
| TimeSeries Download from CONFIG | `TIME_SERIES_<Ticker>` | Serie storica da H fino a oggi, alla frequenza indicata in I. Richiede ISIN e ticker. |
| News Download from CONFIG | `NEWS_<Ticker>` | Feed di Google News cercato per ticker o ISIN. Richiede entrambi. |
| News Global | `NEWS_GLOBAL` | Feed di Google News sui mercati finanziari. |
| RUN ALL (TS + Fundamentals + News) | Tutte le precedenti | Esegue i quattro aggiornamenti in sequenza. |

Gli aggiornamenti riscrivono le aree generate. Tieni formule e annotazioni personali in schede dedicate. Se riordini le righe di `CONFIG`, rilancia l’aggiornamento per riallineare i riferimenti. Le schede di uno strumento rimosso o disattivato possono essere eliminate manualmente.

## Disponibilità dei dati

- La copertura di `GOOGLEFINANCE` dipende dal mercato, dal simbolo e dall’attributo. Una cella vuota in `FUNDAMENTALS` può indicare un attributo indisponibile. Gli attributi dei fondi comuni sono inclusi nelle intestazioni, ma attualmente risultano non supportati in Fogli Google.
- Gli storici sono consultabili nel foglio. Google ne limita la lettura tramite Apps Script e l’API di Fogli Google. Se lo storico giornaliero supera lo spazio disponibile, aggiungi righe in fondo alla scheda `TIME_SERIES_<Ticker>`.
- I feed possono impiegare qualche minuto a popolarsi. Il numero di articoli e la loro pertinenza dipendono dal feed e dalla query.

[GOOGLEFINANCE](https://support.google.com/docs/answer/3093281?hl=it) · [IMPORTFEED](https://support.google.com/docs/answer/3093337?hl=it)
