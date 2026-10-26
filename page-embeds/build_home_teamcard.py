import json
# Builds the Team price card for Home (/) and /es: home-team-card.html and home-team-card-es.html.
# Oct 16, 2026: replaces the booking calendar in the Team section. Home sells, the Team page books.
# Price slider (same rates as the Team page), a Learn more button, three mini Polaroids and one quote.
# Lives inside the Webflow .mw-form-card in the right column (same slot the calendar embed used).
CDN = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
PICS = [
    (CDN + "6ac75117a6fa1b95aee600c4_polaroid-team-ernesto-la-placita.webp", "Tour group holding their Polaroid at La Placita Olvera", "-2.5deg"),
    (CDN + "6ac75117841a7417a042bd51_polaroid-konzi-kike.webp", "Two guests with their Polaroid", "1.8deg"),
    (CDN + "6ac751174bd6ed04e690b33a_polaroid-alejandra-blue-ribbon.webp", "Guest with her Polaroid at the Blue Ribbon Garden", "-1.2deg"),
]
import stamps
# Oct 20, 2026 (Marlon): a different ink stamp for each celebration. key: (icon, ink, rotation, seed, EN top, ES top)
STAMP = {
    "birthday": ("cake", "#D6479B", -7, 6, "HAPPY BIRTHDAY", "FELIZ CUMPLEAÑOS"),
    "milestone": ("trophy", "#E89B00", 8, 9, "MILESTONE", "UN GRAN LOGRO"),
    "offsite": ("palms3", "#2E9E57", -8, 3, "OUT OF OFFICE", "FUERA DE LA OFICINA"),
    "just-because": ("polaroid", "#6A4C93", 7, 11, "JUST BECAUSE", "PORQUE SÍ"),
}
# Oct 23, 2026 (Marlon): three ink stamps under the price sum up the choices: the celebration (STAMP above), the team size (a number stamp, stops at 20+) and the lunch plan.
def count_stamp(uid, top, bottom, ink, rot=6, seed=5):
    return stamps.num_stamp(uid, top, bottom, ink, "tq-nstamp", "15", rot, seed)
# (key, icon, ink, rotation, seed, EN top, EN bottom, ES top, ES bottom)
LUNCH_ST = {
    "own": ("stall", "#E2662A", -6, 4, "EVERYONE BUYS THEIR OWN", "GRAND CENTRAL MARKET", "CADA QUIEN COMPRA LO SUYO", "GRAND CENTRAL MARKET"),
    "plan": ("bag", "#C2352A", 6, 7, "CATERED LUNCH", "ARRANGED BY MARLON", "ALMUERZO CON CATERING", "ORGANIZA MARLON"),
}
COUNT_TXT = {"en": ("TEAM OF", "PEOPLE"), "es": ("EQUIPO DE", "PERSONAS")}
EAT = {"en": ("Lunch plans", [("own", "Everyone buys their own"), ("plan", "Marlon arranges catering")],
              {"own": "Lunch is not included. Everyone picks and pays for their own food at Grand Central Market.", "plan": "Marlon books a catered meal for your group and confirms the price with you."}),
       "es": ("Plan de almuerzo", [("own", "Cada quien compra lo suyo"), ("plan", "Marlon organiza el catering")],
              {"own": "El almuerzo no está incluido. Cada quien elige y paga su comida en Grand Central Market.", "plan": "Marlon reserva un catering para tu grupo y te confirma el precio."})}
