(function () {
  "use strict";

  var baseurl = window.GameClub ? window.GameClub.baseurl : "";
  var i18n = window.GameClubI18n || {};

  // All clubs across all countries (global JSON). Country filtering happens
  // in JS based on the active country.
  var ALL_CLUBS = [];
  // Upcoming events across all countries (map pins only; the sidebar list
  // stays clubs-only so units, sort and result counts keep meaning "clubs").
  var ALL_EVENTS = [];
  var activeCountry = null;
  var map;
  var search;
  var debounceTimer;
  var initialised = false;
  // The picked location pin ({lat, lng, label}), mirrored into the URL so
  // navigating to a club page and back restores it.
  var userLocation = null;
  // Set when a map viewport was restored from the URL: the next fit-to-country
  // in update() must not stomp the restored view.
  var suppressNextFit = false;

  function getActiveCountry() {
    if (window.GameClubCountry) return window.GameClubCountry.getActive();
    return activeCountry;
  }

  function clubsForCountry(code) {
    return ALL_CLUBS.filter(function (c) { return c.country === code; });
  }

  // URL prefix for the current page language: "/de", "/it", "" (English), etc.
  function langPrefixForCurrentPage() {
    var lang = (window.GameClub && window.GameClub.language) || "en";
    if (lang === "en") return "";
    return "/" + lang;
  }

  // Rewrite "/clubs/<slug>/" to "/<lang>/clubs/<slug>/" (and likewise
  // "/events/<slug>/") so clicking through from a localised home page stays
  // on that language. Every club and event exists at every language URL
  // (see _plugins/language_clones.rb).
  function localiseClubUrl(url) {
    var prefix = langPrefixForCurrentPage();
    if (!prefix) return url;
    if (!url) return url;
    var idx = url.indexOf("/clubs/");
    if (idx === -1) idx = url.indexOf("/events/");
    if (idx === -1) return url;
    return url.slice(0, idx) + prefix + url.slice(idx);
  }

  function fetchJson(path) {
    return fetch(baseurl + path).then(function (res) { return res.json(); });
  }

  function init() {
    activeCountry = getActiveCountry();
    map = window.GameClubMap.init(activeCountry);

    Promise.all([
      fetchJson("/api/clubs.json"),
      // A missing or broken events feed must never take the club map down.
      fetchJson("/api/events.json").catch(function () { return []; })
    ])
      .then(function (results) {
        ALL_CLUBS = results[0];
        ALL_EVENTS = window.GameClubSearch.normaliseEvents(results[1]);
        var scoped = clubsForCountry(activeCountry.code);
        search = window.GameClubSearch.init(scoped, activeCountry);
        populateDistanceOptions(activeCountry);
        updateSearchPlaceholder(activeCountry);
        restoreFromUrl();
        bindEvents();
        restoreLocationFromUrl();
        restoreMapViewFromUrl();
        update(true);
        initialised = true;
        // Keep the URL's map view current so back/forward and reload land
        // where the user left the map, wherever in the world that was.
        map.onViewChange(function () {
          if (!initialised) return;
          dismissLocationIfPannedAway();
          writeUrlParams();
        });
        // Clicking through to a club in another country is a statement of
        // intent: the visitor is browsing THAT country now. Rewrite this
        // page's history entry to the club's country just before leaving,
        // so pressing back on the club page restores that context (map
        // position is already in the URL; the dataset follows).
        document.addEventListener("click", function (e) {
          if (!e.target || !e.target.closest) return;
          // Modifier/middle clicks open a new tab; this page isn't being
          // left, so its history entry must stay as-is.
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          var link = e.target.closest("a[data-club-country]");
          if (!link) return;
          var code = link.getAttribute("data-club-country");
          var active = window.GameClubCountry && window.GameClubCountry.getActiveCode
            ? window.GameClubCountry.getActiveCode()
            : null;
          if (!code || code === active) return;
          var params = new URLSearchParams(window.location.search);
          params.set("country", code);
          history.replaceState(null, "", window.location.pathname + "?" + params.toString());
        });
        if (window.GameClubCountry) {
          window.GameClubCountry.onChange(handleCountryChange);
          // A no-signal visitor we couldn't place in a supported country: the
          // map shows every country's pins anyway, so just frame the globe.
          if (window.GameClubCountry.onWorldView) {
            window.GameClubCountry.onWorldView(function () {
              if (map) map.fitWorld();
            });
          }
          // Apply a country that async geo-detection resolved before the
          // listener was registered.
          var current = window.GameClubCountry.getActive();
          if (current && current.code !== activeCountry.code) {
            handleCountryChange(current);
          }
        }
      })
      .catch(function (err) {
        console.error("Failed to load clubs:", err);
      });
  }

  function handleCountryChange(profile) {
    if (!initialised || !profile) return;
    activeCountry = profile;
    var scoped = clubsForCountry(profile.code);

    search.allClubs = scoped;
    search.setCountry(profile);

    if (window.GameClubLocation && window.GameClubLocation.setCountry) {
      window.GameClubLocation.setCountry(profile);
    }
    updateSearchPlaceholder(profile);

    populateDistanceOptions(profile);

    // update() calls map.fitToMarkers() to frame the new country's clubs,
    // which gives a tighter view than the static map_center + map_zoom
    // defaults. Those defaults only kick in when no clubs are visible
    // (e.g. an empty result set).
    update(true);
  }

  function distanceLabel(n, unit) {
    return (i18n.filter_within_distance || "Within %N% %UNIT%")
      .replace("%N%", n).replace("%UNIT%", unit);
  }

  function populateDistanceOptions(profile) {
    var panel = document.getElementById("distance-filter");
    if (!panel) return;
    var unit = profile.unit_label || "mi";
    var options = profile.distance_options || [5, 10, 25, 50];
    var html = "";
    options.forEach(function (n) {
      html += '<label class="filter-option"><input type="checkbox" value="' + n + '"><span>' +
        escapeHtml(distanceLabel(n, unit)) + "</span></label>";
    });
    panel.innerHTML = html;
    if (search.maxDistance && options.indexOf(search.maxDistance) === -1) {
      search.setMaxDistance(0);
    }
    syncFilterUi();
  }

  function updateSearchPlaceholder(profile) {
    // Countries can name their postcode differently (US "ZIP code",
    // CA "postal code") via postcode.term in countries.yml.
    var term = profile && profile.postcode && profile.postcode.term;
    var placeholder = (term && i18n["search_placeholder_" + term]) ||
      i18n.search_placeholder || "";
    var inputs = [
      document.getElementById("search-input"),
      document.getElementById("search-input-mobile")
    ];
    inputs.forEach(function (el) { if (el) el.placeholder = placeholder; });
  }

  function restoreFromUrl() {
    var params = readUrlParams();
    var searchInput = document.getElementById("search-input");
    var searchInputMobile = document.getElementById("search-input-mobile");

    if (params.q) {
      search.setQuery(params.q);
      if (searchInput) searchInput.value = params.q;
      if (searchInputMobile) searchInputMobile.value = params.q;
    }
    if (params.type && params.type.length > 0) search.setTypeFilters(params.type);
    if (params.days && params.days.length > 0) search.setDayFilters(params.days);
    if (params.distance) search.setMaxDistance(params.distance);
    syncFilterUi();
  }

  // Restore a location pin (postcode/place/geolocate pick) from the URL.
  // Runs after bindEvents so GameClubLocation is initialised (the pill
  // element only exists to setActive on after init).
  function restoreLocationFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var lat = parseFloat(params.get("lat"));
    var lng = parseFloat(params.get("lng"));
    if (isNaN(lat) || isNaN(lng)) return;
    var label = params.get("loc") || i18n.my_location || "My location";

    userLocation = { lat: lat, lng: lng, label: label };
    search.setUserLocation(lat, lng);
    map.showUserLocation(lat, lng);
    setDistanceEnabled(true);
    if (window.GameClubLocation && window.GameClubLocation.setActive) {
      window.GameClubLocation.setActive(label);
    }
  }

  // A location pin only means something near where it was set. When the map
  // centre leaves the active country's bounds entirely (panned off to browse
  // another country), the pin and its distance filter are stale context;
  // dismiss them rather than sorting a faraway list against them.
  function dismissLocationIfPannedAway() {
    if (!userLocation) return;
    var profile = getActiveCountry();
    var b = profile && profile.bounds;
    var view = map.getView();
    if (!b || !b.lat || !b.lng || !view) return;
    if (view.lat < b.lat[0] || view.lat > b.lat[1] ||
        view.lng < b.lng[0] || view.lng > b.lng[1]) {
      if (window.GameClubLocation && window.GameClubLocation.clearLocation) {
        window.GameClubLocation.clearLocation({ keepView: true });
      }
    }
  }

  // Restore the map viewport ("map=lat,lng,zoom") from the URL. Runs after
  // restoreLocationFromUrl on purpose: the saved viewport is where the user
  // actually left the map, which may be nowhere near their location pin
  // (e.g. browsing DE clubs, then panning to the US).
  function restoreMapViewFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var parts = (params.get("map") || "").split(",");
    if (parts.length !== 3) return;
    var lat = parseFloat(parts[0]);
    var lng = parseFloat(parts[1]);
    var zoom = parseInt(parts[2], 10);
    if (isNaN(lat) || isNaN(lng) || isNaN(zoom)) return;
    map.setView(lat, lng, zoom);
    suppressNextFit = true;
  }

  function readUrlParams() {
    var params = new URLSearchParams(window.location.search);
    var daysStr = params.get("days") || "";
    if (!daysStr) {
      var singleDay = params.get("day") || "";
      if (singleDay) daysStr = singleDay;
    }
    var days = daysStr ? daysStr.split(",").filter(function (d) { return d; }) : [];
    var typeStr = params.get("type") || "";
    var types = typeStr ? typeStr.split(",").filter(function (t) { return t; }) : [];
    return {
      q: params.get("q") || "",
      days: days,
      type: types,
      distance: params.get("distance") || ""
    };
  }

  function writeUrlParams() {
    var searchInput = document.getElementById("search-input");

    var params = new URLSearchParams();
    // Always stamp the ACTIVE country, never merely preserve an existing
    // param: the active country can come from sources that never wrote the
    // URL (postcode/place auto-switch, geo-detect), and a home URL carrying
    // a location pin but no country resolves to the wrong dataset on
    // back/reload/share.
    var activeProfile = getActiveCountry();
    if (activeProfile && activeProfile.code) {
      params.set("country", activeProfile.code);
    }

    var q = searchInput ? searchInput.value.trim() : "";
    var days = search.dayFilters.join(",");
    var types = search.typeFilters.join(",");
    var distance = search.maxDistance ? String(search.maxDistance) : "";

    if (q) params.set("q", q);
    if (types) params.set("type", types);
    if (days) params.set("days", days);
    if (distance) params.set("distance", distance);
    if (userLocation) {
      params.set("lat", userLocation.lat.toFixed(5));
      params.set("lng", userLocation.lng.toFixed(5));
      params.set("loc", userLocation.label);
    }
    var view = map && map.getView ? map.getView() : null;
    if (view) {
      params.set("map", view.lat.toFixed(5) + "," + view.lng.toFixed(5) + "," + view.zoom);
    }

    var newUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
    history.replaceState(null, "", newUrl);
  }

  function update(fitMap) {
    var filteredForList = search.getFiltered();
    // The map shows pins from every country (same text/type/day filters, but
    // no distance filter) so users browsing one country still see clubs in
    // others, plus upcoming events as their own pin type. The sidebar list
    // stays scoped to the active country's clubs to keep units, sort and
    // postcode search behaving consistently.
    var pinsForMap = search.getMapPins(ALL_CLUBS.concat(ALL_EVENTS));
    map.addClubs(pinsForMap);
    if (fitMap) {
      if (!map.userMarker && !suppressNextFit) {
        // Fit to the active country's clubs, not the global pins, or the map
        // would zoom out to span the whole continent on first load.
        map.fitToBounds(filteredForList);
      }
      suppressNextFit = false;
    }
    renderCards(filteredForList);
    updateResultCount(filteredForList.length, search.allClubs.length);
    writeUrlParams();
  }

  function renderCards(clubs) {
    var container = document.getElementById("club-list");
    if (!container) return;

    if (clubs.length === 0) {
      var profileEmpty = getActiveCountry() || {};
      var countryEmpty = search.allClubs.length === 0;
      var title, hint, iconName;

      if (countryEmpty) {
        var countryKey = "country_" + String(profileEmpty.code || "").toLowerCase();
        var countryName = i18n[countryKey] || profileEmpty.code || "";
        title = i18n.no_clubs_in_country_title || "No clubs listed here yet";
        hint = (i18n.no_clubs_in_country_hint || "Know one? Add the first club in %COUNTRY%.")
                 .replace("%COUNTRY%", countryName);
        iconName = "map-pinned";
      } else {
        title = i18n.no_results_title || "No clubs match your search";
        hint = i18n.no_results_hint || "Try a different filter or search term.";
        iconName = "search-x";
      }

      var contributeUrl = baseurl + langPrefixForCurrentPage() + "/contribute/";

      container.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-state-icon"><i data-lucide="' + iconName + '"></i></div>' +
          '<p class="empty-state-title">' + escapeHtml(title) + '</p>' +
          '<p class="empty-state-hint">' + escapeHtml(hint) + '</p>' +
          (countryEmpty
            ? '<a href="' + contributeUrl + '" class="empty-state-cta">' +
                '<i data-lucide="plus"></i><span>' + escapeHtml(i18n.nav_contribute || "Add a Club") + '</span>' +
              '</a>'
            : '') +
        '</div>';

      if (window.lucide) lucide.createIcons();
      return;
    }

    var profile = getActiveCountry() || {};
    var unitLabel = profile.unit_label || "mi";

    var html = clubs
      .map(function (club) {
        var tags = "";
        var clubTypes = club.type || ["Board Games"];
        clubTypes.forEach(function (t) {
          var cls = "tag tag-type tag-type-" + t.toLowerCase().replace(/ /g, "-");
          tags += '<span class="' + cls + '">' + escapeHtml(t) + "</span>";
        });

        if (club.cost) {
          tags += '<span class="tag tag-cost">' + escapeHtml(club.cost) + "</span>";
        }

        var distanceBadge = "";
        if (club._distance !== undefined) {
          distanceBadge =
            '<span class="club-distance">' +
            club._distance.toFixed(1) + " " + escapeHtml(unitLabel) +
            "</span>";
        }

        var icon = "";
        if (club.image) {
          var imgSrc = club.image.indexOf("://") !== -1
            ? escapeHtml(club.image)
            : baseurl + "/assets/images/clubs/" + encodeURIComponent(club.image);
          icon = '<div class="club-icon-wrap"><img src="' + imgSrc + '" alt="" loading="lazy" onload="window.GameClub.applyImgBg(this)"></div>';
        }

        var venue = club.location && club.location.name
          ? '<div class="club-venue"><i data-lucide="map-pin"></i><span>' + escapeHtml(club.location.name) + "</span></div>"
          : "";

        var daysText = club.days.join(", ");
        if (club.frequency && club.frequency !== "Weekly") {
          daysText += " · " + club.frequency;
        }
        var daysLine = '<div class="club-days"><i data-lucide="calendar"></i><span>' + escapeHtml(daysText) + "</span></div>";

        var meta = '<div class="club-card-meta">' + venue + daysLine + "</div>";

        return (
          '<a class="club-card" href="' +
          escapeHtml(localiseClubUrl(club.url)) +
          '" data-club-country="' + escapeHtml(club.country || "") + '">' +
          '<div class="club-card-body">' +
          icon +
          '<div class="club-card-content">' +
          '<div class="club-card-header">' +
          '<div class="club-name">' +
          escapeHtml(club.name) +
          "</div>" +
          distanceBadge +
          "</div>" +
          meta +
          "</div>" +
          "</div>" +
          '<div class="club-tags">' +
          tags +
          "</div>" +
          '<i data-lucide="chevron-right" class="club-card-chevron"></i>' +
          "</a>"
        );
      })
      .join("");

    if (search.allClubs.length > 0) {
      var countryKeyTail = "country_" + String(profile.code || "").toLowerCase();
      var countryNameTail = i18n[countryKeyTail] || profile.code || "";
      var tailTitle = (i18n.add_club_tail_title || "Know another club in %COUNTRY%?")
                        .replace("%COUNTRY%", countryNameTail);
      var tailHint = i18n.add_club_tail_hint || "Help grow the directory.";
      var tailContributeUrl = baseurl + langPrefixForCurrentPage() + "/contribute/";

      html +=
        '<a class="club-card club-card-add" href="' + tailContributeUrl + '">' +
          '<div class="club-card-add-icon"><i data-lucide="plus"></i></div>' +
          '<div class="club-card-add-text">' +
            '<div class="club-card-add-title">' + escapeHtml(tailTitle) + '</div>' +
            '<div class="club-card-add-hint">' + escapeHtml(tailHint) + '</div>' +
          '</div>' +
        '</a>';
    }

    container.innerHTML = html;
    if (window.lucide) lucide.createIcons();
  }

  function updateResultCount(shown, total) {
    var el = document.getElementById("result-count");
    if (!el) return;

    var text;
    if (shown === total) {
      text = (i18n.showing_n_clubs || "Showing %N% clubs").replace("%N%", total);
    } else {
      text = (i18n.showing_n_of_m || "Showing %N% of %M% clubs")
        .replace("%N%", shown).replace("%M%", total);
    }

    var locationLabel = window.GameClubLocation && window.GameClubLocation.getActiveLabel
      ? window.GameClubLocation.getActiveLabel()
      : null;

    if (locationLabel) {
      text += " · " + (i18n.sorted_by_nearest || "sorted by nearest to %LOCATION%")
        .replace("%LOCATION%", locationLabel);
    }

    el.textContent = text;
  }

  var FILTER_PANELS = { type: "type-filter", day: "day-filter", distance: "distance-filter" };

  function selectedFilterValues(kind) {
    if (kind === "type") return search.typeFilters;
    if (kind === "day") return search.dayFilters;
    return search.maxDistance ? [String(search.maxDistance)] : [];
  }

  function buildFilterTag(kind, value, label) {
    var tag = document.createElement("span");
    tag.className = "tag filter-tag";
    if (kind === "type") tag.className += " tag-type tag-type-" + value.toLowerCase().replace(/ /g, "-");
    if (kind === "day") tag.className += " tag-day";
    tag.appendChild(document.createTextNode(label));

    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "filter-tag-remove";
    remove.setAttribute("data-filter", kind);
    remove.setAttribute("data-value", value);
    remove.setAttribute("aria-label", (i18n.remove_filter || "Remove filter") + ": " + label);
    remove.innerHTML = '<i data-lucide="x"></i>';
    tag.appendChild(remove);
    return tag;
  }

  // Search state is the source of truth: the option chips, tab counts and
  // removable tags are all redrawn from it.
  function syncFilterUi() {
    var container = document.getElementById("active-filters");
    if (!container) return;
    var stale = container.querySelectorAll(".filter-tag");
    for (var i = 0; i < stale.length; i++) container.removeChild(stale[i]);

    var total = 0;
    Object.keys(FILTER_PANELS).forEach(function (kind) {
      var panelId = FILTER_PANELS[kind];
      var selected = selectedFilterValues(kind);
      var labels = {};
      var inputs = document.querySelectorAll("#" + panelId + " input[type='checkbox']");
      for (var j = 0; j < inputs.length; j++) {
        inputs[j].checked = selected.indexOf(inputs[j].value) !== -1;
        labels[inputs[j].value] = inputs[j].nextElementSibling.textContent;
      }
      var count = document.querySelector('.filter-tab[data-panel="' + panelId + '"] .filter-tab-count');
      if (count) count.textContent = selected.length || "";
      total += selected.length;
      selected.forEach(function (value) {
        var fallback = kind === "distance"
          ? distanceLabel(value, (getActiveCountry() || {}).unit_label || "mi")
          : value;
        container.appendChild(buildFilterTag(kind, value, labels[value] || fallback));
      });
    });
    var totalCounts = document.querySelectorAll(".filter-toggle-count");
    for (var c = 0; c < totalCounts.length; c++) totalCounts[c].textContent = total || "";
    if (window.lucide) lucide.createIcons();
  }

  function toggleFilter(kind, value) {
    if (kind === "type") {
      search.toggleTypeFilter(value);
    } else if (kind === "day") {
      search.toggleDayFilter(value);
    } else {
      search.setMaxDistance(search.maxDistance === parseFloat(value) ? 0 : value);
    }
    syncFilterUi();
    update(kind === "distance");
  }

  function activateFilterTab(active) {
    var tabs = document.querySelectorAll(".filter-tab");
    for (var i = 0; i < tabs.length; i++) {
      var panel = document.getElementById(tabs[i].getAttribute("data-panel"));
      tabs[i].setAttribute("aria-selected", tabs[i] === active ? "true" : "false");
      if (panel) panel.hidden = tabs[i] !== active;
    }
  }

  function setDistanceEnabled(enabled) {
    var tab = document.querySelector('.filter-tab[data-panel="distance-filter"]');
    if (!tab) return;
    tab.disabled = !enabled;
    if (!enabled && tab.getAttribute("aria-selected") === "true") {
      activateFilterTab(document.querySelector(".filter-tab"));
    }
  }

  function bindEvents() {
    var searchInput = document.getElementById("search-input");
    var searchInputMobile = document.getElementById("search-input-mobile");
    var filterToggles = document.querySelectorAll("[data-filter-toggle]");
    var filterSection = document.getElementById("filter-section");
    var filterTabs = document.querySelectorAll(".filter-tab");
    var activeFilters = document.getElementById("active-filters");

    function onSearchInput(source, other) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        if (other) other.value = source.value;
        search.setQuery(source.value);
        update(false);
      }, 500);
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        onSearchInput(searchInput, searchInputMobile);
      });
    }
    if (searchInputMobile) {
      searchInputMobile.addEventListener("input", function () {
        onSearchInput(searchInputMobile, searchInput);
      });
    }

    function onFilterToggle() {
      filterSection.hidden = !filterSection.hidden;
      for (var k = 0; k < filterToggles.length; k++) {
        filterToggles[k].setAttribute("aria-expanded", filterSection.hidden ? "false" : "true");
      }
    }
    if (filterSection) {
      for (var f = 0; f < filterToggles.length; f++) {
        filterToggles[f].addEventListener("click", onFilterToggle);
      }
    }

    for (var t = 0; t < filterTabs.length; t++) {
      filterTabs[t].addEventListener("click", function () {
        activateFilterTab(this);
      });
    }

    Object.keys(FILTER_PANELS).forEach(function (kind) {
      var panel = document.getElementById(FILTER_PANELS[kind]);
      if (!panel) return;
      panel.addEventListener("change", function (e) {
        toggleFilter(kind, e.target.value);
      });
    });

    if (activeFilters) {
      activeFilters.addEventListener("click", function (e) {
        var remove = e.target.closest ? e.target.closest(".filter-tag-remove") : null;
        if (remove) toggleFilter(remove.getAttribute("data-filter"), remove.getAttribute("data-value"));
      });
    }

    window.GameClubLocation.init(
      function (lat, lng, label) {
        userLocation = { lat: lat, lng: lng, label: label };
        search.setQuery("");
        if (searchInput) searchInput.value = "";
        if (searchInputMobile) searchInputMobile.value = "";
        search.setUserLocation(lat, lng);
        map.showUserLocation(lat, lng);
        setDistanceEnabled(true);
        update(true);
      },
      function (opts) {
        userLocation = null;
        search.clearUserLocation();
        search.setMaxDistance(0);
        map.removeUserLocation();
        setDistanceEnabled(false);
        syncFilterUi();
        // keepView: the user is mid-pan somewhere else, so don't re-fit the
        // map back to the active country's clubs under them.
        update(!(opts && opts.keepView));
      }
    );
  }

  function escapeHtml(text) {
    if (!text) return "";
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  window.GameClubApp = { localiseClubUrl: localiseClubUrl };

  function initSidebarScroll() {
    var sidebar = document.getElementById("sidebar");
    if (!sidebar) return;
    sidebar.addEventListener("scroll", function () {
      sidebar.classList.toggle("sidebar--scrolled", sidebar.scrollTop > 0);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
      initSidebarScroll();
    });
  } else {
    init();
    initSidebarScroll();
  }
})();
