document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll reveal observer
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // 2. Allocation bar fill on scroll into view
  const bars = document.querySelectorAll('.bar-fill');
  const barIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const pct = e.target.getAttribute('data-pct');
        e.target.style.width = pct + '%';
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => barIo.observe(b));
});
