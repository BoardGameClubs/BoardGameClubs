(function () {
  "use strict";

  var GameClubSearch = {
    allClubs: [],
    searchQuery: "",
    dayFilters: [],
    typeFilters: [],
    maxDistance: 0,
    userLat: null,
    userLng: null,
    earthRadius: 3959,

    init: function (clubs, countryProfile) {
      this.allClubs = clubs;
      var profile = countryProfile || (window.GameClubCountry && window.GameClubCountry.getActive()) || {};
      this.earthRadius = profile.earth_radius || 3959;
      return this;
    },

    setCountry: function (profile) {
      if (!profile) return;
      this.earthRadius = profile.earth_radius || this.earthRadius;
      // Recompute distances since the radius changed (if a user location is set).
      if (this.userLat !== null && this.userLng !== null) {
        var self = this;
        this.allClubs.forEach(function (club) {
          if (club.location && club.location.lat != null && club.location.lng != null) {
            club._distance = self.haversine(self.userLat, self.userLng, club.location.lat, club.location.lng);
          }
        });
      }
    },

    setQuery: function (query) {
      this.searchQuery = query.toLowerCase().trim();
    },

    setDayFilters: function (days) {
      this.dayFilters = days || [];
    },

    toggleDayFilter: function (day) {
      var idx = this.dayFilters.indexOf(day);
      if (idx === -1) {
        this.dayFilters.push(day);
      } else {
        this.dayFilters.splice(idx, 1);
      }
    },

    setTypeFilters: function (types) {
      this.typeFilters = types || [];
    },

    toggleTypeFilter: function (type) {
      var idx = this.typeFilters.indexOf(type);
      if (idx === -1) {
        this.typeFilters.push(type);
      } else {
        this.typeFilters.splice(idx, 1);
      }
    },

    setMaxDistance: function (distance) {
      this.maxDistance = distance ? parseFloat(distance) : 0;
    },

    setUserLocation: function (lat, lng) {
      this.userLat = lat;
      this.userLng = lng;
    },

    clearUserLocation: function () {
      this.userLat = null;
      this.userLng = null;
      this.allClubs.forEach(function (club) {
        delete club._distance;
      });
    },

    // Active-country result set used by the sidebar list — applies all
    // filters (text, type, day, distance) and sorts by distance.
    getFiltered: function () {
      return this.filterClubs(this.allClubs, { applyDistance: true, sortByDistance: true });
    },

    // Cross-country pass for the map: same text/type/day filters, but
    // distance filter and distance sort intentionally skipped so off-country
    // markers stay visible even when the user has set a location in the
    // active country.
    getMapPins: function (allClubsGlobal) {
      return this.filterClubs(allClubsGlobal, { applyDistance: false, sortByDistance: false });
    },

    filterClubs: function (clubs, options) {
      options = options || {};
      var self = this;

      // Compute distances on the provided set only when distance is in play
      // (and only for the active-country list; the map version skips this).
      if (options.applyDistance && self.userLat !== null && self.userLng !== null) {
        clubs.forEach(function (club) {
          if (club.location && club.location.lat != null && club.location.lng != null) {
            club._distance = self.haversine(
              self.userLat,
              self.userLng,
              club.location.lat,
              club.location.lng
            );
          }
        });
      }

      var results = clubs.filter(function (club) {
        if (self.searchQuery) {
          var haystack = [
            club.name,
            club.location.name,
            club.location.address,
            club.description,
            club.days.join(" "),
            (club.type || []).join(" "),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          if (haystack.indexOf(self.searchQuery) === -1) return false;
        }

        if (self.typeFilters.length > 0) {
          var clubTypes = club.type || ["Board Games"];
          var matchesType = false;
          for (var t = 0; t < self.typeFilters.length; t++) {
            if (clubTypes.indexOf(self.typeFilters[t]) !== -1) {
              matchesType = true;
              break;
            }
          }
          if (!matchesType) return false;
        }

        if (self.dayFilters.length > 0) {
          var matchesDay = false;
          for (var i = 0; i < self.dayFilters.length; i++) {
            if (club.days.indexOf(self.dayFilters[i]) !== -1) {
              matchesDay = true;
              break;
            }
          }
          if (!matchesDay) return false;
        }

        if (options.applyDistance && self.maxDistance > 0 && club._distance !== undefined) {
          if (club._distance > self.maxDistance) return false;
        }

        return true;
      });

      if (options.sortByDistance && self.userLat !== null && self.userLng !== null) {
        results.sort(function (a, b) {
          return a._distance - b._distance;
        });
      }

      return results;
    },

    haversine: function (lat1, lng1, lat2, lng2) {
      var R = this.earthRadius;
      var dLat = this.toRad(lat2 - lat1);
      var dLng = this.toRad(lng2 - lng1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRad(lat1)) *
          Math.cos(this.toRad(lat2)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },

    toRad: function (deg) {
      return (deg * Math.PI) / 180;
    },
  };

  window.GameClubSearch = GameClubSearch;
})();
