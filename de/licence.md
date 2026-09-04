---
layout: default
title: "Lizenz"
description: "Wie Board Game Clubs lizenziert ist: MIT mit Commons-Clause-Einschränkung für den Code und CC BY 4.0 für die Club- und Eventdaten."
permalink: /de/licence/
---

<div class="content-page" markdown="1">

# Lizenz

_Zuletzt aktualisiert: {{ site.time | date: "%-d. %B %Y" }}_

Board Game Clubs ist Open Source. Diese Seite fasst die Lizenz in einfachen Worten zusammen. Der vollständige, rechtsverbindliche Text liegt in der [LICENSE-Datei]({% if site.repository %}https://github.com/{{ site.repository }}/blob/main/LICENSE{% endif %}) im Repository. Bei Widersprüchen gilt die LICENSE-Datei.

## Die Kurzfassung

Der Quellcode der Website steht unter der **MIT License** mit zusätzlicher **Commons-Clause**-Bedingung. Im Klartext:

- **Du darfst** sie nutzen, kopieren, verändern, deine eigene Version betreiben und deine Änderungen teilen.
- **Du darfst nicht** sie als Produkt oder Dienstleistung verkaufen. Sie gegen Gebühr zu hosten oder andere dafür bezahlen zu lassen, dass sie sie für dich betreiben, ist nicht erlaubt.
- **Du musst** den Copyright- und Lizenzhinweis in allen Kopien oder Ableitungen beibehalten.
- **Es gibt keine Gewährleistung.** Die Software wird „wie sie ist" bereitgestellt.
- **Die Club- und Eventdaten sind getrennt lizenziert.** Sie stehen unter [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.de): Jede:r darf sie weiterverwenden, solange BoardGameClubs.org als Quelle genannt wird.

## Was die MIT License erlaubt

Die MIT License gehört zu den freizügigsten Open-Source-Lizenzen. Unter ihr darfst du:

- Die Software für jeden Zweck nutzen.
- Sie kopieren und verbreiten.
- Sie verändern und veränderte Versionen verbreiten.
- Sie in größere Projekte einbinden (auch kommerzielle, vorbehaltlich der Commons Clause unten).
- Sie unterlizenzieren.

Die einzige Bedingung: Der Copyright-Hinweis und der Lizenztext müssen mit jeder Kopie oder substanziellen Teilen der Software beigefügt werden.

## Was die Commons Clause einschränkt

Die Commons Clause fügt der MIT License **eine** Einschränkung hinzu: Du darfst die Software nicht **verkaufen**.

In den Worten der Lizenz bedeutet „verkaufen", die durch die MIT License gewährten Rechte zu nutzen, um die Software anderen **gegen Gebühr oder andere Gegenleistung** bereitzustellen, einschließlich des Hostings für zahlende Kund:innen oder des Verkaufs von Beratungs-/Support-Leistungen, deren Wert wesentlich auf dieser Software beruht.

Praktisch heißt das:

- Eine eigene, kostenlose Kopie des Verzeichnisses für die lokale Community zu betreiben: in Ordnung.
- Den Code zu forken und Verbesserungen einzureichen: in Ordnung.
- Kleine Teile in ein größeres Projekt zu integrieren: in Ordnung.
- Eine bezahlte, gehostete Version dieses Verzeichnisses aufzusetzen und Nutzer:innen oder Clubs für eine Listung zur Kasse zu bitten: ohne Erlaubnis nicht erlaubt.

Die Commons Clause ist ein [veröffentlichter, standardisierter Text](https://commonsclause.com/), gepflegt von Fossa. Sie ist absichtlich eng gefasst: Sie beschränkt nur den Verkauf, nicht die Nutzung oder Veränderung.

## Club- und Eventdaten

Die Club- und Eventeinträge (die Dateien in `_clubs/` und `_events/` sowie die JSON-Feeds unter `/api/clubs.json` und `/api/events.json`) werden von der Community beigetragen und sind getrennt vom Code lizenziert, unter [Creative Commons Namensnennung 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.de).

Das heißt, du darfst die Einträge für jeden Zweck kopieren, teilen und anpassen, auch kommerziell, solange du:

- **Die Quelle nennst.** Nenne BoardGameClubs.org als Quelle und verlinke auf die Website.
- **Auf die Lizenz verlinkst.** Verweise auf CC BY 4.0.
- **Änderungen kennzeichnest.** Gib an, wenn du die Daten bearbeitet hast.

Vorgeschlagene Namensnennung: „Club- und Eventdaten von [BoardGameClubs.org](https://boardgameclubs.org), lizenziert unter [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.de)."

Die Commons Clause oben gilt nur für die Software. Sie schränkt die Nutzung der Daten nicht ein.

Mit dem Einreichen oder Bearbeiten eines Eintrags, ob per GitHub-Formular, Pull Request oder auf anderem Weg, erklärst du dich damit einverstanden, dass dein Beitrag unter CC BY 4.0 veröffentlicht wird.

Club- und Eventlogos in `assets/images/` gehören den jeweiligen Clubs und Veranstaltern und fallen unter keine der beiden Lizenzen.

Wenn du Club-Organisator:in bist und deinen Eintrag aktualisieren oder entfernen lassen möchtest, siehe die [Beitragsseite]({{ "/de/contribute/" | relative_url }}) oder öffne ein GitHub-Issue.

## Software und Assets von Drittanbietern

Die Website verwendet eine Reihe quelloffener Drittanbieter-Bibliotheken (Leaflet, Leaflet.MarkerCluster, Lucide-Icons, Jekyll und weitere). Jede wird unter ihrer eigenen Lizenz verwendet. Die vollständige Liste findest du in den [Paketdateien im Repository]({% if site.repository %}https://github.com/{{ site.repository }}{% endif %}).

Kartenkacheln werden bereitgestellt von [CARTO](https://carto.com/), Daten sind &copy; [OpenStreetMap-Mitwirkenden](https://www.openstreetmap.org/copyright).

## Keine Gewährleistung

Die Software wird **„wie sie ist"** bereitgestellt, ohne irgendeine ausdrückliche oder stillschweigende Gewährleistung. Die Autoren und Rechteinhaber haften nicht für Ansprüche oder Schäden, die aus der Nutzung der Software entstehen. Den vollständigen Haftungsausschluss findest du in der [LICENSE-Datei]({% if site.repository %}https://github.com/{{ site.repository }}/blob/main/LICENSE{% endif %}).

## Kontakt

Bei Fragen zur Lizenz oder wenn du die Software auf eine Weise nutzen möchtest, die die Commons Clause möglicherweise einschränkt, [öffne bitte ein Issue auf GitHub]({% if site.repository %}https://github.com/{{ site.repository }}/issues{% endif %}).

</div>
