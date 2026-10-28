/* Route pages: "Collect these stamps" row (Oct 28, 2026).
 * Reads data-stop-key from each CMS stop row on the page, looks the keys up in passport-collections.json
 * and shows one chip per passport that contains at least one of the stops. No counts, no saved state:
 * a stamp is only earned by going, so this row just points at the passports. Safe on any page without
 * [data-stop-key] rows (it does nothing).
 * Stamp key = a spot slug from spots.geojson, or the stamp id for places that are not map pins.
 */
(function () {
  var rows = [].slice.call(document.querySelectorAll('[data-stop-key]'));
  if (!rows.length) return;
  var keys = {};
  rows.forEach(function (r) { var k = (r.getAttribute('data-stop-key') || '').trim(); if (k) keys[k] = 1; });
  if (!Object.keys(keys).length) return;

  var isEs = (document.documentElement.lang || '').toLowerCase().indexOf('es') === 0;
  var host = document.querySelector('.route-visual');
  if (!host || !host.parentNode) return;

  var url = 'https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@main/passport-collections.json';
  fetch(url).then(function (r) { return r.json(); }).then(function (data) {
    var hits = (data.collections || []).filter(function (c) {
      return (c.stamps || []).some(function (s) { return keys[s.spot || s.id]; });
    });
    if (!hits.length) return;
    // Downtown Classic first (it is the passport this route was made for), then the rest as listed.
    hits.sort(function (a, b) { return (b.id === 'downtown-classic') - (a.id === 'downtown-classic'); });

    function href(c) {
      if (c.id === 'downtown-classic') return '/free-tour-passport' + (isEs ? '?lang=es' : '');
      return (isEs ? '/mapa-los-angeles' : '/maps') + '?passport=' + encodeURIComponent(c.id) + (isEs ? '&lang=es' : '');
    }

    var wrap = document.createElement('div');
    wrap.className = 'rp';
    var h = document.createElement('p');
    h.className = 'rp-title';
    h.textContent = isEs ? 'Colecciona estos sellos' : 'Collect these stamps';
    var sub = document.createElement('p');
    sub.className = 'rp-sub';
    sub.textContent = isEs
      ? 'Cada parada cuenta en tu pasaporte. Sella cada una cuando llegues.'
      : 'Each stop counts in your passport. Stamp each one when you get there.';
    var list = document.createElement('div');
    list.className = 'rp-list';
    hits.forEach(function (c) {
      var a = document.createElement('a');
      a.className = 'rp-chip';
      a.href = href(c);
      a.style.setProperty('--ink', c.ink || '#27302E');
      var n = (c.name && (isEs ? c.name.es : c.name.en)) || c.id;
      a.textContent = n;
      list.appendChild(a);
    });
    wrap.appendChild(h); wrap.appendChild(sub); wrap.appendChild(list);
    host.parentNode.insertBefore(wrap, host.nextSibling);
  }).catch(function () {});
})();
