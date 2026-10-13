/* Hero-lab — the home hero «Spesialist på nøter.» is locked; ← / → only
   switches the shade behind the text. No on-page indicators; the current
   version shows as ?hero=N in the address bar (1 = no parameter).
   Also fits the one-line headline to the available width.
   Temporary: fold the chosen shade into main.css and remove this file. */
(function () {
  var hero = document.querySelector('[data-hero-lab]');
  if (!hero) return;

  var SHADES = [
    'radial',      // 1 the vignette as it was, fixed to the screen
    'moved',       // 2 narrower to the right, higher, touch of top-left
    'hug',         // 3 soft patch shaped like the text block
    'hug-corner',  // 4 as 3 + darker top-left corner of the photo
    'cloud',       // 5 as 3, tighter (more photo free)
    'hug-strong',  // 6 as 3, stronger and larger
    'hug-light'    // 7 as 3, lighter + soft shadow on the type
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
