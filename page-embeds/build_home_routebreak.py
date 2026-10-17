# Builds home-routebreak.html (EN) and home-routebreak-es.html (ES): the "LA Recommendations Map" banner
# between the Team and Private sections on Home and /es (Oct 17, 2026, Marlon via Gemini, round 8 chunk 2).
# Uses the same animated route map as the Team page (route-anim.js: map with Ernesto on the left, stacked numbered stops on the right),
# a "Build Your Own LA Itinerary" button to /maps, and Ernesto pointing at the button.
# MASCOT_URL: Marlon asked for "Taco Ernesto", but that file is not in Webflow yet and the style sheet lists it as "fix first"
# ("I love acos" typo). Until he uploads the fixed one, the approved Pointing (Left) Ernesto is used. Swap MASCOT_URL to change it.
import json
CDN = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
MASCOT_URL = CDN + "6a87cf6d715b4e53c40aaf8d_Pointing%20(Left).avif"
TOUR_GUIDE = CDN + "6a87ce84d9af8f7c9bf12030_Tour%20Guide.avif"
RA = json.dumps(json.load(open("route-team-ra.json")), ensure_ascii=False).replace("</", "<\\/")
T = {
 "en": dict(title="LA Recommendations Map", sub="Tap a stop and Ernesto walks there. Explore a sample day, then build your own.",
            cta="Build Your Own LA Itinerary", cta_href="/maps", alt="Ernesto pointing at the button", label="Sample team day route map"),
 "es": dict(title="Mapa de recomendaciones de LA", sub="Toca una parada y Ernesto camina hasta all&iacute;. Explora un d&iacute;a de ejemplo y arma el tuyo.",
            cta="Arma tu propio itinerario en LA", cta_href="/maps?lang=es", alt="Ernesto se&ntilde;alando el bot&oacute;n", label="Mapa de la ruta de ejemplo para equipos"),
}
CSS = """<style>
  .rm { position: relative; width: 100%; box-sizing: border-box; padding: 40px 20px; background-color: #FFF6E6; background-image: linear-gradient(#F1E4CB 1px, transparent 1px), linear-gradient(90deg, #F1E4CB 1px, transparent 1px); background-size: 26px 26px; color: #27302E; font-family: "Nunito", system-ui, sans-serif; }
  .rm *, .rm *::before { box-sizing: border-box; }
  .rm::before { content: ""; display: block; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(39,48,46,.22) 0, rgba(39,48,46,.22) 1px, rgba(255,255,255,.7) 1px, rgba(255,255,255,.7) 3px, rgba(39,48,46,.10) 3px, rgba(39,48,46,0) 14px) top / 100% 14px no-repeat, linear-gradient(to top, rgba(39,48,46,.22) 0, rgba(39,48,46,.22) 1px, rgba(255,255,255,.7) 1px, rgba(255,255,255,.7) 3px, rgba(39,48,46,.10) 3px, rgba(39,48,46,0) 14px) bottom / 100% 14px no-repeat; pointer-events: none; z-index: 3; }
  .rm > * { position: relative; z-index: 2; }
  .rm-wrap { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 0.75fr 1.25fr; gap: 20px 40px; align-items: center; }
  .rm-title { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: clamp(2.1rem, 4.6vw, 3.2rem); line-height: 1; margin: 0 0 10px; color: #27302E; }
  .rm-sub { margin: 0 0 14px; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 1.05rem; line-height: 1.4; color: #3B4440; max-width: 34ch; }
  .rm-ctarow { display: flex; align-items: flex-end; gap: 0; margin-top: 6px; }
  .rm-cta { display: inline-block; flex: 0 1 auto; font-family: "Lilita One", sans-serif; font-size: 1.2rem; letter-spacing: 0.01em; line-height: 1.2; color: #27302E !important; text-decoration: none !important; background: #FFD43B; border: 2.5px solid #27302E; border-radius: 999px; padding: 12px 22px; min-height: 48px; box-shadow: 4px 4px 0 #27302E; transition: transform 0.18s ease-out, box-shadow 0.18s ease-out; margin-bottom: 8px; position: relative; z-index: 1; }
  .rm-cta:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #27302E; }
  .rm-cta:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #27302E; }
  .rm-cta:focus-visible { outline: 3px solid #2890B6; outline-offset: 4px; }
  .rm-mascot { flex: none; height: 118px; width: auto; margin-left: -14px; position: relative; z-index: 2; pointer-events: none; }
  @media (prefers-reduced-motion: reduce) { .rm-cta { transition: none; } }
  .rm-map { min-width: 0; background: #fff; border: 2.5px solid #27302E; border-radius: 16px; box-shadow: 4px 4px 0 #27302E; padding: 10px 12px 12px; }
  @media (max-width: 820px) { .rm { padding: 30px 16px; } .rm-wrap { grid-template-columns: 1fr; } .rm-mascot { height: 100px; } }
</style>
"""
LOADER = """<script>
(function () {
  var B = "https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@main/";
  if (!document.querySelector('link[href*="route-anim.css"]')) { var l = document.createElement("link"); l.rel = "stylesheet"; l.href = B + "route-anim.css?v=1"; document.head.appendChild(l); }
  function go() { if (window.MWRouteAnim) { if (!document.querySelector(".rm .ra-wrap")) window.MWRouteAnim.init(); } }
  if (window.MWRouteAnim) { go(); return; }
  var s = document.createElement("script"); s.src = B + "route-anim.js?v=1"; s.onload = go; document.head.appendChild(s);
})();
</script>
"""
for lang, name in (("en", "home-routebreak.html"), ("es", "home-routebreak-es.html")):
    t = T[lang]
    html = (f"<!-- MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: LA RECOMMENDATIONS MAP banner. Built by page-embeds/build_home_routebreak.py. Oct 17, 2026 (Marlon via Gemini): sits between Team and Private; same route map as the Team page. -->\n"
            f"<section class=\"rm\" aria-label=\"{t['title']}\">\n  <div class=\"rm-wrap\">\n    <div>\n      <h2 class=\"rm-title\">{t['title']}</h2>\n      <p class=\"rm-sub\">{t['sub']}</p>\n"
            f"      <div class=\"rm-ctarow\"><a class=\"rm-cta\" href=\"{t['cta_href']}\">{t['cta']}</a><img class=\"rm-mascot\" src=\"{MASCOT_URL}\" alt=\"\" aria-hidden=\"true\" loading=\"lazy\"></div>\n    </div>\n"
            f"    <div class=\"rm-map\"><div class=\"ra\" data-label=\"{t['label']}\" data-compact data-ernesto=\"{TOUR_GUIDE}\"><script type=\"application/json\" class=\"ra-data\">{RA}</script></div></div>\n  </div>\n</section>\n" + CSS + LOADER)
    open(name, "w", encoding="utf-8").write(html); print("wrote", name)
