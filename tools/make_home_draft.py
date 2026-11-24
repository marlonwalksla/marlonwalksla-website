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
    s, n = re.subn(r'<p class="mwh-cap"><strong data-tone="pink">[^<]*</strong></p>\s*(<p class="mwh-sub">[^<]*</p>)\s*<a class="mwh-btn mwh-cbtn" data-tone="pink" href="[^"]*"[^>]*>[^<]*</a>',
                   lambda m: '<a class="mwh-btn mwh-cbtn mwh-one" href="#book">%s</a>\n              %s' % (btn, m.group(1)), s, count=1)
    assert n == 1, "pink caption + button"
    # the sentence: Group and Private are packages now
    line = ('Explora LA en un <a class="mwh-hl" data-tone="pink" href="#book">free tour</a> o <a class="mwh-hl" data-tone="green" href="#packages">elige tu d&iacute;a en LA</a>.' if es else
            'Explore LA on a <a class="mwh-hl" data-tone="pink" href="#book">free tour</a> or <a class="mwh-hl" data-tone="green" href="#packages">pick your LA day</a>.')
    s, n = re.subn(r'(<p class="mwh-line" id="mwh-line">)[\s\S]*?(</p>)', lambda m: m.group(1) + line + m.group(2), s, count=1)
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
  .mwh .mwh-one { margin: 14px 0 10px; }
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
PK = {
  "en": dict(
    title="Pick Your LA Day", sub="Walk Downtown or ride across LA",
    line="Pick a day and bring your people. Marlon guides, the instant camera captures the moments.",
    cards=[
      dict(tone="green", mode="&#128694; Walking &middot; groups up to 35", name="Downtown Grand Loop",
           img="6ae4441660c929ab6108a7d5_birthday.avif", raw=True, rot="-1.2deg",
           alt="Kara's birthday group under the neon lights with their instant photo", cap="Kara's birthday crew",
           line="Five hours around Downtown LA from Grand Central Market. Great for birthdays, offsites and big groups.",
           stops="Grand Central Market &middot; Angels Flight &middot; The Broad &middot; Disney Hall &middot; City Hall",
           price="$30 per person &middot; 5 hours", todo="",
           q="I booked him to lead a birthday tour for me and my friends and he went above and beyond.", by="Kara F. &middot; Google",
           btn="See dates", href="/group-tours-los-angeles"),
      dict(tone="orange", mode="&#128656; Driving &middot; up to 5 guests", name="Hollywood + Griffith Observatory",
           img="6ad92a2e8aa41f8f19ce753e_guest-griffith-park-and-observatory-04.webp", raw=False, rot="1.3deg",
           alt="Guests watching the sunset at Griffith Observatory", cap="Sunset at Griffith Observatory",
           line="Hotel pickup, the Observatory (hike up or drive up), then lunch and photos in Hollywood.",
           stops="Griffith Observatory &middot; Hollywood sign views &middot; Walk of Fame",
           price="", todo="Price and hours to set",
           q="Marlon was flexible, I had to reschedule and he was very open to it. He is very knowledgeable, he shared so much and went over time.", by="Beatrice &middot; Google",
           btn="Plan this day", href="/private-tour-los-angeles"),
      dict(tone="blue", mode="&#128656; Driving &middot; up to 5 guests", name="Santa Monica + Venice Beach",
           img="6ad929e61c74efa5d6a35519_guest-santa-monica-01.avif", raw=False, rot="-1deg",
           alt="Guests smiling on the Santa Monica Pier", cap="Santa Monica Pier",
           line="Hotel pickup, the pier, the beach and the Venice Canals. Sunset if you want it.",
           stops="Santa Monica Pier &middot; Venice Beach &middot; Venice Canals",
           price="", todo="Price and hours to set",
           q="", by="",
           btn="Plan this day", href="/private-tour-los-angeles"),
    ],
    rating="&#9733; 4.9 from 500+ reviews", custom="Want a different day? <a href=\"/private-tour-los-angeles\">Tell Marlon where you want to go</a>."),
  "es": dict(
    title="Elige tu día en LA", sub="Camina el centro o recorre LA en auto",
    line="Elige un día y trae a tu gente. Marlon te guía y la cámara instantánea captura los momentos.",
    cards=[
      dict(tone="green", mode="&#128694; A pie &middot; grupos de hasta 35", name="Downtown Grand Loop",
           img="6ae4441660c929ab6108a7d5_birthday.avif", raw=True, rot="-1.2deg",
           alt="El grupo de cumpleaños de Kara bajo las luces de neón con su foto instantánea", cap="El cumpleaños de Kara",
           line="Cinco horas por el centro de LA desde Grand Central Market. Ideal para cumpleaños, salidas de equipo y grupos grandes.",
           stops="Grand Central Market &middot; Angels Flight &middot; The Broad &middot; Disney Hall &middot; City Hall",
           price="$30 por persona &middot; 5 horas", todo="",
           q="I booked him to lead a birthday tour for me and my friends and he went above and beyond.", by="Kara F. &middot; Google (en inglés)",
           btn="Ver fechas", href="/tours-para-grupos-los-angeles"),
      dict(tone="orange", mode="&#128656; En auto &middot; hasta 5 personas", name="Hollywood + Observatorio Griffith",
           img="6ad92a2e8aa41f8f19ce753e_guest-griffith-park-and-observatory-04.webp", raw=False, rot="1.3deg",
           alt="Personas viendo el atardecer en el Observatorio Griffith", cap="Atardecer en el Observatorio Griffith",
           line="Te recojo en tu hotel, subimos al Observatorio (caminando o en auto) y luego comida y fotos en Hollywood.",
           stops="Observatorio Griffith &middot; vistas del letrero de Hollywood &middot; Paseo de la Fama",
           price="", todo="Precio y horas por definir",
           q="Marlon was flexible, I had to reschedule and he was very open to it. He is very knowledgeable, he shared so much and went over time.", by="Beatrice &middot; Google (en inglés)",
           btn="Planea este día", href="/tours-privados-los-angeles"),
      dict(tone="blue", mode="&#128656; En auto &middot; hasta 5 personas", name="Santa Monica + Venice Beach",
           img="6ad929e61c74efa5d6a35519_guest-santa-monica-01.avif", raw=False, rot="-1deg",
           alt="Personas sonriendo en el muelle de Santa Monica", cap="Muelle de Santa Monica",
           line="Te recojo en tu hotel: el muelle, la playa y los canales de Venice. Atardecer si quieres.",
           stops="Muelle de Santa Monica &middot; Venice Beach &middot; canales de Venice",
           price="", todo="Precio y horas por definir",
           q="", by="",
           btn="Planea este día", href="/tours-privados-los-angeles"),
    ],
    rating="&#9733; 4.9 de más de 500 reseñas", custom="¿Quieres otro plan? <a href=\"/tours-privados-los-angeles\">Dile a Marlon a dónde quieres ir</a>."),
}

