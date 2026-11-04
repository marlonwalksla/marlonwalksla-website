/* MarlonWalksLA all-stamps page (Nov 2026)
 * Every place stamp in one page, grouped by passport. Same data as the passport pages (passports.json), same drawing (stamp-lib.js).
 *
 * Mount:  <div id="mw-stamps"></div>  then stamp-lib.js and this file.
 * Pages:  /stamps (EN)   /sellos (ES)   or ?lang=es
 * Links:  a stamp with its own page goes to /stamps/<passport>-<stamp>; the others open that passport book (?passport=...).
 *         Which passports have stamp pages: LINKED below (same rule as tools/build_passports_crawler.py).
 * Saving: reads the same browser lists as passport.js (marlon_visited_spots, marlon_stamps). It never writes them.
 * Why bonus stamps are not shown: they live inside their place (one tile per place, as in the passport book).
 */
(function () {
  'use strict';
  var mount = document.getElementById('mw-stamps');
  if (!mount || mount.getAttribute('data-ready')) return;
  mount.setAttribute('data-ready', '1');
  var BASE = mount.getAttribute('data-base') || 'https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@main/';
  var LINKED = { 'downtown-classic': 1 };   // passports whose stamps have their own page
  var Q = new URLSearchParams(location.search);
  var lang = (mount.getAttribute('data-lang') || Q.get('lang') || document.documentElement.lang || '').toLowerCase();
  var ES = lang.indexOf('es') === 0 || /^\/sellos/.test(location.pathname);
  var T = ES ? {
    title: 'Todos los sellos', sub: 'Cada lugar de los pasaportes de LA, en un solo lugar. Toca un sello para ver el lugar. Los que ya sellaste se ven con una palomita.',
    search: 'Buscar un lugar', all: 'Todos', jump: 'Ir a un pasaporte', none: 'No hay sellos con ese nombre.', loading: 'Cargando…',
    err: 'No se pudo cargar. Intenta de nuevo.', stamped: 'Ya lo sellaste', places: 'lugares', of: 'de', yours: 'Tus sellos', books: 'Ver los pasaportes',
    map: 'Explora todos los lugares en el mapa', mapPath: '/mapa-los-angeles', bookPath: '/pasaportes', open: 'Abrir el pasaporte'
  } : {
    title: 'All the stamps', sub: 'Every place in the LA passports, in one spot. Tap a stamp to see the place. The ones you already stamped show a check mark.',
    search: 'Search for a place', all: 'All', jump: 'Jump to a passport', none: 'No stamps with that name.', loading: 'Loading…',
    err: 'Could not load. Please try again.', stamped: 'You stamped this', places: 'places', of: 'of', yours: 'Your stamps', books: 'See the passports',
    map: 'Explore all places on the map', mapPath: '/maps', bookPath: '/passports', open: 'Open the passport'
  };
  var qs = ES ? '?lang=es' : '';

  var css = '' +
    '#mws{--olive:#30312B;--cream:#FDFCDF;--muted:#4A4B43;max-width:980px;margin:0 auto;padding:16px 16px 56px;color:var(--olive);font-family:Nunito,system-ui,sans-serif}' +
    '#mws *{box-sizing:border-box}#mws [hidden]{display:none!important}' +
    '#mws h1,#mws h2{font-family:"Lilita One",sans-serif;font-weight:400;margin:0;line-height:1.05}' +
    '#mws h1{font-size:clamp(34px,7vw,48px)}' +
    '#mws .lead{font-family:Fredoka,sans-serif;font-size:17px;line-height:1.35;margin:8px 0 14px;color:var(--muted);max-width:640px}' +
    '#mws .tools{display:flex;flex-direction:column;gap:12px;margin:0 0 8px}' +
    '#mws .q{width:100%;max-width:420px;min-height:48px;padding:8px 16px;border:3px solid var(--olive);border-radius:999px;background:#FFFDF7;font-family:Fredoka,sans-serif;font-size:17px;color:var(--olive)}' +
    '#mws .q:focus-visible,#mws a:focus-visible,#mws button:focus-visible{outline:3px solid var(--olive);outline-offset:2px}' +
    '#mws .pills{display:flex;flex-wrap:wrap;gap:8px}' +
    '#mws .pill{display:inline-flex;align-items:center;min-height:44px;padding:6px 14px;border:2px solid var(--c,var(--olive));border-radius:999px;background:#FFFDF7;color:var(--olive);font-family:Fredoka,sans-serif;font-weight:500;font-size:15px;text-decoration:none;cursor:pointer}' +
    '#mws .pill:hover{background:var(--c,var(--olive));color:var(--cream)}' +
    '#mws .mine{font-family:Fredoka,sans-serif;font-size:16px;color:var(--muted);margin:2px 0 0}' +
    '#mws section.grp{margin:28px 0 0;scroll-margin-top:84px}' +
    '#mws .gh{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;padding-bottom:8px;border-bottom:3px solid var(--c,var(--olive))}' +
    '#mws .gh h2{font-size:clamp(26px,5vw,32px);color:var(--c,var(--olive))}' +
    '#mws .gh .n{font-family:Fredoka,sans-serif;font-weight:500;font-size:15px;color:var(--muted)}' +
    '#mws .gh a{margin-left:auto;font-family:Fredoka,sans-serif;font-weight:500;font-size:15px;color:var(--olive);min-height:44px;display:inline-flex;align-items:center}' +
    '#mws .tg{font-family:Caveat,cursive;font-weight:700;font-size:21px;line-height:1.1;color:#1F2A44;margin:8px 0 0}' +
    '#mws .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:12px 0 0}' +
    '@media(min-width:560px){#mws .grid{grid-template-columns:repeat(4,1fr)}}' +
    '@media(min-width:820px){#mws .grid{grid-template-columns:repeat(6,1fr)}}' +
    '#mws .st{display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px;border-radius:14px;color:inherit;text-decoration:none;min-height:44px;position:relative;-webkit-tap-highlight-color:transparent}' +
    '#mws .st:hover{background:rgba(48,49,43,.06)}' +
    '#mws .st svg{width:100%;height:auto;display:block;transform:rotate(var(--r))}' +
    '#mws .st .lb{font-family:Fredoka,sans-serif;font-weight:500;font-size:14px;line-height:1.1;text-align:center}' +
    '#mws .st .ck{position:absolute;top:2px;right:6px;width:24px;height:24px;border-radius:50%;background:var(--c,#2E9E57);color:#fff;border:2px solid var(--olive);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;line-height:1}' +
    '#mws .none{font-family:Fredoka,sans-serif;font-size:17px;color:var(--muted);margin:24px 0}' +
    '#mws .foot{margin:32px 0 0;display:flex;gap:10px;flex-wrap:wrap}' +
    '#mws .btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:8px 22px;border-radius:999px;border:3px solid var(--olive);background:var(--cream);color:var(--olive);font-family:"Lilita One",sans-serif;font-size:19px;text-decoration:none;box-shadow:3px 3px 0 var(--olive)}' +
    '@media(prefers-reduced-motion:reduce){#mws *{transition:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  mount.innerHTML = '<div id="mws"><p class="lead">' + T.loading + '</p></div>';
  var root = document.getElementById('mws');
  var D = null;

  function L(o) { return o ? (ES ? (o.es || o.en) : o.en) || '' : ''; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function rd(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } }
  function has(s) {
    var k = s.mapId ? 'marlon_visited_spots' : 'marlon_stamps', a = rd(k);
    var ids = [s.mapId || s.id]; if (s.legacyKey) ids.push(s.legacyKey);
    return ids.some(function (i) { return a.indexOf(i) > -1; });
  }
  function places(p) { return p.stamps.filter(function (s) { return !s.bonus; }); }
  function href(p, s) {
    if (LINKED[p.id]) return '/stamps/' + p.id + '-' + s.id + qs;
    return T.bookPath + '?passport=' + encodeURIComponent(p.id) + (ES ? '&lang=es' : '');
  }
  function tile(p, s, i) {
    var on = has(s), name = L(s.name);
    var svg = MWStamp.svg({ uid: 'mws-' + p.id + '-' + i, top: L(s.top), bottom: L(s.bottom), icon: s.icon, year: s.year, ink: s.ink || p.ink, rot: s.rot, seed: s.seed });
    return '<a class="st" href="' + esc(href(p, s)) + '" data-n="' + esc(name.toLowerCase()) + '" style="--r:' + (s.rot || 0) + 'deg;--c:' + esc(p.ink) + '"' + (on ? ' aria-label="' + esc(name + ' (' + T.stamped + ')') + '"' : '') + '>' +
      svg + (on ? '<span class="ck" aria-hidden="true">✓</span>' : '') + '<span class="lb">' + esc(name) + '</span></a>';
  }
  function render() {
    var ps = D.passports.filter(function (p) { return p.status !== 'coming-soon' && places(p).length; });
    var mine = 0, seen = {};
    ps.forEach(function (p) { places(p).forEach(function (s) { var k = s.mapId || p.id + s.id; if (!seen[k]) { seen[k] = 1; if (has(s)) mine++; } }); });
    var total = Object.keys(seen).length;
    var h = '<h1>' + esc(T.title) + '</h1><p class="lead">' + esc(T.sub) + '</p>' +
      '<div class="tools"><input class="q" id="mws-q" type="search" autocomplete="off" placeholder="' + esc(T.search) + '" aria-label="' + esc(T.search) + '">' +
      '<nav class="pills" aria-label="' + esc(T.jump) + '">' + ps.map(function (p) { return '<a class="pill" style="--c:' + esc(p.ink) + '" href="#' + esc(p.id) + '">' + esc(L(p.name)) + '</a>'; }).join('') + '</nav>' +
      (mine ? '<p class="mine">' + esc(T.yours) + ': ' + mine + ' ' + T.of + ' ' + total + '</p>' : '') + '</div>';
    ps.forEach(function (p) {
      var pl = places(p);
      h += '<section class="grp" id="' + esc(p.id) + '" style="--c:' + esc(p.ink) + '"><div class="gh"><h2>' + esc(L(p.name)) + '</h2><span class="n">' + pl.length + ' ' + T.places + '</span>' +
        '<a href="' + T.bookPath + '?passport=' + encodeURIComponent(p.id) + (ES ? '&lang=es' : '') + '">' + esc(T.open) + ' →</a></div>' +
        '<p class="tg">' + esc(L(p.tagline)) + '</p><div class="grid">' + pl.map(function (s, i) { return tile(p, s, i); }).join('') + '</div></section>';
    });
    h += '<p class="none" id="mws-none" hidden>' + esc(T.none) + '</p>' +
      '<div class="foot"><a class="btn" href="' + T.bookPath + qs + '">' + esc(T.books) + '</a><a class="btn" href="' + T.mapPath + '">' + esc(T.map) + '</a></div>';
    root.innerHTML = h;
    var q = document.getElementById('mws-q');
    q.addEventListener('input', function () {
      var v = q.value.trim().toLowerCase(), any = false;
      [].forEach.call(root.querySelectorAll('section.grp'), function (g) {
        var shown = 0;
        [].forEach.call(g.querySelectorAll('.st'), function (a) { var m = !v || a.getAttribute('data-n').indexOf(v) > -1; a.hidden = !m; if (m) shown++; });
        g.hidden = !shown; if (shown) any = true;
      });
      document.getElementById('mws-none').hidden = any;
    });
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t && t.scrollIntoView) setTimeout(function () { t.scrollIntoView(); }, 60); }
  }
  function j(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(u + ' ' + r.status); return r.json(); }); }
  Promise.all([j(BASE + 'passports.json'), j(BASE + 'stamp-icons.json')]).then(function (r) {
    D = r[0]; MWStamp.setIcons(r[1]); render();
  }).catch(function (e) { root.innerHTML = '<p class="lead">' + T.err + '</p>'; if (window.console) console.warn(e); });
  window.addEventListener('storage', function (e) { if (/marlon_/.test(e.key || '') && D && !document.getElementById('mws-q').value) render(); });
})();
