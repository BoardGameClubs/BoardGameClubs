<div align="center">

<img src="assets/meeple-map-icon-orange.svg" alt="BoardGameClubs.org" width="120">

# BoardGameClubs.org

**Find board game clubs and events near you.**

A community-built directory powered by an interactive map, covering clubs worldwide, plus a calendar of conventions, game days and tournaments.

[![Clubs listed](https://img.shields.io/endpoint?url=https%3A%2F%2Fboardgameclubs.org%2Fapi%2Fbadge.json)](https://boardgameclubs.org)
[![Upcoming events](https://img.shields.io/endpoint?url=https%3A%2F%2Fboardgameclubs.org%2Fapi%2Fevents-badge.json)](https://boardgameclubs.org/events/)
[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue?logo=github)](https://boardgameclubs.org)
[![Built with Jekyll](https://img.shields.io/badge/Built%20with-Jekyll-cc0000?logo=jekyll)](https://jekyllrb.com/)
[![License: MIT + Commons Clause](https://img.shields.io/badge/License-MIT%20%2B%20Commons%20Clause-green)](#license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange)](https://boardgameclubs.org/contribute/)

[Live Site](https://boardgameclubs.org) · [Events](https://boardgameclubs.org/events/) · [Add a Club](https://boardgameclubs.org/contribute/) · [Add an Event](https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=add-event.yml) · [Report a Bug](https://github.com/BoardGameClubs/BoardGameClubs/issues/new)

<br>

<a href="https://www.buymeacoffee.com/kkjdaniel" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

</div>

<br>

## What is this?

BoardGameClubs.org helps people find board game, RPG, wargaming, and TCG clubs near them. Search by postcode, browse the map, or filter by day and distance. The [events calendar](https://boardgameclubs.org/events/) lists upcoming conventions, game days and tournaments by country, each with its own page, dates, venue and ticket links. Every listing is maintained by the community through GitHub.

## How it works

- The site is built with Jekyll and hosted on GitHub Pages
- Each club is a Markdown file in the `_clubs/` directory; each event is one in `_events/`
- Club and event data is served as JSON (`/api/clubs.json`, `/api/events.json`) and rendered on an interactive Leaflet map and the events calendar
- Every club and event page exists in six languages (`/`, `/de/`, `/it/`, `/fr/`, `/es/`, `/pl/`)
- Anyone can add or update a listing by submitting a pull request

## Adding or editing a club or event

See the [contribute page](https://boardgameclubs.org/contribute/) for a full guide on adding a new club or event, or updating an existing listing.

Not comfortable with GitHub? Use the [Add a Club](https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=add-club.yml) or [Add an Event](https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=add-event.yml) form and we'll add it for you.

## Running locally

```bash
bundle install
bundle exec jekyll serve
```

Then visit `http://localhost:4000`.

Jekyll is slow (~45–60s full build). For faster local dev, use our [rustkyll fork](https://github.com/BoardGameClubs/rustkyll), a drop-in Rust replacement that also emulates this site's custom `_plugins/` (language clones, country counts). Build it from source, then run it in this repo:

```bash
git clone https://github.com/BoardGameClubs/rustkyll.git
cargo install --path rustkyll   # builds the `rustkyll` binary onto your PATH
rustkyll serve                  # run from the GameClub repo root
```

## Support

This is a free, community-run project. If you find it useful, you can [buy me a coffee](https://www.buymeacoffee.com/kkjdaniel) ☕ to help keep it going.

## License

This project's source code is licensed under the [MIT License with the Commons Clause](LICENSE) condition. In short: you're free to use, modify, and run your own copy, but you can't sell it as a paid product or service. See the [licence page](https://boardgameclubs.org/licence/) for a plain-English summary.

Club and event data is contributed by the community and is available under [Creative Commons Attribution 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/): you can share and adapt the data as long as you give appropriate credit.
