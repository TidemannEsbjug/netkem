/* Hero-lab — the home hero «Spesialist på nøter.» is locked; ← / → only
   switches the light area behind the text. No on-page indicators; the current
   version shows as ?hero=N in the address bar (1 = no parameter).
   Also fits the one-line headline to the available width.
   Temporary: fold the chosen shade into main.css and remove this file. */
(function () {
  var hero = document.querySelector('[data-hero-lab]');
  if (!hero) return;

  var SHADES = [
    'light-white',      // 1 white vignette (standard)
    'light-frost',      // 2 white + blur, as first shown
    'light-frost-1',    // 3 smaller
    'light-frost-2',    // 4 larger
    'light-frost-3',    // 5 wider and lower
    'light-frost-4',    // 6 narrower and taller
    'light-frost-5',    // 7 moved right
    'light-frost-6',    // 8 moved left
    'light-frost-7',    // 9 moved up
    'light-frost-8',    // 10 moved down
    'light-frost-9',    // 11 from the left edge
    'light-frost-10',   // 12 from the top-left corner
    'light-frost-11',   // 13 more blur
    'light-frost-12',   // 14 a lot of blur, less white
    'light-frost-13',   // 15 little blur, whiter
    'light-frost-14',   // 16 mostly blur, barely white
    'light-frost-15',   // 17 whiter
    'light-frost-16',   // 18 harder edge
    'light-frost-17',   // 19 long, soft fade
    'light-frost-18',   // 20 large and mild
    'light-frost-19',   // 21 centred on the title
    'light-frost-20'    // 22 diagonal band (two areas)
  ];

  /* Shrink the one-line title until it fits the content width */
  function fit() {
    var block = hero.querySelector('.hero-copy.is-active');
    if (!block) return;
    var t = block.querySelector('.hero-copy__title.is-one-line');
    if (!t) return;
    t.style.fontSize = '';
    var c = block.parentElement;
    var cs = window.getComputedStyle(c);
    var bs = window.getComputedStyle(block);
    var avail = c.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) -
                parseFloat(bs.paddingLeft) - parseFloat(bs.paddingRight);
    var w = t.getBoundingClientRect().width;
    if (w > avail) {
      t.style.fontSize = (parseFloat(window.getComputedStyle(t).fontSize) * avail / w * 0.98) + 'px';
    }
  }

  var params = new URLSearchParams(window.location.search);
  var idx = (parseInt(params.get('hero'), 10) || 1) - 1;
  var inView = true;

  function apply(i) {
    idx = (i + SHADES.length) % SHADES.length;
    hero.setAttribute('data-shade', SHADES[idx]);
    if (window.history && window.history.replaceState && window.URL) {
      var url = new URL(window.location.href);
      if (idx === 0) url.searchParams.delete('hero');
      else url.searchParams.set('hero', String(idx + 1));
      window.history.replaceState(null, '', url);
    }
  }
  apply(Math.min(Math.max(idx, 0), SHADES.length - 1));
  fit();

  var fitQueued = false;
  window.addEventListener('resize', function () {
    if (fitQueued) return;
    fitQueued = true;
    window.requestAnimationFrame(function () { fitQueued = false; fit(); });
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

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
    apply(idx + (e.key === 'ArrowRight' ? 1 : -1));
  });
})();
