"""Nov 24, 2026: build the trimmed Home draft sections (Marlon: "edit down, don't rebuild").

Reads the current Home section files in page-embeds/ and writes *-draft copies next to them.
The live Home and /es are not touched; only /home-draft and /es-draft (Webflow, noindex) load these.

Cuts:
  hero     no Espanol|English pills (the header has them); one photo, the pink "Join a Free Tour";
           no carousel arrows, dots or autoplay; the tour words jump to their sections on the page;
           new line "Capturing moments in LA".
  book     Free tour: the 7-photo slider becomes one photo, "Marlon with the whole crew".
  team     Group tour: one photo, the green birthday print (Kara's review comes with it).
  private  Private tour: one photo, the Urban Light print.
Run from the repo root:  python3 tools/make_home_draft.py
"""
import re
from pathlib import Path

PE = Path(__file__).resolve().parent.parent / "page-embeds"
C = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"


def keep_slides(html, keep):
    """Remove every .mws-slide figure except those whose opening tag contains `keep`."""
    out, pos = [], 0
    for m in re.finditer(r'<figure class="mws-slide"[\s\S]*?</figure>\s*', html):
        out.append(html[pos:m.start()])
        if keep in m.group(0)[:600]:
            out.append(m.group(0))
        pos = m.end()
    out.append(html[pos:])
    res = "".join(out)
    assert res.count('class="mws-slide"') == 1, (keep, res.count('class="mws-slide"'))
    return res


