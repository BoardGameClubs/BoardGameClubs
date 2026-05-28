---
layout: default
title: "Add Your Board Game Club to Our Directory"
description: "Submit your board game club to Board Game Clubs. Our free, community-maintained directory helps people find board game clubs near them across the UK and Germany."
permalink: /contribute/
---

<div class="content-page" markdown="1">

# Add Your Board Game Club

Board Game Clubs is community-maintained and hosted on GitHub. Anyone can add a new club or update existing information.

## Submit via our form

The easiest way to add your club is to fill in our form on GitHub. No technical knowledge required - just fill in the details and we'll do the rest.

<div class="contribute-actions">
  <a href="https://github.com/BoardGameClubs/BoardGameClubs_Web/issues/new?template=add-club.yml" class="contribute-btn contribute-btn--primary">+ Add a Club</a>
  <a href="https://github.com/BoardGameClubs/BoardGameClubs_Web/issues/new?template=edit-club.yml" class="contribute-btn contribute-btn--secondary">Edit a Club</a>
</div>

## Adding a Club via Pull Request

If you're comfortable with GitHub, you can add a club directly:

### 1. Create a new file

[Create a new file](https://github.com/BoardGameClubs/BoardGameClubs_Web/new/main/_clubs) in the `_clubs/` folder on GitHub. Name it using the format `your-club-name.md` (lowercase, hyphens instead of spaces). For German clubs, use ASCII-folded names: `ä→ae`, `ö→oe`, `ü→ue`, `ß→ss` (e.g. `spieletreff-muenchen.md`).

### 2. Copy this template

Paste the following into your new file and fill in the details. UK clubs omit the `permalink:` line; German clubs include it.

```yaml
---
country: "UK"          # "UK" or "DE"
name: "Your Club Name"
type: ["Board Games"]
days: ["Thursday"]
time: "7:00pm - 10:00pm"
frequency: "Weekly"
location:
  name: "Venue Name"
  address: "Full Address, Town, Postcode"
  lat: 53.0000
  lng: -1.0000
cost: "Free"
age_restriction: ""
image: ""
website: ""
meetup: ""
facebook: ""
discord: ""
bgg: ""
description: >-
  A short description of your club. What games do you play?
  Are newcomers welcome? Any other useful info.
---
```

For a German club, also add:

```yaml
permalink: /de/clubs/your-club-slug/
```

### 3. Fill in the details

| Field | Description |
|-------|-------------|
| `country` | `"UK"` or `"DE"` (ISO 3166-1 alpha-2) |
| `name` | Your club's full name |
| `type` | Array of types, e.g. `["Board Games"]`. Options: "Board Games", "RPG", "Wargames", "TCG", "BOTC" |
| `days` | Array of days you meet, e.g. `["Thursday"]` or `["Monday", "Friday"]` |
| `time` | When you meet, e.g. "7:00pm - 10:00pm" |
| `frequency` | "Weekly", "Fortnightly", "Monthly", or "Ad-hoc" |
| `location` | Venue name, full address (with postcode/PLZ), and coordinates |
| `cost` | "Free" or a money amount, e.g. "£2", "€3", "£5 (First Session Free)" |
| `age_restriction` | Any age restriction, e.g. "18+". Leave empty if none |
| `image` | A URL or filename in `assets/images/clubs/` (see [step 5](#5-adding-a-logo) below) |
| `website` | Link to your club's website |
| `meetup` | Link to your club's Meetup group |
| `facebook` | Link to your club's Facebook page or group |
| `discord` | Discord invite link |
| `bgg` | BoardGameGeek guild or group link |

### 4. Find your coordinates

To get the latitude and longitude for your venue:

1. Go to [OpenStreetMap](https://www.openstreetmap.org)
2. Search for your venue's address
3. Right-click on the map and select "Show address"
4. The coordinates will appear in the URL bar (lat and lng)

### 5. Adding a logo

You can add a logo or image for your club:

1. Upload your image to the `assets/images/clubs/` folder in the repository (PNG or JPG, ideally square and under 200KB)
2. Set the `image` field in your club file to the filename, e.g. `image: "your-club-logo.png"`

Alternatively, you can use a direct URL to an image hosted elsewhere, e.g. `image: "https://example.com/logo.png"`

### 6. Submit a pull request

Commit your file and [open a pull request](https://github.com/BoardGameClubs/BoardGameClubs_Web/pulls). We'll review it and merge it in.

## Updating an Existing Club

Find the club's file in the [`_clubs/` folder on GitHub](https://github.com/BoardGameClubs/BoardGameClubs_Web/tree/main/_clubs), make your changes, and submit a pull request. Or just **[open an edit request](https://github.com/BoardGameClubs/BoardGameClubs_Web/issues/new?template=edit-club.yml)** and we'll update it for you.

</div>
