"""Nov 10, 2026 (Marlon): "one action per section" Home.

Builds, for EN and ES:
  home-team-card(-es).html     Group tours: just the Cal.com group-tours calendar (was the price calculator)
  home-private(-es).html       Private: photo slider, each photo tagged with its place (was the trip picker)
  home-private-calc(-es).html  Private: one button to the Private page form (was the estimate builder)
Run from page-embeds/:  python3 build_home_simple.py
The old builders (build_home_teamcard.py, build_home_private.py) are kept in git history only as reference.
"""
import re, html

CDN = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
ERN = CDN + "6ae436f5cb91c1dbb4ea1298_Tour%20Guide%20541%20x%20800.avif"

# One photo per place. (file, place EN, place ES, caption EN, caption ES, alt EN, alt ES)
PHOTOS = [
    ("6ad92a2e8aa41f8f19ce753e_guest-griffith-park-and-observatory-04.webp", "Griffith Observatory", "Observatorio Griffith",
     "Javier and Jenny taking in the sunset", "Javier y Jenny disfrutando el atardecer",
     "A couple watching the sunset at Griffith Observatory", "Una pareja viendo el atardecer en el Observatorio Griffith"),
    ("6ad929e61c74efa5d6a35519_guest-santa-monica-01.avif", "Santa Monica Pier", "Muelle de Santa Mónica",
     "Dana and Chris on the Santa Monica Pier", "Dana y Chris en el muelle de Santa Mónica",
     "A couple smiling on the Santa Monica Pier", "Una pareja sonriendo en el muelle de Santa Mónica"),
    ("6ad929ec3eeaaffdbe379a12_guest-venice-canals-01.avif", "Venice Canals", "Canales de Venice",
     "Sofia and Marco walking the Venice Canals", "Sofia y Marco caminando por los canales de Venice",
     "A couple on a bridge over the Venice Canals", "Una pareja en un puente sobre los canales de Venice"),
    ("6ad929daefa7590f943caa69_guest-getty-center-01.webp", "Getty Center", "Getty Center",
     "Sunset at the Getty Center", "Atardecer en el Getty Center",
     "Guests at the Getty Center at sunset", "Visitantes en el Getty Center al atardecer"),
    ("6ad92cb38aa41f8f19cfc336_guest-bulleit-neon-01.avif", "Grand Central Market", "Grand Central Market",
     "The crew under the neon lights", "El grupo bajo las luces de neón",
     "A group of friends under the neon signs at Grand Central Market", "Un grupo de amigos bajo los letreros de neón de Grand Central Market"),
    ("6ad92cb5d1848d20e07d8ea2_guest-echo-park-lake-01.avif", "Echo Park Lake", "Lago Echo Park",
     "Ana and Ben walk around Echo Park Lake", "Ana y Ben caminan por el lago Echo Park",
     "A couple walking by Echo Park Lake", "Una pareja caminando junto al lago Echo Park"),
    ("6ad92ca74c83370c9cab47c3_guest-city-hall-01.avif", "Downtown LA", "Centro de LA",
     "Lena and Tom posing at City Hall", "Lena y Tom posando en el Ayuntamiento",
     "A couple posing in front of Los Angeles City Hall", "Una pareja posando frente al Ayuntamiento de Los Ángeles"),
]
TAPES = ["rgba(255,190,0,.5)", "rgba(60,160,220,.5)", "rgba(255,0,255,.35)", "rgba(120,200,90,.5)"]