def hero(src, es):
    s = (PE / src).read_text()
    s = re.sub(r'\s*<div class="mwh-lang"[\s\S]*?</div>', "", s, count=1)
    assert 'class="mwh-lang"' not in s.split("<style")[0]
    # the three tour words become links to their sections on this page
    for i, anchor in ((0, "#packages"), (1, "#packages"), (2, "#book")):
        s, n = re.subn(r'<button type="button" class="mwh-hl" data-tone="(\w+)" data-i="%d">([^<]*)</button>' % i,
                       r'<a class="mwh-hl" data-tone="\1" href="%s">\2</a>' % anchor, s)
        assert n == 1, i
    tag = "Capturando momentos en LA." if es else "Capturing moments in LA."
    s = s.replace('<p class="mwh-line" id="mwh-line">', '<p class="mwh-tagline">%s</p>\n      <p class="mwh-line" id="mwh-line">' % tag, 1)
    # one slide: the pink free tour print
    slides = re.findall(r'\s*<div class="mwh-slide[^"]*" data-tone="(\w+)"[\s\S]*?\n            </div>', s)
    assert slides == ["green", "orange", "pink"], slides
    s = re.sub(r'\s*<div class="mwh-slide is-on" data-tone="green"[\s\S]*?\n            </div>', "", s, count=1)
    s = re.sub(r'\s*<div class="mwh-slide" data-tone="orange"[\s\S]*?\n            </div>', "", s, count=1)
    s = s.replace('<div class="mwh-slide" data-tone="pink"', '<div class="mwh-slide is-on" data-tone="pink"', 1)
    s = re.sub(r'(<div class="mwh-slide is-on" data-tone="pink"[\s\S]*?)tabindex="-1"', r'\1tabindex="0"', s, count=1)
    s = re.sub(r'(<div class="mwh-slide is-on" data-tone="pink"[\s\S]*?)tabindex="-1"', r'\1tabindex="0"', s, count=1)
    s = re.sub(r'(<div class="mwh-slide is-on" data-tone="pink"[\s\S]*?)loading="lazy"', r'\1loading="eager" fetchpriority="high"', s, count=1)
    # one button, not two (Marlon, Nov 24): the pink title is the link to the calendar on this page,
    # the subtext stays under it, the yellow button goes
    # Marlon, Nov 24 (round 3): one YELLOW button under the photo, then the subtext. No pink title.
    btn = "&Uacute;nete a un Free Tour" if es else "Join a Free Tour"
    # Round 6 (Marlon): two offers, two buttons, side by side under Ernesto and the tagline; a short line under each.
    m = re.search(r'<p class="mwh-cap"><strong data-tone="pink">[^<]*</strong></p>\s*<p class="mwh-sub">[^<]*</p>\s*<a class="mwh-btn mwh-cbtn" data-tone="pink" href="[^"]*"[^>]*>[^<]*</a>', s)
    assert m, "pink caption + button"
    s = s[:m.start()] + s[m.end():]
    if es:
        b1, l1, b2, l2 = btn, "Con propina &middot; espa&ntilde;ol e ingl&eacute;s", "Tours por LA", "Comida, atardeceres y playa"
    else:
        b1, l1, b2, l2 = btn, "Tip-based &middot; English and Spanish", "Explore LA Tours", "Food walks, sunset hikes, beach days"
    ctas = ('\n      <div class="mwh-pair">'
            '<a class="mwh-btn mwh-one" href="#book">%s</a>'
            '<a class="mwh-btn mwh-one" href="#packages">%s</a>'
            '</div>') % (b1, b2)  # round 7 (Marlon): no small text under the buttons
    s, n = re.subn(r'(<p class="mwh-tagline">[^<]*</p>)', lambda mm: mm.group(1) + ctas, s, count=1)
    assert n == 1, "tagline anchor"
    # the sentence: Group and Private are packages now
    line = ('Explora LA en un <a class="mwh-hl" data-tone="pink" href="#book">free tour</a> o <a class="mwh-hl" data-tone="green" href="#packages">elige tu d&iacute;a en LA</a>.' if es else
            'Explore LA on a <a class="mwh-hl" data-tone="pink" href="#book">free tour</a> or <a class="mwh-hl" data-tone="green" href="#packages">pick your LA day</a>.')
    # Marlon (round 4): the sentence with the tour words goes; the highlights move into the sections below
    s, n = re.subn(r'\s*<p class="mwh-line" id="mwh-line">[\s\S]*?</p>', "", s, count=1)
    assert n == 1, "hero line"
    s = re.sub(r'\s*<button type="button" class="mwh-nav mwh-(prev|next)"[^>]*>[^<]*</button>', "", s)
    s = re.sub(r'\s*<div class="mwh-dots"[\s\S]*?</div>', "", s, count=1)
    # drop the carousel script (it needs three slides)
    s, n = re.subn(r'<script>\s*\(function \(\) \{\s*var car = document\.querySelector\("\.mwh-car"\)[\s\S]*?</script>\s*', "", s)
    assert n == 1, "carousel script"
    css = """
<style>
  /* Nov 24, 2026 draft: one photo, no arrows */
  .mwh .mwh-car { grid-template-columns: minmax(0, 340px); }
  .mwh .mwh-pol { grid-column: 1; }
  .mwh .mwh-tagline { margin: 0 0 14px; font-family: "Fredoka", system-ui, sans-serif; font-weight: 500; font-size: 1.2rem; color: #3B4440; }
  .mwh .mwh-hand { margin: 22px 0 10px; }
  .mwh a.mwh-hl { text-decoration: none !important; color: #27302E !important; }
  .mwh .mwh-tagline { margin: 2px 0 0; font-size: 1.35rem; font-weight: 600; color: #27302E; }
  .mwh .mwh-pair { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px 16px; margin: 20px 0 0; }
  .mwh .mwh-one { margin: 0; font-size: 1.15rem; padding: 12px 24px; white-space: nowrap; }
  /* round 7: the same block highlight as the rest of the page, instead of the one-off yellow underline */
  .mwh .mwh-mark { background: #FF9FD0; padding: 0 12px 2px; border-radius: 8px; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  /* only the three corner stamps (the middle-bottom one sat in the way) */
  .mwh .mwh-stamps svg.stamp:nth-child(3) { display: none !important; }
  /* Desktop: the whole hero fits in one screen under the header; columns sit closer; the photo is as tall as the text */
  @media (min-width: 992px) {
    .mwh .mwh-wrap { grid-template-columns: auto auto !important; justify-content: center; column-gap: clamp(48px, 7vw, 110px) !important; padding-top: clamp(40px, 7vh, 80px) !important; padding-bottom: clamp(40px, 7vh, 80px) !important; min-height: 0 !important; max-height: calc(100svh - 64px); box-sizing: border-box; align-items: center; align-content: center; }
    /* round 7 (Marlon): on desktop Ernesto's badge sits beside the title, "& Ernesto!" under it; tagline and buttons below */
    .mwh .mwh-text { display: grid !important; grid-template-columns: auto auto; grid-template-areas: "badge title" "badge hand" "tag tag" "btns btns"; column-gap: 22px; row-gap: 0; align-items: center; justify-items: start; text-align: left !important; }
    .mwh .mwh-h1 { grid-area: title; align-self: end; margin: 0 !important; font-size: clamp(2.4rem, min(5vw, 8vh), 4.3rem); }
    .mwh .mwh-ern2 { grid-area: badge; width: clamp(120px, 22vh, 200px); margin: 0 !important; }
    .mwh .mwh-hand { grid-area: hand; align-self: start; position: static !important; left: auto !important; bottom: auto !important; margin: 10px 0 0 4px !important; transform: rotate(-3deg) !important; }
    .mwh .mwh-tagline { grid-area: tag; justify-self: center; margin: clamp(16px, 3.5vh, 30px) 0 0 !important; }
    .mwh .mwh-pair { grid-area: btns; justify-self: center; }
    .mwh .mwh-car { grid-template-columns: minmax(0, min(360px, calc((100vh - 64px - 14vh - 24px) / 1.2))) !important; justify-content: center; }
    .mwh .mwh-pol { grid-column: 1 !important; }
    .mwh .mwh-stamps .stamp { width: clamp(70px, 13vh, 110px) !important; height: auto !important; }
  }
  @media (max-width: 991px) { .mwh .mwh-text { align-items: center; text-align: center; } }

</style>
"""
    return s + css


