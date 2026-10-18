# Builds home-routebreak.html (EN) and home-routebreak-es.html (ES): the "LA Recommendations Map" banner
# between the Team and Private sections on Home and /es (Oct 17, 2026, Marlon, from his sketch).
# Headline, two short lines, one button to /maps, and Ernesto standing on the right pointing at the text and button.
# No embedded map (Marlon's sketch replaced Gemini's "import the Team page map" idea). Paper crease on the top and bottom edges.
# MASCOT_URL: Marlon mentioned "Taco Ernesto", but that file is not in Webflow yet and the style sheet lists it as "fix first"
# ("I love acos" typo). The approved Pointing (Left) Ernesto is used until the fixed one is uploaded. Swap MASCOT_URL to change it.
CDN = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
MASCOT_URL = CDN + "6a87cf6d715b4e53c40aaf8d_Pointing%20(Left).avif"
T = {
 "en": dict(title="LA Recommendations Map", l1="Don't know where to go? Need ideas?", l2="Food, shopping and more, all on one map.",
            cta="Explore the Map", cta_href="/maps"),
 "es": dict(title="Mapa de recomendaciones de LA", l1="&iquest;No sabes ad&oacute;nde ir? &iquest;Necesitas ideas?", l2="Comida, compras y m&aacute;s, todo en un mapa.",
            cta="Explora el mapa", cta_href="/maps?lang=es"),
}
CSS = """<style>
  .rm { position: relative; width: 100%; box-sizing: border-box; padding: 44px 20px 40px; background: #FFF1C9; color: #27302E; font-family: "Nunito", system-ui, sans-serif; overflow: hidden; }
  .rm *, .rm *::before { box-sizing: border-box; }
  .rm::before { content: ""; display: block; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(39,48,46,.22) 0, rgba(39,48,46,.22) 1px, rgba(255,255,255,.7) 1px, rgba(255,255,255,.7) 3px, rgba(39,48,46,.10) 3px, rgba(39,48,46,0) 14px) top / 100% 14px no-repeat, linear-gradient(to top, rgba(39,48,46,.22) 0, rgba(39,48,46,.22) 1px, rgba(255,255,255,.7) 1px, rgba(255,255,255,.7) 3px, rgba(39,48,46,.10) 3px, rgba(39,48,46,0) 14px) bottom / 100% 14px no-repeat; pointer-events: none; z-index: 3; }
  .rm > * { position: relative; z-index: 2; }
  .rm-wrap { max-width: 820px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 12px 28px; }
  .rm-text { flex: 0 1 auto; }
  .rm-title { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: clamp(2.1rem, 4.6vw, 3.2rem); line-height: 1.02; margin: 0 0 12px; color: #27302E; }
  .rm-line { margin: 0 0 4px; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 1.15rem; line-height: 1.4; color: #3B4440; }
  .rm-cta { display: inline-block; margin-top: 16px; font-family: "Lilita One", sans-serif; font-size: 1.25rem; letter-spacing: 0.01em; line-height: 1.2; color: #27302E !important; text-decoration: none !important; background: #FFD43B; border: 2.5px solid #27302E; border-radius: 999px; padding: 13px 28px; min-height: 48px; box-shadow: 4px 4px 0 #27302E; transition: transform 0.18s ease-out, box-shadow 0.18s ease-out; }
  .rm-cta:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #27302E; }
  .rm-cta:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #27302E; }
  .rm-cta:focus-visible { outline: 3px solid #2890B6; outline-offset: 4px; }
  .rm-mascot { flex: none; height: 190px; width: auto; display: block; pointer-events: none; }
  @media (prefers-reduced-motion: reduce) { .rm-cta { transition: none; } }
  @media (max-width: 640px) { .rm { padding: 34px 20px 30px; } .rm-wrap { flex-direction: column; align-items: flex-start; } .rm-mascot { height: 150px; align-self: flex-end; margin-top: -70px; } }
</style>
"""
for lang, name in (("en", "home-routebreak.html"), ("es", "home-routebreak-es.html")):
    t = T[lang]
    html = (f"<!-- MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: LA RECOMMENDATIONS MAP banner. Built by page-embeds/build_home_routebreak.py. Oct 17, 2026 (Marlon's sketch): text, one button to /maps, Ernesto pointing. -->\n"
            f"<section class=\"rm\" aria-label=\"{t['title']}\">\n  <div class=\"rm-wrap\">\n    <div class=\"rm-text\">\n"
            f"      <h2 class=\"rm-title\">{t['title']}</h2>\n      <p class=\"rm-line\">{t['l1']}</p>\n      <p class=\"rm-line\">{t['l2']}</p>\n"
            f"      <a class=\"rm-cta\" href=\"{t['cta_href']}\">{t['cta']}</a>\n    </div>\n"
            f"    <img class=\"rm-mascot\" src=\"{MASCOT_URL}\" alt=\"\" aria-hidden=\"true\" loading=\"lazy\">\n  </div>\n</section>\n" + CSS)
    open(name, "w", encoding="utf-8").write(html); print("wrote", name)