PK_CSS = """
<style>
  /* Packages (Nov 24, 2026 draft). The section sits in the old Group wrapper; give it the classic airmail edge and cream paper. */
  .mw-bg-team:has(#packages) { background: #FFF6E6 !important; --pc-stripes: repeating-linear-gradient(-45deg, #D9412B 0 16px, transparent 16px 26px, #2890B6 26px 42px, transparent 42px 52px); }
  .mw-bg-team:has(#packages)::before { opacity: .5; }
  .mw-bg-team:has(#packages) .w-container { max-width: 1160px; }
  .mw-bg-team:has(#packages) #team-split { display: none !important; }
  .pk { max-width: 1120px; margin: 0 auto; padding: 34px 28px 46px; box-sizing: border-box; font-family: "Nunito", system-ui, sans-serif; color: #27302E; scroll-margin-top: 70px; }
  .pk-head { text-align: center; margin: 0 auto 26px; max-width: 680px; }
  .pk-title { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: clamp(1.9rem, 4vw, 2.8rem); line-height: 1.1; margin: 0; }
  .pk-sub { font-family: "Caveat", "Segoe Script", cursive; font-weight: 700; font-size: clamp(1.5rem, 3.2vw, 1.9rem); color: #2890B6; margin: 2px 0 8px; }
  .pk-line { font-size: 1.05rem; line-height: 1.55; margin: 0; }
  .pk-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; align-items: stretch; }
  .pk-card { display: flex; flex-direction: column; background: #FFFDF7; border: 2.5px solid #27302E; border-radius: 18px; box-shadow: 4px 4px 0 #27302E; padding: 18px 18px 20px; }
  .pk-card[data-tone="green"] { background: #E8F6DF; } .pk-card[data-tone="orange"] { background: #FFE9D9; } .pk-card[data-tone="blue"] { background: #E0F1F8; }
  .pk-mode { align-self: flex-start; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: .88rem; background: #fff; border: 2px solid #27302E; border-radius: 999px; padding: 4px 12px; margin: 0 0 10px; }
  .pk-name { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.55rem; line-height: 1.15; margin: 0 0 12px; }
  .pk-photo { position: relative; margin: 6px auto 4px; width: 88%; transform: rotate(var(--rot, 0deg)); }
  .pk-photo img { display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; box-shadow: 0 6px 14px rgba(0,0,0,.18); }
  .pk-photo.is-raw img { aspect-ratio: auto; object-fit: contain; box-shadow: none; filter: drop-shadow(0 6px 10px rgba(0,0,0,.18)); }
  .pk-tape { position: absolute; top: -10px; left: 50%; width: 84px; height: 22px; transform: translateX(-50%) rotate(-3deg); background: rgba(255,212,59,.6); z-index: 2; }
  .pk-cap { text-align: center; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: .9rem; color: #4D5551; margin: 8px 0 12px; }
  .pk-text { font-size: 1rem; line-height: 1.5; margin: 0 0 8px; }
  .pk-stops { font-family: "Fredoka", sans-serif; font-size: .92rem; line-height: 1.45; color: #3B4440; margin: 0 0 10px; }
  .pk-stops b { font-weight: 600; }
  .pk-price { font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1.05rem; margin: 0 0 10px; }
  .pk-todo { color: #C0262D; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1rem; margin: 0 0 10px; }
  .pk-q { margin: 0 0 14px; }
  .pk-q blockquote { margin: 0; padding: 0 0 0 12px; border-left: 4px solid rgba(39,48,46,.2); font-size: .95rem; line-height: 1.5; color: #3B4440; font-style: italic; }
  .pk-q figcaption { margin-top: 4px; padding-left: 16px; font-size: .85rem; color: #5B6663; }
  .pk-q figcaption span, .pk-rate span { color: #E89B00; letter-spacing: 1px; }
  .pk-rate { margin: 0 0 14px; font-size: .9rem; color: #5B6663; }
  .pk-btn { margin-top: auto; align-self: center; display: inline-block; font-family: "Lilita One", sans-serif; font-size: 1.15rem; color: #27302E !important; text-decoration: none !important; background: #FFD43B; border: 2.5px solid #27302E; border-radius: 999px; padding: 12px 26px; min-height: 44px; box-sizing: border-box; box-shadow: 4px 4px 0 #27302E; transition: transform .18s ease-out, box-shadow .18s ease-out; }
  .pk-btn:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #27302E; }
  .pk-btn:focus-visible { outline: 3px solid #2890B6; outline-offset: 4px; }
  .pk-custom { text-align: center; margin: 24px 0 0; font-size: 1rem; }
  .pk-custom a { color: #1D6F8F; font-weight: 700; }
  @media (max-width: 980px) { .pk-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 680px) { .pk { padding: 22px 26px 34px; } .pk-grid { grid-template-columns: 1fr; gap: 26px; } .pk-photo { width: 78%; } }
  @media (prefers-reduced-motion: reduce) { .pk-btn { transition: none; } }
</style>
"""

