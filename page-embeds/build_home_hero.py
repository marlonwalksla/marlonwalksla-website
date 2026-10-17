# Builds home-hero.html (EN) and home-hero-es.html (ES) for the Webflow Home hero embed.
# Oct 16, 2026 redesign: grid paper, Ernesto's route line, one H1, one button,
# whole taped photos (no frames), one Ernesto. Also carries the Home section
# background styles (booking = deep blue + pinata fringe, team = white + route line,
# private = grid paper). Run: python3 build_home_hero.py
import urllib.parse

CDN = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
ERNESTO = CDN + "6a87ce84d9af8f7c9bf12030_Tour%20Guide.avif"
P_FREE = CDN + "6ad3d70ae5ccdc27ab358156_free-tour-avila-adobe.webp"  # Oct 17, 2026 (Marlon): yellow-frame Polaroid; the old La Placita one moved into the free tour section
_OLD_P_FREE = CDN + "6ac75117a6fa1b95aee600c4_polaroid-team-ernesto-la-placita.webp"
P_PRIV = CDN + "6ad327874042d5e60f8724b9_Master%20Polaroids.png"  # Oct 17, 2026: Marlon's pick
P_TEAM = CDN + "6ad3cf8b582d5e6e7bbb815a_team-tour-green-birthday.webp"  # Oct 17, 2026 (Marlon): green-tinted Polaroid, Kara's birthday group at the Grand Central Market

