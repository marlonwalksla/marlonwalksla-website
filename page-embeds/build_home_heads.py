# Builds the section header banners on Home (/) and /es for the Team and Private sections.
# Oct 16, 2026: same look as the free tour banner (Ernesto beside an eyebrow, title and one line).
C = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
ERN = {"team": C + "6a87ce800a9b9169f06d40de_Polaroid%20Photographer.avif",
       "priv": C + "6a87cf628c921f7de316043f_Hiking.avif"}
T = {
 ("team", "en"): ("Team Tours", "Explore DTLA as a Team",
   "Get your team out of the office for fresh air, real conversation and LA history, with lunch at Grand Central Market and the Ernesto photo competition.",
   "Ernesto with his Polaroid camera"),
 ("team", "es"): ("Tours de equipo", "Explora DTLA en equipo",
   "Saca a tu equipo de la oficina: aire libre, buena conversaci&oacute;n e historia de LA, con almuerzo en Grand Central Market y el concurso de fotos de Ernesto.",
   "Ernesto con su c&aacute;mara Polaroid"),
 ("priv", "en"): ("Private Tours", "LA, Your Way",
   "Marlon picks you up, does the driving and plans the day around you: the Hollywood Sign, Griffith Observatory, the best views and the spots locals love.",
   "Ernesto ready for a hike"),
 ("priv", "es"): ("Tours privados", "LA a tu manera",
   "Marlon te recoge, maneja y arma el d&iacute;a a tu medida: el letrero de Hollywood, el Observatorio Griffith, las mejores vistas y los lugares favoritos de los locales.",
   "Ernesto listo para una caminata"),
}
CSS = """<style>
  .mwsh { display: grid; grid-template-columns: 130px minmax(0, 1fr); gap: 24px; align-items: center; max-width: 860px; margin: 0 auto 30px; padding-top: 28px; scroll-margin-top: 70px; font-family: "Nunito", system-ui, sans-serif; }
  .mwsh.is-right { grid-template-columns: minmax(0, 1fr) 130px; }
  .mwsh.is-right .mwsh-ern { order: 2; }
  .mwsh-ern { width: 130px; height: auto; max-height: 190px; object-fit: contain; display: block; }
  .mwsh-eyebrow { display: inline-block; font-family: "Fredoka", sans-serif; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #27302E; background: #ffffff; border: 2px solid #27302E; padding: 5px 14px; border-radius: 50px; margin-bottom: 10px; }
  .mwsh-title { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: clamp(1.9rem, 4vw, 2.8rem); line-height: 1.1; color: #27302E; margin: 0 0 8px; }
  .mwsh-sub { font-size: 1.05rem; line-height: 1.55; color: #3B4440; margin: 0; max-width: 60ch; }
  @media (max-width: 900px) {
    .mwsh, .mwsh.is-right { grid-template-columns: 1fr; text-align: center; gap: 8px; }
    .mwsh.is-right .mwsh-ern { order: 0; }
    .mwsh-ern { width: 92px; max-height: 130px; margin: 0 auto; }
    .mwsh-sub { margin: 0 auto; }
  }
</style>"""
for (sec, lang), (eb, title, sub, alt) in T.items():
    side = " is-right" if sec == "priv" else ""
    html = f"""<!-- MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: {'TEAM' if sec == 'team' else 'PRIVATE'} SECTION BANNER. Built by page-embeds/build_home_heads.py.
     Sits above the two-column layout, same look as the free tour banner. -->
<div class="mwsh{side}" id="{'team' if sec == 'team' else 'private'}">
  <img class="mwsh-ern" src="{ERN[sec]}" alt="{alt}" loading="lazy">
  <div>
    <span class="mwsh-eyebrow">{eb}</span>
    <h2 class="mwsh-title">{title}</h2>
    <p class="mwsh-sub">{sub}</p>
  </div>
</div>
{CSS}
"""
    open(f"home-head-{sec}-{lang}.html", "w", encoding="utf-8").write(html)
    print("wrote", f"home-head-{sec}-{lang}.html")
