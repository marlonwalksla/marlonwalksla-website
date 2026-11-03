/* MarlonWalksLA passports (Nov 2026)
 * One page, any passport. Reads passports.json (same fields as the Webflow CMS collections Passports and Passport Stamps),
 * draws every stamp with stamp-lib.js, and saves in this browser only (no account).
 *
 * Mount:  <div id="mw-passports"></div><script src=".../passport.js"></script>
 * URL:    ?passport=la-tourist   ?lang=es (or a path that starts with /es)
 * Saving: marlon_visited_spots (a stamp with a map pin shares the map's visited list, so stamping here marks the pin there)
 *         marlon_stamps        (a stamp with no pin)
 * Old saves: stamps saved by the older passport pages use the pin name without the 5-letter code (legacyKey). They still count.
 */
(function () {
  'use strict';
  var mount = document.getElementById('mw-passports');
  if (!mount || mount.getAttribute('data-ready')) return;
  mount.setAttribute('data-ready', '1');
  var BASE = mount.getAttribute('data-base') || 'https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@main/';
  var Q = new URLSearchParams(location.search);
  var PG = document.querySelector('[data-pp-page]');   // page mode: the CMS template page hands us its data in data-pp-* attributes
  var ES = PG ? PG.getAttribute('data-pp-lang') === 'es' : (Q.get('lang') || '').toLowerCase().indexOf('es') === 0 || /^\/es(\/|$)/.test(location.pathname) || /^\/pasaporte/.test(location.pathname);
  var T = ES ? {
    title: 'Pasaportes de LA', sub: 'Explora la ciudad un sello a la vez. Se guarda en este navegador, sin cuenta.',
    stamped: 'sellos', of: 'de', open: 'Abrir', soon: 'Muy pronto', all: 'Todos los pasaportes', stampIt: 'Sellar',
    undo: 'Quitar sello', stampedMsg: 'Sellado', map: 'Ver en el mapa', close: 'Cerrar', done: '¡Pasaporte completo! Explora el siguiente.',
    honest: 'Se sella cuando tú estás ahí. Es un juego de honor.', loading: 'Cargando…', err: 'No se pudo cargar. Intenta de nuevo.', mapPath: '/mapa-los-angeles', mapAll: 'Explora todos los lugares en el mapa', mapPass: 'Ver este pasaporte en el mapa', stops: 'paradas', draft: 'Ilustración pendiente', tryIt: 'Prueba esto', free: 'Gratis', next: 'Siguiente pasaporte', bonus: 'Extra', bonusAt: 'Extra en', alsoHere: 'También aquí', bonusLine: 'Sellos extra'
  } : {
    title: 'LA Passports', sub: 'Explore the city one stamp at a time. Saved in this browser, no account.',
    stamped: 'stamps', of: 'of', open: 'Open', soon: 'Coming soon', all: 'All passports', stampIt: 'Stamp it',
    undo: 'Remove stamp', stampedMsg: 'Stamped', map: 'See on the map', close: 'Close', done: 'Passport complete! Explore the next one.',
    honest: 'Stamp it when you are there. It is the honor system.', loading: 'Loading…', err: 'Could not load. Please try again.', mapPath: '/maps', mapAll: 'Explore all places on the map', mapPass: 'See this passport on the map', stops: 'stops', draft: 'Drawing coming soon', tryIt: 'Try this', free: 'Free', next: 'Next passport', bonus: 'Bonus', bonusAt: 'Bonus at', alsoHere: 'Also here', bonusLine: 'Bonus stamps'
  };

  var css = '' +
    '#mwp{--peach:#FFEDE2;--sage:#DFE8C0;--olive:#30312B;--cream:#FDFCDF;--muted:#4A4B43;--ink:#1D6F8F;max-width:760px;margin:0 auto;padding:16px 16px 56px;color:var(--olive);font-family:Nunito,system-ui,sans-serif;position:relative}' +
    '#mwp *{box-sizing:border-box}#mwp [hidden]{display:none!important}' +
    '#mwp h1,#mwp h2{font-family:"Lilita One",sans-serif;font-weight:400;margin:0;line-height:1.05}' +
    '#mwp .lead{font-family:Fredoka,sans-serif;font-size:17px;line-height:1.3;margin:8px 0 18px;color:var(--muted)}' +
    '#mwp .shelf{display:grid;grid-template-columns:1fr;gap:14px}' +
    '@media(min-width:560px){#mwp .shelf{grid-template-columns:1fr 1fr}}' +
    '#mwp .pcard{display:flex;gap:12px;align-items:center;text-align:left;width:100%;min-height:96px;padding:14px;background:var(--cream);border:3px solid var(--olive);border-radius:20px;box-shadow:4px 4px 0 var(--olive);cursor:pointer;color:inherit;font:inherit;text-decoration:none;position:relative}' +
    '#mwp .pcard[disabled]{cursor:default;opacity:.7;box-shadow:none}' +
    '#mwp .pcard:not([disabled]):hover{transform:translate(-1px,-1px);box-shadow:6px 6px 0 var(--olive)}' +
    '#mwp .pcard:focus-visible,#mwp .st:focus-visible,#mwp button:focus-visible,#mwp a:focus-visible{outline:3px solid var(--olive);outline-offset:2px}' +
    '#mwp .pcard .mini{flex:0 0 64px;width:64px}#mwp .pcard .mini svg{width:100%;height:auto;display:block}' +
    '#mwp .pcard b{font-family:"Lilita One",sans-serif;font-weight:400;font-size:22px;display:block;line-height:1.05}' +
    '#mwp .pcard span.m{font-family:Fredoka,sans-serif;font-size:14px;color:var(--muted);display:block;margin-top:3px}' +
    '#mwp .bar{height:8px;border-radius:99px;background:rgba(48,49,43,.15);margin-top:8px;overflow:hidden}#mwp .bar i{display:block;height:100%;background:var(--c,var(--ink));border-radius:99px;transition:width .5s}' +
    '#mwp .back{display:inline-flex;align-items:center;min-height:44px;padding:6px 4px;margin-bottom:6px;background:none;border:0;font-family:Fredoka,sans-serif;font-weight:500;font-size:15px;color:var(--olive);cursor:pointer;text-decoration:underline}' +
    '#mwp .book{background:var(--cream);border:3px solid var(--olive);border-radius:24px;overflow:hidden;box-shadow:5px 5px 0 var(--olive)}' +
    '#mwp .cover{background:var(--c,var(--ink));color:var(--cream);padding:18px;display:flex;gap:14px;align-items:center;border-bottom:3px solid var(--olive)}' +
    '#mwp .cover h2{font-size:30px;margin:0}#mwp .cover p{margin:6px 0 0;font-family:Fredoka,sans-serif;font-size:16px;line-height:1.25}' +
    '#mwp .badge{flex:0 0 76px;width:76px;height:76px;border-radius:50%;border:4px solid var(--cream);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:"Lilita One",sans-serif;line-height:1}' +
    '#mwp .badge b{font-weight:400;font-size:24px}#mwp .badge span{font-family:Fredoka,sans-serif;font-weight:500;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-top:2px}' +
    '#mwp .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;padding:16px 10px 10px}' +
    '@media(min-width:640px){#mwp .grid{grid-template-columns:repeat(4,1fr)}}' +
    '#mwp .st{display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px;background:none;border:0;border-radius:14px;cursor:pointer;color:inherit;min-height:44px;position:relative;-webkit-tap-highlight-color:transparent}' +
    '#mwp .st svg{width:100%;height:auto;display:block;transform:rotate(var(--r));transition:opacity .3s,filter .3s}' +
    '#mwp .st:not(.on) svg{opacity:.3;filter:grayscale(1)}' +
    '#mwp .lb{font-family:Fredoka,sans-serif;font-weight:500;font-size:14px;line-height:1.1;text-align:center}' +
    '#mwp .foot{padding:4px 18px 16px;font-family:Fredoka,sans-serif;font-size:14px;color:var(--muted);text-align:center}' +
    '#mwp .done{margin:0 14px 14px;padding:12px 14px;border:3px solid var(--olive);border-radius:16px;background:var(--sage);font-family:"Lilita One",sans-serif;font-size:20px;text-align:center}' +
    '#mwp .back-dim{position:fixed;inset:0;background:rgba(48,49,43,.45);z-index:9998}' +
    '#mwp .sheet{position:fixed;left:0;right:0;bottom:0;z-index:9999;max-width:560px;margin:0 auto;background:var(--cream);border:3px solid var(--olive);border-bottom:0;border-radius:24px 24px 0 0;padding:18px 18px calc(18px + env(safe-area-inset-bottom));box-shadow:0 -6px 0 rgba(48,49,43,.15);display:flex;gap:14px;flex-wrap:wrap}' +
    '#mwp .sheet .big{flex:0 0 104px;width:104px;position:relative}#mwp .sheet .big svg{width:100%;height:auto;display:block;transform:rotate(var(--r))}' +
    '#mwp .sheet .big:not(.on) svg{opacity:.3;filter:grayscale(1)}' +
    '#mwp .sheet .tx{flex:1 1 200px;min-width:0}#mwp .sheet h2{font-size:26px}' +
    '#mwp .sheet p{margin:6px 0 0;font-family:Fredoka,sans-serif;font-size:16px;line-height:1.3}' +
    '#mwp .row{flex:1 1 100%;display:flex;gap:10px;flex-wrap:wrap;align-items:center}' +
    '#mwp .btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:8px 22px;border-radius:999px;border:3px solid var(--olive);background:var(--c,var(--ink));color:var(--cream);font-family:"Lilita One",sans-serif;font-size:19px;cursor:pointer;box-shadow:3px 3px 0 var(--olive);text-decoration:none}' +
    '#mwp .btn.alt{background:var(--cream);color:var(--olive)}#mwp .btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--olive)}' +
    '#mwp .x{position:absolute;right:8px;top:6px;width:44px;height:44px;border:0;background:none;font-size:26px;cursor:pointer;color:var(--olive)}' +
    '#mwp .tag{display:inline-block;margin-top:6px;padding:2px 10px;border-radius:99px;background:var(--peach);border:2px solid var(--olive);font-family:Fredoka,sans-serif;font-size:12px}' +
    '#mwp .areah{grid-column:1/-1;padding:10px 6px 2px;font-family:"Lilita One",sans-serif;font-size:20px;border-bottom:2px dashed rgba(48,49,43,.3);margin-bottom:4px}' +
    '#mwp .chal{margin:8px 0 0;padding:8px 10px;border-radius:12px;background:var(--peach);border:2px solid var(--olive);font-family:Fredoka,sans-serif;font-size:15px}' +
    '#mwp .done .btn{margin-top:10px;font-size:17px}' +
    '#mwp .st.bonus svg{width:74%}#mwp .bn{font-family:Fredoka,sans-serif;font-weight:600;font-size:10px;letter-spacing:1px;text-transform:uppercase;padding:1px 8px;border-radius:99px;border:2px solid var(--olive);background:var(--peach)}' +
    '#mwp .bonusline{margin:12px 14px 0;padding:8px 12px;border:2px dashed var(--olive);border-radius:14px;font-family:Fredoka,sans-serif;font-size:15px;text-align:center}' +
    '#mwp .also{margin:10px 0 0;font-family:Fredoka,sans-serif;font-size:15px}#mwp .also b{display:block;margin-bottom:6px}#mwp .also button{margin:0 6px 6px 0;min-height:44px;padding:6px 14px;border-radius:99px;border:2px solid var(--olive);background:var(--peach);font-family:Fredoka,sans-serif;font-weight:500;font-size:15px;color:var(--olive);cursor:pointer}' +
    '@media(prefers-reduced-motion:reduce){#mwp *{transition:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  mount.innerHTML = '<div id="mwp"><p class="lead" id="mwp-msg">' + T.loading + '</p></div>';
  var root = document.getElementById('mwp');

  var D = null, sel = null;
  function L(o) { return o ? (ES ? (o.es || o.en) : o.en) || '' : ''; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function rd(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } }
  function wr(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var mem = { v: [], s: [] };   // used only if the browser blocks storage
  function key(s) { return s.mapId ? 'marlon_visited_spots' : 'marlon_stamps'; }
  function has(s) {
    var k = key(s), a = rd(k), m = k === 'marlon_visited_spots' ? mem.v : mem.s;
    var ids = [s.mapId || s.id]; if (s.legacyKey) ids.push(s.legacyKey);
    return ids.some(function (i) { return a.indexOf(i) > -1 || m.indexOf(i) > -1; });
  }
  function set(s, on) {
    var k = key(s), a = rd(k), m = k === 'marlon_visited_spots' ? mem.v : mem.s;
    // Write BOTH names. The map and the older passport pages look for the old name (no 5-letter code), newer code uses the real pin id.
    var ids = [s.mapId || s.id]; if (s.legacyKey && ids.indexOf(s.legacyKey) < 0) ids.push(s.legacyKey);
    [a, m].forEach(function (arr) {
      ids.forEach(function (i) { var x = arr.indexOf(i); if (on && x < 0) arr.push(i); if (!on && x > -1) arr.splice(x, 1); });
    });
    wr(k, a);
  }
  // stamps made before this fix only have the real id: add the old name too, so the map shows them
  function syncOld() { D.passports.forEach(function (p) { p.stamps.forEach(function (s) { if (s.legacyKey && has(s)) set(s, true); }); }); }
  function pp(id) { return (D.passports || []).filter(function (p) { return p.id === id; })[0]; }
  function places(p) { return p.stamps.filter(function (s) { return !s.bonus; }); }
  function bonuses(p) { return p.stamps.filter(function (s) { return s.bonus; }); }
  function count(p) { return places(p).filter(has).length; }
  function bcount(p) { return bonuses(p).filter(has).length; }
  function bonusLine(p) { var b = bonuses(p); return b.length ? '<div class="bonusline" id="mwp-bonus">' + T.bonusLine + ': ' + bcount(p) + ' ' + T.of + ' ' + b.length + '</div>' : ''; }
  function stampSvg(p, s, i) {
    return MWStamp.svg({ uid: 'mwp-' + p.id + '-' + i, top: L(s.top), bottom: L(s.bottom), icon: s.icon, year: s.year, ink: s.ink || p.ink, rot: s.rot, seed: s.seed });
  }
  function doneInner(p) {
    var h = T.done;
    if (PG && PG.getAttribute('data-pp-next')) h += '<br><a class="btn" href="' + esc(PG.getAttribute('data-pp-next')) + '">' + T.next + (PG.getAttribute('data-pp-next-name') ? ': ' + esc(PG.getAttribute('data-pp-next-name')) : '') + '</a>';
    return h;
  }
  function fromDom() {
    var a = function (e, k) { return e.getAttribute('data-pp-' + k) || ''; };
    var stamps = [].map.call(document.querySelectorAll('[data-pp-stamp]'), function (e) {
      var legacy = a(e, 'legacy-key'), mapId = a(e, 'map-id');
      return { id: mapId ? a(e, 'id') : (legacy || a(e, 'id')), order: +a(e, 'order') || 0,
        name: { en: a(e, 'name-en'), es: a(e, 'name-es') }, top: { en: a(e, 'top-en'), es: a(e, 'top-es') }, bottom: { en: a(e, 'bottom-en'), es: a(e, 'bottom-es') },
        tip: { en: a(e, 'tip-en'), es: a(e, 'tip-es') }, challenge: { en: a(e, 'challenge-en'), es: a(e, 'challenge-es') },
        icon: a(e, 'icon'), year: a(e, 'year'), ink: a(e, 'ink'), rot: a(e, 'rot') === '' ? -6 : +a(e, 'rot'), seed: a(e, 'seed') === '' ? 3 : +a(e, 'seed'),
        mapId: mapId || null, legacyKey: legacy || null, mapLink: a(e, 'map-link') || null, area: a(e, 'area'), cost: a(e, 'cost'), draft: a(e, 'draft') === 'true', bonus: a(e, 'bonus') === 'true', parent: a(e, 'parent') };
    }).sort(function (x, y) { return x.order - y.order; });
    var n = a(PG, 'name'), t = a(PG, 'tagline');
    return { passports: [{ id: a(PG, 'id') || 'passport', name: { en: n, es: n }, tagline: { en: t, es: t }, ink: a(PG, 'ink') || '#1D6F8F', status: a(PG, 'status') || 'live', stamps: stamps }] };
  }
  function go(id) {
    if (PG) { var ix = PG.getAttribute('data-pp-index'); if (ix) location.href = ix; return; }
    var u = new URL(location.href);
    if (id) u.searchParams.set('passport', id); else u.searchParams.delete('passport');
    try { history.pushState({}, '', u); } catch (e) {}
    sel = null; render(); window.scrollTo({ top: Math.max(0, root.getBoundingClientRect().top + window.scrollY - 80), behavior: 'smooth' });
  }

  function shelf() {
    var h = '<h1>' + T.title + '</h1><p class="lead">' + T.sub + '</p><div class="shelf">';
    D.passports.forEach(function (p) {
      var soon = p.status === 'coming-soon' || !p.stamps.length, n = soon ? 0 : count(p), tot = places(p).length;
      var first = p.stamps[0], mini = first ? stampSvg(p, first, 'm') : '';
      h += '<button class="pcard" data-p="' + esc(p.id) + '"' + (soon ? ' disabled' : '') + ' style="--c:' + esc(p.ink) + '"><span class="mini" style="color:' + esc(p.ink) + '">' + mini + '</span><span style="flex:1;min-width:0"><b>' + esc(L(p.name)) + '</b><span class="m">' +
        (soon ? T.soon : n + ' ' + T.of + ' ' + tot + ' ' + T.stamped) + '</span>' + (soon ? '' : '<span class="bar"><i style="width:' + Math.round(100 * n / tot) + '%"></i></span>') + '</span></button>';
    });
    root.innerHTML = h + '</div><p style="text-align:center;margin-top:18px"><a class="btn alt" href="' + T.mapPath + (ES ? '?lang=es' : '') + '">' + T.mapAll + ' →</a></p>';
    [].forEach.call(root.querySelectorAll('.pcard:not([disabled])'), function (b) { b.onclick = function () { go(b.getAttribute('data-p')); }; });
  }

  function book(p) {
    var n = count(p), tot = places(p).length;
    var h = '<button class="back" id="mwp-back">← ' + T.all + '</button><div class="book" style="--c:' + esc(p.ink) + '"><div class="cover"><div style="flex:1;min-width:0"><h2>' + esc(L(p.name)) + '</h2><p>' + esc(L(p.tagline)) + '</p></div>' +
      '<div class="badge" id="mwp-badge"><b>' + n + '/' + tot + '</b><span>' + T.stamped + '</span></div></div>' + (n === tot ? '<div class="done" style="margin-top:14px">' + doneInner(p) + '</div>' : '') + bonusLine(p) + '<div class="grid">';
    var lastArea = null, hasAreas = p.stamps.some(function (s) { return s.area; });
    p.stamps.forEach(function (s, i) {
      if (hasAreas && s.area !== lastArea) { h += '<div class="areah">' + esc(s.area || '') + '</div>'; lastArea = s.area; }
      h += '<button class="st' + (has(s) ? ' on' : '') + (s.bonus ? ' bonus' : '') + '" data-i="' + i + '" aria-pressed="' + has(s) + '" style="color:' + esc(s.ink || p.ink) + '">' + stampSvg(p, s, i) + (s.bonus ? '<span class="bn">' + T.bonus + '</span>' : '') + '<span class="lb" style="color:var(--olive)">' + esc(L(s.name)) + '</span></button>';
    });
    root.innerHTML = h + '</div><p style="text-align:center;margin:16px 0 0"><a class="btn alt" href="' + T.mapPath + '?passport=' + encodeURIComponent(p.id) + (ES ? '&lang=es' : '') + '">' + T.mapPass + ' →</a></p><div class="foot">' + T.honest + '</div></div><div id="mwp-sheet"></div>';
    document.getElementById('mwp-back').onclick = function () { go(null); };
    [].forEach.call(root.querySelectorAll('.st'), function (b) { b.onclick = function () { open(p, +b.getAttribute('data-i')); }; });
  }

  function open(p, i) {
    sel = i; var s = p.stamps[i], on = has(s), box = document.getElementById('mwp-sheet');
    var par = s.bonus ? p.stamps.filter(function (x) { return x.id === s.parent; })[0] : null;
    var kids = s.bonus ? [] : p.stamps.map(function (x, ix) { return x.bonus && x.parent === s.id ? { x: x, ix: ix } : null; }).filter(Boolean);
    var alsoH = kids.length ? '<div class="also"><b>' + T.alsoHere + ':</b>' + kids.map(function (k) { return '<button type="button" data-k="' + k.ix + '">' + (has(k.x) ? '✓ ' : '') + esc(L(k.x.name)) + '</button>'; }).join('') + '</div>' : '';
    var mapUrl = s.mapId ? T.mapPath + '?spot=' + encodeURIComponent(s.mapId) + '&passport=' + encodeURIComponent(p.id) + (ES ? '&lang=es' : '') : (s.mapLink || '');
    box.innerHTML = '<div class="back-dim" id="mwp-dim"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="' + esc(L(s.name)) + '" style="--c:' + esc(s.ink || p.ink) + '">' +
      '<button class="x" id="mwp-x" aria-label="' + T.close + '">×</button><div class="big' + (on ? ' on' : '') + '" id="mwp-big" style="color:' + esc(s.ink || p.ink) + '">' + stampSvg(p, s, 'big') + '</div>' +
      '<div class="tx"><h2>' + esc(L(s.name)) + '</h2><p>' + esc(L(s.tip)) + '</p>' + (L(s.challenge) ? '<p class="chal"><b>' + T.tryIt + ':</b> ' + esc(L(s.challenge)) + '</p>' : '') + (s.bonus ? '<span class="tag" style="margin-right:6px">' + T.bonus + (par ? ': ' + esc(L(par.name)) : '') + '</span>' : '') + (s.cost ? '<span class="tag" style="margin-right:6px">' + esc(s.cost === 'Free' ? T.free : s.cost) + '</span>' : '') + (s.draft ? '<span class="tag">' + T.draft + '</span>' : '') + alsoH + '</div>' +
      '<div class="row"><button class="btn' + (on ? ' alt' : '') + '" id="mwp-do">' + (on ? T.undo : T.stampIt) + '</button>' + (mapUrl ? '<a class="btn alt" href="' + esc(mapUrl) + '">' + T.map + '</a>' : '') + '</div></div>';
    var dd = document.getElementById('mwp-do'); dd.focus();
    [].forEach.call(box.querySelectorAll('.also button'), function (b) { b.onclick = function () { open(p, +b.getAttribute('data-k')); }; });
    document.getElementById('mwp-x').onclick = document.getElementById('mwp-dim').onclick = close;
    dd.onclick = function () {
      var now = has(s);
      if (now) { set(s, false); refresh(p); open(p, i); return; }
      set(s, true);
      var big = document.getElementById('mwp-big'); big.classList.add('on');
      MWStamp.press(big, { ink: s.ink || p.ink });
      refresh(p, i);
      dd.textContent = T.undo; dd.classList.add('alt');
      if (!s.bonus && count(p) === places(p).length) setTimeout(function () { MWStamp.burst(big, [p.ink, '#E89B00', '#C2352A', '#2E9E57']); }, 450);
    };
  }
  function close() { document.getElementById('mwp-sheet').innerHTML = ''; var b = root.querySelector('.st[data-i="' + sel + '"]'); sel = null; if (b) b.focus(); }
  // update the grid and badge in place, so the sheet stays open
  function refresh(p, popIdx) {
    var n = count(p), tot = places(p).length;
    document.getElementById('mwp-badge').innerHTML = '<b>' + n + '/' + tot + '</b><span>' + T.stamped + '</span>';
    var bl = document.getElementById('mwp-bonus'); if (bl) bl.textContent = T.bonusLine + ': ' + bcount(p) + ' ' + T.of + ' ' + bonuses(p).length;
    [].forEach.call(root.querySelectorAll('.st'), function (b) {
      var i = +b.getAttribute('data-i'), on = has(p.stamps[i]); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
    });
    var d = root.querySelector('.done'); if (n === tot && !d) { var el = document.createElement('div'); el.className = 'done'; el.style.marginTop = '14px'; el.innerHTML = doneInner(p); root.querySelector('.cover').after(el); } else if (n < tot && d) d.remove();
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sel !== null) close(); });
  window.addEventListener('popstate', function () { if (!PG) { sel = null; render(); } });
  window.addEventListener('storage', function (e) { if (/marlon_/.test(e.key || '') && sel === null) render(); });

  function render() {
    if (PG) { var q = D.passports[0]; if (q.stamps.length) book(q); else root.innerHTML = ''; return; }
    var id = new URLSearchParams(location.search).get('passport'), p = id && pp(id);
    if (p && p.status !== 'coming-soon' && p.stamps.length) book(p); else shelf();
  }

  function j(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(u + ' ' + r.status); return r.json(); }); }
  Promise.all([PG ? Promise.resolve(fromDom()) : j(BASE + 'passports.json'), j(BASE + 'stamp-icons.json')]).then(function (r) {
    D = r[0]; MWStamp.setIcons(r[1]); syncOld(); render();
  }).catch(function (e) { root.innerHTML = '<p class="lead">' + T.err + '</p>'; if (window.console) console.warn(e); });
})();
