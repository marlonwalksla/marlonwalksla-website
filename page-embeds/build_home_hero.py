# Builds home-hero.html (EN) and home-hero-es.html (ES) for the Webflow Home hero embed.
# Oct 16, 2026 redesign: grid paper, Ernesto's route line, one H1, one button,
# whole taped photos (no frames), one Ernesto. Also carries the Home section
# background styles (booking = deep blue + pinata fringe, team = white + route line,
# private = grid paper). Run: python3 build_home_hero.py
import urllib.parse

CDN = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
ERNESTO = CDN + "6a87ce84d9af8f7c9bf12030_Tour%20Guide.avif"
P_FREE = CDN + "6ac75117a6fa1b95aee600c4_polaroid-team-ernesto-la-placita.webp"
P_PRIV = CDN + "6ad327874042d5e60f8724b9_Master%20Polaroids.png"  # Oct 17, 2026: Marlon's pick
P_TEAM = CDN + "6ad2f698e11872cd0c80b662_Website%20Images%20(14).webp"  # Oct 17, 2026: Kara's birthday group at the Grand Central Market sign

T = {
    "en": dict(
        eyebrow="Downtown LA walking tours",
        h1='Explore <span class="mwh-blue">LA</span><br><span class="mwh-mark">with a local</span>',
        line="Free walking tours, team outings and private days, in English and Spanish.",
        btn="Explore my tours", btn_href="#team", go="See dates",
        proof="4.9 stars from 505 reviews",
        ern_alt="Ernesto the pi&ntilde;ata, your tour guide, holding a tablet with a map",
        free=("Free Tour", "Tip-based", "#book",
              "Free tour guests holding their Polaroid at La Placita Olvera"),
        team=("Team Tours", "Up to 30 guests", "#team",
              "Kara's birthday group at the Grand Central Market sign"),
        priv=("Private Tours", "Pick Up/Drop Off", "#private",
              "Private tour guests with their Polaroid"),
    ),
    "es": dict(
        eyebrow="Tours a pie por el centro de LA",
        h1='Explora <span class="mwh-blue">LA</span><br><span class="mwh-mark">con un local</span>',
        line="Free tours, tours para equipos y d&iacute;as privados, en espa&ntilde;ol e ingl&eacute;s.",
        btn="Explora mis tours", btn_href="#team", go="Ver fechas",
        proof="4,9 estrellas en 505 opiniones",
        ern_alt="Ernesto la pi&ntilde;ata, tu gu&iacute;a, con una tablet y un mapa",
        free=("Free Tour", "Con propina", "#book",
              "Grupo del free tour con su Polaroid en La Placita Olvera"),
        team=("Tours de Equipo", "Hasta 30 personas", "#team",
              "El grupo de cumplea&ntilde;os de Kara frente al letrero de Grand Central Market"),
        priv=("Tours Privados", "Te recojo y te llevo", "#private",
              "Invitados de un tour privado con su Polaroid"),
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
    POSTCARD = POSTCARD_CSS + open('postcard-forms.css', encoding='utf-8').read()  # reply-postcard forms (shared with private-form-intro and team-cal)
    t = T[lang]
    def card(key, cls, tape):
        title, sub, href, alt = t[key]
        img = {"free": P_FREE, "team": P_TEAM, "priv": P_PRIV}[key]
        return (f'    <a class="mwh-photo {cls}" href="{href}">\n'
                f'      <span class="mwh-tape" style="background:{tape}"></span>\n'
                f'      <img src="{img}" alt="{alt}" loading="eager">\n'
                f'      <span class="mwh-label"><strong>{title}</strong><em>{sub}</em><span class="mwh-go">{t["go"]}</span></span>\n'
                f'    </a>\n')
    html = f'''<!-- ==============================================================================
     MARLONWALKSLA - HOME HERO ({lang.upper()})  Oct 16, 2026 redesign
     Built by page-embeds/build_home_hero.py. Full-width grid paper (no trail),
     one H1, one button, three taped photos that jump to each tour's section below, one Ernesto.
     No rotating words or images; the language switch lives in the header.
     The <style> below also sets the Home section backgrounds (booking, team, private).
     ============================================================================== -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Fredoka:wght@400;500;600&family=Lilita+One&family=Nunito:wght@400;700&display=swap" rel="stylesheet">
<section class="mwh" lang="{lang}">
  <div class="mwh-wrap">
    <div class="mwh-text">
      <img class="mwh-ernesto-sm" src="{ERNESTO}" alt="" aria-hidden="true">
      <span class="mwh-eyebrow"><i></i>{t["eyebrow"]}</span>
      <h1 class="mwh-h1">{t["h1"]}</h1>
      <p class="mwh-line">{t["line"]}</p>
      <div class="mwh-cta">
        <img class="mwh-ernesto" src="{ERNESTO}" alt="{t["ern_alt"]}">
        <a class="mwh-btn" href="{t["btn_href"]}">{t["btn"]}</a>
      </div>
    </div>
    <div class="mwh-photos">
{card("team", "mwh-p1", "rgba(255,255,0,.6)")}{card("free", "mwh-p3", "rgba(255,0,255,.45)")}{card("priv", "mwh-p2", "rgba(40,144,182,.45)")}    </div>
  </div>
</section>
<style>
  /* Let the old hero section and column get out of the way */
  .section.max-height_100vh_desktop {{ max-height: none !important; min-height: 0 !important; overflow: visible !important; padding: 0 !important; display: block !important; background-color: #FFF6E6 !important; background-image: linear-gradient(#F1E4CB 1px, transparent 1px), linear-gradient(90deg, #F1E4CB 1px, transparent 1px) !important; background-size: 26px 26px !important; }}
  .hero-left-col {{ width: 100% !important; max-width: none !important; flex: none !important; padding: 0 !important; margin: 0 !important; height: auto !important; }}
  .hero-right-col {{ display: none !important; }}

  /* Full width: the grid paper runs edge to edge even inside Webflow's centered container */
  body {{ overflow-x: clip; }}
  .mwh {{ position: relative; overflow: hidden; width: 100vw; margin-left: calc(50% - 50vw); {GRID}; color: #27302E; font-family: "Nunito", system-ui, sans-serif; }}
  .mwh *, .mwh *::before {{ box-sizing: border-box; }}
  .mwh-wrap {{ position: relative; max-width: 1140px; margin: 0 auto; padding: 40px 24px 60px; display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 28px; align-items: center; }}
  .mwh-eyebrow {{ display: inline-flex; align-items: center; gap: 8px; background: #27302E; color: #FFF6E6; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.85rem; letter-spacing: 0.06em; text-transform: uppercase; padding: 7px 14px; border-radius: 999px; }}
  .mwh-eyebrow i {{ width: 8px; height: 8px; border-radius: 50%; background: #FFD43B; display: block; }}
  .mwh-h1 {{ font-family: "Lilita One", sans-serif; font-weight: 400; font-size: clamp(2.9rem, 6.4vw, 5.2rem); line-height: 0.98; letter-spacing: 0.005em; margin: 18px 0 16px; color: #27302E; }}
  .mwh-blue {{ color: #2890B6; }}
  .mwh-mark {{ background: linear-gradient(transparent 62%, #FFD43B 62%, #FFD43B 92%, transparent 92%); padding: 0 4px; }}
  .mwh-line {{ font-size: 1.15rem; line-height: 1.55; max-width: 30ch; margin: 0 0 44px; color: #3B4440; }}
  .mwh-btn {{ display: inline-block; font-family: "Lilita One", sans-serif; font-size: 1.3rem; letter-spacing: 0.01em; color: #27302E !important; text-decoration: none !important; background: #FFD43B; border: 2.5px solid #27302E; border-radius: 999px; padding: 14px 30px; box-shadow: 4px 4px 0 #27302E; transition: transform 0.18s ease-out, box-shadow 0.18s ease-out; }}
  .mwh-btn:hover {{ transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #27302E; }}
  .mwh-btn:active {{ transform: translate(2px, 2px); box-shadow: 1px 1px 0 #27302E; }}
  .mwh-btn:focus-visible {{ outline: 3px solid #2890B6; outline-offset: 4px; }}
  .mwh-proof {{ margin: 18px 0 0; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.98rem; color: #3B4440; }}
  .mwh-proof span {{ color: #E89B00; letter-spacing: 2px; margin-right: 4px; }}

  /* Oct 16, 2026 (option A): the three Polaroids sit in one row, same as on phones */
  .mwh-photos {{ position: relative; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; align-items: start; max-width: 600px; padding-top: 30px; justify-self: center; width: 100%; }}
  .mwh-photo {{ position: relative; z-index: 1; display: block; text-decoration: none !important; color: #27302E; transition: transform 0.2s ease-out; }}
  /* Same box for every Polaroid so all three always match in size */
  .mwh-photo img {{ display: block; width: 100%; height: auto; aspect-ratio: 500 / 608; object-fit: cover; border-radius: 3px; box-shadow: 0 10px 24px -10px rgba(39, 48, 46, 0.45); }}
  .mwh-tape {{ position: absolute; top: -10px; left: 50%; width: 74px; height: 22px; transform: translateX(-50%) rotate(-4deg); z-index: 2; mix-blend-mode: multiply; }}
  .mwh-label {{ position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; text-align: center; width: fit-content; margin: 10px auto 0; padding: 2px 10px 4px; border-radius: 10px; background: #FFF6E6; }}
  .mwh-label strong {{ font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.3rem; line-height: 1.1; color: #27302E !important; }}
  .mwh-label em {{ font-style: normal; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.88rem; color: #4D5551 !important; }}
  .mwh-go {{ display: inline-block; margin-top: 6px; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.8rem; color: #27302E; background: #FFD43B; border: 1.5px solid #27302E; border-radius: 999px; padding: 2px 10px; }}
  .mwh-photo:hover .mwh-go {{ background: #ffffff; }}
  html {{ scroll-behavior: smooth; }}
  @media (prefers-reduced-motion: reduce) {{ html {{ scroll-behavior: auto; }} }}
  /* Order matches the sections below: Team, Free, Private */
  .mwh-p1 {{ transform: rotate(-2deg); }}
  .mwh-p2 {{ transform: rotate(2.5deg); margin-top: 10px; }}
  .mwh-p3 {{ transform: rotate(-1.5deg); margin-top: -26px; }}
  .mwh-photo:hover, .mwh-photo:focus-visible {{ transform: rotate(0deg) translateY(-6px); z-index: 3; }}
  .mwh-photo:focus-visible {{ outline: 3px solid #2890B6; outline-offset: 6px; border-radius: 4px; }}
  /* Ernesto stands next to the button, pointing the way */
  /* Oct 16, 2026: Ernesto is to the LEFT of the button (Marlon's call) */
  .mwh-cta {{ display: inline-flex; align-items: flex-end; gap: 18px; }}
  .mwh-ernesto {{ width: 82px; height: auto; margin-bottom: -18px; pointer-events: none; filter: drop-shadow(0 8px 10px rgba(39, 48, 46, 0.18)); }}
  .mwh-ernesto-sm {{ display: none; }}

  @media (max-width: 991px) {{
    .mwh-wrap {{ grid-template-columns: 1fr; text-align: center; padding: 44px 18px 52px; gap: 34px; }}
    .mwh-line {{ margin: 0 auto 26px; }}
    .mwh-photos {{ max-width: 520px; padding-top: 8px; }}
    .mwh-p2, .mwh-p3 {{ margin-top: 0; }}
    .mwh-ernesto {{ display: none; }}
    .mwh-ernesto-sm {{ display: block; width: 92px; height: auto; margin: 0 auto 10px; }}
  }}
  @media (max-width: 767px) {{
    .mwh-h1 {{ font-size: clamp(2.6rem, 12vw, 3.4rem); }}
    .mwh-line {{ font-size: 1.05rem; }}
    .mwh-btn {{ font-size: 1.15rem; padding: 13px 26px; }}
    .mwh-photos {{ grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px 10px; max-width: 460px; align-items: start; padding-top: 4px; }}
    .mwh-p1 {{ width: 100%; justify-self: stretch; }}
    .mwh-p2 {{ margin-top: 0; }}
    .mwh-label strong {{ font-size: 0.92rem; }}
    .mwh-label em {{ font-size: 0.74rem; }}
    .mwh-go {{ font-size: 0.68rem; padding: 1px 7px; margin-top: 4px; }}
    .mwh-tape {{ width: 44px; height: 14px; top: -7px; }}
    .mwh-text {{ display: flex; flex-direction: column; align-items: center; }}
  }}
  @media (prefers-reduced-motion: reduce) {{ .mwh-btn, .mwh-photo {{ transition: none; }} }}

  {POSTCARD}
</style>
'''
    html += PC_JS
    if lang == "es":
        html += ("<script>\n  /* Spanish Home: page language for browsers and the booking calendar in Spanish */\n"
                 "  document.documentElement.setAttribute('lang', 'es');\n"
                 "  document.addEventListener('DOMContentLoaded', function () { if (typeof window.mwlaBookSet === 'function') window.mwlaBookSet('es'); });\n"
                 "</script>\n")
    return html


POSTCARD_CSS = '/* ---------- Home = backs of postcards (Oct 17, 2026, late) ----------\n     Marlon\'s pick: an airmail stripe border per tour, the return address top left, the place as the address,\n     a dotted line down the middle, map on the message side, the booking card on the address side.\n     The Polaroids can sit in the card (default) or move up as stamps: html.pc-stamps (test switch on webflow.io). */\n  body { background-color: #FFF6E6; }\n  section:has(.rv-banner) { background: #D9B98C url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'3\'/%3E%3CfeColorMatrix values=\'0 0 0 0 .35 0 0 0 0 .24 0 0 0 0 .12 0 0 0 .22 0\'/%3E%3C/filter%3E%3Crect width=\'160\' height=\'160\' filter=\'url(%23n)\'/%3E%3C/svg%3E") !important; }\n  .rv-banner { background: transparent !important; border-top: 0 !important; border-bottom: 0 !important; }\n  .mw-bg-team, .mw-bg-book, .mw-bg-private { position: relative; box-shadow: none !important; }\n  .mw-bg-team > *, .mw-bg-book > *, .mw-bg-private > * { position: relative; z-index: 2; }\n  .mw-bg-team, .mw-bg-private { padding-top: 30px; }\n  .mw-split > * { min-width: 0; }\n  .mw-bg-team { background: #FBF7EE url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.8\' numOctaves=\'2\'/%3E%3CfeColorMatrix values=\'0 0 0 0 .4 0 0 0 0 .35 0 0 0 0 .25 0 0 0 .07 0\'/%3E%3C/filter%3E%3Crect width=\'160\' height=\'160\' filter=\'url(%23n)\'/%3E%3C/svg%3E") !important; --pc-stripes: repeating-linear-gradient(-45deg, #D93A2B 0 16px, transparent 16px 26px, #F2B807 26px 42px, transparent 42px 52px); }\n  .mw-bg-book { background: #FBEFE2 url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.8\' numOctaves=\'2\'/%3E%3CfeColorMatrix values=\'0 0 0 0 .4 0 0 0 0 .35 0 0 0 0 .25 0 0 0 .07 0\'/%3E%3C/filter%3E%3Crect width=\'160\' height=\'160\' filter=\'url(%23n)\'/%3E%3C/svg%3E") !important; padding-top: 64px; padding-bottom: 14px; --pc-stripes: repeating-linear-gradient(-45deg, #FF00FF 0 14px, transparent 14px 22px, #FFD43B 22px 36px, transparent 36px 44px, #00C853 44px 58px, transparent 58px 66px, #2890B6 66px 80px, transparent 80px 88px); }\n  .mw-bg-private { background: #F6F1E6 url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'240\' height=\'240\'%3E%3Cfilter id=\'f\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.012 .35\' numOctaves=\'3\' seed=\'4\'/%3E%3CfeColorMatrix values=\'0 0 0 0 .55 0 0 0 0 .5 0 0 0 0 .4 0 0 0 .09 0\'/%3E%3C/filter%3E%3Crect width=\'240\' height=\'240\' filter=\'url(%23f)\'/%3E%3C/svg%3E") !important; background-size: auto !important; --pc-stripes: repeating-linear-gradient(-45deg, #1F2A44 0 16px, transparent 16px 26px, #C9A54B 26px 42px, transparent 42px 52px); }\n  /* the airmail border */\n  .mw-bg-team::after, .mw-bg-book::after, .mw-bg-private::after { content: "" !important; display: block !important; position: absolute; inset: 12px; border: 12px solid transparent; border-image: var(--pc-stripes) 12; background: none !important; transform: none !important; outline: 0 !important; box-shadow: none !important; width: auto !important; height: auto !important; pointer-events: none; z-index: 1; }\n  .mw-bg-team::before, .mw-bg-private::before { content: none !important; }\n  /* papel picado hangs inside the border, across the top of the free tour card */\n  .mw-bg-book::before { content: ""; position: absolute; top: 24px; left: 24px; right: 24px; height: 44px; background: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'240\' height=\'44\'%3E%3Cpath d=\'M0 6H240\' stroke=\'%2327302E\' stroke-width=\'1.5\'/%3E%3Cpath d=\'M3 6H45V34L40 40L35 34L30 40L24 34L19 40L14 34L8 40L3 34Z\' fill=\'%23FF00FF\'/%3E%3Ccircle cx=\'24\' cy=\'18\' r=\'5\' fill=\'%23FFF\'/%3E%3Crect x=\'12\' y=\'24\' width=\'6\' height=\'5\' fill=\'%23FFF\'/%3E%3Crect x=\'30\' y=\'24\' width=\'6\' height=\'5\' fill=\'%23FFF\'/%3E%3Cpath d=\'M51 6H93V34L88 40L83 34L78 40L72 34L67 40L62 34L56 40L51 34Z\' fill=\'%23FFD43B\'/%3E%3Ccircle cx=\'72\' cy=\'18\' r=\'5\' fill=\'%23FFF\'/%3E%3Crect x=\'60\' y=\'24\' width=\'6\' height=\'5\' fill=\'%23FFF\'/%3E%3Crect x=\'78\' y=\'24\' width=\'6\' height=\'5\' fill=\'%23FFF\'/%3E%3Cpath d=\'M99 6H141V34L136 40L131 34L126 40L120 34L115 40L110 34L104 40L99 34Z\' fill=\'%2300C853\'/%3E%3Ccircle cx=\'120\' cy=\'18\' r=\'5\' fill=\'%23FFF\'/%3E%3Crect x=\'108\' y=\'24\' width=\'6\' height=\'5\' fill=\'%23FFF\'/%3E%3Crect x=\'126\' y=\'24\' width=\'6\' height=\'5\' fill=\'%23FFF\'/%3E%3Cpath d=\'M147 6H189V34L184 40L179 34L174 40L168 34L163 40L158 34L152 40L147 34Z\' fill=\'%232890B6\'/%3E%3Ccircle cx=\'168\' cy=\'18\' r=\'5\' fill=\'%23FFF\'/%3E%3Crect x=\'156\' y=\'24\' width=\'6\' height=\'5\' fill=\'%23FFF\'/%3E%3Crect x=\'174\' y=\'24\' width=\'6\' height=\'5\' fill=\'%23FFF\'/%3E%3Cpath d=\'M195 6H237V34L232 40L227 34L222 40L216 34L211 40L206 34L200 40L195 34Z\' fill=\'%23FF6600\'/%3E%3Ccircle cx=\'216\' cy=\'18\' r=\'5\' fill=\'%23FFF\'/%3E%3Crect x=\'204\' y=\'24\' width=\'6\' height=\'5\' fill=\'%23FFF\'/%3E%3Crect x=\'222\' y=\'24\' width=\'6\' height=\'5\' fill=\'%23FFF\'/%3E%3C/svg%3E") repeat-x top left; pointer-events: none; z-index: 1; }\n  .mw-bg-book .mwla-book-head::after { content: none !important; }\n  .mw-bg-book .mwla-book-title { color: #27302E !important; font-family: "Lilita One", sans-serif; font-weight: 400; }\n  .mw-bg-book .mwla-book-sub { color: #3B4440 !important; }\n  .mw-bg-book .mwla-lang-label { color: #27302E !important; }\n  .mw-bg-book .mwla-meet { color: #3B4440 !important; }\n  .mw-bg-book .mwla-book-wa { color: #1B6688 !important; }\n  .mw-bg-book .mwla-book-facts { display: none !important; }\n  .mw-bg-book .mwla-book-cal { background: #ffffff; padding: 8px; box-shadow: 0 10px 24px -14px rgba(39, 48, 46, 0.5); }\n  /* return address, the "To" line and the postmark */\n  .pc-from { margin: 0 0 8px; font-family: "Caveat", cursive; font-weight: 600; font-size: 1.2rem; line-height: 1.1; color: #5B6663; }\n  .pc-to { display: inline-block; margin: 2px 0 10px; padding: 0 6px 2px 0; font-family: "Caveat", cursive; font-weight: 700; font-size: 1.55rem; line-height: 1.15; color: #1F2A44; border-bottom: 2px dotted rgba(39, 48, 46, 0.4); }\n  .pc-to span:first-child { font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: #5B6663; margin-right: 4px; }\n  .pc-slot { position: relative; align-self: start; justify-self: end; min-width: 120px; display: flex; justify-content: flex-end; padding-top: 6px; }\n  .pc-pm { position: relative; display: grid; place-items: center; align-content: center; width: 96px; height: 96px; border: 2.5px solid rgba(31, 42, 68, 0.38); border-radius: 50%; transform: rotate(-12deg); font-family: "Fredoka", sans-serif; color: rgba(31, 42, 68, 0.5); text-align: center; }\n  .pc-pm b { font-weight: 700; font-size: 0.62rem; letter-spacing: 0.1em; }\n  .pc-pm i { font-style: normal; font-weight: 700; font-size: 1.1rem; }\n  .pc-pm::before { content: ""; position: absolute; right: 88%; top: 30px; width: 90px; height: 36px; background: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'90\' height=\'36\'%3E%3Cg fill=\'none\' stroke=\'%231F2A44\' stroke-opacity=\'.38\' stroke-width=\'2.2\'%3E%3Cpath d=\'M0 6q11-6 22 0t22 0 22 0 22 0\'/%3E%3Cpath d=\'M0 18q11-6 22 0t22 0 22 0 22 0\'/%3E%3Cpath d=\'M0 30q11-6 22 0t22 0 22 0 22 0\'/%3E%3C/g%3E%3C/svg%3E") no-repeat; }\n  /* the dotted line down the middle of the card */\n  @media (min-width: 992px) {\n    .mw-bg-team .mw-split-left, .mw-bg-private .mw-split-left { padding-right: 28px; border-right: 2px dashed rgba(39, 48, 46, 0.22); }\n    .mw-bg-book .mwla-fleft { padding-right: 28px; border-right: 2px dashed rgba(39, 48, 46, 0.22); }\n  }\n  /* the free tour card on the address side gets the same reply-postcard edge as the forms */\n  .mw-bg-book .mwla-fcard { border: 10px solid transparent; border-image: repeating-linear-gradient(-45deg, #FF00FF 0 12px, #fff 12px 20px, #2890B6 20px 32px, #fff 32px 40px) 10; border-radius: 0; }\n  /* ----- Stamp mode: the Polaroids move up to the top right corner as stamps ----- */\n  html.pc-stamps .pc-pm { display: none; }\n  html.pc-stamps .pc-hide-stamps { display: none; }\n  html.pc-stamps .pc-slot .pc-pols { display: flex !important; gap: 0; padding: 0 8px 0 0; margin: 0; filter: drop-shadow(0 6px 8px rgba(39, 48, 46, 0.3)); }\n  html.pc-stamps .pc-slot .pc-pols::before { display: none !important; }\n  html.pc-stamps .pc-slot .pc-pol { position: relative; width: 100px; margin: 0 -10px 0 0; padding: 7px; background: #fff; transform: rotate(var(--r)); -webkit-mask: radial-gradient(circle at center, transparent 3.2px, #000 3.6px) -5px -5px / 10px 10px, linear-gradient(#000 0 0) content-box; mask: radial-gradient(circle at center, transparent 3.2px, #000 3.6px) -5px -5px / 10px 10px, linear-gradient(#000 0 0) content-box; }\n  html.pc-stamps .pc-slot .pc-pol img { display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; box-shadow: none; }\n  html.pc-stamps .pc-slot .pc-tape { display: none; }\n  html.pc-stamps .pc-slot .pc-pol figcaption { position: absolute; left: 0; right: 0; bottom: 12px; margin: 0; }\n  html.pc-stamps .pc-slot .pc-pol figcaption b, html.pc-stamps .pc-slot .pc-pol figcaption small { display: none; }\n  html.pc-stamps .pc-slot .mwla-year { font-size: 0.78rem; padding: 0 7px; margin: 0; }\n  /* wavy cancel lines across the stamps */\n  html.pc-stamps .pc-slot::after { content: ""; position: absolute; left: -34px; top: 38px; width: 200px; height: 44px; background: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'44\'%3E%3Cg fill=\'none\' stroke=\'%231F2A44\' stroke-opacity=\'.45\' stroke-width=\'2.2\'%3E%3Cpath d=\'M0 8q12.5-7 25 0t25 0 25 0 25 0 25 0 25 0 25 0 25 0\'/%3E%3Cpath d=\'M0 22q12.5-7 25 0t25 0 25 0 25 0 25 0 25 0 25 0 25 0\'/%3E%3Cpath d=\'M0 36q12.5-7 25 0t25 0 25 0 25 0 25 0 25 0 25 0 25 0\'/%3E%3C/g%3E%3C/svg%3E") no-repeat; pointer-events: none; z-index: 3; }\n  /* test-only switch (shows on marlonwalksla.webflow.io, never on the live domain) */\n  .pc-switch { position: fixed; left: 12px; bottom: 12px; z-index: 9999; display: flex; align-items: center; gap: 6px; padding: 6px 8px; background: #27302E; color: #FFF6E6; border-radius: 999px; font: 600 0.78rem "Fredoka", sans-serif; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3); }\n  .pc-switch span { padding: 0 4px; }\n  .pc-switch button { font: inherit; color: #FFF6E6; background: transparent; border: 1.5px solid #FFF6E6; border-radius: 999px; padding: 4px 10px; cursor: pointer; }\n  .pc-switch button[aria-pressed="true"] { background: #FFD43B; color: #27302E; border-color: #FFD43B; }\n  @media (max-width: 900px) {\n    .mw-bg-team::after, .mw-bg-book::after, .mw-bg-private::after { inset: 6px; border-width: 7px; border-image-slice: 7; border-image-width: 7px; }\n    .mw-bg-book::before { top: 13px; left: 13px; right: 13px; }\n    .mw-bg-book { padding-top: 52px; }\n    .pc-slot { justify-content: center; min-width: 0; padding-top: 4px; }\n    .pc-pm { display: none; }\n    html.pc-stamps .pc-slot .pc-pol { width: 84px; }\n    html.pc-stamps .pc-slot::after { left: 50%; transform: translateX(-50%); width: 160px; }\n    .mw-bg-book .mwla-fcard { border-width: 7px; }\n  }\n'
PC_JS = '\n<script>\n  /* Polaroids: in the card (default) or as stamps. ?pc=stamps or ?pc=card sets it; the switch only shows on the test site. */\n  (function () {\n    var KEY = "mwPcMode";\n    function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }\n    function save(m) { try { localStorage.setItem(KEY, m); } catch (e) {} }\n    function apply(mode) {\n      document.documentElement.classList.toggle("pc-stamps", mode === "stamps");\n      document.querySelectorAll("[data-pc-home]").forEach(function (home) {\n        var id = home.getAttribute("data-pc-home"), pols = document.getElementById(id), slot = document.querySelector(\'[data-pc-slot="\' + id + \'"]\');\n        if (!pols || !slot) return;\n        if (mode === "stamps") { if (pols.parentNode !== slot) slot.insertBefore(pols, slot.firstChild); }\n        else if (home.nextSibling !== pols) home.parentNode.insertBefore(pols, home.nextSibling);\n      });\n      document.querySelectorAll(".pc-switch button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === mode)); });\n    }\n    function init() {\n      var q = (location.search.match(/[?&]pc=(stamps|card)/) || [])[1];\n      if (q) save(q);\n      var test = /\\.webflow\\.io$/.test(location.hostname) || location.protocol === "file:";\n      var mode = test ? (q || saved() || "card") : "card";\n      if (test) {\n        var bar = document.createElement("div"); bar.className = "pc-switch";\n        bar.innerHTML = \'<span>Polaroids:</span><button type="button" data-mode="card">In the card</button><button type="button" data-mode="stamps">As stamps</button>\';\n        bar.addEventListener("click", function (e) { var m = e.target.getAttribute && e.target.getAttribute("data-mode"); if (m) { save(m); apply(m); } });\n        document.body.appendChild(bar);\n      }\n      apply(mode);\n    }\n    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();\n  })();\n</script>\n'

for lang, name in (("en", "home-hero.html"), ("es", "home-hero-es.html")):
    open(name, "w", encoding="utf-8").write(build(lang))
    print("wrote", name)
