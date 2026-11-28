"""Nov 28, 2026: <noscript> text for /guides, /guias and the guide pages (same idea as tools/build_crawler_text.py).
Writes tools/crawler-text/guides.html, guias.html, guide-<id>-en.html, guide-<id>-es.html. Paste each into that page's
footer code in Webflow (hubs: page footer; guide pages: the template footer only works for one guide, so for now the
guide text goes on the template as the LA Tourist list; when more guides get pages, move it into a CMS field).
Run from the repo root after tools/build_guides_json.py:  python3 tools/build_guides_crawler.py
"""
import json, html
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "tools" / "crawler-text"
D = json.loads((ROOT / "guides.json").read_text())
e = html.escape


def L(o, lang):
    return (o or {}).get(lang) or (o or {}).get("en") or ""


def hub(lang):
    es = lang == "es"
    h = "<noscript><h1>%s</h1><p>%s</p><ul>" % (
        "Guías de LA gratis, por un local" if es else "Free LA Guides from a Local",
        "Elige una guía. Explora. Colecciona los sellos. Hechas por Marlon, guía local de LA, y Ernesto." if es else
        "Pick a guide. Explore. Collect the stamps. Made by Marlon, a local LA guide, and Ernesto.")
    for g in D["guides"]:
        href = ("/guias/" if es else "/guides/") + g["slug"][lang] if g["page"] else ("/mapa-los-angeles" if es else "/maps") + "?passport=" + g["id"]
        h += '<li><a href="%s">%s</a>: %s (%d %s)</li>' % (href, e(L(g["name"], lang)), e(L(g["tagline"], lang)), len(g["stops"]), "paradas" if es else "stops")
    h += '</ul><p><a href="%s">%s</a></p></noscript>' % ("/mapa-los-angeles" if es else "/maps", "Mapa de LA con 232 lugares" if es else "LA Map with 232 places")
    return h


def guide(g, lang):
    es = lang == "es"
    h = "<noscript><ol>"
    for s in g["stops"]:
        h += "<li><b>%s</b>. %s %s</li>" % (e(L(s["name"], lang)), e(L(s.get("line"), lang)), e(L(s.get("tip"), lang)))
    h += '</ol><p><a href="%s">%s</a> | <a href="%s">%s</a></p></noscript>' % (
        "/guias" if es else "/guides", "Todas las Guías de LA" if es else "All LA Guides",
        "/free-tour-los-angeles-espanol" if es else "/free-walking-tour-los-angeles", "Free tour a pie por el centro de LA" if es else "Free walking tour of Downtown LA")
    return h


OUT.mkdir(exist_ok=True)
(OUT / "guides.html").write_text(hub("en"))
(OUT / "guias.html").write_text(hub("es"))
for g in D["guides"]:
    if g["page"]:
        (OUT / ("guide-%s-en.html" % g["id"])).write_text(guide(g, "en"))
        (OUT / ("guide-%s-es.html" % g["id"])).write_text(guide(g, "es"))
for f in sorted(OUT.glob("gui*.html")):
    t = f.read_text(); assert "—" not in t
    print(f.name, len(t))