def packages(lang):
    d = PK[lang]; cards = []
    for c in d["cards"]:
        price = '<p class="pk-price">%s</p>' % (c["price"] + " &middot; " + c["mode"].split("&middot; ")[1] if c["price"] else c["mode"].split("&middot; ")[1].capitalize() + " &middot; " + ("hotel pickup" if lang == "en" else "te recojo en tu hotel"))
        if c["todo"]: price += '\n  <p class="pk-todo">%s</p>' % c["todo"]
        if c["q"]:
            rev = ('<figure class="pk-q"><blockquote>&ldquo;%s&rdquo;</blockquote><figcaption><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span> %s</figcaption></figure>' % (c["q"], c["by"]))
        else:
            rev = '<p class="pk-rate"><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span> %s</p>' % d["rating"].replace("&#9733; ", "")
        lbl = "Stops" if lang == "en" else "Paradas"
        cards.append(
          '<article class="pk-card" data-tone="%(tone)s">\n'
          '  <h3 class="pk-name">%(name)s</h3>\n'
          '  <div class="pk-photo%(raw)s" style="--rot:%(rot)s">%(tape)s<img src="%(src)s" alt="%(alt)s" loading="lazy" decoding="async"></div>\n'
          '  <p class="pk-cap">%(cap)s</p>\n  <p class="pk-text">%(line)s</p>\n  <p class="pk-stops"><b>%(lbl)s:</b> %(stops)s</p>\n'
          '  %(price)s\n  %(rev)s\n  <a class="pk-btn" href="%(href)s">%(btn)s</a>\n</article>' % dict(c,
            raw=" is-raw" if c["raw"] else "", tape="" if c["raw"] else '<span class="pk-tape" aria-hidden="true"></span>',
            src=IMG + c["img"], lbl=lbl, price=price, rev=rev))
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
    css = "<style>.mwpc .hl-meet { background: transparent !important; } .mwpc .hl-meet::before { opacity: .35; }</style>\n"
    return postcard(s, "#FFE9D9", "orange", css)


