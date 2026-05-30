---
layout: default
title: "Aggiungi il tuo club di giochi da tavolo alla nostra directory"
description: "Inserisci il tuo club di giochi da tavolo su Board Game Clubs. La nostra directory gratuita, gestita dalla community, aiuta le persone a trovare club di giochi da tavolo vicino a loro in tutto il mondo."
permalink: /it/contribute/
---

<div class="content-page" markdown="1">

# Aggiungi un club di giochi da tavolo

Board Game Clubs è gestito dalla community e ospitato su GitHub. Chiunque può aggiungere un nuovo club o aggiornare informazioni esistenti.

## Invia tramite il nostro modulo

Il modo più semplice per aggiungere il tuo club è il modulo su GitHub. Non servono competenze tecniche, basta compilare i dettagli, al resto pensiamo noi.

<div class="contribute-actions">
  <a href="https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=add-club.yml" class="contribute-btn contribute-btn--primary">+ Aggiungi un club</a>
  <a href="https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=edit-club.yml" class="contribute-btn contribute-btn--secondary">Modifica un club</a>
</div>

## Aggiungere un club tramite pull request

Se hai dimestichezza con GitHub, puoi aggiungere un club direttamente:

### 1. Crea un nuovo file

[Crea un nuovo file](https://github.com/BoardGameClubs/BoardGameClubs/new/main/_clubs) nella cartella `_clubs/<paese>/` su GitHub, dove `<paese>` è il codice ISO 3166-1 alpha-2 in minuscolo (`gb`, `de`, `at`, `ch`, `nl`, `be`, `it`, `pl`, `fr`, `dk`, `es`). Nomina il file con lo schema `nome-del-tuo-club.md` (minuscolo, trattini al posto degli spazi). Per nomi con caratteri speciali usa l'equivalente ASCII: `à→a`, `è→e`, `ò→o`, `ù→u` ecc. (per es. `circolo-gioco-milano.md`).

### 2. Copia il modello

Incolla quanto segue nel tuo nuovo file e compila i dettagli. Imposta `country` e `permalink` in modo coerente con la cartella.

```yaml
---
country: "IT"          # ISO 3166-1 alpha-2: GB, DE, AT, CH, NL, BE, IT, PL, FR, DK, ES
permalink: /it/clubs/nome-del-tuo-club/   # Per GB: /clubs/nome-del-tuo-club/
name: "Nome del tuo club"
type: ["Board Games"]
days: ["Thursday"]
time: "19:00 - 22:00"
frequency: "Weekly"
location:
  name: "Sede"
  address: "Indirizzo completo, CAP, città"
  lat: 41.9000
  lng: 12.5000
cost: "Free"
age_restriction: ""
image: ""
website: ""
meetup: ""
facebook: ""
discord: ""
bgg: ""
description: >-
  Una breve descrizione del tuo club. Che giochi giocate?
  I nuovi arrivati sono i benvenuti? Altre informazioni utili.
---
```

I club britannici usano `permalink: /clubs/nome-del-club/`. I club di tutti gli altri paesi usano `/<paese>/clubs/nome-del-club/`, ad esempio `/it/clubs/...`, `/de/clubs/...`, `/fr/clubs/...`.

### 3. Compila i campi

| Campo | Descrizione |
|------|-------------|
| `country` | Codice ISO 3166-1 alpha-2: `GB`, `DE`, `AT`, `CH`, `NL`, `BE`, `IT`, `PL`, `FR`, `DK`, `ES` |
| `permalink` | `/clubs/slug-del-club/` per GB; `/<paese>/clubs/slug-del-club/` per tutti gli altri |
| `name` | Nome completo del club |
| `type` | Array dei tipi, es. `["Board Games"]`. Opzioni: "Board Games", "RPG", "Wargames", "TCG", "BOTC" |
| `days` | Giorni di incontro (in inglese), es. `["Thursday"]` o `["Monday", "Friday"]` |
| `time` | Orario dell'incontro, es. "19:00 - 22:00" |
| `frequency` | "Weekly", "Fortnightly", "Monthly" o "Ad-hoc" |
| `location` | Sede, indirizzo completo con CAP, coordinate |
| `cost` | "Free" oppure un importo nella valuta locale, es. "€3", "£2", "CHF 5", "kr 20", "zł 10", "€5 (primo incontro gratis)" |
| `age_restriction` | Limite di età, es. "18+". Lascia vuoto se non c'è |
| `image` | URL o nome file in `assets/images/clubs/` |
| `website` | Link al sito del club |
| `meetup` | Link al gruppo Meetup |
| `facebook` | Link alla pagina o al gruppo Facebook |
| `discord` | Link di invito Discord |
| `bgg` | Link alla gilda o al gruppo BoardGameGeek |
| `description` | Testo libero. È supportato il Markdown semplice: righe vuote separano i paragrafi, righe che iniziano con `-` diventano elenchi. Vedi gli esempi sotto. |

### Formattare la descrizione

Il campo `description` viene reso come Markdown, quindi puoi usare paragrafi ed elenchi. Fai attenzione a mantenere l'indentazione di due spazi del block scalar YAML, altrimenti Jekyll si lamenta.

```yaml
description: |
  Siamo un gruppo aperto e ci troviamo in centro a Milano.
  I nuovi arrivati sono i benvenuti, spieghiamo le regole.

  Una serata tipica:

  - Un eurogame medio per iniziare
  - Più tardi giochi di carte o party game leggeri
  - Pause e tempo per chiacchierare

```

La notazione `>-` del modello unisce le righe in un unico paragrafo, va bene per una breve descrizione. Passa a `|` (come sopra) se vuoi mantenere paragrafi ed elenchi.

### 4. Trovare le coordinate

Ecco come trovare latitudine e longitudine della tua sede:

1. Apri [OpenStreetMap](https://www.openstreetmap.org)
2. Cerca l'indirizzo
3. Tasto destro sulla mappa → "Mostra indirizzo"
4. Le coordinate appaiono nell'URL (lat e lng)

### 5. Aggiungere un logo

Puoi aggiungere un logo o un'immagine per il tuo club:

1. Carica l'immagine in `assets/images/clubs/` nel repository (PNG o JPG, idealmente quadrata e sotto i 200 KB)
2. Nel file del club, imposta il campo `image` sul nome del file, es. `image: "logo-del-tuo-club.png"`

In alternativa puoi usare un URL diretto a un'immagine ospitata altrove, es. `image: "https://example.com/logo.png"`.

### 6. Apri una pull request

Esegui il commit del tuo file e [apri una pull request](https://github.com/BoardGameClubs/BoardGameClubs/pulls). La esamineremo e la integreremo.

## Il tuo paese non è nell'elenco?

Al momento elenchiamo club in Regno Unito, Germania, Austria, Svizzera, Paesi Bassi, Belgio, Italia, Polonia, Francia, Danimarca e Spagna. Se il tuo club è altrove, [apri un issue](https://github.com/BoardGameClubs/BoardGameClubs/issues/new). Aggiungere un nuovo paese è una modifica piccola e siamo felici di farla.

## Aggiornare un club esistente

Trova il file del club nella [cartella `_clubs/` su GitHub](https://github.com/BoardGameClubs/BoardGameClubs/tree/main/_clubs), fai le tue modifiche e apri una pull request. Oppure **[apri direttamente una richiesta di modifica](https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=edit-club.yml)** e lo aggiorneremo noi.

</div>
