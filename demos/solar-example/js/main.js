// Example Solar and Energy demo page.
(function () {
  // Fade sections in as they scroll into view.
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Phone and tablet menu.
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    var setMenu = function (open) {
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); }
    });
    window.matchMedia('(min-width: 1100px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  // "Get a quote" links: bring the hero quote card into view and put the cursor in the address box.
  // (The card and its pop-up come from quote/widget.js, which sets window.SolarQuote.)
  var card = document.getElementById('quote');
  if (!card) return;
  var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href="#quote"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      card.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' });
      if (window.SolarQuote) window.SolarQuote.focusAddress();
    });
  });
})();
