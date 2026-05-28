(function () {
  "use strict";

  var typeColors = {
    "Board Games": "#3b82f6",
    "RPG": "#8b5cf6",
    "Wargames": "#ef4444",
    "BOTC": "#ec4899",
    "TCG": "#f59e0b"
  };

  var typeIcons = {
    "Board Games": '<rect width="12" height="12" x="2" y="10" rx="2" ry="2"/><path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6"/><path d="M6 18h.01"/><path d="M10 14h.01"/><path d="M15 6h.01"/><path d="M18 9h.01"/>',
    "RPG": '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>',
    "Wargames": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    "BOTC": '<path d="m12.5 17-.5-1-.5 1h1z"/><path d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="12" r="1"/>',
    "TCG": '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>'
  };

  function getTypeColor(club) {
    var types = club.type || ["Board Games"];
    return typeColors[types[0]] || typeColors["Board Games"];
  }

  function getTypeIcon(club) {
    var types = club.type || ["Board Games"];
    return typeIcons[types[0]] || typeIcons["Board Games"];
  }

  function createPinIcon(color, iconSvg) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="46" viewBox="0 0 31 46">' +
      '<path d="M15.5 0C6.9 0 0 6.9 0 15.5C0 27.1 15.5 46 15.5 46S31 27.1 31 15.5C31 6.9 24.1 0 15.5 0z" fill="' + color + '"/>' +
      '<svg x="7" y="7" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + iconSvg + '</svg>' +
      '</svg>';
    return L.divIcon({
      html: svg,
      className: "map-pin-icon",
      iconSize: [31, 46],
      iconAnchor: [15, 46],
      popupAnchor: [1, -38]
    });
  }

  var GameClubMap = {
    map: null,
    markers: null,
    markerMap: {},
    userMarker: null,

    init: function (countryProfile) {
      var profile = countryProfile || (window.GameClubCountry && window.GameClubCountry.getActive()) || {};
      var center = profile.map_center || [53.8, -1.58];
      var zoom = profile.map_zoom || 9;

      this.map = L.map("map").setView(center, zoom);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(this.map);

      this.markers = L.markerClusterGroup({
        maxClusterRadius: 40,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
      });

      this.map.addLayer(this.markers);

      this.map.on("popupopen", function () {
        if (window.lucide) lucide.createIcons();
      });

      return this;
    },

    // Recentre to a country profile (e.g. after the user switches country).
    recenterToCountry: function (profile) {
      if (!this.map || !profile) return;
      this.map.setView(profile.map_center, profile.map_zoom, { animate: true });
    },

    addClubs: function (clubs) {
      var self = this;
      this.markers.clearLayers();
      this.markerMap = {};

      clubs.forEach(function (club) {
        if (!club.location.lat || !club.location.lng) return;

        var tags = "";
        var clubTypes = club.type || ["Board Games"];
        clubTypes.forEach(function (t) {
          var cls = "tag tag-type tag-type-" + t.toLowerCase().replace(/ /g, "-");
          tags += '<span class="' + cls + '">' + self.escapeHtml(t) + "</span>";
        });

        if (club.cost) {
          tags += '<span class="tag tag-cost">' + self.escapeHtml(club.cost) + "</span>";
        }

        var popupIcon = "";
        if (club.image) {
          var baseurl = window.GameClub ? window.GameClub.baseurl : "";
          var imgSrc = club.image.indexOf("://") !== -1
            ? self.escapeHtml(club.image)
            : baseurl + "/assets/images/clubs/" + encodeURIComponent(club.image);
          popupIcon = '<div class="popup-icon-wrap"><img src="' + imgSrc + '" alt="" onload="window.GameClub.applyImgBg(this)"></div>';
        }

        var venue = club.location && club.location.name
          ? '<div class="popup-venue"><i data-lucide="map-pin"></i><span>' + self.escapeHtml(club.location.name) + '</span></div>'
          : '';

        var daysText = club.days.join(", ");
        if (club.frequency && club.frequency !== "Weekly") {
          daysText += " · " + club.frequency;
        }
        var daysLine = '<div class="popup-days"><i data-lucide="calendar"></i><span>' + self.escapeHtml(daysText) + '</span></div>';

        var popupContent =
          '<a class="popup-card" href="' + club.url + '">' +
          '<div class="popup-body">' +
          popupIcon +
          '<div class="popup-content">' +
          '<div class="popup-name">' +
          self.escapeHtml(club.name) +
          "</div>" +
          venue +
          daysLine +
          "</div>" +
          "</div>" +
          '<div class="popup-tags">' +
          tags +
          "</div>" +
          "</a>";

        var pinIcon = createPinIcon(getTypeColor(club), getTypeIcon(club));
        var marker = L.marker([club.location.lat, club.location.lng], { icon: pinIcon }).bindPopup(
          popupContent
        );

        self.markers.addLayer(marker);
        self.markerMap[club.slug] = marker;
      });
    },

    fitToMarkers: function () {
      if (this.markers.getLayers().length > 0) {
        this.map.fitBounds(this.markers.getBounds(), { padding: [30, 30] });
      }
    },

    // Frame the map around a specific subset of clubs (e.g. just the active
    // country's clubs) even when the marker layer contains more. Falls back
    // to country defaults when the subset is empty or too small to make a
    // meaningful bounds (a single pin would zoom in past the country view).
    fitToBounds: function (clubs) {
      var coords = [];
      for (var i = 0; i < clubs.length; i++) {
        var c = clubs[i];
        if (c && c.location && c.location.lat != null && c.location.lng != null) {
          coords.push([c.location.lat, c.location.lng]);
        }
      }
      var profile = (window.GameClubCountry && window.GameClubCountry.getActive()) || null;
      if (coords.length < 3) {
        // 0, 1, or 2 clubs: country framing is more useful than a tight zoom.
        if (profile) this.recenterToCountry(profile);
        return;
      }
      this.map.fitBounds(L.latLngBounds(coords), { padding: [30, 30] });
    },

    removeUserLocation: function () {
      if (this.userMarker) {
        this.map.removeLayer(this.userMarker);
        this.userMarker = null;
      }
    },

    showUserLocation: function (lat, lng) {
      if (this.userMarker) {
        this.map.removeLayer(this.userMarker);
      }

      var icon = L.divIcon({
        className: "user-location-marker",
        html: '<div class="user-pulse"></div><div class="user-dot"></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -12]
      });

      this.userMarker = L.marker([lat, lng], { icon: icon, zIndexOffset: 1000 })
        .addTo(this.map)
        .bindPopup("You are here");

      var bounds = this.markers.getBounds();
      if (bounds.isValid()) {
        bounds.extend([lat, lng]);
        this.map.fitBounds(bounds, { padding: [30, 30] });
      } else {
        this.map.setView([lat, lng], 12);
      }
    },

    escapeHtml: function (text) {
      if (!text) return "";
      var div = document.createElement("div");
      div.appendChild(document.createTextNode(text));
      return div.innerHTML;
    },

    invalidateSize: function () {
      if (this.map) {
        this.map.invalidateSize();
      }
    },
  };

  window.GameClubMap = GameClubMap;
  window.GameClubMap.createPinIcon = createPinIcon;
  window.GameClubMap.typeColors = typeColors;
  window.GameClubMap.typeIcons = typeIcons;
})();