T = {
 "en": dict(lang="en", title="Your team day", label="How many people?", est="estimated total", pp="per person",
   pp_pre="~$", save="saved", notes="", for5="for 5 hours", plus="+ lunch", capp="Marlon confirms the lunch price", v=["&#9201;&#65039; 5 hours", "&#128673; Angels Flight tix", "&#128248; Photo for everyone", "&#129517; Local guide"], vno=["&#127869;&#65039; Food"], addon="Add-on: we plan your group meal ahead of time. Ask Marlon.", big="Larger group? Contact me",
   btn="Schedule Your Team", btn_note="", href="/team-outings-los-angeles",
   custom="Have a custom request?", mail="mailto:marlonwalksla@gmail.com?subject=Custom%20team%20outing%20request",
   wa="Message Marlon about your group",
   wa_href="https://wa.me/12692670410?text=Hi%20Marlon,%20we%20have%20a%20group%20of%20more%20than%2020",
   proof="The proof is in the Polaroids",
   quote="He also set up fun games that kept everyone engaged and frenzied in competition", who="Addison R. · Google"),
 "es": dict(lang="es", title="Tu d&iacute;a de equipo", label="¿Cuántas personas?", est="total estimado", pp="por persona",
   pp_pre="~$", save="de ahorro", notes="", for5="por 5 horas", plus="+ almuerzo", capp="Marlon confirma el precio del almuerzo", v=["&#9201;&#65039; 5 horas", "&#128673; Boletos de Angels Flight", "&#128248; Foto para todos", "&#129517; Guía local"], vno=["&#127869;&#65039; Comida"], addon="Extra: planeamos la comida de tu grupo con anticipación. Pregúntale a Marlon.", big="¿Grupo más grande? Escríbeme",
   btn="Agenda a tu equipo", btn_note="", href="/salidas-de-equipo-los-angeles",
   custom="¿Tienes una solicitud especial?", mail="mailto:marlonwalksla@gmail.com?subject=Solicitud%20especial%20para%20mi%20equipo",
   wa="Escríbele a Marlon sobre tu grupo",
   wa_href="https://wa.me/12692670410?text=Hola%20Marlon,%20somos%20un%20grupo%20de%20m%C3%A1s%20de%2020",
   proof="La prueba está en las Polaroids",
   quote="He also set up fun games that kept everyone engaged and frenzied in competition", who="Addison R. · Google (en inglés)"),
}
CEL = {"en": ("What are you celebrating?", [("offsite", "&#127796; Offsite"), ("birthday", "&#127874; Birthday"), ("milestone", "&#127942; Milestone"), ("just-because", "&#127881; Just because")]),
       "es": ("&iquest;Qu&eacute; celebran?", [("offsite", "&#127796; Retiro de empresa"), ("birthday", "&#127874; Cumplea&ntilde;os"), ("milestone", "&#127942; Un logro"), ("just-because", "&#127881; Porque s&iacute;")])}
