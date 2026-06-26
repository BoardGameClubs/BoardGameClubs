<div align="center">

<img src="assets/meeple-map-icon-orange.svg" alt="BoardGameClubs.org" width="120">

# BoardGameClubs.org

**Find your nearest board game club.**

A community-built directory powered by an interactive map, covering clubs worldwide.

[![Clubs listed](https://img.shields.io/endpoint?url=https%3A%2F%2Fboardgameclubs.org%2Fapi%2Fbadge.json)](https://boardgameclubs.org)
[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue?logo=github)](https://boardgameclubs.org)
[![Built with Jekyll](https://img.shields.io/badge/Built%20with-Jekyll-cc0000?logo=jekyll)](https://jekyllrb.com/)
[![License: MIT + Commons Clause](https://img.shields.io/badge/License-MIT%20%2B%20Commons%20Clause-green)](#license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange)](https://boardgameclubs.org/contribute/)

[Live Site](https://boardgameclubs.org) · [Add a Club](https://boardgameclubs.org/contribute/) · [Report a Bug](https://github.com/BoardGameClubs/BoardGameClubs/issues/new)

<br>

<a href="https://www.buymeacoffee.com/kkjdaniel" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

</div>

<br>

## What is this?

BoardGameClubs.org helps people find board game, RPG, wargaming, and TCG clubs near them. Search by postcode, browse the map, or filter by day and distance. Every club listing is maintained by the community through GitHub.

## How it works

- The site is built with Jekyll and hosted on GitHub Pages
- Each club is a Markdown file in the `_clubs/` directory
- Club data is served as JSON and rendered on an interactive Leaflet map
- Anyone can add or update a club by submitting a pull request

## Adding or editing a club

See the [contribute page](https://boardgameclubs.org/contribute/) for a full guide on adding a new club or updating an existing listing.

Not comfortable with GitHub? [Open an issue](https://github.com/BoardGameClubs/BoardGameClubs/issues/new) with your club's details and we'll add it for you.

## Running locally

```bash
bundle install
bundle exec jekyll serve
```

Then visit `http://localhost:4000`.

### Faster builds with rustkyll

A full Jekyll build renders ~8,400 pages and takes ~45–60s, which makes iterating
on chrome/SCSS/JS slow. For faster local dev, use [rustkyll](https://github.com/alexeygrigorev/rustkyll),
a drop-in Jekyll replacement written in Rust that reads the same source files and
builds the site in a fraction of the time:

```bash
uvx rustkyll serve
```

Note: the multi-language clones and per-country counts come from custom Ruby
`_plugins/`, which rustkyll can't run — use `bundle exec jekyll build` when you
need the full localised output (and for the production deploy).

## Support

This is a free, community-run project. If you find it useful, you can [buy me a coffee](https://www.buymeacoffee.com/kkjdaniel) ☕ to help keep it going.

## License

This project's source code is licensed under the [MIT License with the Commons Clause](LICENSE) condition. In short: you're free to use, modify, and run your own copy, but you can't sell it as a paid product or service. See the [licence page](https://boardgameclubs.org/licence/) for a plain-English summary.

Club data is contributed by the community and is available under [Creative Commons Attribution 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/): you can share and adapt the data as long as you give appropriate credit.
