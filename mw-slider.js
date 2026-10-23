/* MarlonWalksLA shared photo slider (Oct 23, 2026). Pairs with mw-slider.css. See that file for the slide kinds.
 * Markup:  <div class="mws" data-mws aria-label="..." data-prev="Previous photo" data-next="Next photo" data-dot="Show photo {n}" [data-*-es for Spanish]>
 *            <div class="mws-stage"><figure class="mws-slide" data-cap="..." data-cap-es="...">...</figure>...</div></div>
 * The buttons, caption and dots are built here. Events (bubble from the .mws element): "mws:change" with detail {index, slide, root}.
 * API on the element: el.mws = { set(i), index(), count(), load(items) }. load() replaces the slides:
 *   items = [{src, alt, cap, pos, kind: "photo"|"raw"|"print"|"card", color, pf, key}]  (key is stored as data-key on the slide)
 * Everything inside a [data-mws] element starts by itself. "mws:ready" fires on window once the script is loaded. */
(function () {
  "use strict";
  if (window.MWS) return;
  var es = (document.documentElement.getAttribute("lang") || "").toLowerCase().indexOf("es") === 0 || /^\/es(\/|$)/.test(location.pathname);
  function at(el, name) { return (es && el.getAttribute(name + "-es")) || el.getAttribute(name) || ""; }

  function init(root) {
    if (root.mws) return;
    var stage = root.querySelector(".mws-stage"), slides = [], dots = [], i = -1, token = 0;
    var prev = document.createElement("button"), next = document.createElement("button"), cap = document.createElement("p"), dotBox = document.createElement("div");
    prev.type = next.type = "button"; prev.className = "mws-nav mws-prev"; next.className = "mws-nav mws-next";
    prev.innerHTML = "&lsaquo;"; next.innerHTML = "&rsaquo;";
    prev.setAttribute("aria-label", at(root, "data-prev") || "Previous"); next.setAttribute("aria-label", at(root, "data-next") || "Next");
    cap.className = "mws-cap"; cap.setAttribute("aria-live", "polite"); dotBox.className = "mws-dots";
    root.insertBefore(prev, stage); root.appendChild(next); root.appendChild(cap); root.appendChild(dotBox);
    root.setAttribute("role", "region"); root.setAttribute("aria-roledescription", "carousel"); root.tabIndex = 0;
    var lbl = at(root, "aria-label"); if (lbl) root.setAttribute("aria-label", lbl);

    function collect() {
      slides = [].slice.call(stage.querySelectorAll(".mws-slide"));
      slides.forEach(function (s) {
        var im = s.querySelector("img"), a = im && im.getAttribute("data-es");
        if (es && a) im.alt = a;
      });
      dotBox.innerHTML = ""; dots = slides.map(function (s, k) {
        var d = document.createElement("button"); d.type = "button"; d.className = "mws-dot";
        d.setAttribute("aria-label", (at(root, "data-dot") || "Show photo {n}").replace("{n}", k + 1));
        d.addEventListener("click", function () { set(k); }); dotBox.appendChild(d); return d;
      });
      var many = slides.length > 1; prev.hidden = next.hidden = dotBox.hidden = !many;
    }
    function paint(n) {
      i = n;
      slides.forEach(function (s, k) { s.classList.toggle("is-on", k === i); s.setAttribute("aria-hidden", k === i ? "false" : "true"); });
      dots.forEach(function (d, k) { if (k === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
      var s = slides[i]; cap.textContent = s ? at(s, "data-cap") : "";
      root.dispatchEvent(new CustomEvent("mws:change", { bubbles: true, detail: { index: i, slide: s || null, root: root } }));
      var nx = slides[(i + 1) % slides.length]; if (nx) { var im = nx.querySelector("img"); if (im && im.loading === "lazy") im.loading = "eager"; }
    }
    function set(n) {
      if (!slides.length) return;
      n = (n % slides.length + slides.length) % slides.length;
      var im = slides[n].querySelector("img"), my = ++token;
      if (im && !im.complete) {
        im.loading = "eager";
        var done = function () { if (my === token) paint(n); };
        im.addEventListener("load", done, { once: true }); im.addEventListener("error", done, { once: true }); setTimeout(done, 600);
      } else paint(n);
    }
    function load(items) {
      stage.innerHTML = "";
      (items.length ? items : [{ kind: "card", color: "#FFE08A", cap: "" }]).forEach(function (it, k) {
        var f = document.createElement("figure"), el, kind = it.kind || "photo";
        f.className = "mws-slide"; if (it.cap) f.setAttribute("data-cap", it.cap); if (it.key) f.setAttribute("data-key", it.key);
        if (kind === "card") { el = document.createElement("div"); el.className = "mws-fit mws-card"; el.style.background = it.color || "#FFE08A"; el.textContent = it.cap || ""; f.appendChild(el); }
        else {
          var im = new Image(); im.alt = it.alt || it.cap || ""; im.src = it.src; if (k > 0) im.loading = "lazy"; if (it.pos) im.style.objectPosition = it.pos;
          if (kind === "print") { el = document.createElement("div"); el.className = "mws-fit mws-print"; if (it.pf) el.style.setProperty("--pf", it.pf); el.appendChild(im); }
          else { im.className = "mws-fit mws-" + kind; el = im; }
          f.appendChild(el);
        }
        stage.appendChild(f);
      });
      collect(); i = -1; set(0);
    }
    prev.addEventListener("click", function () { set(i - 1); });
    next.addEventListener("click", function () { set(i + 1); });
    root.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") set(i - 1); else if (e.key === "ArrowRight") set(i + 1); });
    var x0 = null, y0 = null;
    root.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) set(i + (dx < 0 ? 1 : -1));
    }, { passive: true });
    root.mws = { set: set, index: function () { return i; }, count: function () { return slides.length; }, load: load };
    if (stage.querySelector(".mws-slide")) { collect(); set(0); }
  }

  function boot() { [].slice.call(document.querySelectorAll("[data-mws]")).forEach(init); }
  /* Keeps a quote box the same height for every quote, so the page below it never jumps when the photo changes.
   * MWS.lockQuote(blockquoteEl, ["quote one", "quote two", ...]) measures the tallest and re-measures when the width changes. */
  function lockQuote(bq, texts) {
    if (!bq || !texts || !texts.length) return;
    function run() {
      var keep = bq.textContent; bq.style.minHeight = "0"; var m = 0;
      texts.forEach(function (x) { bq.textContent = "\u201C" + x + "\u201D"; m = Math.max(m, bq.offsetHeight); });
      bq.textContent = keep; bq.style.minHeight = m + "px";
    }
    var tm; function later() { clearTimeout(tm); tm = setTimeout(run, 150); }
    run(); window.addEventListener("resize", later); window.addEventListener("load", later);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(later);
  }
  window.MWS = { init: init, boot: boot, lockQuote: lockQuote };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { boot(); window.dispatchEvent(new Event("mws:ready")); });
  else { boot(); window.dispatchEvent(new Event("mws:ready")); }
})();
