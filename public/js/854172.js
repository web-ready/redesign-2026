(function () {
  const compare = document.querySelector('[data-image-compare]');
  const reveal = compare ? compare.querySelector('[data-compare-reveal]') : null;
  const divider = compare ? compare.querySelector('[data-compare-divider]') : null;
  const handle = compare ? compare.querySelector('[data-compare-handle]') : null;
  const range = compare ? compare.querySelector('[data-compare-range]') : null;
  const beforeLabel = compare ? compare.querySelector('[data-compare-label-before]') : null;
  const afterLabel = compare ? compare.querySelector('[data-compare-label-after]') : null;

  if (!compare || !reveal || !divider || !handle || !range || !beforeLabel || !afterLabel) return;

  let dragging = false;

  function getPercentFromClientX(clientX) {
    const rect = compare.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    return (x / rect.width) * 100;
  }

  function updateActiveLabels(percent) {
    const beforeActive = percent <= 50;

    if (beforeActive) {
      beforeLabel.className = 'inline-flex items-center rounded-full px-3 md:px-4 py-2 text-xs md:text-sm font-semibold border transition duration-200 bg-[#b42318] text-white border-[#8f1e15] shadow-[0_10px_26px_rgba(180,35,24,0.35)] ring-2 ring-white';
      afterLabel.className = 'inline-flex items-center rounded-full px-3 md:px-4 py-2 text-xs md:text-sm font-semibold border transition duration-200 bg-white text-gray-900 border-gray-300 shadow-[0_4px_12px_rgba(0,0,0,0.08)]';
    } else {
      beforeLabel.className = 'inline-flex items-center rounded-full px-3 md:px-4 py-2 text-xs md:text-sm font-semibold border transition duration-200 bg-white text-gray-900 border-gray-300 shadow-[0_4px_12px_rgba(0,0,0,0.08)]';
      afterLabel.className = 'inline-flex items-center rounded-full px-3 md:px-4 py-2 text-xs md:text-sm font-semibold border transition duration-200 bg-[#166534] text-white border-[#14532d] shadow-[0_10px_26px_rgba(22,101,52,0.32)] ring-2 ring-white';
    }
  }

  function updateCompare(percent) {
    const clamped = Math.max(0, Math.min(100, percent));
    reveal.style.width = clamped + '%';
    divider.style.left = `calc(${clamped}% - 1px)`;
    range.value = String(Math.round(clamped));
    range.setAttribute('aria-valuetext', `${Math.round(clamped)} percent before website shown`);
    updateActiveLabels(clamped);
  }

  handle.addEventListener('pointerdown', function (event) {
    dragging = true;
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  handle.addEventListener('pointermove', function (event) {
    if (!dragging) return;
    updateCompare(getPercentFromClientX(event.clientX));
  });

  handle.addEventListener('pointerup', function (event) {
    dragging = false;
    handle.releasePointerCapture(event.pointerId);
  });

  handle.addEventListener('pointercancel', function () {
    dragging = false;
  });

  compare.addEventListener('click', function (event) {
    if (event.target === handle) return;
    updateCompare(getPercentFromClientX(event.clientX));
  });

  range.addEventListener('input', function () {
    updateCompare(Number(range.value));
  });

  // Keep keyboard focus behavior predictable for screen reader and keyboard users.
  handle.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      updateCompare(Number(range.value) - 2);
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      updateCompare(Number(range.value) + 2);
    } else if (event.key === 'Home') {
      event.preventDefault();
      updateCompare(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      updateCompare(100);
    }
  });

  updateCompare(Number(range.value || 50));
})();