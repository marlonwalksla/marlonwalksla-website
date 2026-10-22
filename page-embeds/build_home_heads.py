# Builds the section header banners on Home (/) and /es for the Team and Private sections.
# Oct 16, 2026: same look as the free tour banner (Ernesto beside an eyebrow, title and one line).
import stamps
C = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
ERN = {"team": C + "6a87ce800a9b9169f06d40de_Polaroid%20Photographer.avif",
       "priv": C + "6a87cf628c921f7de316043f_Hiking.avif"}
PERSON = ('<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="6.2" r="3.6" fill="#27302E"/>'
          '<path d="M3 18c0-4.2 3.1-6.6 7-6.6s7 2.4 7 6.6z" fill="#27302E"/></svg>')
# Oct 17, 2026 (Marlon): postcard headers. Text left, small badges instead of pills. Ernesto lives next to the form buttons, not up here.
# title = the line that sells it; badges = quick facts (person icon + group size, camera + film pics, car + pickup)
# Oct 19, 2026 (Marlon): ONE pill system for all three tours. Same icon for the same idea, same order: who, how long, what is included, then what is NOT included.
# Included pills are solid; "not included" pills are dashed and muted (class pc-no). Icons: people 1F465, clock 23F1, funicular 1F69E, camera 1F4F8, hotel car 1F697, fork and knife 1F374, parking 1F17F.
# Facts only from Marlon: 20 photos per team (his earlier pill; the brief also says a photo for everyone, to confirm), Private 4/8/12 hours, no food or parking on Private.
PEOPLE, CLOCK, FLIGHT, CAMERA, CAR, FOOD, PARK = "&#128101;", "&#9201;&#65039;", "&#128670;", "&#128247;", "&#128663;", "&#127860;", "&#127359;&#65039;"
T = {
 ("team", "en"): ("Celebrate Your Team", "Ernesto with his Polaroid camera",
   [(PEOPLE, "5-20 guests", "5 to 20 guests", 0), (CLOCK, "5 hours", None, 0), (FLIGHT, "Angels Flight ride", None, 0), (CAMERA, "20 photos per team", None, 0), (FOOD, "Food", None, 1)]),
 ("team", "es"): ("Celebra a tu equipo", "Ernesto con su c&aacute;mara Polaroid",
   [(PEOPLE, "5-20 personas", "5 a 20 personas", 0), (CLOCK, "5 horas", None, 0), (FLIGHT, "Paseo en Angels Flight", None, 0), (CAMERA, "20 fotos por equipo", None, 0), (FOOD, "Comida", None, 1)]),
 ("priv", "en"): ("LA, Your Way", "Ernesto ready for a hike",
   [(PEOPLE, "2-4 guests", "2 to 4 guests", 0), (CLOCK, "2 to 12 hours", None, 0), (CAR, "Hotel pickup and drop-off", None, 0), (FOOD, "Food", None, 1), (PARK, "Parking", None, 1)]),
 ("priv", "es"): ("LA a tu manera", "Ernesto listo para una caminata",
   [(PEOPLE, "2-4 personas", "2 a 4 personas", 0), (CLOCK, "2 a 12 horas", None, 0), (CAR, "Recogida y regreso al hotel", None, 0), (FOOD, "Comida", None, 1), (PARK, "Estacionamiento", None, 1)]),
}
CSS = """<style>
  .mwsh { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 24px; align-items: start; max-width: 1060px; margin: 0 auto 30px; padding: 28px 24px 0; box-sizing: border-box; scroll-margin-top: 70px; font-family: "Nunito", system-ui, sans-serif; text-align: left; }
  .mwsh-title { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: clamp(1.9rem, 4vw, 2.8rem); line-height: 1.1; color: #27302E; margin: 0; }
  .mwsh .pc-grp { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; }
  .mwsh .pc-grp .pc-badges { margin: 5px 0; }
  .mwsh .pc-grpl { font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.07em; color: #4D5551; min-width: 104px; }
  @media (max-width: 900px) {
    .mwsh { padding: 14px 28px 0; grid-template-columns: 1fr; }
    .mwsh .pc-addr { justify-self: end; }
    .mwsh-title { font-size: clamp(1.7rem, 8vw, 2.2rem); }
    .mwsh .pc-badge { font-size: 0.9rem; }
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
  #team.mwsh { min-height: 190px; }
  #team-split .mw-offer-links { margin-top: 10px; gap: 4px 22px; }
  @media (max-width: 991px) { #team-split { padding-top: 20px; padding-bottom: 32px; } }
</style>
"""
LINES = {('team', 'en'): 'Get out of the office and explore Downtown LA together with your team. Learn some local history, breathe in some fresh air, and break bread at Grand Central Market.', ('team', 'es'): 'Sal de la oficina y explora el centro de LA con tu equipo. Aprende algo de historia local, respira aire fresco y comparte una comida en Grand Central Market.', ('priv', 'en'): 'Pick your stops and we\'ll handle the rest. Tell me where you want to go and we\'ll design your group\'s best day in LA together.', ('priv', 'es'): 'Elige tus paradas y nosotros nos encargamos del resto. Cu&eacute;ntame a d&oacute;nde quieres ir y dise&ntilde;amos juntos el mejor d&iacute;a de tu grupo en LA.'}
FROM = {"en": "From: Marlon &middot; MarlonWalksLA, Los Angeles", "es": "De: Marlon &middot; MarlonWalksLA, Los &Aacute;ngeles"}
TO = {("team", "en"): ("To:", "your team &middot; Grand Central Market, 317 S Broadway"),
      ("team", "es"): ("Para:", "tu equipo &middot; Grand Central Market, 317 S Broadway"),
      ("priv", "en"): ("To:", "you &middot; anywhere in LA"),
      ("priv", "es"): ("Para:", "ti &middot; cualquier parte de LA")}
