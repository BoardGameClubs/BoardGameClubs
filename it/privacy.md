---
layout: default
title: "Privacy"
description: "Come Board Game Clubs gestisce i tuoi dati — in breve: non raccogliamo informazioni personali, non usiamo cookie e non vendiamo nulla."
permalink: /it/privacy/
---

<div class="content-page" markdown="1">

# Informativa sulla privacy

_Ultimo aggiornamento: {{ site.time | date: "%-d %B %Y" }}_

Board Game Clubs è una directory gratuita, gestita dalla community. Abbiamo progettato il sito in modo da raccogliere il minor numero possibile di informazioni su di te.

## In breve

- Non ti chiediamo di creare un account.
- Non usiamo cookie per tracciamento o pubblicità.
- Non vendiamo, condividiamo o noleggiamo dati.
- Usiamo uno strumento di analisi rispettoso della privacy che non identifica i singoli visitatori.
- Alcune funzionalità (ricerca per CAP, "Usa la mia posizione") inviano dati a servizi terzi — ma solo se le usi attivamente.

## Cosa raccogliamo

### Statistiche d'uso anonime

Usiamo [GoatCounter](https://www.goatcounter.com/) per contare le visite al sito. GoatCounter è un servizio di analisi open source e rispettoso della privacy che:

- **non** usa cookie.
- **non** conserva indirizzi IP (solo un hash temporaneo e salato che ruota ogni giorno per deduplicare le visualizzazioni).
- **non** ti traccia attraverso altri siti.
- **non** vende o condivide i dati.

Cosa vediamo: conteggi anonimi delle pagine visualizzate, referrer e categorie generiche di dispositivo/browser.

Tutti i dettagli nell'[informativa sulla privacy di GoatCounter](https://www.goatcounter.com/help/privacy).

### Log del server

Il sito è ospitato su [GitHub Pages](https://docs.github.com/en/pages). GitHub può registrare log webserver di base (es. indirizzi IP e timestamp delle richieste) per prevenzione abusi e sicurezza. Vedi l'[informativa privacy di GitHub](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) per i dettagli.

## Funzionalità opzionali con servizi terzi

Le funzionalità seguenti girano solo se le usi attivamente.

### Ricerca per CAP

Se inserisci un CAP nel campo di ricerca, lo inviamo a [Nominatim](https://nominatim.openstreetmap.org/) (il servizio di geocoding di OpenStreetMap) per ottenere le coordinate e ordinare i club per distanza. Non salviamo il CAP sui nostri server.

### "Usa la mia posizione"

Se clicchi "Usa la mia posizione", il browser chiede la tua autorizzazione e (se concessa) fornisce alla pagina le tue coordinate approssimative, così possiamo ordinare i club per distanza. La tua posizione viene usata solo nel tuo browser — **non** viene inviata ai nostri server né a terze parti. Viene cancellata quando chiudi o ricarichi la pagina.

### Tile della mappa

La mappa usa tile di [CARTO](https://carto.com/) e dati di [OpenStreetMap](https://www.openstreetmap.org/). Quando la mappa si carica, il tuo browser scarica le immagini dei tile direttamente da CARTO, che può registrare le normali informazioni delle richieste web. Vedi l'[informativa di CARTO](https://carto.com/privacy/) e l'[informativa di OpenStreetMap](https://wiki.osmfoundation.org/wiki/Privacy_Policy).

### Font e script incorporati

Il sito carica un piccolo numero di asset di terze parti direttamente dai CDN (Google Fonts per la tipografia, unpkg per le librerie di mappa e icone). Il browser fa richieste HTTP standard a questi servizi quando carica la pagina.

## Minori

Il sito è una directory pubblica e non è rivolta a minori di 13 anni. Non raccogliamo consapevolmente informazioni da bambini.

## Modifiche all'informativa

Se cambia il modo in cui il sito tratta i dati, aggiorneremo questa pagina e la data in alto.

## Contatti

Il sito è gestito da volontari. Per domande sulla privacy, [apri un issue su GitHub](https://github.com/BoardGameClubs/BoardGameClubs/issues) o contattaci tramite la pagina dei contributi.

</div>
