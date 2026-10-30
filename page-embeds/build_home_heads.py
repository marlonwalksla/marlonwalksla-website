# Builds the section header banners on Home (/) and /es for the Team and Private sections.
# Oct 16, 2026: same look as the free tour banner (Ernesto beside an eyebrow, title and one line).
import stamps
C = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
ERN = {"team": C + "6ae4300b60c929ab61017ccc_Polaroid%20Photographer.avif",
       "priv": C + "6ae4300bb3475c17e0bb3730_Hiking.avif"}
PERSON = ('<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="6.2" r="3.6" fill="#27302E"/>'
          '<path d="M3 18c0-4.2 3.1-6.6 7-6.6s7 2.4 7 6.6z" fill="#27302E"/></svg>')
# Oct 17, 2026 (Marlon): postcard headers. Text left, small badges instead of pills. Ernesto lives next to the form buttons, not up here.
# title = the line that sells it; badges = quick facts (person icon + group size, camera + film pics, car + pickup)
# Oct 19, 2026 (Marlon): ONE pill system for all three tours. Same icon for the same idea, same order: who, how long, what is included, then what is NOT included.
# Included pills are solid; "not included" pills are dashed and muted (class pc-no). Icons: people 1F465, clock 23F1, funicular 1F69E, camera 1F4F8, hotel car 1F697, fork and knife 1F374, parking 1F17F.
# Facts only from Marlon: 20 photos per team (his earlier pill; the brief also says a photo for everyone, to confirm), Private 4/8/12 hours, no food or parking on Private.
PEOPLE, CLOCK, FLIGHT, CAMERA, CAR, FOOD, PARK = "&#128101;", "&#9201;&#65039;", "&#128670;", "&#128247;", "&#128663;", "&#127860;", "&#127359;&#65039;"
T = {
 ("team", "en"): ("Team Tours", "Ernesto with his Polaroid camera",
   [(PEOPLE, "5-20 guests", "5-20 guests", 0), (CLOCK, "5 hours", None, 0), (FLIGHT, "Angels Flight ride", None, 0), (CAMERA, "20 photos per team", None, 0), (FOOD, "Food", None, 1)]),
 ("team", "es"): ("Tours de equipo", "Ernesto con su c&aacute;mara Polaroid",
   [(PEOPLE, "5-20 personas", "5-20 personas", 0), (CLOCK, "5 horas", None, 0), (FLIGHT, "Paseo en Angels Flight", None, 0), (CAMERA, "20 fotos por equipo", None, 0), (FOOD, "Comida", None, 1)]),
 ("priv", "en"): ("Private Tours", "Ernesto ready for a hike",
   [(PEOPLE, "2-4 guests", "2-4 guests", 0), (CLOCK, "2-12 hours", None, 0), (CAR, "Hotel pickup and drop-off", None, 0), (FOOD, "Food", None, 1), (PARK, "Parking", None, 1)]),
 ("priv", "es"): ("Tours privados", "Ernesto listo para una caminata",
   [(PEOPLE, "2-4 personas", "2-4 personas", 0), (CLOCK, "2-12 horas", None, 0), (CAR, "Recogida y regreso al hotel", None, 0), (FOOD, "Comida", None, 1), (PARK, "Estacionamiento", None, 1)]),
}
CSS = """<style>
  .mwsh { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 24px; align-items: start; max-width: 1060px; margin: 0 auto 30px; padding: 28px 24px 0; box-sizing: border-box; scroll-margin-top: 70px; font-family: "Nunito", system-ui, sans-serif; text-align: left; }
  .mwsh-title { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: clamp(1.9rem, 4vw, 2.8rem); line-height: 1.1; color: #27302E; margin: 0; }
  .mwsh-sub { font-family: "Caveat", "Segoe Script", cursive; font-weight: 700; font-size: clamp(1.6rem, 3.4vw, 2rem); line-height: 1.1; color: #E8742A; margin: 2px 0 8px; }
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
  /* Oct 23, 2026 (Marlon): on desktop the intro runs the full width; the stamps moved into the price card, so there is no stamp column or min height */
  #team.mwsh { min-height: 0; grid-template-columns: minmax(0, 1fr); }
  #team .pc-line { max-width: none; }
  .mwsh-pills { list-style: none; margin: 14px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
  .mwsh-pills li { font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.95rem; line-height: 1.2; color: #1E6B3A; background: #fff; border: 2px solid #1E6B3A; border-radius: 999px; padding: 6px 14px; margin: 0; }
  .mwsh-pills li::before { content: none; }
  .mwsh-pills li.no { color: #A12B4A; background: #FFE4EA; border-color: #E58AA3; }
  .mwsh-grp { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; margin-top: 10px; }
  .mwsh-grp[hidden] { display: none; }
  .mwsh-grp .mwsh-pills { margin: 0; }
  .mwsh-gl { font-family: "Fredoka", sans-serif; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase; color: #1E6B3A; min-width: 122px; }
  .mwsh-grp.out .mwsh-gl { color: #A12B4A; }
  @media (max-width: 600px) { .mwsh-gl { min-width: 100%; } .mwsh-grp .mwsh-pills { gap: 6px; } .mwsh-grp .mwsh-pills li { font-size: 0.8rem; padding: 4px 9px; } }
  .mwsh-pills li.no.yes { color: #1E6B3A; background: #fff; border-color: #1E6B3A; }
  #team-split .mw-offer-links { margin-top: 10px; gap: 4px 22px; }
  @media (max-width: 991px) { #team-split { padding-top: 20px; padding-bottom: 32px; } }
</style>
"""
PRIV_CSS = """<style>
  /* Oct 23, 2026 (Marlon): same as Team. Intro runs full width, no stamp column; the fact pills sit under the text */
  #private.mwsh { min-height: 0; grid-template-columns: minmax(0, 1fr); }
  #private .pc-line { max-width: none; }
  .mwsh-pills { list-style: none; margin: 14px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
  .mwsh-pills li { font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.95rem; line-height: 1.2; color: #1E6B3A; background: #fff; border: 2px solid #1E6B3A; border-radius: 999px; padding: 6px 14px; margin: 0; }
  .mwsh-pills li::before { content: none; }
  .mwsh-pills li.no { color: #A12B4A; background: #FFE4EA; border-color: #E58AA3; }
  .mwsh-grp { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; margin-top: 10px; }
  .mwsh-grp[hidden] { display: none; }
  .mwsh-grp .mwsh-pills { margin: 0; }
  .mwsh-gl { font-family: "Fredoka", sans-serif; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase; color: #1E6B3A; min-width: 122px; }
  .mwsh-grp.out .mwsh-gl { color: #A12B4A; }
  @media (max-width: 600px) { .mwsh-gl { min-width: 100%; } .mwsh-grp .mwsh-pills { gap: 6px; } .mwsh-grp .mwsh-pills li { font-size: 0.8rem; padding: 4px 9px; } }
</style>
"""
LINES = {('team', 'en'): 'Get out of the office and explore Downtown LA together with your team on a loop that starts and ends at Grand Central Market. Learn some local history, breathe in some fresh air, and break bread together.', ('team', 'es'): 'Sal de la oficina y explora el centro de LA con tu equipo en un recorrido en c&iacute;rculo que empieza y termina en Grand Central Market. Aprende algo de historia local, respira aire fresco y compartan una comida.', ('priv', 'en'): 'Pick your stops and we\'ll handle the rest. Tell me where you want to go and we\'ll design your group\'s best day in LA together.', ('priv', 'es'): 'Elige tus paradas y nosotros nos encargamos del resto. Cu&eacute;ntame a d&oacute;nde quieres ir y dise&ntilde;amos juntos el mejor d&iacute;a de tu grupo en LA.'}
SUB = {("team", "en"): '    <p class="mwsh-sub" style="color:#1E6B3A">Celebrate Your Team</p>\n', ("team", "es"): '    <p class="mwsh-sub" style="color:#1E6B3A">Celebra a tu equipo</p>\n', ("priv", "en"): '    <p class="mwsh-sub">LA, Your Way</p>\n', ("priv", "es"): '    <p class="mwsh-sub">LA a tu manera</p>\n'}  # Oct 23, 2026 (Marlon): the section is "Private Tours"; "LA, Your Way" is the subheader
FROM = {"en": "From: Marlon &middot; MarlonWalksLA, Los Angeles", "es": "De: Marlon &middot; MarlonWalksLA, Los &Aacute;ngeles"}
TO = {("team", "en"): ("To:", "your team &middot; Grand Central Market, 317 S Broadway"),
      ("team", "es"): ("Para:", "tu equipo &middot; Grand Central Market, 317 S Broadway"),
      ("priv", "en"): ("To:", "you &middot; anywhere in LA"),
      ("priv", "es"): ("Para:", "ti &middot; cualquier parte de LA")}
