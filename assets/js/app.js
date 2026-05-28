(function () {
  "use strict";

  var baseurl = window.GameClub ? window.GameClub.baseurl : "";
  var i18n = window.GameClubI18n || {};

  // All clubs across all countries (global JSON). Country filtering happens
  // in JS based on the active country.
  var ALL_CLUBS = [];
  var activeCountry = null;
  var map;
  var search;
  var debounceTimer;
  var initialised = false;

  function getActiveCountry() {
    if (window.GameClubCountry) return window.GameClubCountry.getActive();
    return activeCountry;
  }

  function clubsForCountry(code) {
    return ALL_CLUBS.filter(function (c) { return c.country === code; });
  }

  function init() {
    activeCountry = getActiveCountry();
    map = window.GameClubMap.init(activeCountry);

    fetch(baseurl + "/api/clubs.json")
      .then(function (res) { return res.json(); })
      .then(function (clubs) {
        ALL_CLUBS = clubs;
        var scoped = clubsForCountry(activeCountry.code);
        search = window.GameClubSearch.init(scoped, activeCountry);
        populateDistanceOptions(activeCountry);
        restoreFromUrl();
        update();
        bindEvents();
        initialised = true;
        if (window.GameClubCountry) {
          window.GameClubCountry.onChange(handleCountryChange);
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

    // Re-init search with the new dataset + earth radius.
    search.allClubs = scoped;
    search.setCountry(profile);

    // Tell location.js about the new postcode service / debounce.
    if (window.GameClubLocation && window.GameClubLocation.setCountry) {
      window.GameClubLocation.setCountry(profile);
    }
    updateSearchPlaceholder(profile);

    // Distance dropdown ranges change between countries.
    populateDistanceOptions(profile);

    // update() will call map.fitToMarkers() to frame the new country's clubs
    // — that gives a tighter, more useful view than the static map_center +
    // map_zoom defaults. The defaults are only used as a fallback when no
    // clubs are visible (e.g. an empty result set).
    update();
  }

  function populateDistanceOptions(profile) {
    var distanceFilter = document.getElementById("distance-filter");
    if (!distanceFilter) return;
    var unit = profile.unit_label || "mi";
    var options = profile.distance_options || [5, 10, 25, 50];
    var template = i18n.filter_within_distance || "Within %N% %UNIT%";
    var currentValue = distanceFilter.value;
    var html = '<option value="">' + escapeHtml(i18n.filter_any_distance || "Any distance") + "</option>";
    options.forEach(function (n) {
      html += '<option value="' + n + '">' +
        escapeHtml(template.replace("%N%", n).replace("%UNIT%", unit)) +
        "</option>";
    });
    distanceFilter.innerHTML = html;
    // If the previous value is still valid in the new set, keep it.
    if (currentValue && options.indexOf(parseInt(currentValue, 10)) !== -1) {
      distanceFilter.value = currentValue;
    }
  }

  function updateSearchPlaceholder(profile) {
    // Placeholder lives at the search input. The current label depends on
    // the active postcode service: keep the localised string but make it
    // clear what format is expected.
    var placeholder = i18n.search_placeholder || "";
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
    var distanceFilter = document.getElementById("distance-filter");

    if (params.q) {
      search.setQuery(params.q);
      if (searchInput) searchInput.value = params.q;
      if (searchInputMobile) searchInputMobile.value = params.q;
    }
    if (params.type && params.type.length > 0) {
      search.setTypeFilters(params.type);
      var typeCheckboxes = document.querySelectorAll("#type-filter input[type='checkbox']");
      for (var i = 0; i < typeCheckboxes.length; i++) {
        if (params.type.indexOf(typeCheckboxes[i].value) !== -1) {
          typeCheckboxes[i].checked = true;
        }
      }
      updateTypeFilterLabel();
    }
    if (params.days && params.days.length > 0) {
      search.setDayFilters(params.days);
      var checkboxes = document.querySelectorAll("#day-filter input[type='checkbox']");
      for (var i = 0; i < checkboxes.length; i++) {
        if (params.days.indexOf(checkboxes[i].value) !== -1) {
          checkboxes[i].checked = true;
        }
      }
      updateDayFilterLabel();
    }
    if (params.distance) {
      search.setMaxDistance(params.distance);
      if (distanceFilter) distanceFilter.value = params.distance;
    }
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
    var distanceFilter = document.getElementById("distance-filter");

    var params = new URLSearchParams(window.location.search);
    // Preserve `country` if present (set by the country-selector module).
    var preservedCountry = params.get("country");
    params = new URLSearchParams();
    if (preservedCountry) params.set("country", preservedCountry);

    var q = searchInput ? searchInput.value.trim() : "";
    var days = search.dayFilters.join(",");
    var types = search.typeFilters.join(",");
    var distance = distanceFilter ? distanceFilter.value : "";

    if (q) params.set("q", q);
    if (types) params.set("type", types);
    if (days) params.set("days", days);
    if (distance) params.set("distance", distance);

    var newUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
    history.replaceState(null, "", newUrl);
  }

  function update() {
    var filteredForList = search.getFiltered();
    // Map shows pins from every country (same text/type/day filters applied,
    // distance filter intentionally skipped) so users browsing one country
    // still see clubs in others. The sidebar list stays scoped to the active
    // country to keep units/sort/postcode-search behaviour coherent.
    var pinsForMap = search.getMapPins(ALL_CLUBS);
    map.addClubs(pinsForMap);
    if (!map.userMarker) {
      // Fit to the active country's clubs, not the global pins — otherwise
      // the map would zoom out to span the whole continent on first load.
      map.fitToBounds(filteredForList);
    }
    renderCards(filteredForList);
    updateResultCount(filteredForList.length, search.allClubs.length);
    writeUrlParams();
  }

  function renderCards(clubs) {
    var container = document.getElementById("club-list");
    if (!container) return;

    if (clubs.length === 0) {
      var noResults = i18n.no_results || "No clubs match your search. Try a different filter or search term.";
      container.innerHTML =
        '<p style="color:#555;text-align:center;padding:2rem 0;">' + escapeHtml(noResults) + '</p>';
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
          escapeHtml(club.url) +
          '">' +
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
          "</a>"
        );
      })
      .join("");

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

  function updateDayFilterLabel() {
    var label = document.querySelector("#day-filter .multi-select-label");
    if (!label) return;
    var days = search.dayFilters;
    if (days.length === 0) {
      label.textContent = i18n.filter_all_days || "All days";
    } else if (days.length === 1) {
      label.textContent = days[0];
    } else {
      label.textContent = (i18n.days_selected || "%N% days selected").replace("%N%", days.length);
    }
  }

  function updateTypeFilterLabel() {
    var label = document.querySelector("#type-filter .multi-select-label");
    if (!label) return;
    var types = search.typeFilters;
    if (types.length === 0) {
      label.textContent = i18n.filter_all_types || "All types";
    } else if (types.length === 1) {
      label.textContent = types[0];
    } else {
      label.textContent = (i18n.types_selected || "%N% types selected").replace("%N%", types.length);
    }
  }

  function bindEvents() {
    var searchInput = document.getElementById("search-input");
    var searchInputMobile = document.getElementById("search-input-mobile");
    var typeFilterEl = document.getElementById("type-filter");
    var typeToggle = typeFilterEl ? typeFilterEl.querySelector(".multi-select-toggle") : null;
    var typeCheckboxes = typeFilterEl ? typeFilterEl.querySelectorAll("input[type='checkbox']") : [];
    var dayFilterEl = document.getElementById("day-filter");
    var dayToggle = dayFilterEl ? dayFilterEl.querySelector(".multi-select-toggle") : null;
    var dayCheckboxes = dayFilterEl ? dayFilterEl.querySelectorAll("input[type='checkbox']") : [];
    var distanceFilter = document.getElementById("distance-filter");

    function onSearchInput(source, other) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        if (other) other.value = source.value;
        search.setQuery(source.value);
        update();
      }, 200);
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

    if (typeToggle) {
      typeToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        if (dayFilterEl) {
          dayFilterEl.classList.remove("is-open");
          if (dayToggle) dayToggle.setAttribute("aria-expanded", "false");
        }
        var isOpen = typeFilterEl.classList.toggle("is-open");
        typeToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    for (var t = 0; t < typeCheckboxes.length; t++) {
      typeCheckboxes[t].addEventListener("change", function () {
        search.toggleTypeFilter(this.value);
        updateTypeFilterLabel();
        update();
      });
    }

    if (dayToggle) {
      dayToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        if (typeFilterEl) {
          typeFilterEl.classList.remove("is-open");
          if (typeToggle) typeToggle.setAttribute("aria-expanded", "false");
        }
        var isOpen = dayFilterEl.classList.toggle("is-open");
        dayToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    for (var i = 0; i < dayCheckboxes.length; i++) {
      dayCheckboxes[i].addEventListener("change", function () {
        search.toggleDayFilter(this.value);
        updateDayFilterLabel();
        update();
      });
    }

    document.addEventListener("click", function (e) {
      if (typeFilterEl && !typeFilterEl.contains(e.target)) {
        typeFilterEl.classList.remove("is-open");
        if (typeToggle) typeToggle.setAttribute("aria-expanded", "false");
      }
      if (dayFilterEl && !dayFilterEl.contains(e.target)) {
        dayFilterEl.classList.remove("is-open");
        if (dayToggle) dayToggle.setAttribute("aria-expanded", "false");
      }
    });

    if (distanceFilter) {
      distanceFilter.addEventListener("change", function () {
        search.setMaxDistance(distanceFilter.value);
        update();
      });
    }

    window.GameClubLocation.init(
      function (lat, lng, label) {
        search.setQuery("");
        if (searchInput) searchInput.value = "";
        if (searchInputMobile) searchInputMobile.value = "";
        search.setUserLocation(lat, lng);
        map.showUserLocation(lat, lng);
        if (distanceFilter) distanceFilter.disabled = false;
        update();
      },
      function () {
        search.clearUserLocation();
        search.setMaxDistance(0);
        map.removeUserLocation();
        if (distanceFilter) {
          distanceFilter.value = "";
          distanceFilter.disabled = true;
        }
        update();
      }
    );
  }

  function escapeHtml(text) {
    if (!text) return "";
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

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
