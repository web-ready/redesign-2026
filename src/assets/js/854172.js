(function () {
  const slider = document.getElementById('beforeAfterSlider');
  const reveal = document.getElementById('beforeReveal');
  const divider = document.getElementById('sliderDivider');
  const handle = document.getElementById('sliderHandle');
  let dragging = false;

  function updatePosition(clientX) {
    const rect = slider.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = (x / rect.width) * 100;
    reveal.style.width = percent + '%';
    divider.style.left = `calc(${percent}% - 1px)`;
  }

  handle.addEventListener('pointerdown', function () {
    dragging = true;
  });

  window.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    updatePosition(e.clientX);
  });

  window.addEventListener('pointerup', function () {
    dragging = false;
  });
})();