T = {
    "en": dict(
        eyebrow="Downtown LA walking tours",
        h1='Explore <span class="mwh-blue">LA</span><br><span class="mwh-mark">with a local</span>',
        line="Free walking tours, team outings and private days, in English and Spanish.",
        btn="Explore my tours", btn_href="#team", go="See dates",
        proof="4.9 stars from 505 reviews", pm="LOS ANGELES",
        ern_alt="Ernesto the pi&ntilde;ata, your tour guide, holding a tablet with a map",
        free=("Free Tour", "Join a Free Tour!", "#book",
              "Free tour guests posing together at the Avila Adobe garden"),
        team=("Team Tours", "Celebrate Your Team", "#team",
              "Kara's birthday group at the Grand Central Market sign"),
        priv=("Private Tours", "LA, Your Way", "#private",
              "Private tour guests with their Polaroid"),
    ),
    "es": dict(
        eyebrow="Tours a pie por el centro de LA",
        h1='Explora <span class="mwh-blue">LA</span><br><span class="mwh-mark">con un local</span>',
        line="Free tours, tours para equipos y d&iacute;as privados, en espa&ntilde;ol e ingl&eacute;s.",
        btn="Explora mis tours", btn_href="#team", go="Ver fechas",
        proof="4,9 estrellas en 505 opiniones", pm="LOS &Aacute;NGELES",
        ern_alt="Ernesto la pi&ntilde;ata, tu gu&iacute;a, con una tablet y un mapa",
        free=("Free Tour", "&iexcl;&Uacute;nete a un Free Tour!", "#book",
              "Grupo del free tour posando juntos en el jard&iacute;n de la Casa Avila"),
        team=("Tours de Equipo", "Celebra a tu equipo", "#team",
              "El grupo de cumplea&ntilde;os de Kara frente al letrero de Grand Central Market"),
        priv=("Tours Privados", "LA a tu manera", "#private",
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


def flag_frame():
    """Papel picado flags as a full outline (used as a border-image, 280x280 source, 40px slices)."""
    import urllib.parse
    cols = ['#FF00FF', '#FFD43B', '#00C853', '#2890B6', '#FF6D00']
    row = ''
    for i, c in enumerate(cols):
        x = 40 * i + 1
        d = f"M{x} 6H{x+38}V33L{x+33} 39L{x+28} 33L{x+23} 39L{x+19} 33L{x+14} 39L{x+9} 33L{x+4} 39L{x} 33Z"
        row += (f"<path d='{d}' fill='{c}'/><circle cx='{x+19}' cy='19' r='4.5' fill='#fff'/>"
                f"<rect x='{x+9}' y='25' width='5' height='4' fill='#fff'/><rect x='{x+24}' y='25' width='5' height='4' fill='#fff'/>")
    g = (f"<g transform='translate(40 0)'>{row}</g><g transform='translate(40 280) scale(1 -1)'>{row}</g>"
         f"<g transform='matrix(0 1 1 0 0 40)'>{row}</g><g transform='matrix(0 1 -1 0 280 40)'>{row}</g>")
    lines = ("<path d='M0 6H280M0 274H280M6 0V280M274 0V280' stroke='#27302E' stroke-width='1.6' fill='none'/>"
             "<g fill='#27302E'><circle cx='6' cy='6' r='4'/><circle cx='274' cy='6' r='4'/><circle cx='6' cy='274' r='4'/><circle cx='274' cy='274' r='4'/></g>")
    svg = f"<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280' viewBox='0 0 280 280'>{lines}{g}</svg>"
    return "data:image/svg+xml," + urllib.parse.quote(svg, safe="/:=' ")


def build(lang):
    POSTCARD = POSTCARD_CSS.replace('__FLAGS__', flag_frame()) + open('postcard-forms.css', encoding='utf-8').read()  # reply-postcard forms (shared with private-form-intro and team-cal)
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
      <span class="mwh-eyebrow"><i></i>{t["eyebrow"]}</span>
      <h1 class="mwh-h1">{t["h1"]}</h1>
      <p class="mwh-line">{t["line"]}</p>
      <div class="mwh-cta">
        <img class="mwh-ern" src="{ERNESTO}" alt="{t["ern_alt"]}" width="90" height="108">
        <a class="mwh-btn" href="{t["btn_href"]}">{t["btn"]}</a>
      </div>
    </div>
    <div class="mwh-photos">
{card("team", "mwh-p1", "rgba(96,200,96,.6)")}{card("free", "mwh-p3", "rgba(255,0,255,.45)")}{card("priv", "mwh-p2", "rgba(40,144,182,.45)")}    </div>
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
  .mwh-wrap {{ position: relative; max-width: 1140px; margin: 0 auto; padding: 56px 56px 76px; display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 28px; align-items: center; }}
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
  /* Oct 17, 2026 (Marlon): the hero is a postcard too. Airmail edge, text on the left, Ernesto is the stamp on the right. */
  .mwh::after {{ content: ""; position: absolute; inset: 12px; border: 12px solid transparent; border-image: repeating-linear-gradient(-45deg, #E8412F 0 16px, transparent 16px 26px, #2890B6 26px 42px, transparent 42px 52px) 12; pointer-events: none; z-index: 1; }}
  .mwh-wrap {{ z-index: 2; }}
  /* Oct 17, 2026 (Marlon): no stamp. Ernesto stands next to the button: he takes you there. */
  .mwh-cta {{ display: flex; align-items: flex-end; gap: 14px; }}
  .mwh-ern {{ display: block; width: auto; height: 108px; flex: none; margin: 0 0 -8px; }}
  .mwh-cta {{ align-items: center; }}

  @media (max-width: 991px) {{
    .mwh-wrap {{ grid-template-columns: 1fr; padding: 54px 40px 62px; gap: 34px; }}
    .mwh-line {{ margin: 0 0 26px; }}
    .mwh-photos {{ max-width: 520px; padding-top: 8px; }}
    .mwh-p2, .mwh-p3 {{ margin-top: 0; }}
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
    .mwh-text {{ display: flex; flex-direction: column; align-items: flex-start; }}
    .mwh::after {{ inset: 6px; border-width: 7px; border-image-slice: 7; border-image-width: 7px; }}
    .mwh-wrap {{ padding: 36px 30px 40px; }}
    .mwh-ern {{ height: 86px; }}
    .mwh-eyebrow {{ font-size: 0.7rem; padding: 6px 11px; }}
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


POSTCARD_CSS = r'''/* ---------- Home = backs of postcards (Oct 17, 2026, late) ----------
     Marlon's pick: an airmail stripe border per tour, the return address top left, the place as the address,
     a dotted line down the middle, map on the message side, the booking card on the address side.
     Oct 17, 2026 (latest): happy Ernesto colors per card (Marlon: "happy and joyful like Ernesto"); Polaroids stay in the card. */
  body { background-color: #FFF6E6; }
  section:has(.rv-banner) { background: #D9F5E3 !important; }
  .rv-banner { background: transparent !important; border-top: 0 !important; border-bottom: 0 !important; }
  .mw-bg-team, .mw-bg-book, .mw-bg-private { position: relative; box-shadow: none !important; }
  .mw-bg-team > *, .mw-bg-book > *, .mw-bg-private > * { position: relative; z-index: 2; }
  .mw-bg-team, .mw-bg-private { padding-top: 30px; }
  .mw-split > * { min-width: 0; }
  #private-split { padding-top: 20px; }
  .mw-bg-team { background: #E3F6D8 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 .4 0 0 0 0 .35 0 0 0 0 .25 0 0 0 .07 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E") !important; --pc-stripes: repeating-linear-gradient(-45deg, #2E9E57 0 16px, transparent 16px 26px, #94E059 26px 42px, transparent 42px 52px); }
  .mw-bg-book { background: #FFE3F1 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 .4 0 0 0 0 .35 0 0 0 0 .25 0 0 0 .07 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E") !important; }
  .mw-bg-private { background: #DCEFFA url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.012 .35' numOctaves='3' seed='4'/%3E%3CfeColorMatrix values='0 0 0 0 .55 0 0 0 0 .5 0 0 0 0 .4 0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23f)'/%3E%3C/svg%3E") !important; background-size: auto !important; --pc-stripes: repeating-linear-gradient(-45deg, #2890B6 0 16px, transparent 16px 26px, #FFD43B 26px 42px, transparent 42px 52px); }
  /* the airmail border */
  .mw-bg-team::after, .mw-bg-book::after, .mw-bg-private::after { content: "" !important; display: block !important; position: absolute; inset: 12px; border: 12px solid transparent; border-image: var(--pc-stripes) 12; background: none !important; transform: none !important; outline: 0 !important; box-shadow: none !important; width: auto !important; height: auto !important; pointer-events: none; z-index: 1; }
  .mw-bg-team::before, .mw-bg-private::before { content: none !important; }
  /* Oct 17, 2026 (Marlon): papel picado flags are the whole outline of the free tour card (no airmail stripes) */
  .mw-bg-book::before { content: none !important; }
  .mw-bg-book { padding: 14px 52px 6px !important; }
  .mw-bg-book::after { inset: 8px; border-width: 44px; border-image: url("__FLAGS__") 40 round; }
  .mw-bg-book .mwla-book-head::after { content: none !important; }
  .mw-bg-book .mwla-book-title { color: #27302E !important; font-family: "Lilita One", sans-serif; font-weight: 400; }
  .mw-bg-book .mwla-book-sub { color: #3B4440 !important; }
  .mw-bg-book .mwla-lang-label { color: #27302E !important; }
  .mw-bg-book .mwla-meet { color: #3B4440 !important; }
  .mw-bg-book .mwla-book-wa { color: #1B6688 !important; }
  .mw-bg-book .mwla-book-facts { display: none !important; }
  .mw-bg-book .mwla-book-cal { background: #ffffff; padding: 8px; box-shadow: 0 10px 24px -14px rgba(39, 48, 46, 0.5); }
  /* return address, the "To" line and the postmark */
  .pc-addr { text-align: right; justify-self: end; align-self: start; max-width: 360px; }
  .pc-addr .pc-from, .pc-addr .pc-to { text-align: right; }
  .pc-line { margin: 8px 0 0; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 1.1rem; line-height: 1.4; color: #3B4440; max-width: 46ch; }
  .pc-from { margin: 0 0 8px; font-family: "Caveat", cursive; font-weight: 600; font-size: 1.2rem; line-height: 1.1; color: #5B6663; }
  .pc-to { display: inline-block; margin: 2px 0 10px; padding: 0 6px 2px 0; font-family: "Caveat", cursive; font-weight: 700; font-size: 1.55rem; line-height: 1.15; color: #27302E; border-bottom: 2px dotted rgba(39, 48, 46, 0.4); }
  .pc-to span:first-child { font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: #5B6663; margin-right: 4px; }
  /* badges: small facts, not buttons */
  .pc-badges { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0 14px; padding: 0; }
  .pc-badge { display: inline-flex; align-items: center; gap: 7px; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.98rem; line-height: 1.2; color: #27302E; background: #fff; border: 2px solid #27302E; border-radius: 999px; padding: 4px 14px 4px 10px; }
  .pc-badge svg { width: 17px; height: 17px; flex: none; }
  /* map and stop bar share one box */
  .ra-wrap.ra-nolist { gap: 0; background: #fff; border: 2px solid #27302E; border-radius: 16px; box-shadow: 3px 3px 0 #27302E; }
  .ra-nolist .ra-map { border-radius: 14px 14px 0 0; box-shadow: none; }
  .ra-nolist .ra-map svg { border-radius: 14px 14px 0 0; }
  .ra-nolist .ra-ctrl { margin: 0; border: 0; border-top: 2px solid #27302E; border-radius: 0 0 14px 14px; box-shadow: none; }
  /* the dotted line down the middle of the card */
  @media (min-width: 992px) {
    .mw-bg-team .mw-split-left, .mw-bg-private .mw-split-left { padding-right: 28px; border-right: 2px dashed rgba(39, 48, 46, 0.22); }
    .mw-bg-book .mwla-fleft { padding-right: 28px; border-right: 2px dashed rgba(39, 48, 46, 0.22); }
  }
  /* the free tour card on the address side gets the same reply-postcard edge as the forms */
  /* Oct 17, 2026 (Marlon): colorful borders only on the outside of the section; inner cards get a thin plain line */
  .mw-bg-book .mwla-fcard { border: 2px solid #27302E; border-radius: 18px; }
  @media (max-width: 900px) {
    .mw-bg-team::after, .mw-bg-private::after { inset: 6px; border-width: 7px; border-image-slice: 7; border-image-width: 7px; }
    .mw-bg-book { padding: 10px 16px 4px !important; }
    .mw-bg-book::after { inset: 6px; border-width: 22px; border-image-slice: 40; border-image-width: 22px; }
  }
'''
PC_JS = "<script>\n" + open("postcard-forms.js", encoding="utf-8").read() + "</script>\n"  # Ernesto next to the form send buttons

for lang, name in (("en", "home-hero.html"), ("es", "home-hero-es.html")):
    open(name, "w", encoding="utf-8").write(build(lang))
    print("wrote", name)
