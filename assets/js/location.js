(function () {
  "use strict";

  var GameClubLocation = {
    input: null,
    inputMobile: null,
    suggestions: null,
    suggestionsMobile: null,
    pill: null,
    pillLabel: null,
    clearBtn: null,
    locateBtn: null,
    locateBtnHeader: null,
    debounceTimer: null,
    onLocationSet: null,
    onLocationClear: null,
    activeLabel: null,

    // Country-driven; populated by setCountry().
    postcodeRegex: /^[A-Z]{1,2}\d/i,
    postcodeService: "postcodes_io",
    geocodeCountryCode: "GB",
    debounceMs: 300,

    init: function (onLocationSet, onLocationClear) {
      this.onLocationSet = onLocationSet;
      this.onLocationClear = onLocationClear;

      var profile = (window.GameClubCountry && window.GameClubCountry.getActive()) || {};
      this.setCountry(profile);

      this.input = document.getElementById("search-input");
      this.inputMobile = document.getElementById("search-input-mobile");
      this.suggestions = document.getElementById("location-suggestions");
      this.suggestionsMobile = document.getElementById("location-suggestions-mobile");
      this.pill = document.getElementById("location-pill");
      this.pillLabel = document.getElementById("location-pill-label");
      this.clearBtn = document.getElementById("location-clear");
      this.locateBtn = document.getElementById("locate-btn");
      this.locateBtnHeader = document.getElementById("locate-btn-header");

      if (!this.input && !this.inputMobile) return this;

      this.bindEvents();
      return this;
    },

    setCountry: function (profile) {
      if (!profile) return;
      if (profile.postcode) {
        if (profile.postcode.regex) {
          try {
            this.postcodeRegex = new RegExp(profile.postcode.regex, "i");
          } catch (e) {}
        }
        if (profile.postcode.service) {
          this.postcodeService = profile.postcode.service;
        }
      }
      if (profile.geocode_country_code) {
        this.geocodeCountryCode = profile.geocode_country_code;
      }
      // Nominatim usage policy: ~1 req/sec. Bump the debounce on its path.
      this.debounceMs = this.postcodeService === "nominatim" ? 1100 : 300;
    },

    // Given a user-typed string, return the country profiles whose postcode
    // regex matches it. Postcode formats aren't unique — a 5-digit US ZIP is
    // also a valid DE/IT/FR/ES/… code — so:
    // - if the active country's format matches, return only the active
    //   profile: a valid local code must never switch the country;
    // - otherwise return every match. One match → the caller auto-switches
    //   (e.g. a UK user typing a Canadian code). Several → the caller looks
    //   the code up in all of them and lets the user pick.
    detectCountriesFromQuery: function (query) {
      var countries = window.GameClubCountries || {};
      var activeCode = window.GameClubCountry &&
        window.GameClubCountry.getActiveCode &&
        window.GameClubCountry.getActiveCode();
      var active = activeCode && countries[activeCode.toLowerCase()];
      if (active && active.postcode && active.postcode.regex) {
        try {
          if (new RegExp(active.postcode.regex, "i").test(query)) return [active];
        } catch (e) {}
      }
      var matches = [];
      for (var k in countries) {
        var p = countries[k];
        if (!p || !p.postcode || !p.postcode.regex) continue;
        try {
          if (new RegExp(p.postcode.regex, "i").test(query)) matches.push(p);
        } catch (e) {}
      }
      return matches;
    },

    bindInputEvents: function (input, suggestionsEl) {
      var self = this;
      if (!input || !suggestionsEl) return;

      input.addEventListener("input", function () {
        clearTimeout(self.debounceTimer);
        var query = input.value.trim();
        if (query.length < 2) {
          self.hideSuggestionsEl(suggestionsEl);
          return;
        }

        var matchingProfiles = self.detectCountriesFromQuery(query);
        var isPostcode = matchingProfiles.length > 0;
        var isAmbiguous = matchingProfiles.length > 1;

        // Unambiguous foreign postcode: switch country. The country-change
        // callback in app.js re-initialises us with the new profile; we then
        // run the lookup against the new service. An ambiguous format (shared
        // by several countries) doesn't switch — we look it up everywhere it
        // could be and the picked suggestion decides (selectSuggestion).
        if (isPostcode && !isAmbiguous) {
          var activeCode = window.GameClubCountry && window.GameClubCountry.getActiveCode();
          if (matchingProfiles[0].code !== activeCode) {
            window.GameClubCountry.setActive(matchingProfiles[0].code, {
              persist: false,        // don't clobber the user's saved choice
              updateUrl: true,
              replaceUrl: false
            });
          }
        }

        // Non-postcode queries (e.g. "Berlin") use the Nominatim place-name
        // path against the active country so users still get a location pin
        // and distance-to-club ordering.
        if (!isPostcode && !self.isPlaceLikeQuery(query)) {
          self.hideSuggestionsEl(suggestionsEl);
          return;
        }

        self.showLoadingIn(suggestionsEl);

        // Everything except the single-country postcodes.io path hits
        // Nominatim (~1 req/s policy).
        var delay = (isPostcode && !isAmbiguous) ? self.debounceMs : 1100;
        self.debounceTimer = setTimeout(function () {
          if (isAmbiguous) {
            self.fetchPostcodeMulti(query, matchingProfiles, suggestionsEl, input);
          } else if (isPostcode) {
            self.fetchSuggestionsFor(query, suggestionsEl, input);
          } else {
            self.fetchPlaceName(query, suggestionsEl, input);
          }
        }, delay);
      });

      input.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          self.hideSuggestionsEl(suggestionsEl);
          return;
        }
        if (e.key === "Enter") {
          var query = input.value.trim();
          if (!query) return;
          // If the dropdown already has suggestions, pick the first one.
          var firstBtn = suggestionsEl.querySelector(".location-suggestion");
          if (firstBtn) {
            e.preventDefault();
            firstBtn.click();
            return;
          }
          // Otherwise force a place-name lookup so typing "Berlin"+Enter
          // sets a location even if no dropdown was shown yet (e.g. the
          // user hit Enter inside the debounce window).
          if (self.detectCountriesFromQuery(query).length === 0 && self.isPlaceLikeQuery(query)) {
            e.preventDefault();
            clearTimeout(self.debounceTimer);
            self.showLoadingIn(suggestionsEl);
            self.fetchPlaceName(query, suggestionsEl, input);
          }
        }
      });

      document.addEventListener("click", function (e) {
        if (
          suggestionsEl &&
          !input.contains(e.target) &&
          !suggestionsEl.contains(e.target)
        ) {
          self.hideSuggestionsEl(suggestionsEl);
        }
      });
    },

    bindEvents: function () {
      var self = this;

      this.bindInputEvents(this.input, this.suggestions);
      this.bindInputEvents(this.inputMobile, this.suggestionsMobile);

      if (this.clearBtn) {
        this.clearBtn.addEventListener("click", function () {
          self.clearLocation();
        });
      }

      if (this.locateBtn) {
        this.locateBtn.addEventListener("click", function () {
          self.geolocate();
        });
      }

      if (this.locateBtnHeader) {
        this.locateBtnHeader.addEventListener("click", function () {
          self.geolocate();
        });
      }
    },

    fetchSuggestionsFor: function (query, suggestionsEl, input) {
      if (this.postcodeService === "nominatim") {
        this.fetchNominatim(query, suggestionsEl, input);
      } else {
        this.fetchPostcodesIo(query, suggestionsEl, input);
      }
    },

    // A postcode format shared by several countries (none of them the active
    // one): look it up in all of them at once and label each hit with its
    // country. Picking a suggestion switches the active country via the
    // countryCode handling in selectSuggestion.
    fetchPostcodeMulti: function (query, profiles, suggestionsEl, input) {
      var self = this;
      var codes = [];
      for (var i = 0; i < profiles.length; i++) {
        var c = profiles[i].geocode_country_code || profiles[i].code;
        if (c) codes.push(c.toLowerCase());
      }
      var url = "https://nominatim.openstreetmap.org/search" +
        "?postalcode=" + encodeURIComponent(query) +
        "&countrycodes=" + encodeURIComponent(codes.join(",")) +
        "&format=json&limit=8&addressdetails=1";
      fetch(url, {
        headers: { "Accept": "application/json" }
      })
        .then(function (res) { return res.json(); })
        .then(function (results) {
          if (!Array.isArray(results) || results.length === 0) {
            self.hideSuggestionsEl(suggestionsEl);
            return;
          }
          var seen = {};
          var suggestions = [];
          for (var i = 0; i < results.length; i++) {
            var r = results[i];
            var lat = parseFloat(r.lat);
            var lng = parseFloat(r.lon);
            if (isNaN(lat) || isNaN(lng)) continue;
            var addr = r.address || {};
            var country = (addr.country_code || "").toUpperCase();
            var place = addr.city || addr.town || addr.village ||
                        addr.municipality || addr.county || "";
            var label = query + (place ? " · " + place : "") +
                        (country ? " (" + country + ")" : "");
            if (seen[label]) continue;
            seen[label] = true;
            suggestions.push({
              label: label,
              lookup: null,
              lat: lat,
              lng: lng,
              countryCode: country
            });
          }
          if (suggestions.length === 0) {
            self.hideSuggestionsEl(suggestionsEl);
            return;
          }
          self.showSuggestionsIn(suggestions, suggestionsEl, input);
        })
        .catch(function () {
          self.hideSuggestionsEl(suggestionsEl);
        });
    },

    fetchPostcodesIo: function (query, suggestionsEl, input) {
      var self = this;
      fetch("https://api.postcodes.io/postcodes/" + encodeURIComponent(query) + "/autocomplete")
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.result && data.result.length > 0) {
            var suggestions = data.result.map(function (pc) {
              return { label: pc, lookup: pc };
            });
            self.showSuggestionsIn(suggestions, suggestionsEl, input);
          } else {
            self.hideSuggestionsEl(suggestionsEl);
          }
        })
        .catch(function () {
          self.hideSuggestionsEl(suggestionsEl);
        });
    },

    // Heuristic for a plausible place name: has a letter and is long enough
    // to be worth a geocoder hit. Avoids triggering on "1", "ab" and so on.
    isPlaceLikeQuery: function (query) {
      if (!query || query.length < 3) return false;
      return /[A-Za-zÀ-ÿ]/.test(query);
    },

    // Country codes (upper-case) we have datasets for. Used to filter
    // place-name results so we don't suggest cities with no clubs.
    supportedCountryCodes: function () {
      var codes = [];
      var countries = window.GameClubCountries || {};
      for (var k in countries) {
        if (countries[k] && countries[k].geocode_country_code) {
          codes.push(countries[k].geocode_country_code.toUpperCase());
        }
      }
      return codes;
    },

    fetchPlaceName: function (query, suggestionsEl, input) {
      var self = this;
      // Nominatim rejects 'q' combined with structured filters like 'country',
      // so don't pre-filter by country — drop unsupported countries client-side
      // and let selection switch the active country if needed.
      var url = "https://nominatim.openstreetmap.org/search" +
        "?q=" + encodeURIComponent(query) +
        "&format=json&limit=8&addressdetails=1";
      fetch(url, {
        headers: { "Accept": "application/json" }
      })
        .then(function (res) { return res.json(); })
        .then(function (results) {
          if (!Array.isArray(results) || results.length === 0) {
            self.hideSuggestionsEl(suggestionsEl);
            return;
          }
          var supported = self.supportedCountryCodes();
          var seen = {};
          var suggestions = [];
          for (var i = 0; i < results.length; i++) {
            var r = results[i];
            var lat = parseFloat(r.lat);
            var lng = parseFloat(r.lon);
            if (isNaN(lat) || isNaN(lng)) continue;
            var addr = r.address || {};
            var country = (addr.country_code || "").toUpperCase();
            if (supported.length && supported.indexOf(country) === -1) continue;
            var place = addr.city || addr.town || addr.village ||
                        addr.municipality || addr.county || "";
            var region = addr.state || addr.region || "";
            var label = place || (r.display_name || "").split(",")[0];
            if (region && region !== label) label += ", " + region;
            if (country) label += " (" + country + ")";
            if (!label || seen[label]) continue;
            seen[label] = true;
            suggestions.push({
              label: label,
              lookup: null,
              lat: lat,
              lng: lng,
              countryCode: country
            });
          }
          if (suggestions.length === 0) {
            self.hideSuggestionsEl(suggestionsEl);
            return;
          }
          self.showSuggestionsIn(suggestions, suggestionsEl, input);
        })
        .catch(function () {
          self.hideSuggestionsEl(suggestionsEl);
        });
    },

    fetchNominatim: function (query, suggestionsEl, input) {
      var self = this;
      var url = "https://nominatim.openstreetmap.org/search" +
        "?postalcode=" + encodeURIComponent(query) +
        "&country=" + encodeURIComponent(self.geocodeCountryCode) +
        "&format=json&limit=5&addressdetails=1";
      fetch(url, {
        headers: { "Accept": "application/json" }
      })
        .then(function (res) { return res.json(); })
        .then(function (results) {
          if (!Array.isArray(results) || results.length === 0) {
            self.hideSuggestionsEl(suggestionsEl);
            return;
          }
          var seen = {};
          var suggestions = [];
          for (var i = 0; i < results.length; i++) {
            var r = results[i];
            var place = (r.address && (r.address.city || r.address.town ||
                          r.address.village || r.address.municipality)) || "";
            var label = query + (place ? " · " + place : "");
            if (seen[label]) continue;
            seen[label] = true;
            suggestions.push({
              label: label,
              lookup: null,
              lat: parseFloat(r.lat),
              lng: parseFloat(r.lon)
            });
          }
          self.showSuggestionsIn(suggestions, suggestionsEl, input);
        })
        .catch(function () {
          self.hideSuggestionsEl(suggestionsEl);
        });
    },

    showLoadingIn: function (suggestionsEl) {
      if (!suggestionsEl) return;
      if (suggestionsEl.querySelector(".location-suggestion-loading")) return;
      var i18n = window.GameClubI18n || {};
      suggestionsEl.innerHTML =
        '<div class="location-suggestion-loading" role="status" aria-live="polite">' +
          '<span class="location-spinner-ring"></span>' +
          '<span>' + this.escapeHtml(i18n.searching || "Searching…") + '</span>' +
        '</div>';
      suggestionsEl.classList.add("is-visible");
    },

    showSuggestionsIn: function (suggestions, suggestionsEl, input) {
      var self = this;
      suggestionsEl.innerHTML = suggestions
        .map(function (s, i) {
          return '<button class="location-suggestion" type="button" data-idx="' + i + '">' +
            '<i data-lucide="map-pin" style="width:14px;height:14px;"></i>' +
            self.escapeHtml(s.label) + '</button>';
        })
        .join("");

      suggestionsEl.classList.add("is-visible");

      if (window.lucide) lucide.createIcons();

      var buttons = suggestionsEl.querySelectorAll(".location-suggestion");
      for (var i = 0; i < buttons.length; i++) {
        (function (idx) {
          buttons[idx].addEventListener("click", function () {
            self.selectSuggestion(suggestions[idx]);
          });
        })(i);
      }
    },

    hideSuggestionsEl: function (el) {
      if (!el) return;
      el.innerHTML = "";
      el.classList.remove("is-visible");
    },

    hideAllSuggestions: function () {
      this.hideSuggestionsEl(this.suggestions);
      this.hideSuggestionsEl(this.suggestionsMobile);
    },

    selectSuggestion: function (suggestion) {
      var self = this;
      if (this.input) this.input.value = "";
      if (this.inputMobile) this.inputMobile.value = "";
      this.hideAllSuggestions();

      if (suggestion.lat !== undefined && suggestion.lng !== undefined && suggestion.lat !== null) {
        // If the picked place is in a different supported country, switch
        // active country first so the resulting distance list is meaningful.
        if (suggestion.countryCode && window.GameClubCountry) {
          var activeCode = window.GameClubCountry.getActiveCode &&
                           window.GameClubCountry.getActiveCode();
          if (activeCode && suggestion.countryCode !== activeCode) {
            window.GameClubCountry.setActive(suggestion.countryCode, {
              persist: false,
              updateUrl: true,
              replaceUrl: false
            });
          }
        }
        self.setActive(suggestion.label);
        if (self.onLocationSet) {
          self.onLocationSet(suggestion.lat, suggestion.lng, suggestion.label);
        }
        return;
      }

      fetch("https://api.postcodes.io/postcodes/" + encodeURIComponent(suggestion.lookup))
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.result) {
            self.setActive(suggestion.label);
            if (self.onLocationSet) {
              self.onLocationSet(data.result.latitude, data.result.longitude, suggestion.label);
            }
          }
        })
        .catch(function (err) {
          console.error("Failed to look up postcode:", err);
        });
    },

    setLocateBtnsDisabled: function (disabled) {
      if (this.locateBtn) this.locateBtn.disabled = disabled;
      if (this.locateBtnHeader) this.locateBtnHeader.disabled = disabled;
    },

    geolocate: function () {
      var self = this;
      var i18n = window.GameClubI18n || {};

      if (!navigator.geolocation) {
        alert(i18n.geolocation_unsupported || "Geolocation is not supported by your browser.");
        return;
      }

      self.setLocateBtnsDisabled(true);

      navigator.geolocation.getCurrentPosition(
        function (pos) {
          var lat = pos.coords.latitude;
          var lng = pos.coords.longitude;
          var label = i18n.my_location || "My location";
          self.setActive(label);
          self.setLocateBtnsDisabled(false);

          if (self.onLocationSet) {
            self.onLocationSet(lat, lng, label);
          }
        },
        function () {
          self.setLocateBtnsDisabled(false);
          alert(i18n.geolocation_failed || "Unable to retrieve your location.");
        }
      );
    },

    setActive: function (label) {
      this.activeLabel = label;
      if (this.pill) {
        this.pillLabel.textContent = label;
        this.pill.style.display = "";
      }
    },

    clearLocation: function () {
      this.activeLabel = null;
      if (this.pill) {
        this.pill.style.display = "none";
      }
      if (this.onLocationClear) {
        this.onLocationClear();
      }
    },

    getActiveLabel: function () {
      return this.activeLabel;
    },

    escapeHtml: function (text) {
      if (!text) return "";
      var div = document.createElement("div");
      div.appendChild(document.createTextNode(text));
      return div.innerHTML;
    },
  };

  window.GameClubLocation = GameClubLocation;
})();
