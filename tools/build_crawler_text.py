#!/usr/bin/env python3
"""Builds the crawler text (a <noscript> block) for each page from the section files in page-embeds/.
Why: the sections load through mw.js after the page opens, so a crawler that does not run JavaScript sees almost nothing.
The block is only shown when JavaScript is off. Visitors never see it. Crawlers read it.
Run:  python3 tools/build_crawler_text.py        -> writes tools/crawler-text/<page>.html
Then paste each file into the page's footer custom code in Webflow (Claude does this with the Webflow tools).
Re-run after changing copy in a section."""
import html as H, os, re, sys
from html.parser import HTMLParser
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PE = os.path.join(ROOT, "page-embeds")
OUT = os.path.join(ROOT, "tools", "crawler-text")
SKIP = {"style", "script", "svg", "noscript", "template", "button", "input", "select", "textarea", "form", "iframe"}
KEEP = {"h1", "h2", "h3", "h4", "p", "li", "blockquote", "summary", "figcaption", "dt", "dd"}

class X(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True); self.stack = []; self.out = []; self.cur = None; self.skip = 0; self.href = None; self.hid = 0
    def handle_starttag(self, t, a):
        a = dict(a)
        if t in SKIP: self.skip += 1; return
        if "hidden" in a or a.get("aria-hidden") == "true" and t not in ("li",): self.hid += 1; self.stack.append((t, True)); return
        self.stack.append((t, False))
        if self.skip or self.hid: return
        if t in KEEP: self.cur = [t, ""]
        if t == "a" and self.cur is not None: self.href = a.get("href"); self.cur[1] += "\x01"
        if t == "br" and self.cur is not None: self.cur[1] += " "
    def handle_endtag(self, t):
        if t in SKIP: self.skip = max(0, self.skip - 1); return
        while self.stack and self.stack[-1][0] != t: self.stack.pop()
        if self.stack:
            _, h = self.stack.pop()
            if h: self.hid -= 1
        if self.skip or self.hid: return
        if t in KEEP and self.cur and self.cur[0] == t:
            txt = re.sub(r"\s+", " ", self.cur[1].replace("\x01", "")).strip()
            if txt: self.out.append((t, txt))
            self.cur = None
    def handle_data(self, d):
        if not self.skip and not self.hid and self.cur is not None: self.cur[1] += d

def extract(name):
    p = os.path.join(PE, name + ".html")
    if not os.path.exists(p): return []
    s = open(p, encoding="utf-8").read()
    s = re.sub(r"<!--.*?-->", "", s, flags=re.S)
    x = X(); x.feed(s); return x.out

PAGES = {
 "home": ["home-hero", "home-reviews-strip", "home-head-team-en", "home-team", "home-team-card", "home-routebreak", "home-head-priv-en", "home-private", "home-private-calc", "home-meet", "home-book", "home-faq"],
 "home-es": ["home-hero-es", "home-reviews-strip-es", "home-head-team-es", "home-team-es", "home-team-card-es", "home-routebreak-es", "home-head-priv-es", "home-private-es", "home-private-calc-es", "home-meet-es", "home-book", "home-faq-es"],
}

def esc(t): return H.escape(t, quote=False)

def pick(sec, tag, idx=0):
    items = [x for t, x in extract(sec) if t == tag]
    return items[idx] if len(items) > idx else ""

