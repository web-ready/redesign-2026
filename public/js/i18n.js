(function () {
  'use strict';

  

  var STORAGE_KEY = 'ooc-lang';
  var LANGS = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'fr', label: 'Fran\u00e7ais', short: 'FR' },
    { code: 'es', label: 'Espa\u00f1ol', short: 'ES' }
  ];

  var activeLang = 'en';
  var desktopBtnLabel = null;
  var desktopDropdownEl = null;
  var isDropdownOpen = false;

  
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
    s.onerror = function () {  };
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

  
  function globeSvg() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">' +
      '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />' +
      '</svg>';
  }

  function chevronSvg() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 17 16" fill="none" aria-hidden="true" style="opacity:.6">' +
      '<path d="M12.848 6L8.18132 10.6667L3.51465 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>' +
      '</svg>';
  }

  function checkSvg() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<polyline points="20 6 9 17 4 12"></polyline></svg>';
  }

  
  function buildDesktopSwitcher() {
    var wrap = document.createElement('div');
    wrap.setAttribute('data-lang-switcher', '');
    wrap.classList.add('notranslate');

    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('data-lang-btn', '');
    btn.className = 'lang-btn notranslate';
    btn.innerHTML = globeSvg() + '<span data-lang-label>' + (findLang(activeLang) || LANGS[0]).short + '</span>' + chevronSvg();
    wrap.appendChild(btn);

    var dd = document.createElement('div');
    dd.setAttribute('data-lang-dropdown', '');
    dd.setAttribute('role', 'listbox');
    dd.setAttribute('aria-label', 'Select language');
    dd.className = 'lang-dropdown notranslate';

    var panel = document.createElement('div');
    panel.className = 'lang-dropdown-panel';

    for (var i = 0; i < LANGS.length; i++) {
      var lang = LANGS[i];
      var opt = document.createElement('button');
      opt.setAttribute('type', 'button');
      opt.setAttribute('role', 'option');
      opt.setAttribute('data-lang-option', lang.code);
      opt.setAttribute('aria-selected', lang.code === activeLang ? 'true' : 'false');
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

  
  function buildMobileSwitcher() {
    var row = document.createElement('div');
    row.className = 'lang-switcher-mobile notranslate';

    var icon = document.createElement('span');
    icon.className = 'lang-mobile-icon';
    icon.innerHTML = globeSvg();
    icon.setAttribute('aria-hidden', 'true');
    row.appendChild(icon);

    for (var i = 0; i < LANGS.length; i++) {
      var lang = LANGS[i];
      var pill = document.createElement('button');
      pill.setAttribute('type', 'button');
      pill.setAttribute('data-lang-pill', lang.code);
      pill.className = 'lang-pill' + (lang.code === activeLang ? ' lang-pill--active' : '');
      pill.textContent = lang.short;
      row.appendChild(pill);
    }
    return row;
  }

  
  function inject() {
    var supportContainer = null;
    var supportLink = null;
    var desktopContainers = document.querySelectorAll('nav .hidden.lg\\:flex');
    for (var i = 0; i < desktopContainers.length; i++) {
      var links = desktopContainers[i].querySelectorAll('a[href*="get_involved"]');
      if (links.length) {
        supportContainer = desktopContainers[i];
        supportLink = links[0];
        break;
      }
    }

    if (supportContainer && supportLink) {
      supportContainer.style.alignItems = 'center';
      supportContainer.style.gap = '0.5rem';
      supportContainer.insertBefore(buildDesktopSwitcher(), supportLink);
    }

    var mobilePanel = document.querySelector('[data-mobile-panel]');
    if (mobilePanel) {
      var mobileSupport = mobilePanel.querySelector('a[href*="get_involved"]');
      if (mobileSupport) {
        mobileSupport.parentNode.insertBefore(buildMobileSwitcher(), mobileSupport);
      }
    }

    initDesktopDropdown();
    initMobilePills();
    initClickOutside();

    
    window.dispatchEvent(new Event('resize'));
  }

  
  function openDropdown() {
    if (!desktopDropdownEl) return;
    isDropdownOpen = true;
    desktopDropdownEl.classList.add('is-open');
    var btn = desktopDropdownEl.previousElementSibling;
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  function closeDropdown() {
    if (!desktopDropdownEl) return;
    isDropdownOpen = false;
    desktopDropdownEl.classList.remove('is-open');
    var btn = desktopDropdownEl.previousElementSibling;
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function initDesktopDropdown() {
    var btn = document.querySelector('[data-lang-btn]');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      isDropdownOpen ? closeDropdown() : openDropdown();
    });

    var options = document.querySelectorAll('[data-lang-option]');
    for (var i = 0; i < options.length; i++) {
      options[i].addEventListener('click', function () {
        var code = this.getAttribute('data-lang-option');
        switchTo(code);
        closeDropdown();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isDropdownOpen) closeDropdown();
    });
  }

  function initMobilePills() {
    var pills = document.querySelectorAll('[data-lang-pill]');
    for (var i = 0; i < pills.length; i++) {
      pills[i].addEventListener('click', function () {
        switchTo(this.getAttribute('data-lang-pill'));
      });
    }
  }

  function initClickOutside() {
    document.addEventListener('click', function (e) {
      if (!isDropdownOpen) return;
      var sw = document.querySelector('[data-lang-switcher]');
      if (sw && !sw.contains(e.target)) closeDropdown();
    });
  }

  
  function updateSwitcherUI() {
    var info = findLang(activeLang);
    if (!info) return;

    if (desktopBtnLabel) desktopBtnLabel.textContent = info.short;

    var options = document.querySelectorAll('[data-lang-option]');
    for (var i = 0; i < options.length; i++) {
      var code = options[i].getAttribute('data-lang-option');
      var active = code === activeLang;
      options[i].className = 'lang-option notranslate' + (active ? ' lang-option--active' : '');
      options[i].setAttribute('aria-selected', active ? 'true' : 'false');
      var cs = options[i].querySelector('.lang-option-check');
      if (cs) cs.innerHTML = active ? checkSvg() : '';
    }

    var pills = document.querySelectorAll('[data-lang-pill]');
    for (var i = 0; i < pills.length; i++) {
      var code = pills[i].getAttribute('data-lang-pill');
      pills[i].classList.toggle('lang-pill--active', code === activeLang);
    }
  }

  
  function switchTo(code) {
    if (code === activeLang) return;
    saveLang(code);
    setGTCookie(code);
    location.reload();
  }

  
  document.addEventListener('DOMContentLoaded', function () {
    var urlLang = getUrlLang();
    activeLang = urlLang || loadLang();
    if (urlLang) {
      saveLang(urlLang);
      setGTCookie(urlLang);
    }

    
    injectGTHideCSS();

    
    inject();
    updateSwitcherUI();

    
    if (activeLang !== 'en') {
      setGTCookie(activeLang);
      document.documentElement.lang = activeLang;
    }

    
    loadGoogleTranslate();
  });
})();