PM = {"en": ("LOS ANGELES", "CA"), "es": ("LOS &Aacute;NGELES", "CA")}
def grp(kind, uid, es, items, no):
    """One labeled row of pills: kind 'in' or 'out'."""
    label = ("No incluido" if es else "Not included") if kind == "out" else ("Incluido" if es else "Included")
    idat = (' id="%s"' % uid) if uid else ""
    pills = "".join(('<li id="mwsh-food" hidden>' + x[1:] + "</li>") if x[:1] == "!" else (('<li class="no">' if no else "<li>") + x + "</li>") for x in items)
    return '<div class="mwsh-grp%s"><span class="mwsh-gl">%s</span><ul class="mwsh-pills"%s>%s</ul></div>' % (" out" if kind == "out" else "", label, idat, pills)

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
              stamps.stamp("stt3", "ALMUERZO EN" if es else "LUNCH AT", "GRAND CENTRAL MARKET", "stall", "EST. 1917", "#E2662A", -6, 4, "s3")]
    else:
        ST = [stamps.stamp("stp", "ATARDECER EN CALIFORNIA" if es else "CALIFORNIA SUNSET", "TOURS PRIVADOS" if es else "PRIVATE TOURS", "sunset", "", "#E8742A", 7, 5),
              stamps.stamp("stp2", "MUELLE DE SANTA M&Oacute;NICA" if es else "SANTA MONICA PIER", "CALIFORNIA", "pier", "EST. 1909", "#B8326E", -9, 13, "s2"),
              stamps.stamp("stp3", "OBSERVATORIO GRIFFITH" if es else "GRIFFITH OBSERVATORY", LA, "obs", "EST. 1935", "#C2352A", 6, 15, "s3")]
    addr = "  " + "".join(ST) + "\n"
    if sec in ("team", "priv"): addr = ""  # Oct 23, 2026 (Marlon): the three stamps moved into the price card, next to the button
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
        # Oct 23, 2026 (Marlon): the fact pills are back under the intro text (they used to sit in the price card). The Food pill turns green when the card's lunch plan is catering.
        PV = (["&#9201;&#65039; 5 horas", "&#128205; Grand Central Market", "&#128673; Boletos de Angels Flight", "&#128248; Foto para todos"], "&#127869;&#65039; Comida") if es else (["&#9201;&#65039; 5 hours", "&#128205; Grand Central Market", "&#128673; Angels Flight tix", "&#128248; Photo for everyone"], "&#127869;&#65039; Food")
        b_html = grp("in", "mwsh-in", es, PV[0] + ["!" + PV[1]], False)  # Oct 23, 2026 (Marlon): only the "Included" row on Home (Not included is explained on the pages). The Food pill moves to the Included row when the lunch plan is catering (see build_home_teamcard.py).
    if sec == "priv":  # Oct 20, 2026 (Marlon): under the sentence, "Best for" instead of the fact pills (the facts moved next to the price)
        BF = [("&#128145;", "Parejas"), ("&#128106;", "Familias"), ("&#127881;", "Amigos")] if es else [("&#128145;", "Couples"), ("&#128106;", "Families"), ("&#127881;", "Friends")]
        PP = (["&#9201;&#65039; 2-12 horas", "&#127976; Recogida y regreso al hotel", "&#128663; Manejo", "&#128248; Fotos instant&aacute;neas"], ["&#127869;&#65039; Comida", "&#127359;&#65039; Estacionamiento"]) if es else (["&#9201;&#65039; 2-12 hours", "&#127976; Hotel pickup and drop-off", "&#128663; Driving", "&#128248; Instant photos"], ["&#127869;&#65039; Food", "&#127359;&#65039; Parking"])
        b_html = grp("in", "", es, PP[0], False)  # Oct 23, 2026 (Marlon): same two rows as Team, "Included" and "Not included"
    html = f"""<!-- MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: {'TEAM' if sec == 'team' else 'PRIVATE'} SECTION BANNER. Built by page-embeds/build_home_heads.py.
     Postcard header: title, one short sentence and badges on the left; the From and To lines on the right (Oct 17, 2026). Address, sentence and badge styles live in home-hero.html. -->
<div class="mwsh" id="{'team' if sec == 'team' else 'private'}">
  <div class="mwsh-main">
    <h2 class="mwsh-title">{title}</h2>
{SUB[(sec, lang)]}    <p class="pc-line">{LINES[(sec, lang)]}</p>
    <div class="pc-groups">{b_html}</div>
  </div>
{addr}</div>
{CSS}
{TEAM_CSS if sec == "team" else PRIV_CSS}"""
    open(f"home-head-{sec}-{lang}.html", "w", encoding="utf-8").write(html)
    print("wrote", f"home-head-{sec}-{lang}.html")
