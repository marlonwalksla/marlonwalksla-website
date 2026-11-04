/* MarlonWalksLA: one page per stamp (Nov 2026)
 * Runs on the CMS template page for Stamps (/stamps/<slug>).
 * The page itself holds real text from the CMS (name, tip, challenge) so search engines can read it. This file lays it out,
 * adds the stamp, the "to do here" list, and the links to the map, Google Maps, the passport book and History.
 * Data: the CMS fields in data-* attributes on [data-mwsp=data], plus passports.json (for the passport, siblings and bonus list).
 * Saving: same keys as passport.js (marlon_visited_spots for stamps with a map pin, marlon_stamps for the rest).
 * Spanish: ?lang=es, or html lang="es".
 */
(function () {
  'use strict';
  var main = document.querySelector('[data-mwsp="main"]');
  if (!main || main.getAttribute('data-ready')) return;
  main.setAttribute('data-ready', '1');
  // Live site reads the released files on main. The test site reads the test branch, so new data can be checked before it goes live.
  var PROD = /^(www\.)?marlonwalksla\.com$/i.test(location.hostname);
  var BASE = PROD ? 'https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@main/' : 'https://raw.githubusercontent.com/marlonwalksla/marlonwalksla-website/test/';
  var h1 = main.querySelector('[data-mwsp="h1"]'), tip = main.querySelector('[data-mwsp="tip"]'), chal = main.querySelector('[data-mwsp="chal"]');
  var root = main.querySelector('[data-mwsp="root"]'), dat = main.querySelector('[data-mwsp="data"]');
  var Q = new URLSearchParams(location.search);
  var ES = (Q.get('lang') || '').toLowerCase().indexOf('es') === 0 || document.documentElement.lang === 'es';
  var TT = ES ? {
    stampIt: 'Sellar', undo: 'Quitar sello', of: 'de', todo: 'Para hacer aquí', place: 'Lugar', bonusAt: 'Extra en', map: 'Ver en el mapa', gmaps: 'Horarios y cómo llegar',
    book: 'Ver el pasaporte', history: 'Lee la historia', tryIt: 'Pruébalo', free: 'Gratis', honest: 'Se sella cuando tú estás ahí. Es un juego de honor.',
    all: 'Todos los pasaportes', pass: 'Pasaporte', mapPath: '/mapa-los-angeles', bookPath: '/pasaportes', stamped: 'Sellado', here: 'Estás aquí', err: 'No se pudo cargar el sello.'
  } : {
    stampIt: 'Stamp it', undo: 'Remove stamp', of: 'of', todo: 'To do here', place: 'Place', bonusAt: 'Bonus at', map: 'See on the map', gmaps: 'Hours and directions',
    book: 'See the passport', history: 'Read the story', tryIt: 'Try this', free: 'Free', honest: 'Stamp it when you are there. It is the honor system.',
    all: 'All passports', pass: 'Passport', mapPath: '/maps', bookPath: '/passports', stamped: 'Stamped', here: 'You are here', err: 'Could not load the stamp.'
  };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function L(o) { return o ? (ES ? (o.es || o.en) : o.en) || '' : ''; }
  function da(n) { return dat ? (dat.getAttribute('data-' + n) || '') : ''; }
  function rd(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } }
  function wr(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var mem = { v: [], s: [] };
  function key(s) { return s.mapId ? 'marlon_visited_spots' : 'marlon_stamps'; }
  function ids(s) { var a = [s.mapId || s.id]; if (s.legacyKey && a.indexOf(s.legacyKey) < 0) a.push(s.legacyKey); return a; }
  function has(s) {
    var k = key(s), a = rd(k), m = k === 'marlon_visited_spots' ? mem.v : mem.s;
    return ids(s).some(function (i) { return a.indexOf(i) > -1 || m.indexOf(i) > -1; });
  }
  function set(s, on) {
    var k = key(s), a = rd(k), m = k === 'marlon_visited_spots' ? mem.v : mem.s;
    [a, m].forEach(function (arr) { ids(s).forEach(function (i) { var x = arr.indexOf(i); if (on && x < 0) arr.push(i); if (!on && x > -1) arr.splice(x, 1); }); });
    wr(k, a);
  }

  var css = '[data-mwsp=main]{--peach:#FFEDE2;--sage:#DFE8C0;--olive:#30312B;--cream:#FDFCDF;--muted:#4A4B43;--ink:#1D6F8F;max-width:720px;margin:0 auto;padding:20px 16px 56px;color:var(--olive);font-family:Nunito,system-ui,sans-serif;box-sizing:border-box}' +
    '[data-mwsp=main] *{box-sizing:border-box}[data-mwsp=main] [hidden]{display:none!important}' +
    '[data-mwsp=main] h1,[data-mwsp=main] h2{font-family:"Lilita One",sans-serif;font-weight:400;margin:0;line-height:1.05}' +
    '[data-mwsp=main] h1{font-size:clamp(32px,8vw,46px)}' +
    '[data-mwsp=main] .crumb{display:flex;flex-wrap:wrap;gap:6px 14px;margin:0 0 10px;font-family:Fredoka,sans-serif;font-size:15px}' +
    '[data-mwsp=main] .crumb a,[data-mwsp=main] .lk{color:var(--olive);font-weight:500;text-decoration:underline;min-height:44px;display:inline-flex;align-items:center}' +
    '[data-mwsp=main] .card{display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start;margin:14px 0 0;padding:18px;background:var(--cream);border:3px solid var(--olive);border-radius:24px;box-shadow:5px 5px 0 var(--olive)}' +
    '[data-mwsp=main] .big{flex:0 0 150px;width:150px;max-width:44%;position:relative;cursor:pointer;background:none;border:0;padding:0;color:inherit}' +
    '[data-mwsp=main] .big svg{width:100%;height:auto;display:block;transform:rotate(var(--r,0deg));transition:opacity .3s,filter .3s}' +
    '[data-mwsp=main] .big:not(.on) svg{opacity:.3;filter:grayscale(1)}' +
    '[data-mwsp=main] .tx{flex:1 1 220px;min-width:0}' +
    '[data-mwsp=main] [data-mwsp=tip]{margin:10px 0 0;font-family:Fredoka,sans-serif;font-size:18px;line-height:1.35}' +
    '[data-mwsp=main] [data-mwsp=chal]{margin:12px 0 0;padding:9px 12px;border-radius:12px;background:var(--peach);border:2px solid var(--olive);font-family:Fredoka,sans-serif;font-size:16px}' +
    '[data-mwsp=main] .tag{color:var(--olive);text-decoration:none;display:inline-block;margin:6px 6px 0 0;padding:2px 10px;border-radius:99px;background:var(--peach);border:2px solid var(--olive);font-family:Fredoka,sans-serif;font-size:13px}' +
    '[data-mwsp=main] .row{flex:1 1 100%;display:flex;gap:10px;flex-wrap:wrap;align-items:center}' +
    '[data-mwsp=main] .btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:8px 22px;border-radius:999px;border:3px solid var(--olive);background:var(--c,var(--ink));color:var(--cream);font-family:"Lilita One",sans-serif;font-size:19px;cursor:pointer;text-decoration:none;box-shadow:3px 3px 0 var(--olive)}' +
    '[data-mwsp=main] .btn.alt{background:var(--cream);color:var(--olive)}[data-mwsp=main] .btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--olive)}' +
    '[data-mwsp=main] .todo{margin:18px 0 0;padding:14px;border:3px solid var(--olive);border-radius:20px;background:var(--sage)}' +
    '[data-mwsp=main] .todo h2{font-size:24px}' +
    '[data-mwsp=main] .todo ul{list-style:none;margin:10px 0 0;padding:0;display:grid;gap:8px}' +
    '[data-mwsp=main] .todo li button,[data-mwsp=main] .todo li a{display:flex;align-items:center;gap:10px;width:100%;min-height:48px;padding:8px 12px;text-align:left;border:2px solid var(--olive);border-radius:14px;background:var(--cream);font-family:Fredoka,sans-serif;font-size:16px;font-weight:500;color:var(--olive);cursor:pointer;text-decoration:none}' +
    '[data-mwsp=main] .todo .ck{flex:0 0 26px;width:26px;height:26px;border-radius:8px;border:2px solid var(--olive);display:flex;align-items:center;justify-content:center;background:#fff;font-size:17px;line-height:1}' +
    '[data-mwsp=main] .todo li.on .ck{background:var(--c,var(--ink));color:var(--cream)}' +
    '[data-mwsp=main] .todo li.me button{outline:3px solid var(--c,var(--ink));outline-offset:1px}' +
    '[data-mwsp=main] .links{display:flex;flex-wrap:wrap;gap:6px 18px;margin:16px 2px 0;font-family:Fredoka,sans-serif;font-size:16px}' +
    '[data-mwsp=main] .foot{margin:18px 0 0;text-align:center;font-family:Fredoka,sans-serif;font-size:14px;color:var(--muted)}' +
    '[data-mwsp=main] button:focus-visible,[data-mwsp=main] a:focus-visible{outline:3px solid var(--olive);outline-offset:2px}' +
    '@media(prefers-reduced-motion:reduce){[data-mwsp=main] *{transition:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function j(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(u + ' ' + r.status); return r.json(); }); }
  var slug = da('slug') || location.pathname.replace(/\/+$/, '').split('/').pop();

  // Nov 4, 2026: one page per place. /stamps/<slug> (stamp.slug in passports.json) shows the place once and lists every
  // passport that includes it. The old form /stamps/<passport>-<id> still resolves, so links from yesterday do not break.
  var RANK = { 'downtown-classic': 0, 'la-tourist': 1 };
  var wantP = (location.search.match(/[?&]passport=([^&#]+)/) || [])[1] || '';
  function find(D) {
    var hits = [];
    D.passports.forEach(function (p) {
      p.stamps.forEach(function (x) { if (x.slug === slug || p.id + '-' + x.id === slug) hits.push({ p: p, s: x }); });
    });
    if (!hits.length) return null;
    hits.sort(function (a, b) {
      var wa = a.p.id === wantP ? -1 : 0, wb = b.p.id === wantP ? -1 : 0;
      if (wa !== wb) return wa - wb;
      return (RANK[a.p.id] == null ? 9 : RANK[a.p.id]) - (RANK[b.p.id] == null ? 9 : RANK[b.p.id]);
    });
    var f = hits[0]; f.owners = hits.map(function (h) { return h.p; });
    return f;
  }

  function draw(D) {
    var f = find(D);
    if (!f) { if (window.console) console.warn('[stamp-page] not in passports.json: ' + slug); return; }
    var p = f.p, s = f.s;
    var par = s.bonus ? p.stamps.filter(function (x) { return x.id === s.parent; })[0] : null;
    var head = par || s;                                    // the place this page is about
    var kids = []; D.passports.forEach(function (q) { q.stamps.forEach(function (x) { if (x.bonus && x.parent === head.id && kids.indexOf(x) < 0) kids.push(x); }); });
    var team = [head].concat(kids);
    var ink = s.ink || p.ink;
    var mapUrl = head.mapId ? TT.mapPath + '?spot=' + encodeURIComponent(head.mapId) + '&passport=' + encodeURIComponent(p.id) + (ES ? '&lang=es' : '') : (head.mapLink || '');
    var gmUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((head.name.en) + ', Los Angeles, CA');
    var bookUrl = TT.bookPath + '?passport=' + encodeURIComponent(p.id) + (ES ? '&lang=es' : '');
    var hist = da('history') || (head.history && (head.history[ES ? 'es' : 'en'] || head.history.en)) || (typeof head.history === 'string' ? head.history : '') || '';
    function pageHref(x) { return '/stamps/' + (x.slug || p.id + '-' + x.id) + (ES ? '?lang=es' : ''); }

    // Text from the CMS stays in place (search engines read it); in Spanish we swap in the Spanish text.
    if (ES) {
      if (h1) h1.textContent = L(s.name);
      if (tip) tip.textContent = L(s.tip);
    }
    document.title = L(s.name) + (par ? ' (' + L(par.name) + ')' : '') + ' | ' + L(p.name) + ' | MarlonWalksLA';
    var chT = L(s.challenge);
    if (chal) { if (chT) chal.innerHTML = '<b>' + TT.tryIt + ':</b> ' + esc(chT); else { chal.remove(); chal = null; } }

    function stampSvg(x, i) { return MWStamp.svg({ uid: 'mwsp-' + i, top: L(x.top), bottom: L(x.bottom), icon: x.icon, year: x.year, ink: x.ink || p.ink, rot: x.rot, seed: x.seed }); }

    var tags = f.owners.map(function (q) { return '<a class="tag" href="' + esc(TT.bookPath + '?passport=' + encodeURIComponent(q.id) + (ES ? '&lang=es' : '')) + '">' + esc(L(q.name)) + '</a>'; }).join('') + (head.area ? '<span class="tag">' + esc(head.area) + '</span>' : '') +
      (s.bonus ? '<span class="tag">' + TT.bonusAt + ': ' + esc(L(par.name)) + '</span>' : '') +
      (s.cost ? '<span class="tag">' + (s.cost === 'Free' ? TT.free : esc(s.cost)) + '</span>' : '');
    var wrap = document.createElement('div');
    wrap.className = 'card'; wrap.style.setProperty('--c', ink);
    wrap.innerHTML = '<button class="big' + (has(s) ? ' on' : '') + '" id="mwsp-big" aria-label="' + esc(L(s.name)) + '" style="color:' + esc(ink) + ';--r:' + (s.rot || 0) + 'deg">' + stampSvg(s, 0) + '</button><div class="tx" id="mwsp-tx"></div>' +
      '<div class="row"><button class="btn' + (has(s) ? ' alt' : '') + '" id="mwsp-do">' + (has(s) ? TT.undo : TT.stampIt) + '</button>' +
      (mapUrl ? '<a class="btn alt" href="' + esc(mapUrl) + '">' + TT.map + '</a>' : '') + '</div>';
    root.innerHTML = '';
    var crumb = document.createElement('div'); crumb.className = 'crumb';
    crumb.innerHTML = '<a href="' + TT.bookPath + (ES ? '?lang=es' : '') + '">← ' + TT.all + '</a><a href="' + esc(bookUrl) + '">' + esc(L(p.name)) + '</a>' + (par ? '<a href="' + esc(pageHref(par)) + '">' + esc(L(par.name)) + '</a>' : '');
    root.appendChild(crumb);
    root.appendChild(wrap);
    // move the CMS text blocks into the card so they sit next to the stamp
    var tx = wrap.querySelector('#mwsp-tx');
    if (h1) tx.appendChild(h1);
    var tg = document.createElement('div'); tg.innerHTML = tags; tx.appendChild(tg);
    if (tip) tx.appendChild(tip);
    if (chal) tx.appendChild(chal);

    function refresh() {
      var big = document.getElementById('mwsp-big'), b = document.getElementById('mwsp-do'), on = has(s);
      big.classList.toggle('on', on); b.textContent = on ? TT.undo : TT.stampIt; b.classList.toggle('alt', on);
      [].forEach.call(root.querySelectorAll('.todo li[data-i]'), function (li) { var x = team[+li.getAttribute('data-i')], o = has(x); li.classList.toggle('on', o); li.querySelector('.ck').textContent = o ? '✓' : ''; });
      var cnt = root.querySelector('.todo h2 span'); if (cnt) cnt.textContent = team.filter(has).length + ' ' + TT.of + ' ' + team.length;
    }
    function toggle(x) { set(x, !has(x)); refresh(); }
    wrap.querySelector('#mwsp-do').onclick = function () { toggle(s); };
    wrap.querySelector('#mwsp-big').onclick = function () { toggle(s); };

    if (team.length > 1) {
      var td = document.createElement('div'); td.className = 'todo'; td.style.setProperty('--c', ink);
      td.innerHTML = '<h2>' + TT.todo + ': <span></span></h2><ul>' + team.map(function (x, i) {
        var me = x === s;
        return '<li data-i="' + i + '" class="' + (has(x) ? 'on' : '') + (me ? ' me' : '') + '"><button type="button" data-i="' + i + '"><span class="ck">' + (has(x) ? '✓' : '') + '</span><span>' + esc(L(x.name)) + (x.bonus ? '' : ' (' + TT.place.toLowerCase() + ')') + '</span></button></li>';
      }).join('') + '</ul><div class="links" style="margin-top:12px">' + team.filter(function (x) { return x !== s; }).map(function (x) { return '<a class="lk" href="' + esc(pageHref(x)) + '">' + esc(L(x.name)) + ' →</a>'; }).join('') + '</div>';
      root.appendChild(td);
      [].forEach.call(td.querySelectorAll('button[data-i]'), function (b) { b.onclick = function () { toggle(team[+b.getAttribute('data-i')]); }; });
    }
    var lk = document.createElement('div'); lk.className = 'links';
    lk.innerHTML = '<a class="lk" target="_blank" rel="noopener" href="' + esc(gmUrl) + '">' + TT.gmaps + ' ↗</a><a class="lk" href="' + esc(bookUrl) + '">' + TT.book + ' →</a>' + (hist ? '<a class="lk" href="' + esc(hist) + '">' + TT.history + ' →</a>' : '');
    root.appendChild(lk);
    var ft = document.createElement('p'); ft.className = 'foot'; ft.textContent = TT.honest; root.appendChild(ft);
    refresh();
  }

  Promise.all([j(BASE + 'passports.json'), j(BASE + 'stamp-icons.json')]).then(function (r) { MWStamp.setIcons(r[1]); draw(r[0]); })
    .catch(function (e) { if (window.console) console.warn(e); });
})();
