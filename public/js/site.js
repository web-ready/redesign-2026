(function () {
  'use strict';

  function initMobileNav() {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) return;
    var menuIcon = toggle.querySelector('[data-icon-menu]');
    var closeIcon = toggle.querySelector('[data-icon-close]');
    var isOpen = false;

    
    var navEl = toggle.closest('nav');
    var flexRow = navEl ? navEl.firstElementChild : null;
    var overflowActive = false;

    
    var logoFull = navEl ? navEl.querySelector('img[src*="Oasis_of_Change-official"]') : null;
    var logoIcon = null;
    if (logoFull) {
      logoIcon = document.createElement('img');
      logoIcon.src = logoFull.src.replace('Oasis_of_Change-official.svg', 'oasis-of-change-icon.svg');
      logoIcon.alt = logoFull.alt;
      logoIcon.className = logoFull.className;
      logoIcon.style.display = 'none';
      logoIcon.width = 56;
      logoIcon.height = 56;
      logoFull.parentNode.insertBefore(logoIcon, logoFull.nextSibling);
    }

    function setLogoCompact(compact) {
      if (!logoFull || !logoIcon) return;
      logoFull.style.display = compact ? 'none' : '';
      logoIcon.style.display = compact ? '' : 'none';
    }

    
    var navUl = flexRow ? flexRow.querySelector('ul') : null;
    var supportWrap = flexRow ? flexRow.querySelector('.justify-end') : null;

    function setNavCompact(compact) {
      if (!flexRow) return;
      flexRow.style.gap = compact ? '0.25rem' : '';
      if (navUl) {
        navUl.style.gap = compact ? '0' : '';
        for (var i = 0; i < navUl.children.length; i++) {
          var a = navUl.children[i].querySelector('a');
          if (a) {
            a.style.paddingLeft = compact ? '0.375rem' : '';
            a.style.paddingRight = compact ? '0.375rem' : '';
          }
        }
      }
      if (supportWrap) supportWrap.style.gap = compact ? '0.25rem' : '';
    }

    
    var navMotionMs = 240;
    var navEase = 'cubic-bezier(0.2, 0.9, 0.2, 1)';
    var navTransitionCss =
      'height ' + navMotionMs + 'ms ' + navEase + ', opacity ' + navMotionMs + 'ms ' + navEase + ', transform ' + navMotionMs + 'ms ' + navEase +
      ', padding-top ' + navMotionMs + 'ms ' + navEase + ', padding-bottom ' + navMotionMs + 'ms ' + navEase;

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
      panel.style.paddingTop = '';
      panel.style.paddingBottom = '';
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
        panel.style.paddingTop = '0';
        panel.style.paddingBottom = '0';
        setPanelHeightPx(0, false);
        finalizeMobilePanelHidden();
      } else {
        
        
        var startPx = panel.offsetHeight;
        if (!startPx || startPx < 1) {
          startPx = getPanelTargetPx();
        }
        setPanelHeightPx(startPx, false);
        void panel.offsetHeight;
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(-6px)';
        panel.style.paddingTop = '0';
        panel.style.paddingBottom = '0';
        setPanelHeightPx(0, true);
        setTimeout(function () {
          if (!isOpen) finalizeMobilePanelHidden();
        }, navMotionMs + 40);
      }

      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      setToggleIcons(false);
    }

    function desktopNavActive() {
      if (overflowActive) return false;
      try {
        return window.matchMedia && window.matchMedia('(min-width: 1024px)').matches;
      } catch (e) {
        return window.innerWidth >= 1024;
      }
    }

    function measureNavOverflow() {
      var children = flexRow.children;
      var savedShrink = [];
      for (var i = 0; i < children.length; i++) {
        savedShrink.push(children[i].style.flexShrink);
        children[i].style.flexShrink = '0';
      }
      var containerWidth = flexRow.clientWidth;
      var totalWidth = 0;
      var visibleCount = 0;
      for (var i = 0; i < children.length; i++) {
        var w = children[i].offsetWidth;
        if (w > 0) { totalWidth += w; visibleCount++; }
      }
      if (visibleCount > 1) totalWidth += 16 * (visibleCount - 1);
      for (var i = 0; i < children.length; i++) {
        children[i].style.flexShrink = savedShrink[i];
      }
      return totalWidth > containerWidth;
    }

    function checkNavOverflow() {
      if (!navEl || !flexRow) return;
      if (window.innerWidth < 1024) {
        navEl.classList.remove('nav-overflow-active');
        overflowActive = false;
        setLogoCompact(false);
        setNavCompact(false);
        return;
      }
      
      navEl.classList.remove('nav-overflow-active');
      overflowActive = false;
      setLogoCompact(false);
      setNavCompact(false);

      
      if (!measureNavOverflow()) return;

      
      setNavCompact(true);
      if (!measureNavOverflow()) return;

      
      setLogoCompact(true);
      if (!measureNavOverflow()) return;

      
      setLogoCompact(false);
      setNavCompact(false);
      navEl.classList.add('nav-overflow-active');
      overflowActive = true;
    }

    function syncNavByViewport() {
      if (desktopNavActive() && isOpen) {
        close();
      }
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
      checkNavOverflow();
      syncNavByViewport();
      if (isOpen) setPanelHeightPx(getPanelTargetPx(), false);
    });

    if (menuIcon && closeIcon) {
      closeIcon.style.opacity = '0';
      closeIcon.style.pointerEvents = 'none';
    }

    
    checkNavOverflow();
    window.addEventListener('load', checkNavOverflow);

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

    syncNavByViewport();
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
        var allowMultiple = !!btn.closest('[data-accordion-allow-multiple]');

        if (!allowMultiple) {
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
        }

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

  function initSmoothScroll() {
    var scrollLinks = document.querySelectorAll('.js-scroll-to-ways');
    scrollLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = this.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) return;
        
        var targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
  }

  function logCuriousCoderMessage() {
    if (typeof window === 'undefined' || !window.console) return;
    if (window.__oocConsoleMessageShown) return;
    window.__oocConsoleMessageShown = true;

    var logo = '  ___            _          __    ___ _                          \n' +
      ' / _ \\ __ _ ___ (_)___  __ / _|  / __| |_  __ _ _ _  __ _ ___   \n' +
      '| (_) / _` (_-< | (_-< / _|  _| | (__| \' \\/ _` | \' \\/ _` / -_)  \n' +
      ' \\___/\\__,_/__/ |_/__/ \\__|_|    \\___|_||_\\__,_|_||_\\__, \\___|  \n' +
      '                                                    |___/        ';

    console.log('%c' + logo, 'color:#4ade80;font-family:monospace;font-weight:700;line-height:1.3;');
    console.log(
      '%c  Hey, conscious coder. %cYou just inspected a website that\n  tries to leave the internet better than it found it.',
      'color:#4ade80;font-size:13px;font-weight:700;',
      'color:#d1d5db;font-size:13px;font-weight:400;'
    );
    console.log(
      '%c  We build sustainable, accessible tech for nonprofits and\n' +
      '  environmental orgs. Every page is lightweight by design.',
      'color:#9ca3af;font-size:12px;line-height:1.5;'
    );
  }

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var typeSelect = document.getElementById('cf-type');
    var successEl = document.getElementById('cf-success');
    var conditionals = form.querySelectorAll('.cf-conditional');

    function showSections(type) {
      conditionals.forEach(function (el) {
        var showFor = el.getAttribute('data-cf-show');
        var showUnless = el.getAttribute('data-cf-show-unless');
        var visible = false;

        if (showFor) {
          visible = type === showFor;
        } else if (showUnless) {
          visible = type !== '' && type !== showUnless;
        }

        if (visible) {
          el.classList.add('is-visible');
        } else {
          el.classList.remove('is-visible');
        }
      });
    }

    // Pre-select inquiry type from URL parameter (?type=volunteer, etc.)
    try {
      var params = new URLSearchParams(window.location.search);
      var preselect = params.get('type') || '';
      if (preselect && typeSelect) {
        for (var i = 0; i < typeSelect.options.length; i++) {
          if (typeSelect.options[i].value === preselect) {
            typeSelect.value = preselect;
            showSections(preselect);
            break;
          }
        }
      }
    } catch (e) {
      // URLSearchParams not supported — ignore
    }

    if (typeSelect) {
      typeSelect.addEventListener('change', function () {
        showSections(this.value);
      });
    }

    // Clear field errors on interaction
    function clearFieldError(field) {
      var parent = field.closest('.cf-field');
      if (!parent) parent = field.parentElement;
      field.classList.remove('cf-input-error');
      var err = parent ? parent.querySelector('.cf-error-text') : null;
      if (err) err.remove();
    }

    form.addEventListener('input', function (e) { clearFieldError(e.target); });
    form.addEventListener('change', function (e) { clearFieldError(e.target); });

    function addError(field, message) {
      var parent = field.closest('.cf-field');
      if (!parent) parent = field.parentElement;
      if (parent && parent.querySelector('.cf-error-text')) return;

      var err = document.createElement('p');
      err.className = 'cf-error-text';
      err.setAttribute('role', 'alert');
      err.textContent = message;
      if (parent) parent.appendChild(err);

      // Only add red border to text/select inputs, not checkboxes
      if (field.tagName !== 'INPUT' || field.type !== 'checkbox') {
        field.classList.add('cf-input-error');
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      form.querySelectorAll('.cf-error-text').forEach(function (el) { el.remove(); });
      form.querySelectorAll('.cf-input-error').forEach(function (el) { el.classList.remove('cf-input-error'); });

      var required = form.querySelectorAll('[required]');
      var valid = true;

      required.forEach(function (field) {
        // Skip fields inside hidden conditional sections
        var section = field.closest('.cf-conditional');
        if (section && !section.classList.contains('is-visible')) return;

        if (field.type === 'checkbox' && !field.checked) {
          valid = false;
          addError(field, 'This field is required');
        } else if (!field.value || !field.value.trim()) {
          valid = false;
          addError(field, 'This field is required');
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          valid = false;
          addError(field, 'Please enter a valid email address');
        }
      });

      if (!valid) {
        var firstError = form.querySelector('.cf-error-text');
        if (firstError && firstError.parentElement) {
          firstError.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // TODO: Replace with actual form submission endpoint
      // Example: fetch('/api/contact', { method: 'POST', body: new FormData(form) })
      form.style.display = 'none';
      if (successEl) successEl.style.display = '';
    });
  }

  function initLightbox() {
    var triggers = document.querySelectorAll('[data-lightbox-trigger]');
    if (!triggers.length) return;

    // Build the overlay once and reuse it.
    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image viewer');
    overlay.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close image viewer">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
      '</button>' +
      '<img class="lightbox-image" alt="" />';
    document.body.appendChild(overlay);

    var overlayImg = overlay.querySelector('.lightbox-image');
    var closeBtn = overlay.querySelector('.lightbox-close');
    var lastTrigger = null;

    function openLightbox(trigger) {
      lastTrigger = trigger;
      overlayImg.src = trigger.getAttribute('data-lightbox-src');
      overlayImg.alt = trigger.getAttribute('data-lightbox-alt') || '';
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeLightbox() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastTrigger) lastTrigger.focus();
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        openLightbox(trigger);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

  function initFooterLocale() {
    var brand = document.querySelector('.site-footer-brand');
    if (!brand || brand.querySelector('.footer-locale')) return;
    var locale = document.createElement('div');
    locale.className = 'footer-locale';
    locale.setAttribute('aria-label', 'Based in Vancouver, Canada');
    locale.innerHTML =
      '<span>Based in Vancouver, Canada</span>' +
      '<img class="footer-locale-flag" src="images/flag-canada.svg" alt="" width="22" height="11" loading="lazy" aria-hidden="true">';
    brand.appendChild(locale);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initAccordion();
    initBlogToggle();
    initImageSlider();
    initSmoothScroll();
    initContactForm();
    initLightbox();
    initFooterLocale();
    logCuriousCoderMessage();
  });
})();
