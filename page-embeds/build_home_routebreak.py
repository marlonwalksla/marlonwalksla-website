# Builds home-routebreak.html (EN) and home-routebreak-es.html (ES): the "See the Route" banner
# between the Team and Private sections on Home and /es (Oct 17, 2026, Marlon via Gemini).
# A static line-art sketch of the sample team day (stops from route-team-dtla.json). Not to scale.
import json
STOPS = [("Walt Disney Concert Hall", 34.0556, -118.2493), ("Angels Flight", 34.0513, -118.2504),
         ("Grand Central Market", 34.0509, -118.2491), ("Bradbury Building", 34.0505, -118.2478),
         ("City Hall", 34.0537, -118.2427), ("Olvera Street", 34.0574, -118.2381)]
T = {
 "en": dict(title="See the Route", sub="A sample team day, all on foot. Six of the stops, not to scale.",
            cta="Build Your Own LA Itinerary", cta_href="/maps", more="See the full schedule", href="/team-building-walking-tour-los-angeles", alt="Line-art sketch of the sample team route through Downtown LA, six numbered stops from Walt Disney Concert Hall to Olvera Street"),
 "es": dict(title="Mira la ruta", sub="Un d&iacute;a de equipo de ejemplo, todo a pie. Seis de las paradas, sin escala.",
            cta="Arma tu propio itinerario en LA", cta_href="/maps?lang=es", more="Ver el itinerario completo", href="/team-building-walking-tour-los-angeles", alt="Dibujo de la ruta de ejemplo para equipos por el centro de LA, seis paradas numeradas desde Walt Disney Concert Hall hasta la Calle Olvera"),
}
W, H = 640, 150
lngs = [s[2] for s in STOPS]; lats = [s[1] for s in STOPS]
def xy(s):
    x = 50 + (s[2] - min(lngs)) / (max(lngs) - min(lngs)) * (W - 100)
    y = 24 + (max(lats) - s[1]) / (max(lats) - min(lats)) * (H - 48)
    return x, y
P = [xy(s) for s in STOPS]
d = "M%.1f %.1f" % P[0]
for i in range(1, len(P)):
    (x0, y0), (x1, y1) = P[i-1], P[i]
    mx = (x0 + x1) / 2
    d += " C%.1f %.1f %.1f %.1f %.1f %.1f" % (mx, y0, mx, y1, x1, y1)
streets = "".join(f"<path d='M{a} {b}L{c} {e}' />" for a, b, c, e in
    [(0, 40, 640, 28), (0, 98, 640, 118), (70, 0, 100, 150), (230, 0, 214, 150), (390, 0, 410, 150), (540, 0, 520, 150), (0, 70, 640, 76)])
dots = "".join(
    f"<g><circle cx='{x:.1f}' cy='{y:.1f}' r='13' fill='#FFD43B' stroke='#27302E' stroke-width='2.5'/>"
    f"<text x='{x:.1f}' y='{y+5:.1f}' text-anchor='middle' font-family='Lilita One, sans-serif' font-size='15' fill='#27302E'>{i+1}</text></g>"
    for i, (x, y) in enumerate(P))
svg = (f"<svg class='rm-svg' viewBox='0 0 {W} {H}' role='img' aria-label='__ALT__' xmlns='http://www.w3.org/2000/svg'>"
       f"<g stroke='#27302E' stroke-opacity='.12' stroke-width='9' stroke-linecap='round' fill='none'>{streets}</g>"
       f"<path d='{d}' fill='none' stroke='#2890B6' stroke-width='4' stroke-dasharray='2 10' stroke-linecap='round'/>{dots}</svg>")
