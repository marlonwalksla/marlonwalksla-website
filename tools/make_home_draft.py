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
import json, re
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


def prune_hero_css(s):
    """Nov 25, 2026 (speed): the hero's big style block came from the old Home and still styled
    sections that are gone (Group/Private cards, forms, tabs, dots...). Selectors listed in
    tools/hero-css-dead.json matched nothing on the new Home and /es at 360 to 1440px, in both
    hero states (checked in Chrome), so they are dropped here, with the block's comments.
    New selectors are kept by default. Re-check with the perf script if the hero changes a lot."""
    import json, tinycss2
    dead = set(json.loads((Path(__file__).resolve().parent / "hero-css-dead.json").read_text()))
    i = s.index("/* Let the old hero section")
    a = s.rindex("<style>", 0, i) + len("<style>")
    b = s.index("</style>", i)

    def rules(css):
        out = []
        for r in tinycss2.parse_rule_list(css, skip_comments=True, skip_whitespace=True):
            if r.type == "qualified-rule":
                keep = [x.strip() for x in tinycss2.serialize(r.prelude).split(",") if x.strip() not in dead]
                if keep:
                    out.append(", ".join(keep) + " {" + tinycss2.serialize(r.content).strip() + "}")
            elif r.type == "at-rule" and r.content is not None and r.at_keyword in ("media", "supports"):
                inner = rules(tinycss2.serialize(r.content))
                if inner:
                    out.append("@%s%s {\n%s\n}" % (r.at_keyword, tinycss2.serialize(r.prelude).rstrip(), "\n".join(inner)))
            elif r.type == "at-rule":
                out.append(tinycss2.serialize([r]).strip())
        return out

    css = "\n".join(rules(s[a:b]))
    return s[:a] + "\n/* trimmed by prune_hero_css (Nov 25, 2026); full history in the source hero file */\n" + css + "\n" + s[b:]


