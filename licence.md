---
layout: default
title: "Licence"
description: "How Board Game Clubs is licensed: MIT with a Commons Clause restriction for the code, and CC BY 4.0 for the club and event data."
permalink: /licence/
---

<div class="content-page" markdown="1">

# Licence

_Last updated: {{ site.time | date: "%-d %B %Y" }}_

Board Game Clubs is open source. This page summarises the licence in plain English. The full, legally binding text lives in the [LICENSE file]({% if site.repository %}https://github.com/{{ site.repository }}/blob/main/LICENSE{% endif %}) in the repository. If anything here conflicts with that file, the LICENSE file wins.

## The short version

The site's source code is licensed under the **MIT License** with the **Commons Clause** condition added. In plain terms:

- **You can** use it, copy it, modify it, run your own version, and share your changes.
- **You can't** sell it as a product or service. Hosting it for a fee or charging others to use it on your behalf isn't allowed.
- **You must** keep the copyright and licence notice in any copies or derivatives.
- **There's no warranty.** The software is provided "as is".
- **The club and event data is separate.** It's licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): anyone can reuse it as long as they credit BoardGameClubs.org.

## What the MIT License gives you

The MIT License is one of the most permissive open-source licences in common use. Under it, anyone is free to:

- Use the software, for any purpose.
- Copy and distribute it.
- Modify it and distribute modified versions.
- Include it in larger works (including commercial ones, subject to the Commons Clause below).
- Sublicense it.

The only condition: the copyright notice and the licence text must be included with any copies or substantial portions of the software.

## What the Commons Clause restricts

The Commons Clause adds **one** restriction on top of MIT: you cannot **Sell** the software.

In the licence's words, "Sell" means using the rights granted by the MIT License to provide the software to others **for a fee or other consideration**, including hosting it for paying customers, or selling consulting / support services whose value comes substantially from this software.

In practical terms:

- Running your own free copy of the directory for your local community: fine.
- Forking the code and submitting improvements: fine.
- Embedding small pieces in a larger project: fine.
- Spinning up a paid, hosted version of this directory and charging users or clubs to be listed: not allowed without permission.

The Commons Clause is a [published, standard text](https://commonsclause.com/) maintained by Fossa. It's intentionally narrow: it only restricts selling, not using or modifying.

## Club and event data

The club and event listings (the files in `_clubs/` and `_events/`, and the JSON feeds at `/api/clubs.json` and `/api/events.json`) are contributed by the community and licensed separately from the code, under [Creative Commons Attribution 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

That means you can copy, share, and adapt the listings for any purpose, including commercial ones, as long as you:

- **Give credit.** Name BoardGameClubs.org as the source and link back to the site.
- **Link to the licence.** Point to CC BY 4.0.
- **Say if you changed anything.** Note any edits you made to the data.

A suggested attribution: "Club and event data from [BoardGameClubs.org](https://boardgameclubs.org), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)."

The Commons Clause above applies to the software only. It does not restrict use of the data.

By submitting or editing a listing, whether through a GitHub form, a pull request, or any other route, you agree that your contribution is published under CC BY 4.0.

Club and event logos in `assets/images/` belong to their respective clubs and organisers and are not covered by either licence.

If you're a club organiser and want to update or remove your listing, see the [contribute page]({{ "/contribute" | relative_url }}) or open a GitHub issue.

## Third-party software and assets

The site uses a number of third-party open-source libraries (Leaflet, Leaflet.MarkerCluster, Lucide icons, Jekyll, and others). Each is used under its own licence. See the [package files in the repository]({% if site.repository %}https://github.com/{{ site.repository }}{% endif %}) for the full list.

Map tiles are provided by [CARTO](https://carto.com/) and data is &copy; [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).

## No warranty

The software is provided "**as is**", without warranty of any kind, express or implied. The authors and copyright holders are not liable for any claim or damages arising from the use of the software. See the [LICENSE file]({% if site.repository %}https://github.com/{{ site.repository }}/blob/main/LICENSE{% endif %}) for the full disclaimer.

## Contact

If you have a question about the licence, or want to use the software in a way that the Commons Clause might restrict, please [open an issue on GitHub]({% if site.repository %}https://github.com/{{ site.repository }}/issues{% endif %}).

</div>
