---
layout: default
title: "Embed the Board Game Clubs Map"
description: "Generate an iframe snippet to embed a filtered board game clubs map (scoped to a country, optionally by game type and meeting day) on your own website."
permalink: /embed-builder/
---

<div class="content-page" markdown="1">

# Embed the Map

Add a live board game clubs map to your own site. Pick a country and any filters
below, then copy the snippet into your page's HTML. The map updates automatically as
the directory grows, with no maintenance on your end.

</div>

<div class="content-page embed-builder">
  <div class="embed-builder-controls">
    <label class="embed-field">
      <span class="embed-field-label">Country</span>
      <select id="embed-country" class="filter-select"></select>
    </label>

    <fieldset class="embed-field">
      <legend class="embed-field-label">Game types <small>(optional)</small></legend>
      <label><input type="checkbox" class="embed-type" value="Board Games"> Board Games</label>
      <label><input type="checkbox" class="embed-type" value="RPG"> RPG</label>
      <label><input type="checkbox" class="embed-type" value="Wargames"> Wargames</label>
      <label><input type="checkbox" class="embed-type" value="BOTC"> BOTC</label>
      <label><input type="checkbox" class="embed-type" value="TCG"> TCG</label>
    </fieldset>

    <fieldset class="embed-field">
      <legend class="embed-field-label">Meeting days <small>(optional)</small></legend>
      <label><input type="checkbox" class="embed-day" value="Monday"> Monday</label>
      <label><input type="checkbox" class="embed-day" value="Tuesday"> Tuesday</label>
      <label><input type="checkbox" class="embed-day" value="Wednesday"> Wednesday</label>
      <label><input type="checkbox" class="embed-day" value="Thursday"> Thursday</label>
      <label><input type="checkbox" class="embed-day" value="Friday"> Friday</label>
      <label><input type="checkbox" class="embed-day" value="Saturday"> Saturday</label>
      <label><input type="checkbox" class="embed-day" value="Sunday"> Sunday</label>
    </fieldset>

    <div class="embed-field embed-field-size">
      <label class="embed-field">
        <span class="embed-field-label">Width</span>
        <input type="text" id="embed-width" class="filter-select" value="100%">
      </label>
      <label class="embed-field">
        <span class="embed-field-label">Height</span>
        <input type="text" id="embed-height" class="filter-select" value="500">
      </label>
    </div>
  </div>

  <div class="embed-builder-output">
    <h2>Preview</h2>
    <iframe id="embed-preview" title="Board game clubs map preview"
            style="width:100%;height:400px;border:1px solid #e2e8f0;border-radius:8px;"></iframe>

    <h2>Copy this snippet</h2>
    <textarea id="embed-snippet" class="embed-snippet" readonly rows="3"></textarea>
    <button type="button" id="embed-copy" class="locate-btn">Copy to clipboard</button>
  </div>
</div>

<script src="{{ '/assets/js/embed-builder.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
