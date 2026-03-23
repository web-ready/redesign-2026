(function() {
  const init = () => {
    const matchImageToText = () => {
      const sections = document.querySelectorAll('.grid');
      sections.forEach(grid => {
        const textCol = grid.querySelector('.max-w-xl');
        const imageWrapper = grid.querySelector('.founder-image-wrapper');
        const image = grid.querySelector('.founder-image');
        if (textCol && imageWrapper && image) {
          const textHeight = textCol.offsetHeight;
          image.style.height = textHeight + 'px';
        }
      });
    };

    matchImageToText();
    window.addEventListener('resize', matchImageToText);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();