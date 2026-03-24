(function () {
  'use strict';

  function initMobileNav() {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) return;

    var bars = toggle.querySelectorAll('[data-bar]');
    var isOpen = false;

    function setBars(open) {
      if (bars.length < 3) return;
      if (open) {
        bars[0].style.transform = 'translateY(7px) rotate(45deg)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity = '1';
        bars[2].style.transform = '';
      }
    }

    function collapseAllDropdowns() {
      panel.querySelectorAll('[data-nav-dropdown-content]').forEach(function (dd) {
        dd.style.display = 'none';
        dd.style.maxHeight = '0';
        dd.style.opacity = '0';
        var chevron = dd.parentElement.querySelector('[data-nav-dropdown-chevron]');
        if (chevron) chevron.style.transform = '';
      });
    }

    function open() {
      isOpen = true;
      panel.style.display = '';
      void panel.offsetHeight;
      panel.style.maxHeight = panel.scrollHeight + 'px';
      panel.style.opacity = '1';
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation menu');
      setBars(true);
    }

    function close() {
      isOpen = false;
      panel.style.maxHeight = '0';
      panel.style.opacity = '0';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      setBars(false);
      setTimeout(function () {
        if (!isOpen) {
          panel.style.display = 'none';
          collapseAllDropdowns();
        }
      }, 300);
    }

    panel.style.display = 'none';
    panel.style.maxHeight = '0';
    panel.style.opacity = '0';
    panel.style.overflow = 'hidden';
    panel.style.transition = 'max-height 0.3s ease, opacity 0.25s ease';

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      isOpen ? close() : open();
    });

    panel.querySelectorAll('[data-nav-dropdown-toggle]').forEach(function (btn) {
      var content = btn.nextElementSibling;
      if (!content || !content.hasAttribute('data-nav-dropdown-content')) return;
      var chevron = btn.querySelector('[data-nav-dropdown-chevron]');

      content.style.maxHeight = '0';
      content.style.opacity = '0';
      content.style.transition = 'max-height 0.25s ease, opacity 0.2s ease';

      btn.addEventListener('click', function () {
        var ddOpen = content.style.display !== 'none';
        if (ddOpen) {
          content.style.maxHeight = '0';
          content.style.opacity = '0';
          if (chevron) chevron.style.transform = '';
          setTimeout(function () { content.style.display = 'none'; }, 250);
        } else {
          content.style.display = '';
          void content.offsetHeight;
          content.style.maxHeight = content.scrollHeight + 'px';
          content.style.opacity = '1';
          if (chevron) chevron.style.transform = 'rotate(180deg)';
        }
        setTimeout(function () {
          if (isOpen) panel.style.maxHeight = panel.scrollHeight + 'px';
        }, 260);
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
    initMobileNav();
    initAccordion();
    initBlogToggle();
    initImageSlider();
  });
})();
