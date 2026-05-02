(function () {
  'use strict';

  var STORAGE_KEY = 'ooc-lang';
  var LANGS = [
    { code: 'en', label: 'English',  short: 'EN' },
    { code: 'fr', label: 'Fran\u00e7ais', short: 'FR' },
    { code: 'es', label: 'Espa\u00f1ol',  short: 'ES' }
  ];

  var activeLang = 'en';

  // Module-level references populated by build functions, used by updateSwitcherUI().
  var desktopBtnLabel = null;
  var desktopDropdownEl = null;
  var isDropdownOpen = false;
  var mobileBarDropdownEl = null;
  var isMobileBarDropdownOpen = false;

  // ── Storage ────────────────────────────────────────────────────────────────

  function loadLang() {
    try { var v = localStorage.getItem(STORAGE_KEY); return v && findLang(v) ? v : 'en'; }
    catch (e) { return 'en'; }
  }
  function saveLang(code) {
    try { localStorage.setItem(STORAGE_KEY, code); } catch (e) {}
  }
  function findLang(code) {
    for (var i = 0; i < LANGS.length; i++) { if (LANGS[i].code === code) return LANGS[i]; }
    return null;
  }

  function getUrlLang() {
    try {
      var params = new URLSearchParams(location.search);
      var raw = params.get('l') || params.get('L') || params.get('lang') || params.get('language');
      if (!raw) return null;
      var code = raw.toLowerCase().trim();
      return findLang(code) ? code : null;
    } catch (e) { return null; }
  }

  // ── Google Translate cookie ────────────────────────────────────────────────

  function setGTCookie(langCode) {
    var val = langCode === 'en' ? '' : '/en/' + langCode;
    var expires = langCode === 'en'
      ? 'Thu, 01 Jan 1970 00:00:00 UTC'
      : new Date(Date.now() + 365 * 864e5).toUTCString();
    document.cookie = 'googtrans=' + val + '; expires=' + expires + '; path=/';
    try {
      var host = location.hostname;
      if (host && host !== 'localhost') {
        document.cookie = 'googtrans=' + val + '; expires=' + expires + '; path=/; domain=.' + host;
      }
    } catch (e) {}
  }

  // ── Google Translate loader ────────────────────────────────────────────────

  function loadGoogleTranslate() {
    var el = document.createElement('div');
    el.id = 'google_translate_element';
    document.body.appendChild(el);

    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'fr,es',
        autoDisplay: false,
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');

      if (activeLang !== 'en') {
        waitForGTCombo(function (combo) {
          combo.value = activeLang;
          combo.dispatchEvent(new Event('change'));
        });
      }
    };

    var s = document.createElement('script');
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.onerror = function () {};
    document.head.appendChild(s);
  }

  function waitForGTCombo(cb) {
    var n = 0;
    var t = setInterval(function () {
      var combo = document.querySelector('.goog-te-combo');
      if (combo) { clearInterval(t); cb(combo); }
      if (++n > 80) clearInterval(t);
    }, 120);
  }

  // ── Custom translation overrides ─────────────────────────────────────────
  //
  // For key elements where Google Translate produces inaccurate results (e.g.
  // the hero headline), authors can supply a curated translation directly in
  // the HTML via data-i18n-es / data-i18n-fr attributes.  This function finds
  // those elements, swaps in the curated text, then marks them translate="no"
  // so Google Translate never overwrites the handcrafted copy.
  //
  // Must run BEFORE loadGoogleTranslate() so the attributes are set when GT
  // first inspects the DOM.

  function applyCustomTranslations() {
    if (activeLang === 'en') return;
    var attr = 'data-i18n-' + activeLang;
    var els = document.querySelectorAll('[' + attr + ']');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var text = el.getAttribute(attr);
      if (text) {
        el.textContent = text;
        el.setAttribute('translate', 'no');
        el.classList.add('notranslate');
      }
    }
  }

  // ── Brand-name no-translate guard ─────────────────────────────────────────
  //
  // Adds translate="no" / class="notranslate" to proper names and brand names
  // that must never be altered by Google Translate (company names, initiative
  // names, product names, copyright notices).  This runs synchronously in the
  // DOMContentLoaded handler — before loadGoogleTranslate() is called — so the
  // attributes are present when Google Translate first inspects the DOM.

  function markBrandNamesNotranslate() {
    // Initiative/brand hrefs whose link text is a proper name.
    var brandPaths = [
      'web-ready',
      'vcasse',
      'wra-platform',
      'sustainable-technology-week'
    ];

    for (var i = 0; i < brandPaths.length; i++) {
      var links = document.querySelectorAll('a[href*="' + brandPaths[i] + '"]');
      for (var j = 0; j < links.length; j++) {
        var link = links[j];
        // Desktop nav dropdown: only the title span carries the brand name;
        // leave the description span translatable.
        var titleSpan = link.querySelector('.nav-dd-link-title');
        if (titleSpan) {
          titleSpan.setAttribute('translate', 'no');
          titleSpan.classList.add('notranslate');
        } else {
          // Mobile nav and footer links: the element itself is the brand name.
          link.setAttribute('translate', 'no');
          link.classList.add('notranslate');
        }
      }
    }

    // Protect "Oasis of Change, Inc." in the footer copyright line.
    var copyrightEl = document.querySelector('[data-copyright-year]');
    if (copyrightEl && copyrightEl.parentElement) {
      copyrightEl.parentElement.setAttribute('translate', 'no');
      copyrightEl.parentElement.classList.add('notranslate');
    }
  }

  // ── Google Translate UI suppressor ────────────────────────────────────────

  function injectGTHideCSS() {
    var s = document.createElement('style');
    s.id = 'ooc-gt-hide';
    s.textContent =
      '#google_translate_element,' +
      '.skiptranslate,' +
      '.goog-te-banner-frame,' +
      '.goog-te-balloon-frame,' +
      '#goog-gt-tt,' +
      '.goog-tooltip,' +
      '.goog-text-highlight { display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important; }' +
      'body { top: 0 !important; }';
    document.head.appendChild(s);
  }

  // ── SVG helpers ───────────────────────────────────────────────────────────

  function globeSvg(w, h) {
    w = w || 16; h = h || 16;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">' +
      '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />' +
      '</svg>';
  }

  function chevronSvg() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">' +
      '<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />' +
      '</svg>';
  }

  function checkSvg() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" aria-hidden="true">' +
      '<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />' +
      '</svg>';
  }

  // ── Desktop: globe + language code + chevron dropdown ─────────────────────
  //
  // Uses role="menu" + role="menuitemradio" so that:
  //   1. <button> elements are valid menuitemradio children (no role conflict)
  //   2. Options are direct children of the menu (no intermediate wrapper)
  //   3. aria-checked communicates the selected language to screen readers

  function buildDesktopSwitcher() {
    var wrap = document.createElement('div');
    wrap.setAttribute('data-lang-switcher', '');
    wrap.classList.add('notranslate');
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-haspopup', 'menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('data-lang-btn', '');
    btn.className = 'lang-btn notranslate';
    btn.innerHTML = globeSvg() + '<span data-lang-label>' + (findLang(activeLang) || LANGS[0]).short + '</span>' + chevronSvg();
    wrap.appendChild(btn);
    var dd = document.createElement('div');
    dd.setAttribute('data-lang-dropdown', '');
    dd.setAttribute('role', 'menu');
    dd.setAttribute('aria-label', 'Select language');
    dd.className = 'lang-dropdown notranslate';
    // Options are direct children of role="menu" — no wrapper div in between,
    // which satisfies aria-required-children for the menu role.
    var panel = document.createElement('div');
    panel.className = 'lang-dropdown-panel';
    for (var i = 0; i < LANGS.length; i++) {
      var lang = LANGS[i];
      var opt = document.createElement('button');
      opt.setAttribute('type', 'button');
      opt.setAttribute('role', 'menuitemradio');
      opt.setAttribute('data-lang-option', lang.code);
      opt.setAttribute('aria-checked', lang.code === activeLang ? 'true' : 'false');
      opt.className = 'lang-option notranslate' + (lang.code === activeLang ? ' lang-option--active' : '');
      opt.innerHTML =
        '<span class="lang-option-check">' + (lang.code === activeLang ? checkSvg() : '') + '</span>' +
        '<span class="lang-option-name">' + lang.label + '</span>' +
        '<span class="lang-option-code">' + lang.short + '</span>';
      panel.appendChild(opt);
    }
    dd.appendChild(panel);
    wrap.appendChild(dd);
    desktopBtnLabel = btn.querySelector('[data-lang-label]');
    desktopDropdownEl = dd;
    return wrap;
  }

  // ── Mobile nav-bar: globe button + compact dropdown ────────────────────────
  //
  // Wrapped together with the hamburger in a btnGroup div so justify-between
  // treats both as one unit (keeping them right-aligned together).
  // The wrap is display:none at min-width:1024px via CSS so
  // measureNavOverflow() in site.js sees offsetWidth:0.

  function buildMobileBarSwitcher() {
    var wrap = document.createElement('div');
    wrap.className = 'lang-mobile-globe-wrap notranslate';
    wrap.setAttribute('data-lang-mobile-wrap', '');

    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', 'Select language');
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('data-lang-mobile-globe', '');
    btn.className = 'lang-mobile-globe-btn notranslate';
    btn.innerHTML = globeSvg(18, 18);
    wrap.appendChild(btn);

    var dd = document.createElement('div');
    dd.className = 'lang-mobile-globe-dropdown notranslate';
    dd.setAttribute('data-lang-mobile-dropdown', '');

    var panel = document.createElement('div');
    panel.className = 'lang-mobile-globe-dropdown-panel';

    for (var i = 0; i < LANGS.length; i++) {
      var lang = LANGS[i];
      var pill = document.createElement('button');
      pill.setAttribute('type', 'button');
      pill.setAttribute('data-lang-mobile-dd-pill', lang.code);
      pill.setAttribute('aria-pressed', lang.code === activeLang ? 'true' : 'false');
      pill.className = 'lang-mobile-dd-pill notranslate' + (lang.code === activeLang ? ' lang-mobile-dd-pill--active' : '');
      pill.textContent = lang.short;
      panel.appendChild(pill);
    }

    dd.appendChild(panel);
    wrap.appendChild(dd);
    mobileBarDropdownEl = dd;
    return wrap;
  }

  // ── Injection ──────────────────────────────────────────────────────────────

  function inject() {
    var navEl = document.querySelector('nav[aria-label="Main"]');
    var flexRow = navEl ? navEl.firstElementChild : null;

    if (flexRow) {
      // 1. Desktop dropdown — placed inside the support container (the
      //    hidden lg:flex div with justify-end) before the CTA link. This
      //    groups the lang switcher and CTA together at the right edge of
      //    the nav bar. The support container is already hidden on mobile
      //    via Tailwind's `hidden lg:flex`, so no extra display:none needed.
      var supportContainer = null;
      var supportLink = null;
      var candidates = flexRow.querySelectorAll('.justify-end');
      for (var i = 0; i < candidates.length; i++) {
        var link = candidates[i].querySelector('a');
        if (link) {
          supportContainer = candidates[i];
          supportLink = link;
          break;
        }
      }
      if (supportContainer && supportLink) {
        supportContainer.style.alignItems = 'center';
        supportContainer.style.gap = '0.75rem';
        supportContainer.insertBefore(buildDesktopSwitcher(), supportLink);
      }

      // 2. Mobile nav-bar globe button — wrap globe+hamburger in a btnGroup so
      //    justify-between treats them as one unit (keeps them grouped on the right).
      var hamburger = flexRow.querySelector('[data-mobile-toggle]');
      if (hamburger) {
        var btnGroup = document.createElement('div');
        btnGroup.setAttribute('data-lang-btn-group', '');
        btnGroup.style.display = 'flex';
        btnGroup.style.alignItems = 'center';
        btnGroup.style.gap = '0.5rem';
        flexRow.insertBefore(btnGroup, hamburger);
        btnGroup.appendChild(buildMobileBarSwitcher());
        btnGroup.appendChild(hamburger);
      }
    }

    initDesktopDropdown();
    initMobileBarGlobe();
    initGlobalClickOutside();

    // Notify site.js resize listeners so overflow check runs with new DOM state.
    window.dispatchEvent(new Event('resize'));
  }

  // ── Desktop dropdown handlers ─────────────────────────────────────────────

  function closeDropdown() {
    if (!desktopDropdownEl) return;
    isDropdownOpen = false;
    desktopDropdownEl.classList.remove('is-open');
    var btn = document.querySelector('[data-lang-btn]');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function initDesktopDropdown() {
    var btn = document.querySelector('[data-lang-btn]');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isDropdownOpen) {
        closeDropdown();
      } else {
        isDropdownOpen = true;
        desktopDropdownEl.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    var opts = document.querySelectorAll('[data-lang-option]');
    for (var i = 0; i < opts.length; i++) {
      opts[i].addEventListener('click', function (e) {
        e.stopPropagation();
        var code = this.getAttribute('data-lang-option');
        closeDropdown();
        switchTo(code);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isDropdownOpen) closeDropdown();
    });
  }

  // ── Mobile bar globe button handlers ──────────────────────────────────────

  function openMobileBarDropdown() {
    if (!mobileBarDropdownEl) return;
    isMobileBarDropdownOpen = true;
    mobileBarDropdownEl.classList.add('is-open');
    var btn = document.querySelector('[data-lang-mobile-globe]');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileBarDropdown() {
    if (!mobileBarDropdownEl) return;
    isMobileBarDropdownOpen = false;
    mobileBarDropdownEl.classList.remove('is-open');
    var btn = document.querySelector('[data-lang-mobile-globe]');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function initMobileBarGlobe() {
    var btn = document.querySelector('[data-lang-mobile-globe]');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      isMobileBarDropdownOpen ? closeMobileBarDropdown() : openMobileBarDropdown();
    });

    var pills = document.querySelectorAll('[data-lang-mobile-dd-pill]');
    for (var i = 0; i < pills.length; i++) {
      pills[i].addEventListener('click', function (e) {
        e.stopPropagation();
        var code = this.getAttribute('data-lang-mobile-dd-pill');
        closeMobileBarDropdown();
        switchTo(code);
      });
    }

    // Close dropdown when the hamburger opens so both aren't visible at once.
    var hamburger = document.querySelector('[data-mobile-toggle]');
    if (hamburger) {
      hamburger.addEventListener('click', function () {
        if (isMobileBarDropdownOpen) closeMobileBarDropdown();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMobileBarDropdownOpen) closeMobileBarDropdown();
    });
  }

  // ── Click-outside: closes both dropdowns ──────────────────────────────────

  function initGlobalClickOutside() {
    document.addEventListener('click', function (e) {
      if (isDropdownOpen) {
        var switcher = document.querySelector('[data-lang-switcher]');
        if (switcher && !switcher.contains(e.target)) closeDropdown();
      }
      if (isMobileBarDropdownOpen) {
        var wrap = document.querySelector('[data-lang-mobile-wrap]');
        if (wrap && !wrap.contains(e.target)) closeMobileBarDropdown();
      }
    });
  }

  // ── UI sync ───────────────────────────────────────────────────────────────

  function updateSwitcherUI() {
    var info = findLang(activeLang);
    if (!info) return;

    // Desktop dropdown label
    if (desktopBtnLabel) desktopBtnLabel.textContent = info.short;

    // Desktop dropdown options (role="menuitemradio" uses aria-checked)
    var opts = document.querySelectorAll('[data-lang-option]');
    for (var i = 0; i < opts.length; i++) {
      var code = opts[i].getAttribute('data-lang-option');
      var active = code === activeLang;
      opts[i].classList.toggle('lang-option--active', active);
      opts[i].setAttribute('aria-checked', active ? 'true' : 'false');
      var checkSpan = opts[i].querySelector('.lang-option-check');
      if (checkSpan) checkSpan.innerHTML = active ? checkSvg() : '';
    }

    // Mobile bar dropdown pills
    var barPills = document.querySelectorAll('[data-lang-mobile-dd-pill]');
    for (var i = 0; i < barPills.length; i++) {
      var code = barPills[i].getAttribute('data-lang-mobile-dd-pill');
      var active = code === activeLang;
      barPills[i].classList.toggle('lang-mobile-dd-pill--active', active);
      barPills[i].setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  }

  // ── Switch ────────────────────────────────────────────────────────────────

  function switchTo(code) {
    if (code === activeLang) return;
    saveLang(code);
    setGTCookie(code);
    location.reload();
  }

  // ── Bootstrap ─────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    var urlLang = getUrlLang();
    activeLang = urlLang || loadLang();
    if (urlLang) {
      saveLang(urlLang);
      setGTCookie(urlLang);
    }

    injectGTHideCSS();
    applyCustomTranslations();
    markBrandNamesNotranslate();
    inject();
    updateSwitcherUI();

    // Always sync the googtrans cookie with the stored language — even for 'en'.
    // This clears any stale cookie from a prior non-English session so Google
    // Translate does not re-translate a page the user has since reset to English.
    setGTCookie(activeLang);

    if (activeLang !== 'en') {
      document.documentElement.lang = activeLang;
    }

    loadGoogleTranslate();
  });
})();
