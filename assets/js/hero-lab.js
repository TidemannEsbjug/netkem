/* Hero-lab — flip through design variants of the home hero with ← / →.
   No on-page indicators; the current variant shows as ?hero=N in the
   address bar (variant 1 = the live design, no parameter).
   Temporary: remove once a variant is chosen. */
(function () {
  var hero = document.querySelector('[data-hero-lab]');
  if (!hero) return;

  var VARIANTS = [
    { layout: 'original',    copy: 'about' },  // 1  current hero
    { layout: 'dark',        copy: 'about' },  // 2  navy glass card
    { layout: 'clear',       copy: 'about' },  // 3  narrow, very transparent glass
    { layout: 'right',       copy: 'about' },  // 4  card right, net centre left
    { layout: 'bar',         copy: 'about' },  // 5  wide bar along the bottom
    { layout: 'split',       copy: 'about' },  // 6  solid white half + photo half
    { layout: 'onimage',     copy: 'sikre' },  // 7  «Det sikre valget» straight on the photo
    { layout: 'center',      copy: 'sunn'  },  // 8  centred statement
    { layout: 'corner',      copy: '25ar'  },  // 9  compact card bottom-left
    { layout: 'glass-right', copy: 'sikre' }   // 10 «Det sikre valget» in dark glass, right
  ];

  var params = new URLSearchParams(window.location.search);
  var idx = (parseInt(params.get('hero'), 10) || 1) - 1;
  var inView = true;

  function apply(i, animate) {
    idx = (i + VARIANTS.length) % VARIANTS.length;
    var v = VARIANTS[idx];
    hero.setAttribute('data-layout', v.layout);
    hero.setAttribute('data-copy', v.copy);
    if (animate) {
      hero.classList.remove('is-swapping');
      void hero.offsetWidth;
      hero.classList.add('is-swapping');
    }
    if (window.history && window.history.replaceState && window.URL) {
      var url = new URL(window.location.href);
      if (idx === 0) url.searchParams.delete('hero');
      else url.searchParams.set('hero', String(idx + 1));
      window.history.replaceState(null, '', url);
    }
  }
  apply(Math.min(Math.max(idx, 0), VARIANTS.length - 1), false);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].intersectionRatio > 0.3;
    }, { threshold: [0, 0.3, 0.6, 1] }).observe(hero);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var t = e.target;
    if (t && t.closest && t.closest('input, textarea, select, [contenteditable], .coast')) return;
    if (!inView) return;
    e.preventDefault();
    apply(idx + (e.key === 'ArrowRight' ? 1 : -1), true);
  });
})();
