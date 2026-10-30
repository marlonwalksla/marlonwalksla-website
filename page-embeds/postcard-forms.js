/* Oct 17, 2026 (Marlon): Ernesto stands on the LEFT of the send button of each inquiry form: he takes you there.
   The forms are native Webflow forms, so the button is wrapped here instead of being edited in the Designer. */
(function () {
  var ERN = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/6ae436f5cb91c1dbb4ea1298_Tour%20Guide%20541%20x%20800.avif";
  function wrap() {
    document.querySelectorAll(".mw-form-card .mw-form-submit").forEach(function (b) {
      if (b.parentNode.classList.contains("pc-cta")) return;
      var w = document.createElement("div"); w.className = "pc-cta";
      b.parentNode.insertBefore(w, b);
      var i = document.createElement("img"); i.className = "pc-cta-ern"; i.src = ERN; i.alt = ""; i.setAttribute("aria-hidden", "true"); i.loading = "lazy";
      w.appendChild(i); w.appendChild(b);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wrap); else wrap();
})();
