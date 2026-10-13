/* Hero-lab — flip through design variants of the home hero with ← / →.
   No on-page indicators; the current variant shows as ?hero=N in the
   address bar (variant 1 = the live design, no parameter).
   Temporary: remove once a variant is chosen. */
(function () {
  var hero = document.querySelector('[data-hero-lab]');
  if (!hero) return;

  /* Copy variants for the «Det sikre valget» design (layout 'onimage').
     long: smaller title size for headlines that run over several lines. */
  var NOT = {
    eneste: {
      eyebrow: 'Det sikre valget',
      title: 'Nota er det eneste som skiller fisken fra havet.',
      lead: 'I 25 år har vi utviklet impregnering, coating og notrens som beskytter nota — og holder fisken trygg, sesong etter sesong.',
      long: true
    },
    valget: {
      eyebrow: 'Notimpregnering · Coating · Notrens',
      title: 'Det sikre valget for nota',
      lead: 'Gjennom 25 års erfaring i oppdrettsnæringen har produktene våre beskyttet og vedlikeholdt betydelige deler av all not i norsk sjø. Med ledende forskning i ryggen sikrer vi trygg drift og sunn fisk, sesong etter sesong.',
      long: true
    },
    sterk: {
      eyebrow: 'Det sikre valget',
      title: 'Sterk not. Trygg drift.<br/>Sunn fisk.',
      lead: 'Effektiv beskyttelse mot begroing, UV og uttørking — skånsomt mot notlinet og godkjent for alle kjente notlin-typer.',
      long: true
    },
    godt: {
      eyebrow: 'Det sikre valget',
      title: 'Godt for nota.<br/>Godt for fisken.',
      lead: 'Impregnering, coating og vannbaserte vaskemidler som bevarer notas styrke og kvalitet — utviklet i samarbeid med ledende forskningsmiljøer innen havbruk.',
      long: true
    },
    tattvare: {
      eyebrow: 'Siden 2001',
      title: 'Vi har tatt vare på not i norsk sjø i 25 år.',
      lead: 'Produktene våre har beskyttet og vedlikeholdt betydelige deler av all not i norsk sjø. Med ledende forskning i ryggen sikrer vi trygg drift og sunn fisk.',
      long: true
    },
    starter: {
      eyebrow: 'Det sikre valget',
      title: 'Alt starter med nota.',
      lead: 'Fra impregnering før utsetting til vask og desinfeksjon mellom syklusene — vi har løsninger for hele driftsløpet.'
    },
    holder: {
      eyebrow: 'Det sikre valget',
      title: 'Nota holder.<br/>Fisken trives.',
      lead: 'Effektiv beskyttelse mot begroing, UV og uttørking. BPR-godkjent frem til 2033 — fri for PFAS og mikroplast.'
    },
    kjemikalier: {
      eyebrow: 'Det sikre valget',
      title: 'Kjemikalier<br/>til nøter.',
      lead: 'Impregnering, coating, notrens og desinfeksjon for oppdrettsnæringen — utviklet og levert av NetKem siden 2001.'
    },
    spesialist: {
      eyebrow: 'Det sikre valget',
      title: 'Spesialist<br/>på nøter.',
      lead: 'I 25 år har vi utviklet kjemikalier og utstyr som beskytter, rengjør og vedlikeholder nota — sesong etter sesong.'
    },
    stole: {
      eyebrow: 'Det sikre valget',
      title: 'En not du kan stole på.<br/>Hele sesongen.',
      lead: '25 års erfaring og ledende forskning i ryggen — for trygg drift og sunn fisk, sesong etter sesong.',
      long: true
    }
  };

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
    { layout: 'glass-right', copy: 'sikre' },  // 10 «Det sikre valget» in dark glass, right
    { layout: 'onimage',     copy: 'sikre', text: NOT.eneste },   // 11
    { layout: 'onimage',     copy: 'sikre', text: NOT.valget },   // 12
    { layout: 'onimage',     copy: 'sikre', text: NOT.sterk },    // 13
    { layout: 'onimage',     copy: 'sikre', text: NOT.godt },     // 14
    { layout: 'onimage',     copy: 'sikre', text: NOT.tattvare }, // 15
    { layout: 'onimage',     copy: 'sikre', text: NOT.starter },  // 16
    { layout: 'onimage',     copy: 'sikre', text: NOT.holder },   // 17
    { layout: 'onimage',     copy: 'sikre', text: NOT.stole },       // 18
    { layout: 'onimage',     copy: 'sikre', text: NOT.kjemikalier }, // 19
    { layout: 'onimage',     copy: 'sikre', text: NOT.spesialist }   // 20
  ];

  var blocks = Array.prototype.slice.call(hero.querySelectorAll('[data-copy-id]'));
  blocks.forEach(function (b) {
    b._orig = {
      eyebrow: b.querySelector('.eyebrow').textContent,
      title: b.querySelector('.hero-copy__title').innerHTML,
      lead: b.querySelector('.hero-copy__lead').textContent
    };
  });

  function setText(block, text) {
    var t = text || block._orig;
    block.querySelector('.eyebrow').textContent = t.eyebrow;
    block.querySelector('.hero-copy__title').innerHTML = t.title;
    block.querySelector('.hero-copy__lead').textContent = t.lead;
    block.querySelector('.hero-copy__title').classList.toggle('is-long', !!(text && text.long));
  }

  var params = new URLSearchParams(window.location.search);
  var idx = (parseInt(params.get('hero'), 10) || 1) - 1;
  var inView = true;

  function apply(i, animate) {
    idx = (i + VARIANTS.length) % VARIANTS.length;
    var v = VARIANTS[idx];
    hero.setAttribute('data-layout', v.layout);
    hero.setAttribute('data-copy', v.copy);
    blocks.forEach(function (b) {
      var on = b.getAttribute('data-copy-id') === v.copy;
      b.classList.toggle('is-active', on);
      setText(b, on ? v.text : null);
    });
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
