(function () {
  'use strict';

  function injectMobileNavFocusStyles() {
    if (document.getElementById('site-mobile-nav-focus')) return;
    var ring = 'rgb(74, 222, 128)';
    var s = document.createElement('style');
    s.id = 'site-mobile-nav-focus';
    s.textContent =
      '[data-mobile-toggle]:focus-visible{outline:2px solid ' + ring + ';outline-offset:2px}' +
      '[data-nav-dropdown-toggle]:focus-visible{outline:2px solid ' + ring + ';outline-offset:2px}' +
      '[data-mobile-panel] a:focus-visible{outline:2px solid ' + ring + ';outline-offset:2px}';
    document.head.appendChild(s);
  }

  function injectMobileNavScrollbarStyles() {
    if (document.getElementById('site-mobile-nav-scrollbar')) return;
    var s = document.createElement('style');
    s.id = 'site-mobile-nav-scrollbar';
    s.textContent =
      '[data-mobile-panel]{scrollbar-width:none;-ms-overflow-style:none}' +
      '[data-mobile-panel]::-webkit-scrollbar{width:0;height:0;display:none}';
    document.head.appendChild(s);
  }

  /** External-site indicator for Impact Dashboard in the global footer (hover / focus-visible). */
  function injectFooterExternalLinkIconStyles() {
    if (document.getElementById('site-footer-external-link-icon')) return;
    var svg =
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="black" d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>'
      );
    var s = document.createElement('style');
    s.id = 'site-footer-external-link-icon';
    s.textContent =
      '.site-global-footer a[href*="impact.oasisofchange.com"]{' +
      'display:inline-flex;align-items:center;gap:0.28em}' +
      '.site-global-footer a[href*="impact.oasisofchange.com"]::after{' +
      'content:"";flex-shrink:0;width:0.85em;height:0.85em;opacity:0;' +
      'transition:opacity .15s ease;' +
      'background-color:currentColor;' +
      '-webkit-mask-image:url("' +
      svg +
      '");mask-image:url("' +
      svg +
      '");' +
      '-webkit-mask-size:contain;mask-size:contain;' +
      '-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;' +
      '-webkit-mask-position:center;mask-position:center}' +
      '.site-global-footer a[href*="impact.oasisofchange.com"]:hover::after,' +
      '.site-global-footer a[href*="impact.oasisofchange.com"]:focus-visible::after{' +
      'opacity:1}' +
      '@media (prefers-reduced-motion:reduce){' +
      '.site-global-footer a[href*="impact.oasisofchange.com"]::after{transition:none}}';
    document.head.appendChild(s);
  }

  function initMobileNav() {
    injectMobileNavFocusStyles();
    injectMobileNavScrollbarStyles();
    var toggle = document.querySelector('[data-mobile-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) return;

    var menuIcon = toggle.querySelector('[data-icon-menu]');
    var closeIcon = toggle.querySelector('[data-icon-close]');
    var isOpen = false;
    // One duration + easing for panel + toggle icons so the header doesn't feel "ahead" of the menu.
    var navMotionMs = 240;
    var navEase = 'cubic-bezier(0.2, 0.9, 0.2, 1)';
    var navTransitionCss =
      'height ' + navMotionMs + 'ms ' + navEase + ', opacity ' + navMotionMs + 'ms ' + navEase + ', transform ' + navMotionMs + 'ms ' + navEase;

    function setToggleIcons(open) {
      if (menuIcon && closeIcon) {
        if (open) {
          menuIcon.style.opacity = '0';
          menuIcon.style.pointerEvents = 'none';
          closeIcon.style.opacity = '1';
          closeIcon.style.pointerEvents = 'auto';
        } else {
          menuIcon.style.opacity = '1';
          menuIcon.style.pointerEvents = 'auto';
          closeIcon.style.opacity = '0';
          closeIcon.style.pointerEvents = 'none';
        }
      }
    }

    function closeNavDropdown(dd) {
      dd.style.gridTemplateRows = '0fr';
      var ch = dd.parentElement.querySelector('[data-nav-dropdown-chevron]');
      if (ch) ch.style.transform = '';
    }

    function collapseAllDropdowns() {
      panel.querySelectorAll('[data-nav-dropdown-content]').forEach(closeNavDropdown);
    }

    function viewportCapPx() {
      var top = panel.getBoundingClientRect().top;
      var margin = 20;
      return Math.max(200, window.innerHeight - top - margin);
    }

    function prefersReducedMotion() {
      try {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      } catch (e) {
        return false;
      }
    }

    function getNaturalPanelContentPx() {
      var inner = panel.firstElementChild;
      if (!inner || inner.nodeType !== 1) {
        return panel.scrollHeight;
      }
      var cs = window.getComputedStyle(panel);
      var padY =
        (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      // When the panel has a fixed JS height, scrollHeight often stays at that height even after
      // inner content shrinks (e.g. switching from Initiatives to Company). Measure the inner
      // block instead so the black shell tracks the current dropdown state.
      return inner.offsetHeight + padY;
    }

    function getPanelTargetPx() {
      var cap = viewportCapPx();
      var want = getNaturalPanelContentPx();
      return Math.min(want, cap);
    }

    function setPanelHeightPx(px, allowTransition) {
      var next = Math.max(0, px) + 'px';
      if (allowTransition === false) {
        var prevTransition = panel.style.transition;
        panel.style.transition = 'none';
        panel.style.height = next;
        void panel.offsetHeight;
        panel.style.transition = prevTransition;
      } else {
        panel.style.height = next;
      }
    }

    function syncOuterPanelHeight() {
      if (!isOpen) return;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          setPanelHeightPx(getPanelTargetPx(), false);
        });
      });
    }

    function open() {
      isOpen = true;
      panel.style.display = '';
      panel.style.overflowX = 'hidden';
      panel.style.overflowY = 'auto';
      panel.style.overscrollBehavior = 'contain';
      panel.style.setProperty('-webkit-overflow-scrolling', 'touch');
      panel.style.willChange = 'height, transform, opacity';

      if (prefersReducedMotion()) {
        panel.style.transform = 'none';
        panel.style.opacity = '1';
        setPanelHeightPx(getPanelTargetPx(), false);
      } else {
        // Start closed (in-flow), then animate to measured height.
        panel.style.transform = 'translateY(-6px)';
        panel.style.opacity = '0';
        setPanelHeightPx(0, false);
        void panel.offsetHeight;

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
            setPanelHeightPx(getPanelTargetPx(), true);
          });
        });
      }
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation menu');
      setToggleIcons(true);
    }

    function finalizeMobilePanelHidden() {
      if (isOpen) return;
      panel.style.display = 'none';
      panel.style.willChange = '';
      panel.removeEventListener('transitionend', onNavPanelTransitionEnd);
      collapseAllDropdowns();
    }

    function onNavPanelTransitionEnd(e) {
      if (e.target !== panel) return;
      if (e.propertyName !== 'height') return;
      finalizeMobilePanelHidden();
    }

    function close() {
      isOpen = false;
      // Reset scroll so height/overflow match the top of the menu (avoids a second layout beat at
      // the bottom where the Support CTA lives).
      try {
        panel.scrollTop = 0;
      } catch (err) {}

      panel.style.overflowY = 'hidden';
      panel.style.overflowX = 'hidden';
      void panel.offsetHeight;

      panel.style.willChange = 'height, transform, opacity';
      panel.removeEventListener('transitionend', onNavPanelTransitionEnd);
      panel.addEventListener('transitionend', onNavPanelTransitionEnd);

      if (prefersReducedMotion()) {
        panel.style.opacity = '0';
        panel.style.transform = 'none';
        setPanelHeightPx(0, false);
        finalizeMobilePanelHidden();
      } else {
        // Use the *rendered* height (not scrollHeight math) so it stays in sync with scrollbar /
        // flex layout — avoids the menu "stopping" while the Support CTA catches up.
        var startPx = panel.offsetHeight;
        if (!startPx || startPx < 1) {
          startPx = getPanelTargetPx();
        }
        setPanelHeightPx(startPx, false);
        void panel.offsetHeight;
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(-6px)';
        setPanelHeightPx(0, true);
        setTimeout(function () {
          if (!isOpen) finalizeMobilePanelHidden();
        }, navMotionMs + 40);
      }

      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      setToggleIcons(false);
    }

    panel.style.display = 'none';
    panel.style.height = '0';
    panel.style.opacity = '0';
    panel.style.overflow = 'hidden';
    panel.style.transform = 'translateY(-6px)';
    panel.style.transition = navTransitionCss;

    if (menuIcon) menuIcon.style.transition = 'opacity ' + navMotionMs + 'ms ' + navEase;
    if (closeIcon) closeIcon.style.transition = 'opacity ' + navMotionMs + 'ms ' + navEase;

    window.addEventListener('resize', function () {
      if (isOpen) setPanelHeightPx(getPanelTargetPx(), false);
    });

    if (menuIcon && closeIcon) {
      closeIcon.style.opacity = '0';
      closeIcon.style.pointerEvents = 'none';
    }

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      isOpen ? close() : open();
    });

    panel.querySelectorAll('[data-nav-dropdown-toggle]').forEach(function (btn) {
      var content = btn.nextElementSibling;
      if (!content || !content.hasAttribute('data-nav-dropdown-content')) return;
      var chevron = btn.querySelector('[data-nav-dropdown-chevron]');

      btn.addEventListener('click', function () {
        var expanded = content.style.gridTemplateRows === '1fr';
        if (expanded) {
          closeNavDropdown(content);
        } else {
          panel.querySelectorAll('[data-nav-dropdown-content]').forEach(function (dd) {
            if (dd !== content) closeNavDropdown(dd);
          });
          content.style.gridTemplateRows = '1fr';
          if (chevron) chevron.style.transform = 'rotate(180deg)';
        }
        syncOuterPanelHeight();
      });
    });
  }

  function initAccordion() {
    var buttons = document.querySelectorAll('[data-accordion-btn]');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      var targetId = btn.getAttribute('data-accordion-btn');
      var content = document.querySelector('[data-accordion-panel="' + targetId + '"]');
      var arrow = btn.querySelector('[data-accordion-arrow]');
      if (!content) return;

      var isOpen = btn.hasAttribute('data-accordion-default');
      content.style.overflow = 'hidden';
      content.style.transition = 'height 0.35s ease, opacity 0.25s ease';

      if (isOpen) {
        content.style.height = 'auto';
        content.style.opacity = '1';
        if (arrow) arrow.classList.add('rotate-90');
      } else {
        content.style.height = '0';
        content.style.opacity = '0';
        if (arrow) arrow.classList.add('rotate-0');
      }

      btn.addEventListener('click', function () {
        var currentlyOpen = content.style.height !== '0' && content.style.height !== '0px';

        buttons.forEach(function (sibBtn) {
          var sibId = sibBtn.getAttribute('data-accordion-btn');
          var sibContent = document.querySelector('[data-accordion-panel="' + sibId + '"]');
          var sibArrow = sibBtn.querySelector('[data-accordion-arrow]');
          if (sibContent && sibId !== targetId && sibContent.style.height !== '0' && sibContent.style.height !== '0px') {
            sibContent.style.height = sibContent.scrollHeight + 'px';
            void sibContent.offsetHeight;
            sibContent.style.height = '0';
            sibContent.style.opacity = '0';
            if (sibArrow) { sibArrow.classList.remove('rotate-90'); sibArrow.classList.add('rotate-0'); }
          }
        });

        if (currentlyOpen) {
          content.style.height = content.scrollHeight + 'px';
          void content.offsetHeight;
          content.style.height = '0';
          content.style.opacity = '0';
          if (arrow) { arrow.classList.remove('rotate-90'); arrow.classList.add('rotate-0'); }
        } else {
          content.style.display = '';
          content.style.height = '0';
          void content.offsetHeight;
          content.style.height = content.scrollHeight + 'px';
          content.style.opacity = '1';
          if (arrow) { arrow.classList.remove('rotate-0'); arrow.classList.add('rotate-90'); }
          setTimeout(function () { content.style.height = 'auto'; }, 350);
        }
      });
    });
  }

  function initBlogToggle() {
    var trigger = document.querySelector('[data-show-more-trigger]');
    var items = document.querySelectorAll('[data-show-more-item]');
    if (!trigger || !items.length) return;

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      items.forEach(function (el) { el.classList.remove('hidden'); });
      trigger.style.display = 'none';
    });
  }

  function initImageSlider() {
    var sliders = document.querySelectorAll('[data-image-compare]');
    sliders.forEach(function (slider) {
      var reveal = slider.querySelector('[data-compare-reveal]');
      var divider = slider.querySelector('[data-compare-divider]');
      var handle = slider.querySelector('[data-compare-handle]');
      var beforeLabel = slider.querySelector('[data-compare-label-before]');
      var afterLabel = slider.querySelector('[data-compare-label-after]');
      if (!reveal || !divider || !handle) return;

      var dragging = false;
      var darkPill = ['bg-gray-900', 'text-white', 'border-gray-900', 'shadow-[0_8px_20px_rgba(0,0,0,0.22)]'];
      var lightPill = ['bg-white', 'text-gray-900', 'border-gray-300', 'shadow-[0_4px_12px_rgba(0,0,0,0.08)]'];

      function setPill(el, isDark) {
        if (!el) return;
        (isDark ? lightPill : darkPill).forEach(function (c) { el.classList.remove(c); });
        (isDark ? darkPill : lightPill).forEach(function (c) { el.classList.add(c); });
      }

      function updatePos(pct) {
        reveal.style.width = pct + '%';
        divider.style.left = 'calc(' + pct + '% - 1px)';
        setPill(beforeLabel, pct >= 50);
        setPill(afterLabel, pct < 50);
      }

      handle.addEventListener('pointerdown', function () { dragging = true; });
      window.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var rect = slider.getBoundingClientRect();
        var pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        updatePos(pct);
      });
      window.addEventListener('pointerup', function () { dragging = false; });
      window.addEventListener('pointercancel', function () { dragging = false; });
      updatePos(50);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectFooterExternalLinkIconStyles();
    initMobileNav();
    initAccordion();
    initBlogToggle();
    initImageSlider();
  });
})();
