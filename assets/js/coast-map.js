/* NetKem – coastal fouling map (home section 2) */
(function () {
  'use strict';

  var TOKEN = 'pk.eyJ1IjoiZ3Jva3N1cmZlciIsImEiOiJjbW5qNzhzYnIwa2hhMnFxc2JrcGNrNXRzIn0.khgdWWLFFgzzXHaISi643w';

  var GROUPS = [
    { id: 'all',   bbox: [[4.4, 57.8], [31.2, 71.4]] },
    { id: 'sor',   bbox: [[5.4, 57.85], [9.4, 59.05]] },
    { id: 'rog',   bbox: [[5.15, 58.85], [6.55, 59.62]] },
    { id: 'vest',  bbox: [[4.45, 59.2], [6.85, 62.15]] },
    { id: 'more',  bbox: [[5.1, 61.95], [8.55, 63.2]] },
    { id: 'trond', bbox: [[7.1, 62.75], [13.1, 65.5]] },
    { id: 'nordl', bbox: [[11.5, 65.25], [17.7, 69.15]] },
    { id: 'nord',  bbox: [[14.2, 68.45], [31.1, 71.35]] }
  ];

  var COPY = {
    nb: {
      chips: { all: 'Hele kysten', sor: 'Sørlandet', rog: 'Rogaland', vest: 'Vestland', more: 'Møre', trond: 'Trøndelag', nordl: 'Nordland', nord: 'Troms & Finnmark' },
      kicker: 'Typisk for strekningen',
      siteKicker: 'Valgt anlegg',
      press: { 1: 'Lavt groepress', 2: 'Middels groepress', 3: 'Høyt groepress', 4: 'Svært høyt groepress' },
      foul: { hydro: 'Hydroider', mussel: 'Blåskjell', algae: 'Alger', capre: 'Tanglopper', asci: 'Sekkedyr' },
      tracks: { imp: 'Impregnering', coat: 'Coating', green: 'Grønn konsesjon' },
      note: 'Typisk bilde for strekningen. Lokaliteter: Fiskeridirektoratet.',
      siteNote: 'Anbefalingen følger groepresset der anlegget ligger.',
      forSite: 'Anbefalt for dette anlegget',
      allTitle: 'Søk eller velg strekning',
      allBody: 'Hvert anlegg ligger i en kyststrekning med sitt groepress. Finn lokaliteten — så følger produktene.',
      search: 'Søk lokalitet eller kommune',
      noHits: 'Ingen treff',
      mtb: 'MTB',
      inStretch: 'i',
      change: 'Velg en annen'
    },
    en: {
      chips: { all: 'Full coast', sor: 'South', rog: 'Rogaland', vest: 'Vestland', more: 'Møre', trond: 'Trøndelag', nordl: 'Nordland', nord: 'Troms & Finnmark' },
      kicker: 'Typical for this stretch',
      siteKicker: 'Selected site',
      press: { 1: 'Low fouling pressure', 2: 'Moderate fouling pressure', 3: 'High fouling pressure', 4: 'Very high fouling pressure' },
      foul: { hydro: 'Hydroids', mussel: 'Mussels', algae: 'Algae', capre: 'Caprellids', asci: 'Ascidians' },
      tracks: { imp: 'Impregnation', coat: 'Coating', green: 'Green licence' },
      note: 'Typical picture for the stretch. Sites: Directorate of Fisheries.',
      siteNote: 'The recommendation follows fouling pressure where the site sits.',
      forSite: 'Recommended for this site',
      allTitle: 'Search or pick a stretch',
      allBody: 'Every site sits in a stretch of coast with its own fouling pressure. Find the locality — the products follow.',
      search: 'Search site or municipality',
      noHits: 'No matches',
      mtb: 'MTB',
      inStretch: 'in',
      change: 'Choose another'
    },
    es: {
      chips: { all: 'Toda la costa', sor: 'Sur', rog: 'Rogaland', vest: 'Vestland', more: 'Møre', trond: 'Trøndelag', nordl: 'Nordland', nord: 'Troms y Finnmark' },
      kicker: 'Típico de este tramo',
      siteKicker: 'Centro elegido',
      press: { 1: 'Presión baja', 2: 'Presión moderada', 3: 'Presión alta', 4: 'Presión muy alta' },
      foul: { hydro: 'Hidrozoos', mussel: 'Mejillones', algae: 'Algas', capre: 'Caprélidos', asci: 'Ascidias' },
      tracks: { imp: 'Impregnación', coat: 'Recubrimiento', green: 'Concesión verde' },
      note: 'Imagen típica del tramo. Localidades: Dirección de Pesca.',
      siteNote: 'La recomendación sigue la presión de incrustación del tramo.',
      forSite: 'Recomendado para este centro',
      allTitle: 'Busque o elija un tramo',
      allBody: 'Cada centro está en un tramo de costa con su presión de incrustación. Encuentre la localidad: los productos siguen.',
      search: 'Buscar centro o municipio',
      noHits: 'Sin resultados',
      mtb: 'MTB',
      inStretch: 'en',
      change: 'Elegir otro'
    },
    tr: {
      chips: { all: 'Tüm kıyı', sor: 'Güney', rog: 'Rogaland', vest: 'Vestland', more: 'Møre', trond: 'Trøndelag', nordl: 'Nordland', nord: 'Troms ve Finnmark' },
      kicker: 'Bu kıyı için tipik',
      siteKicker: 'Seçilen tesis',
      press: { 1: 'Düşük baskı', 2: 'Orta baskı', 3: 'Yüksek baskı', 4: 'Çok yüksek baskı' },
      foul: { hydro: 'Hidroidler', mussel: 'Midye', algae: 'Alg', capre: 'Kaprellidler', asci: 'Asidiler' },
      tracks: { imp: 'Emprenye', coat: 'Kaplama', green: 'Yeşil lisans' },
      note: 'Bölge için tipik tablo. Lokaliteler: Balıkçılık Müdürlüğü.',
      siteNote: 'Öneri, tesisin bulunduğu kıyıdaki kirlenme baskısını izler.',
      forSite: 'Bu tesis için önerilen',
      allTitle: 'Arayın veya bir şerit seçin',
      allBody: 'Her tesis, kendi kirlenme baskısı olan bir kıyı şeridinde durur. Lokaliteyi bulun — ürünler onu izler.',
      search: 'Tesis veya belediye ara',
      noHits: 'Sonuç yok',
      mtb: 'MTB',
      inStretch: '—',
      change: 'Başka seç'
    }
  };

  var REGIONS = {
    sor: {
      press: 2,
      foul: { hydro: 3, mussel: 3, algae: 4, capre: 1, asci: 1 },
      body: {
        nb: 'Færre anlegg og mer lys. Filamentøse alger og blåskjell preger øvre not, hydroider under. NI 3 holder i de fleste tilfeller.',
        en: 'Fewer sites and more light. Filamentous algae and mussels on the upper net, hydroids below. NI 3 covers most cases.',
        es: 'Menos centros y más luz. Algas filamentosas y mejillones arriba, hidrozoos debajo. NI 3 cubre la mayoría.',
        tr: 'Daha az tesis, daha çok ışık. Üst ağda alg ve midye, altta hidroid. Çoğu durumda NI 3 yeter.'
      },
      rec: { imp: 'ni3', coat: 'np', green: 'e5' }
    },
    rog: {
      press: 3,
      foul: { hydro: 5, mussel: 4, algae: 3, capre: 3, asci: 2 },
      body: {
        nb: 'Varme fjorder og høyt næringstrykk. Hydroider og blåskjell setter inn tidlig. NI Gold er førstevalg.',
        en: 'Warm fjords and high nutrient load. Hydroids and mussels set in early. NI Gold is first choice.',
        es: 'Fiordos cálidos y alta carga de nutrientes. Hidrozoos y mejillones pronto. NI Gold es la primera opción.',
        tr: 'Sıcak fiyortlar, yüksek besin. Hidroid ve midye erken gelir. İlk tercih NI Gold.'
      },
      rec: { imp: 'nigold', coat: 'np', green: 'e8' }
    },
    vest: {
      press: 4,
      foul: { hydro: 5, mussel: 4, algae: 3, capre: 4, asci: 4 },
      body: {
        nb: 'Det tyngste groepresset langs kysten. Hydroider, blåskjell, tanglopper og sekkedyr i tett suksesjon. Her trengs NI Gold.',
        en: 'The heaviest fouling on the coast. Hydroids, mussels, caprellids and ascidians in tight succession. NI Gold territory.',
        es: 'La incrustación más intensa. Hidrozoos, mejillones, caprélidos y ascidias. Territorio de NI Gold.',
        tr: 'Kıyının en ağır kirlenmesi. Hidroid, midye, kaprellid ve asidiler. NI Gold.'
      },
      rec: { imp: 'nigold', coat: 'np', green: 'e8' }
    },
    more: {
      press: 3,
      foul: { hydro: 5, mussel: 3, algae: 2, capre: 3, asci: 2 },
      body: {
        nb: 'Hydroider dominerer, med blåskjell i mer beskyttede poller. NI Gold, med NI 3 på mildere lokaliteter.',
        en: 'Hydroids dominate, with mussels in more sheltered polls. NI Gold, with NI 3 on milder sites.',
        es: 'Dominan los hidrozoos, mejillones en polles resguardados. NI Gold, NI 3 en sitios más suaves.',
        tr: 'Hidroidler baskın, korunaklı koylarda midye. NI Gold; daha hafif lokalitelerde NI 3.'
      },
      rec: { imp: 'nigold', coat: 'np', green: 'e8' }
    },
    trond: {
      press: 3,
      foul: { hydro: 4, mussel: 3, algae: 2, capre: 2, asci: 2 },
      body: {
        nb: 'Stabil hydroid-begroing, noe saktere enn Vestland. NI 3 er standard; NI Gold på eksponerte anlegg.',
        en: 'Steady hydroid fouling, a little slower than Vestland. NI 3 is standard; NI Gold on exposed sites.',
        es: 'Hidrozoos estables, algo más lentos que Vestland. NI 3 estándar; NI Gold en sitios expuestos.',
        tr: 'Vestland’den biraz daha yavaş hidroid. Standart NI 3; açık tesislerde NI Gold.'
      },
      rec: { imp: 'ni3', coat: 'np', green: 'e5' }
    },
    nordl: {
      press: 2,
      foul: { hydro: 4, mussel: 2, algae: 2, capre: 2, asci: 1 },
      body: {
        nb: 'Kaldere vann, kortere sesong. Hydroider er hovedproblem, men biomassen bygger saktere. NI 3 dekker de fleste.',
        en: 'Colder water, shorter season. Hydroids remain the main issue, but biomass builds slowly. NI 3 covers most.',
        es: 'Agua más fría, temporada corta. Hidrozoos siguen siendo el problema, con menos biomasa. NI 3.',
        tr: 'Daha soğuk su, kısa sezon. Hidroid ana sorun, biyokütle yavaş. NI 3 çoğu stratejiyi karşılar.'
      },
      rec: { imp: 'ni3', coat: 'np', green: 'e5' }
    },
    nord: {
      press: 1,
      foul: { hydro: 3, mussel: 1, algae: 2, capre: 1, asci: 1 },
      body: {
        nb: 'Kort sesong og lav temperatur. Begroingen kommer, men sakte. NI 3 eller biocidfri coating er vanligvis nok.',
        en: 'Short season and low temperature. Fouling still arrives, but slowly. NI 3 or a biocidal-free coating is usually enough.',
        es: 'Temporada corta y baja temperatura. La incrustación llega despacio. NI 3 o recubrimiento sin biocida suele bastar.',
        tr: 'Kısa sezon, düşük sıcaklık. Kirlenme yavaş gelir. NI 3 veya biyositsiz kaplama çoğu zaman yeter.'
      },
      rec: { imp: 'ni3', coat: 'np', green: 'e5' }
    }
  };

  var PRODUCTS = {
    ni3:    { file: 'netwax-ni-3.html',          name: 'Netwax NI 3' },
    nigold: { file: 'netwax-ni-gold.html',       name: 'Netwax NI Gold' },
    e5:     { file: 'netwax-e5-greenline.html',  name: 'Netwax E5 Greenline' },
    e8:     { file: 'netwax-e8-greenline.html',  name: 'Netwax E8 Greenline' },
    np:     { file: 'netpolish-np.html',         name: 'Netpolish NP' }
  };

  var FOUL_ORDER = ['hydro', 'mussel', 'algae', 'capre', 'asci'];

  var STYLE = {
    version: 8,
    name: 'NetKem Coast',
    glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    sources: {
      composite: { type: 'vector', url: 'mapbox://mapbox.mapbox-streets-v8' }
    },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': '#1a3d54' } },
      {
        id: 'water',
        type: 'fill',
        source: 'composite',
        'source-layer': 'water',
        paint: { 'fill-color': '#07182b' }
      },
      {
        id: 'coastline',
        type: 'line',
        source: 'composite',
        'source-layer': 'water',
        paint: {
          'line-color': '#1a5c6e',
          'line-width': 0.5,
          'line-opacity': 0.35
        }
      }
    ]
  };

  function langOf() {
    var l = (document.documentElement.lang || 'nb').slice(0, 2);
    return COPY[l] ? l : 'nb';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function emptyFc() {
    return { type: 'FeatureCollection', features: [] };
  }

  function init() {
    var root = document.getElementById('produktvelger');
    if (!root || typeof mapboxgl === 'undefined') return;

    var lang = langOf();
    var t = COPY[lang];
    var assets = root.getAttribute('data-assets') || 'assets';
    var productsDir = root.getAttribute('data-products') || 'produkter';
    var chipsEl = root.querySelector('[data-coast-chips]');
    var panelEl = root.querySelector('[data-coast-panel]');
    var mapEl = root.querySelector('#coast-map');
    var searchEl = root.querySelector('[data-coast-search]');
    var hitsEl = root.querySelector('[data-coast-hits]');
    var stageEl = root.querySelector('.coast__stage');
    if (!chipsEl || !panelEl || !mapEl || !searchEl || !hitsEl || !stageEl) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var current = 'all';
    var farms = null;
    var counts = { all: 0 };
    var picked = null;
    var map = null;
    var pulseId = 0;

    searchEl.setAttribute('placeholder', t.search);
    searchEl.setAttribute('aria-label', t.search);

    var switchEl = document.createElement('button');
    switchEl.type = 'button';
    switchEl.className = 'coast__switch';
    stageEl.appendChild(switchEl);

    var brandEl = document.createElement('a');
    brandEl.className = 'coast__brand';
    brandEl.href = lang === 'nb' ? 'index.html' : 'index.html';
    brandEl.setAttribute('aria-label', 'NetKem');
    brandEl.innerHTML = 'Net<span>K</span>em<span class="coast__brand-src"> · Mapbox · Fiskeridirektoratet</span>';
    stageEl.appendChild(brandEl);

    GROUPS.forEach(function (g) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'coast__chip' + (g.id === 'all' ? ' is-on' : '');
      b.setAttribute('data-group', g.id);
      b.setAttribute('aria-pressed', g.id === 'all' ? 'true' : 'false');
      b.innerHTML = esc(t.chips[g.id]) + ' <small data-count="' + g.id + '"></small>';
      chipsEl.appendChild(b);
    });
    root.classList.remove('is-open');

    function productUrl(key) {
      return productsDir + '/' + PRODUCTS[key].file;
    }

    function iconUrl(key) {
      return assets + '/img/fouling/' + key + '.png';
    }

    function isMobile() {
      return window.matchMedia && window.matchMedia('(max-width: 860px)').matches;
    }

    var ignoreScroll = false;
    var mapLockY = 0;
    function enterMapMode() {
      if (document.documentElement.classList.contains('is-map-using')) return;
      document.documentElement.classList.add('is-map-using');
      ignoreScroll = true;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var top = root.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo(0, Math.max(0, top));
          mapLockY = window.pageYOffset;
          if (map) map.resize();
          setTimeout(function () {
            mapLockY = window.pageYOffset;
            ignoreScroll = false;
          }, 180);
        });
      });
    }
    function exitMapMode() {
      if (!document.documentElement.classList.contains('is-map-using')) return;
      document.documentElement.classList.remove('is-map-using');
      if (map) map.resize();
    }

    function padForMap() {
      var choosing = root.classList.contains('is-choosing');
      var open = root.classList.contains('is-open');
      if (isMobile()) return { top: choosing || !open ? 168 : 56, bottom: 24, left: 20, right: 20 };
      return {
        top: choosing || !open ? 148 : 56,
        bottom: 40,
        left: 28,
        right: open ? (choosing ? 380 : 580) : 28
      };
    }

    function foulingHtml(r) {
      return FOUL_ORDER.map(function (k) {
        var v = r.foul[k] || 0;
        return '<li>' +
          '<img class="coast__icon" src="' + esc(iconUrl(k)) + '" alt="" width="28" height="28">' +
          '<span>' + esc(t.foul[k]) + '</span>' +
          '<div class="coast__meter"><span style="width:' + (v * 20) + '%"></span></div>' +
          '</li>';
      }).join('');
    }

    function recsHtml(r, heading) {
      var recs = [
        { track: 'imp', key: r.rec.imp },
        { track: 'coat', key: r.rec.coat },
        { track: 'green', key: r.rec.green }
      ].map(function (row) {
        var p = PRODUCTS[row.key];
        return '<a class="coast__prod" href="' + esc(productUrl(row.key)) + '">' +
          '<em>' + esc(t.tracks[row.track]) + '</em>' +
          '<strong>' + esc(p.name) + '</strong></a>';
      }).join('');
      return '<div class="coast__recs">' +
        (heading ? '<p class="coast__rec-label">' + esc(heading) + '</p>' : '') +
        '<div class="coast__products">' + recs + '</div></div>';
    }

    function pressHtml(r) {
      var ticks = '';
      for (var i = 1; i <= 4; i++) {
        ticks += '<i class="' + (i <= r.press ? (r.press >= 4 ? 'is-on is-hot' : 'is-on') : '') + '"></i>';
      }
      return '<div class="coast__press"><span>' + esc(t.press[r.press]) + '</span><span class="coast__press-bar">' + ticks + '</span></div>';
    }

    function renderPanel() {
      if (picked) {
        var p = picked.properties;
        var gid = p.g;
        var r = REGIONS[gid];
        if (!r) {
          panelEl.innerHTML = '<h3>' + esc(p.n) + '</h3>';
          return;
        }
        var mtb = p.c ? Math.round(p.c).toLocaleString('nb-NO') + ' t ' + t.mtb : '';
        panelEl.innerHTML =
          '<div class="coast__head">' +
            '<div class="coast__head-row">' +
              '<span class="coast__kicker">' + esc(t.siteKicker) + '</span>' +
              pressHtml(r) +
            '</div>' +
            '<h3>' + esc(p.n) + '</h3>' +
            '<p class="coast__where">' + esc(p.k || '') +
              (gid ? ' · ' + esc(t.chips[gid]) : '') +
              (mtb ? ' · ' + esc(mtb) : '') + '</p>' +
            '<p class="coast__blurb">' + esc(r.body[lang] || r.body.nb) + '</p>' +
          '</div>' +
          '<div class="coast__split">' +
            '<ul class="coast__fouling">' + foulingHtml(r) + '</ul>' +
            recsHtml(r, t.forSite) +
          '</div>' +
          '<p class="coast__note">' + esc(t.siteNote) + '</p>';
        return;
      }
      if (current === 'all') {
        panelEl.innerHTML =
          '<span class="coast__kicker">' + esc(t.kicker) + '</span>' +
          '<h3>' + esc(t.allTitle) + '</h3>' +
          '<p>' + esc(t.allBody) + '</p>' +
          '<p class="coast__note">' + esc(t.note) + '</p>';
        return;
      }
      var r2 = REGIONS[current];
      panelEl.innerHTML =
        '<div class="coast__head">' +
          '<div class="coast__head-row">' +
            '<span class="coast__kicker">' + esc(t.kicker) + '</span>' +
            pressHtml(r2) +
          '</div>' +
          '<h3>' + esc(t.chips[current]) + '</h3>' +
          '<p class="coast__blurb">' + esc(r2.body[lang] || r2.body.nb) + '</p>' +
        '</div>' +
        '<div class="coast__split">' +
          '<ul class="coast__fouling">' + foulingHtml(r2) + '</ul>' +
          recsHtml(r2) +
        '</div>' +
        '<p class="coast__note">' + esc(t.note) + '</p>';
    }

    function farmFcFor(id) {
      if (id === 'all') return farms;
      return {
        type: 'FeatureCollection',
        features: farms.features.filter(function (f) { return f.properties.g === id; })
      };
    }

    function setPickedSource() {
      if (!map || !map.getSource('picked')) return;
      map.getSource('picked').setData(picked ? picked : emptyFc());
    }

    function flyToGroup(id) {
      var g = GROUPS.filter(function (x) { return x.id === id; })[0];
      if (!g || !map) return;
      map.fitBounds(g.bbox, {
        padding: padForMap(),
        maxZoom: id === 'all' ? 4.5 : 7.2,
        duration: reduce ? 0 : 1400
      });
    }

    function updateSwitch() {
      var label = picked ? (picked.properties.n || '') : (current !== 'all' ? t.chips[current] : '');
      switchEl.innerHTML = '<strong>' + esc(label) + '</strong><span>' + esc(t.change) + '</span>';
    }

    function markChips(id) {
      chipsEl.querySelectorAll('.coast__chip').forEach(function (b) {
        var on = b.getAttribute('data-group') === id;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      var open = id !== 'all' || !!picked;
      root.classList.toggle('is-open', open);
      if (!open) root.classList.remove('is-choosing');
      updateSwitch();
    }

    function setGroup(id) {
      current = id;
      picked = null;
      root.classList.remove('is-choosing');
      if (id !== 'all') enterMapMode();
      markChips(id);
      renderPanel();
      if (!map || !farms) return;
      if (map.getSource('farms')) map.getSource('farms').setData(farmFcFor(id));
      setPickedSource();
      flyToGroup(id);
      closeHits();
    }

    function selectFarm(feat) {
      picked = feat;
      current = feat.properties.g || current;
      root.classList.remove('is-choosing');
      enterMapMode();
      markChips(current);
      renderPanel();
      if (!map) return;
      if (map.getSource('farms')) map.getSource('farms').setData(farmFcFor(current));
      setPickedSource();
      map.easeTo({
        center: feat.geometry.coordinates,
        zoom: Math.max(map.getZoom(), 9.2),
        duration: reduce ? 0 : 1100,
        padding: padForMap()
      });
      closeHits();
      searchEl.value = feat.properties.n || '';
    }

    function closeHits() {
      hitsEl.innerHTML = '';
      hitsEl.hidden = true;
    }

    function runSearch(q) {
      q = norm(q.trim());
      if (!q || q.length < 2 || !farms) {
        closeHits();
        return;
      }
      var scored = [];
      farms.features.forEach(function (f) {
        var p = f.properties;
        var n = norm(p.n);
        var k = norm(p.k);
        var score = -1;
        if (n === q) score = 0;
        else if (n.indexOf(q) === 0) score = 1;
        else if (n.indexOf(q) !== -1) score = 2;
        else if (k.indexOf(q) === 0) score = 3;
        else if (k.indexOf(q) !== -1) score = 4;
        if (score >= 0) scored.push({ f: f, score: score });
      });
      scored.sort(function (a, b) { return a.score - b.score; });
      var top = scored.slice(0, 8);
      if (!top.length) {
        hitsEl.innerHTML = '<div class="coast__hit is-empty">' + esc(t.noHits) + '</div>';
        hitsEl.hidden = false;
        return;
      }
      hitsEl.innerHTML = top.map(function (row) {
        var p = row.f.properties;
        return '<button type="button" class="coast__hit" data-id="' + esc(p.id) + '">' +
          '<strong>' + esc(p.n) + '</strong>' +
          '<span>' + esc(p.k || '') + (p.g ? ' · ' + esc(t.chips[p.g]) : '') + '</span>' +
          '</button>';
      }).join('');
      hitsEl.hidden = false;
    }

    function farmById(id) {
      id = String(id);
      for (var i = 0; i < farms.features.length; i++) {
        if (String(farms.features[i].properties.id) === id) return farms.features[i];
      }
      return null;
    }

    renderPanel();

    mapboxgl.accessToken = TOKEN;
    map = new mapboxgl.Map({
      container: mapEl,
      style: STYLE,
      center: [9.2, 64.2],
      zoom: 4.15,
      minZoom: 3.4,
      maxZoom: 12,
      attributionControl: false,
      cooperativeGestures: false,
      fadeDuration: reduce ? 0 : 300,
      pitchWithRotate: false,
      dragRotate: false
    });
    map.scrollZoom.disable();
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-left');

    var mapReady = new Promise(function (resolve) {
      function go() { map.resize(); resolve(); }
      if (map.loaded()) go();
      else map.once('load', go);
    });

    Promise.all([
      fetch(assets + '/data/lokaliteter.geojson').then(function (r) { return r.json(); }),
      mapReady
    ]).then(function (pair) {
      farms = pair[0];
      farms.features.forEach(function (f) {
        f.id = f.properties.id;
        counts[f.properties.g] = (counts[f.properties.g] || 0) + 1;
      });
      counts.all = farms.features.length;
      chipsEl.querySelectorAll('[data-count]').forEach(function (el) {
        el.textContent = String(counts[el.getAttribute('data-count')] || 0);
      });

      map.addSource('farms', {
        type: 'geojson',
        data: farms,
        cluster: true,
        clusterMaxZoom: 8,
        clusterRadius: 42
      });
      map.addLayer({
        id: 'farm-clusters',
        type: 'circle',
        source: 'farms',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#008237',
          'circle-stroke-color': '#07182b',
          'circle-stroke-width': 1.5,
          'circle-opacity': 0.92,
          'circle-radius': ['step', ['get', 'point_count'], 11, 12, 14, 40, 17, 100, 22]
        }
      });
      map.addLayer({
        id: 'farm-count',
        type: 'symbol',
        source: 'farms',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 11
        },
        paint: { 'text-color': '#ffffff' }
      });
      map.addLayer({
        id: 'farm-halo',
        type: 'circle',
        source: 'farms',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#3dcc6a',
          'circle-opacity': 0.22,
          'circle-radius': 7,
          'circle-blur': 0.4
        }
      });
      map.addLayer({
        id: 'farm-point',
        type: 'circle',
        source: 'farms',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#9ae08e',
          'circle-stroke-color': '#07182b',
          'circle-stroke-width': 1,
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 2.4, 7, 3.6, 10, 5.5]
        }
      });
      map.addSource('picked', { type: 'geojson', data: emptyFc() });
      map.addLayer({
        id: 'picked-halo',
        type: 'circle',
        source: 'picked',
        paint: {
          'circle-color': '#d4f5c8',
          'circle-opacity': 0.35,
          'circle-radius': 16,
          'circle-blur': 0.6
        }
      });
      map.addLayer({
        id: 'picked-point',
        type: 'circle',
        source: 'picked',
        paint: {
          'circle-color': '#ffffff',
          'circle-stroke-color': '#008237',
          'circle-stroke-width': 2.5,
          'circle-radius': 6
        }
      });

      map.on('click', 'farm-clusters', function (e) {
        var f = e.features[0];
        map.getSource('farms').getClusterExpansionZoom(f.properties.cluster_id, function (err, zoom) {
          if (err) return;
          map.easeTo({ center: f.geometry.coordinates, zoom: zoom, duration: reduce ? 0 : 600 });
        });
      });
      map.on('click', 'farm-point', function (e) {
        if (!e.features[0]) return;
        var id = e.features[0].properties.id;
        var feat = farmById(id);
        if (feat) selectFarm(feat);
      });
      ['farm-clusters', 'farm-point', 'picked-point'].forEach(function (id) {
        map.on('mouseenter', id, function () { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', id, function () { map.getCanvas().style.cursor = ''; });
      });

      if (!reduce) {
        var t0 = performance.now();
        function pulse(now) {
          var u = ((now - t0) % 2000) / 2000;
          var w = 0.5 - 0.5 * Math.cos(u * Math.PI * 2);
          if (map.getLayer('farm-halo')) {
            map.setPaintProperty('farm-halo', 'circle-opacity', 0.1 + w * 0.28);
            map.setPaintProperty('farm-halo', 'circle-radius', 5 + w * 7);
          }
          if (map.getLayer('picked-halo')) {
            map.setPaintProperty('picked-halo', 'circle-opacity', 0.18 + w * 0.32);
            map.setPaintProperty('picked-halo', 'circle-radius', 12 + w * 14);
          }
          if (map.getLayer('farm-clusters')) {
            map.setPaintProperty('farm-clusters', 'circle-opacity', 0.82 + w * 0.16);
          }
          pulseId = requestAnimationFrame(pulse);
        }
        pulseId = requestAnimationFrame(pulse);
      }
      map.resize();
    }).catch(function () {
      panelEl.innerHTML = '<p>' + esc(t.allBody) + '</p>';
    });

    stageEl.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button, a, input, .coast__chip, .coast__switch, .coast__panel, .coast__hit, .coast__search, .coast__top, .coast__brand')) {
        return;
      }
      enterMapMode();
    });
    window.addEventListener('scroll', function () {
      if (ignoreScroll) return;
      if (!document.documentElement.classList.contains('is-map-using')) return;
      if (Math.abs(window.pageYOffset - mapLockY) < 28) return;
      exitMapMode();
    }, { passive: true });

    chipsEl.addEventListener('click', function (e) {
      var b = e.target.closest('.coast__chip');
      if (!b) return;
      searchEl.value = '';
      setGroup(b.getAttribute('data-group'));
    });

    switchEl.addEventListener('click', function () {
      root.classList.add('is-choosing');
      closeHits();
      try { searchEl.focus(); } catch (e) {}
    });

    var searchTimer = 0;
    searchEl.addEventListener('input', function () {
      clearTimeout(searchTimer);
      var q = searchEl.value;
      searchTimer = setTimeout(function () { runSearch(q); }, 120);
    });
    searchEl.addEventListener('focus', function () {
      if (searchEl.value.trim().length >= 2) runSearch(searchEl.value);
    });
    searchEl.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeHits();
        searchEl.blur();
      }
      if (e.key === 'Enter') {
        var first = hitsEl.querySelector('.coast__hit[data-id]');
        if (first) {
          e.preventDefault();
          var feat = farmById(first.getAttribute('data-id'));
          if (feat) selectFarm(feat);
        }
      }
    });
    hitsEl.addEventListener('click', function (e) {
      var b = e.target.closest('.coast__hit[data-id]');
      if (!b) return;
      var feat = farmById(b.getAttribute('data-id'));
      if (feat) selectFarm(feat);
    });
    document.addEventListener('click', function (e) {
      if (!root.contains(e.target)) closeHits();
      if (e.target.closest('[data-coast-search]') || e.target.closest('[data-coast-hits]')) return;
      if (root.contains(e.target)) closeHits();
    });

    window.addEventListener('resize', function () {
      if (map) map.resize();
    });
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(function () { if (map) map.resize(); }).observe(mapEl);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
