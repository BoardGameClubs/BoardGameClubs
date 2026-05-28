---
layout: default
title: "Licence"
description: "How Board Game Clubs is licensed — MIT with a Commons Clause restriction (no commercial selling of the software)."
permalink: /licence/
---

<div class="content-page" markdown="1">

# Licence

_Last updated: {{ site.time | date: "%-d %B %Y" }}_

Board Game Clubs is open source. This page summarises the licence in plain English. The full, legally binding text lives in the [LICENSE file]({% if site.repository %}https://github.com/{{ site.repository }}/blob/main/LICENSE{% endif %}) in the repository — if anything here conflicts with that file, the LICENSE file wins.

## The short version

The site's source code is licensed under the **MIT License** with the **Commons Clause** condition added. In plain terms:

- **You can** use it, copy it, modify it, run your own version, and share your changes.
- **You can't** sell it as a product or service. Hosting it for a fee or charging others to use it on your behalf isn't allowed.
- **You must** keep the copyright and licence notice in any copies or derivatives.
- **There's no warranty.** The software is provided "as is".

## What the MIT License gives you

The MIT License is one of the most permissive open-source licences in common use. Under it, anyone is free to:

- Use the software, for any purpose.
- Copy and distribute it.
- Modify it and distribute modified versions.
- Include it in larger works (including commercial ones — subject to the Commons Clause below).
- Sublicense it.

The only condition: the copyright notice and the licence text must be included with any copies or substantial portions of the software.

## What the Commons Clause restricts

The Commons Clause adds **one** restriction on top of MIT: you cannot **Sell** the software.

In the licence's words, "Sell" means using the rights granted by the MIT License to provide the software to others **for a fee or other consideration** — including hosting it for paying customers, or selling consulting / support services whose value comes substantially from this software.

In practical terms:

- Running your own free copy of the directory for your local community: fine.
- Forking the code and submitting improvements: fine.
- Embedding small pieces in a larger project: fine.
- Spinning up a paid, hosted version of this directory and charging users or clubs to be listed: not allowed without permission.

The Commons Clause is a [published, standard text](https://commonsclause.com/) maintained by Fossa. It's intentionally narrow — it only restricts selling, not using or modifying.

## A note about club data

The club listings in this directory are contributed by the community. Each club's information (name, venue, days, description, etc.) is added by volunteers and represents publicly-available information about that club. If you'd like to use the club listings themselves for another project, please [open an issue]({% if site.repository %}https://github.com/{{ site.repository }}/issues{% endif %}) so we can talk through what makes sense — the data is here for the community's benefit, and we want to keep it that way.

If you're a club organiser and want to update or remove your listing, see the [contribute page]({{ "/contribute" | relative_url }}) or open a GitHub issue.

## Third-party software and assets

The site uses a number of third-party open-source libraries (Leaflet, Leaflet.MarkerCluster, Lucide icons, Jekyll, and others). Each is used under its own licence. See the [package files in the repository]({% if site.repository %}https://github.com/{{ site.repository }}{% endif %}) for the full list.

Map tiles are provided by [CARTO](https://carto.com/) and data is &copy; [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).

## No warranty

The software is provided "**as is**", without warranty of any kind, express or implied. The authors and copyright holders are not liable for any claim or damages arising from the use of the software. See the [LICENSE file]({% if site.repository %}https://github.com/{{ site.repository }}/blob/main/LICENSE{% endif %}) for the full disclaimer.

## Contact

If you have a question about the licence, or want to use the software in a way that the Commons Clause might restrict, please [open an issue on GitHub]({% if site.repository %}https://github.com/{{ site.repository }}/issues{% endif %}).

</div>
