(function () {
  const beforeBtn = document.getElementById('audit-before-btn');
  const afterBtn = document.getElementById('audit-after-btn');
  const beforePanel = document.getElementById('audit-before-panel');
  const afterPanel = document.getElementById('audit-after-panel');

  if (!beforeBtn || !afterBtn || !beforePanel || !afterPanel) return;

  function showPanel(view) {
    const isBefore = view === 'before';

    beforePanel.classList.toggle('hidden', !isBefore);
    afterPanel.classList.toggle('hidden', isBefore);

    beforeBtn.setAttribute('aria-selected', String(isBefore));
    afterBtn.setAttribute('aria-selected', String(!isBefore));

    beforeBtn.className = isBefore
      ? 'px-5 py-2.5 rounded-full text-sm font-semibold tracking-tight transition bg-[#b42318] text-white'
    : 'px-5 py-2.5 rounded-full text-sm font-semibold tracking-tight transition text-gray-700';

    afterBtn.className = !isBefore
      ? 'px-5 py-2.5 rounded-full text-sm font-semibold tracking-tight transition bg-[#166534] text-white'
    : 'px-5 py-2.5 rounded-full text-sm font-semibold tracking-tight transition text-gray-700';
  }

  beforeBtn.addEventListener('click', function () {
    showPanel('before');
  });

  afterBtn.addEventListener('click', function () {
    showPanel('after');
  });

  showPanel('before');
})();