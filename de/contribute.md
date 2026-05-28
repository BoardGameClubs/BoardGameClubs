---
layout: default
title: "Füge deinen Brettspielclub zu unserem Verzeichnis hinzu"
description: "Trage deinen Brettspielclub bei Board Game Clubs ein. Unser kostenloses, von der Community gepflegtes Verzeichnis hilft Menschen, Brettspielclubs in ihrer Nähe in ganz Europa zu finden."
permalink: /de/contribute/
---

<div class="content-page" markdown="1">

# Brettspielclub hinzufügen

Board Game Clubs wird von der Community gepflegt und auf GitHub gehostet. Jede:r kann einen neuen Club hinzufügen oder bestehende Informationen aktualisieren.

## Über unser Formular einreichen

Am einfachsten fügst du deinen Club über unser Formular auf GitHub hinzu. Keine technischen Kenntnisse nötig — fülle einfach die Details aus, den Rest erledigen wir.

<div class="contribute-actions">
  <a href="https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=add-club.yml" class="contribute-btn contribute-btn--primary">+ Club hinzufügen</a>
  <a href="https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=edit-club.yml" class="contribute-btn contribute-btn--secondary">Club bearbeiten</a>
</div>

## Club per Pull Request hinzufügen

Wenn du mit GitHub vertraut bist, kannst du einen Club auch direkt hinzufügen:

### 1. Neue Datei erstellen