def book():
    s = (PE / "home-book.html").read_text()
    team = (PE / "home-team.html").read_text()
    crew = re.search(r'<figure class="mws-slide" data-c="offsite"[\s\S]*?</figure>', team).group(0)
    crew = re.sub(r' data-c="offsite" data-q="[^"]*" data-by="[^"]*"', "", crew)
    crew = crew.replace('data-cap="Marlon with the whole crew"', 'data-cap="Marlon with the whole crew" data-cap-es="Marlon con todo el grupo"')
    s = keep_slides(s, 'data-cap="Walt Disney Concert Hall"')
    s = re.sub(r'<figure class="mws-slide" data-cap="Walt Disney Concert Hall"[\s\S]*?</figure>', lambda m: crew, s, count=1)
    return s


def team(src):
    return keep_slides((PE / src).read_text(), 'data-c="birthday"')


def private(src, es):
    s = keep_slides((PE / src).read_text(), 'data-cap="Javier')
    cap = "Una pareja en Urban Light, LACMA" if es else "A couple at Urban Light, LACMA"
    alt = "Una pareja del tour privado en Urban Light, con su foto instantánea" if es else "Private tour guests at Urban Light with their instant photo"
    fig = ('<figure class="mws-slide" data-cap="%s"><img class="mws-fit mws-raw" src="%s6ae45115ea1a111698dba65e_private%%20urban%%20lights.avif" '
           'alt="%s" loading="lazy"></figure>') % (cap, C, alt)
    return re.sub(r'<figure class="mws-slide" data-cap="Javier[\s\S]*?</figure>', lambda m: fig, s, count=1)