def hero(src, es):
    """Round 9 (Marlon, Nov 25): the switching photos come back, one per kind of day, each with who it is for.
    Free Tour: Downtown LA / Sunset Hike: Hollywood + Griffith / Beach Day: Santa Monica + Venice. No language pills."""
    s = prune_hero_css((PE / src).read_text())
    s = re.sub(r'\s*<div class="mwh-lang"[\s\S]*?</div>', "", s, count=1)
    assert 'class="mwh-lang"' not in s.split("<style")[0]
    # the business in one line, under "& Ernesto!"
    # Round 10 (Marlon): the three days are the switch (old highlight pills), for solo travelers, couples and families
    P = lambda i, tone, t: '<button type="button" class="mwh-hl" data-tone="%s" data-i="%d">%s</button>' % (tone, i, t)
    if es:
        # round 15 (Marlon, Nov 25): one line, then the two toggles on their own row
        tag = ('<p class="mwh-tagline">Free tours y excursiones privadas en Los &Aacute;ngeles, para viajeros solos, parejas, amigos y familias.</p>\n'
               '      <div class="mwh-who mwh-tog" role="group" aria-label="Elige un tour">%s%s</div>'
               % (P(0, "pink", "Free Tour"), P(1, "orange", "Tour Privado")))
        rate = '<p class="mwh-rate"><span aria-hidden="true">&#9733;</span> 4.9 &middot; 525+ rese&ntilde;as &middot; 7,000+ viajeros</p>'
    else:
        tag = ('<p class="mwh-tagline">Free walking tours and private tours in Los Angeles, for solo travelers, couples, friends, and families.</p>\n'
               '      <div class="mwh-who mwh-tog" role="group" aria-label="Choose a tour">%s%s</div>'
               % (P(0, "pink", "Free Tour"), P(1, "orange", "Private Tour")))
        rate = '<p class="mwh-rate"><span aria-hidden="true">&#9733;</span> 4.9 &middot; 525+ reviews &middot; 7,000+ travelers</p>'
    s, n = re.subn(r'\s*<p class="mwh-line" id="mwh-line">[\s\S]*?</p>', "\n      " + tag, s, count=1)
    assert n == 1, "hero line"
    # round 12: the rating sits right under "& Ernesto!"
    s, n = re.subn(r'(<span class="mwh-hand"[^>]*>[^<]*</span>)', lambda m: m.group(1) + "\n      " + rate, s, count=1)
    assert n == 1, "rating under hand"
    slides = re.findall(r'\s*<div class="mwh-slide[^"]*" data-tone="(\w+)"[\s\S]*?\n            </div>', s)
    assert slides == ["green", "orange", "pink"], slides
    E = "&Uacute;" if es else ""
    S = [
      dict(tone="pink", tape="rgba(255,0,255,.45)", img="6ae4fd054a1a3af597a87125_Master%20Polaroids%20(1).avif",
           alt=("Invitados del free tour en el jard&iacute;n del Avila Adobe" if es else "Free tour guests posing together at the Avila Adobe garden"),
           cap=("Free Tour a pie:<br>Centro Hist&oacute;rico de LA" if es else "Free Walking Tour:<br>Historic Downtown LA"),
           sub=("Para primerizos y amantes de la historia. Con propina, en espa&ntilde;ol e ingl&eacute;s." if es else
                "For first-timers and history lovers. Tip-based, in English and Spanish."),
           btn=("&Uacute;nete a un Free Tour" if es else "Join a Free Tour"), href="#book"),
      dict(tone="orange", tape="rgba(255,140,40,.5)", img="6ac74a88ff63a23a7673ee96_polaroid-griffith-sunset.webp",
           alt=("Foto instant&aacute;nea de una invitada al atardecer en Griffith" if es else "Instant photo of a guest at sunset at Griffith"),
           cap=("Tour Privado:<br>Hollywood, caminatas y playas" if es else "Private Tour:<br>Hollywood, Hikes &amp; Beaches"),
           sub=("Excursiones guiadas en espa&ntilde;ol para parejas, familias y grupos peque&ntilde;os, con recogida en tu hotel." if es else
                "Guided days for couples, families, and small groups, with hotel pickup."),
           btn=("Explora los tours" if es else "Explore Tours"), href="#packages"),
    ]
    html = []
    for k, d in enumerate(S):
        on = k == 0
        html.append(
          '\n            <div class="mwh-slide%(on)s" data-tone="%(tone)s">\n'
          '              <a class="mwh-photo" href="%(href)s" tabindex="%(ti)s">\n'
          '                <span class="mwh-tape" style="background:%(tape)s"></span>\n'
          '                <img src="%(C)s%(img)s" alt="%(alt)s" %(load)s decoding="async">\n'
          '              </a>\n'
          '              <p class="mwh-cap"><strong data-tone="%(tone)s">%(cap)s</strong></p>\n'
          '              <p class="mwh-sub">%(sub)s</p>\n'
          '              <a class="mwh-btn mwh-cbtn" href="%(href)s" tabindex="%(ti)s">%(btn)s</a>\n'
          '            </div>' % dict(d, on=" is-on" if on else "", ti="0" if on else "-1", C=C,
                                     load='loading="eager" fetchpriority="high"' if on else 'loading="lazy"'))
    first = re.search(r'\s*<div class="mwh-slide is-on" data-tone="green"', s).start()
    last = list(re.finditer(r'\s*<div class="mwh-slide[^"]*" data-tone="pink"[\s\S]*?\n            </div>', s))[-1].end()
    s = s[:first] + "".join(html) + s[last:]
    s, n = re.subn(r'\s*<div class="mwh-dots"[\s\S]*?</div>', "", s, count=1)
    assert n == 1, "dots"
    css = """
<style>
  /* Nov 25, 2026 draft (round 9): three kinds of day in the switching photos */
  .mwh .mwh-cap strong[data-tone="blue"] { --tone: rgba(110, 190, 225, 0.55); }
  .mwh .mwh-cap strong { font-size: 1.3rem; }
  .mwh .mwh-sub { max-width: 34ch; margin-left: auto; margin-right: auto; }
  .mwh .mwh-cbtn { background: #FFD43B !important; }
  .mwh .mwh-tagline { margin: 2px 0 0; font-family: "Fredoka", system-ui, sans-serif; font-size: 1.2rem; line-height: 1.4; font-weight: 600; color: #27302E; max-width: 40ch; text-wrap: balance; }
  .mwh .mwh-who { margin: 6px 0 0; font-size: 1.05rem; line-height: 1.45; color: #3B4440; max-width: 34ch; }
  .mwh .mwh-hand { font-size: 2.7rem !important; }
  .mwh .mwh-who { line-height: 2.2 !important; font-size: 1.1rem !important; max-width: 30ch !important; }
  .mwh .mwh-hl[data-tone="blue"] { --tone: rgba(110, 190, 225, 0.6); }
  .mwh .mwh-hl { margin: 0 7px; }
  .mwh .mwh-hl.is-on { transform: scale(1.06); }
  .mwh .mwh-hl:focus:not(:focus-visible) { outline: none; }
  .mwh .mwh-rate { margin: 8px 0 0; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1.3rem; color: #27302E; }
  .mwh .mwh-rate span { color: #E89B00; }
  .mwh .mwh-sub { margin: 10px auto 0; font-size: 1rem; line-height: 1.45; color: #3B4440; }
  .mwh .mwh-cap { margin-top: 16px; }
  .mwh .mwh-cbtn { margin-top: 14px; }
  .mwh .mwh-stamps svg.stamp:nth-child(3) { display: none !important; }
  @media (min-width: 992px) {
    .mwh .mwh-wrap { grid-template-columns: auto auto !important; justify-content: center; column-gap: clamp(48px, 7vw, 110px) !important; padding-top: clamp(36px, 6vh, 72px) !important; padding-bottom: clamp(36px, 6vh, 72px) !important; min-height: 0 !important; box-sizing: border-box; align-items: center; }
    .mwh .mwh-text { display: grid !important; grid-template-columns: auto auto; grid-template-areas: "badge title" "badge hand" "badge rate" "tag tag" "who who"; column-gap: 22px; row-gap: 0; align-items: center; justify-items: start; text-align: left !important; }
    .mwh .mwh-h1 { grid-area: title; align-self: end; margin: 0 !important; font-size: clamp(2.4rem, min(5vw, 8vh), 4.3rem); }
    .mwh .mwh-ern2 { grid-area: badge; width: clamp(120px, 22vh, 200px); margin: 0 !important; }
    .mwh .mwh-hand { grid-area: hand; align-self: start; position: static !important; left: auto !important; bottom: auto !important; margin: 10px 0 0 4px !important; transform: rotate(-3deg) !important; }
    .mwh .mwh-tagline { grid-area: tag; justify-self: center; margin: clamp(18px, 3.5vh, 32px) 0 0 !important; text-align: center; }
    .mwh .mwh-who { grid-area: who; justify-self: center; text-align: center; }
    .mwh .mwh-rate { grid-area: rate; justify-self: start; align-self: start; margin: 6px 0 0 6px !important; }
    .mwh .mwh-hand { align-self: center !important; }
    .mwh .mwh-stamps svg.stamp:nth-child(1) { top: auto !important; bottom: 28px !important; left: 24px !important; }
    .mwh .mwh-car { grid-template-columns: 44px minmax(0, clamp(230px, calc((100vh - 64px - 12vh - 200px) / 1.2), 330px)) 44px !important; }
    .mwh .mwh-stamps .stamp { width: clamp(70px, 13vh, 110px) !important; height: auto !important; }
  }
  @media (max-width: 991px) { .mwh .mwh-text { align-items: center; text-align: center; } .mwh .mwh-who { margin-left: auto; margin-right: auto; } }
</style>
"""
    # round 14: the other print peeks out from behind the active one; tap it to switch
    css += """
<style>
  .mwh .mwh-nav { z-index: 6; }
  .mwh .mwh-slide.is-on { z-index: 2; }
  .mwh .mwh-slide:not(.is-on) { visibility: visible !important; opacity: 1 !important; z-index: 1; pointer-events: none; }
  .mwh .mwh-slide:not(.is-on) > *:not(.mwh-photo) { visibility: hidden; }
  .mwh .mwh-slide:not(.is-on) .mwh-photo { pointer-events: auto; cursor: pointer; opacity: .55; filter: saturate(.8); transform: translate(-22px, 8px) rotate(-5deg) !important; transition: opacity .2s ease-out, transform .25s ease-out; }
  .mwh .mwh-slide:not(.is-on) .mwh-photo:hover { opacity: .8; }
  .mwh .mwh-slide.is-on .mwh-photo { transform: rotate(2deg); }
  @media (max-width: 640px) { .mwh .mwh-slide:not(.is-on) .mwh-photo { transform: translate(-12px, 6px) rotate(-4deg) !important; } }
  @media (prefers-reduced-motion: reduce) { .mwh .mwh-slide .mwh-photo { transition: none !important; } }
  /* round 15 (Marlon, Nov 25): standalone toggle row under one headline line */
  .mwh .mwh-tog { display: flex !important; flex-wrap: wrap; justify-content: center; gap: 12px; margin: 16px 0 0 !important; line-height: 1 !important; max-width: none !important; }
  .mwh .mwh-tog .mwh-hl { margin: 0 !important; min-height: 46px; padding: 11px 20px; border-radius: 999px; border: 2px solid #27302E; font-size: 1.08rem; line-height: 1.1; letter-spacing: 0.01em !important; transform: none; box-shadow: none; color: #27302E; border-color: rgba(39, 48, 46, .3); transition: border-color .2s ease-out, box-shadow .2s ease-out, transform .2s ease-out; }
  .mwh .mwh-tog .mwh-hl:hover { border-color: rgba(39, 48, 46, .7); }
  .mwh .mwh-tog .mwh-hl.is-on { border-color: #27302E; transform: translate(-1px, -1px); box-shadow: 3px 3px 0 #27302E; }
  .mwh .mwh-tagline { max-width: 34ch; }
  .mwh .mwh-slide .mwh-sub { text-wrap: balance; }
  @media (max-width: 400px) { .mwh .mwh-tog { gap: 8px; } .mwh .mwh-tog .mwh-hl { padding: 10px 14px; font-size: 1rem; } }
  /* v16: two-line slide titles may use the full card width on phones (the arrows sit beside the photo, not the title) */
  @media (max-width: 767px) { .mwh .mwh-slide .mwh-cap { margin-left: -46px; margin-right: -46px; } .mwh .mwh-slide .mwh-sub { max-width: none !important; margin-left: -40px !important; margin-right: -40px !important; } .mwh .mwh-cap strong { font-size: 1.2rem; padding: 4px 12px; } }
  @media (max-width: 374px) { .mwh .mwh-tog .mwh-hl { padding: 10px 11px; font-size: .95rem; } .mwh .mwh-cap strong { font-size: 1.15rem; } }
  @media (min-width: 992px) {
    .mwh .mwh-tog { justify-content: center; justify-self: center; }
    .mwh .mwh-slide .mwh-sub { width: 410px; max-width: none !important; margin-left: calc((100% - 410px) / 2) !important; margin-right: calc((100% - 410px) / 2) !important; }
    .mwh .mwh-slide .mwh-cap { margin-left: calc((100% - 410px) / 2); margin-right: calc((100% - 410px) / 2); }
    .mwh .mwh-wrap, .mwh .mwh-text, .mwh .mwh-right { align-items: center; }
    .mwh .mwh-right { align-self: center; }
  }
  @media (prefers-reduced-motion: reduce) { .mwh .mwh-tog .mwh-hl { transition: none; } }
</style>
<script>
(function () {
  var car = document.querySelector(".mwh-car"); if (!car) return;
  car.addEventListener("click", function (e) {
    var a = e.target.closest(".mwh-slide:not(.is-on) .mwh-photo"); if (!a) return;
    e.preventDefault();
    var slides = [].slice.call(car.querySelectorAll(".mwh-slide")), k = slides.indexOf(a.closest(".mwh-slide"));
    var pill = document.querySelector('.mwh-hl[data-i="' + k + '"]');
    if (pill) pill.click(); else { var n = car.querySelector(".mwh-next"); if (n) n.click(); }
  }, true);
})();
</script>
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



def book_v2(s):
    """Nov 25, 2026 (Marlon via Gemini): Free Tours card as a true two-column postcard, about 30% shorter.
    Left: title, subtitle, 2-line text, 3 pills, stops, then the group photo (4:3). Right: the calendar from the top.
    No quote, no caption, no INCLUDED label, no meeting-point pill. Two ink stamps tucked into corners. SEO copy."""
    import sys as _s2
    _s2.path.insert(0, str(PE))
    import stamps as _ST
    EN = dict(title="Free Walking Tour: Downtown Los Angeles", tag="Historic walking tour for first-time visitors",
              line="Explore Downtown LA with a local guide. Start at Bunker Hill's arts district and walk through LA's history to Olvera Street (Placita Olvera), where the Spanish and Mexican pueblo began.")
    ES = dict(title="Free Tour: Centro Histórico de Los Ángeles", tag="Visita guiada histórica en español por el centro de LA",
              line="Explora el centro de Los Ángeles con un guía local. Empieza en Bunker Hill y recorre la historia de la ciudad hasta la Placita Olvera (Olvera Street), donde nació el pueblo.")
    STOPS = "Walt Disney Concert Hall · The Broad · Angels Flight · Grand Central Market · Bradbury Building · City Hall · "
    # 1. move the head text into the left column, above the photo
    m = re.search(r'<div class="mwla-book-head">\s*<div class="mwla-book-head-text">([\s\S]*?)</div>\s*</div>\s*', s)
    assert m, "book head"
    head = m.group(1)
    s = s[:m.start()] + s[m.end():]
    # 2. pills: no label, no meeting point, three in one row
    pills = ('<ul class="mwla-inc-pills mwla-pills3">'
             '<li class="yes"><span aria-hidden="true">&#9201;&#65039;</span> <span data-es="2,5 horas">2.5 hours</span></li>'
             '<li class="yes"><span aria-hidden="true">&#128155;</span> <span data-es="Basado en propinas">Tip-based</span></li>'
             '<li class="yes"><span aria-hidden="true">&#127873;</span> <span data-es="Sticker de Ernesto">Ernesto sticker</span></li></ul>')
    head, n = re.subn(r'<div class="mwla-inc-grp">[\s\S]*?</ul></div>', lambda _: pills, head, count=1); assert n == 1, "pills"
    stops = ('<p class="mwla-stops"><b data-es="Paradas:">Stops:</b> <span data-es="%sPlacita Olvera (Olvera Street)">%sOlvera Street (Placita Olvera)</span></p>' % (STOPS, STOPS))
    head, n = re.subn(r'<p class="mwla-stops">[\s\S]*?</p>', lambda _: stops, head, count=1); assert n == 1, "stops"
    head = head.replace(">Free Tours<", ">%s<" % EN["title"]).replace(">Walk Back in Time<", ">%s<" % EN["tag"])
    head, n = re.subn(r'(<p class="pc-line" data-pi="line">)[^<]*', lambda m_: m_.group(1) + EN["line"].replace("'", "&#39;"), head, count=1); assert n == 1, "line"
    stamp2 = _ST.stamp("fbo", "PLACITA OLVERA", "DOWNTOWN LA", "papel", "1781", "#7A3FA0", rot=-10, seed=8)
    s, n = re.subn(r'(<div class="mwla-fleft">)', lambda m_: m_.group(1) + '\n      <div class="mwla-fhead">' + head.strip() + '</div>', s, count=1); assert n == 1, "fleft"
    s, n = re.subn(r'(<div class="mwla-inc" id="mwla-inc">)', lambda m_: m_.group(1) + '\n        <div class="mwla-fstamp mwla-fstamp-b" aria-hidden="true">' + stamp2 + '</div>', s, count=1); assert n == 1, "inc"
    # 3. no quote, no caption
    s, n = re.subn(r'\s*<figure class="mwla-q">[\s\S]*?</figure>', "", s, count=1); assert n == 1, "quote"
    s = s.replace(' data-cap="Marlon with the whole crew" data-cap-es="Marlon con todo el grupo"', "")
    # 4. stamp on the calendar card's top-right corner
    stamp1 = _ST.stamp("fba", "ANGELS FLIGHT", "FREE TOUR", "angels", "1901", "#C2318A", rot=9, seed=5)
    s, n = re.subn(r'(<div class="mwla-fcard">)', lambda m_: m_.group(1) + '\n      <div class="mwla-fstamp mwla-fstamp-a" aria-hidden="true">' + stamp1 + '</div>', s, count=1); assert n == 1, "fcard"
    # 5. copy in the language table (page language picks these)
    m = re.search(r"const T = (\{.*?\});\n", s); assert m, "T"
    T = json.loads(m.group(1))
    T["en"].update(EN); T["es"].update(ES)
    s = s[:m.start(1)] + json.dumps(T, ensure_ascii=False) + s[m.end(1):]
    s += """
