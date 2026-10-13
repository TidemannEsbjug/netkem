/* Hero-lab — the home hero «Spesialist på nøter.» is locked; ← / → only
   switches the light area behind the text. No on-page indicators; the current
   version shows as ?hero=N in the address bar (1 = no parameter).
   Also fits the one-line headline to the available width.
   Temporary: fold the chosen shade into main.css and remove this file. */
(function () {
  var hero = document.querySelector('[data-hero-lab]');
  if (!hero) return;

  var SHADES = [
    'light-round',       // 1 white, round, tied to the text (standard)
    'light-round-frost', // 2 white + blur, round
    'light-round-3',     // 3 a little smaller
    'light-round-4',     // 4 a little larger
    'light-round-5',     // 5 softer fade
    'light-round-6',     // 6 frost, whiter, little blur
    /* square, structured panels */
    'light-box',         // 7 white panel, square corners
    'light-box-solid',   // 8 fully white panel, more room
    'light-box-frost',   // 9 frosted panel: white + blur
    'light-box-line',    // 10 white panel with a thin outline
    'light-box-top',     // 11 white panel with a green top bar
    'light-box-left',    // 12 white panel with a green left bar
    'light-box-col',     // 13 white column, top to bottom of the hero
    'light-box-base',    // 14 white panel standing on the bottom edge
    'light-box-frame',   // 15 white panel with a frame line outside it
    'light-box-glass',   // 16 clear glass: mostly blur, little white
    'light-box-roomy'    // 17 white panel, extra room round the text
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
                parseFloat(bs.paddingLeft) - parseFloat(bs.paddingRight) - parseFloat(bs.marginLeft);
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
    fit();
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
