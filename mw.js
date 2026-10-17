/* MarlonWalksLA section loader (loader-v1)
 *
 * Each Webflow HTML embed holds ONE line:
 *   <script src="https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@loader-v1/mw.js" data-s="home-hero"></script>
 * This script fetches page-embeds/<data-s>.html from this repo and puts it
 * exactly where the script tag sits, so the page looks the same as if the
 * code were pasted into the embed.
 *
 * Which branch it reads:
 *   marlonwalksla.com / www.marlonwalksla.com  -> "live" (changes only when Marlon approves)
 *   everything else (webflow.io, Designer)     -> "test"
 *   Add ?mw=live or ?mw=test to a non-live address to preview the other branch.
 *
 * It uses a synchronous request on purpose: the section appears in place,
 * before the browser keeps parsing, and its scripts run in the same order as
 * before. This file is tagged (loader-v1) so it never changes by accident.
 */
(function () {
  'use strict';
  var s = document.currentScript;
  if (!s) return;
  var name = s.getAttribute('data-s') || '';
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    console.error('[mw] bad section name:', name);
    return;
  }
  var prod = /^(www\.)?marlonwalksla\.com$/i.test(location.hostname);
  var ref = prod ? 'live' : 'test';
  if (!prod) {
    var m = /[?&]mw=(live|test)(&|$)/.exec(location.search);
    if (m) ref = m[1];
  }
  // Short cache-busting window: 1 min on test, 10 min on the live domain.
  var bucket = Math.floor(Date.now() / (prod ? 600000 : 60000));
  var path = 'page-embeds/' + name + '.html?v=' + bucket;
  var repo = 'marlonwalksla/marlonwalksla-website';
  var urls = [
    'https://cdn.jsdelivr.net/gh/' + repo + '@' + ref + '/' + path,
    'https://raw.githubusercontent.com/' + repo + '/' + ref + '/' + path
  ];

  function put(html) {
    var p = s.parentNode;
    if (!p) return;
    var r = document.createRange();
    r.setStartBefore(s);
    p.insertBefore(r.createContextualFragment(html), s);
    p.removeChild(s);
  }

  function fail(why) {
    console.error('[mw] could not load section "' + name + '" (' + ref + '):', why);
    s.setAttribute('data-mw-failed', '1');
  }

  function viaFetch(i) {
    if (i >= urls.length) return fail('all sources failed');
    fetch(urls[i], { cache: 'no-cache' })
      .then(function (res) { if (!res.ok) throw new Error(res.status); return res.text(); })
      .then(put)
      .catch(function () { viaFetch(i + 1); });
  }

  for (var i = 0; i < urls.length; i++) {
    try {
      var x = new XMLHttpRequest();
      x.open('GET', urls[i], false);
      if (x.overrideMimeType) x.overrideMimeType('text/html; charset=utf-8');
      x.send(null);
      if (x.status >= 200 && x.status < 300 && x.responseText) {
        put(x.responseText);
        return;
      }
    } catch (e) {
      // Synchronous request blocked or network error: use the async fallback.
      return viaFetch(i);
    }
  }
  fail('no source answered');
})();