# ---------------------------------------------------------------------------
# Nov 24, 2026 (Marlon): Group and Private become PACKAGES sold by place.
# Walking: Downtown Grand Loop (groups up to 35). Driving: Hollywood + Griffith, Santa Monica + Venice (up to 5 in the van).
# Red .pk-todo = Marlon still has to set it (driving prices and lengths). Reviews: only real ones that fit the card.
IMG = C
# Round 5 (Marlon): titles name the kind of day, the place goes under it. Every card has the same rows and sizes.
Q_KARA = ("I booked him to lead a birthday tour for me and my friends and he went above and beyond.", "Kara F.")
Q_BEA = ("Marlon was flexible, I had to reschedule and he was very open to it. He is very knowledgeable, he shared so much and went over time.", "Beatrice")
Q_MATEO = ("The guide showed us the nicest places in the city and provided the best advices and recommendations.", "Mateo R.")
PK = {
  "en": dict(
    title="Explore LA With a Local", sub="The LA you came for, the way locals live it",
    line='You already know the places. I\'ll show you how we live them: <mark class="mk" data-tone="green">where locals eat</mark>, <mark class="mk" data-tone="orange">the best views</mark> and <mark class="mk" data-tone="pink">the stories behind them</mark>. The instant camera captures the moments.',
    g="Google", cards=[
      dict(tone="green", name="Downtown Food Walk", place="Grand Central Market",
           img="6ae4441660c929ab6108a7d5_birthday.avif", raw=True, alt="Kara's birthday group under the neon lights with their instant photo", cap="Kara's birthday crew",
           line="Five hours through the historic center, eating our way from Grand Central Market. Great for birthdays, offsites and big groups.",
           stops="Grand Central Market &middot; Angels Flight &middot; The Broad &middot; City Hall",
           price="$30 per person &middot; 5 hours &middot; groups up to 35", todo="", q=Q_KARA, btn="See dates", href="/group-tours-los-angeles"),
      dict(tone="orange", name="Sunset Hikes", place="Hollywood + Griffith Observatory",
           img="6ad92a2e8aa41f8f19ce753e_guest-griffith-park-and-observatory-04.webp", raw=False, alt="Guests watching the sunset at Griffith Observatory", cap="Sunset at Griffith Observatory",
           line="Hotel pickup, hike up to the Observatory for the sunset (or drive up), then dinner in Hollywood.",
           stops="Griffith Observatory &middot; Hollywood sign views &middot; Walk of Fame",
           price="Up to 5 guests &middot; hotel pickup", todo="Price and hours to set", q=Q_BEA, btn="Plan this day", href="/private-tour-los-angeles"),
      dict(tone="blue", name="Beach Day", place="Santa Monica + Venice Beach",
           img="6ad929e61c74efa5d6a35519_guest-santa-monica-01.avif", raw=False, alt="Guests smiling on the Santa Monica Pier", cap="Santa Monica Pier",
           line="Hotel pickup, the pier, the beach and the Venice Canals. Stay for the sunset if you want it.",
           stops="Santa Monica Pier &middot; Venice Beach &middot; Venice Canals",
           price="Up to 5 guests &middot; hotel pickup", todo="Price and hours to set", q=Q_MATEO, btn="Plan this day", href="/private-tour-los-angeles"),
    ],
    custom="Want a different day? <a href=\"/private-tour-los-angeles\">Tell Marlon where you want to go</a>."),
  "es": dict(
    title="Explora LA con un local", sub="El LA que viniste a ver, como lo vivimos aquí",
    line='Ya conoces los lugares. Te enseño cómo los vivimos: <mark class="mk" data-tone="green">dónde comemos</mark>, <mark class="mk" data-tone="orange">las mejores vistas</mark> y <mark class="mk" data-tone="pink">las historias detrás</mark>. La cámara instantánea captura los momentos.',
    g="Google (en inglés)", cards=[
      dict(tone="green", name="Ruta de comida en el centro", place="Grand Central Market",
           img="6ae4441660c929ab6108a7d5_birthday.avif", raw=True, alt="El grupo de cumpleaños de Kara bajo las luces de neón con su foto instantánea", cap="El cumpleaños de Kara",
           line="Cinco horas por el centro histórico, comiendo desde Grand Central Market. Ideal para cumpleaños, salidas de equipo y grupos grandes.",
           stops="Grand Central Market &middot; Angels Flight &middot; The Broad &middot; City Hall",
           price="$30 por persona &middot; 5 horas &middot; grupos de hasta 35", todo="", q=Q_KARA, btn="Ver fechas", href="/tours-para-grupos-los-angeles"),
      dict(tone="orange", name="Caminatas al atardecer", place="Hollywood + Observatorio Griffith",
           img="6ad92a2e8aa41f8f19ce753e_guest-griffith-park-and-observatory-04.webp", raw=False, alt="Personas viendo el atardecer en el Observatorio Griffith", cap="Atardecer en el Observatorio Griffith",
           line="Te recojo en tu hotel, subimos al Observatorio para el atardecer (caminando o en auto) y cenamos en Hollywood.",
           stops="Observatorio Griffith &middot; vistas del letrero de Hollywood &middot; Paseo de la Fama",
           price="Hasta 5 personas &middot; te recojo en tu hotel", todo="Precio y horas por definir", q=Q_BEA, btn="Planea este día", href="/tours-privados-los-angeles"),
      dict(tone="blue", name="Día de playa", place="Santa Monica + Venice Beach",
           img="6ad929e61c74efa5d6a35519_guest-santa-monica-01.avif", raw=False, alt="Personas sonriendo en el muelle de Santa Monica", cap="Muelle de Santa Monica",
           line="Te recojo en tu hotel: el muelle, la playa y los canales de Venice. Quédate al atardecer si quieres.",
           stops="Muelle de Santa Monica &middot; Venice Beach &middot; canales de Venice",
           price="Hasta 5 personas &middot; te recojo en tu hotel", todo="Precio y horas por definir", q=Q_MATEO, btn="Planea este día", href="/tours-privados-los-angeles"),
    ],
    custom="¿Quieres otro plan? <a href=\"/tours-privados-los-angeles\">Dile a Marlon a dónde quieres ir</a>."),
}

