(function () {
  'use strict';

  // --- Mobile Nav (Drawer style) ---
  function initDrawerNav() {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var drawer = document.querySelector('[data-mobile-drawer]');
    var overlay = document.querySelector('[data-mobile-overlay]');
    var closeBtn = document.querySelector('[data-mobile-close]');
    if (!toggle || !drawer) return;

    var panel = drawer.querySelector('[data-mobile-panel]');
    var bars = toggle.querySelectorAll('[data-bar]');

    function open() {
      drawer.classList.remove('pointer-events-none');
      drawer.style.display = '';
      // Force reflow so transitions trigger
      void drawer.offsetHeight;
      if (overlay) overlay.classList.replace('opacity-0', 'opacity-100');
      if (panel) {
        panel.classList.remove('translate-x-full');
        panel.classList.add('translate-x-0');
      }
      toggle.setAttribute('aria-expanded', 'true');
      bars[0].classList.add('translate-y-[8px]', 'rotate-45');
      bars[1].classList.add('opacity-0');
      bars[1].classList.remove('opacity-100');
      bars[2].classList.add('-translate-y-[8px]', '-rotate-45');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      if (overlay) overlay.classList.replace('opacity-100', 'opacity-0');
      if (panel) {
        panel.classList.remove('translate-x-0');
        panel.classList.add('translate-x-full');
      }
      toggle.setAttribute('aria-expanded', 'false');
      bars[0].classList.remove('translate-y-[8px]', 'rotate-45');
      bars[1].classList.remove('opacity-0');
      bars[1].classList.add('opacity-100');
      bars[2].classList.remove('-translate-y-[8px]', '-rotate-45');
      document.body.style.overflow = '';
      setTimeout(function () {
        drawer.style.display = 'none';
        drawer.classList.add('pointer-events-none');
      }, 300);
    }

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      isOpen ? close() : open();
    });

    if (overlay) overlay.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);
  }

  // --- Mobile Nav (Panel/dropdown style) ---
  function initPanelNav() {
    var toggle = document.querySelector('[data-mobile-panel-toggle]');
    var panel = document.querySelector('[data-mobile-panel-menu]');
    if (!toggle || !panel) return;

    panel.style.display = 'none';

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      var isHidden = panel.style.display === 'none';
      if (isHidden) {
        panel.style.display = '';
        void panel.offsetHeight;
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
      } else {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(-8px)';
        setTimeout(function () { panel.style.display = 'none'; }, 200);
      }
    });
  }

  // --- Accordion (Project cards) ---
  function initAccordion() {
    var buttons = document.querySelectorAll('[data-accordion-btn]');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      var targetId = btn.getAttribute('data-accordion-btn');
      var content = document.querySelector('[data-accordion-panel="' + targetId + '"]');
      var arrow = btn.querySelector('[data-accordion-arrow]');
      if (!content) return;

      var isOpen = btn.getAttribute('data-accordion-default') === 'open';
      content.style.overflow = 'hidden';
      content.style.transition = 'height 0.35s ease, opacity 0.25s ease';

      function collapse() {
        content.style.height = content.scrollHeight + 'px';
        void content.offsetHeight;
        content.style.height = '0';
        content.style.opacity = '0';
        if (arrow) arrow.classList.remove('rotate-90');
        if (arrow) arrow.classList.add('rotate-0');
      }

      function expand() {
        content.style.display = '';
        content.style.height = '0';
        void content.offsetHeight;
        content.style.height = content.scrollHeight + 'px';
        content.style.opacity = '1';
        if (arrow) arrow.classList.remove('rotate-0');
        if (arrow) arrow.classList.add('rotate-90');
        setTimeout(function () { content.style.height = 'auto'; }, 350);
      }

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

        // Close all siblings first (only one open at a time)
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

        currentlyOpen ? collapse() : expand();
      });
    });
  }

  // --- Blog "show more" toggle ---
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

  // --- Image comparison slider ---
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
        var add = isDark ? darkPill : lightPill;
        var remove = isDark ? lightPill : darkPill;
        remove.forEach(function (c) { el.classList.remove(c); });
        add.forEach(function (c) { el.classList.add(c); });
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
        var x = e.clientX - rect.left;
        var pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
        updatePos(pct);
      });
      window.addEventListener('pointerup', function () { dragging = false; });
      window.addEventListener('pointercancel', function () { dragging = false; });

      updatePos(50);
    });
  }

  // --- Init all ---
  document.addEventListener('DOMContentLoaded', function () {
    initDrawerNav();
    initPanelNav();
    initAccordion();
    initBlogToggle();
    initImageSlider();
  });
})();
