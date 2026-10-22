import paper
# Builds the lower Home sections (Oct 17, 2026, Marlon via Gemini chunk 3):
#   home-meet(.es).html  = "Meet Your Local Guide" banner (between Private and Free tour)
#   home-faq(.es).html   = "Good to Know" accordion (below the Free tour)
# Marlon's photo is a placeholder until he sends one: set MARLON_PHOTO to its URL and rebuild.
MARLON_PHOTO = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/6ad92ff02cbe8250c0b64f0d_bts-hollywood-sign-02.webp"  # e.g. "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/<file>.webp"
WA = "https://wa.me/12692670410"
IG = "https://www.instagram.com/marlonwalksla/"  # Oct 19, 2026: only Instagram and WhatsApp are confirmed; add TikTok, YouTube etc. to SOCIALS when Marlon gives the links

T = {
 "en": dict(
  meet_title="Meet Your Local Guide", meet_eyebrow="Hi, I'm Marlon",
  meet_body="I was born a few minutes from where my free tour starts, and I grew up speaking Spanish at home. Today I guide walks around Los Angeles in English and Spanish, with my sidekick Ernesto.",
  meet_more="Read my story", ig="\U0001F4F7 Follow on Instagram", wa="\U0001F4AC WhatsApp Marlon", ph="Marlon's photo goes here", ph_alt="Marlon, your local guide, with Ernesto",
  faq_title="Good to Know", faq_sub="Quick answers before you book.",
  faq=[("Where do we meet?", "Free tour: Walt Disney Concert Hall, 600 W 1st St. Look for Marlon with a tablet. Team tour: Grand Central Market, 317 S Broadway. Private tour: Marlon picks you up at your hotel."),
       ("What about parking?", "The free tour is on foot, so you only park once. Private tours include hotel pickup, so you do not need to park at all. Want garage tips? Message Marlon."),
       ("Is the route accessible?", "There are stairs at Angels Flight. Coming with a wheelchair or stroller? Message Marlon before the tour and we will plan it."),
       ("How long is the free tour?", "About 2 hours, in English or Spanish. It is free to book. Tip what feels right at the end."),
       ("What if I need to cancel?", "Free tours run with 3 or more guests. If you cannot make it, email at least 24 hours before. Private tours cancel free up to 48 hours before."),
       ("What if it is hot or rainy?", "For team tours, Marlon messages the group and you decide together.")],
  ask="Still have a question?", ask_link="Message Marlon"),
 "es": dict(
  meet_title="Conoce a tu guía local", meet_eyebrow="Hola, soy Marlon",
  meet_body="Nací a pocos minutos de donde empieza mi free tour y crecí hablando español en casa. Hoy guío caminatas por Los Ángeles en español y en inglés, con mi compañero Ernesto.",
  meet_more="Lee mi historia", ig="\U0001F4F7 Sígueme en Instagram", wa="\U0001F4AC Escríbeme por WhatsApp", ph="Aquí va la foto de Marlon", ph_alt="Marlon, tu guía local, con Ernesto",
  faq_title="Bueno saber", faq_sub="Respuestas rápidas antes de reservar.",
  faq=[("¿Dónde nos vemos?", "Free tour: Walt Disney Concert Hall, 600 W 1st St. Busca a Marlon con una tablet. Tour de equipo: Grand Central Market, 317 S Broadway. Tour privado: Marlon te recoge en tu hotel."),
       ("¿Y el estacionamiento?", "El free tour es a pie, así que estacionas una sola vez. Los tours privados incluyen recogida en el hotel, así que no necesitas estacionar. ¿Quieres consejos de garajes? Escríbele a Marlon."),
       ("¿La ruta es accesible?", "Hay escaleras en Angels Flight. ¿Vienes con silla de ruedas o carriola? Escríbele a Marlon antes del tour y lo planeamos."),
       ("¿Cuánto dura el free tour?", "Unas 2 horas, en español o en inglés. Reservar es gratis. Al final dejas la propina que creas justa."),
       ("¿Y si necesito cancelar?", "Los free tours salen con 3 o más personas. Si no puedes venir, escribe por correo al menos 24 horas antes. Los tours privados se cancelan gratis hasta 48 horas antes."),
       ("¿Y si hace calor o llueve?", "En los tours de equipo, Marlon escribe al grupo y lo deciden juntos.")],
  ask="¿Tienes otra pregunta?", ask_link="Escríbele a Marlon"),
}
CSS_COMMON = """  .hl { width: 100%; box-sizing: border-box; padding: 44px 20px; color: #27302E; font-family: "Nunito", system-ui, sans-serif; }
  .hl *, .hl *::before { box-sizing: border-box; }
  .hl-title { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: clamp(2.1rem, 5vw, 3.2rem); line-height: 1.02; margin: 0 0 12px; color: #27302E; }
"""
MEET_CSS = """<style>
""" + CSS_COMMON + """  .hl-meet { position: relative; background: #FFEFC2; }
  PAPER_MEET
  .hl-meet-wrap { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr); gap: 24px 56px; align-items: center; }
  .hl-pol { position: relative; margin: 0; background: #fff; padding: 12px 12px 14px; transform: rotate(-2.5deg); box-shadow: 0 12px 24px -12px rgba(39, 48, 46, 0.5); }
  .hl-pol img, .hl-ph { display: block; width: 100%; aspect-ratio: 1 / 1; object-fit: cover; }
  .hl-ph { display: grid; place-items: center; text-align: center; padding: 16px; background: #FFF6E6; border: 2px dashed #C0392B; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 1rem; color: #C0392B; }
  .hl-tape { position: absolute; top: -11px; left: 50%; width: 76px; height: 22px; transform: translateX(-50%) rotate(-4deg); background: rgba(255, 212, 59, .7); mix-blend-mode: multiply; }
  .hl-eyebrow { margin: 0 0 4px; font-family: "Caveat", cursive; font-weight: 700; font-size: 1.8rem; line-height: 1.1; color: #5B6663; }
  .hl-body { margin: 0 0 12px; font-size: 1.1rem; line-height: 1.6; color: #3B4440; max-width: 46ch; }
  .hl-more { font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1rem; color: #1B6688 !important; text-decoration: underline !important; text-underline-offset: 3px; display: inline-block; padding: 8px 0; }
  .hl-more:hover { color: #27302E !important; }
  .hl-social { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
  .hl-sbtn { display: inline-flex; align-items: center; gap: 6px; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1rem; line-height: 1.2; color: #27302E !important; text-decoration: none !important; background: #fff; border: 2.5px solid #27302E; border-radius: 999px; padding: 10px 18px; min-height: 44px; box-shadow: 3px 3px 0 #27302E; transition: transform 0.18s ease-out, box-shadow 0.18s ease-out; }
  .hl-sbtn:hover { transform: translate(-1px, -1px); box-shadow: 5px 5px 0 #27302E; }
  .hl-sbtn:focus-visible { outline: 3px solid #2890B6; outline-offset: 3px; }
  @media (max-width: 820px) { .hl { padding: 34px 20px; } .hl-meet-wrap { grid-template-columns: 1fr; justify-items: center; text-align: left; } .hl-pol { width: min(260px, 70%); } }
</style>
"""
FAQ_CSS = """<style>
""" + CSS_COMMON + """  .hl-faq { position: relative; background: #FFEFC2; scroll-margin-top: 20px; }
  PAPER_FAQ
  .hl-faq-wrap { max-width: 800px; margin: 0 auto; }
  .hl-sub { margin: 0 0 24px; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 1.1rem; color: #3B4440; }
  .hl-q { position: relative; margin: 0 0 16px; background: #fff; border: 2px solid #27302E; border-radius: 8px; box-shadow: 3px 3px 0 #27302E; transform: rotate(var(--r, 0deg)); }
  .hl-q::before { content: ""; position: absolute; top: -9px; left: 24px; width: 52px; height: 16px; background: var(--t, rgba(255, 212, 59, .7)); transform: rotate(-3deg); mix-blend-mode: multiply; pointer-events: none; }
  .hl-q summary { list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 14px; min-height: 52px; padding: 14px 18px; font-family: "Lilita One", sans-serif; font-size: 1.2rem; line-height: 1.2; color: #27302E; }
  .hl-q summary::-webkit-details-marker { display: none; }
  .hl-q summary::after { content: "+"; flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: #FFD43B; border: 2px solid #27302E; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1.2rem; line-height: 1; transition: transform 0.2s ease-out; }
  .hl-q[open] summary::after { content: "\\2212"; }
  .hl-q summary:focus-visible { outline: 3px solid #2890B6; outline-offset: 3px; border-radius: 6px; }
  .hl-q p { margin: 0; padding: 0 18px 16px; font-size: 1.05rem; line-height: 1.6; color: #3B4440; }
  .hl-ask { margin: 22px 0 0; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 1.05rem; color: #3B4440; }
  .hl-ask a { color: #1B6688 !important; font-weight: 600; text-decoration: underline !important; text-underline-offset: 3px; }
  @media (max-width: 820px) { .hl { padding: 34px 16px; } .hl-q summary { font-size: 1.1rem; } }
</style>
"""
TAPES = ["rgba(255,212,59,.7)", "rgba(40,144,182,.45)", "rgba(255,0,255,.4)", "rgba(96,200,96,.55)"]
ROT = ["-0.6deg", "0.5deg", "-0.4deg", "0.6deg", "-0.5deg", "0.4deg"]
for lang, suf in (("en", ""), ("es", "-es")):
    t = T[lang]
    photo = (f'<img src="{MARLON_PHOTO}" alt="{t["ph_alt"]}" loading="lazy">' if MARLON_PHOTO
             else f'<div class="hl-ph" role="img" aria-label="{t["ph_alt"]}">{t["ph"]}</div>')
    meet = (f"<!-- MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: MEET YOUR LOCAL GUIDE banner. Built by page-embeds/build_home_lower.py. Oct 17, 2026 (Marlon via Gemini). Photo is a placeholder until MARLON_PHOTO is set. -->\n"
            f'<section class="hl hl-meet" aria-label="{t["meet_title"]}">\n  <div class="hl-meet-wrap">\n    <figure class="hl-pol"><span class="hl-tape"></span>{photo}</figure>\n'
            f'    <div>\n      <p class="hl-eyebrow">{t["meet_eyebrow"]}</p>\n      <h2 class="hl-title">{t["meet_title"]}</h2>\n      <p class="hl-body">{t["meet_body"]}</p>\n'
            f'      <a class="hl-more" href="/about">{t["meet_more"]} &rarr;</a>\n      <div class="hl-social"><a class="hl-sbtn" href="{IG}" target="_blank" rel="noopener noreferrer">{t["ig"]}</a><a class="hl-sbtn" href="{WA}" target="_blank" rel="noopener noreferrer">{t["wa"]}</a></div>\n    </div>\n  </div>\n</section>\n' + MEET_CSS.replace("PAPER_MEET", paper.rule(".hl-meet::before", 50)))
    qs = "".join(f'<details class="hl-q" style="--r:{ROT[i]};--t:{TAPES[i % 4]}"><summary>{q}</summary><p>{a}</p></details>\n    ' for i, (q, a) in enumerate(t["faq"]))
    faq = (f"<!-- MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: LOGISTICS FAQ accordion (native details elements). Built by page-embeds/build_home_lower.py. Oct 17, 2026. -->\n"
           f'<section class="hl hl-faq" id="faq" aria-label="{t["faq_title"]}">\n  <div class="hl-faq-wrap">\n    <h2 class="hl-title">{t["faq_title"]}</h2>\n    <p class="hl-sub">{t["faq_sub"]}</p>\n    {qs}'
           f'<p class="hl-ask">{t["ask"]} <a href="{WA}" target="_blank" rel="noopener noreferrer">{t["ask_link"]}</a></p>\n  </div>\n</section>\n' + FAQ_CSS.replace("PAPER_FAQ", paper.rule(".hl-faq::before", 30)))
    open(f"home-meet{suf}.html", "w", encoding="utf-8").write(meet)
    open(f"home-faq{suf}.html", "w", encoding="utf-8").write(faq)
    print("wrote", suf or "en")
