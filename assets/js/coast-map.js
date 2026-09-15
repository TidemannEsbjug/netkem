/* NetKem – coastal fouling map (home section 2) */
(function () {
  'use strict';

  var TOKEN = 'pk.eyJ1IjoiZ3Jva3N1cmZlciIsImEiOiJjbW5qNzhzYnIwa2hhMnFxc2JrcGNrNXRzIn0.khgdWWLFFgzzXHaISi643w';

  var GROUPS = [
    { id: 'all',   po: null,                  bbox: [[4.4, 57.8], [31.2, 71.4]] },
    { id: 'sor',   po: ['1'],                 bbox: [[5.4, 57.85], [9.4, 59.05]] },
    { id: 'rog',   po: ['2'],                 bbox: [[5.15, 58.85], [6.55, 59.62]] },
    { id: 'vest',  po: ['3', '4'],            bbox: [[4.45, 59.2], [6.85, 62.15]] },
    { id: 'more',  po: ['5'],                 bbox: [[5.1, 61.95], [8.55, 63.2]] },
    { id: 'trond', po: ['6', '7'],            bbox: [[7.1, 62.75], [13.1, 65.5]] },
    { id: 'nordl', po: ['8', '9'],            bbox: [[11.5, 65.25], [17.7, 69.15]] },
    { id: 'nord',  po: ['10', '11', '12', '13'], bbox: [[14.2, 68.45], [31.1, 71.35]] }
  ];

  var COPY = {
    nb: {
      chips: { all: 'Hele kysten', sor: 'Sørlandet', rog: 'Rogaland', vest: 'Vestland', more: 'Møre', trond: 'Trøndelag', nordl: 'Nordland', nord: 'Troms & Finnmark' },
      kicker: 'Typisk for strekningen',
      press: { 1: 'Lavt groepress', 2: 'Middels groepress', 3: 'Høyt groepress', 4: 'Svært høyt groepress' },
      foul: { hydro: 'Hydroider', mussel: 'Blåskjell', algae: 'Alger', capre: 'Tanglopper', asci: 'Sekkedyr' },
      tracks: { imp: 'Impregnering', coat: 'Coating', green: 'Grønn konsesjon' },
      note: 'Typisk bilde for strekningen, ikke en lokalitetsanalyse. Lokaliteter: Fiskeridirektoratet, matfisk laks/ørret i sjø.',
      allTitle: 'Velg kyststrekning',
      allBody: 'Begroing på notlin styres av temperatur, næring og eksponering. Trykk på en strekning — kartet går dit, og du får press, begroingstyper og produktvalg.'
    },
    en: {
      chips: { all: 'Full coast', sor: 'South', rog: 'Rogaland', vest: 'Vestland', more: 'Møre', trond: 'Trøndelag', nordl: 'Nordland', nord: 'Troms & Finnmark' },
      kicker: 'Typical for this stretch',
      press: { 1: 'Low fouling pressure', 2: 'Moderate fouling pressure', 3: 'High fouling pressure', 4: 'Very high fouling pressure' },
      foul: { hydro: 'Hydroids', mussel: 'Mussels', algae: 'Algae', capre: 'Caprellids', asci: 'Ascidians' },
      tracks: { imp: 'Impregnation', coat: 'Coating', green: 'Green licence' },
      note: 'Typical picture for the stretch, not a site survey. Sites: Directorate of Fisheries, seawater salmon/trout grow-out.',
      allTitle: 'Choose a stretch of coast',
      allBody: 'Net fouling follows temperature, nutrients and exposure. Pick a region — the map moves there, with pressure, fouling types and product fit.'
    },
    es: {
      chips: { all: 'Toda la costa', sor: 'Sur', rog: 'Rogaland', vest: 'Vestland', more: 'Møre', trond: 'Trøndelag', nordl: 'Nordland', nord: 'Troms y Finnmark' },
      kicker: 'Típico de este tramo',
      press: { 1: 'Presión de incrustación baja', 2: 'Presión moderada', 3: 'Presión alta', 4: 'Presión muy alta' },
      foul: { hydro: 'Hidrozoos', mussel: 'Mejillones', algae: 'Algas', capre: 'Caprélidos', asci: 'Ascidias' },
      tracks: { imp: 'Impregnación', coat: 'Recubrimiento', green: 'Concesión verde' },
      note: 'Imagen típica del tramo, no un análisis de sitio. Localidades: Dirección de Pesca, salmón/trucha de engorde en mar.',
      allTitle: 'Elija un tramo de costa',
      allBody: 'La incrustación de la red sigue la temperatura, los nutrientes y la exposición. Elija una zona: el mapa se desplaza y muestra presión, tipos de incrustación y productos.'
    },
    tr: {
      chips: { all: 'Tüm kıyı', sor: 'Güney', rog: 'Rogaland', vest: 'Vestland', more: 'Møre', trond: 'Trøndelag', nordl: 'Nordland', nord: 'Troms ve Finnmark' },
      kicker: 'Bu kıyı için tipik',
      press: { 1: 'Düşük kirlenme baskısı', 2: 'Orta kirlenme baskısı', 3: 'Yüksek kirlenme baskısı', 4: 'Çok yüksek kirlenme baskısı' },
      foul: { hydro: 'Hidroidler', mussel: 'Midye', algae: 'Alg', capre: 'Kaprellidler', asci: 'Asidiler' },
      tracks: { imp: 'Emprenye', coat: 'Kaplama', green: 'Yeşil lisans' },
      note: 'Bölge için tipik tablo, saha analizi değil. Lokaliteler: Balıkçılık Müdürlüğü, denizde somon/alabalık.',
      allTitle: 'Bir kıyı şeridi seçin',
      allBody: 'Ağ kirlenmesi sıcaklık, besin ve maruziyete göre değişir. Bir bölge seçin — harita oraya gider; baskı, kirlenme türleri ve ürün önerisi gelir.'
    }
  };

  /* Regional fouling model: typical picture for salmon nets along the Norwegian coast.
     Hydroids dominate most of the coast; mussels/algae stronger south & inshore;
     pressure falls north as the season shortens. */
  var REGIONS = {
    sor: {
      press: 2,
      foul: { hydro: 3, mussel: 3, algae: 4, capre: 1, asci: 1 },
      body: {
        nb: 'Færre anlegg og mer lys. Filamentøse alger og blåskjell preger øvre not, hydroider under. NI 3 holder i de fleste tilfeller; coating passer der det spyles ofte.',
        en: 'Fewer sites and more light. Filamentous algae and mussels on the upper net, hydroids below. NI 3 covers most cases; coating fits frequent in-sea washing.',
        es: 'Menos centros y más luz. Algas filamentosas y mejillones en la red superior, hidrozoos debajo. NI 3 cubre la mayoría; el recubrimiento encaja con lavado frecuente en mar.',
        tr: 'Daha az tesis, daha çok ışık. Üst ağda ipliksi alg ve midye, altta hidroid. Çoğu durumda NI 3 yeter; sık deniz içi yıkamada kaplama uygun.'
      },
      rec: { imp: 'ni3', coat: 'np', green: 'e5' }
    },
    rog: {
      press: 3,
      foul: { hydro: 5, mussel: 4, algae: 3, capre: 3, asci: 2 },
      body: {
        nb: 'Varme fjorder og høyt næringstrykk. Hydroider og blåskjell setter inn tidlig. NI Gold er førstevalg; E8 på grønne konsesjoner.',
        en: 'Warm fjords and high nutrient load. Hydroids and mussels set in early. NI Gold is first choice; E8 on green licences.',
        es: 'Fiordos cálidos y alta carga de nutrientes. Hidrozoos y mejillones aparecen pronto. NI Gold es la primera opción; E8 en concesiones verdes.',
        tr: 'Sıcak fiyortlar, yüksek besin yükü. Hidroid ve midye erken gelir. İlk tercih NI Gold; yeşil lisanslarda E8.'
      },
      rec: { imp: 'nigold', coat: 'np', green: 'e8' }
    },
    vest: {
      press: 4,
      foul: { hydro: 5, mussel: 4, algae: 3, capre: 4, asci: 4 },
      body: {
        nb: 'Det tyngste groepresset langs kysten. Hydroider, blåskjell, tanglopper og sekkedyr i tett suksesjon. Her trengs NI Gold — eller E8 der det skal være grønt.',
        en: 'The heaviest fouling on the coast. Hydroids, mussels, caprellids and ascidians in tight succession. This is NI Gold territory — or E8 where it must be green.',
        es: 'La incrustación más intensa de la costa. Hidrozoos, mejillones, caprélidos y ascidias en sucesión densa. Territorio de NI Gold — o E8 si debe ser verde.',
        tr: 'Kıyının en ağır kirlenmesi. Hidroid, midye, kaprellid ve asidiler sık ardışık. Burası NI Gold — yeşil olması gerekiyorsa E8.'
      },
      rec: { imp: 'nigold', coat: 'np', green: 'e8' }
    },
    more: {
      press: 3,
      foul: { hydro: 5, mussel: 3, algae: 2, capre: 3, asci: 2 },
      body: {
        nb: 'Hydroider dominerer, med blåskjell i mer beskyttede poller. Høyt press gjennom sesongen. NI Gold, med NI 3 på mildere lokaliteter.',
        en: 'Hydroids dominate, with mussels in more sheltered polls. High pressure through the season. NI Gold, with NI 3 on milder sites.',
        es: 'Dominan los hidrozoos, con mejillones en polles más resguardados. Alta presión durante la temporada. NI Gold, NI 3 en sitios más suaves.',
        tr: 'Hidroidler baskın, daha korunaklı koylarda midye. Sezon boyunca yüksek baskı. NI Gold; daha hafif lokalitelerde NI 3.'
      },
      rec: { imp: 'nigold', coat: 'np', green: 'e8' }
    },
    trond: {
      press: 3,
      foul: { hydro: 4, mussel: 3, algae: 2, capre: 2, asci: 2 },
      body: {
        nb: 'Stabil hydroid-begroing, noe saktere enn Vestland. NI 3 er standard; NI Gold på eksponerte og tettliggende anlegg.',
        en: 'Steady hydroid fouling, a little slower than Vestland. NI 3 is standard; NI Gold on exposed and densely placed sites.',
        es: 'Incrustación estable de hidrozoos, algo más lenta que en Vestland. NI 3 es el estándar; NI Gold en sitios expuestos y densos.',
        tr: 'Vestland’den biraz daha yavaş, istikrarlı hidroid kirlenmesi. Standart NI 3; açık ve sık tesislerde NI Gold.'
      },
      rec: { imp: 'ni3', coat: 'np', green: 'e5' }
    },
    nordl: {
      press: 2,
      foul: { hydro: 4, mussel: 2, algae: 2, capre: 2, asci: 1 },
      body: {
        nb: 'Kaldere vann, kortere sesong. Hydroider fortsatt hovedproblem, men biomassen bygger saktere. NI 3 og Netpolish dekker de fleste strategiene.',
        en: 'Colder water, shorter season. Hydroids remain the main issue, but biomass builds more slowly. NI 3 and Netpolish cover most strategies.',
        es: 'Agua más fría, temporada más corta. Los hidrozoos siguen siendo el problema principal, con menos biomasa. NI 3 y Netpolish cubren la mayoría de estrategias.',
        tr: 'Daha soğuk su, daha kısa sezon. Hidroid hâlâ ana sorun, biyokütle daha yavaş birikir. NI 3 ve Netpolish çoğu stratejiyi karşılar.'
      },
      rec: { imp: 'ni3', coat: 'np', green: 'e5' }
    },
    nord: {
      press: 1,
      foul: { hydro: 3, mussel: 1, algae: 2, capre: 1, asci: 1 },
      body: {
        nb: 'Kort sesong og lav temperatur. Begroingen kommer, men sakte. NI 3 eller biocidfri coating er vanligvis nok; vask mellom syklusene holder noten åpen.',
        en: 'Short season and low temperature. Fouling still arrives, but slowly. NI 3 or a biocidal-free coating is usually enough; washing between cycles keeps the net open.',
        es: 'Temporada corta y baja temperatura. La incrustación llega, pero despacio. NI 3 o un recubrimiento sin biocida suele bastar; el lavado entre ciclos mantiene la red abierta.',
        tr: 'Kısa sezon, düşük sıcaklık. Kirlenme gelir ama yavaş. NI 3 veya biyositsiz kaplama çoğu zaman yeter; döngüler arasında yıkama ağı açık tutar.'
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

  var STYLE = {
    version: 8,
    name: 'NetKem Coast',
    glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    sources: {
      composite: { type: 'vector', url: 'mapbox://mapbox.mapbox-streets-v8' }
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: { 'background-color': '#1a3d54' }
      },
      {
        id: 'water',
        type: 'fill',
        source: 'composite',
        'source-layer': 'water',
        paint: { 'fill-color': '#07182b' }
      },
      {
        id: 'water-line',
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
    if (!chipsEl || !panelEl || !mapEl) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var current = 'all';
    var farms = null;
    var areas = null;
    var counts = { all: 0 };
    var popup = null;
    var map = null;

    GROUPS.forEach(function (g) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'coast__chip' + (g.id === 'all' ? ' is-on' : '');
      b.setAttribute('data-group', g.id);
      b.setAttribute('aria-pressed', g.id === 'all' ? 'true' : 'false');
      b.innerHTML = esc(t.chips[g.id]) + ' <small data-count="' + g.id + '"></small>';
      chipsEl.appendChild(b);
    });

    function productUrl(key) {
      return productsDir + '/' + PRODUCTS[key].file;
    }

    function renderPanel(id) {
      if (id === 'all') {
        panelEl.innerHTML =
          '<span class="coast__kicker">' + esc(t.kicker) + '</span>' +
          '<h3>' + esc(t.allTitle) + '</h3>' +
          '<p>' + esc(t.allBody) + '</p>' +
          '<p class="coast__note">' + esc(t.note) + '</p>';
        return;
      }
      var r = REGIONS[id];
      var foulOrder = ['hydro', 'mussel', 'algae', 'capre', 'asci'];
      var pressHot = r.press >= 4;
      var ticks = '';
      for (var i = 1; i <= 4; i++) {
        ticks += '<i class="' + (i <= r.press ? (pressHot ? 'is-on is-hot' : 'is-on') : '') + '"></i>';
      }
      var foul = foulOrder.map(function (k) {
        var v = r.foul[k];
        if (!v) return '';
        return '<li><span>' + esc(t.foul[k]) + '</span><div class="coast__meter"><span style="width:' + (v * 20) + '%"></span></div></li>';
      }).join('');
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

      panelEl.innerHTML =
        '<span class="coast__kicker">' + esc(t.kicker) + '</span>' +
        '<h3>' + esc(t.chips[id]) + '</h3>' +
        '<div class="coast__press"><span>' + esc(t.press[r.press]) + '</span><span class="coast__press-bar">' + ticks + '</span></div>' +
        '<p>' + esc(r.body[lang] || r.body.nb) + '</p>' +
        '<ul class="coast__fouling">' + foul + '</ul>' +
        '<div class="coast__products">' + recs + '</div>' +
        '<p class="coast__note">' + esc(t.note) + '</p>';
    }

    function flyToGroup(id) {
      var g = GROUPS.filter(function (x) { return x.id === id; })[0];
      if (!g || !map) return;
      var opts = { padding: { top: 72, bottom: 36, left: 24, right: 372 }, maxZoom: id === 'all' ? 4.6 : 7.4, duration: reduce ? 0 : 1400 };
      if (window.matchMedia && window.matchMedia('(max-width: 860px)').matches) {
        opts.padding = { top: 64, bottom: 24, left: 20, right: 20 };
        opts.maxZoom = id === 'all' ? 4.2 : 7;
      }
      map.fitBounds(g.bbox, opts);
    }

    function setGroup(id) {
      current = id;
      chipsEl.querySelectorAll('.coast__chip').forEach(function (b) {
        var on = b.getAttribute('data-group') === id;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on) {
          try { b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); }
          catch (e) {}
        }
      });
      renderPanel(id);
      if (!map || !farms) return;
      var farmFc = id === 'all' ? farms : {
        type: 'FeatureCollection',
        features: farms.features.filter(function (f) { return f.properties.g === id; })
      };
      var areaFc = {
        type: 'FeatureCollection',
        features: id === 'all' ? [] : (areas.features || []).filter(function (f) { return f.properties.g === id; })
      };
      if (map.getSource('farms')) map.getSource('farms').setData(farmFc);
      if (map.getSource('areas')) map.getSource('areas').setData(areaFc);
      flyToGroup(id);
      if (popup) popup.remove();
    }

    renderPanel('all');

    mapboxgl.accessToken = TOKEN;
    map = new mapboxgl.Map({
      container: mapEl,
      style: STYLE,
      center: [9.2, 64.2],
      zoom: 4.15,
      minZoom: 3.4,
      maxZoom: 12,
      attributionControl: false,
      cooperativeGestures: true,
      fadeDuration: reduce ? 0 : 300,
      pitchWithRotate: false,
      dragRotate: false
    });
    map.addControl(new mapboxgl.AttributionControl({
      compact: true,
      customAttribution: 'Lokaliteter: Fiskeridirektoratet'
    }), 'bottom-right');
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-left');

    var mapReady = new Promise(function (resolve) {
      function go() { map.resize(); resolve(); }
      if (map.loaded()) go();
      else map.once('load', go);
    });

    Promise.all([
      fetch(assets + '/data/lokaliteter.geojson').then(function (r) { return r.json(); }),
      fetch(assets + '/data/produksjonsomrader.geojson').then(function (r) { return r.json(); }),
      mapReady
    ]).then(function (pair) {
      farms = pair[0];
      areas = pair[1];
      counts.all = farms.features.length;
      farms.features.forEach(function (f) {
        var g = f.properties.g;
        counts[g] = (counts[g] || 0) + 1;
      });
      chipsEl.querySelectorAll('[data-count]').forEach(function (el) {
        var id = el.getAttribute('data-count');
        el.textContent = String(counts[id] || 0);
      });

      (function addLayers() {
        map.addSource('areas', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        map.addLayer({
          id: 'areas-fill',
          type: 'fill',
          source: 'areas',
          paint: {
            'fill-color': '#008237',
            'fill-opacity': 0.12
          }
        });
        map.addLayer({
          id: 'areas-line',
          type: 'line',
          source: 'areas',
          paint: {
            'line-color': '#2a9b50',
            'line-width': 1.2,
            'line-opacity': 0.55
          }
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
            'circle-radius': ['step', ['get', 'point_count'], 10, 12, 13, 40, 16, 100, 20]
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
            'circle-color': '#2a9b50',
            'circle-opacity': 0.22,
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 5, 8, 9, 11, 13]
          }
        });
        map.addLayer({
          id: 'farm-point',
          type: 'circle',
          source: 'farms',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#7dce7a',
            'circle-stroke-color': '#07182b',
            'circle-stroke-width': 1,
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 2.2, 7, 3.4, 10, 5]
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
          var f = e.features[0];
          var p = f.properties || {};
          if (popup) popup.remove();
          popup = new mapboxgl.Popup({ closeButton: false, offset: 8 })
            .setLngLat(f.geometry.coordinates)
            .setHTML('<strong>' + esc(p.n) + '</strong><div style="font-weight:500;opacity:.7">' + esc(p.k || '') + '</div>')
            .addTo(map);
        });
        ['farm-clusters', 'farm-point'].forEach(function (id) {
          map.on('mouseenter', id, function () { map.getCanvas().style.cursor = 'pointer'; });
          map.on('mouseleave', id, function () { map.getCanvas().style.cursor = ''; });
        });
        map.resize();
      })();
    }).catch(function () {
      panelEl.innerHTML = '<p>' + esc(t.allBody) + '</p>';
    });

    chipsEl.addEventListener('click', function (e) {
      var b = e.target.closest('.coast__chip');
      if (!b) return;
      setGroup(b.getAttribute('data-group'));
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
