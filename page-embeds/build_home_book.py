# Builds home-book.html: the Home "Join a Free Tour" section (same file on / and /es).
# Oct 16, 2026 (Marlon's option A): EN/ES Cal.com calendars with a scrolling strip of
# route stop photos beside them (a swipe row on phones). Starts in Spanish when the
# page language is es (the Spanish Home hero sets it before this runs).
import json
C = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
STOPS = [
  (C+"6ac74a8b6dc6526aa1e35909_polaroid-disney-hall-couple.webp", "Walt Disney Concert Hall", "Where we meet", "Walt Disney Concert Hall", "Punto de encuentro", "Guests with their Polaroid at Walt Disney Concert Hall"),
  (C+"6a51ec6473eccefdeea7678e_The%20Broad.webp", "The Broad", "Free contemporary art", "The Broad", "Arte contemporáneo gratis", "Ernesto at The Broad"),
  (C+"6ac74a89e44a0b1c364553f8_polaroid-angels-flight-car.webp", "Angels Flight", "The 1901 railway", "Angels Flight", "El funicular de 1901", "Polaroid of an Angels Flight car"),
  (C+"6ac74a8872cf323a6f897a43_polaroid-grand-central-market-night.webp", "Grand Central Market", "30+ food stalls since 1917", "Grand Central Market", "Más de 30 puestos desde 1917", "Polaroid of Grand Central Market at night"),
  (C+"6ac751176ec3f46c273784eb_polaroid-raul-bradbury.webp", "Bradbury Building", "The 1893 movie star", "Bradbury Building", "La estrella de cine de 1893", "A guest's Polaroid at the Bradbury Building"),
  (C+"6ac75117cf5707658580af96_polaroid-olga-evolution-la.webp", "The Evolution of Los Angeles", "LA's story on one mural", "La Evolución de Los Ángeles", "La historia de LA en un mural", "A family's Polaroid at The Evolution of Los Angeles mural"),
  (C+"6ac74a889c33f92895c9275a_polaroid-city-hall-couple.webp", "City Hall", "The 1928 tower", "City Hall", "La torre de 1928", "Polaroid at Los Angeles City Hall"),
  (None, "The courthouses", "LA's courthouses", "Los juzgados", "Los juzgados de LA", ""),
  (C+"6ac74a884cd6ef1aef19e7fc_polaroid-olvera-kiosko.webp", "Placita Olvera", "Where LA began in 1781", "La Placita Olvera", "Donde nació LA en 1781", "Polaroid of the kiosko at Placita Olvera"),
]
POINT = C+"6a87cf6d715b4e53c40aaf8d_Pointing%20(Left).avif"

def esc(s): return s.replace("&","&amp;").replace("<","&lt;").replace('"',"&quot;")

items = []
for i,(img,n_en,l_en,n_es,l_es,alt) in enumerate(STOPS,1):
    pic = (f'<img src="{img}" alt="{esc(alt)}" loading="lazy">' if img else
           f'<span class="mwla-stop-ph"><img src="{POINT}" alt="" aria-hidden="true"></span>')
    tape = ["rgba(255,0,255,.45)","rgba(255,255,0,.6)","rgba(40,144,182,.45)"][(i-1)%3]
    items.append(f'      <li class="mwla-stop"><span class="mwla-stop-pic"><span class="mwla-tape" style="background:{tape}"></span>{pic}<span class="mwla-stop-n" aria-hidden="true">{i}</span></span>'
                 f'<span class="mwla-stop-t"><b data-i18n="s{i}n">{esc(n_en)}</b><small data-i18n="s{i}l">{esc(l_en)}</small></span></li>')