PM = {"en": ("LOS ANGELES", "CA"), "es": ("LOS &Aacute;NGELES", "CA")}
for (sec, lang), (title, alt, badges) in T.items():
    to_lbl, to_txt = TO[(sec, lang)]
    pm1, pm2 = PM[lang]
    # Oct 17, 2026 (Marlon): no From/To address lines in any section header (Team shows one building: Grand Central Market).
    es = lang == "es"
    # Oct 18, 2026 (Marlon): the FIRST stamp of each section is the section's own stamp (same as the hero); then two landmark stamps.
    LA = "LOS &Aacute;NGELES" if es else "LOS ANGELES"
    if sec == "team":
        ST = [stamps.stamp("stt", "FUERA DE LA OFICINA" if es else "OUT OF OFFICE", "SALIDAS DE EQUIPO" if es else "TEAM OUTINGS", "palms3", "", "#C2352A", -8, 3),
              stamps.stamp("stt2", "TOMA UNA FOTO INSTANT&Aacute;NEA" if es else "TAKE AN INSTANT PHOTO", "POLAROID DE EQUIPO" if es else "TEAM POLAROID", "polaroid", "", "#6A4C93", 9, 11, "s2"),
              stamps.stamp("stt3", "ALMUERZO EN" if es else "LUNCH AT", "GRAND CENTRAL MARKET", "gcm", "EST. 1917", "#E2662A", -6, 4, "s3")]
    else:
        ST = [stamps.stamp("stp", "ATARDECER EN CALIFORNIA" if es else "CALIFORNIA SUNSET", "TOURS PRIVADOS" if es else "PRIVATE TOURS", "sunset", "", "#E8742A", 7, 5),
              stamps.stamp("stp2", "MUELLE DE SANTA M&Oacute;NICA" if es else "SANTA MONICA PIER", "CALIFORNIA", "pier", "EST. 1909", "#B8326E", -9, 13, "s2"),
              stamps.stamp("stp3", "OBSERVATORIO GRIFFITH" if es else "GRIFFITH OBSERVATORY", LA, "obs", "EST. 1935", "#C2352A", 6, 15, "s3")]
    addr = "  " + "".join(ST) + "\n"
    def pills(items):
        return "".join(
            f'<li class="pc-badge{" pc-no" if no else ""}"{(" aria-label=" + chr(34) + lbl + chr(34)) if lbl else ""}><span aria-hidden="true">{ic}</span><span>{tx}</span></li>'
            for ic, tx, lbl, no in items)
    # Oct 19, 2026 (Marlon): one row for what is included, one row for what is not (labels in front)
    L_IN, L_OUT = ("Incluido", "No incluido") if es else ("Included", "Not included")
    b_html = (f'<div class="pc-grp"><span class="pc-grpl">{L_IN}</span><ul class="pc-badges">{pills([b for b in badges if not b[3]])}</ul></div>'
              + (f'<div class="pc-grp"><span class="pc-grpl">{L_OUT}</span><ul class="pc-badges">{pills([b for b in badges if b[3]])}</ul></div>' if any(b[3] for b in badges) else ''))
    if sec == "team":  # Oct 20, 2026 (Marlon): "Best for" the celebrations; the facts moved next to the price in the card
        BT = ([("&#127874;", "Cumpleaños"), ("&#127942;", "Logros"), ("&#127796;", "Retiros de empresa"), ("&#127881;", "Porque sí")] if es
              else [("&#127874;", "Birthdays"), ("&#127942;", "Milestones"), ("&#127796;", "Offsites"), ("&#127881;", "Just because")])
        b_html = ""  # Oct 21, 2026 (Marlon): no pills under the intro text
    if sec == "priv":  # Oct 20, 2026 (Marlon): under the sentence, "Best for" instead of the fact pills (the facts moved next to the price)
        BF = [("&#128145;", "Parejas"), ("&#128106;", "Familias"), ("&#127881;", "Amigos")] if es else [("&#128145;", "Couples"), ("&#128106;", "Families"), ("&#127881;", "Friends")]
        b_html = ""  # Oct 21, 2026 (Marlon): Couples / Families / Friends moved into the estimate card, before "How many of you?" (build_home_private.py)
    html = f"""<!-- MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: {'TEAM' if sec == 'team' else 'PRIVATE'} SECTION BANNER. Built by page-embeds/build_home_heads.py.
     Postcard header: title, one short sentence and badges on the left; the From and To lines on the right (Oct 17, 2026). Address, sentence and badge styles live in home-hero.html. -->
<div class="mwsh" id="{'team' if sec == 'team' else 'private'}">
  <div class="mwsh-main">
    <h2 class="mwsh-title">{title}</h2>
    <p class="pc-line">{LINES[(sec, lang)]}</p>
    <div class="pc-groups">{b_html}</div>
  </div>
{addr}</div>
{CSS}
{TEAM_CSS if sec == "team" else ""}"""
    open(f"home-head-{sec}-{lang}.html", "w", encoding="utf-8").write(html)
    print("wrote", f"home-head-{sec}-{lang}.html")
