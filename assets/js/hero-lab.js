/* Hero-lab — the home hero «Spesialist på nøter.» is locked; ← / → only
   switches small steps of the shade behind the text. No on-page indicators; the current
   version shows as ?hero=N in the address bar (1 = no parameter).
   Also fits the one-line headline to the available width.
   Temporary: fold the chosen shade into main.css and remove this file. */
(function () {
  var hero = document.querySelector('[data-hero-lab]');
  if (!hero) return;

  var SHADES = [
    'petrol',      // 1 petrol vignette, a hair further up than the original
    'petrol-more', // 2 a hair more
    'petrol-less',  // 3 the original position, in petrol
    /* 4–9 inverted: light shade, dark text */
    'light-white',  // 4 white vignette
    'light-cream',  // 5 warm cream vignette
    'light-mint',   // 6 light mint vignette, dark petrol type
    'light-frost',  // 7 light frosted glass, photo blurred behind the text
    'light-strong', // 8 white, stronger and wider
    'light-band'    // 9 white band from the left edge
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