# Facts that come from widgets (sliders, calendars) and so are not in the section text. Update here when prices or times change.
# Prices: Team = slider in home-team-card (total for 15 people is the default shown). Private = rule of thumb shown in home-private-calc.
FACTS = {
 "en": dict(
  h1="Explore LA with Marlon", lede="Free, team and private walking tours of Los Angeles with a local guide, in English and Spanish.",
  free_h="Free Walking Tour of Downtown LA", free_extra="English tour at 12:30 PM and Spanish tour at 9:30 AM. Meet at Walt Disney Concert Hall, 600 W 1st St. Free to book, tip what feels right at the end. The walk takes 2 to 2.5 hours and covers about 1.8 miles (2.9 km) on foot. Everyone gets a free Ernesto sticker. Food, drinks and parking are not included.",
  free_link=("/free-walking-tour-los-angeles", "Free walking tour in English"), free_link2=("/free-tour-los-angeles-espanol", "Free tour en español"),
  team_h="Team Outing Walking Tours", team_extra="Pricing for 5 to 20 guests: for example about $790 for 15 people (about $53 per person). The price per person goes down as the group grows. Lunch is either bought by each guest at Grand Central Market, or Marlon arranges catering for your group.",
  team_link=("/team-outings-los-angeles", "Team outing walking tours in Downtown LA"),
  priv_h="Private Tours of Los Angeles", priv_extra="Choose a plan (Date Night, Family Outing, Fun with Friends or design your own day), pick your places and get an estimate. About $20 to $40 per person per hour; bigger groups and longer tours cost less per person. Tours run 2 to 12 hours, for 2 to 4 guests.",
  priv_link=("/private-tour-los-angeles", "Private tours of Los Angeles"),
  rev_h="Reviews", rev_extra="505 reviews across Google, Civitatis, GuruWalk, FreeTour.com and Viator, 4.86 average. Google: 309 reviews, 4.95.",
  map_link=("/maps", "Interactive LA map and trip planner"), about_link=("/about", "About Marlon"), hist_link=("/history", "LA history stories"),
  faq_h="Good to Know", meet_h="Meet Your Local Guide"),
 "es": dict(
  h1="Explora LA con Marlon", lede="Tours a pie gratis, para equipos y privados por Los Ángeles con un guía local, en español e inglés.",
  free_h="Free tour a pie por el centro de Los Ángeles", free_extra="Tour en español a las 9:30 AM y en inglés a las 12:30 PM. Punto de encuentro: Walt Disney Concert Hall, 600 W 1st St. Reserva gratis y deja la propina que quieras al final. El recorrido dura de 2 a 2.5 horas y son unos 2.9 km (1.8 millas) a pie. Todos reciben una calcomanía de Ernesto gratis. La comida, las bebidas y el estacionamiento no están incluidos.",
  free_link=("/free-tour-los-angeles-espanol", "Free tour por Los Ángeles en español"), free_link2=("/free-walking-tour-los-angeles", "Free tour in English"),
  team_h="Salidas de equipo a pie", team_extra="Precio para 5 a 20 personas: por ejemplo unos $790 para 15 personas (unos $53 por persona). El precio por persona baja a medida que crece el grupo. El almuerzo lo compra cada quien en Grand Central Market, o Marlon organiza un catering para tu grupo.",
  team_link=("/salidas-de-equipo-los-angeles", "Salidas de equipo a pie en el centro de LA"),
  priv_h="Tours privados por Los Ángeles", priv_extra="Elige un plan (Cita en pareja, Salida en familia, Con amigos o diseña tu día), escoge tus lugares y recibe un estimado. Unos $20 a $40 por persona por hora; los grupos más grandes y los tours más largos cuestan menos por persona. Los tours duran de 2 a 12 horas, para 2 a 4 personas.",
  priv_link=("/tours-privados-los-angeles", "Tours privados por Los Ángeles"),
  rev_h="Opiniones", rev_extra="505 opiniones en Google, Civitatis, GuruWalk, FreeTour.com y Viator, promedio de 4,86. Google: 309 opiniones, 4,95.",
  map_link=("/mapa-los-angeles", "Mapa interactivo de LA y pasaportes"), about_link=("/about", "Sobre Marlon"), hist_link=("/historia-de-los-angeles", "Historia de LA"),
  faq_h="Bueno saber", meet_h="Conoce a tu guía local"),
}