CSS = """<style>
  .rm { position: relative; width: 100%; box-sizing: border-box; padding: 40px 20px; background-color: #FFF6E6; background-image: linear-gradient(#F1E4CB 1px, transparent 1px), linear-gradient(90deg, #F1E4CB 1px, transparent 1px); background-size: 26px 26px; color: #27302E; font-family: "Nunito", system-ui, sans-serif; }
  .rm *, .rm *::before { box-sizing: border-box; }
  .rm::before { content: ""; display: block; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(39,48,46,.22) 0, rgba(39,48,46,.22) 1px, rgba(255,255,255,.7) 1px, rgba(255,255,255,.7) 3px, rgba(39,48,46,.10) 3px, rgba(39,48,46,0) 14px) top / 100% 14px no-repeat, linear-gradient(to top, rgba(39,48,46,.22) 0, rgba(39,48,46,.22) 1px, rgba(255,255,255,.7) 1px, rgba(255,255,255,.7) 3px, rgba(39,48,46,.10) 3px, rgba(39,48,46,0) 14px) bottom / 100% 14px no-repeat; pointer-events: none; z-index: 3; transform: none; border: 0; outline: 0; box-shadow: none; width: auto; height: auto; }
  .rm > * { position: relative; z-index: 2; }
  .rm-wrap { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 20px 48px; align-items: center; }
  .rm-title { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: clamp(2.2rem, 5vw, 3.4rem); line-height: 1; margin: 0 0 10px; color: #27302E; }
  .rm-sub { margin: 0 0 12px; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 1.05rem; line-height: 1.4; color: #3B4440; max-width: 34ch; }
  .rm-cta { display: inline-block; margin: 4px 0 6px; font-family: "Lilita One", sans-serif; font-size: 1.2rem; letter-spacing: 0.01em; line-height: 1.2; color: #27302E !important; text-decoration: none !important; background: #FFD43B; border: 2.5px solid #27302E; border-radius: 999px; padding: 12px 24px; min-height: 44px; box-shadow: 4px 4px 0 #27302E; transition: transform 0.18s ease-out, box-shadow 0.18s ease-out; }
  .rm-cta:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #27302E; }
  .rm-cta:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #27302E; }
  .rm-cta:focus-visible { outline: 3px solid #2890B6; outline-offset: 4px; }
  @media (prefers-reduced-motion: reduce) { .rm-cta { transition: none; } }
  .rm-more { font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1rem; color: #1B6688 !important; text-decoration: underline !important; text-underline-offset: 3px; display: inline-block; padding: 8px 0; }
  .rm-more:hover { color: #27302E !important; }
  .rm-map { background: #fff; border: 2.5px solid #27302E; border-radius: 16px; box-shadow: 4px 4px 0 #27302E; padding: 10px 12px 12px; }
  .rm-svg { display: block; width: 100%; height: auto; }
  .rm-list { list-style: none; counter-reset: s; margin: 6px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px 14px; }
  .rm-list li { counter-increment: s; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.88rem; color: #3B4440; }
  .rm-list li::before { content: counter(s) "."; font-weight: 600; color: #1B6688; margin-right: 4px; }
  @media (max-width: 820px) { .rm { padding: 30px 16px; } .rm-wrap { grid-template-columns: 1fr; } }
</style>
"""
for lang, name in (("en", "home-routebreak.html"), ("es", "home-routebreak-es.html")):
    t = T[lang]
    items = "".join(f"<li>{n}</li>" for n, _, _ in STOPS)
    html = (f"<!-- MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: SEE THE ROUTE banner. Built by page-embeds/build_home_routebreak.py. Oct 17, 2026 (Marlon via Gemini): sits between Team and Private; static line art, no live map. -->\n"
            f"<section class=\"rm\" aria-label=\"{t['title']}\">\n  <div class=\"rm-wrap\">\n    <div>\n      <h2 class=\"rm-title\">{t['title']}</h2>\n      <p class=\"rm-sub\">{t['sub']}</p>\n"
            f"      <a class=\"rm-cta\" href=\"{t['cta_href']}\">{t['cta']}</a><br>\n"
            f"      <a class=\"rm-more\" href=\"{t['href']}\">{t['more']} &rarr;</a>\n    </div>\n"
            f"    <div class=\"rm-map\">{svg.replace('__ALT__', t['alt'])}<ol class=\"rm-list\">{items}</ol></div>\n  </div>\n</section>\n" + CSS)
    open(name, "w", encoding="utf-8").write(html); print("wrote", name)
