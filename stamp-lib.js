/* MarlonWalksLA stamp library (Nov 2026)
 * Draws the ink passport stamps in the browser, so a stamp is a few fields in the CMS and not a file to upload.
 * Same drawing as page-embeds/stamps.py (checked by tools/test_stamp_lib.js, which compares the two).
 *
 *   MWStamp.load(baseUrl)            -> Promise, loads stamp-icons.json (~6 KB compressed, cached by the browser)
 *   MWStamp.svg({uid, top, bottom, icon, year, ink, rot, seed, bold})  -> SVG string (inline, so the page fonts work)
 *   MWStamp.press(el, opts)          -> the "stamp down" animation on an element that holds a stamp
 *   MWStamp.burst(el, colors)        -> small ink-dot celebration around an element
 *   MWStamp.iconFor(category)        -> a stand-in icon name when a place has no drawing of its own yet
 *
 * Why inline SVG and not image files: the curved text uses the page fonts (Fredoka, Lilita One). A stamp loaded as an
 * image file cannot use page fonts, so it would show a different font unless the text were turned into outlines.
 */
(function (root) {
  'use strict';
  var ICONS = null, OPTICAL = 0.6, loading = null;

  function load(base) {
    if (ICONS) return Promise.resolve(ICONS);
    if (loading) return loading;
    loading = fetch((base || '') + 'stamp-icons.json').then(function (r) {
      if (!r.ok) throw new Error('stamp-icons ' + r.status);
      return r.json();
    }).then(function (d) { ICONS = d.icons; OPTICAL = d.optical; return ICONS; });
    return loading;
  }
  function setIcons(d) { ICONS = d.icons; OPTICAL = d.optical; }

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function f1(x) { return x.toFixed(1); }

  // Stand-in icons for places that have no drawing of their own yet.
  var FALLBACK = { Landmarks: 'pin', Parks: 'palms3', Dining: 'stall', Arts: 'polaroid', Entertainment: 'trophy', Nightlife: 'sunset', Shopping: 'bag' };
  function iconFor(category) { return FALLBACK[category] || 'pin'; }

  function svg(o) {
    var name = o.icon && ICONS[o.icon] ? o.icon : 'pin';
    var ic = ICONS[name];
    var ink = o.ink || '#27302E', uid = o.uid || 'mws' + Math.floor(Math.random() * 1e6);
    var top = o.top || '', bottom = o.bottom == null ? 'LOS ANGELES' : o.bottom, year = o.year || '';
    var rot = o.rot == null ? -6 : o.rot, seed = o.seed == null ? 3 : o.seed, bold = !!o.bold;
    var n = Array.from(top).length, tsz = n <= 21 ? 13 : 11, tls = n <= 21 ? 1.2 : 0.5;
    var bn = Array.from(bottom).length, bsz = bn <= 20 ? 12.5 : 10.5, bls = bn <= 20 ? 1.8 : 0.8;
    var body = ic.body.split('@@INK@@').join(ink);
    var bx = ic.bb[0], by = ic.bb[1], bw = ic.bb[2], bh = ic.bb[3];
    if (ic.box.length > 2) {
      var v = ic.box[2].split(/\s+/).map(parseFloat), vx = v[0], vw = v[2];
      var x0 = Math.max(bx, vx), x1 = Math.min(bx + bw, vx + vw);
      if (x1 - x0 > 10) { bx = x0; bw = x1 - x0; }
    }
    var EA = year ? 68.0 : 76.0, EB = year ? 50.0 : 60.0;
    var sc = 1.0 / Math.sqrt(Math.pow(bw / 2 / EA, 2) + Math.pow(bh / 2 / EB, 2));
    sc = Math.min(sc, 140.0 / bw) * ic.size;
    var cy = year ? (o.cyYear == null ? 90.0 : o.cyYear) : 100.0;
    var fx = ic.cen[0], fy = ic.cen[1], iw, ih, ix, iy;
    for (;;) {
      iw = bw * sc; ih = bh * sc;
      ix = 100 - iw / 2 + (0.5 - fx) * iw * OPTICAL; iy = cy - ih / 2 + (0.5 - fy) * ih * OPTICAL;
      var ok = true;
      [ix, ix + iw].forEach(function (x) { [iy, iy + ih].forEach(function (y) { if (Math.pow((x - 100) / EA, 2) + Math.pow((y - cy) / EB, 2) > 1.1) ok = false; }); });
      if (ok || sc < 0.2) break;
      sc *= 0.98;
    }
    var vb = f1(bx) + ' ' + f1(by) + ' ' + f1(bw) + ' ' + f1(bh);
    var yr = year ? '<text x="100" y="' + (iy + ih + 14).toFixed(0) + '" text-anchor="middle" font-size="11" letter-spacing="2">' + esc(year) + '</text>' : '';
    var boldAttr = bold ? ' stroke="' + ink + '" stroke-width="0.9" stroke-linejoin="round"' : '';
    return '<svg class="stamp' + (o.extra ? ' ' + o.extra : '') + '" viewBox="0 0 200 200" role="img" aria-label="' + esc(top) + '" style="--r:' + rot + 'deg" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><filter id="' + uid + '-f" x="-8%" y="-12%" width="116%" height="124%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="' + seed + '" result="w"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="w" scale="3.2" result="d"/>' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="' + (seed + 4) + '" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -5 0 0 0 3.7" result="m"/>' +
      '<feComposite in="d" in2="m" operator="in"/></filter>' +
      '<path id="' + uid + '-t" d="M 38.0 122.6 A 66 66 0 1 1 162.0 122.6"/><path id="' + uid + '-b" d="M 18 100 A 82 82 0 0 0 182 100"/></defs>' +
      '<g filter="url(#' + uid + '-f)" fill="' + ink + '" stroke="none" font-family="Fredoka, Lilita One, sans-serif" font-weight="700" style="color:' + ink + '">' +
      '<circle cx="100" cy="100" r="96" fill="none" stroke="' + ink + '" stroke-width="4"/><circle cx="100" cy="100" r="89" fill="none" stroke="' + ink + '" stroke-width="1.5"/>' +
      '<text font-size="' + (tsz + (bold ? 1.5 : 0)) + '" letter-spacing="' + (+(tls + (bold ? 0.6 : 0)).toFixed(10)) + '" text-anchor="middle"' + boldAttr + '><textPath href="#' + uid + '-t" startOffset="50%">' + esc(top) + '</textPath></text>' +
      '<text font-size="' + bsz + '" letter-spacing="' + bls + '" text-anchor="middle"><textPath href="#' + uid + '-b" startOffset="50%">' + esc(bottom) + '</textPath></text>' +
      '<svg x="' + f1(ix) + '" y="' + f1(iy) + '" width="' + f1(iw) + '" height="' + f1(ih) + '" viewBox="' + vb + '" fill="' + ink + '">' + body + '</svg>' + yr + '</g></svg>';
  }

  // ---------- motion ----------
  function reduced() { try { return root.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  function buzz(ms) { try { if (root.navigator && navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  /* The stamp comes down: starts big and faint, lands with a small squash, and an ink ring spreads out and fades. */
  function press(el, opts) {
    opts = opts || {};
    var s = el && el.querySelector ? el.querySelector('svg.stamp') : null;
    buzz(opts.haptic === false ? 0 : 18);
    if (!s || !s.animate || reduced()) return Promise.resolve();
    var r = parseFloat(getComputedStyle(s).getPropertyValue('--r')) || 0;
    var rot = function (extra) { return 'rotate(' + (r + extra) + 'deg)'; };
    var a = s.animate([
      { transform: rot(-14) + ' scale(1.9)', opacity: 0, offset: 0 },
      { transform: rot(2) + ' scale(0.93)', opacity: 1, offset: 0.55 },
      { transform: rot(-1) + ' scale(1.06)', opacity: 1, offset: 0.78 },
      { transform: rot(0) + ' scale(1.03)', opacity: 1, offset: 1 }
    ], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'none' });
    var host = el;
    var pos = getComputedStyle(host).position;
    if (pos === 'static') host.style.position = 'relative';
    var ring = document.createElement('span');
    ring.setAttribute('aria-hidden', 'true');
    ring.style.cssText = 'position:absolute;left:50%;top:50%;width:60%;aspect-ratio:1/1;margin:0;border-radius:50%;border:3px solid ' + (opts.ink || 'currentColor') + ';pointer-events:none;transform:translate(-50%,-50%) scale(.6);opacity:0';
    host.appendChild(ring);
    if (ring.animate) {
      ring.animate([
        { transform: 'translate(-50%,-50%) scale(.6)', opacity: 0.55, offset: 0 },
        { transform: 'translate(-50%,-50%) scale(1.45)', opacity: 0, offset: 1 }
      ], { duration: 640, delay: 200, easing: 'ease-out', fill: 'backwards' }).onfinish = function () { ring.remove(); };
    } else ring.remove();
    return a.finished ? a.finished.catch(function () {}) : Promise.resolve();
  }

  /* Ink dots burst out from an element. Used when a whole passport is complete. */
  function burst(el, colors) {
    if (!el || reduced() || !el.animate) return;
    colors = colors && colors.length ? colors : ['#C2352A', '#2890B6', '#E89B00', '#2E9E57', '#7A3FA0'];
    var box = el.getBoundingClientRect(), n = 26, layer = document.createElement('div');
    layer.setAttribute('aria-hidden', 'true');
    layer.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:0;overflow:visible;pointer-events:none;z-index:99999';
    document.body.appendChild(layer);
    var cx = box.left + box.width / 2, cy = box.top + box.height / 2;
    for (var i = 0; i < n; i++) {
      var d = document.createElement('i'), sz = 6 + Math.random() * 8, ang = (i / n) * Math.PI * 2 + Math.random() * 0.4, dist = 70 + Math.random() * 110;
      d.style.cssText = 'position:absolute;left:' + cx + 'px;top:' + cy + 'px;width:' + sz + 'px;height:' + sz + 'px;border-radius:' + (Math.random() > .5 ? '50%' : '2px') + ';background:' + colors[i % colors.length];
      layer.appendChild(d);
      d.animate([
        { transform: 'translate(0,0) scale(.4) rotate(0deg)', opacity: 1 },
        { transform: 'translate(' + Math.cos(ang) * dist + 'px,' + (Math.sin(ang) * dist - 20) + 'px) scale(1) rotate(' + (Math.random() * 360) + 'deg)', opacity: 1, offset: 0.6 },
        { transform: 'translate(' + Math.cos(ang) * dist * 1.1 + 'px,' + (Math.sin(ang) * dist + 70) + 'px) scale(.8) rotate(' + (Math.random() * 540) + 'deg)', opacity: 0 }
      ], { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
    }
    setTimeout(function () { layer.remove(); }, 1800);
    buzz([20, 40, 20, 40, 60]);
  }

  root.MWStamp = { load: load, setIcons: setIcons, svg: svg, press: press, burst: burst, iconFor: iconFor };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.MWStamp;
})(typeof window !== 'undefined' ? window : globalThis);
