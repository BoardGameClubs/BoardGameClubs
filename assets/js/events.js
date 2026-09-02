(function () {
  "use strict";

  // Events calendar (/events/) and shared date helpers for event detail pages.
  //
  // The calendar fetches /api/events.json once, scopes it to the active
  // country (window.GameClubCountry) and re-renders in place when the nav
  // globe changes country; country changes never navigate. Dates are ISO
  // "YYYY-MM-DD" strings; Intl.DateTimeFormat renders month names in the
  // page language so there are no per-language month tables.

  var baseurl = window.GameClub ? window.GameClub.baseurl : "";
  var lang = (window.GameClub && window.GameClub.language) || "en";
  // Full locales so Intl picks the regional convention (a bare "en" would
  // render US-style "Mar 14, 2027"; the site's English is en-GB).
  var LOCALES = { en: "en-GB", de: "de-DE", it: "it-IT", fr: "fr-FR", es: "es-ES", pl: "pl-PL" };
  var locale = LOCALES[lang] || lang;
  var i18n = window.GameClubEventsI18n || {};
  var ALL_EVENTS = [];

  function escapeHtml(text) {
    if (!text) return "";
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  function langPrefix() {
    return lang === "en" ? "" : "/" + lang;
  }

  // "/events/<slug>/" → "/<lang>/events/<slug>/" (every event exists at every
  // language URL, see _plugins/language_clones.rb).
  function localiseUrl(url) {
    var prefix = langPrefix();
    if (!prefix || !url) return url;
    var idx = url.indexOf("/events/");
    if (idx === -1) return url;
    return url.slice(0, idx) + prefix + url.slice(idx);
  }

  function todayIso() {
    var d = new Date();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  }

  // Parse "YYYY-MM-DD" as a local date (avoids the UTC shift of Date.parse).
  function parseIso(iso) {
    var p = String(iso).split("-");
    return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
  }

  function fmt(date, opts) {
    try {
      return new Intl.DateTimeFormat(locale, opts).format(date);
    } catch (e) {
      return date.toDateString();
    }
  }

  // "11-14 Mar 2027", "30 Dec 2026 - 2 Jan 2027", "4.-6. Juni 2027": Intl's
  // formatRange collapses shared parts per locale. Single-day events render
  // as one full date. Fallback (old browsers) is two full dates.
  function formatDateRange(startIso, endIso, long) {
    var start = parseIso(startIso);
    var end = parseIso(endIso || startIso);
    var opts = { day: "numeric", month: long ? "long" : "short", year: "numeric" };
    if (start.getTime() === end.getTime()) {
      return fmt(start, opts);
    }
    try {
      var f = new Intl.DateTimeFormat(locale, opts);
      // Intl joins ranges with an en dash; house style is a plain hyphen.
      if (typeof f.formatRange === "function") return f.formatRange(start, end).replace(/[\u2013\u2014]/g, "-");
    } catch (e) {}
    return fmt(start, opts) + " - " + fmt(end, opts);
  }

  function formatMonthHeading(yyyymm) {
    var p = yyyymm.split("-");
    return fmt(new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, 1), { month: "long", year: "numeric" });
  }

  function localiseDateSpans() {
    var spans = document.querySelectorAll("[data-event-dates]");
    for (var i = 0; i < spans.length; i++) {
      var s = spans[i];
      var start = s.getAttribute("data-start");
      var end = s.getAttribute("data-end");
      if (!start) continue;
      s.textContent = formatDateRange(start, end, s.getAttribute("data-long") === "1");
    }
  }

  function getActiveCode() {
    if (window.GameClubCountry && window.GameClubCountry.getActiveCode) {
      return window.GameClubCountry.getActiveCode();
    }
    return (window.GameClub && window.GameClub.defaultCountryCode) || "GB";
  }

  function countryLabel(code) {
    if (window.GameClubCountry && window.GameClubCountry.getCountryLabel) {
      return window.GameClubCountry.getCountryLabel(code);
    }
    return code;
  }

  function contributeUrl() {
    return "https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=add-event.yml";
  }

  function renderCard(ev, past) {
    // Date block: "11-14 / Mar" for a same-month range, "30-2 / Dec-Jan"
    // across a month boundary, "4 / Jun" for a single day.
    var start = parseIso(ev.start_date);
    var end = parseIso(ev.end_date || ev.start_date);
    var multi = end.getTime() !== start.getTime();
    var day = fmt(start, { day: "numeric" });
    var mon = fmt(start, { month: "short" });
    if (multi) {
      day += "-" + fmt(end, { day: "numeric" });
      if (end.getMonth() !== start.getMonth() || end.getFullYear() !== start.getFullYear()) {
        mon += "-" + fmt(end, { month: "short" });
      }
    }

    var image = "";
    if (ev.image) {
      var imgSrc = ev.image.indexOf("://") !== -1
        ? escapeHtml(ev.image)
        : baseurl + "/assets/images/events/" + encodeURIComponent(ev.image);
      image = '<div class="event-card-icon"><img src="' + imgSrc + '" alt="" loading="lazy"></div>';
    }

    var tags = "";
    if (ev.format) {
      var fmtLabel = i18n["event_format_" + ev.format.toLowerCase().replace(/ /g, "_")] || ev.format;
      tags += '<span class="tag tag-format">' + escapeHtml(fmtLabel) + "</span>";
    }
    (ev.type || []).forEach(function (t) {
      tags += '<span class="tag tag-type tag-type-' + t.toLowerCase().replace(/ /g, "-") + '">' + escapeHtml(t) + "</span>";
    });
    if (ev.price) tags += '<span class="tag tag-cost">' + escapeHtml(ev.price) + "</span>";
    if (ev.tickets) tags += '<span class="tag tag-tickets"><i data-lucide="ticket"></i>' + escapeHtml(i18n.tickets || "Tickets") + "</span>";

    var venue = ev.location && ev.location.name
      ? '<div class="club-venue"><i data-lucide="map-pin"></i><span>' + escapeHtml(ev.location.name) + "</span></div>"
      : "";
    var dates = '<div class="club-days"><i data-lucide="calendar"></i><span>' + escapeHtml(formatDateRange(ev.start_date, ev.end_date, false)) + "</span></div>";

    return (
      '<a class="event-card' + (past ? " event-card-past" : "") + '" href="' + escapeHtml(localiseUrl(ev.url)) + '">' +
        '<div class="event-card-date' + (multi ? " event-card-date-multi" : "") + '">' +
          '<span class="event-card-day">' + escapeHtml(day) + "</span>" +
          '<span class="event-card-month">' + escapeHtml(mon) + "</span>" +
        "</div>" +
        image +
        '<div class="event-card-content">' +
          '<div class="event-card-name">' + escapeHtml(ev.name) + "</div>" +
          '<div class="club-card-meta">' + venue + dates + "</div>" +
          (tags ? '<div class="club-tags">' + tags + "</div>" : "") +
        "</div>" +
      "</a>"
    );
  }

  // Pill links that jump to later month sections. The first month is always
  // in view already, so it gets no link; the nav only appears once there are
  // at least three months. Labels show the year only once it differs from
  // the first month's.
  function renderMonthNav(months) {
    if (months.length < 3) return "";
    var firstYear = months[0].slice(0, 4);
    var links = months.slice(1).map(function (month) {
      var p = month.split("-");
      var d = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, 1);
      var opts = month.slice(0, 4) === firstYear ? { month: "short" } : { month: "short", year: "numeric" };
      return '<a href="#events-month-' + month + '" data-month-target="events-month-' + month + '">' + escapeHtml(fmt(d, opts)) + "</a>";
    });
    return (
      '<div class="events-month-nav-label" aria-hidden="true">' + escapeHtml(i18n.events_jump_label || "Jump to") + "</div>" +
      '<nav class="events-month-nav" aria-label="' + escapeHtml(i18n.events_jump || "Jump to month") + '">' + links.join("") + "</nav>"
    );
  }

  function renderEmpty(code) {
    return (
      '<div class="empty-state">' +
        '<div class="empty-state-icon"><i data-lucide="calendar-x"></i></div>' +
        '<p class="empty-state-title">' + escapeHtml(i18n.events_none || "No upcoming events listed here yet.") + "</p>" +
        '<p class="empty-state-hint">' + escapeHtml(i18n.events_none_hint || "") + "</p>" +
        '<a href="' + contributeUrl() + '" target="_blank" rel="noopener" class="empty-state-cta">' +
          '<i data-lucide="plus"></i><span>' + escapeHtml(i18n.events_add || "Add an event") + "</span>" +
        "</a>" +
      "</div>"
    );
  }

  function render(code) {
    var container = document.getElementById("events-list");
    if (!container) return;

    var countryEl = document.querySelector("#events-country span");
    if (countryEl) countryEl.textContent = countryLabel(code);

    var today = todayIso();
    var scoped = ALL_EVENTS.filter(function (ev) { return ev.country === code; });
    scoped.sort(function (a, b) { return a.start_date < b.start_date ? -1 : a.start_date > b.start_date ? 1 : 0; });

    var upcoming = [];
    var past = [];
    scoped.forEach(function (ev) {
      ((ev.end_date || ev.start_date) < today ? past : upcoming).push(ev);
    });

    var cta = document.getElementById("events-cta");
    if (cta) cta.hidden = upcoming.length === 0;

    var html = "";
    if (upcoming.length === 0) {
      html += renderEmpty(code);
    } else {
      var months = [];
      var currentMonth = null;
      upcoming.forEach(function (ev) {
        var month = ev.start_date.slice(0, 7);
        if (month !== currentMonth) {
          if (currentMonth !== null) html += "</div></section>";
          currentMonth = month;
          months.push(month);
          html += '<section class="events-month" id="events-month-' + month + '"><h2 class="events-month-heading">' + escapeHtml(formatMonthHeading(month)) + '</h2><div class="events-month-list">';
        }
        html += renderCard(ev, false);
      });
      html += "</div></section>";
      html = renderMonthNav(months) + html;
    }

    if (past.length > 0) {
      past.reverse();
      html +=
        '<details class="events-past">' +
          "<summary>" + escapeHtml(i18n.events_past || "Past events") + " (" + past.length + ")</summary>" +
          '<div class="events-month-list">' + past.map(function (ev) { return renderCard(ev, true); }).join("") + "</div>" +
        "</details>";
    }

    container.innerHTML = html;
    // The CTA lives in the header markup but is shown below the month nav;
    // re-render wipes the container, so re-insert the node each time.
    if (cta) {
      var nav = container.querySelector(".events-month-nav");
      if (nav) {
        nav.insertAdjacentElement("afterend", cta);
      } else {
        container.insertBefore(cta, container.firstChild);
      }
    }
    if (window.lucide) lucide.createIcons();
  }

  function initCalendar() {
    var container = document.getElementById("events-list");
    if (!container) return;

    // Delegated so the links keep working across country-change re-renders.
    container.addEventListener("click", function (e) {
      var link = e.target.closest ? e.target.closest("[data-month-target]") : null;
      if (!link) return;
      var target = document.getElementById(link.getAttribute("data-month-target"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    fetch(baseurl + "/api/events.json")
      .then(function (res) { return res.json(); })
      .then(function (events) {
        ALL_EVENTS = events || [];
        render(getActiveCode());
        if (window.GameClubCountry && window.GameClubCountry.onChange) {
          window.GameClubCountry.onChange(function (profile) {
            if (profile && profile.code) render(profile.code);
          });
          // Apply a country that async geo-detection resolved before the
          // listener was registered.
          render(getActiveCode());
        }
      })
      .catch(function (err) {
        console.error("Failed to load events:", err);
        container.innerHTML = renderEmpty(getActiveCode());
        if (window.lucide) lucide.createIcons();
      });
  }

  // "Add to calendar" link on event detail pages: builds an all-day .ics
  // (DTEND is exclusive, so it's the day after the event ends) and downloads
  // it via a temporary object URL.
  function initIcsLink() {
    var el = document.querySelector("[data-event-ics]");
    if (!el || !window.Blob || !window.URL || !URL.createObjectURL) return;

    function icsText(s) {
      return (s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
    }

    el.addEventListener("click", function (e) {
      e.preventDefault();
      var start = el.getAttribute("data-start");
      var end = el.getAttribute("data-end") || start;
      var p = end.split("-");
      var endEx = new Date(Date.UTC(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10) + 1))
        .toISOString().slice(0, 10);
      var slug = window.location.pathname.replace(/\/$/, "").split("/").pop() || "event";
      var ics =
        "BEGIN:VCALENDAR\r\n" +
        "VERSION:2.0\r\n" +
        "PRODID:-//boardgameclubs.org//EN\r\n" +
        "BEGIN:VEVENT\r\n" +
        "UID:" + slug + "@boardgameclubs.org\r\n" +
        "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z\r\n" +
        "DTSTART;VALUE=DATE:" + start.replace(/-/g, "") + "\r\n" +
        "DTEND;VALUE=DATE:" + endEx.replace(/-/g, "") + "\r\n" +
        "SUMMARY:" + icsText(el.getAttribute("data-name")) + "\r\n" +
        "LOCATION:" + icsText(el.getAttribute("data-location")) + "\r\n" +
        "URL:" + window.location.href.split("#")[0] + "\r\n" +
        "END:VEVENT\r\n" +
        "END:VCALENDAR\r\n";
      var blobUrl = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
      var a = document.createElement("a");
      a.href = blobUrl;
      a.download = slug + ".ics";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(blobUrl); }, 1000);
    });
  }

  function boot() {
    localiseDateSpans();
    initIcsLink();
    initCalendar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.GameClubEvents = {
    formatDateRange: formatDateRange,
    localiseUrl: localiseUrl
  };
})();