PK_CSS = """
<style>
  /* Packages (Nov 24, 2026 draft, round 5). Sits in the old Group wrapper: classic airmail edge, cream paper. */
  .mw-bg-team:has(#packages) { background: #FFF6E6 !important; --pc-stripes: repeating-linear-gradient(-45deg, #D9412B 0 16px, transparent 16px 26px, #2890B6 26px 42px, transparent 42px 52px); }
  .mw-bg-team:has(#packages)::before { opacity: .5; }
  .mw-bg-team:has(#packages) .w-container { max-width: 1160px; }
  .mw-bg-team:has(#packages) #team-split { display: none !important; }
  .pk { max-width: 1120px; margin: 0 auto; padding: 34px 28px 46px; box-sizing: border-box; font-family: "Nunito", system-ui, sans-serif; color: #27302E; scroll-margin-top: 70px; }
  .pk-head { text-align: center; margin: 0 auto 28px; max-width: 700px; }
  .pk-title { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: clamp(1.9rem, 4vw, 2.8rem); line-height: 1.1; margin: 0; }
  .pk-sub { font-family: "Caveat", "Segoe Script", cursive; font-weight: 700; font-size: clamp(1.5rem, 3.2vw, 1.9rem); color: #2890B6; margin: 2px 0 10px; }
  .pk-line { font-size: 1.1rem; line-height: 1.8; margin: 0; }
  mark.mk { color: #27302E; font-weight: 700; padding: 2px 8px; border-radius: 5px; background: var(--tone, #FFD43B); -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  mark.mk[data-tone="green"] { --tone: #86D69E; } mark.mk[data-tone="pink"] { --tone: #FF9FD0; } mark.mk[data-tone="orange"] { --tone: #FFAE63; }
  .pk-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; }
  /* every card has the same 9 rows; subgrid lines them up across the three cards */
  .pk-card { display: grid; grid-template-rows: subgrid; grid-row: span 9; row-gap: 0; background: #FFFDF7; border: 2.5px solid #27302E; border-radius: 18px; box-shadow: 4px 4px 0 #27302E; padding: 20px 20px 22px; text-align: center; }
  .pk-card[data-tone="green"] { background: #E8F6DF; } .pk-card[data-tone="orange"] { background: #FFE9D9; } .pk-card[data-tone="blue"] { background: #E0F1F8; }
  .pk-name { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.7rem; line-height: 1.1; margin: 0; align-self: end; }
  .pk-place { font-family: "Caveat", "Segoe Script", cursive; font-weight: 700; font-size: 1.45rem; line-height: 1.15; margin: 2px 0 14px; color: #3B4440; }
  .pk-card[data-tone="green"] .pk-place { color: #1E6B3A; } .pk-card[data-tone="orange"] .pk-place { color: #B4531A; } .pk-card[data-tone="blue"] .pk-place { color: #1D6F8F; }
  .pk-photo { position: relative; width: 82%; margin: 8px auto 0; aspect-ratio: 4 / 5; }
  .pk-photo img { display: block; width: 100%; height: 100%; object-fit: cover; box-shadow: 0 6px 14px rgba(0,0,0,.18); transform: rotate(var(--rot, 0deg)); }
  .pk-photo.is-raw img { object-fit: contain; box-shadow: none; filter: drop-shadow(0 6px 10px rgba(0,0,0,.18)); }
  .pk-tape { position: absolute; top: -10px; left: 50%; width: 84px; height: 22px; transform: translateX(-50%) rotate(-3deg); background: rgba(255,212,59,.6); z-index: 2; }
  .pk-cap { font-family: "Fredoka", sans-serif; font-weight: 500; font-size: .92rem; color: #4D5551; margin: 10px 0 14px; }
  .pk-text { font-size: 1rem; line-height: 1.5; margin: 0 0 10px; text-align: left; }
  .pk-stops { font-family: "Fredoka", sans-serif; font-size: .95rem; line-height: 1.45; color: #3B4440; margin: 0 0 10px; text-align: left; }
  .pk-stops b { font-weight: 600; }
  .pk-pricebox { text-align: left; margin: 0 0 12px; }
  .pk-price { font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1rem; margin: 0; }
  .pk-todo { color: #C0262D; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1rem; margin: 2px 0 0; }
  .pk-q { margin: 0 0 16px; text-align: left; }
  .pk-q blockquote { margin: 0; padding: 0 0 0 12px; border-left: 4px solid rgba(39,48,46,.2); font-size: .95rem; line-height: 1.5; color: #3B4440; font-style: italic; }
  .pk-q figcaption { margin-top: 4px; padding-left: 16px; font-size: .85rem; color: #5B6663; }
  .pk-q figcaption span { color: #E89B00; letter-spacing: 1px; }
  .pk-btn { align-self: end; justify-self: center; display: inline-block; font-family: "Lilita One", sans-serif; font-size: 1.15rem; color: #27302E !important; text-decoration: none !important; background: #FFD43B; border: 2.5px solid #27302E; border-radius: 999px; padding: 12px 26px; min-height: 44px; box-sizing: border-box; box-shadow: 4px 4px 0 #27302E; transition: transform .18s ease-out, box-shadow .18s ease-out; }
  .pk-btn:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #27302E; }
  .pk-btn:focus-visible { outline: 3px solid #2890B6; outline-offset: 4px; }
  .pk-custom { text-align: center; margin: 26px 0 0; font-size: 1rem; }
  .pk-custom a { color: #1D6F8F; font-weight: 700; }
  @media (max-width: 980px) { .pk-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 680px) { .pk { padding: 22px 26px 34px; } .pk-grid { grid-template-columns: 1fr; gap: 26px; } .pk-card { grid-template-rows: none; grid-row: auto; display: flex; flex-direction: column; } .pk-btn { align-self: center; margin-top: 4px; } .pk-photo { width: 72%; } }
  @media (prefers-reduced-motion: reduce) { .pk-btn { transition: none; } }
</style>
"""

