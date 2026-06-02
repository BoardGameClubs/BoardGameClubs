(function () {
  "use strict";

  // Standalone orchestrator for the embeddable /embed/ map. Reuses
  // window.GameClubMap (Leaflet renderer) and window.GameClubSearch
  // (text/type/day filtering) with none of the home-page chrome: no
  // sidebar, location, drawer or country selector. It covers a single
  // country chosen via ?country=, with optional ?type=, ?days= and ?q=
  // pre-filters that the embedder bakes into the iframe src.

  var baseurl = window.GameClub ? window.GameClub.baseurl : "";
  var countries = window.GameClubCountries || {};

  function readParams() {
    var params = new URLSearchParams(window.location.search);
    var country = (params.get("country") || "GB").toUpperCase();

    var typeStr = params.get("type") || "";
    var types = typeStr ? typeStr.split(",").filter(function (t) { return t; }) : [];

    var daysStr = params.get("days") || params.get("day") || "";
    var days = daysStr ? daysStr.split(",").filter(function (d) { return d; }) : [];

    return {
      country: country,
      type: types,
      days: days,
      q: params.get("q") || ""
    };
  }

  // Resolve a country profile by code, falling back to GB for unknown
  // or missing codes so a bad ?country= never breaks the embed.
  function resolveProfile(code) {
    return countries[code.toLowerCase()] || countries.gb || {};
  }

  function init() {
    var params = readParams();
    var profile = resolveProfile(params.country);
    var code = profile.code || "GB";

    var map = window.GameClubMap.init(profile);

    fetch(baseurl + "/api/clubs.json")
      .then(function (res) { return res.json(); })
      .then(function (clubs) {
        var scoped = clubs.filter(function (c) { return c.country === code; });
        var search = window.GameClubSearch.init(scoped, profile);
        search.setTypeFilters(params.type);
        search.setDayFilters(params.days);
        search.setQuery(params.q);

        var pins = search.getMapPins(scoped);
        map.addClubs(pins);
        map.fitToBounds(pins);
      })
      .catch(function (err) {
        console.error("Failed to load clubs:", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