T = {
    "en": dict(
        cal_title="Pick your date", cal_sub="Up to 35 guests. Book at least a week ahead.", cal_loading="Loading calendar&hellip;",
        aria="Private tour photos", prev="Previous photo", next="Next photo", dot="Show photo {n}",
        quote="Marlon was flexible, I had to reschedule and he was very open to it. He is very knowledgeable, he shared so much and went over time.",
        by="Beatrice", src="Google",
        p_title="Your LA day", p_line="Tell Marlon where you want to go. He plans the day and sends you the price.",
        p_btn="Plan your private tour", p_href="/private-tour-los-angeles", p_note="No payment now.",
        ern_alt="Ernesto the piñata donkey dressed as a tour guide",
    ),
    "es": dict(
        cal_title="Elige tu fecha", cal_sub="Hasta 35 personas. Reserva con al menos una semana de anticipación.", cal_loading="Cargando calendario&hellip;",
        aria="Fotos de tours privados", prev="Foto anterior", next="Foto siguiente", dot="Ver foto {n}",
        quote="Marlon was flexible, I had to reschedule and he was very open to it. He is very knowledgeable, he shared so much and went over time.",
        by="Beatrice", src="Google (en inglés)",
        p_title="Tu día en LA", p_line="Cuéntale a Marlon a dónde quieres ir. Él arma el día y te manda el precio.",
        p_btn="Planea tu tour privado", p_href="/tours-privados-los-angeles", p_note="Sin pago ahora.",
        ern_alt="Ernesto, el burrito piñata vestido de guía",
    ),
}


def team_card(lang):
    t = T[lang]
    src = open("team-cal.html", encoding="utf-8").read()
    # Drop the file's header comment; add the title and one line above the calendar.
    src = re.sub(r"^<!--.*?-->\s*", "", src, count=1, flags=re.S)
    head = ('<!-- MARLONWALKSLA - HOME: GROUP TOURS CARD. Built by page-embeds/build_home_simple.py (Nov 10, 2026).\n'
            '     One action: the group-tours calendar. Details (route, lunch, rules) live on the Group tours page. -->\n'
            f'<h3 class="tcal-title">{t["cal_title"]}</h3>\n<p class="tcal-sub">{t["cal_sub"]}</p>\n')
    src = src.replace('data-en="Loading calendar&hellip;" data-es="Cargando calendario&hellip;">Loading calendar&hellip;',
                      f'>{t["cal_loading"]}')
    return head + src


def private(lang):
    t = T[lang]; es = lang == "es"
    slides = []
    for i, (f, pen, pes, cen, ces, aen, aes) in enumerate(PHOTOS):
        place, cap, alt = (pes, ces, aes) if es else (pen, cen, aen)
        rot = ["-1.5deg", "1.2deg", "-0.8deg", "1.5deg"][i % 4]
        slides.append(
            f'<figure class="mws-slide" data-cap="{html.escape(cap)}"><div class="mws-fit mws-rawbox pvs-box" style="--rot:{rot}">'
            f'<span class="mws-tape" style="background:{TAPES[i % 4]}"></span>'
            f'<img class="mws-raw" src="{CDN}{f}" alt="{html.escape(alt)}" loading="lazy">'
            f'<span class="pvs-tag"><span aria-hidden="true">&#128205;</span> {html.escape(place)}</span></div></figure>')
    return f'''<!-- MARLONWALKSLA - HOME: PRIVATE TOURS PHOTOS (LEFT COLUMN). Built by page-embeds/build_home_simple.py (Nov 10, 2026).
     Marlon: no buttons here. Each photo carries its place as a tag; the one action is in the card on the right. -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@main/mw-slider.css?v=2">
<script src="https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@f644401027d6f89309b640d73897c0f0244ef74f/mw-slider.js" defer></script>
<div class="mw-offer pvs" id="private-tours">
  <div class="mws" data-mws style="--mws-w: 440px; --mws-ar: 1 / 1" data-prev="{t["prev"]}" data-next="{t["next"]}" data-dot="{t["dot"]}" aria-label="{t["aria"]}"><div class="mws-stage">
{chr(10).join(slides)}
  </div></div>
  <figure class="pvs-q"><blockquote>&ldquo;{html.escape(t["quote"])}&rdquo;</blockquote><figcaption><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span> {t["by"]} &middot; {t["src"]}</figcaption></figure>
</div>
<style>
  .pvs {{ scroll-margin-top: 90px; padding-top: 0; }}
  .pvs-box .mws-raw {{ border-radius: 4px; }}
  /* the place sits on the photo like a label stuck to the print: decorative text, not a button */
  .pvs-tag {{ position: absolute; left: 10px; bottom: 10px; z-index: 2; max-width: calc(100% - 20px); box-sizing: border-box;
    font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.95rem; line-height: 1.2; color: #27302E;
    background: #FFF6D6; border: 2px solid #27302E; border-radius: 999px; padding: 5px 12px; box-shadow: 2px 2px 0 #27302E;
    pointer-events: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }}
  .pvs-q {{ margin: 18px 0 0; }}
  .pvs-q blockquote {{ margin: 0; padding: 0 0 0 14px; border-left: 4px solid rgba(150, 100, 50, 0.28); font-size: 1rem; line-height: 1.5; color: #3B4440; }}
  .pvs-q figcaption {{ margin-top: 4px; padding-left: 18px; font-size: 0.85rem; color: #5B6663; }}
  .pvs-q figcaption span {{ color: #E89B00; letter-spacing: 1px; margin-right: 4px; }}
  @media (max-width: 520px) {{ .pvs-tag {{ font-size: 0.85rem; padding: 4px 10px; left: 8px; bottom: 8px; }} }}
</style>
'''


