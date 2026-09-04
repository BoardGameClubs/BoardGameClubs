---
layout: default
title: "Licenza"
description: "Come è licenziato Board Game Clubs: MIT con restrizione Commons Clause per il codice e CC BY 4.0 per i dati di club ed eventi."
permalink: /it/licence/
---

<div class="content-page" markdown="1">

# Licenza

_Ultimo aggiornamento: {{ site.time | date: "%-d %B %Y" }}_

Board Game Clubs è open source. Questa pagina riassume la licenza in parole semplici. Il testo completo e legalmente vincolante si trova nel [file LICENSE]({% if site.repository %}https://github.com/{{ site.repository }}/blob/main/LICENSE{% endif %}) del repository. In caso di discrepanze prevale il file LICENSE.

## In breve

Il codice sorgente del sito è rilasciato sotto **MIT License** con una clausola aggiuntiva **Commons Clause**. In chiaro:

- **Puoi** usarlo, copiarlo, modificarlo, gestire la tua versione e condividere le tue modifiche.
- **Non puoi** venderlo come prodotto o servizio. Ospitarlo a pagamento o farsi pagare per gestirlo per altri non è permesso.
- **Devi** mantenere l'avviso di copyright e di licenza in tutte le copie o opere derivate.
- **Nessuna garanzia.** Il software è fornito "così com'è".
- **I dati di club ed eventi sono licenziati separatamente.** Sono sotto [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.it): chiunque può riutilizzarli, purché citi BoardGameClubs.org come fonte.

## Cosa permette la MIT License

La MIT License è una delle licenze open source più permissive. Sotto di essa puoi:

- Usare il software per qualunque scopo.
- Copiarlo e distribuirlo.
- Modificarlo e distribuirne versioni modificate.
- Includerlo in progetti più grandi (anche commerciali, soggetto alla Commons Clause qui sotto).
- Sublicenziarlo.

Unica condizione: l'avviso di copyright e il testo della licenza devono accompagnare ogni copia o parte sostanziale del software.

## Cosa limita la Commons Clause

La Commons Clause aggiunge **una** restrizione alla MIT License: non puoi **vendere** il software.

Nelle parole della licenza, "vendere" significa usare i diritti concessi dalla MIT License per fornire il software ad altri **a pagamento o per altro corrispettivo**, incluso ospitarlo per clienti paganti o vendere consulenza/supporto il cui valore deriva sostanzialmente da questo software.

In pratica significa:

- Gestire una tua copia gratuita della directory per la community locale: va bene.
- Forkare il codice e proporre miglioramenti: va bene.
- Integrare piccole parti in un progetto più grande: va bene.
- Mettere in piedi una versione ospitata a pagamento di questa directory e far pagare gli utenti o i club per essere inseriti: non è permesso senza autorizzazione.

La Commons Clause è un [testo standardizzato e pubblicato](https://commonsclause.com/), curato da Fossa. È volutamente di portata stretta: limita solo la vendita, non l'uso o la modifica.

## Dati di club ed eventi

Le voci di club ed eventi (i file in `_clubs/` e `_events/`, e i feed JSON su `/api/clubs.json` e `/api/events.json`) sono contribuite dalla community e licenziate separatamente dal codice, sotto [Creative Commons Attribuzione 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.it).

Questo significa che puoi copiare, condividere e adattare le voci per qualsiasi scopo, anche commerciale, a condizione di:

- **Citare la fonte.** Indica BoardGameClubs.org come fonte e inserisci un link al sito.
- **Linkare la licenza.** Rimanda a CC BY 4.0.
- **Segnalare le modifiche.** Indica se hai modificato i dati.

Attribuzione suggerita: "Dati di club ed eventi da [BoardGameClubs.org](https://boardgameclubs.org), licenziati sotto [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.it)."

La Commons Clause di cui sopra si applica solo al software. Non limita l'uso dei dati.

Inviando o modificando una voce, tramite modulo GitHub, pull request o qualsiasi altra via, accetti che il tuo contributo sia pubblicato sotto CC BY 4.0.

I loghi di club ed eventi in `assets/images/` appartengono ai rispettivi club e organizzatori e non sono coperti da nessuna delle due licenze.

Se sei un'organizzatrice o un organizzatore di un club e vuoi aggiornare o rimuovere la tua voce, vedi la [pagina dei contributi]({{ "/it/contribute/" | relative_url }}) o apri un issue su GitHub.

## Software e asset di terze parti

Il sito usa diverse librerie open source di terze parti (Leaflet, Leaflet.MarkerCluster, Lucide icons, Jekyll e altre). Ciascuna è usata secondo la propria licenza. Trovi l'elenco completo nei [file dei pacchetti del repository]({% if site.repository %}https://github.com/{{ site.repository }}{% endif %}).

I tile della mappa sono forniti da [CARTO](https://carto.com/), i dati sono &copy; [contributori di OpenStreetMap](https://www.openstreetmap.org/copyright).

## Nessuna garanzia

Il software è fornito **"così com'è"**, senza garanzie esplicite o implicite di alcun tipo. Autori e titolari del copyright non sono responsabili di reclami o danni derivanti dall'uso del software. La clausola di esclusione completa è nel [file LICENSE]({% if site.repository %}https://github.com/{{ site.repository }}/blob/main/LICENSE{% endif %}).

## Contatti

Per domande sulla licenza, o se vuoi usare il software in un modo che la Commons Clause potrebbe limitare, [apri un issue su GitHub]({% if site.repository %}https://github.com/{{ site.repository }}/issues{% endif %}).

</div>
