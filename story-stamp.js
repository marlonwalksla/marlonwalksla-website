/* ==========================================================================
   story-stamp.js - MarlonWalksLA
   Nov 3, 2026. Runs on the History story pages (/blog/<slug> and /historias/<slug>).
   If the story is about a place that has a passport stamp, adds a postcard-style card
   under the article: the stamp, "Stamp this place", and links to the stamp page,
   the map pin and the passport. Stamp data: passports.json (field "history" on each stamp).
   Loaded from the footer code of the Blogs and Historias templates (same branch rule as the loader).
   ========================================================================== */
(function () {
  var m = location.pathname.match(/^\/(blog|historias)\/([^\/?#]+)\/?$/);
  if (!m) return;
  var ES = m[1] === 'historias' || /^es/i.test(document.documentElement.lang || '');
  var slug = m[2];
  var PROD = /^(www\.)?marlonwalksla\.com$/i.test(location.hostname);
  var BASE = PROD ? 'https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@main/' : 'https://raw.githubusercontent.com/marlonwalksla/marlonwalksla-website/test/';
  var CDN = 'https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@' + (PROD ? 'main' : 'test') + '/';
  var T = ES ? {
    h: 'Sella este lugar', p: 'Ya lo leíste. Ahora ve, tómate la foto y sella tu pasaporte. Es un juego de honor.',
    stamp: 'Ver el sello', map: 'Verlo en el mapa', book: 'Ver el pasaporte', mapPath: '/mapa-los-angeles', bookPath: '/pasaportes', stampPath: '/passport-stamps/'
  } : {
    h: 'Stamp this place', p: 'You read the story. Now go, take the photo and stamp your passport. It is the honor system.',
    stamp: 'See the stamp', map: 'See it on the map', book: 'See the passport', mapPath: '/maps', bookPath: '/passports', stampPath: '/passport-stamps/'
  };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function L(o) { return o ? (ES ? (o.es || o.en) : o.en) || '' : ''; }
  function js(u) { return new Promise(function (ok, no) { var e = document.createElement('script'); e.src = u; e.onload = ok; e.onerror = no; document.head.appendChild(e); }); }

  function pick(D) {
    // prefer Downtown Classic, then LA Tourist, then any passport
    var hits = [];
    D.passports.forEach(function (p) {
      p.stamps.forEach(function (s) {
        if (s.bonus || !s.history) return;
        var u = (s.history.en || '').split('/').pop(), v = (s.history.es || '').split('/').pop();
        if (u === slug || v === slug) hits.push({ p: p, s: s });
      });
    });
    if (!hits.length) return null;
    var rank = { 'downtown-classic': 0, 'la-tourist': 1 };
    hits.sort(function (a, b) { return (rank[a.p.id] == null ? 9 : rank[a.p.id]) - (rank[b.p.id] == null ? 9 : rank[b.p.id]); });
    return hits[0];
  }

  function css() {
    var c = '.mwss{max-width:640px;margin:34px auto 12px;padding:0 16px;box-sizing:border-box}' +
      '.mwss *{box-sizing:border-box}' +
      '.mwss-card{display:flex;flex-wrap:wrap;gap:16px;align-items:center;padding:18px;background:#FFFDF7;border:2px solid #27302E;border-radius:16px;box-shadow:0 16px 28px -20px rgba(39,48,46,.7);transform:rotate(-.5deg)}' +
      '.mwss-st{flex:0 0 104px;width:104px;padding:6px;background:#fff;border:2px dashed rgba(39,48,46,.55);border-radius:6px;transform:rotate(3deg)}.mwss-st svg{width:100%;height:auto;display:block}' +
      '.mwss-tx{flex:1 1 220px;min-width:0}' +
      '.mwss h2{font-family:"Lilita One",sans-serif;font-weight:400;font-size:28px;line-height:1.05;margin:0;color:#27302E}' +
      '.mwss-nm{display:block;margin-top:4px;font-family:Caveat,cursive;font-weight:700;font-size:22px;color:#1F2A44}' +
      '.mwss p{margin:8px 0 0;font-family:Nunito,system-ui,sans-serif;font-size:16px;line-height:1.5;color:#3B4440}' +
      '.mwss-row{flex:1 1 100%;display:flex;flex-wrap:wrap;gap:10px;align-items:center}' +
      '.mwss-b{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:8px 22px;border-radius:999px;border:2.5px solid #27302E;background:#FFD43B;color:#27302E!important;font-family:"Lilita One",sans-serif;font-size:18px;text-decoration:none!important;box-shadow:4px 4px 0 #27302E;transition:transform .18s ease-out,box-shadow .18s ease-out}' +
      '.mwss-b:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #27302E}.mwss-b.alt{background:#FFFDF7}' +
      '.mwss a:focus-visible{outline:3px solid #27302E;outline-offset:2px}' +
      '@media(prefers-reduced-motion:reduce){.mwss-card{transform:none}.mwss-b{transition:none}}';
    var st = document.createElement('style'); st.textContent = c; document.head.appendChild(st);
  }

  function build(h) {
    var p = h.p, s = h.s, lang = ES ? '?lang=es' : '', lang2 = ES ? '&lang=es' : '';
    var svg = '';
    try { svg = MWStamp.svg({ uid: 'mwss', top: L(s.top), bottom: L(s.bottom), icon: s.icon, year: s.year, ink: s.ink || p.ink, rot: s.rot, seed: s.seed }); } catch (e) {}
    var mapUrl = s.mapId ? T.mapPath + '?spot=' + encodeURIComponent(s.mapId) + '&passport=' + encodeURIComponent(p.id) + lang2 : '';
    var el = document.createElement('section');
    el.className = 'mwss'; el.setAttribute('aria-label', T.h);
    el.innerHTML = '<div class="mwss-card"><div class="mwss-st" style="color:' + esc(s.ink || p.ink) + '">' + svg + '</div>' +
      '<div class="mwss-tx"><h2>' + T.h + '</h2><span class="mwss-nm">' + esc(L(s.name)) + ' · ' + esc(L(p.name)) + '</span><p>' + T.p + '</p></div>' +
      '<div class="mwss-row"><a class="mwss-b" href="' + T.stampPath + esc(p.id + '-' + s.id) + lang + '">' + T.stamp + '</a>' +
      (mapUrl ? '<a class="mwss-b alt" href="' + esc(mapUrl) + '">' + T.map + '</a>' : '') +
      '<a class="mwss-b alt" href="' + T.bookPath + '?passport=' + encodeURIComponent(p.id) + lang2 + '">' + T.book + '</a></div></div>';
    var rt = document.querySelector('.w-richtext');
    var host = rt && rt.parentNode;
    if (rt && host) host.insertBefore(el, rt.nextSibling); else (document.querySelector('main') || document.body).appendChild(el);
  }

  Promise.all([fetch(BASE + 'passports.json').then(function (r) { return r.json(); }), js(CDN + 'stamp-lib.js' + (PROD ? '' : '?v=' + Date.now()))]).then(function (r) {
    var h = pick(r[0]); if (!h) return;
    return MWStamp.load(BASE).then(function () { css(); build(h); });
  }).catch(function () {});
})();
