# Builds home-hero.html (EN) and home-hero-es.html (ES) for the Webflow Home hero embed.
# Oct 16, 2026 redesign: grid paper, Ernesto's route line, one H1, one button,
# whole taped photos (no frames), one Ernesto. Also carries the Home section
# background styles (booking = deep blue + pinata fringe, team = white + route line,
# private = grid paper). Run: python3 build_home_hero.py
import urllib.parse

CDN = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
ERNESTO = CDN + "6a87ce84d9af8f7c9bf12030_Tour%20Guide.avif"
P_FREE = CDN + "6ac75117a6fa1b95aee600c4_polaroid-team-ernesto-la-placita.jpg"
P_PRIV = CDN + "6ac74a88ff63a23a7673ee96_polaroid-griffith-sunset.jpg"
P_TEAM = CDN + "6ac74a8872cf323a6f897a43_polaroid-grand-central-market-night.jpg"  # stand-in until the group-at-GCM Polaroid is uploaded

T = {
    "en": dict(
        eyebrow="Downtown LA walking tours",
        h1='Explore <span class="mwh-blue">LA</span><br><span class="mwh-mark">with a local</span>',
        line="Free walking tours, team outings and private days, in English and Spanish.",
        btn="Book a free tour", btn_href="#book",
        proof="4.9 stars from 505 reviews",
        ern_alt="Ernesto the pi&ntilde;ata, your tour guide, holding a tablet with a map",
        free=("Free Tour", "Tip-based", "/free-walking-tour-los-angeles",
              "Free tour guests holding their Polaroid at La Placita Olvera"),
        team=("Team Tours", "Up to 30 guests", "/team-building-walking-tour-los-angeles",
              "Polaroid of Grand Central Market at night, where team tours stop for lunch"),
        priv=("Private Tours", "Pick Up &amp; Drop Off", "/private-tours-los-angeles",
              "Private tour guest at sunset by Griffith Observatory"),
    ),
    "es": dict(
        eyebrow="Tours a pie por el centro de LA",
        h1='Explora <span class="mwh-blue">LA</span><br><span class="mwh-mark">con un local</span>',
        line="Free tours, tours para equipos y d&iacute;as privados, en espa&ntilde;ol e ingl&eacute;s.",
        btn="Reserva un free tour", btn_href="#book",
        proof="4,9 estrellas en 505 opiniones",
        ern_alt="Ernesto la pi&ntilde;ata, tu gu&iacute;a, con una tablet y un mapa",
        free=("Free Tour", "Con propina", "/free-tour-los-angeles-espanol",
              "Grupo del free tour con su Polaroid en La Placita Olvera"),
        team=("Tours de Equipo", "Hasta 30 personas", "/team-building-walking-tour-los-angeles",
              "Polaroid de Grand Central Market de noche, donde los equipos almuerzan"),
        priv=("Tours Privados", "Te recojo y te llevo", "/private-tours-los-angeles",
              "Invitada de un tour privado al atardecer en el Observatorio Griffith"),
    ),
}


def svg_uri(svg):
    return "url(\"data:image/svg+xml," + urllib.parse.quote(svg, safe=" =:/;,'\"") + "\")"


def fringe_svg():
    # four tissue-paper bands hanging down, 12px scallops, tile 48 wide
    bands = [("#FF6600", 30), ("#00FF00", 23), ("#FFFF00", 16), ("#FF00FF", 9)]
    paths = []
    for color, y in bands:
        d = f"M0 0H48V{y}"
        x = 48
        while x > 0:
            d += f"Q{x-6} {y+7} {x-12} {y}"
            x -= 12
        d += "Z"
        paths.append(f"<path d='{d}' fill='{color}'/>")
    return f"<svg xmlns='http://www.w3.org/2000/svg' width='48' height='38' viewBox='0 0 48 38'>{''.join(paths)}</svg>"


def route_bg_svg():
    return ("<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'>"
            "<path d='M20 330 C 140 300 120 170 250 180 S 420 300 520 200 S 600 60 630 30' fill='none' "
            "stroke='#2890B6' stroke-opacity='0.35' stroke-width='4' stroke-dasharray='2 12' stroke-linecap='round'/>"
            "<g fill='#ffffff' stroke='#2890B6' stroke-opacity='0.45' stroke-width='3'>"
            "<circle cx='20' cy='330' r='9'/><circle cx='250' cy='180' r='9'/><circle cx='520' cy='200' r='9'/></g></svg>")


GRID = ("background-color:#FFF6E6;background-image:linear-gradient(#F1E4CB 1px,transparent 1px),"
        "linear-gradient(90deg,#F1E4CB 1px,transparent 1px);background-size:26px 26px")


