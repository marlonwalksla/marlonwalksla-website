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
    for i, anchor in ((0, "#team"), (1, "#private"), (2, "#book")):
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
    # the button books on this page (the calendar sits right under the reviews now)
    s = re.sub(r'(<a class="mwh-btn mwh-cbtn" data-tone="pink" href=")[^"]*"', r'\1#book"', s, count=1)
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


OUT = {
    "home-hero-draft.html": hero("home-hero.html", False),
    "home-hero-es-draft.html": hero("home-hero-es.html", True),
    "home-book-draft.html": book(),
    "home-team-draft.html": team("home-team.html"),
    "home-team-es-draft.html": team("home-team-es.html"),
    "home-private-draft.html": private("home-private.html", False),
    "home-private-es-draft.html": private("home-private-es.html", True),
}
for name, html in OUT.items():
    (PE / name).write_text("<!-- DRAFT (Nov 24, 2026): built by tools/make_home_draft.py from the live Home section. Only /home-draft and /es-draft load it. -->\n" + html)
    print(name, len(html))
