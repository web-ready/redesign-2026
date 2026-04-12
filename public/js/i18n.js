(function () {
  'use strict';

  var STORAGE_KEY = 'ooc-lang';
  var LANGS = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'fr', label: 'Fran\u00e7ais', short: 'FR' },
    { code: 'es', label: 'Espa\u00f1ol', short: 'ES' }
  ];

  /* ── Curated dictionary for nav / footer / key UI ──────────────
     These provide instant, high-quality translations for the most
     visible elements while Google Translate handles the full page.
     Key = normalised English text, value = { fr, es }              */
  var T = {
    'Skip to main content': { fr: 'Aller au contenu principal', es: 'Ir al contenido principal' },
    'Home': { fr: 'Accueil', es: 'Inicio' },
    'Initiatives': { fr: 'Initiatives', es: 'Iniciativas' },
    'Case Studies': { fr: '\u00c9tudes de cas', es: 'Estudios de caso' },
    'Company': { fr: 'Entreprise', es: 'Empresa' },
    'Blog': { fr: 'Blog', es: 'Blog' },
    'Support Our Mission': { fr: 'Soutenir notre mission', es: 'Apoyar nuestra misi\u00f3n' },
    'All initiatives': { fr: 'Toutes les initiatives', es: 'Todas las iniciativas' },
    'See the full portfolio and all our initiatives in one place.': {
      fr: 'Voir le portfolio complet et toutes nos initiatives en un seul endroit.',
      es: 'Vea el portafolio completo y todas nuestras iniciativas en un solo lugar.'
    },
    'Subsidiaries': { fr: 'Filiales', es: 'Filiales' },
    'Sustainable website development and digital strategy for mission-driven organizations.': {
      fr: 'D\u00e9veloppement web durable et strat\u00e9gie num\u00e9rique pour les organisations \u00e0 mission.',
      es: 'Desarrollo web sostenible y estrategia digital para organizaciones con misi\u00f3n.'
    },
    'Advancing responsible AI, safety, sustainability, and ethical technology leadership.': {
      fr: 'Promouvoir l\u2019IA responsable, la s\u00e9curit\u00e9, la durabilit\u00e9 et le leadership technologique \u00e9thique.',
      es: 'Avanzando en IA responsable, seguridad, sostenibilidad y liderazgo tecnol\u00f3gico \u00e9tico.'
    },
    'Projects': { fr: 'Projets', es: 'Proyectos' },
    'Sustainable Technology Week': { fr: 'Semaine de la technologie durable', es: 'Semana de Tecnolog\u00eda Sostenible' },
    'A focused week of programming exploring sustainable technology, innovation, and culture.': {
      fr: 'Une semaine de programmation ax\u00e9e sur la technologie durable, l\u2019innovation et la culture.',
      es: 'Una semana de programaci\u00f3n enfocada en tecnolog\u00eda sostenible, innovaci\u00f3n y cultura.'
    },
    'WRA Platform': { fr: 'Plateforme WRA', es: 'Plataforma WRA' },
    'Helping nonprofits build accessible, lower-carbon websites and access digital grants.': {
      fr: 'Aider les organismes sans but lucratif \u00e0 cr\u00e9er des sites web accessibles, \u00e0 faible empreinte carbone, et \u00e0 acc\u00e9der aux subventions num\u00e9riques.',
      es: 'Ayudando a organizaciones sin fines de lucro a crear sitios web accesibles, de bajo carbono, y a acceder a subvenciones digitales.'
    },
    'Accountability': { fr: 'Responsabilit\u00e9', es: 'Responsabilidad' },
    'Impact Dashboard': { fr: 'Tableau de bord d\u2019impact', es: 'Panel de impacto' },
    'Tracking live impact, transparency, and measurable outcomes across our initiatives.': {
      fr: 'Suivi de l\u2019impact en temps r\u00e9el, transparence et r\u00e9sultats mesurables de nos initiatives.',
      es: 'Seguimiento del impacto en tiempo real, transparencia y resultados medibles de nuestras iniciativas.'
    },
    'Our Story': { fr: 'Notre histoire', es: 'Nuestra historia' },
    'Our Mission': { fr: 'Notre mission', es: 'Nuestra misi\u00f3n' },
    'Our Founder': { fr: 'Notre fondateur', es: 'Nuestro fundador' },
    'Our Board': { fr: 'Notre conseil', es: 'Nuestro consejo' },
    'Annual Reports': { fr: 'Rapports annuels', es: 'Informes anuales' },
    'News / Press': { fr: 'Actualit\u00e9s', es: 'Noticias' },
    'General': { fr: 'G\u00e9n\u00e9ral', es: 'General' },
    'Get Involved': { fr: 'S\u2019impliquer', es: 'Participar' },
    'For Nonprofits': { fr: 'Pour les OBNL', es: 'Para organizaciones' },
    'Contact': { fr: 'Contact', es: 'Contacto' },
    'Sustainability Statement': { fr: 'D\u00e9claration de durabilit\u00e9', es: 'Declaraci\u00f3n de sostenibilidad' },
    'Tree Planting Statement': { fr: 'D\u00e9claration de plantation d\u2019arbres', es: 'Declaraci\u00f3n de plantaci\u00f3n de \u00e1rboles' },
    'Accessibility Statement': { fr: 'D\u00e9claration d\u2019accessibilit\u00e9', es: 'Declaraci\u00f3n de accesibilidad' },
    'Privacy Policy': { fr: 'Politique de confidentialit\u00e9', es: 'Pol\u00edtica de privacidad' },
    'Building a more sustainable digital future through energy-efficient websites, transparent impact, and technology that supports communities and the planet.': {
      fr: 'B\u00e2tir un avenir num\u00e9rique plus durable gr\u00e2ce \u00e0 des sites web \u00e9co\u00e9nerg\u00e9tiques, un impact transparent et une technologie qui soutient les communaut\u00e9s et la plan\u00e8te.',
      es: 'Construyendo un futuro digital m\u00e1s sostenible a trav\u00e9s de sitios web eficientes en energ\u00eda, impacto transparente y tecnolog\u00eda que apoya a las comunidades y al planeta.'
    },
    '\u00a9 2026 Oasis of Change, Inc. All rights reserved.': {
      fr: '\u00a9 2026 Oasis of Change, Inc. Tous droits r\u00e9serv\u00e9s.',
      es: '\u00a9 2026 Oasis of Change, Inc. Todos los derechos reservados.'
    },
    'Learn More': { fr: 'En savoir plus', es: 'M\u00e1s informaci\u00f3n' },
    'Read More': { fr: 'Lire la suite', es: 'Leer m\u00e1s' },
    'Show More': { fr: 'Voir plus', es: 'Ver m\u00e1s' },
    'Contact Us': { fr: 'Nous contacter', es: 'Cont\u00e1ctenos' },
    'Send Message': { fr: 'Envoyer le message', es: 'Enviar mensaje' },
    'View Case Studies': { fr: 'Voir les \u00e9tudes de cas', es: 'Ver estudios de caso' },
    'Read Full Case Study': { fr: 'Lire l\u2019\u00e9tude de cas compl\u00e8te', es: 'Leer el estudio de caso completo' },
    'View Impact': { fr: 'Voir l\u2019impact', es: 'Ver el impacto' },
    'Back to Home': { fr: 'Retour \u00e0 l\u2019accueil', es: 'Volver al inicio' }
  };

  /* ── State ─────────────────────────────────────────────────── */
  var activeLang = 'en';
  var desktopBtnLabel = null;
  var desktopDropdownEl = null;
  var isDropdownOpen = false;

  /* ── Persistence ───────────────────────────────────────────── */
  function sanitizeLangCode(code) {
    var v = (code || '').toLowerCase().trim();
    return v && findLang(v) ? v : null;
  }

  function loadLangFromURL() {
    try {
      var params = new URLSearchParams(window.location.search);
      return sanitizeLangCode(params.get('l')) ||
             sanitizeLangCode(params.get('L')) ||
             sanitizeLangCode(params.get('lang')) ||
             sanitizeLangCode(params.get('language'));
    } catch (e) {
      return null;
    }
  }

  function loadLang() {
    var fromURL = loadLangFromURL();
    if (fromURL) {
      saveLang(fromURL);
      return fromURL;
    }
    try { return sanitizeLangCode(localStorage.getItem(STORAGE_KEY)) || 'en'; }
    catch (e) { return 'en'; }
  }
  function saveLang(code) {
    try { localStorage.setItem(STORAGE_KEY, code); } catch (e) {}
  }
  function findLang(code) {
    for (var i = 0; i < LANGS.length; i++) { if (LANGS[i].code === code) return LANGS[i]; }
    return null;
  }

  /* ── Google Translate cookie ───────────────────────────────── */
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

  /* ── Google Translate loader ───────────────────────────────── */
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

      // If a non-English language is saved, trigger GT after it inits
      if (activeLang !== 'en') {
        waitForGTCombo(function (combo) {
          combo.value = activeLang;
          combo.dispatchEvent(new Event('change'));
        });
      }
    };

    var s = document.createElement('script');
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.onerror = function () {
      // GT failed to load — dictionary translations already applied as fallback
    };
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

  /* ── CSS to hide Google Translate's default UI ─────────────── */
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

  /* ── Curated dictionary — instant pass ─────────────────────── */
  function norm(s) { return (s || '').replace(/\s+/g, ' ').trim(); }

  function applyDictionary(lang) {
    if (lang === 'en') return;

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' ||
            tag === 'TEXTAREA' || tag === 'CODE' || tag === 'PRE') {
          return NodeFilter.FILTER_REJECT;
        }
        if (p.closest('[data-lang-switcher]') || p.closest('.lang-switcher-mobile')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    while (walker.nextNode()) {
      var node = walker.currentNode;
      var raw = node.textContent;
      var key = norm(raw);
      if (!key || !T[key] || !T[key][lang]) continue;

      var leading = raw.match(/^(\s*)/)[1];
      var trailing = raw.match(/(\s*)$/)[1];
      node.textContent = leading + T[key][lang] + trailing;

      // Mark parent so Google Translate skips it (avoids double-translation)
      if (node.parentElement) {
        node.parentElement.classList.add('notranslate');
      }
    }

    // Translate aria-labels
    var ariaEls = document.querySelectorAll('[aria-label]');
    for (var i = 0; i < ariaEls.length; i++) {
      var el = ariaEls[i];
      if (el.closest('[data-lang-switcher]') || el.closest('.lang-switcher-mobile')) continue;
      var val = norm(el.getAttribute('aria-label'));
      if (T[val] && T[val][lang]) {
        el.setAttribute('aria-label', T[val][lang]);
      }
    }
  }

  /* ── SVG helpers ───────────────────────────────────────────── */
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

  /* ── Build desktop switcher ────────────────────────────────── */
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

  /* ── Build mobile switcher ─────────────────────────────────── */
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

  /* ── Inject switchers into the page ────────────────────────── */
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
  }

  /* ── Desktop dropdown behaviour ────────────────────────────── */
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

  /* ── Update switcher UI to reflect active language ─────────── */
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

  /* ── Switch language ───────────────────────────────────────── */
  function switchTo(code) {
    if (code === activeLang) return;
    saveLang(code);
    setGTCookie(code);
    // Reload the page — GT will auto-translate via cookie,
    // and our dictionary pass runs on DOMContentLoaded for instant nav/footer.
    location.reload();
  }

  /* ── Init ──────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    activeLang = loadLang();
    // Keep GT cookie aligned with selected language even for English,
    // so shared links can reliably reset translation back to default.
    setGTCookie(activeLang);

    // 1. Hide Google Translate's default chrome
    injectGTHideCSS();

    // 2. Build and inject our language switcher UI
    inject();
    updateSwitcherUI();

    // 3. If non-English, apply curated dictionary immediately (fast, no flash)
    if (activeLang !== 'en') {
      applyDictionary(activeLang);
      document.documentElement.lang = activeLang;
    }

    // 4. Load Google Translate to handle ALL remaining page content
    loadGoogleTranslate();
  });
})();