ROTS = ["-1.2deg", "1.3deg", "-1deg"]

def packages(lang):
    d = PK[lang]; cards = []
    for i, c in enumerate(d["cards"]):
        todo = '<p class="pk-todo">%s</p>' % c["todo"] if c["todo"] else ""
        q, by = c["q"]
        cards.append(
          '<article class="pk-card" data-tone="%(tone)s">\n'
          '  <h3 class="pk-name">%(name)s</h3>\n  <p class="pk-place">%(place)s</p>\n'
          '  <div class="pk-photo%(raw)s" style="--rot:%(rot)s">%(tape)s<img src="%(src)s" alt="%(alt)s" loading="lazy" decoding="async"></div>\n'
          '  <p class="pk-cap">%(cap)s</p>\n  <p class="pk-text">%(line)s</p>\n  <p class="pk-stops"><b>%(lbl)s:</b> %(stops)s</p>\n'
          '  <div class="pk-pricebox"><p class="pk-price">%(price)s</p>%(todo)s</div>\n'
          '  <figure class="pk-q"><blockquote>&ldquo;%(q)s&rdquo;</blockquote><figcaption><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span> %(by)s &middot; %(g)s</figcaption></figure>\n'
          '  <a class="pk-btn" href="%(href)s">%(btn)s</a>\n</article>' % dict(c,
            raw=" is-raw" if c["raw"] else "", tape="" if c["raw"] else '<span class="pk-tape" aria-hidden="true"></span>',
            src=IMG + c["img"], rot=ROTS[i], lbl="Stops" if lang == "en" else "Paradas", todo=todo, q=q, by=by, g=d["g"]))
    html = ('<section class="pk" id="packages" aria-labelledby="pk-title">\n'
            '  <div class="pk-head"><h2 class="pk-title" id="pk-title">%s</h2><p class="pk-sub">%s</p><p class="pk-line">%s</p></div>\n'
            '  <div class="pk-grid">\n%s\n  </div>\n  <p class="pk-custom">%s</p>\n</section>\n'
            % (d["title"], d["sub"], d["line"], "\n".join(cards), d["custom"]))
    return html + PK_CSS


def book_stops(s):
    """One line with the stops under the Free tour pills (the photo slider used to show them)."""
    line = ('<p class="mwla-stops"><b data-es="Paradas:">Stops:</b> Walt Disney Concert Hall &middot; The Broad &middot; Angels Flight &middot; '
            'Grand Central Market &middot; Bradbury Building &middot; City Hall &middot; Placita Olvera</p>')
    s, n = re.subn(r'(<div class="mwla-inc-grp">[\s\S]*?</ul></div>)', r'\1\n      ' + line.replace('\\', r'\\'), s, count=1)
    assert n == 1, "free pills"
    return s + ('\n<style>.mwla-stops { font-family: "Fredoka", sans-serif; font-size: .98rem; line-height: 1.5; color: #3B4440; margin: 12px 0 0; }'
                ' .mwla-stops b { font-weight: 600; color: #27302E; }</style>\n')


