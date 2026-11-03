#!/usr/bin/env python3
"""Crawler text for /passports and /pasaportes (noscript block for the page footer in Webflow).
Built from passports.json. Output: tools/crawler-text/passports.html and pasaportes.html.
Stamp pages that are published (Downtown Classic) get links to /stamps/<passport>-<stamp>."""
import json, os, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(ROOT, "passports.json"), encoding="utf-8"))
LINKED = {"downtown-classic"}  # passports whose stamp pages are published
e = html.escape

def build(es):
    L = lambda o: (o.get("es") or o["en"]) if es else o["en"]
    lang = "es" if es else "en"
    h = ['<noscript>', '<!-- Crawler text. Built by tools/build_passports_crawler.py from passports.json. Only shown when JavaScript is off. -->', '<div class="mw-crawler-text">']
    if es:
        h += ['<h1>Pasaportes de Los Ángeles</h1>',
              '<p>Explora la ciudad un sello a la vez. Elige un pasaporte, ve a cada lugar y sella. Gratis, sin cuenta; tus sellos se guardan en tu navegador. Hecho por Marlon, guía local de Los Ángeles.</p>',
              '<h2>Elige un pasaporte</h2>']
    else:
        h += ['<h1>LA Passports</h1>',
              '<p>Explore the city one stamp at a time. Pick a passport, go to each place and stamp it. Free, no account; your stamps are saved in your browser. Made by Marlon, a local Los Angeles guide.</p>',
              '<h2>Pick a passport</h2>']
    for p in D["passports"]:
        soon = p.get("status") == "coming-soon" or not p["stamps"]
        h.append('<h3>%s</h3>' % e(L(p["name"])))
        h.append('<p>%s%s</p>' % (e(L(p["tagline"])), (' (Muy pronto)' if es else ' (Coming soon)') if soon else ''))
        places = [s for s in p["stamps"] if not s.get("bonus")]
        if places:
            items = []
            for s in places:
                nm = e(L(s["name"]))
                if p["id"] in LINKED:
                    items.append('<li><a href="/stamps/%s-%s%s">%s</a></li>' % (p["id"], s["id"], "?lang=es" if es else "", nm))
                else:
                    items.append('<li>%s</li>' % nm)
            h.append('<ul>\n' + '\n'.join(items) + '\n</ul>')
    h.append('<p><a href="%s">%s</a></p>' % (("/mapa-los-angeles", "Explora todos los lugares en el mapa") if es else ("/maps", "Explore all places on the map")))
    h += ['</div>', '</noscript>']
    return '\n'.join(h) + '\n'

os.makedirs(os.path.join(ROOT, "tools", "crawler-text"), exist_ok=True)
for es, name in ((False, "passports.html"), (True, "pasaportes.html")):
    t = build(es)
    open(os.path.join(ROOT, "tools", "crawler-text", name), "w", encoding="utf-8").write(t)
    print(name, len(t), "bytes")
