/* Hero-lab — the subtitle under the title and the light field are locked;
   ← / → switches the headline (1 = «Spesialist på nøter.»). No on-page
   indicators; the current headline shows as ?hero=N in the address bar
   (1 = no parameter).
   J (or ?juster in the address) opens a panel with sliders for the light
   field; the settings are kept in this browser (localStorage).
   Also fits the one-line headline to the available width.
   Temporary: fold the chosen shade into main.css and remove this file. */
(function () {
  var hero = document.querySelector('[data-hero-lab]');
  if (!hero) return;

  var SHADE = 'light-frost-tuned';   // the light field chosen with the J panel

  /* Headlines to try in place of «Spesialist på nøter.» — the subtitle under them is fixed in index.html.
     The earlier subtitle candidates are in git history (commit 7210023). */
  var LEADS = [
    'Spesialist på nøter.',              // 1 as now
    'Kjemikalier for sterke nøter.',     // 2
    'Spesialist på notkjemi.',           // 3
    'Kjemi som tar vare på nota.',       // 4
    'Nøter som varer.',                  // 5
    'Vi tar vare på nota.',              // 6
    'Kjemikalier for nøter.',            // 7
    'Sterke nøter. Sunn fisk.',          // 8
    'Notkjemi siden 2001.',              // 9
    'Ren not. Trygg drift.',             // 10
    'Kjemikalier for havbruk.',          // 11
    'Eksperter på nøter.',               // 12
    'Alt nota trenger.',                 // 13
    'Norsk notkjemi.',                   // 14
    'Nota i trygge hender.',             // 15
    'Spesialist på impregnering.',       // 16
    'Kjemikalier som beskytter nota.',   // 17
    'Beskyttelse for nota.'              // 18
  ];

  /* Sliders: [css variable, label, min, max, step, unit] */
  var PARAMS = [
    ['--vx',   'Vannrett posisjon',     0,   60,  0.5, '%'],
    ['--vy',   'Loddrett posisjon',     20,  80,  0.5, '%'],
    ['--fx',   'Bredde',                20,  110, 1,   '%'],
    ['--fy',   'Høyde',                 30,  150, 1,   '%'],
    ['--w0',   'Hvithet i midten',      0,   1,   0.01, ''],
    ['--w1',   'Hvithet ytre',          0,   1,   0.01, ''],
    ['--g1',   'Hvit overgang start',   0,   95,  1,   '%'],
    ['--g2',   'Hvit overgang slutt',   30,  130, 1,   '%'],
    ['--blur', 'Uskarphet',             0,   60,  1,   'px'],
    ['--ws',   'Uskarpt felt start',    0,   95,  1,   '%'],
    ['--we',   'Uskarpt felt slutt',    20,  130, 1,   '%'],
    ['--mr',   'Venstre bue, bredde',   200, 1600, 10, 'px'],
    ['--mry',  'Venstre bue, høyde',    200, 1400, 10, 'px']
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

  /* ---------- Stored slider settings (per version, this browser only) ---------- */
  var STORE = 'netkem-hero-tune';
  var tuned = {};
  try { tuned = JSON.parse(window.localStorage.getItem(STORE)) || {}; } catch (e) { tuned = {}; }
  function save() {
    try { window.localStorage.setItem(STORE, JSON.stringify(tuned)); } catch (e) { /* private mode */ }
  }

  var params = new URLSearchParams(window.location.search);
  var idx = (parseInt(params.get('hero'), 10) || 1) - 1;
  var inView = true;
  var panel = null;
  var rows = {};

  function applyTuned() {
    PARAMS.forEach(function (p) { hero.style.removeProperty(p[0]); });
    var t = tuned[SHADE] || {};
    Object.keys(t).forEach(function (k) { hero.style.setProperty(k, t[k]); });
  }

  var leadEl = hero.querySelector('.hero-copy.is-active .hero-copy__title');

  function apply(i) {
    idx = (i + LEADS.length) % LEADS.length;
    if (leadEl) leadEl.textContent = LEADS[idx];
    syncPanel();
    fit();
    if (window.history && window.history.replaceState && window.URL) {
      var url = new URL(window.location.href);
      if (idx === 0) url.searchParams.delete('hero');
      else url.searchParams.set('hero', String(idx + 1));
      window.history.replaceState(null, '', url);
    }
  }

  /* ---------- Tuning panel ---------- */
  function fmt(v, unit) { return (Math.round(v * 100) / 100) + unit; }
  function current(p) {
    var v = parseFloat(window.getComputedStyle(hero).getPropertyValue(p[0]));
    return isNaN(v) ? p[2] : v;
  }
  function syncPanel() {
    if (!panel) return;
    PARAMS.forEach(function (p) {
      var v = current(p);
      rows[p[0]].range.value = v;
      rows[p[0]].out.textContent = fmt(v, p[5]);
    });
    panel.querySelector('[data-tune-version]').textContent = 'Overskrift ' + (idx + 1) + ' / ' + LEADS.length;
  }
  function valuesText() {
    return '/* NetKem hero – lyst felt (' + SHADE + ') */\n' +
      PARAMS.map(function (p) { return p[0] + ': ' + fmt(current(p), p[5]) + ';'; }).join('\n');
  }
  function say(msg) {
    var m = panel.querySelector('[data-tune-msg]');
    m.textContent = msg;
    window.clearTimeout(say.t);
    say.t = window.setTimeout(function () { m.textContent = ''; }, 2400);
  }
  function copyValues() {
    var text = valuesText();
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); say('Kopiert'); } catch (e) { say('Kunne ikke kopiere'); }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { say('Kopiert'); }, fallback);
    } else {
      fallback();
    }
  }
  function buildPanel() {
    panel = document.createElement('div');
    panel.className = 'hero-tune';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Juster lyst felt');
    var html = '<div class="hero-tune__head"><strong>Juster lyst felt</strong>' +
      '<span data-tune-version></span>' +
      '<button type="button" class="hero-tune__close" data-tune-close aria-label="Lukk">×</button></div>';
    PARAMS.forEach(function (p) {
      html += '<label class="hero-tune__row"><span>' + p[1] + '</span>' +
        '<input type="range" min="' + p[2] + '" max="' + p[3] + '" step="' + p[4] + '" data-var="' + p[0] + '">' +
        '<output></output></label>';
    });
    html += '<div class="hero-tune__foot">' +
      '<button type="button" class="hero-tune__btn" data-tune-copy>Kopier verdier</button>' +
      '<button type="button" class="hero-tune__btn hero-tune__btn--ghost" data-tune-reset>Nullstill</button>' +
      '<span class="hero-tune__msg" data-tune-msg></span></div>' +
      '<p class="hero-tune__hint">← / → bytter overskrift · J skjuler panelet</p>';
    panel.innerHTML = html;
    PARAMS.forEach(function (p) {
      var range = panel.querySelector('[data-var="' + p[0] + '"]');
      rows[p[0]] = { range: range, out: range.nextElementSibling };
      range.addEventListener('input', function () {
        var val = range.value + p[5];
        hero.style.setProperty(p[0], val);
        rows[p[0]].out.textContent = fmt(parseFloat(range.value), p[5]);
        (tuned[SHADE] = tuned[SHADE] || {})[p[0]] = val;
        save();
      });
    });
    panel.querySelector('[data-tune-close]').addEventListener('click', function () { togglePanel(false); });
    panel.querySelector('[data-tune-copy]').addEventListener('click', copyValues);
    panel.querySelector('[data-tune-reset]').addEventListener('click', function () {
      delete tuned[SHADE];
      save();
      applyTuned();
      syncPanel();
      say('Nullstilt');
    });
    document.body.appendChild(panel);
  }
  function togglePanel(open) {
    if (open && !panel) buildPanel();
    if (panel) panel.hidden = !open;
    tuned._open = !!open;
    save();
    if (open) syncPanel();
  }

  hero.setAttribute('data-shade', SHADE);
  applyTuned();
  apply(Math.min(Math.max(idx, 0), LEADS.length - 1));
  if (params.has('juster') || tuned._open) togglePanel(true);
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
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target;
    if (t && t.closest && t.closest('input, textarea, select, [contenteditable], .coast')) return;
    if (e.key === 'j' || e.key === 'J') {
      togglePanel(!panel || panel.hidden);
      return;
    }
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    if (e.shiftKey || !inView) return;
    e.preventDefault();
    apply(idx + (e.key === 'ArrowRight' ? 1 : -1));
  });
})();