def private_card(lang):
    t = T[lang]
    return f'''<!-- MARLONWALKSLA - HOME: PRIVATE TOURS CARD (RIGHT COLUMN). Built by page-embeds/build_home_simple.py (Nov 10, 2026).
     One action: go to the Private page and send Marlon your details. The plan picker and estimate were removed from Home. -->
<div class="pvs-card">
  <h3 class="pvs-title">{t["p_title"]}</h3>
  <p class="pvs-line">{t["p_line"]}</p>
  <div class="pvs-cta"><img class="pvs-ern" src="{ERN}" alt="{html.escape(t["ern_alt"])}" loading="lazy"><a class="pvs-btn" href="{t["p_href"]}">{t["p_btn"]}</a></div>
  <p class="pvs-note">{t["p_note"]}</p>
</div>
<style>
  .pvs-card {{ display: flex; flex-direction: column; justify-content: center; min-height: 100%; padding: 8px 4px; box-sizing: border-box; }}
  .pvs-title {{ font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.6rem; line-height: 1.15; margin: 0 0 10px; color: #27302E; }}
  .pvs-line {{ font-family: "Nunito", sans-serif; font-size: 1.05rem; line-height: 1.55; margin: 0; color: #3B4440; }}
  .pvs-cta {{ display: flex; align-items: center; gap: 12px; margin-top: 18px; }}
  .pvs-ern {{ display: block; flex: none; width: auto; height: 84px; margin: -10px 0 -6px; }}
  .pvs-btn {{ flex: 1 1 auto; display: block; text-align: center; min-height: 48px; box-sizing: border-box;
    font-family: "Lilita One", sans-serif; font-size: 1.25rem; line-height: 1.2; color: #27302E !important; text-decoration: none !important;
    background: #FFD43B; border: 2.5px solid #27302E; border-radius: 999px; padding: 12px 22px; box-shadow: 4px 4px 0 #27302E;
    transition: transform 0.18s ease-out, box-shadow 0.18s ease-out; }}
  .pvs-btn:hover {{ transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #27302E; }}
  .pvs-btn:focus-visible {{ outline: 3px solid #2890B6; outline-offset: 3px; }}
  .pvs-note {{ margin: 12px 0 0; text-align: center; font-family: "Fredoka", sans-serif; font-size: 0.95rem; color: #5B6663; }}
  @media (max-width: 767px) {{ .pvs-ern {{ height: 70px; }} }}
  @media (prefers-reduced-motion: reduce) {{ .pvs-btn {{ transition: none; }} }}
</style>
'''


for lang, sfx in (("en", ""), ("es", "-es")):
    open(f"home-team-card{sfx}.html", "w", encoding="utf-8").write(team_card(lang))
    open(f"home-private{sfx}.html", "w", encoding="utf-8").write(private(lang))
    open(f"home-private-calc{sfx}.html", "w", encoding="utf-8").write(private_card(lang))
print("built")
