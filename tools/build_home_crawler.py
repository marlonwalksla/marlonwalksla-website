"""Nov 25, 2026: crawler text (<noscript>) for the new Home and /es (two paths, packages, FAQ).
Run: python3 tools/build_home_crawler.py  ->  tools/crawler-text/home.html and home-es.html
Paste each into that page's footer code in Webflow, replacing the old <noscript> block (keep the scripts above it)."""
import html, io, contextlib, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
with contextlib.redirect_stdout(io.StringIO()):
    import make_home_draft as D          # also rebuilds the section files (same output)
from home_faq import FAQ, TXT

def t(x):  # section strings hold HTML entities and <mark> tags
    return html.escape(html.unescape(re.sub(r"<[^>]+>", "", x)), quote=False)

COPY = {
 "en": dict(h1="Explore LA with Marlon", lead="Explore Los Angeles with a local, for solo travelers, couples, friends, and families. Free Walking Tour or Private Tours. 4.9 stars from 525 reviews.",
   free_h="Free Walking Tour of Historic Downtown LA",
   free=["Come walk LA's historic downtown. Start at Bunker Hill, home of LA's arts buildings, then walk backwards in time to Placita Olvera, where the Spanish and Mexican pueblo began.",
         "For first-timers and history lovers. English tour at 12:30 PM and Spanish tour at 9:30 AM. Meet at Walt Disney Concert Hall, 600 W 1st St. Free to book, tip what feels right at the end. About 2.5 hours on foot.",
         "Stops: Walt Disney Concert Hall, The Broad, Angels Flight, Grand Central Market, Bradbury Building, City Hall, Placita Olvera."],
   free_links='<a href="/free-walking-tour-los-angeles">Free walking tour in English</a> · <a href="/free-tour-los-angeles-espanol">Free tour en español</a>',
   rev_h="Reviews", rev="525 reviews across Google, Civitatis, GuruWalk, FreeTour.com and Viator, 4.9 average, 295 in Spanish. Google: 329 reviews, 4.95.",
   map_h="LA Recommendations Map", map='Food, shopping and more, all on one map. <a href="/maps">Explore the map</a>',
   meet_h="Meet Your Local Guide", meet="I was born a few minutes from where my free tour starts, and I grew up speaking Spanish at home. Today I guide walks around Los Angeles in English and Spanish, with my sidekick Ernesto.",
   meet_links='<a href="/about">About Marlon</a> · <a href="/history">LA history stories</a>',
   ig_h="Capturing Moments in LA", ig='Instant photos from our tours and from my own adventures around the city. <a href="https://www.instagram.com/marlonwalksla/">@marlonwalksla on Instagram</a>'),
 "es": dict(h1="Explora LA con Marlon", lead="Explora Los Ángeles con un local, para viajeros solos, parejas, amigos y familias. Free tour en español o tours privados. 4,9 estrellas en 525 reseñas.",
   free_h="Free tour a pie por el centro histórico de Los Ángeles",
   free=["Ven a caminar por el centro histórico de LA. Empezamos en Bunker Hill, donde están los edificios de las artes de LA, y retrocedemos en el tiempo hasta la Placita Olvera, donde nació el pueblo español y mexicano.",
         "Para primerizos y amantes de la historia. Tour en español a las 9:30 AM y en inglés a las 12:30 PM. Punto de encuentro: Walt Disney Concert Hall, 600 W 1st St. Reserva gratis y deja la propina que quieras al final. Unas 2,5 horas a pie.",
         "Paradas: Walt Disney Concert Hall, The Broad, Angels Flight, Grand Central Market, Bradbury Building, City Hall, Placita Olvera."],
   free_links='<a href="/free-tour-los-angeles-espanol">Free tour por Los Ángeles en español</a> · <a href="/free-walking-tour-los-angeles">Free tour in English</a>',
   rev_h="Reseñas", rev="525 reseñas en Google, Civitatis, GuruWalk, FreeTour.com y Viator, promedio de 4,9; 295 en español. Google: 329 reseñas, 4,95.",
   map_h="Mapa de recomendaciones de LA", map='Comida, compras y más, todo en un mapa. <a href="/mapa-los-angeles">Explora el mapa</a>',
   meet_h="Conoce a tu guía local", meet="Nací a pocos minutos de donde empieza mi free tour y crecí hablando español en casa. Hoy guío caminatas por Los Ángeles en español y en inglés, con mi compañero Ernesto.",
   meet_links='<a href="/about">Sobre Marlon</a> · <a href="/historia-de-los-angeles">Historia de LA</a>',
   ig_h="Capturando momentos en LA", ig='Fotos instantáneas de nuestros tours y de mis aventuras por la ciudad. <a href="https://www.instagram.com/marlonwalksla/">@marlonwalksla en Instagram</a>'),
}

def build(lang):
    c, P = COPY[lang], D.PK[lang]
    o = ["<noscript>", "<!-- Crawler text. Built by tools/build_home_crawler.py (Nov 25, 2026 Home). Only shown when JavaScript is off. -->",
         '<div class="mw-crawler-text">', "<h1>%s</h1>" % c["h1"], "<p>%s</p>" % c["lead"], "<h2>%s</h2>" % c["free_h"]]
    o += ["<p>%s</p>" % p for p in c["free"]] + ["<p>%s</p>" % c["free_links"], "<h2>%s</h2>" % c["rev_h"], "<p>%s</p>" % c["rev"],
          "<h2>%s</h2>" % t(P["title"]), "<p>%s %s</p>" % (t(P["sub"]) + ".", t(P["line"]))]
    for card in P["cards"]:
        o += ["<h3>%s: %s</h3>" % (t(card["name"]), t(card["place"])), '<p>%s %s. <a href="%s">%s</a></p>' % (t(card["line"]), t(card["price"]), card["href"], t(card["btn"]))]
    o += ["<h2>%s</h2>" % c["map_h"], "<p>%s</p>" % c["map"], "<h2>%s</h2>" % c["meet_h"], "<p>%s</p>" % c["meet"], "<p>%s</p>" % c["meet_links"],
          "<h2>%s</h2>" % c["ig_h"], "<p>%s</p>" % c["ig"], "<h2>%s</h2>" % TXT[lang]["title"]]
    for q, a in FAQ[lang]:
        o += ["<h3>%s</h3>" % html.escape(q, quote=False), "<p>%s</p>" % html.escape(a, quote=False)]
    o += ['<p>%s <a href="https://wa.me/12692670410">%s</a></p>' % (TXT[lang]["more"], TXT[lang]["msg"]), "</div>", "</noscript>"]
    return "\n".join(o)

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(__file__), "crawler-text")
    for lang, name in (("en", "home.html"), ("es", "home-es.html")):
        open(os.path.join(out, name), "w", encoding="utf-8").write(build(lang) + "\n")
        print(name, len(build(lang)))