def build(lang):
    t = T[lang]
    def card(key, cls, tape):
        title, sub, href, alt = t[key]
        img = {"free": P_FREE, "team": P_TEAM, "priv": P_PRIV}[key]
        return (f'    <a class="mwh-photo {cls}" href="{href}">\n'
                f'      <span class="mwh-tape" style="background:{tape}"></span>\n'
                f'      <img src="{img}" alt="{alt}" loading="eager">\n'
                f'      <span class="mwh-label"><strong>{title}</strong><em>{sub}</em></span>\n'
                f'    </a>\n')
    html = f'''<!-- ==============================================================================
     MARLONWALKSLA - HOME HERO ({lang.upper()})  Oct 16, 2026 redesign
     Built by page-embeds/build_home_hero.py. Grid paper + Ernesto's route line,
     one H1, one button, three whole taped photos that link to each tour, one Ernesto.
     No rotating words or images; the language switch lives in the header.
     The <style> below also sets the Home section backgrounds (booking, team, private).
     ============================================================================== -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&family=Lilita+One&family=Nunito:wght@400;700&display=swap" rel="stylesheet">
<section class="mwh" lang="{lang}">
  <svg class="mwh-route" viewBox="0 0 1200 640" preserveAspectRatio="none" aria-hidden="true">
    <path d="M560 560 C 640 600 700 470 640 380 S 700 120 820 150 S 1010 300 1080 170 S 1150 520 960 560" fill="none" stroke="#2890B6" stroke-width="4" stroke-dasharray="2 13" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
  </svg>
  <div class="mwh-wrap">
    <div class="mwh-text">
      <img class="mwh-ernesto-sm" src="{ERNESTO}" alt="" aria-hidden="true">
      <span class="mwh-eyebrow"><i></i>{t["eyebrow"]}</span>
      <h1 class="mwh-h1">{t["h1"]}</h1>
      <p class="mwh-line">{t["line"]}</p>
      <a class="mwh-btn" href="{t["btn_href"]}">{t["btn"]}</a>
    </div>
    <div class="mwh-photos">
{card("free", "mwh-p1", "rgba(255,0,255,.45)")}{card("team", "mwh-p3", "rgba(255,255,0,.6)")}{card("priv", "mwh-p2", "rgba(40,144,182,.45)")}      <img class="mwh-ernesto" src="{ERNESTO}" alt="{t["ern_alt"]}">
    </div>
  </div>
</section>
<style>
  /* Let the old hero section and column get out of the way */
  .section.max-height_100vh_desktop {{ max-height: none !important; min-height: 0 !important; overflow: visible !important; padding: 0 !important; display: block !important; background: none !important; }}
  .hero-left-col {{ width: 100% !important; max-width: none !important; flex: none !important; padding: 0 !important; margin: 0 !important; height: auto !important; }}
  .hero-right-col {{ display: none !important; }}

  .mwh {{ position: relative; overflow: hidden; {GRID}; color: #27302E; font-family: "Nunito", system-ui, sans-serif; }}
  .mwh *, .mwh *::before {{ box-sizing: border-box; }}
  .mwh-route {{ position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }}
  .mwh-wrap {{ position: relative; max-width: 1140px; margin: 0 auto; padding: 64px 24px 72px; display: grid; grid-template-columns: 1.05fr 1fr; gap: 40px; align-items: center; }}
  .mwh-eyebrow {{ display: inline-flex; align-items: center; gap: 8px; background: #27302E; color: #FFF6E6; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.85rem; letter-spacing: 0.06em; text-transform: uppercase; padding: 7px 14px; border-radius: 999px; }}
  .mwh-eyebrow i {{ width: 8px; height: 8px; border-radius: 50%; background: #FFD43B; display: block; }}
  .mwh-h1 {{ font-family: "Lilita One", sans-serif; font-weight: 400; font-size: clamp(2.9rem, 6.4vw, 5.2rem); line-height: 0.98; letter-spacing: 0.005em; margin: 18px 0 16px; color: #27302E; }}
  .mwh-blue {{ color: #2890B6; }}
  .mwh-mark {{ background: linear-gradient(transparent 62%, #FFD43B 62%, #FFD43B 92%, transparent 92%); padding: 0 4px; }}
  .mwh-line {{ font-size: 1.15rem; line-height: 1.55; max-width: 30ch; margin: 0 0 26px; color: #3B4440; }}
  .mwh-btn {{ display: inline-block; font-family: "Lilita One", sans-serif; font-size: 1.3rem; letter-spacing: 0.01em; color: #27302E !important; text-decoration: none !important; background: #FFD43B; border: 2.5px solid #27302E; border-radius: 999px; padding: 14px 30px; box-shadow: 4px 4px 0 #27302E; transition: transform 0.18s ease-out, box-shadow 0.18s ease-out; }}
  .mwh-btn:hover {{ transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #27302E; }}
  .mwh-btn:active {{ transform: translate(2px, 2px); box-shadow: 1px 1px 0 #27302E; }}
  .mwh-btn:focus-visible {{ outline: 3px solid #2890B6; outline-offset: 4px; }}
  .mwh-proof {{ margin: 18px 0 0; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.98rem; color: #3B4440; }}
  .mwh-proof span {{ color: #E89B00; letter-spacing: 2px; margin-right: 4px; }}

  .mwh-photos {{ position: relative; display: grid; grid-template-columns: 1fr 1fr; grid-template-areas: "free free" "team priv"; gap: 30px 26px; align-items: start; max-width: 450px; justify-self: center; width: 100%; }}
  .mwh-photo {{ position: relative; display: block; text-decoration: none !important; color: #27302E; transition: transform 0.2s ease-out; }}
  .mwh-photo img {{ display: block; width: 100%; height: auto; border-radius: 3px; box-shadow: 0 10px 24px -10px rgba(39, 48, 46, 0.45); }}
  .mwh-tape {{ position: absolute; top: -10px; left: 50%; width: 74px; height: 22px; transform: translateX(-50%) rotate(-4deg); z-index: 2; mix-blend-mode: multiply; }}
  .mwh-label {{ display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: 10px; }}
  .mwh-label strong {{ font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.3rem; line-height: 1.1; color: #27302E !important; }}
  .mwh-label em {{ font-style: normal; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.88rem; color: #4D5551 !important; }}
  .mwh-p1 {{ grid-area: free; width: calc(50% - 13px); justify-self: center; transform: rotate(-2deg); }}
  .mwh-p2 {{ grid-area: priv; transform: rotate(2.5deg); margin-top: 8px; }}
  .mwh-p3 {{ grid-area: team; transform: rotate(-1.5deg); }}
  .mwh-photo:hover, .mwh-photo:focus-visible {{ transform: rotate(0deg) translateY(-6px); z-index: 3; }}
  .mwh-photo:focus-visible {{ outline: 3px solid #2890B6; outline-offset: 6px; border-radius: 4px; }}
  .mwh-ernesto {{ position: absolute; left: -150px; bottom: 30px; width: 140px; z-index: 4; pointer-events: none; filter: drop-shadow(0 8px 10px rgba(39, 48, 46, 0.18)); }}
  .mwh-ernesto-sm {{ display: none; }}

  @media (max-width: 991px) {{
    .mwh-wrap {{ grid-template-columns: 1fr; text-align: center; padding: 44px 18px 52px; gap: 34px; }}
    .mwh-line {{ margin-left: auto; margin-right: auto; }}
    .mwh-route {{ display: none; }}
    .mwh-ernesto {{ display: none; }}
    .mwh-ernesto-sm {{ display: block; width: 92px; height: auto; margin: 0 auto 10px; }}
  }}
  @media (max-width: 767px) {{
    .mwh-h1 {{ font-size: clamp(2.6rem, 12vw, 3.4rem); }}
    .mwh-line {{ font-size: 1.05rem; }}
    .mwh-btn {{ font-size: 1.15rem; padding: 13px 26px; }}
    .mwh-photos {{ grid-template-columns: 1fr 1fr 1fr; grid-template-areas: "free team priv"; gap: 12px 10px; max-width: 460px; align-items: end; padding-top: 4px; }}
    .mwh-p1 {{ width: 100%; justify-self: stretch; }}
    .mwh-p2 {{ margin-top: 0; }}
    .mwh-label strong {{ font-size: 0.92rem; }}
    .mwh-label em {{ font-size: 0.74rem; }}
    .mwh-tape {{ width: 44px; height: 14px; top: -7px; }}
    .mwh-text {{ display: flex; flex-direction: column; align-items: center; }}
  }}
  @media (prefers-reduced-motion: reduce) {{ .mwh-btn, .mwh-photo {{ transition: none; }} }}

  /* ---------- Home section backgrounds (Oct 16, 2026) ---------- */
  .rv-banner {{ background: #ffffff !important; }}
  .mw-bg-book {{ position: relative; background: #1B6688 !important; padding-top: 40px; }}
  .mw-bg-book::before {{ content: ""; position: absolute; top: 0; left: 0; right: 0; height: 38px; background: {svg_uri(fringe_svg())} repeat-x top left; pointer-events: none; }}
  .mw-bg-book .mwla-book-title {{ color: #FFF6E6 !important; font-family: "Lilita One", sans-serif; font-weight: 400; }}
  .mw-bg-book .mwla-book-sub {{ color: #E3F1F7 !important; }}
  .mw-bg-book .mwla-lang-label {{ color: #FFF6E6 !important; }}
  .mw-bg-book .mwla-book-facts {{ display: none !important; }}
  .mw-bg-book .mwla-book-cal {{ background: #ffffff; padding: 8px; }}
  .mw-bg-team {{ background: #ffffff {svg_uri(route_bg_svg())} no-repeat right -80px top 30px / 640px auto !important; }}
  .mw-bg-private {{ {GRID} !important; }}
  @media (max-width: 767px) {{ .mw-bg-team {{ background-image: none !important; }} }}
</style>
'''
    if lang == "es":
        html += ("<script>\n  /* Spanish Home: page language for browsers and the booking calendar in Spanish */\n"
                 "  document.documentElement.setAttribute('lang', 'es');\n"
                 "  document.addEventListener('DOMContentLoaded', function () { if (typeof window.mwlaBookSet === 'function') window.mwlaBookSet('es'); });\n"
                 "</script>\n")
    return html


for lang, name in (("en", "home-hero.html"), ("es", "home-hero-es.html")):
    open(name, "w", encoding="utf-8").write(build(lang))
    print("wrote", name)
