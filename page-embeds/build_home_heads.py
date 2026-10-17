# Builds the section header banners on Home (/) and /es for the Team and Private sections.
# Oct 16, 2026: same look as the free tour banner (Ernesto beside an eyebrow, title and one line).
C = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
ERN = {"team": C + "6a87ce800a9b9169f06d40de_Polaroid%20Photographer.avif",
       "priv": C + "6a87cf628c921f7de316043f_Hiking.avif"}
T = {
 ("team", "en"): ("Team Tours", "Celebrate Your Team",
   "Walk Downtown LA, share lunch at Grand Central Market, and take home photos of your favorite people.",
   "Ernesto with his Polaroid camera"),
 ("team", "es"): ("Tours de equipo", "Celebra a tu equipo",
   "Recorre el centro de LA, almuerza en Grand Central Market y ll&eacute;vate fotos de tu gente favorita.",
   "Ernesto con su c&aacute;mara Polaroid"),
 ("priv", "en"): ("Private Tours", "LA, Your Way",
   "Marlon does the driving and plans the day around you: the Hollywood Sign, Griffith Observatory, the beach and the spots locals love.",
   "Ernesto ready for a hike"),
 ("priv", "es"): ("Tours privados", "LA a tu manera",
   "Marlon maneja y arma el d&iacute;a a tu medida: el letrero de Hollywood, el Observatorio Griffith, la playa y los lugares favoritos de los locales.",
   "Ernesto listo para una caminata"),
}
CSS = """<style>
  .mwsh { display: grid; grid-template-columns: 130px minmax(0, 1fr) auto; gap: 24px; align-items: center; max-width: 1060px; margin: 0 auto 30px; padding-top: 28px; scroll-margin-top: 70px; font-family: "Nunito", system-ui, sans-serif; }
  .mwsh.is-right { grid-template-columns: minmax(0, 1fr) 130px; }
  .mwsh.is-right .mwsh-ern { order: 2; }
  .mwsh-ern { width: 130px; height: auto; max-height: 190px; object-fit: contain; display: block; }
  .mwsh-eyebrow { display: inline-block; font-family: "Fredoka", sans-serif; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #27302E; background: #ffffff; border: 2px solid #27302E; padding: 5px 14px; border-radius: 50px; margin-bottom: 10px; }
  .mwsh-title { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: clamp(1.9rem, 4vw, 2.8rem); line-height: 1.1; color: #27302E; margin: 0 0 8px; }
  .mwsh-sub { font-size: 1.05rem; line-height: 1.55; color: #3B4440; margin: 0; max-width: 60ch; }
  @media (max-width: 900px) {
    .mwsh, .mwsh.is-right { grid-template-columns: 1fr; text-align: center; gap: 8px; }
    .mwsh .pc-slot { justify-self: center; }
    .mwsh.is-right .mwsh-ern { order: 0; }
    .mwsh-ern { width: 92px; max-height: 130px; margin: 0 auto; }
    .mwsh-sub { margin: 0 auto; }
  }
</style>"""
# Oct 16, 2026: tighter Team section. The banner sat 86px above the cards (30px margin + 56px split padding)
# and the calendar card was pushed 48px lower than the left column (leftover room for Ernesto).
TEAM_CSS = """<style>
  /* Team section spacing (Home and /es) */
  #team.mwsh { margin-bottom: 0; }
  #team-split { padding-top: 28px; padding-bottom: 40px; grid-column-gap: 28px; grid-row-gap: 24px; }
  #team-split .mw-offer { padding-top: 0; }
  #team-split .private-specs-grid { margin-bottom: 16px; padding: 16px 18px; }
  #team-split .mw-route { margin-top: 0; }
  #team-split .mw-offer-links { margin-top: 10px; gap: 4px 22px; }
  @media (max-width: 991px) { #team-split { padding-top: 20px; padding-bottom: 32px; } }
</style>
"""
# Oct 17, 2026 (late): postcard backs. "From" = return address, "To" = the meeting place, slot = postmark or the Polaroid stamps
FROM = {"en": "From: Marlon &middot; MarlonWalksLA, Los Angeles", "es": "De: Marlon &middot; MarlonWalksLA, Los &Aacute;ngeles"}
TO = {("team", "en"): ("To:", "your team &middot; Grand Central Market, 317 S Broadway"),
      ("team", "es"): ("Para:", "tu equipo &middot; Grand Central Market, 317 S Broadway"),
      ("priv", "en"): ("To:", "you &middot; anywhere in LA, I pick you up"),
      ("priv", "es"): ("Para:", "ti &middot; cualquier parte de LA, yo te recojo")}
PM = {"en": ("LOS ANGELES", "CA"), "es": ("LOS &Aacute;NGELES", "CA")}
# Oct 16, 2026: who the team walk is for (celebration angle)
CHIPS = {("team", "en"): ["Birthdays", "Product launches", "Company offsites"],
         ("team", "es"): ["Cumplea&ntilde;os", "Lanzamientos", "Retiros de empresa"]}
CHIP_CSS = """<style>
  .mwsh-chips { list-style: none; display: flex; flex-wrap: wrap; gap: 6px 8px; margin: 12px 0 0; padding: 0; }
  .mwsh-chips li { font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.88rem; color: #27302E; background: #FFF6E6; border: 1.5px solid #27302E; border-radius: 999px; padding: 3px 12px; }
  @media (max-width: 900px) { .mwsh-chips { justify-content: center; } }
</style>
"""
for (sec, lang), (eb, title, sub, alt) in T.items():
    chips = CHIPS.get((sec, lang))
    chip_html = ("\n    <ul class=\"mwsh-chips\">" + "".join(f"<li>{c}</li>" for c in chips) + "</ul>") if chips else ""
    side = ""  # Oct 17, 2026: Ernesto on the left everywhere; the top right corner is the stamp spot
    to_lbl, to_txt = TO[(sec, lang)]
    pm1, pm2 = PM[lang]
    key = "team" if sec == "team" else "priv"
    html = f"""<!-- MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: {'TEAM' if sec == 'team' else 'PRIVATE'} SECTION BANNER. Built by page-embeds/build_home_heads.py.
     Sits above the two-column layout, same look as the free tour banner. -->
<div class="mwsh{side}" id="{'team' if sec == 'team' else 'private'}">
  <img class="mwsh-ern" src="{ERN[sec]}" alt="{alt}" loading="lazy">
  <div>
    <p class="pc-from">{FROM[lang]}</p>
    <span class="mwsh-eyebrow">{eb}</span>
    <h2 class="mwsh-title">{title}</h2>
    <p class="pc-to"><span>{to_lbl}</span> {to_txt}</p>{chip_html}
  </div>
  <div class="pc-slot"><span class="pc-pm" aria-hidden="true"><b>{pm1}</b><i>{pm2}</i></span></div>
</div>
{CSS}
{TEAM_CSS + CHIP_CSS if sec == "team" else ""}"""
    open(f"home-head-{sec}-{lang}.html", "w", encoding="utf-8").write(html)
    print("wrote", f"home-head-{sec}-{lang}.html")
