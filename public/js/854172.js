(function () {
  const compare = document.querySelector('[data-image-compare]');
  const reveal = compare ? compare.querySelector('[data-compare-reveal]') : null;
  const divider = compare ? compare.querySelector('[data-compare-divider]') : null;
  const handle = compare ? compare.querySelector('[data-compare-handle]') : null;
  const range = compare ? compare.querySelector('[data-compare-range]') : null;
  const statusLabel = document.querySelector('[data-compare-status]');

  if (!compare || !reveal || !divider || !handle || !range || !statusLabel) return;

  let dragging = false;

  function getPercentFromClientX(clientX) {
    const rect = compare.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    return (x / rect.width) * 100;
  }

  function updateActiveLabels(percent) {
    if (percent < 40) {
      statusLabel.textContent = 'Mostly viewing: Before';
    } else if (percent > 60) {
      statusLabel.textContent = 'Mostly viewing: After';
    } else {
      statusLabel.textContent = 'Comparing both versions';
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