---
layout: default
title: "Add a Club or Event"
description: "Add your board game club or event to Board Game Clubs. Our free, community-maintained directory helps people find board game clubs and events near them, anywhere in the world."
permalink: /contribute/
---

<div class="content-page" markdown="1">

# Add a Club or Event

Board Game Clubs is community-maintained and hosted on GitHub. Anyone can add a club or event, or update an existing listing.

## Submit via our form

The easiest way to add your club is to fill in our form on GitHub. No technical knowledge required - just fill in the details and we'll do the rest.

<div class="contribute-actions">
  <a href="https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=add-club.yml" class="contribute-btn contribute-btn--primary">+ Add a Club</a>
  <a href="https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=edit-club.yml" class="contribute-btn contribute-btn--secondary">Edit a Club</a>
  <a href="https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=add-event.yml" class="contribute-btn contribute-btn--secondary">Add an Event</a>
</div>

## Prefer a pull request?

If you're comfortable with GitHub, you can add a club or event directly. Expand a section for the step-by-step guide.

<details class="reveal" markdown="1">
<summary>Adding a club</summary>

### 1. Create a new file

[Create a new file](https://github.com/BoardGameClubs/BoardGameClubs/new/main/_clubs) in the `_clubs/<country>/` folder on GitHub, where `<country>` is your ISO 3166-1 alpha-2 code in lowercase (matching one of the existing folders in `_clubs/`). Name the file using the format `your-club-name.md` (lowercase, hyphens instead of spaces). For names with diacritics, use ASCII-folded versions: `ä→ae`, `ö→oe`, `ü→ue`, `ß→ss`, `é→e`, etc. (e.g. `spieletreff-muenchen.md`).

### 2. Copy this template

Paste the following into your new file and fill in the details. Set `country` to match the folder.

```yaml
---
country: "GB"          # ISO 3166-1 alpha-2, uppercase, matching the folder
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

Do not set `permalink`. The club's page is generated at `/clubs/<filename>/` automatically, with a copy under each language prefix (`/de/clubs/...`, `/fr/clubs/...`, and so on).

### 3. Fill in the details

| Field | Description |
|-------|-------------|
| `country` | ISO 3166-1 alpha-2 code, uppercase, matching the folder |
| `name` | Your club's full name |
| `type` | Array of types, e.g. `["Board Games"]`. Options: "Board Games", "RPG", "Wargames", "TCG", "BOTC" |
| `days` | Array of days you meet, e.g. `["Thursday"]` or `["Monday", "Friday"]` |
| `time` | When you meet, e.g. "7:00pm - 10:00pm" |
| `frequency` | "Weekly", "Fortnightly", "Monthly", or "Ad-hoc" |
| `location` | Venue name, full address (with postcode), and coordinates |
| `cost` | "Free" or a money amount in your local currency, e.g. "£2", "€3", "CHF 5", "kr 20", "zł 10", "£5 (First Session Free)" |
| `age_restriction` | Any age restriction, e.g. "18+". Leave empty if none |
| `image` | A URL or filename in `assets/images/clubs/` (see [step 5](#5-adding-a-logo) below) |
| `website` | Link to your club's website |
| `meetup` | Link to your club's Meetup group |
| `facebook` | Link to your club's Facebook page or group |
| `discord` | Discord invite link |
| `bgg` | BoardGameGeek guild or group link |
| `description` | Free text. Basic Markdown is supported: blank lines split paragraphs, and lines starting with `-` become a bulleted list. See examples below. |

### Formatting the description

The `description` field is rendered as Markdown, so you can use paragraphs and bulleted lists. Keep the YAML block-scalar indentation (two spaces) on every line. That's what keeps Jekyll happy.

```yaml
description: |
  We're a friendly group meeting in central Leeds. Newcomers are always
  welcome and rules are explained.

  Typical evening includes:

  - A medium-weight Euro to kick things off
  - Lighter card or party games later
  - Plenty of breaks and chat
```

The `>-` style from the template collapses line breaks into one paragraph, useful for a single short description. Switch to `|` (as above) when you want to keep paragraph breaks and lists.

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

Commit your file and [open a pull request](https://github.com/BoardGameClubs/BoardGameClubs/pulls). We'll review it and merge it in.

</details>

<details class="reveal" markdown="1">
<summary>Adding an event</summary>

Conventions, games fairs and one-off events live in `_events/<country>/` and appear on the [events calendar]({{ "/events/" | relative_url }}). The easiest route is the **[Add an Event form](https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=add-event.yml)**; if you'd rather open a pull request, create `_events/<country>/your-event-slug.md` with:

```yaml
---
country: "GB"
name: "Your Event Name"
start_date: 2027-06-04     # YYYY-MM-DD, unquoted
end_date: 2027-06-06       # same as start_date for a one-day event
location:
  name: "Venue Name"
  address: "Full Address, Town, Postcode"
  lat: 52.4530
  lng: -1.7180
price: "Ticketed"          # or "Free", "£15/day", "€20"
tickets: ""                # link to buy tickets
website: ""
facebook: ""
discord: ""
bgg: ""
image: ""                  # URL or filename in assets/images/events/
description: >-
  What happens at the event, who it's for, and anything visitors should know.
---
```

Do not set `permalink`; events live at `/events/<slug>/` automatically. Past events drop off the calendar on their own once the end date has passed.

</details>

## Don't see your country?

The country menu in the site header shows every country we currently cover. If your club is somewhere else, [open an issue](https://github.com/BoardGameClubs/BoardGameClubs/issues/new). Adding a new country is a small change and we're happy to do it.

## Updating an Existing Listing

Find the club's file in the [`_clubs/` folder on GitHub](https://github.com/BoardGameClubs/BoardGameClubs/tree/main/_clubs), make your changes, and submit a pull request. Or just **[open an edit request](https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=edit-club.yml)** and we'll update it for you. For events, [open an edit request](https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=edit-event.yml) or edit the file in `_events/`.

Listings are published under [CC BY 4.0]({{ "/licence/" | relative_url }}).

</div>