[Erstelle eine neue Datei](https://github.com/BoardGameClubs/BoardGameClubs/new/main/_clubs) im Ordner `_clubs/<land>/` auf GitHub, wobei `<land>` der ISO-3166-1-alpha-2-Code in Kleinbuchstaben ist (`gb`, `de`, `at`, `ch`, `nl`, `be`, `it`, `pl`, `fr`, `dk`, `es`). Benenne die Datei nach dem Schema `dein-club-name.md` (Kleinbuchstaben, Bindestriche statt Leerzeichen). Für Namen mit Sonderzeichen verwende ASCII-Schreibweise: `ä→ae`, `ö→oe`, `ü→ue`, `ß→ss`, `é→e` usw. (z. B. `spieletreff-muenchen.md`).

### 2. Vorlage kopieren

Füge das Folgende in deine neue Datei ein und ergänze die Details. Setze `country` und `permalink` passend zum Ordner.

```yaml
---
country: "DE"          # ISO 3166-1 alpha-2: GB, DE, AT, CH, NL, BE, IT, PL, FR, DK, ES
permalink: /de/clubs/dein-club-name/   # Für GB: /clubs/dein-club-name/
name: "Dein Clubname"
type: ["Board Games"]
days: ["Donnerstag"]
time: "19:00 - 22:00"
frequency: "Weekly"
location:
  name: "Veranstaltungsort"
  address: "Vollständige Adresse, PLZ, Stadt"
  lat: 52.5000
  lng: 13.4000
cost: "Free"
age_restriction: ""
image: ""
website: ""
meetup: ""
facebook: ""
discord: ""
bgg: ""
description: >-
  Eine kurze Beschreibung deines Clubs. Welche Spiele spielt ihr?
  Sind Neulinge willkommen? Weitere nützliche Infos.
---
```

Britische Clubs verwenden `permalink: /clubs/dein-club-name/`. Clubs in allen anderen Ländern verwenden `/<land>/clubs/dein-club-name/`, z. B. `/de/clubs/...`, `/at/clubs/...`, `/fr/clubs/...`.

### 3. Felder ausfüllen

| Feld | Beschreibung |
|------|--------------|
| `country` | ISO-3166-1-alpha-2-Code: `GB`, `DE`, `AT`, `CH`, `NL`, `BE`, `IT`, `PL`, `FR`, `DK`, `ES` |
| `permalink` | `/clubs/dein-club-slug/` für GB; `/<land>/clubs/dein-club-slug/` für alle anderen |
| `name` | Vollständiger Clubname |
| `type` | Array der Typen, z. B. `["Board Games"]`. Optionen: "Board Games", "RPG", "Wargames", "TCG", "BOTC" |
| `days` | Treffen-Wochentage (Englisch), z. B. `["Thursday"]` oder `["Monday", "Friday"]` |
| `time` | Treffenzeit, z. B. "19:00 - 22:00" |
| `frequency` | "Weekly", "Fortnightly", "Monthly" oder "Ad-hoc" |
| `location` | Veranstaltungsort, vollständige Adresse mit PLZ, Koordinaten |
| `cost` | "Free" oder ein Betrag in lokaler Währung, z. B. "€3", "£2", "CHF 5", "kr 20", "zł 10", "€5 (erstes Treffen kostenlos)" |
| `age_restriction` | Altersbeschränkung, z. B. "18+". Leer lassen falls keine |
| `image` | URL oder Dateiname in `assets/images/clubs/` |
| `website` | Link zur Clubwebsite |
| `meetup` | Link zur Meetup-Gruppe |
| `facebook` | Link zur Facebook-Seite oder -Gruppe |
| `discord` | Discord-Einladungslink |
| `bgg` | BoardGameGeek-Gilden- oder -Gruppenlink |
| `description` | Freitext. Einfaches Markdown wird unterstützt — Leerzeilen trennen Absätze, Zeilen mit `-` werden zur Aufzählung. Siehe Beispiele unten. |

### Beschreibung formatieren

Das Feld `description` wird als Markdown gerendert. Du kannst also Absätze und Aufzählungen verwenden. Achte darauf, dass jede Zeile die zwei Leerzeichen Einrückung des YAML-Block-Scalars behält — sonst meckert Jekyll.

```yaml
description: |
  Wir sind eine offene Gruppe und treffen uns im Zentrum von München.
  Neulinge sind jederzeit willkommen, Regeln werden erklärt.

  Ein typischer Abend:

  - Ein mittleres Euro-Spiel zum Einstieg
  - Später leichtere Karten- oder Partyspiele
  - Genug Pausen und Zeit zum Quatschen
```

Die `>-`-Schreibweise aus der Vorlage fasst Zeilenumbrüche zu einem Absatz zusammen — gut für eine kurze Beschreibung. Wechsle zu `|` (wie oben), wenn Absätze und Listen erhalten bleiben sollen.

### 4. Koordinaten finden

So findest du Breitengrad und Längengrad für deinen Veranstaltungsort:

1. Öffne [OpenStreetMap](https://www.openstreetmap.org)
2. Suche nach der Adresse
3. Rechtsklick auf die Karte → „Adresse anzeigen"
4. Die Koordinaten erscheinen in der URL (lat und lng)

### 5. Logo hinzufügen

Du kannst ein Logo oder Bild für deinen Club hinzufügen:

1. Lade dein Bild in `assets/images/clubs/` im Repository hoch (PNG oder JPG, idealerweise quadratisch und unter 200 KB)
2. Setze im Club-File das Feld `image` auf den Dateinamen, z. B. `image: "dein-club-logo.png"`

Alternativ kannst du eine direkte URL zu einem extern gehosteten Bild verwenden, z. B. `image: "https://example.com/logo.png"`.

### 6. Pull Request einreichen

Committe deine Datei und [öffne einen Pull Request](https://github.com/BoardGameClubs/BoardGameClubs/pulls). Wir prüfen ihn und übernehmen ihn.

## Dein Land ist nicht dabei?

Wir listen derzeit Clubs in Großbritannien, Deutschland, Österreich, der Schweiz, den Niederlanden, Belgien, Italien, Polen, Frankreich, Dänemark und Spanien. Ist dein Club woanders, [öffne ein Issue](https://github.com/BoardGameClubs/BoardGameClubs/issues/new) — ein neues Land hinzuzufügen ist eine kleine Änderung und wir machen das gerne.

## Bestehenden Club aktualisieren

Suche die Datei des Clubs im [Ordner `_clubs/` auf GitHub](https://github.com/BoardGameClubs/BoardGameClubs/tree/main/_clubs), nimm deine Änderungen vor und reiche einen Pull Request ein. Oder **[öffne einfach eine Änderungsanfrage](https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=edit-club.yml)**, und wir aktualisieren es für dich.

</div>
