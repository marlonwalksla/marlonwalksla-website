/* =============================================================================
   MarlonWalksLA - story cards from the CMS (round 96, Oct 26, 2026)
   Pages carry a hidden Webflow Collection List: [data-story-feed="en|es"],
   one <a data-story-card data-slug data-label data-topic data-tour> per story
   (image = Thumbnail, h3 = Name, p = Post Summary). This script turns it into
   the hh-card design, so a new story in the CMS shows up with no code change.

   Hub pages (/history, /historia-de-los-angeles): fills [data-hh="stops|big|more"]
   grids inside the injected hub HTML. The hub loader calls mwStoryCards() after
   it injects the section; the static cards in the HTML stay as a fallback.
   Tour pages: feed has data-tour-filter="free|team|private"; a "stories from
   this tour" section is built right before the feed. Nothing shows if no
   story matches (Private today).
   ============================================================================= */
(function () {
  var CSS = '[data-story-feed]{display:none!important}' +
    '.hh-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px;margin-top:22px}' +
    '.hh-card{display:flex;flex-direction:column;background:#fff;border:2.5px solid #27302E;border-radius:18px;overflow:hidden;text-decoration:none!important;color:#27302E!important;box-shadow:4px 4px 0 #27302E;transition:transform .15s ease-out,box-shadow .15s ease-out}' +
    '.hh-card:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #27302E}' +
    '.hh-card img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;border-bottom:2.5px solid #27302E}' +
    '.hh-card .hh-body{padding:14px 16px 18px}' +
    '.hh-card h3{font-family:"Lilita One",sans-serif;font-weight:400;font-size:1.3rem;margin:0 0 6px}' +
    '.hh-card p{margin:0;font-size:.95rem;line-height:1.45}' +
    '.hh-stop{display:inline-block;font-size:.75rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;background:#FFC9E4;color:#9D174D;border-radius:99px;padding:2px 10px;margin-bottom:8px}' +
    '.hh-big .hh-stop{background:#D5EAF6;color:#1D4E89}' +
    '.sc-more{text-align:center;margin-top:22px}' +
    '@media (prefers-reduced-motion:reduce){.hh-card{transition:none}.hh-card:hover{transform:none}}';
  var TXT = {
    en: { tour: 'Read the stories before you go', tourSub: 'The places on this walk, and the history behind them.', more: 'All LA history stories', moreHref: '/history' },
    es: { tour: 'Lee las historias antes de ir', tourSub: 'Los lugares de este recorrido y la historia detrás de cada uno.', more: 'Todas las historias de LA', moreHref: '/historia-de-los-angeles' }
  };

  function style() {
    if (document.getElementById('sc-style')) return;
    var s = document.createElement('style'); s.id = 'sc-style'; s.textContent = CSS;
    document.head.appendChild(s);
  }
  function txt(el, sel) { var n = el.querySelector(sel); return n ? n.textContent.trim() : ''; }
  function read(feed) {
    var lang = feed.getAttribute('data-story-feed') === 'es' ? 'es' : 'en';
    var base = lang === 'es' ? '/historias/' : '/blog/';
    return [].slice.call(feed.querySelectorAll('[data-story-card]')).map(function (a) {
      var img = a.querySelector('img');
      var src = img ? (img.getAttribute('src') || '') : '';
      return {
        href: base + a.getAttribute('data-slug'),
        label: a.getAttribute('data-label') || '',
        topic: (a.getAttribute('data-topic') || '').toLowerCase(),
        tour: (a.getAttribute('data-tour') || '').toLowerCase(),
        name: txt(a, 'h3'), sum: txt(a, 'p'),
        img: /^https?:/.test(src) ? src : '', alt: img ? (img.getAttribute('alt') || '') : ''
      };
    }).filter(function (c) { return c.name && c.href.slice(-1) !== '/'; });
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
  function card(c) {
    var big = c.topic.indexOf('big') === 0;
    var a = el('a', 'hh-card' + (big ? ' hh-big' : '')); a.href = c.href;
    if (c.img && !big) { var i = el('img'); i.src = c.img; i.alt = c.alt || c.name; i.loading = 'lazy'; a.appendChild(i); }
    var b = el('div', 'hh-body');
    if (c.label) b.appendChild(el('span', 'hh-stop', c.label));
    b.appendChild(el('h3', '', c.name));
    if (c.sum) b.appendChild(el('p', '', c.sum));
    a.appendChild(b); return a;
  }
  function group(c) { return c.topic === 'landmark' ? 'stops' : (c.topic.indexOf('big') === 0 ? 'big' : 'more'); }
  function fill(grid, list) { grid.innerHTML = ''; list.forEach(function (c) { grid.appendChild(card(c)); }); }

  function hub(list) {
    ['stops', 'big', 'more'].forEach(function (k) {
      var grid = document.querySelector('[data-hh="' + k + '"]'); if (!grid) return;
      var mine = list.filter(function (c) { return group(c) === k; });
      var sec = grid.closest('section');
      if (mine.length) { fill(grid, mine); if (sec) sec.hidden = false; }
      else if (k === 'more' && sec) sec.hidden = true;
    });
  }
  function tour(feed, list, lang) {
    var f = feed.getAttribute('data-tour-filter');
    var mine = list.filter(function (c) { return c.tour.indexOf(f) !== -1; });
    var old = document.getElementById('sc-tour'); if (old) old.remove();
    if (!mine.length) return;
    var T = TXT[lang];
    var host = el('div', 'tp'); host.id = 'sc-tour';
    host.setAttribute('style', 'position:static;width:auto;height:auto;margin:0;top:auto;left:auto;transform:none;background:none;z-index:auto');
    var sec = el('section', 'tp-section'), wrap = el('div', 'tp-wrap');
    wrap.appendChild(el('h2', 'tp-h2', T.tour));
    wrap.appendChild(el('p', 'tp-sub', T.tourSub));
    var grid = el('div', 'hh-grid'); fill(grid, mine); wrap.appendChild(grid);
    var m = el('p', 'sc-more'), ml = el('a', 'tp-btn ghost', T.more); ml.href = T.moreHref; m.appendChild(ml); wrap.appendChild(m);
    sec.appendChild(wrap); host.appendChild(sec);
    feed.parentNode.insertBefore(host, feed);
  }

  window.mwStoryCards = function () {
    style();
    document.querySelectorAll('[data-story-feed]').forEach(function (feed) {
      var lang = feed.getAttribute('data-story-feed') === 'es' ? 'es' : 'en';
      var list = read(feed); if (!list.length) return;
      if (feed.hasAttribute('data-tour-filter')) tour(feed, list, lang); else hub(list);
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', window.mwStoryCards);
  else window.mwStoryCards();
})();