# ---------------------------------------------------------------------------
# Round 3 (Nov 24): every section is a postcard (airmail edge, its own paper color); one button per section.
PC_CSS = """
<style>
  .mwpc { position: relative; padding: 30px 0; background: var(--paper, #FFF6E6); overflow: hidden; }
  .mwpc::after { content: ""; position: absolute; inset: 12px; border: 12px solid transparent; border-image: var(--stripes) 12; pointer-events: none; z-index: 3; }
  .mwpc > * { position: relative; z-index: 2; }
  @media (max-width: 640px) { .mwpc { padding: 18px 0; } .mwpc::after { inset: 6px; border-width: 7px; border-image-slice: 7; border-image-width: 7px; } }
</style>
"""
STRIPES = {
  "blue":   "repeating-linear-gradient(-45deg, #2890B6 0 16px, transparent 16px 26px, #FFD43B 26px 42px, transparent 42px 52px)",
  "orange": "repeating-linear-gradient(-45deg, #E8742A 0 16px, transparent 16px 26px, #2890B6 26px 42px, transparent 42px 52px)",
  "purple": "repeating-linear-gradient(-45deg, #7A3FA0 0 16px, transparent 16px 26px, #2E9E57 26px 42px, transparent 42px 52px)",
}

def postcard(inner, paper, stripes, extra_css=""):
    return ('<div class="mwpc" style="--paper:%s;--stripes:%s">\n%s\n</div>\n' % (paper, STRIPES[stripes], inner)) + PC_CSS + extra_css


def mapcard(src, es):
    s = (PE / src).read_text()
    # one button; the ?from=home keeps the site's footer-link script from copying it into Passports/Stamps buttons
    s, n = re.subn(r'href="/maps(\?lang=es)?"', lambda m: 'href="/maps?%sfrom=home"' % ("lang=es&amp;" if m.group(1) else ""), s)
    assert n == 1, "map href"
    css = "<style>.mwpc .rm { background: transparent !important; } .mwpc .rm::before { opacity: .35; }</style>\n"
    return postcard(s, "#E0F1F8", "blue", css)


def meetcard(src):
    s = (PE / src).read_text()
    s, n = re.subn(r'(<p class="hl-eyebrow">[^<]*</p>)\s*(<h2 class="hl-title">[^<]*</h2>)', r'\2\n      \1', s, count=1)
    assert n == 1, "meet eyebrow"
    css = "<style>.mwpc .hl-meet { background: transparent !important; } .mwpc .hl-meet::before { opacity: .35; } .mwpc .hl-title { margin-bottom: 2px; } .mwpc .hl-eyebrow { margin: 0 0 10px; }</style>\n"
    return postcard(s, "#FFE9D9", "orange", css)


IG_PHOTOS = [
  ("6ae444160f4f05b221979a15_walt%20disney%20polaroid.avif", True, "Guests with their instant photo at Walt Disney Concert Hall", "Invitados con su foto instant&aacute;nea en el Walt Disney Concert Hall"),
  ("6ad92cb3add8991e783fc5d8_guest-angels-flight-02.avif", True, "Guests riding Angels Flight", "Invitados en Angels Flight"),
  ("6ae45115ea1a111698dba65e_private%20urban%20lights.avif", True, "Guests at Urban Light with their instant photo", "Invitados en Urban Light con su foto instant&aacute;nea"),
  ("6ac74a88ff63a23a7673ee96_polaroid-griffith-sunset.webp", True, "Instant photo of a guest at sunset at Griffith", "Foto instant&aacute;nea de una invitada al atardecer en Griffith"),
  ("6ac75117a6fa1b95aee600c4_polaroid-team-ernesto-la-placita.webp", True, "Instant photo of Team Ernesto at La Placita", "Foto instant&aacute;nea del Team Ernesto en La Placita"),
  ("6ae451a4a161d7286632251d_free%20group%20polaroid.avif", True, "Instant photo of a free tour group with Ernesto", "Foto instant&aacute;nea de un grupo del free tour con Ernesto"),
]

