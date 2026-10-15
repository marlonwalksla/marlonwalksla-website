/* ==============================================================================
 * FILE: route-anim.js
 * MarlonWalksLA - animated route map: Ernesto walks (or drives) from stop to stop
 * while the matching step in the list lights up. Oct 2026.
 *
 * Usage (in a Webflow HTML embed):
 *   <div class="ra" data-ernesto="<image url>" [data-compact]>
 *     <script type="application/json" class="ra-data">
 *       { "mode": "walk" | "drive",
 *         "areas": [ { "name": "Bunker Hill", "lat": 34.05, "lng": -118.25 } ],
 *         "stops": [ { "time": "10:00 AM", "name": "...", "desc": "...", "lat": .., "lng": .. } ] }
 *     (close the script tag)
 *   </div>
 *   Then load route-anim.js (script tag) and route-anim.css (stylesheet) on the page.
 *
 * Coordinates are real lat/lng, projected to a simple flat map (no map tiles).
 * Clicking a step jumps Ernesto there. Respects "reduce motion" settings.
 * ============================================================================== */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var VBW = 600;

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function h(tag, cls, parent, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }

  // Catmull-Rom through points -> one cubic bezier "d" string per segment
  function segmentPaths(pts) {
    var out = [];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var t = 0.18;
      var c1x = p1.x + (p2.x - p0.x) * t, c1y = p1.y + (p2.y - p0.y) * t;
      var c2x = p2.x - (p3.x - p1.x) * t, c2y = p2.y - (p3.y - p1.y) * t;
      out.push('M' + p1.x.toFixed(1) + ',' + p1.y.toFixed(1) +
        ' C' + c1x.toFixed(1) + ',' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ',' + c2y.toFixed(1) +
        ' ' + p2.x.toFixed(1) + ',' + p2.y.toFixed(1));
    }
    return out;
  }

  function build(root) {
    if (root.__raBuilt) return;
    root.__raBuilt = true;
    var dataEl = root.querySelector('.ra-data');
    if (!dataEl) return;
    var data;
    try { data = JSON.parse(dataEl.textContent); } catch (e) { console.warn('route-anim: bad JSON', e); return; }
    var stops = data.stops || [];
    if (stops.length < 2) return;
    var areas = data.areas || [];
    var mode = data.mode === 'drive' ? 'drive' : 'walk';
    var compact = root.hasAttribute('data-compact');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- projection ----
    var all = stops.concat(areas);
    var minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    all.forEach(function (p) {
      minLat = Math.min(minLat, p.lat); maxLat = Math.max(maxLat, p.lat);
      minLng = Math.min(minLng, p.lng); maxLng = Math.max(maxLng, p.lng);
    });
    var kx = Math.cos(((minLat + maxLat) / 2) * Math.PI / 180);
    var dx = (maxLng - minLng) * kx || 0.001, dy = (maxLat - minLat) || 0.001;
    var VBH = Math.round(Math.max(300, Math.min(440, VBW * dy / dx + 120)));
    var pad = 56;
    var s = Math.min((VBW - pad * 2) / dx, (VBH - pad * 2) / dy);
    var ox = (VBW - dx * s) / 2, oy = (VBH - dy * s) / 2;
    function proj(p) { return { x: ox + (p.lng - minLng) * kx * s, y: oy + (maxLat - p.lat) * s }; }
    var pts = stops.map(proj);
    // Stops that sit very close together (e.g. Angels Flight, Grand Central Market,
    // Bradbury Building) are nudged apart a little so their numbers stay readable.
    var MIN_D = 44;
    for (var it = 0; it < 80; it++) {
      var moved = false;
      for (var a = 0; a < pts.length; a++) for (var b = a + 1; b < pts.length; b++) {
        var vx = pts[b].x - pts[a].x, vy = pts[b].y - pts[a].y, dd = Math.sqrt(vx * vx + vy * vy);
        if (dd < MIN_D) {
          if (dd < 0.01) { vx = 1; vy = 0; dd = 1; }
          var push = (MIN_D - dd) / 2 / dd;
          pts[a].x -= vx * push; pts[a].y -= vy * push;
          pts[b].x += vx * push; pts[b].y += vy * push;
          moved = true;
        }
      }
      if (!moved) break;
    }
    pts.forEach(function (p) {
      p.x = Math.max(24, Math.min(VBW - 24, p.x));
      p.y = Math.max(24, Math.min(VBH - 24, p.y));
    });

    // ---- DOM ----
    dataEl.remove();
    var wrap = h('div', 'ra-wrap' + (compact ? ' ra-compact' : ''), root);
    var mapBox = h('div', 'ra-map', wrap);
    var svg = el('svg', { viewBox: '0 0 ' + VBW + ' ' + VBH, role: 'img',
      'aria-label': 'Route map: ' + stops.map(function (s) { return s.name; }).join(', ') }, mapBox);

    var defs = el('defs', {}, svg);
    var pid = 'ra-grid-' + Math.random().toString(36).slice(2, 8);
    var pat = el('pattern', { id: pid, width: 24, height: 24, patternUnits: 'userSpaceOnUse' }, defs);
    el('circle', { cx: 2, cy: 2, r: 1.2, 'class': 'ra-gridDot' }, pat);
    el('rect', { x: 0, y: 0, width: VBW, height: VBH, rx: 18, 'class': 'ra-bg' }, svg);
    el('rect', { x: 0, y: 0, width: VBW, height: VBH, rx: 18, fill: 'url(#' + pid + ')' }, svg);

    areas.forEach(function (a) {
      var p = proj(a);
      var t = el('text', { x: p.x, y: p.y, 'class': 'ra-area', 'text-anchor': 'middle' }, svg);
      t.textContent = a.name;
    });

    var segD = segmentPaths(pts);
    var trail = el('g', { 'class': 'ra-trail ra-' + mode }, svg);
    segD.forEach(function (d) { el('path', { d: d }, trail); });
    var prog = el('g', { 'class': 'ra-progress' }, svg);
    var segs = segD.map(function (d) {
      var p = el('path', { d: d }, prog);
      var len = p.getTotalLength ? p.getTotalLength() : 100;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      return { path: p, len: len };
    });

    var dots = pts.map(function (p, i) {
      var g = el('g', { 'class': 'ra-stop', transform: 'translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ')' }, svg);
      el('circle', { r: 13, 'class': 'ra-halo' }, g);
      el('circle', { r: 10.5, 'class': 'ra-dot' }, g);
      var t = el('text', { 'class': 'ra-num', 'text-anchor': 'middle', dy: '0.35em' }, g);
      t.textContent = i + 1;
      g.addEventListener('click', function () { jump(i); });
      return g;
    });

    var ern = h('img', 'ra-ernesto', mapBox);
    ern.alt = '';
    ern.src = root.getAttribute('data-ernesto') || '';
    ern.onerror = function () { ern.style.display = 'none'; };
    var bubble = h('div', 'ra-bubble', mapBox);

    var list = h('ol', 'ra-list', wrap);
    var items = stops.map(function (st, i) {
      var li = h('li', 'ra-step', list);
      li.tabIndex = 0;
      var num = h('span', 'ra-step-num', li, String(i + 1));
      num.setAttribute('aria-hidden', 'true');
      var body = h('div', 'ra-step-body', li);
      if (st.time) h('span', 'ra-step-time', body, st.time);
      h('strong', 'ra-step-name', body, st.name);
      if (st.desc && !compact) h('span', 'ra-step-desc', body, st.desc);
      li.addEventListener('click', function () { jump(i); });
      li.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jump(i); } });
      return li;
    });

    // ---- state ----
    function placeAt(x, y) {
      ern.style.left = (x / VBW * 100) + '%';
      ern.style.top = (y / VBH * 100) + '%';
    }
    function setActive(i) {
      dots.forEach(function (d, k) {
        d.classList.toggle('is-active', k === i);
        d.classList.toggle('is-done', k < i);
      });
      items.forEach(function (li, k) {
        li.classList.toggle('is-active', k === i);
        li.classList.toggle('is-done', k < i);
      });
      bubble.textContent = stops[i].name;
      bubble.style.left = (pts[i].x / VBW * 100) + '%';
      bubble.style.top = (pts[i].y / VBH * 100) + '%';
      bubble.classList.add('is-on');
    }
    function setSegs(doneUpTo) { // segments [0, doneUpTo) fully drawn
      segs.forEach(function (sg, k) { sg.path.style.strokeDashoffset = k < doneUpTo ? 0 : sg.len; });
    }

    var cur = 0, phase = 'dwell', phaseStart = 0, running = false, raf = null, visible = false;
    var DWELL = 1700, END_DWELL = 3200;
    function travelTime(k) { return Math.max(1100, Math.min(2600, segs[k].len * 7)); }

    function jump(i) {
      cur = i; phase = 'dwell'; phaseStart = performance.now();
      setSegs(i); placeAt(pts[i].x, pts[i].y); setActive(i);
    }

    function tick(now) {
      raf = null;
      if (!running) return;
      var el2 = now - phaseStart;
      if (phase === 'dwell') {
        var wait = cur === stops.length - 1 ? END_DWELL : DWELL;
        if (el2 >= wait) {
          if (cur === stops.length - 1) { jump(0); }
          else { phase = 'travel'; phaseStart = now; bubble.classList.remove('is-on'); }
        }
      } else {
        var sg = segs[cur], dur = travelTime(cur);
        var t = Math.min(1, el2 / dur);
        var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        var pt = sg.path.getPointAtLength(sg.len * e);
        placeAt(pt.x, pt.y);
        sg.path.style.strokeDashoffset = sg.len * (1 - e);
        if (t >= 1) { cur += 1; phase = 'dwell'; phaseStart = now; setActive(cur); }
      }
      raf = requestAnimationFrame(tick);
    }
    function start() {
      if (running || reduce) return;
      running = true; phaseStart = performance.now();
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function stop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }

    jump(0);
    if (reduce) { setSegs(segs.length); root.classList.add('ra-static'); return; }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          visible = en.isIntersecting;
          if (visible && !document.hidden) start(); else stop();
        });
      }, { threshold: 0.25 }).observe(root);
    } else { start(); }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else if (visible) start();
    });
  }

  function init() { document.querySelectorAll('.ra').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.MWRouteAnim = { init: init };
})();