IG_PHOTOS = [
  ("6ae444160f4f05b221979a15_walt%20disney%20polaroid.avif", True, "Guests with their instant photo at Walt Disney Concert Hall", "Invitados con su foto instant&aacute;nea en el Walt Disney Concert Hall"),
  ("6ad92cb3add8991e783fc5d8_guest-angels-flight-02.avif", True, "Guests riding Angels Flight", "Invitados en Angels Flight"),
  ("6ae45115ea1a111698dba65e_private%20urban%20lights.avif", True, "Guests at Urban Light with their instant photo", "Invitados en Urban Light con su foto instant&aacute;nea"),
  ("6ad92fccefa7590f943fa69d_guest-city-hall-and-grand-park-01.avif", False, "A tour group in front of City Hall", "Un grupo frente al City Hall"),
  ("6ae446ba02954dd0f02d26ec_team%20photo%20olvera%20street.avif", False, "Marlon and a big group at the Olvera Street gazebo", "Marlon y un grupo grande en el kiosco de la calle Olvera"),
  ("6ae44416b7a5edc5b105a689_Team%20800x600.avif", False, "Marlon taking a selfie with a big group at the Avila Adobe", "Marlon con un grupo grande en el Avila Adobe"),
]

def igstrip(es):
    t = dict(eb="@marlonwalksla", title=("Capturando momentos en LA" if es else "Capturing Moments in LA"),
             line=("Fotos instant&aacute;neas de nuestros tours y de mis aventuras por la ciudad." if es else "Instant photos from our tours and from my own adventures around the city."),
             btn=("S&iacute;gueme en Instagram" if es else "Follow on Instagram"))
    rots = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg", "1deg"]
    figs = []
    for i, (img, raw, en_alt, es_alt) in enumerate(IG_PHOTOS):
        figs.append('<a class="ig-ph%s" style="--rot:%s" href="https://www.instagram.com/marlonwalksla/" target="_blank" rel="noopener">%s<img src="%s%s" alt="%s" loading="lazy" decoding="async"></a>'
                    % (" is-raw" if raw else "", rots[i], "" if raw else '<span class="ig-tape" aria-hidden="true"></span>', C, img, es_alt if es else en_alt))
    html = ('<section class="ig" aria-labelledby="ig-title">\n  <div class="ig-head"><p class="ig-eb">%(eb)s</p><h2 class="ig-title" id="ig-title">%(title)s</h2><p class="ig-line">%(line)s</p></div>\n'
            '  <div class="ig-grid">\n    %(figs)s\n  </div>\n'
            '  <p class="ig-cta"><a class="ig-btn" href="https://www.instagram.com/marlonwalksla/" target="_blank" rel="noopener">%(btn)s</a></p>\n</section>\n') % dict(t, figs="\n    ".join(figs))
    css = """<style>
  .ig { max-width: 1060px; margin: 0 auto; padding: 30px 28px 34px; box-sizing: border-box; font-family: "Nunito", system-ui, sans-serif; color: #27302E; text-align: center; }
  .ig-eb { font-family: "Caveat", "Segoe Script", cursive; font-weight: 700; font-size: 1.6rem; color: #7A3FA0; margin: 0; }
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
