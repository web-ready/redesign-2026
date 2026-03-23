(function() {
  const init = () => {
    const yearSpans = document.querySelectorAll('.copyright-year');
    yearSpans.forEach(span => {
      span.textContent = new Date().getFullYear();
    });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();