text = {
 "en": {"eyebrow":"Free DTLA Walking Tour","title":"Join a Free Tour!",
        "sub":"Walk through 240 years of Los Angeles history, architecture and culture with a local guide. Booking takes under a minute.",
        "strip":"The route","hint":"Scroll the 9 stops","wa":"\U0001F4AC Questions? WhatsApp Marlon",
        "waHref":"https://wa.me/12692670410?text=Hi%20Marlon,%20I'm%20interested%20in%20joining%20the%20free%20Downtown%20LA%20walking%20tour!"},
 "es": {"eyebrow":"Free Tour por Downtown LA","title":"¡Únete a un Free Tour!",
        "sub":"Recorre 240 años de historia, arquitectura y cultura de Los Ángeles con un guía local. Reservar toma menos de un minuto.",
        "strip":"La ruta","hint":"Desliza las 9 paradas","wa":"\U0001F4AC ¿Preguntas? Escríbele a Marlon por WhatsApp",
        "waHref":"https://wa.me/12692670410?text=Hola%20Marlon,%20me%20interesa%20el%20free%20tour%20en%20espa%C3%B1ol"},
}
for i,(img,n_en,l_en,n_es,l_es,alt) in enumerate(STOPS,1):
    text["en"][f"s{i}n"]=n_en; text["en"][f"s{i}l"]=l_en
    text["es"][f"s{i}n"]=n_es; text["es"][f"s{i}l"]=l_es

