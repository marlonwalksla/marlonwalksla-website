/* ==============================================================================
 * FILE: nav-header.js
 * CATEGORY: MarlonWalksLA Website - Mobile Navigation Menu Toggle
 * ============================================================================== */

// Oct 26, 2026: mark the live domain so tour-pages.css can hide draft marks there (test site keeps them).
try { if (/^(www\.)?marlonwalksla\.com$/i.test(location.hostname)) document.documentElement.classList.add('mw-live'); } catch (e) {}

// Oct 26, 2026: the Private page is now /private-tour-los-angeles. Webflow's footer and the About page still link the older
// addresses (/private-tours and /private-tours-los-angeles), so point them at the new one on every page.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href]').forEach((a) => {
    const h = a.getAttribute('href');
    const m = h.match(/^((?:https?:\/\/(?:www\.)?marlonwalksla\.com)?)\/private-tours(?:-los-angeles)?(\/?(?:[?#].*)?)$/i);
    if (m) a.setAttribute('href', m[1] + '/private-tour-los-angeles' + m[2]);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navCollapse = document.querySelector('.nav-collapse-area');

  if (mobileToggle && navCollapse) {
    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navCollapse.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });

    // Close menu when tapping outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navCollapse.contains(e.target)) {
        navCollapse.classList.remove('active');
        mobileToggle.classList.remove('active');
      }
    });
  }
});

// Nov 3, 2026: passports in the header and footer, and the EN | ES switch on the two passport pages.
// ON everywhere since Nov 3, 2026 (Marlon said go). Set PP_NAV_LIVE to false to hide the passport links on marlonwalksla.com again.
(function () {
  var PP_NAV_LIVE = true;
  var live = /^(www\.)?marlonwalksla\.com$/i.test(location.hostname);
  if (live && !PP_NAV_LIVE) return;
  document.addEventListener('DOMContentLoaded', function () {
    var path = (location.pathname.replace(/\/+$/, '') || '/');
    var ES = document.documentElement.lang === 'es' || /^\/pasaportes$/.test(path) || /^\/es(\/|$)/.test(path);
    var href = ES ? '/pasaportes' : '/passports', label = ES ? 'Pasaportes' : 'Passports';
    // Header: after the Maps link
    var maps = document.querySelector('.mwhd-nav a[data-k="maps"]');
    if (maps && !document.querySelector('.mwhd-nav a[data-k="passports"]')) {
      var a = document.createElement('a');
      a.className = 'mwhd-link'; a.setAttribute('data-k', 'passports'); a.href = href; a.textContent = label;
      if (path === href) a.setAttribute('aria-current', 'page');
      maps.parentNode.insertBefore(a, maps.nextSibling);
    }
    // EN | ES switch on the two passport pages
    if (path === '/passports' || path === '/pasaportes') {
      var en = document.getElementById('mwhd-en'), es = document.getElementById('mwhd-es');
      var q = location.search.replace(/[?&]lang=[a-z]+/i, '').replace(/^&/, '?');
      if (en) { en.href = '/passports' + q; if (!ES) en.setAttribute('aria-current', 'true'); else en.removeAttribute('aria-current'); }
      if (es) { es.href = '/pasaportes' + q; if (ES) es.setAttribute('aria-current', 'true'); else es.removeAttribute('aria-current'); }
    }
    // Footer: after the Maps link in the footer
    var fm = Array.prototype.filter.call(document.querySelectorAll('a[href="/maps"], a[href="/mapa-los-angeles"]'), function (x) { return !x.closest('.mwhd'); })[0];
    [].forEach.call(document.querySelectorAll('a[data-pp-foot]'), function (x) { x.remove(); });
    if (fm) {
      var f = fm.cloneNode(false);
      f.setAttribute('data-pp-foot', '1'); f.href = href; f.textContent = label;
      // Own list item: another script copies the Maps item to make LA History, and would copy the link with it.
      var li = fm.parentNode;
      if (li && li.tagName === 'LI' && li.parentNode) {
        var nli = li.cloneNode(false); nli.appendChild(f); li.parentNode.insertBefore(nli, li.nextSibling);
      } else fm.parentNode.insertBefore(f, fm.nextSibling);
    }
  });
})();