for lang, t in T.items():
    cel_h, cel_opts = CEL[lang]
    cel = "".join(f'<button type="button" class="tq-chip" data-c="{k}" aria-pressed="{"true" if k == "offsite" else "false"}">{v}</button>' for k, v in cel_opts)
    eat_h, eat_opts, eat_msg = EAT[lang]
    eat = "".join(f'<button type="button" class="tq-chip" data-e="{k}" data-note="{eat_msg[k]}" aria-pressed="{"true" if k == "own" else "false"}">{v}</button>' for k, v in eat_opts)
    sts = "".join(f'<span class="tq-st" data-c="{k}"{"" if k == "offsite" else " hidden"}>' + stamps.stamp("tqs" + k[:3], (v[5] if lang == "es" else v[4]), "SALIDAS DE EQUIPO" if lang == "es" else "TEAM OUTINGS", v[0], "", v[1], v[2], v[3]) + "</span>" for k, v in STAMP.items())
    ct, cb = COUNT_TXT[lang]
    esl = lang == "es"
    lunch = "".join(f'<span class="tq-st2" data-e="{k}"{"" if k == "own" else " hidden"}>' + stamps.stamp("tqe" + k[:2], (v[6] if esl else v[4]), (v[7] if esl else v[5]), v[0], "", v[1], v[2], v[3]) + "</span>" for k, v in LUNCH_ST.items())
    sum_row = (f'<div class="tq-sum" aria-hidden="true"><div class="tq-slot"><div class="tq-stamp-in">{sts}</div></div>'
               f'<div class="tq-slot"><span class="tq-st2">{count_stamp("tqn", ct, cb, "#1B6688")}</span></div>'
               f'<div class="tq-slot">{lunch}</div></div>')
    pics = "".join(
        f'<span class="tq-pol" style="--r:{r}"><img src="{src}" alt="{alt}" loading="lazy"></span>' for src, alt, r in PICS)
    note = f'<p class="tq-btnnote">{t["btn_note"]}</p>' if t["btn_note"] else ""
    html = f"""<!-- MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: TEAM PRICE CARD. Built by page-embeds/build_home_teamcard.py.
     Oct 16, 2026: replaces the booking calendar on Home. Lives inside the Webflow .mw-form-card (right column of #team-split).
     The Team page keeps the calendar (team-cal.html). Rates match the Team page slider. -->
<div class="tq" id="tq">
  <h3 class="tq-title">{t["title"]}</h3>
  <div class="tq-cel" role="group" aria-label="{cel_h}"><p class="tq-cel-h">{cel_h}</p><div class="tq-chips">{cel}</div></div>
  <label class="tq-label" for="tq-range">{t["label"]} <strong id="tq-n">15</strong></label>
  <input class="tq-range" id="tq-range" type="range" min="5" max="20" step="1" value="15" aria-describedby="tq-out">
  <div class="tq-ticks" aria-hidden="true"><span>5</span><span>10</span><span>15</span><span>20</span></div>
  <div class="tq-cel tq-eat" role="group" aria-label="{eat_h}"><p class="tq-cel-h">{eat_h}</p><div class="tq-chips">{eat}</div><p class="tq-eat-note" id="tq-eat-note" aria-live="polite">{eat_msg["own"]}</p></div>
  <div class="tq-res">
  <div class="tq-out" id="tq-out" aria-live="polite">
    <div><span class="tq-tr"><span class="tq-total" id="tq-total">$790</span><span class="tq-plus" id="tq-plus" hidden>{t["plus"]}</span></span><span class="tq-cap" id="tq-cap">{t["est"]}</span></div>
    <div><span class="tq-ppr"><span class="tq-pp" id="tq-pp">{t["pp_pre"]}53</span><span class="tq-save" id="tq-save" hidden></span></span><span class="tq-cap">{t["pp"]}</span></div>
  </div>
  {sum_row}
  <div class="pc-cta"><a class="tq-btn" href="{t["href"]}">{t["btn"]}</a></div>
  {note}
  <a class="tq-custom" href="{t["mail"]}">{t["custom"]}</a>
  </div>
</div>
<style>
  .mw-form-card:has(.tq) > .w-form {{ display: none !important; }}
  .mw-form-card:has(.tq) {{ margin-top: 0; padding: 22px 22px 20px; --px: 22px; --pb: 20px; }}
  /* Oct 17, 2026: the card is short now, so it stays in view while the photos and map scroll */
  .tq {{ font-family: "Nunito", system-ui, sans-serif; color: #27302E; }}
  .tq-title {{ font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.5rem; line-height: 1.15; margin: 0 0 10px; color: #27302E; }}
  .tq-label {{ display: block; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 1.02rem; margin-bottom: 4px; }}
  .tq-label strong {{ color: #1B6688; font-size: 1.3rem; margin-left: 6px; }}
  .tq-range {{ width: 100%; height: 30px; accent-color: #1B6688; cursor: pointer; margin: 0; }}
  .tq-ticks {{ display: flex; justify-content: space-between; font-size: 0.78rem; color: #5B6663; padding: 0 4px; }}
  .tq-out {{ display: flex; flex-wrap: wrap; gap: 8px 36px; align-items: baseline; margin: 14px 0 6px; }}
  .tq-out > div {{ display: flex; flex-direction: column; }}
  .tq-total {{ font-family: "Lilita One", sans-serif; font-size: clamp(2.2rem, 5vw, 2.8rem); line-height: 1; color: #27302E; font-variant-numeric: tabular-nums; }}
  .tq-pp {{ font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1.35rem; color: #27302E; font-variant-numeric: tabular-nums; }}
  .tq-cap {{ font-size: 0.82rem; color: #5B6663; margin-top: 3px; white-space: nowrap; }}
  .tq-notes {{ margin: 8px 0 14px; font-size: 0.92rem; line-height: 1.4; color: #4D5551; }}
  .tq-btn {{ display: block; text-align: center; font-family: "Lilita One", sans-serif; font-size: 1.25rem; letter-spacing: 0.01em; color: #27302E !important; text-decoration: none !important; background: #FFD43B; border: 2.5px solid #27302E; border-radius: 999px; padding: 12px 24px; box-shadow: 4px 4px 0 #27302E; transition: transform 0.18s ease-out, box-shadow 0.18s ease-out; }}
  .tq-btn:hover {{ transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #27302E; }}
  .tq-btn:active {{ transform: translate(2px, 2px); box-shadow: 1px 1px 0 #27302E; }}
  .tq-btn:focus-visible {{ outline: 3px solid #2890B6; outline-offset: 4px; }}
  .tq-btnnote {{ margin: 8px 0 0; text-align: center; font-size: 0.85rem; color: #5B6663; }}
  .tq-wa {{ display: block; text-align: center; margin-top: 12px; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.95rem; color: #1B6688 !important; text-decoration: none; padding: 4px 0; }}
  .tq-wa:hover {{ text-decoration: underline; }}
  .tq-custom {{ display: block; text-align: center; margin-top: 2px; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.95rem; color: #4D5551 !important; text-decoration: underline !important; text-underline-offset: 3px; padding: 8px 0; }}
  .tq-custom:hover {{ color: #27302E !important; }}
  /* Oct 17, 2026 (Marlon, via Gemini): the slider is the star of the Team section */
  .mw-form-card:has(.tq) {{ padding: 26px 26px 20px; box-shadow: 6px 6px 0 #27302E; --px: 26px; --pb: 20px; }}
  .tq-title {{ font-size: 1.8rem; }}
  .tq-label {{ font-size: 1.15rem; }}
  .tq-label strong {{ font-size: 1.7rem; }}
  .tq-range {{ height: 42px; }}
  /* Oct 19, 2026 (Marlon): the bar fills with color as you add people (--p is set from the slider value) */
  .tq-range {{ --p: 38%; }}
  .tq-tr {{ display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }}
  .tq-for {{ font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1.15rem; color: #27302E; }}
  .tq-val {{ list-style: none; margin: 4px 0 8px; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }}
  .tq-val li {{ font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1rem; line-height: 1.2; color: #1E6B3A; background: #DFF5E3; border: 2px solid #1E6B3A; border-radius: 999px; padding: 7px 14px; }}
  .tq-val li::before {{ content: none; }}
  .tq-add {{ margin: 0 0 14px; font-size: 0.95rem; line-height: 1.4; color: #3B4440; }}
  .tq-big {{ margin: 0 0 12px; padding: 12px 16px; border-radius: 14px; background: #FFF1B8; border: 2px solid #27302E; text-align: center; animation: tqdrop 0.3s ease-out; }}
  .tq-big[hidden] {{ display: none; }}
  .tq-big .tq-wa {{ margin-top: 2px; }}
  @keyframes tqdrop {{ from {{ opacity: 0; transform: translateY(-8px); }} to {{ opacity: 1; transform: none; }} }}
  @media (prefers-reduced-motion: reduce) {{ .tq-big {{ animation: none; }} }}
  .tq {{ position: relative; }}
  .tq-stamp-in {{ position: absolute; inset: 0; }}
  .tq-st, .tq-st2 {{ position: absolute; inset: 0; mix-blend-mode: multiply; opacity: 0.92; }}
  .tq-st2[hidden] {{ display: none; }}
  .tq-st2 svg {{ width: 100%; height: 100%; transform: rotate(var(--r)); overflow: visible; }}
  .tq-st2.pop {{ animation: tqpop 0.35s cubic-bezier(.2, 1.4, .4, 1); }}
  /* the three stamps under the price: celebration, team size, lunch plan */
  .tq-sum {{ display: flex; justify-content: center; gap: 10px; margin: 2px 0 14px; }}
  .tq-slot {{ position: relative; width: 92px; height: 92px; flex: none; }}
  @media (max-width: 420px) {{ .tq-slot {{ width: 84px; height: 84px; }} .tq-sum {{ gap: 6px; }} }}
  .tq-st[hidden] {{ display: none; }}
  .tq-st svg {{ width: 100%; height: 100%; transform: rotate(var(--r)); overflow: visible; }}
  .tq-st.pop {{ animation: tqpop 0.35s cubic-bezier(.2, 1.4, .4, 1); }}
  @keyframes tqpop {{ from {{ opacity: 0; transform: scale(1.5) rotate(-12deg); }} to {{ opacity: 0.92; transform: none; }} }}
  @media (prefers-reduced-motion: reduce) {{ .tq-st.pop, .tq-st2.pop {{ animation: none; }} }}
  .tq-eat {{ margin-top: 16px; }}
  .tq-eat-note {{ margin: 8px 0 0; font-family: "Nunito", system-ui, sans-serif; font-weight: 400; font-size: 0.9rem; line-height: 1.45; color: #4D5551; min-height: 2.9em; }}
  /* Oct 20, 2026 (Marlon): shorter form */
  .mw-form-card:has(.tq) {{ padding: 18px 22px 16px; --px: 22px; --pb: 16px; }}
  .tq-title {{ font-size: 1.6rem; margin-bottom: 8px; }}
  .tq-cel {{ margin: 0 0 10px; }}
  .tq-cel-h {{ margin-bottom: 5px; font-size: 0.9rem; }}
  .tq-chips {{ gap: 6px; }}
  .tq-chip {{ font-size: 0.9rem; padding: 4px 12px; min-height: 32px; }}
  .tq-label {{ font-size: 1.05rem; margin-bottom: 0; }}
  .tq-label strong {{ font-size: 1.4rem; }}
  .tq-range {{ height: 34px; }}
  .tq-ticks {{ margin-top: -4px; }}
  .tq-out {{ margin: 8px 0 4px; gap: 4px 28px; }}
  /* Oct 23, 2026 (Marlon): the price, the facts and the button live in their own tinted panel, split from the choices by a dashed line */
  .tq-res {{ margin: 18px calc(-1 * var(--px, 22px)) calc(-1 * var(--pb, 20px)); padding: 18px var(--px, 22px) 18px; background: #D5EAF6; border-top: 2px dashed rgba(39, 48, 46, 0.3); border-radius: 0 0 14px 14px; }}
  .tq-res .tq-out {{ margin: 0 0 8px; }}
  .tq-res .tq-val {{ margin: 0 0 18px; }}
  .tq-res .tq-val li {{ background: #fff; }}
  .tq-res .tq-val li.no {{ background: #FFE4EA; }}
  .tq-res .tq-val li.no.yes {{ background: #fff; }}
  .tq-res .tq-cap {{ color: #4D5551; }}
  .tq-res .tq-save {{ background: #fff; }}
  .tq-val li.no {{ color: #A12B4A; background: #FFE4EA; border: 2px solid #E58AA3; }}
  .tq-val li.no.yes {{ color: #1E6B3A; background: #DFF5E3; border: 2px solid #1E6B3A; }}
  .tq-val li.no.yes::before {{ content: none; }}
  .tq-val li.no::before {{ content: none; }}
  .tq-plus {{ font-family: "Fredoka", sans-serif; font-weight: 700; font-size: 1.5rem; color: #27302E; }}
  .tq-plus[hidden] {{ display: none; }}
  .tq-val {{ margin: 2px 0 10px; gap: 6px; }}
  .tq-val li {{ font-size: 0.86rem; padding: 4px 10px; }}
  .tq-btn {{ padding: 10px 24px; font-size: 1.15rem; }}
  .tq-big {{ margin: 0 0 8px; padding: 8px 12px; }}
  .tq-ppr {{ display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }}
  .tq-save {{ font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.9rem; padding: 2px 10px; border-radius: 99px; background: #DFF5E3; color: #1E6B3A; }}
  .tq-save[hidden] {{ display: none; }}
  .tq-range::-webkit-slider-runnable-track {{ height: 14px; border-radius: 99px; background: linear-gradient(to right, #5DB43E 0, #5DB43E var(--p), #D9CFBC var(--p), #D9CFBC 100%); }}
  .tq-range::-moz-range-track {{ height: 14px; border-radius: 99px; background: #D9CFBC; }}
  .tq-range::-moz-range-progress {{ height: 14px; border-radius: 99px; background: #5DB43E; }}
  .tq-range::-webkit-slider-thumb {{ -webkit-appearance: none; width: 32px; height: 32px; margin-top: -9px; border-radius: 50%; background: #FFD43B; border: 3px solid #27302E; box-shadow: 2px 2px 0 #27302E; }}
  .tq-range::-moz-range-thumb {{ width: 26px; height: 26px; border-radius: 50%; background: #FFD43B; border: 3px solid #27302E; box-shadow: 2px 2px 0 #27302E; }}
  .tq-total {{ font-size: clamp(3rem, 6vw, 3.8rem); }}
  .tq-proof {{ margin-top: 14px; padding-top: 14px; border-top: 1.5px dashed #D5DCE0; }}
  .tq-proof-h {{ font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.1rem; margin: 0 0 12px; color: #27302E; }}
  .tq-pols {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; padding: 0 4px; }}
  .tq-pol {{ display: block; background: #fff; padding: 5px 5px 14px; border-radius: 3px; box-shadow: 0 6px 14px -6px rgba(39, 48, 46, 0.45); transform: rotate(var(--r)); }}
  .tq-pol img {{ display: block; width: 100%; aspect-ratio: 1 / 1; object-fit: cover; border-radius: 2px; }}
  .tq-q {{ margin: 14px 0 0; }}
  .tq-q blockquote {{ margin: 0; font-size: 0.95rem; line-height: 1.45; color: #3B4440; }}
  .tq-q figcaption {{ margin-top: 4px; font-size: 0.82rem; color: #5B6663; }}
  .tq-q figcaption span {{ color: #E89B00; letter-spacing: 1px; margin-right: 4px; }}
  .tq-cel {{ margin: 0 0 16px; }}
  .tq-cel-h {{ margin: 0 0 8px; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.95rem; color: #27302E; }}
  .tq-chips {{ display: flex; flex-wrap: wrap; gap: 8px; }}
  .tq-chip {{ font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.95rem; line-height: 1.2; color: #27302E; background: #fff; border: 1.5px solid #27302E; border-radius: 999px; padding: 7px 14px; min-height: 36px; cursor: pointer; transition: background-color 0.15s ease-out, transform 0.15s ease-out; }}
  .tq-chip:hover {{ background: #FFF1B8; }}
  .tq-chip[aria-pressed="true"] {{ background: #FFD43B; box-shadow: 2px 2px 0 #27302E; font-weight: 600; }}
  .tq-chip:focus-visible {{ outline: 3px solid #2890B6; outline-offset: 2px; }}
  @media (prefers-reduced-motion: reduce) {{ .tq-btn, .tq-chip {{ transition: none; }} }}
</style>
<script>
(function () {{
  var root = document.getElementById("tq"), r = document.getElementById("tq-range");
  if (!root || !r) return;
  var card = root.closest(".mw-form-card"), oldForm = card && card.querySelector(".w-form");
  if (oldForm) oldForm.style.display = "none";
  var rates = [60, 52.5, 45, 37.5, 30, 22.5], pre = {t["pp_pre"]!r}, saveWord = {t["save"]!r};
  function total(n) {{ var t = 0; for (var i = 0; i < n; i++) t += rates[Math.min(Math.floor(i / 5), rates.length - 1)]; return Math.round(t / 5) * 5; }}
  function upd() {{
    var n = parseInt(r.value, 10), t = total(n);
    document.getElementById("tq-n").textContent = n; var ns = document.getElementById("tq-nstamp"); if (ns) {{ ns.textContent = n >= 20 ? "20+" : n; ns.setAttribute("font-size", n >= 20 ? "62" : "78"); ns.setAttribute("y", n >= 20 ? "122" : "127"); }}
    r.style.setProperty("--p", ((n - 5) / 15 * 100) + "%");
    document.getElementById("tq-total").textContent = "$" + t.toLocaleString("en-US");
    document.getElementById("tq-pp").textContent = pre + Math.round(t / n);
    var sv = Math.round((1 - t / n / 60) * 100), el = document.getElementById("tq-save"); el.hidden = sv < 1; el.textContent = sv + "% " + saveWord;
  }}
  var btn = root.querySelector(".tq-btn"), base = btn ? btn.getAttribute("href") : "", sel = {{ c: "offsite", e: "own" }}, plus = document.getElementById("tq-plus"), capEl = document.getElementById("tq-cap"), est = capEl.textContent, capp = {t["capp"]!r};
  function link() {{ var q = []; if (sel.c) q.push("celebrating=" + sel.c); if (sel.e) q.push("eating=" + sel.e); if (btn) btn.setAttribute("href", q.length ? base + "?" + q.join("&") : base); }}
  function applyCel(key) {{
    var key2 = key || "offsite";
    [].slice.call(root.querySelectorAll(".tq-chip[data-c]")).forEach(function (o) {{ o.setAttribute("aria-pressed", key && o.getAttribute("data-c") === key ? "true" : "false"); }});
    sel.c = key || "";
    [].slice.call(root.querySelectorAll(".tq-st")).forEach(function (st) {{ var show = st.getAttribute("data-c") === key2; st.hidden = !show; st.classList.remove("pop"); if (show) {{ void st.offsetWidth; st.classList.add("pop"); }} }});
    link();
  }}
  [].slice.call(root.querySelectorAll(".tq-chip")).forEach(function (c) {{
    c.addEventListener("click", function () {{
      if (c.hasAttribute("data-c")) {{
        var v = c.getAttribute("data-c"), on = c.getAttribute("aria-pressed") !== "true";
        applyCel(on ? v : "");
        try {{ window.dispatchEvent(new CustomEvent("mwcel", {{ detail: on ? v : "offsite" }})); }} catch (e) {{}}  /* Oct 23, 2026: the photo slider on the left follows the occasion */
        return;
      }}
      var ev = c.getAttribute("data-e"), eon = c.getAttribute("aria-pressed") !== "true";
      [].slice.call(c.parentNode.children).forEach(function (o) {{ o.setAttribute("aria-pressed", "false"); }});
      c.setAttribute("aria-pressed", eon ? "true" : "false"); sel.e = eon ? ev : "";
      var nt = document.getElementById("tq-eat-note"); if (nt) nt.textContent = eon ? c.getAttribute("data-note") : ""; plus.hidden = sel.e !== "plan"; capEl.textContent = sel.e === "plan" ? capp : est; var food = document.getElementById("mwsh-food"); if (food) food.hidden = sel.e !== "plan";
      [].slice.call(root.querySelectorAll(".tq-st2[data-e]")).forEach(function (st) {{ var show = st.getAttribute("data-e") === sel.e; st.hidden = !show; st.classList.remove("pop"); if (show) {{ void st.offsetWidth; st.classList.add("pop"); }} }});
      link();
    }});
  }});
  /* Oct 23, 2026 (Marlon): flipping the photo arrows on the left also moves the occasion chips */
  window.addEventListener("mwcel2", function (e) {{ if (e.detail) applyCel(e.detail); }});
  link(); r.addEventListener("input", upd); upd();
}})();
</script>
"""
    name = f"home-team-card{'-es' if lang == 'es' else ''}.html"
    open(name, "w", encoding="utf-8").write(html)
    print("wrote", name, len(html))