def igstrip(es):
    t = dict(eb="@marlonwalksla", title=("Capturando momentos en LA" if es else "Capturing Moments in LA"),
             line=('<mark class="mk">Fotos instant&aacute;neas</mark> de nuestros tours y de mis aventuras por la ciudad.' if es else '<mark class="mk">Instant photos</mark> from our tours and from my own adventures around the city.'),
             btn=("S&iacute;gueme en Instagram" if es else "Follow on Instagram"))
    rots = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg", "1deg"]
    figs = []
    for i, (img, raw, en_alt, es_alt) in enumerate(IG_PHOTOS):
        figs.append('<a class="ig-ph%s" style="--rot:%s" href="https://www.instagram.com/marlonwalksla/" target="_blank" rel="noopener">%s<img src="%s%s" alt="%s" loading="lazy" decoding="async"></a>'
                    % (" is-raw" if raw else "", rots[i], "" if raw else '<span class="ig-tape" aria-hidden="true"></span>', C, img, es_alt if es else en_alt))
    html = ('<section class="ig" aria-labelledby="ig-title">\n  <div class="ig-head"><h2 class="ig-title" id="ig-title">%(title)s</h2><p class="ig-eb">%(eb)s</p><p class="ig-line">%(line)s</p></div>\n'
            '  <div class="ig-grid">\n    %(figs)s\n  </div>\n'
            '  <p class="ig-cta"><a class="ig-btn" href="https://www.instagram.com/marlonwalksla/" target="_blank" rel="noopener">%(btn)s</a></p>\n</section>\n') % dict(t, figs="\n    ".join(figs))
    css = """<style>
  .ig { max-width: 1060px; margin: 0 auto; padding: 30px 28px 34px; box-sizing: border-box; font-family: "Nunito", system-ui, sans-serif; color: #27302E; text-align: center; }
  .ig-eb { font-family: "Caveat", "Segoe Script", cursive; font-weight: 700; font-size: 1.7rem; color: #7A3FA0; margin: 0 0 6px; }
  .ig mark.mk { color: #27302E; font-weight: 700; padding: 2px 8px; border-radius: 5px; background: #FF9FD0; }
  .ig-title { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: clamp(1.9rem, 4vw, 2.8rem); line-height: 1.1; margin: 0 0 8px; }
  .ig-line { font-size: 1.05rem; line-height: 1.5; margin: 0 auto 24px; max-width: 560px; }
  .ig-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 18px; align-items: center; }
  .ig-ph { position: relative; display: block; transform: rotate(var(--rot, 0deg)); transition: transform .2s ease-out; }
  .ig-ph:hover, .ig-ph:focus-visible { transform: rotate(0deg) translateY(-4px); }
  .ig-ph img { display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; box-shadow: 0 6px 14px rgba(0,0,0,.18); }
  .ig-ph.is-raw img { aspect-ratio: auto; object-fit: contain; box-shadow: none; filter: drop-shadow(0 6px 10px rgba(0,0,0,.18)); }
  .ig-tape { position: absolute; top: -9px; left: 50%; width: 56px; height: 18px; transform: translateX(-50%) rotate(-3deg); background: rgba(255,212,59,.6); z-index: 2; }
  .ig-cta { margin: 26px 0 0; }
  .ig-btn { display: inline-block; font-family: "Lilita One", sans-serif; font-size: 1.2rem; color: #27302E !important; text-decoration: none !important; background: #FFD43B; border: 2.5px solid #27302E; border-radius: 999px; padding: 12px 28px; min-height: 44px; box-sizing: border-box; box-shadow: 4px 4px 0 #27302E; transition: transform .18s ease-out, box-shadow .18s ease-out; }
  .ig-btn:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #27302E; }
  .ig-btn:focus-visible { outline: 3px solid #2890B6; outline-offset: 4px; }
  @media (max-width: 860px) { .ig-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  @media (max-width: 480px) { .ig { padding: 22px 22px 28px; } .ig-grid { gap: 14px; } }
  @media (prefers-reduced-motion: reduce) { .ig-ph, .ig-btn { transition: none; } }
</style>
"""
    return postcard(html + css, "#F0E8F8", "purple")

OUT = {
    "home-hero-draft.html": hero("home-hero.html", False),
    "home-hero-es-draft.html": hero("home-hero-es.html", True),
    "home-book-draft.html": book_stops(book()),
    "home-packages-draft.html": packages("en"),
    "home-packages-es-draft.html": packages("es"),
    "home-routebreak-draft.html": mapcard("home-routebreak.html", False),
    "home-routebreak-es-draft.html": mapcard("home-routebreak-es.html", True),
    "home-meet-draft.html": meetcard("home-meet.html"),
    "home-meet-es-draft.html": meetcard("home-meet-es.html"),
    "home-ig-draft.html": igstrip(False),
    "home-ig-es-draft.html": igstrip(True),
    "home-team-draft.html": team("home-team.html"),
    "home-team-es-draft.html": team("home-team-es.html"),
    "home-private-draft.html": private("home-private.html", False),
    "home-private-es-draft.html": private("home-private-es.html", True),
}
for name, html in OUT.items():
    (PE / name).write_text("<!-- DRAFT (Nov 24, 2026): built by tools/make_home_draft.py from the live Home section. Only /home-draft and /es-draft load it. -->\n" + html)
    print(name, len(html))