html = f'''<!-- ==============================================================================
     MARLONWALKSLA - BOOK A FREE TOUR (CAL.COM INLINE CALENDARS, EN + ES)
     Built by page-embeds/build_home_book.py. Same embed on Home (/) and /es.
     EN event: cal.com/marlonwalksla/free-tour-dtla
     ES event: cal.com/marlonwalksla/free-tour-dtla-espanol
     Oct 16, 2026: calendar with a scrolling strip of the 9 route stops beside it.
     ============================================================================== -->
<div class="mwla-book" id="book">
  <div class="mwla-book-head">
    <img class="mwla-book-ernesto" src="{C}6a87cf72cbcbd01da7ff38c7_Pointing%20(Right).avif" alt="Ernesto pointing to the free tour calendar">
    <div class="mwla-book-head-text">
      <span class="mwla-book-eyebrow" data-i18n="eyebrow">{text["en"]["eyebrow"]}</span>
      <h2 class="mwla-book-title" data-i18n="title">{text["en"]["title"]}</h2>
      <p class="mwla-book-sub" data-i18n="sub">{text["en"]["sub"]}</p>
      <a class="mwla-book-wa" id="mwla-book-wa" href="{text["en"]["waHref"]}" target="_blank" rel="noopener noreferrer" data-i18n="wa">{text["en"]["wa"]}</a>
    </div>
  </div>

  <div class="mwla-lang-switch" role="group" aria-label="Tour language / Idioma del tour">
    <span class="mwla-lang-label">Tour language &middot; Idioma del tour</span>
    <div class="mwla-lang-pill">
      <button type="button" class="mwla-lang-opt is-active" id="mwla-lang-en" onclick="mwlaBookSet('en')" aria-pressed="true">English</button>
      <button type="button" class="mwla-lang-opt" id="mwla-lang-es" onclick="mwlaBookSet('es')" aria-pressed="false">Espa&ntilde;ol</button>
    </div>
  </div>

  <div class="mwla-book-grid">
    <section class="mwla-strip" aria-labelledby="mwla-strip-title">
      <div class="mwla-strip-head"><h3 id="mwla-strip-title" data-i18n="strip">{text["en"]["strip"]}</h3><span data-i18n="hint">{text["en"]["hint"]}</span></div>
      <div class="mwla-stops-wrap"><ol class="mwla-stops" tabindex="0">
{chr(10).join(items)}
      </ol></div>
    </section>
    <div class="mwla-book-cals">
      <div class="mwla-book-cal" id="mwla-cal-en"></div>
      <div class="mwla-book-cal" id="mwla-cal-es" style="display:none"></div>
    </div>
  </div>

</div>

<style>
  .mwla-book {{ max-width: 1140px; margin: 0 auto; padding: 56px 20px; box-sizing: border-box; font-family: "Nunito", -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; scroll-margin-top: 90px; }}
  .mwla-book *, .mwla-book *::before {{ box-sizing: border-box; }}
  .mwla-book-head {{ display: grid; grid-template-columns: 140px 1fr; gap: 24px; align-items: center; max-width: 820px; margin: 0 auto 24px; }}
  .mwla-book-ernesto {{ width: 140px; height: auto; display: block; }}
  .mwla-book-eyebrow {{ display: inline-block; font-family: "Fredoka", sans-serif; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #b45309; background: #ffffff; padding: 6px 14px; border-radius: 50px; margin-bottom: 12px; }}
  .mwla-book-title {{ font-size: clamp(1.9rem, 4vw, 2.8rem); line-height: 1.1; color: #0f172a; margin: 0 0 10px; }}
  .mwla-book-sub {{ font-size: 1.05rem; line-height: 1.55; color: #475569; margin: 0; max-width: 56ch; }}
  .mwla-lang-switch {{ display: flex; flex-direction: column; align-items: center; gap: 8px; margin: 0 auto 22px; }}
  .mwla-lang-label {{ font-size: 0.8rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #92400e; }}
  .mwla-lang-pill {{ display: inline-flex; background: #ffffff; border: 2px solid #f3e3b5; border-radius: 50px; padding: 4px; gap: 4px; }}
  .mwla-lang-opt {{ font: inherit; font-size: 1rem; font-weight: 800; color: #475569; background: transparent; border: none; border-radius: 50px; padding: 10px 26px; cursor: pointer; transition: background 0.15s ease-out, color 0.15s ease-out; }}
  .mwla-lang-opt:hover {{ color: #0f172a; }}
  .mwla-lang-opt.is-active {{ background: #FFD43B; color: #27302E; }}

  .mwla-book-grid {{ display: grid; grid-template-columns: 290px minmax(0, 1fr); gap: 20px; align-items: stretch; }}
  .mwla-strip {{ background: #FFF6E6; border-radius: 18px; padding: 16px 10px 0; display: grid; grid-template-rows: auto 1fr; min-height: 0; min-width: 0; overflow: hidden; }}
  .mwla-strip-head {{ display: flex; align-items: baseline; justify-content: space-between; gap: 8px; padding: 0 8px 6px; }}
  .mwla-strip-head h3 {{ font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.35rem; margin: 0; color: #27302E; }}
  .mwla-strip-head span {{ font-family: "Fredoka", sans-serif; font-size: 0.82rem; font-weight: 500; color: #5b6461; }}
  /* The list sits in an absolutely positioned box so the strip is exactly as tall as the calendar */
  .mwla-stops-wrap {{ position: relative; min-height: 0; }}
  .mwla-stops {{ position: absolute; inset: 0; list-style: none; margin: 0; padding: 18px 16px 24px; display: grid; align-content: start; gap: 30px; overflow-y: auto; scroll-snap-type: y proximity; overscroll-behavior: contain; }}
  .mwla-stops:focus-visible {{ outline: 3px solid #2890B6; outline-offset: -3px; border-radius: 10px; }}
  .mwla-stop {{ position: relative; scroll-snap-align: start; }}
  .mwla-stop-pic {{ position: relative; display: block; }}
  .mwla-stop:nth-child(odd) .mwla-stop-pic {{ transform: rotate(-1.8deg); }}
  .mwla-stop:nth-child(even) .mwla-stop-pic {{ transform: rotate(1.6deg); }}
  .mwla-stop-pic > img, .mwla-stop-ph {{ display: block; width: 100%; height: auto; border-radius: 3px; box-shadow: 0 10px 22px -10px rgba(39, 48, 46, 0.5); }}
  .mwla-stop-ph {{ aspect-ratio: 1 / 1; background: #ffffff; display: flex; align-items: center; justify-content: center; }}
  .mwla-stop-ph img {{ width: 46%; height: auto; }}
  .mwla-tape {{ position: absolute; top: -10px; left: 50%; width: 70px; height: 20px; transform: translateX(-50%) rotate(-4deg); z-index: 2; mix-blend-mode: multiply; }}
  .mwla-stop:nth-child(even) .mwla-tape {{ transform: translateX(-50%) rotate(5deg); }}
  .mwla-stop-n {{ position: absolute; top: -10px; left: -10px; width: 30px; height: 30px; border-radius: 50%; background: #2890B6; color: #ffffff; font-weight: 900; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; z-index: 3; }}
  .mwla-stop-t {{ display: flex; flex-direction: column; align-items: center; text-align: center; padding: 10px 4px 0; }}
  .mwla-stop-t b {{ font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.1rem; color: #27302E; line-height: 1.15; }}
  .mwla-stop-t small {{ font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.88rem; color: #4D5551; }}
  .mwla-book-cals {{ min-width: 0; }}
  .mwla-book-cal {{ width: 100%; min-height: 640px; border-radius: 18px; overflow: hidden; }}

  .mwla-book-wa {{ display: inline-block; margin-top: 10px; font-size: 0.95rem; font-weight: 700; color: #FFF6E6 !important; text-decoration: underline; text-underline-offset: 3px; }}
  .mwla-book-wa:hover {{ text-decoration: underline; }}

  @media (max-width: 900px) {{
    .mwla-book {{ padding: 40px 16px; }}
    .mwla-book-head {{ grid-template-columns: 1fr; text-align: center; gap: 8px; }}
    .mwla-book-ernesto {{ width: 92px; margin: 0 auto; }}
    .mwla-book-sub {{ margin: 0 auto; }}
    .mwla-book-grid {{ grid-template-columns: minmax(0, 1fr); }}
    .mwla-strip {{ display: block; padding-bottom: 4px; }}
    .mwla-stops-wrap {{ position: static; }}
    .mwla-stops {{ position: static; grid-auto-flow: column; grid-auto-columns: 150px; align-items: start; overflow-x: auto; overflow-y: visible; scroll-snap-type: x proximity; scroll-padding-left: 14px; padding: 18px 10px 14px 18px; gap: 20px; }}
    .mwla-book-cal {{ min-height: 560px; border-radius: 14px; }}
  }}
  @media (prefers-reduced-motion: reduce) {{ .mwla-lang-opt {{ transition: none; }} }}
</style>

<script type="text/javascript">
  (function (C, A, L) {{ let p = function (a, ar) {{ a.q.push(ar); }}; let d = C.document; C.Cal = C.Cal || function () {{ let cal = C.Cal; let ar = arguments; if (!cal.loaded) {{ cal.ns = {{}}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }} if (ar[0] === L) {{ const api = function () {{ p(api, arguments); }}; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") {{ cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); }} else p(cal, ar); return; }} p(cal, ar); }}; }})(window, "https://app.cal.com/embed/embed.js", "init");

  (function () {{
    const calEvents = {{
      en: {{ ns: "free-tour-dtla", link: "marlonwalksla/free-tour-dtla", el: "#mwla-cal-en" }},
      es: {{ ns: "free-tour-dtla-es", link: "marlonwalksla/free-tour-dtla-espanol", el: "#mwla-cal-es" }}
    }};
    const loaded = {{}};
    function loadCal(lang) {{
      if (loaded[lang] || typeof Cal !== "function") return;
      const ev = calEvents[lang];
      Cal("init", ev.ns, {{ origin: "https://app.cal.com" }});
      Cal.ns[ev.ns]("inline", {{ elementOrSelector: ev.el, config: {{ layout: "month_view", theme: "light" }}, calLink: ev.link }});
      Cal.ns[ev.ns]("ui", {{ theme: "light", hideEventTypeDetails: false, layout: "month_view" }});
      loaded[lang] = true;
    }}
    const T = {json.dumps(text, ensure_ascii=False)};
    const root = document.getElementById("book");
    function apply(lang) {{
      lang = lang === "es" ? "es" : "en";
      const t = T[lang];
      root.querySelectorAll("[data-i18n]").forEach(function (el) {{ const k = el.getAttribute("data-i18n"); if (t[k] != null) el.textContent = t[k]; }});
      const wa = document.getElementById("mwla-book-wa"); if (wa) wa.href = t.waHref;
      ["en", "es"].forEach(function (l) {{
        const b = document.getElementById("mwla-lang-" + l);
        if (b) {{ b.classList.toggle("is-active", l === lang); b.setAttribute("aria-pressed", l === lang); }}
        const c = document.getElementById("mwla-cal-" + l);
        if (c) c.style.display = l === lang ? "" : "none";
      }});
      loadCal(lang);
    }}
    window.mwlaBookSet = apply;
    apply((document.documentElement.getAttribute("lang") || "").toLowerCase().indexOf("es") === 0 ? "es" : "en");
  }})();
</script>
'''
open("home-book.html","w",encoding="utf-8").write(html)
print("wrote home-book.html", len(html))
