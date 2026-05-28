(function () {
  "use strict";

  // Resolves and manages the *active* country (independent of page language).
  // Active country drives the dataset, map centre, units, postcode service.
  // Resolution order: ?country= URL param > localStorage > page default.
  //
  // Other modules subscribe via GameClubCountry.onChange(cb). Callbacks fire
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
    // Match by uppercase code as well, just in case.
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

  function resolveInitial() {
    var defaultCode = canonicalise((window.GameClub && window.GameClub.defaultCountryCode) || "GB");
    var fromUrl = readUrlCode();
    if (fromUrl && getProfile(fromUrl)) return fromUrl;
    var fromStorage = readStoredCode();
    if (fromStorage && getProfile(fromStorage)) return fromStorage;
    return defaultCode;
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

  function wireNav() {
    var container = document.getElementById("nav-country");
    if (!container) return;
    var toggle = document.getElementById("nav-country-toggle");
    var options = container.querySelectorAll(".nav-country-option");

    if (toggle) {
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        var isOpen = container.classList.toggle("is-open");
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

    // Initial label sync.
    var active = getActive();
    if (active) updateNavLabel(active);
  }

  // ── Language banner ──────────────────────────────────────────────────
  // Suggests the German site to browsers whose preferred language is German
  // when they land on a non-/de/ page. One-time dismiss persists in
  // localStorage. No auto-redirect — bilingual users may genuinely prefer
  // the English UI.

  var BANNER_DISMISS_KEY = "gameclub.lang_banner_dismissed";

  function browserPrefersGerman() {
    var langs = [];
    if (navigator.languages && navigator.languages.length) {
      langs = navigator.languages;
    } else if (navigator.language) {
      langs = [navigator.language];
    }
    for (var i = 0; i < langs.length; i++) {
      if ((langs[i] || "").toLowerCase().indexOf("de") === 0) return true;
    }
    return false;
  }

  function maybeShowLangBanner() {
    var pageLang = (window.GameClub && window.GameClub.language) || "en";
    if (pageLang === "de") return;                       // already on /de/
    if (window.location.pathname.indexOf("/de/") === 0) return;
    if (!browserPrefersGerman()) return;
    try {
      if (localStorage.getItem(BANNER_DISMISS_KEY) === "1") return;
    } catch (e) {}

    var i18n = window.GameClubI18n || {};
    var label = i18n.lang_banner_de || "Looking for clubs in Germany? Visit the German site →";
    var dismiss = i18n.lang_banner_dismiss || "Dismiss";

    var bar = document.createElement("div");
    bar.className = "lang-banner";
    bar.setAttribute("role", "complementary");
    bar.innerHTML =
      '<a class="lang-banner-link" href="/de/" hreflang="de-DE"></a>' +
      '<button type="button" class="lang-banner-dismiss" aria-label=""></button>';
    bar.querySelector(".lang-banner-link").textContent = label;
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

  // Initialise: resolve active code, sync URL to canonical form, wire UI.
  function bootstrap() {
    activeCode = resolveInitial();
    // Ensure URL reflects the resolved code (so a localStorage-resolved
    // choice gets a ?country= param for bookmarking).
    writeUrlCode(activeCode, true);
    wireNav();
    maybeShowLangBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