<style>/* Nov 25, 2026: Free Tours card v2 (two-column postcard, about 30% shorter) */
  .mwla-fgrid { grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) !important; gap: 34px !important; align-items: start; }
  .mwla-fhead .mwla-book-title { font-size: clamp(1.7rem, 3vw, 2.3rem); }
  .mwla-fhead .mwla-book-tag { font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1.15rem; line-height: 1.3; color: #9C1458; margin: 6px 0 10px; }
  .mwla-fhead .pc-line { max-width: none; margin: 0; font-size: 1.02rem; }
  .mwla-pills3 { margin: 14px 0 0 !important; flex-wrap: nowrap; }
  .mwla-fhead .mwla-stops { margin-top: 12px; font-size: .92rem; }
  .mwla-fleft .mwla-inc { position: relative; margin-top: 18px; }
  .mwla-inc .mws-cap, .mwla-inc .mws-dots, .mwla-inc .mws-btn { display: none !important; }
  .mwla-inc .mws-stage { aspect-ratio: 1.2 !important; }
  .mwla-inc .mws-print { --arn: 1.183; --ix: 5%; --iw: 90%; --iy: 5.9%; --ih: 79.9%; }
  .mwla-pills3 li { white-space: nowrap; padding: 5px 12px !important; font-size: .9rem !important; }
  .mwla-inc .mws { max-width: 460px; margin: 0 auto; }
  .mwla-fcard { position: relative; }
  .mwla-book-cal { max-height: 540px !important; }
  .mwla-fstamp { position: absolute; pointer-events: none; z-index: 3; }
  .mwla-fstamp svg.stamp { display: block; width: 100%; height: auto; mix-blend-mode: multiply; opacity: .9; transform: rotate(var(--r, -8deg)); }
  .mwla-fstamp-a { width: 92px; top: -30px; right: -24px; }
  .mwla-fstamp-b { width: 84px; left: -10px; bottom: -18px; z-index: 0; }
  .mwla-inc .mws { position: relative; z-index: 1; }
  @media (max-width: 991px) {
    .mwla-fgrid { grid-template-columns: minmax(0, 1fr) !important; gap: 22px !important; }
    .mwla-fstamp-a { width: 70px; top: -22px; right: -8px; }
  }
  @media (max-width: 640px) {
    .mwla-book-cal { max-height: 600px !important; }
    .mwla-pills3 { flex-wrap: wrap; }
    .mwla-fstamp-b { width: 64px; left: -4px; bottom: -12px; }
  }
</style>"""
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
           line="Five hours eating and exploring the historic center. Great for birthdays and big groups.",
           stops="Grand Central Market &middot; Angels Flight &middot; The Broad &middot; City Hall",
           price="$30 per person &middot; up to 35 guests", todo="", q=Q_KARA, btn="See details", href="/group-tours-los-angeles"),
      dict(tone="orange", name="Sunset Hikes", place="Hollywood + Griffith Observatory",
           img="6ad92a2e8aa41f8f19ce753e_guest-griffith-park-and-observatory-04.webp", raw=False, alt="Guests watching the sunset at Griffith Observatory", cap="Sunset at Griffith Observatory",
           line="Hike up to Griffith Observatory for the sunset, then dinner in Hollywood.",
           stops="Griffith Observatory &middot; Hollywood sign views &middot; Walk of Fame",
           price="Up to 4 guests &middot; hotel pickup &middot; ask for a price", todo="", q=Q_BEA, btn="See details", href="/private-tour-los-angeles"),
      dict(tone="blue", name="Beach Day", place="Santa Monica + Venice Beach",
           img="6ad929e61c74efa5d6a35519_guest-santa-monica-01.avif", raw=False, alt="Guests smiling on the Santa Monica Pier", cap="Santa Monica Pier",
           line="The pier, the beach and the Venice Canals. Stay for the sunset.",
           stops="Santa Monica Pier &middot; Venice Beach &middot; Venice Canals",
           price="Up to 4 guests &middot; hotel pickup &middot; ask for a price", todo="", q=Q_MATEO, btn="See details", href="/private-tour-los-angeles"),
    ],
    custom="Want a different day? <a href=\"/private-tour-los-angeles\">Tell Marlon where you want to go</a>."),
  "es": dict(
    title="Explora LA con un local", sub="El LA que viniste a ver, como lo vivimos aquí",
    line='Ya conoces los lugares. Te enseño cómo los vivimos: <mark class="mk" data-tone="green">dónde comemos</mark>, <mark class="mk" data-tone="orange">las mejores vistas</mark> y <mark class="mk" data-tone="pink">las historias detrás</mark>. La cámara instantánea captura los momentos.',
    g="Google (en inglés)", cards=[
      dict(tone="green", name="Ruta de comida en el centro", place="Grand Central Market",
           img="6ae4441660c929ab6108a7d5_birthday.avif", raw=True, alt="El grupo de cumpleaños de Kara bajo las luces de neón con su foto instantánea", cap="El cumpleaños de Kara",
           line="Cinco horas comiendo y explorando el centro histórico. Ideal para cumpleaños y grupos grandes.",
           stops="Grand Central Market &middot; Angels Flight &middot; The Broad &middot; City Hall",
           price="$30 por persona &middot; hasta 35 personas", todo="", q=Q_KARA, btn="Ver detalles", href="/tours-para-grupos-los-angeles"),
      dict(tone="orange", name="Caminatas al atardecer", place="Hollywood + Observatorio Griffith",
           img="6ad92a2e8aa41f8f19ce753e_guest-griffith-park-and-observatory-04.webp", raw=False, alt="Personas viendo el atardecer en el Observatorio Griffith", cap="Atardecer en el Observatorio Griffith",
           line="Subimos al Observatorio Griffith para el atardecer y cenamos en Hollywood.",
           stops="Observatorio Griffith &middot; vistas del letrero de Hollywood &middot; Paseo de la Fama",
           price="Hasta 4 personas &middot; te recojo en tu hotel &middot; pide tu precio", todo="", q=Q_BEA, btn="Ver detalles", href="/tours-privados-los-angeles"),
      dict(tone="blue", name="Día de playa", place="Santa Monica + Venice Beach",
           img="6ad929e61c74efa5d6a35519_guest-santa-monica-01.avif", raw=False, alt="Personas sonriendo en el muelle de Santa Monica", cap="Muelle de Santa Monica",
           line="El muelle, la playa y los canales de Venice. Quédate al atardecer.",
           stops="Muelle de Santa Monica &middot; Venice Beach &middot; canales de Venice",
           price="Hasta 4 personas &middot; te recojo en tu hotel &middot; pide tu precio", todo="", q=Q_MATEO, btn="Ver detalles", href="/tours-privados-los-angeles"),
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
  .pk-card { display: grid; grid-template-rows: subgrid; grid-row: span 6; row-gap: 0; background: #FFFDF7; border: 2.5px solid #27302E; border-radius: 18px; box-shadow: 4px 4px 0 #27302E; padding: 18px 18px 20px; text-align: center; }
  .pk-card[data-tone="green"] { background: #E8F6DF; } .pk-card[data-tone="orange"] { background: #FFE9D9; } .pk-card[data-tone="blue"] { background: #E0F1F8; }
  .pk-name { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.55rem; line-height: 1.1; margin: 0; align-self: end; }
  .pk-place { font-family: "Caveat", "Segoe Script", cursive; font-weight: 700; font-size: 1.3rem; line-height: 1.15; margin: 2px 0 10px; color: #3B4440; }
  .pk-card[data-tone="green"] .pk-place { color: #1E6B3A; } .pk-card[data-tone="orange"] .pk-place { color: #B4531A; } .pk-card[data-tone="blue"] .pk-place { color: #1D6F8F; }
  .pk-photo { position: relative; width: 64%; margin: 4px auto 14px; aspect-ratio: 4 / 5; }
  .pk-photo img { display: block; width: 100%; height: 100%; object-fit: cover; box-shadow: 0 6px 14px rgba(0,0,0,.18); transform: rotate(var(--rot, 0deg)); }
  .pk-photo.is-raw img { object-fit: contain; box-shadow: none; filter: drop-shadow(0 6px 10px rgba(0,0,0,.18)); }
  .pk-tape { position: absolute; top: -10px; left: 50%; width: 84px; height: 22px; transform: translateX(-50%) rotate(-3deg); background: rgba(255,212,59,.6); z-index: 2; }
  .pk-cap { font-family: "Fredoka", sans-serif; font-weight: 500; font-size: .92rem; color: #4D5551; margin: 10px 0 14px; }
  .pk-text { font-size: 1rem; line-height: 1.45; margin: 0 0 8px; text-align: center; }
  .pk-stops { font-family: "Fredoka", sans-serif; font-size: .95rem; line-height: 1.45; color: #3B4440; margin: 0 0 10px; text-align: left; }
  .pk-stops b { font-weight: 600; }
  .pk-pricebox { text-align: left; margin: 0 0 12px; }
  .pk-price { font-family: "Fredoka", sans-serif; font-weight: 600; font-size: .95rem; margin: 0 0 14px; text-align: center; color: #27302E; }
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
  @media (max-width: 680px) { .pk { padding: 22px 26px 34px; } .pk-grid { grid-template-columns: 1fr; gap: 26px; } .pk-card { grid-template-rows: none; grid-row: auto; display: flex; flex-direction: column; } .pk-btn { align-self: center; margin-top: 4px; } .pk-photo { width: 72%; } .pk-name { align-self: stretch; text-align: center; } }
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
          '  <p class="pk-text">%(line)s</p>\n'
          '  <p class="pk-price">%(price)s</p>\n'
          '  <a class="pk-btn" href="%(href)s">%(btn)s</a>\n</article>' % dict(c,
            raw=" is-raw" if c["raw"] else "", tape="" if c["raw"] else '<span class="pk-tape" aria-hidden="true"></span>',
            src=IMG + c["img"], rot=ROTS[i]))
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
    s += "\n<style>/* Nov 25, 2026: no sideways scroll at 360px (the grid took its widest child, 326px) */ .mwla-fleft { min-width: 0; } @media (max-width: 767px) { .mwla-fgrid { grid-template-columns: minmax(0, 1fr) !important; } }</style>"
    s += ("\n<style>/* round 13: compact booking card (no language label, slimmer switch, calendar capped) */"
          " .mwla-lang-label { display: none !important; }"
          " .mwla-card-h { margin: 0 0 8px !important; font-size: 1.3rem !important; }"
          " .mwla-lang-switch { margin: 0 0 8px !important; gap: 0 !important; }"
          " .mwla-lang-opt { font-size: 1rem !important; padding: 7px 20px !important; flex-direction: row !important; gap: 6px !important; }"
          " .mwla-lang-time { font-size: .85rem !important; }"
          " .mwla-fcard { align-self: start; }"
          " .mwla-book-cal { min-height: 300px !important; max-height: 460px; overflow-y: auto; -webkit-overflow-scrolling: touch; }"
          " @media (max-width: 640px) { .mwla-book-cal { max-height: 520px; } }</style>\n")
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


# ---------------------------------------------------------------------------
# Nov 25, 2026: Good to Know comes back (7 questions people search for), as a postcard under the Instagram strip.
import html as _h, sys as _sys
_sys.path.insert(0, str(PE.parent / "tools"))
from home_faq import FAQ, TXT

def faqcard(lang):
    src = (PE / ("home-faq-es.html" if lang == "es" else "home-faq.html")).read_text()
    tones = ["rgba(255,212,59,.7)", "rgba(40,144,182,.45)", "rgba(255,0,255,.4)", "rgba(96,200,96,.55)"]
    rots = ["-0.6deg", "0.5deg", "-0.4deg", "0.6deg", "-0.5deg", "0.4deg", "-0.3deg"]
    items = "\n".join('    <details class="hl-q" style="--r:%s;--t:%s"><summary>%s</summary><p>%s</p></details>'
                      % (rots[i], tones[i % 4], _h.escape(q), _h.escape(a)) for i, (q, a) in enumerate(FAQ[lang]))
    t = TXT[lang]
    s, n = re.subn(r'<h2 class="hl-title">[^<]*</h2>\s*<p class="hl-sub">[^<]*</p>[\s\S]*?(?=\s*<p class="hl-ask)',
                   lambda m: '<h2 class="hl-title">%s</h2>\n    <p class="hl-sub">%s</p>\n%s' % (t["title"], t["sub"], items), src, count=1)
    assert n == 1, "faq body"
    css = "<style>.mwpc .hl-faq { background: transparent !important; } .mwpc .hl-faq::before { opacity: .35; }</style>\n"
    return postcard(s, "#FFF6D6", "green", css)

STRIPES["green"] = "repeating-linear-gradient(-45deg, #2E9E57 0 16px, transparent 16px 26px, #FFD43B 26px 42px, transparent 42px 52px)"

# Nov 25, 2026 (Marlon's spec): the map section becomes a "click to load" facade. A still picture of the
# map sits in a 5:3 box; one tap loads the real map into the same box (no layout shift). The map code
# (Mapbox, same version and token as /maps) and spots.geojson load only after the tap.
MAPSHOT = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/6b07a8a51553f763e9bb369d_home-map-preview-780.webp"
ERNESTO_POINT = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/6ae4300b53389bcda1926254_Pointing%20(Left).avif"
MAP_STRIPES = "repeating-linear-gradient(135deg, #2890B6 0 14px, #E0F1F8 14px 28px)"

def mapfacade(es):
    # Nov 25, 2026 (Marlon): reframed as "Free LA Guides & Map". No live map on Home: the picture and the one
    # yellow button both open the guides (/maps for now; a /la-guides page may replace it later).
    t = dict(
        title=("Gu&iacute;as Gratis y Mapa de LA" if es else "Free LA Guides &amp; Map"),
        lead=("Explora Los &Aacute;ngeles como un local y sin estr&eacute;s." if es else "Explore LA like a local, with confidence."),
        body=("Gu&iacute;as por vecindario, lugares para comer y un mapa interactivo: todo lo que necesitas en un solo lugar." if es else
              "Neighborhood cheat sheets, food spots, and an interactive map: everything you need in one place."),
        btn=("Ver las Gu&iacute;as" if es else "Read the Guides"),
        href=("/maps?lang=es&amp;from=home" if es else "/maps?from=home"),
        alt=("Vista previa del mapa de recomendaciones de Los &Aacute;ngeles de Marlon con lugares favoritos de comida, compras y vistas en el centro de LA, Hollywood y Santa M&oacute;nica." if es else
             "Preview of Marlon&rsquo;s Los Angeles recommendations map showing pinned food spots, shops, and sights across Downtown LA, Hollywood, and Santa Monica."),
        ern=("Ernesto, el burrito de pi&ntilde;ata, se&ntilde;alando las gu&iacute;as" if es else "Ernesto the pi&ntilde;ata donkey pointing to the guides"),
    )
    html = """<!-- MARLONWALKSLA - HOME: FREE LA GUIDES & MAP (Nov 25, 2026). Built by tools/make_home_draft.py (mapfacade). -->
<section class="rmf" aria-label="%(title)s" data-lang="%(lang)s">
  <div class="rmf-grid">
    <h2 class="rmf-title">%(title)s</h2>
    <p class="rmf-lead">%(lead)s</p>
    <p class="rmf-body">%(body)s</p>
    <a class="rmf-box" href="%(href)s" tabindex="-1" aria-hidden="true">
      <img class="rmf-shot" src="%(shot)s" alt="%(alt)s" width="780" height="468" loading="lazy" decoding="async">
    </a>
    <div class="rmf-act">
      <a class="rmf-btn" href="%(href)s">%(btn)s</a>
    </div>
    <img class="rmf-ern" src="%(ern_src)s" alt="%(ern)s" width="541" height="800" loading="lazy" decoding="async">
  </div>
</section>
<style>
  .rmf { box-sizing: border-box; padding: 28px 20px; color: #27302E; font-family: "Nunito", system-ui, sans-serif; }
  .rmf *, .rmf *::before, .rmf *::after { box-sizing: border-box; }
  .rmf-grid { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr); grid-template-areas: "title" "lead" "body" "box" "act" "ern"; }
  .rmf-title { grid-area: title; margin: 0 0 8px; font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 28px; line-height: 1.08; color: #27302E; }
  .rmf-lead { grid-area: lead; margin: 0 0 6px; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 18px; line-height: 1.35; color: #27302E; }
  .rmf-body { grid-area: body; margin: 0 0 18px; font-family: "Nunito", sans-serif; font-size: 16px; line-height: 1.5; color: #27302E; }
  .rmf-box { grid-area: box; display: block; position: relative; width: 100%%; aspect-ratio: 5 / 3; border: 2.5px solid #27302E; border-radius: 14px; box-shadow: 4px 4px 0 #27302E; overflow: hidden; background: #E0F1F8; }
  .rmf-shot { position: absolute; inset: 0; width: 100%%; height: 100%%; display: block; object-fit: cover; }
  .rmf-act { grid-area: act; margin-top: 16px; display: flex; align-items: center; }
  .rmf-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 12px 26px; font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 18px; line-height: 1.1; letter-spacing: 0.01em; color: #27302E !important; text-decoration: none !important; background: #FFD43B; border: 2.5px solid #27302E; border-radius: 999px; box-shadow: 4px 4px 0 #27302E; transition: transform 0.18s ease-out, box-shadow 0.18s ease-out; }
  .rmf-btn:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #27302E; }
  .rmf-btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #27302E; }
  .rmf-btn:focus-visible { outline: 3px solid #2890B6; outline-offset: 4px; }
  @media (prefers-reduced-motion: reduce) { .rmf-btn { transition: none; } }
  .rmf-ern { grid-area: ern; justify-self: end; width: 88px; height: auto; margin-top: -4px; pointer-events: none; }
  @media (min-width: 900px) {
    .rmf { padding: 48px 56px; }
    .rmf-grid { grid-template-columns: 42%% minmax(0, 1fr); column-gap: 40px; grid-template-rows: 1fr auto auto auto auto auto 1fr; grid-template-areas: ". box" "title box" "lead box" "body box" "act box" "ern box" ". box"; align-items: center; }
    .rmf-box { align-self: center; }
    .rmf-title { font-size: 38px; margin-bottom: 10px; }
    .rmf-lead { font-size: 20px; }
    .rmf-body { font-size: 17px; margin-bottom: 0; }
    .rmf-act { margin-top: 22px; }
    .rmf-ern { justify-self: start; width: 135px; margin-top: 14px; transform: scaleX(-1); }
  }
</style>
<script>
(function () {
  var r = document.querySelectorAll('.rmf a');
  for (var i = 0; i < r.length; i++) if (!r[i].getAttribute('data-ga')) { r[i].setAttribute('data-ga', '1'); r[i].addEventListener('click', function () { try { if (window.gtag) gtag('event', 'home_guides_click', { lang: document.documentElement.lang || '' }); } catch (e) {} }); }
})();
</script>
""" % dict(t, lang=("es" if es else "en"), shot=MAPSHOT, ern_src=ERNESTO_POINT)
    return postcard(html, "#FFF6E6", "mapblue")

STRIPES["mapblue"] = MAP_STRIPES

# Nov 25, 2026 (Marlon): after a date tap, Cal.com scrolls the page on phones (it jumps to the top of the calendar
# when you are partway down it, "__routeChanged", or scrolls toward the times, "__scrollByDistance"). Drop those two
# messages (capture listener runs before the embed's own) so the calendar stays put and the times appear below it.
CAL_NOSCROLL = """<script>
(function () {
  if (window.__mwCalNoScroll) return; window.__mwCalNoScroll = true;
  // After a date tap the calendar also scrolls its own time list into view, and the browser passes that scroll up
  // to the page. So for 1.5 s after each tap, keep the page where it was unless the visitor scrolls on the page.
  var holdY = 0, until = 0;
  function release() { until = 0; }
  ['wheel', 'touchmove', 'keydown'].forEach(function (ev) { window.addEventListener(ev, release, { passive: true }); });
  window.addEventListener('scroll', function () {
    if (until && Date.now() < until && Math.abs(window.scrollY - holdY) > 2) window.scrollTo({ top: holdY, behavior: 'instant' });
  }, { passive: true });
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || typeof d !== 'object' || typeof d.fullType !== 'string') return;
    if (!/(^|\\.)cal\\.com$/.test((e.origin || '').replace(/^https?:\\/\\//, ''))) return;
    if (/__routeChanged$/.test(d.fullType)) { holdY = window.scrollY; until = Date.now() + 1500; }
    if (/__(scrollByDistance|routeChanged)$/.test(d.fullType)) e.stopImmediatePropagation();
  }, true);
})();
</script>
"""

OUT = {
    "home-hero-draft.html": hero("home-hero.html", False),
    "home-hero-es-draft.html": hero("home-hero-es.html", True),
    "home-book-draft.html": book_v2(book_stops(book())) + CAL_NOSCROLL,
    "home-packages-draft.html": packages("en"),
    "home-packages-es-draft.html": packages("es"),
    "home-routebreak-draft.html": mapfacade(False),
    "home-routebreak-es-draft.html": mapfacade(True),
    "home-meet-draft.html": meetcard("home-meet.html"),
    "home-meet-es-draft.html": meetcard("home-meet-es.html"),
    "home-ig-draft.html": igstrip(False),
    "home-ig-es-draft.html": igstrip(True),
    "home-faq-draft.html": faqcard("en"),
    "home-faq-es-draft.html": faqcard("es"),
    "home-team-draft.html": team("home-team.html"),
    "home-team-es-draft.html": team("home-team-es.html"),
    "home-private-draft.html": private("home-private.html", False),
    "home-private-es-draft.html": private("home-private-es.html", True),
}
for name, html in OUT.items():
    (PE / name).write_text("<!-- DRAFT (Nov 24, 2026): built by tools/make_home_draft.py from the live Home section. Only /home-draft and /es-draft load it. -->\n" + html)
    print(name, len(html))

# Nov 25, 2026 (speed): the hero is pasted straight into the Home and /es embed (Webflow element
# e2a6c92c-f998-5c7c-e007-3a5db12425a2 on both pages), not fetched. These are the paste-ready copies:
# HTML comments stripped, must stay under Webflow's 50,000-character embed limit.
# Nov 25, 2026 (split): the embed keeps only the words, photos and one tiny width script (~3,000 chars),
# so copy edits are small. Styles go to page-embeds/home-hero.css, the slider and form scripts plus the
# ink stamps (EN and ES) to page-embeds/home-hero.js. Both are loaded from jsDelivr pinned to the commit
# in tools/hero-assets-sha.txt (cached for a year). After changing styles/scripts/stamps: run this,
# commit and push, put the new commit hash in tools/hero-assets-sha.txt, run again, paste the embeds.
_T = Path(__file__).resolve().parent
_sha = (_T / "hero-assets-sha.txt").read_text().strip()
_cdn = "https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@%s/page-embeds/" % _sha
_css, _js, _stamps = None, None, {}
_WIDTH = "<script>\n/* Full-width hero: use the width WITHOUT the scrollbar so the airmail edge is not cut at the screen sides */\n(function(){var h=document.querySelector('.mwh');if(!h)return;function f(){h.style.setProperty('--mwh-w',document.documentElement.clientWidth+'px');}f();window.addEventListener('resize',f);document.addEventListener('DOMContentLoaded',f);})();\n</script>"
for _src, _lang in (("home-hero-draft", "en"), ("home-hero-es-draft", "es")):
    _s = re.sub(r"<!--.*?-->\s*", "", (PE / (_src + ".html")).read_text(), flags=re.S)
    _st = re.findall(r"<style>([\s\S]*?)</style>", _s)
    _sc = [x for x in re.findall(r"<script>[\s\S]*?</script>", _s)]
    assert _WIDTH in _sc, "width script"
    _keep = [_WIDTH] + [x for x in _sc if "Spanish Home:" in x]
    _shared = [re.sub(r"^<script>|</script>$", "", x).strip() for x in _sc if x not in _keep]
    _c = "\n".join(x.strip() for x in _st)
    _j = "\n;\n".join(_shared)
    assert _css in (None, _c) and _js in (None, _j), "EN and ES hero styles/scripts differ"
    _css, _js = _c, _j
    _m = re.search(r'(<div class="mwh-stamps" aria-hidden="true">)([\s\S]*?)(</div>\s*</div>\s*</section>)', _s)
    _stamps[_lang] = _m.group(2)
    _mark = _s[:_m.start(2)] + _s[_m.end(2):]
    _mark = re.sub(r"<style>[\s\S]*?</style>\s*|<script>[\s\S]*?</script>\s*", "", _mark).strip()
    _out = ("<!-- Home hero (split Nov 25, 2026). Source: page-embeds/%s.html, built by tools/make_home_draft.py. Styles, scripts and stamps: page-embeds/home-hero.css/.js @ %s. -->\n" % (_src, _sha[:7])
            + '<link rel="stylesheet" href="%shome-hero.css">\n' % _cdn + _mark + "\n" + "\n".join(_keep)
            + '\n<script src="%shome-hero.js" defer></script>\n' % _cdn)
    assert len(_out) < 50000, (_src, len(_out))
    (_T / ("home-hero-embed-%s.html" % _lang)).write_text(_out)
    print("embed", _lang, len(_out), "chars")
(PE / "home-hero.css").write_text("/* Home and /es hero styles. Built by tools/make_home_draft.py from page-embeds/home-hero-draft.html. Do not edit by hand. */\n" + _css + "\n")
(PE / "home-hero.js").write_text("/* Home and /es hero: ink stamps, slider and form helpers. Built by tools/make_home_draft.py. Do not edit by hand. */\n"
    + "(function(){var S=" + json.dumps(_stamps) + ";var b=document.querySelector('.mwh .mwh-stamps');if(b&&!b.firstChild){var l=(document.querySelector('.mwh')||{}).lang==='es'?'es':'en';b.innerHTML=S[l];}})();\n;\n"
    + _js + "\n")
print("home-hero.css", len(_css), "home-hero.js", len(_js))
