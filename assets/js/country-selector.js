(function () {
  "use strict";

  // Resolves and manages the active country, separate from the page language.
  // The active country drives the dataset, map centre, units and postcode
  // service. Resolution order: ?country= URL param, then localStorage, then
  // the page default.
  //
  // Other modules subscribe via GameClubCountry.onChange(cb); callbacks fire
  // with the new country profile object.

  var STORAGE_KEY = "gameclub.country";
  var URL_PARAM = "country";

  function getCountries() {
    return window.GameClubCountries || {};
  }

  function getProfile(code) {
    var countries = getCountries();
    var key = (code || "").toLowerCase();
    if (countries[key]) return countries[key];
    for (var k in countries) {
      if (countries[k] && countries[k].code === code) return countries[k];
    }
    return null;
  }

  // Map a few legacy/intuitive aliases to canonical codes (UK → GB).
  function canonicalise(code) {
    if (!code) return code;
    var up = code.toUpperCase();
    if (up === "UK") return "GB";
    return up;
  }

  function readUrlCode() {
    var params = new URLSearchParams(window.location.search);
    var c = canonicalise(params.get(URL_PARAM) || "");
    return c || null;
  }

  function readStoredCode() {
    try {
      var c = canonicalise(localStorage.getItem(STORAGE_KEY) || "");
      return c || null;
    } catch (e) {
      return null;
    }
  }

  function writeStoredCode(code) {
    try { localStorage.setItem(STORAGE_KEY, code); } catch (e) {}
  }

  function writeUrlCode(code, replace) {
    var params = new URLSearchParams(window.location.search);
    var defaultCode = canonicalise((window.GameClub && window.GameClub.defaultCountryCode) || "GB");
    if (code === defaultCode) {
      params.delete(URL_PARAM);
    } else {
      params.set(URL_PARAM, code);
    }
    var qs = params.toString();
    var newUrl = window.location.pathname + (qs ? "?" + qs : "") + window.location.hash;
    if (replace) {
      history.replaceState(null, "", newUrl);
    } else {
      history.pushState(null, "", newUrl);
    }
  }

  var resolvedFromExplicitSignal = false;

  function resolveInitial() {
    var defaultCode = canonicalise((window.GameClub && window.GameClub.defaultCountryCode) || "GB");
    var fromUrl = readUrlCode();
    if (fromUrl && getProfile(fromUrl)) { resolvedFromExplicitSignal = true; return fromUrl; }
    // On a localised page (/de/, /it/, …) the URL implies the country choice,
    // so we ignore any prior localStorage selection and use the page default.
    // The English root falls back to localStorage as before.
    var pageLang = (window.GameClub && window.GameClub.language) || "en";
    if (pageLang !== "en") { resolvedFromExplicitSignal = true; return defaultCode; }
    var fromStorage = readStoredCode();
    if (fromStorage && getProfile(fromStorage)) { resolvedFromExplicitSignal = true; return fromStorage; }
    return defaultCode;
  }

  // First-load IP geolocation for a fresh visitor with no explicit country
  // signal. Never blocks first paint, and only re-scopes if we support the
  // detected country; otherwise it stays on the default.
  var GEO_ENDPOINT = "https://ipapi.co/json/";

  function maybeDetectCountry() {
    if (resolvedFromExplicitSignal) return;
    if (!window.fetch) return;
    fetch(GEO_ENDPOINT)
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        if (!data) return;
        var code = canonicalise(data.country_code || data.country || "");
        if (!code) return;
        if (resolvedFromExplicitSignal) return;
        if (code === activeCode) return;
        if (!getProfile(code)) return;
        setActive(code, { persist: false, updateUrl: true, replaceUrl: true });
      })
      .catch(function () {});
  }

  var activeCode = null;
  var listeners = [];

  function notify(profile, meta) {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](profile, meta || {}); } catch (e) { console.error(e); }
    }
  }

  function setActive(code, options) {
    options = options || {};
    var profile = getProfile(code);
    if (!profile) return;
    if (profile.code === activeCode && !options.force) return;
    activeCode = profile.code;
    if (options.persist !== false) {
      writeStoredCode(profile.code);
    }
    if (options.updateUrl !== false) {
      writeUrlCode(profile.code, options.replaceUrl !== false);
    }
    updateNavLabel(profile);
    notify(profile, options);
  }

  function getActive() {
    if (!activeCode) activeCode = resolveInitial();
    return getProfile(activeCode);
  }

  function getActiveCode() {
    if (!activeCode) activeCode = resolveInitial();
    return activeCode;
  }

  function onChange(cb) {
    listeners.push(cb);
    return function unsubscribe() {
      var idx = listeners.indexOf(cb);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }

  // ── Nav dropdown wiring ──────────────────────────────────────────────

  // Short ISO-style label shown in the nav chip ("GB", "DE").
  function getCountryShortLabel(code) {
    var profile = getProfile(code);
    if (profile && profile.code) return profile.code;
    return code;
  }

  // Full human-readable label for tooltips / fallbacks.
  function getCountryLabel(code) {
    var i18n = window.GameClubI18n || {};
    var lang = (window.GameClub && window.GameClub.language) || "en";
    var key = "country_" + code.toLowerCase();
    if (i18n[key]) return i18n[key];
    var profile = getProfile(code);
    if (profile) {
      return profile["name_" + lang] || profile.name_en || profile.code;
    }
    return code;
  }

  function updateNavLabel(profile) {
    var el = document.getElementById("nav-country-current");
    if (el && profile) {
      el.textContent = getCountryShortLabel(profile.code);
    }
    var options = document.querySelectorAll(".nav-country-option");
    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var isActive = opt.getAttribute("data-country") === profile.code;
      opt.classList.toggle("is-active", isActive);
    }
  }

  // Close any other open nav menu/dropdown before opening this one, so only
  // one is ever open at a time on mobile.
  function closeOtherMenus(keep) {
    if (keep !== "country") {
      var country = document.getElementById("nav-country");
      var countryToggle = document.getElementById("nav-country-toggle");
      if (country) country.classList.remove("is-open");
      if (countryToggle) countryToggle.setAttribute("aria-expanded", "false");
    }
    if (keep !== "burger") {
      var menu = document.getElementById("nav-menu");
      var burger = document.getElementById("nav-burger");
      if (menu) menu.classList.remove("is-open");
      if (burger) burger.setAttribute("aria-expanded", "false");
    }
  }

  function wireNav() {
    var container = document.getElementById("nav-country");
    if (!container) return;
    var toggle = document.getElementById("nav-country-toggle");
    var options = container.querySelectorAll(".nav-country-option");

    if (toggle) {
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        var isOpen = container.classList.toggle("is-open");
        if (isOpen) closeOtherMenus("country");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    for (var i = 0; i < options.length; i++) {
      options[i].addEventListener("click", function () {
        var code = this.getAttribute("data-country");
        container.classList.remove("is-open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
        setActive(code, { persist: true, updateUrl: true, replaceUrl: false });
      });
    }

    document.addEventListener("click", function (e) {
      if (!container.contains(e.target)) {
        container.classList.remove("is-open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      }
    });

    var active = getActive();
    if (active) updateNavLabel(active);
  }

  // ── Burger menu wiring ───────────────────────────────────────────────
  // Mobile-only dropdown holding the nav links, Add CTA and GitHub link.
  // The panel and burger are always in the DOM; CSS only shows them below
  // $bp-md. Toggling .is-open here does nothing on desktop, where the panel
  // is laid out inline anyway.

  function wireBurger() {
    var burger = document.getElementById("nav-burger");
    var menu = document.getElementById("nav-menu");
    if (!burger || !menu) return;

    function close() {
      menu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }

    burger.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = menu.classList.toggle("is-open");
      if (isOpen) closeOtherMenus("burger");
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close when a menu item is chosen (links navigate, but the panel should
    // not linger if the target is the current page or opens in a new tab).
    var links = menu.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", close);
    }

    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target) && e.target !== burger && !burger.contains(e.target)) {
        close();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  // ── Language banner ──────────────────────────────────────────────────
  // Suggests a localised site to browsers whose preferred language matches
  // one of our non-English locales, when they land on a different locale.
  // A dismiss persists in localStorage. We don't auto-redirect, since
  // bilingual users may genuinely prefer the English UI.

  var BANNER_DISMISS_KEY = "gameclub.lang_banner_dismissed";
  var BANNER_LOCALES = [
    { code: "de", path: "/de/", hreflang: "de-DE" },
    { code: "it", path: "/it/", hreflang: "it-IT" },
    { code: "fr", path: "/fr/", hreflang: "fr-FR" },
    { code: "es", path: "/es/", hreflang: "es-ES" },
    { code: "pl", path: "/pl/", hreflang: "pl-PL" }
  ];

  // Returns the locale entry matching the highest-priority browser language
  // that is in BANNER_LOCALES, or null. Skips the user's current page lang.
  function detectBannerLocale(currentPageLang) {
    var langs = [];
    if (navigator.languages && navigator.languages.length) {
      langs = navigator.languages;
    } else if (navigator.language) {
      langs = [navigator.language];
    }
    for (var i = 0; i < langs.length; i++) {
      var prefix = (langs[i] || "").toLowerCase().slice(0, 2);
      if (!prefix || prefix === currentPageLang) continue;
      for (var j = 0; j < BANNER_LOCALES.length; j++) {
        if (BANNER_LOCALES[j].code === prefix) return BANNER_LOCALES[j];
      }
    }
    return null;
  }

  function maybeShowLangBanner() {
    var pageLang = (window.GameClub && window.GameClub.language) || "en";
    var target = detectBannerLocale(pageLang);
    if (!target) return;
    if (window.location.pathname.indexOf(target.path) === 0) return;
    try {
      if (localStorage.getItem(BANNER_DISMISS_KEY) === "1") return;
    } catch (e) {}

    var i18n = window.GameClubI18n || {};
    var label = i18n["lang_banner_" + target.code];
    if (!label) return;
    var dismiss = i18n.lang_banner_dismiss || "Dismiss";

    var bar = document.createElement("div");
    bar.className = "lang-banner";
    bar.setAttribute("role", "complementary");
    bar.innerHTML =
      '<a class="lang-banner-link"></a>' +
      '<button type="button" class="lang-banner-dismiss" aria-label=""></button>';
    var link = bar.querySelector(".lang-banner-link");
    link.setAttribute("href", target.path);
    link.setAttribute("hreflang", target.hreflang);
    link.textContent = label;
    bar.querySelector(".lang-banner-dismiss").textContent = "×";
    bar.querySelector(".lang-banner-dismiss").setAttribute("aria-label", dismiss);
    bar.querySelector(".lang-banner-dismiss").addEventListener("click", function () {
      try { localStorage.setItem(BANNER_DISMISS_KEY, "1"); } catch (e) {}
      bar.remove();
    });
    document.body.insertBefore(bar, document.body.firstChild);
  }

  // ── Public API ───────────────────────────────────────────────────────

  window.GameClubCountry = {
    getActive: getActive,
    getActiveCode: getActiveCode,
    getProfile: getProfile,
    setActive: setActive,
    onChange: onChange,
    getCountryLabel: getCountryLabel
  };

  function bootstrap() {
    activeCode = resolveInitial();
    // Ensure URL reflects the resolved code (so a localStorage-resolved
    // choice gets a ?country= param for bookmarking).
    writeUrlCode(activeCode, true);
    wireNav();
    wireBurger();
    maybeShowLangBanner();
    maybeDetectCountry();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
