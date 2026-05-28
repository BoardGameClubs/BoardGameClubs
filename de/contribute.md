---
layout: default
title: "Füge deinen Brettspielclub zu unserem Verzeichnis hinzu"
description: "Trage deinen Brettspielclub bei Board Game Clubs ein. Unser kostenloses, von der Community gepflegtes Verzeichnis hilft Menschen, Brettspielclubs in ihrer Nähe in Deutschland zu finden."
permalink: /de/contribute/
---

<div class="content-page" markdown="1">

# Brettspielclub hinzufügen

Board Game Clubs wird von der Community gepflegt und auf GitHub gehostet. Jede:r kann einen neuen Club hinzufügen oder bestehende Informationen aktualisieren.

## Über unser Formular einreichen

Am einfachsten fügst du deinen Club über unser Formular auf GitHub hinzu. Keine technischen Kenntnisse nötig — fülle einfach die Details aus, den Rest erledigen wir.

<div class="contribute-actions">
  <a href="https://github.com/BoardGameClubs/BoardGameClubs_Web/issues/new?template=add-club.yml" class="contribute-btn contribute-btn--primary">+ Club hinzufügen</a>
  <a href="https://github.com/BoardGameClubs/BoardGameClubs_Web/issues/new?template=edit-club.yml" class="contribute-btn contribute-btn--secondary">Club bearbeiten</a>
</div>

## Club per Pull Request hinzufügen

Wenn du mit GitHub vertraut bist, kannst du einen Club auch direkt hinzufügen:

### 1. Neue Datei erstellen

[Erstelle eine neue Datei](https://github.com/BoardGameClubs/BoardGameClubs_Web/new/main/_clubs) im Ordner `_clubs/` auf GitHub. Benenne sie nach dem Schema `dein-club-name.md` (Kleinbuchstaben, Bindestriche statt Leerzeichen). Für deutsche Clubs benutze ASCII-Schreibweise: `ä→ae`, `ö→oe`, `ü→ue`, `ß→ss` (z. B. `spieletreff-muenchen.md`).

### 2. Vorlage kopieren

Füge das Folgende in deine neue Datei ein und ergänze die Details:

```yaml
---
country: "DE"
permalink: /de/clubs/dein-club-name/
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

### 3. Felder ausfüllen

| Feld | Beschreibung |
|------|--------------|
| `country` | `"DE"` für Deutschland (ISO 3166-1 alpha-2) |
| `permalink` | `/de/clubs/dein-club-slug/` (muss mit dem Dateinamen übereinstimmen) |
| `name` | Vollständiger Clubname |
| `type` | Array der Typen, z. B. `["Board Games"]`. Optionen: "Board Games", "RPG", "Wargames", "TCG", "BOTC" |
| `days` | Treffen-Wochentage (Englisch), z. B. `["Thursday"]` oder `["Monday", "Friday"]` |
| `time` | Treffenzeit, z. B. "19:00 - 22:00" |
| `frequency` | "Weekly", "Fortnightly", "Monthly" oder "Ad-hoc" |
| `location` | Veranstaltungsort, vollständige Adresse mit PLZ, Koordinaten |
| `cost` | "Free" oder ein Betrag, z. B. "€3", "€5 (erstes Treffen kostenlos)" |
| `age_restriction` | Altersbeschränkung, z. B. "18+". Leer lassen falls keine |
| `image` | URL oder Dateiname in `assets/images/clubs/` |
| `website` | Link zur Clubwebsite |
| `meetup` | Link zur Meetup-Gruppe |
| `facebook` | Link zur Facebook-Seite oder -Gruppe |
| `discord` | Discord-Einladungslink |
| `bgg` | BoardGameGeek-Gilden- oder -Gruppenlink |

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

Committe deine Datei und [öffne einen Pull Request](https://github.com/BoardGameClubs/BoardGameClubs_Web/pulls). Wir prüfen ihn und übernehmen ihn.

## Bestehenden Club aktualisieren

Suche die Datei des Clubs im [Ordner `_clubs/` auf GitHub](https://github.com/BoardGameClubs/BoardGameClubs_Web/tree/main/_clubs), nimm deine Änderungen vor und reiche einen Pull Request ein. Oder **[öffne einfach eine Änderungsanfrage](https://github.com/BoardGameClubs/BoardGameClubs_Web/issues/new?template=edit-club.yml)**, und wir aktualisieren es für dich.

</div>
