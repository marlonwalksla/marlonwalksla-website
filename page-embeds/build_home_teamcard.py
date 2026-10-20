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
T = {
 "en": dict(lang="en", title="Price your team day", label="How many people?", est="estimated total", pp="per person",
   pp_pre="about $", notes="5 hours · Angels Flight ride and an instant photo for everyone included · Lunch at the end, not included",
   btn="Learn more", btn_note="", href="/team-building-walking-tour-los-angeles",
   custom="Have a custom request?", mail="mailto:marlonwalksla@gmail.com?subject=Custom%20team%20outing%20request",
   wa="More than 30 guests? Message Marlon",
   wa_href="https://wa.me/12692670410?text=Hi%20Marlon,%20we%20have%20a%20group%20of%20more%20than%2030",
   proof="The proof is in the Polaroids",
   quote="He also set up fun games that kept everyone engaged and frenzied in competition", who="Addison R. · Google"),
 "es": dict(lang="es", title="Calcula el precio de tu equipo", label="¿Cuántas personas?", est="total estimado", pp="por persona",
   pp_pre="unos $", notes="5 horas · Incluye Angels Flight y una foto instantánea para cada quien · Almuerzo al final, no incluido",
   btn="Más información", btn_note="La página completa está en inglés.", href="/team-building-walking-tour-los-angeles",
   custom="¿Tienes una solicitud especial?", mail="mailto:marlonwalksla@gmail.com?subject=Solicitud%20especial%20para%20mi%20equipo",
   wa="¿Más de 30 personas? Escríbeme",
   wa_href="https://wa.me/12692670410?text=Hola%20Marlon,%20somos%20un%20grupo%20de%20m%C3%A1s%20de%2030",
   proof="La prueba está en las Polaroids",
   quote="He also set up fun games that kept everyone engaged and frenzied in competition", who="Addison R. · Google (en inglés)"),
}
CEL = {"en": ("What are you celebrating?", [("birthday", "Birthday"), ("milestone", "Milestone"), ("retirement", "Retirement"), ("offsite", "Offsite"), ("just-because", "Just because")]),
       "es": ("&iquest;Qu&eacute; celebran?", [("birthday", "Cumplea&ntilde;os"), ("milestone", "Un logro"), ("retirement", "Jubilaci&oacute;n"), ("offsite", "Retiro de empresa"), ("just-because", "Porque s&iacute;")])}
for lang, t in T.items():
    cel_h, cel_opts = CEL[lang]
    cel = "".join(f'<button type="button" class="tq-chip" data-c="{k}" aria-pressed="false">{v}</button>' for k, v in cel_opts)
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
  <input class="tq-range" id="tq-range" type="range" min="5" max="30" step="1" value="15" aria-describedby="tq-out">
  <div class="tq-ticks" aria-hidden="true"><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span></div>
  <div class="tq-out" id="tq-out" aria-live="polite">
    <div><span class="tq-total" id="tq-total">$790</span><span class="tq-cap">{t["est"]}</span></div>
    <div><span class="tq-pp" id="tq-pp">{t["pp_pre"]}53</span><span class="tq-cap">{t["pp"]}</span></div>
  </div>
  <p class="tq-notes">{t["notes"]}</p>
  <div class="pc-cta"><img class="pc-cta-ern" src="https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/6a87ce84d9af8f7c9bf12030_Tour%20Guide.avif" alt="" aria-hidden="true" loading="lazy"><a class="tq-btn" href="{t["href"]}">{t["btn"]}</a></div>
  {note}
  <a class="tq-wa" href="{t["wa_href"]}" target="_blank" rel="noopener noreferrer">&#128172; {t["wa"]}</a>
  <a class="tq-custom" href="{t["mail"]}">{t["custom"]}</a>
</div>
<style>
  .mw-form-card:has(.tq) > .w-form {{ display: none !important; }}
  .mw-form-card:has(.tq) {{ margin-top: 0; padding: 22px 22px 20px; }}
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
  .tq-cap {{ font-size: 0.82rem; color: #5B6663; margin-top: 3px; }}
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
  .mw-form-card:has(.tq) {{ padding: 26px 26px 20px; box-shadow: 6px 6px 0 #27302E; }}
  .tq-title {{ font-size: 1.8rem; }}
  .tq-label {{ font-size: 1.15rem; }}
  .tq-label strong {{ font-size: 1.7rem; }}
  .tq-range {{ height: 42px; }}
  /* Oct 19, 2026 (Marlon): the bar fills with color as you add people (--p is set from the slider value) */
  .tq-range {{ --p: 38%; }}
  .tq-range::-webkit-slider-runnable-track {{ height: 10px; border-radius: 99px; background: linear-gradient(to right, #5DB43E 0, #5DB43E var(--p), #D9CFBC var(--p), #D9CFBC 100%); }}
  .tq-range::-moz-range-track {{ height: 10px; border-radius: 99px; background: #D9CFBC; }}
  .tq-range::-moz-range-progress {{ height: 10px; border-radius: 99px; background: #5DB43E; }}
  .tq-range::-webkit-slider-thumb {{ -webkit-appearance: none; width: 32px; height: 32px; margin-top: -11px; border-radius: 50%; background: #FFD43B; border: 3px solid #27302E; box-shadow: 2px 2px 0 #27302E; }}
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
  var rates = [60, 52.5, 45, 37.5, 30, 22.5], pre = {t["pp_pre"]!r};
  function total(n) {{ var t = 0; for (var i = 0; i < n; i++) t += rates[Math.min(Math.floor(i / 5), rates.length - 1)]; return Math.round(t / 5) * 5; }}
  function upd() {{
    var n = parseInt(r.value, 10), t = total(n);
    document.getElementById("tq-n").textContent = n;
    r.style.setProperty("--p", ((n - 5) / 25 * 100) + "%");
    document.getElementById("tq-total").textContent = "$" + t.toLocaleString("en-US");
    document.getElementById("tq-pp").textContent = pre + Math.round(t / n);
  }}
  var btn = root.querySelector(".tq-btn"), base = btn ? btn.getAttribute("href") : "", chips = root.querySelectorAll(".tq-chip");
  chips.forEach(function (c) {{
    c.addEventListener("click", function () {{
      var on = c.getAttribute("aria-pressed") !== "true";
      chips.forEach(function (o) {{ o.setAttribute("aria-pressed", "false"); }});
      c.setAttribute("aria-pressed", on ? "true" : "false");
      if (btn) btn.setAttribute("href", on ? base + "?celebrating=" + c.getAttribute("data-c") : base);
    }});
  }});
  r.addEventListener("input", upd); upd();
}})();
</script>
"""
    name = f"home-team-card{'-es' if lang == 'es' else ''}.html"
    open(name, "w", encoding="utf-8").write(html)
    print("wrote", name, len(html))
