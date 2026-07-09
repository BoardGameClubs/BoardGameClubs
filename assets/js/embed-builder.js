(function () {
  "use strict";

  // Derived from the page origin so the local dev preview stays local and
  // the production page emits production URLs. (This file used to be an
  // inline script in embed-builder.md, but markdown renderers can mangle
  // inline script content — rustkyll parsed `a || b` as a table — so it
  // lives as a static asset instead.)
  var EMBED_BASE = window.location.origin + "/embed/";

  // window.GameClubCountries / GameClubI18n are defined by the default layout
  // in scripts near </body>, AFTER this script's tag in the DOM. Defer init
  // until the document has finished parsing so those globals exist.
  function start() {
  var countries = window.GameClubCountries || {};
  var i18n = window.GameClubI18n || {};

  // Country dropdown: ISO code -> display name. Prefer the localised name from
  // window.GameClubI18n (country_gb etc.), falling back to the profile's name_en.
  var select = document.getElementById("embed-country");
  var keys = Object.keys(countries).sort(function (a, b) {
    var na = (i18n["country_" + a] || countries[a].name_en || a);
    var nb = (i18n["country_" + b] || countries[b].name_en || b);
    return na.localeCompare(nb);
  });
  keys.forEach(function (key) {
    var profile = countries[key];
    var name = i18n["country_" + key] || profile.name_en || profile.code;
    var opt = document.createElement("option");
    opt.value = profile.code;
    opt.textContent = name + " (" + profile.code + ")";
    select.appendChild(opt);
  });
  if (countries.gb) select.value = "GB";

  function checkedValues(cls) {
    var out = [];
    var boxes = document.querySelectorAll("." + cls + ":checked");
    for (var i = 0; i < boxes.length; i++) out.push(boxes[i].value);
    return out;
  }

  function buildUrl() {
    var params = new URLSearchParams();
    params.set("country", select.value);
    var types = checkedValues("embed-type");
    var days = checkedValues("embed-day");
    if (types.length) params.set("type", types.join(","));
    if (days.length) params.set("days", days.join(","));
    return EMBED_BASE + "?" + params.toString();
  }

  function buildSnippet() {
    var width = document.getElementById("embed-width").value.trim() || "100%";
    var height = document.getElementById("embed-height").value.trim() || "500";
    return '<iframe src="' + buildUrl() + '" width="' + width + '" height="' + height +
      '" style="border:0" loading="lazy" title="Board game clubs map"></iframe>';
  }

  function refresh() {
    document.getElementById("embed-preview").src = buildUrl();
    document.getElementById("embed-snippet").value = buildSnippet();
  }

  var inputs = document.querySelectorAll(
    "#embed-country, .embed-type, .embed-day, #embed-width, #embed-height"
  );
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", refresh);
    inputs[i].addEventListener("change", refresh);
  }

  var copyBtn = document.getElementById("embed-copy");
  copyBtn.addEventListener("click", function () {
    var snippet = document.getElementById("embed-snippet");
    var done = function () {
      var original = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(function () { copyBtn.textContent = original; }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(snippet.value).then(done, function () {
        snippet.select();
        document.execCommand("copy");
        done();
      });
    } else {
      snippet.select();
      document.execCommand("copy");
      done();
    }
  });

  refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