def build(page):
    es = page.endswith("-es"); F = FACTS["es" if es else "en"]; secs = PAGES[page]
    sx = "-es" if es else ""
    team = pick("home-head-team-" + ("es" if es else "en"), "p", 1); priv = max([x for t, x in extract("home-head-priv-" + ("es" if es else "en")) if t == "p"], key=len)
    free = pick("home-book", "p", 1)
    if es:  # the shared Free tour section holds its Spanish text in a JS table
        import json; free = json.loads(re.search(r"const T = (\{.*?\});\n", open(os.path.join(PE, "home-book.html"), encoding="utf-8").read(), re.S).group(1))["es"]["line"]
    meet = [x for t, x in extract("home-meet" + sx) if t == "p"][1:3]
    pills_free = [x for t, x in extract("home-book") if t == "li"]
    o = ["<noscript>", "<!-- Crawler text. Built by tools/build_crawler_text.py from page-embeds/. Only shown when JavaScript is off. -->", '<div class="mw-crawler-text">']
    o += [f"<h1>{esc(F['h1'])}</h1>", f"<p>{esc(F['lede'])}</p>"]
    o += [f"<h2>{esc(F['free_h'])}</h2>", f"<p>{esc(free)}</p>", f"<p>{esc(F['free_extra'])}</p>"]
    o += [f'<p><a href="{F["free_link"][0]}">{esc(F["free_link"][1])}</a> · <a href="{F["free_link2"][0]}">{esc(F["free_link2"][1])}</a></p>']
    o += [f"<h2>{esc(F['team_h'])}</h2>", f"<p>{esc(team)}</p>", f"<p>{esc(F['team_extra'])}</p>", f'<p><a href="{F["team_link"][0]}">{esc(F["team_link"][1])}</a></p>']
    o += [f"<h2>{esc(F['priv_h'])}</h2>", f"<p>{esc(priv)}</p>", f"<p>{esc(F['priv_extra'])}</p>", f'<p><a href="{F["priv_link"][0]}">{esc(F["priv_link"][1])}</a></p>']
    o += [f"<h2>{esc(F['rev_h'])}</h2>", f"<p>{esc(F['rev_extra'])}</p>"]
    o += [f"<h2>{esc(F['meet_h'])}</h2>"] + [f"<p>{esc(m)}</p>" for m in meet] + [f'<p><a href="{F["about_link"][0]}">{esc(F["about_link"][1])}</a> · <a href="{F["map_link"][0]}">{esc(F["map_link"][1])}</a> · <a href="{F["hist_link"][0]}">{esc(F["hist_link"][1])}</a></p>']
    o += [f"<h2>{esc(F['faq_h'])}</h2>"]
    faq = [(t, x) for t, x in extract("home-faq" + sx) if t in ("summary", "p")]
    for t, x in faq:
        if t == "summary": o.append(f"<h3>{esc(x)}</h3>")
        elif not x.startswith(("Quick answers", "Respuestas rápidas")): o.append(f"<p>{esc(x)}</p>")
    o += ["</div>", "</noscript>"]
    return "\n".join(o)

# The other landing pages are written in their own section files, so their crawler text is a straight copy of those sections.
OTHER = {
 "free-en": ["free-en"], "free-es": ["free-es"],
 "team": ["team-top", "team-form-intro", "team-bottom"], "private": ["private-top", "private-form-intro", "private-bottom"],
 "team-es": ["team-top-es", "team-form-intro-es", "team-bottom-es"], "private-es": ["private-top-es", "private-form-intro-es", "private-bottom-es"],
 "history": ["history-hub"], "history-es": ["history-hub-es"],
}
# Text to leave out: placeholders and drafts that still have a question mark for Marlon to answer (see CLAUDE.md, .tp-todo).
DRAFT = ("Deposit to book?", "how much do you keep?", "included or extra?", "Which areas:", "Loading calendar")

def build_other(page):
    o = ["<noscript>", "<!-- Crawler text. Built by tools/build_crawler_text.py from page-embeds/. Only shown when JavaScript is off. -->", '<div class="mw-crawler-text">']
    skip_next_p = False; seen = set(); items = []
    for sec in OTHER[page]:
        for t, x in extract(sec):
            if t == "li" and x.startswith("\u2713"): x = x[1:].strip()
            items.append((t, x))
    last_summary_ok = True
    for t, x in items:
        if x in seen: continue
        seen.add(x)
        if t in ("h1", "h2"): last_summary_ok = True
        if t == "summary":
            # find its answer: next p
            idx = items.index((t, x)); ans = items[idx + 1][1] if idx + 1 < len(items) and items[idx + 1][0] == "p" else ""
            last_summary_ok = not any(d in ans for d in DRAFT); 
            if last_summary_ok: o.append(f"<h3>{esc(x)}</h3>")
            continue
        if any(d in x for d in DRAFT): continue
        if t == "p" and not last_summary_ok:
            last_summary_ok = True; continue
        tag = {"h1": "h1", "h2": "h2", "h3": "h3", "p": "p", "li": "li", "blockquote": "blockquote"}.get(t)
        if not tag: continue
        if tag == "li" and (not o[-1].startswith("<li") and o[-1] != "<ul>"): o.append("<ul>")
        if tag != "li" and o[-1].startswith("<li"): o.append("</ul>")
        o.append(f"<{tag}>{esc(x)}</{tag}>")
    if o[-1].startswith("<li"): o.append("</ul>")
    o += ["</div>", "</noscript>"]
    return "\n".join(o)

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    only = sys.argv[1:]
    for page in PAGES:
        if only and page not in only: continue
        h = build(page); open(os.path.join(OUT, page + ".html"), "w", encoding="utf-8").write(h); print(page, len(h), "chars")
    for page in OTHER:
        if only and page not in only: continue
        h = build_other(page); open(os.path.join(OUT, page + ".html"), "w", encoding="utf-8").write(h); print(page, len(h), "chars")
