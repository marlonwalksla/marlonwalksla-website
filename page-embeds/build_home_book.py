import stamps
# Builds home-book.html: the Home "Join a Free Tour" section (same file on / and /es).
# Oct 17, 2026 (Marlon): same shape as the Team section. Left: three Polaroids that walk BACKWARDS in time
# (Disney Hall 2003, City Hall 1928, Placita Olvera 1781) and the free tour route map (same data as the
# free tour pages). Right: a sticky card with the tour language switch, one line of facts and the calendar.
# Starts in Spanish when the page language is es (the Spanish Home hero sets it before this runs).
import json
C = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
ERN = C + "6a87ce84d9af8f7c9bf12030_Tour%20Guide.avif"
POLS = [  # image, year, tape color, alt
  (C+"6ac74a8b6dc6526aa1e35909_polaroid-disney-hall-couple.webp", "2003", "rgba(255,0,255,.45)", "Guests with their Polaroid at Walt Disney Concert Hall"),
  (C+"6ac74a889c33f92895c9275a_polaroid-city-hall-couple.webp", "1928", "rgba(255,255,0,.6)", "Polaroid at Los Angeles City Hall"),
  (C+"6ac75117a6fa1b95aee600c4_polaroid-team-ernesto-la-placita.webp", "1781", "rgba(40,144,182,.45)", "Tour group holding their Polaroid at La Placita Olvera"),  # Oct 17, 2026: the old hero Free Tour photo, now here
]
RA_EN = '{"mode":"walk","areas":[{"name":"Bunker Hill","lat":34.0538,"lng":-118.2528},{"name":"Historic Core","lat":34.0478,"lng":-118.247},{"name":"Civic Center","lat":34.0519,"lng":-118.2418},{"name":"El Pueblo","lat":34.059,"lng":-118.238}],"stops":[{"name":"Walt Disney Concert Hall","desc":"Where we meet. Frank Gehry\'s steel landmark and the story of how it got built.","lat":34.0556,"lng":-118.2493},{"name":"The Broad","desc":"Next door, a free contemporary art museum that opened in 2015.","lat":34.0541,"lng":-118.2507},{"name":"Angels Flight","desc":"Built in 1901, \\"the world\'s shortest railway\\" has carried over 100 million passengers.","lat":34.0513,"lng":-118.2504},{"name":"Grand Central Market","desc":"Open since 1917. Today it\'s 30+ food stalls from all over the world.","lat":34.0509,"lng":-118.2491},{"name":"Bradbury Building","desc":"The 1893 interior you\'ve seen in movies.","lat":34.0505,"lng":-118.2478},{"name":"The Evolution of Los Angeles","desc":"The story of LA on one mural.","lat":34.0521,"lng":-118.2452},{"name":"City Hall","desc":"The 1928 tower at the heart of LA\'s government.","lat":34.0537,"lng":-118.2427},{"name":"The courthouses","desc":"LA\'s courthouses and the stories behind them.","lat":34.0549,"lng":-118.241},{"name":"Placita Olvera and El Pueblo de Los \\u00c1ngeles","desc":"Where Los Angeles began in 1781. The tour ends here, a short walk from Union Station.","lat":34.0574,"lng":-118.2381}]}'
RA_ES = '{"mode":"walk","areas":[{"name":"Bunker Hill","lat":34.0538,"lng":-118.2528},{"name":"Historic Core","lat":34.0478,"lng":-118.247},{"name":"Civic Center","lat":34.0519,"lng":-118.2418},{"name":"El Pueblo","lat":34.059,"lng":-118.238}],"stops":[{"name":"Walt Disney Concert Hall","desc":"Punto de encuentro. El edificio de acero de Frank Gehry y la historia detr\\u00e1s.","lat":34.0556,"lng":-118.2493},{"name":"The Broad","desc":"Al lado, un museo de arte contempor\\u00e1neo gratuito, abierto en 2015.","lat":34.0541,"lng":-118.2507},{"name":"Angels Flight","desc":"De 1901, \\"el ferrocarril m\\u00e1s corto del mundo\\", con m\\u00e1s de 100 millones de pasajeros.","lat":34.0513,"lng":-118.2504},{"name":"Grand Central Market","desc":"Abierto desde 1917. Hoy re\\u00fane m\\u00e1s de 30 puestos de comida de todo el mundo.","lat":34.0509,"lng":-118.2491},{"name":"Bradbury Building","desc":"El interior de 1893 que has visto en el cine.","lat":34.0505,"lng":-118.2478},{"name":"La Evoluci\\u00f3n de Los \\u00c1ngeles","desc":"La historia de LA en un solo mural.","lat":34.0521,"lng":-118.2452},{"name":"City Hall","desc":"La torre de 1928, coraz\\u00f3n del gobierno de la ciudad.","lat":34.0537,"lng":-118.2427},{"name":"Los juzgados","desc":"Los juzgados de LA y las historias detr\\u00e1s de ellos.","lat":34.0549,"lng":-118.241},{"name":"La Placita Olvera y El Pueblo de Los \\u00c1ngeles","desc":"Donde naci\\u00f3 Los \\u00c1ngeles en 1781. Aqu\\u00ed termina el tour, cerca de Union Station.","lat":34.0574,"lng":-118.2381}]}'
text = {
 "en": {"eyebrow":"Free DTLA Walking Tour","title":"Join a Free Tour!",
        "sub":"Walk back in time through 240 years of Los Angeles history with a local guide. Booking takes under a minute.",
        "wa":"\U0001F4AC Questions? WhatsApp Marlon",
        "back":"Walk backwards through LA history",
        "tip":"Tip-based","line":"Explore Downtown LA with Marlon and tip what feels right.",
        "qt":"Marlon nos ha llevado durante dos horas por un Los Ángeles que no conocíamos.","qwho":"Angel · Google (in Spanish)",
        "p1n":"Walt Disney Concert Hall","p1l":"Where we meet",
        "p2n":"City Hall","p2l":"The 1928 tower",
        "p3n":"Placita Olvera","p3l":"Where LA began",
        "from":"From: Marlon · MarlonWalksLA, Los Angeles","toL":"To:","to":"you · Walt Disney Concert Hall, 600 W 1st St","pm":"LOS ANGELES",
        "cardh":"Pick your date",
        "meet":"About 2 hours · We meet at Walt Disney Concert Hall, 600 W 1st St · Tip-based",
        "maplabel":"Route map",
        "waHref":"https://wa.me/12692670410?text=Hi%20Marlon,%20I'm%20interested%20in%20joining%20the%20free%20Downtown%20LA%20walking%20tour!"},
 "es": {"eyebrow":"Free Tour por Downtown LA","title":"¡Únete a un Free Tour!",
        "sub":"Viaja hacia atrás en el tiempo por 240 años de historia de Los Ángeles con un guía local. Reservar toma menos de un minuto.",
        "wa":"\U0001F4AC ¿Preguntas? Escríbele a Marlon por WhatsApp",
        "back":"Camina hacia atrás en la historia de LA",
        "tip":"Con propina","line":"Explora el centro de LA con Marlon y deja la propina que creas justa.",
        "qt":"Marlon nos ha llevado durante dos horas por un Los Ángeles que no conocíamos.","qwho":"Angel · Google",
        "p1n":"Walt Disney Concert Hall","p1l":"Punto de encuentro",
        "p2n":"City Hall","p2l":"La torre de 1928",
        "p3n":"La Placita Olvera","p3l":"Donde nació LA",
        "from":"De: Marlon · MarlonWalksLA, Los Ángeles","toL":"Para:","to":"ti · Walt Disney Concert Hall, 600 W 1st St","pm":"LOS ÁNGELES",
        "cardh":"Elige tu fecha",
        "meet":"Unas 2 horas · Nos vemos en Walt Disney Concert Hall, 600 W 1st St · Con propina",
        "maplabel":"Mapa de la ruta",
        "waHref":"https://wa.me/12692670410?text=Hola%20Marlon,%20me%20interesa%20el%20free%20tour%20en%20espa%C3%B1ol"},
}
pols = "".join(
  f'<figure class="mwla-pol" style="--r:{r}"><span class="mwla-tape" style="background:{tape}"></span><img src="{img}" alt="{alt}" loading="lazy">'
  f'</figure>'
  for i,((img,yr,tape,alt),r) in enumerate(zip(POLS,["-2.5deg","2deg","-1.5deg"]),1))

STAMP_FREE = (stamps.stamp("stf", "OLVERA STREET", "EL PUEBLO DE LOS ANGELES", "kiosko", "EST. 1781", "#1B8A8F", -7, 8)
              + stamps.stamp("stf2", "WALT DISNEY CONCERT HALL", "LOS ANGELES", "wdch", "EST. 2003", "#2B4F9E", 8, 14, "s2"))  # Oct 18, 2026: two stamps, inks that stand out from the pink card  # Oct 17, 2026: ink stamp replaces the silhouette
html = f'''<!-- ==============================================================================
     MARLONWALKSLA - BOOK A FREE TOUR (CAL.COM INLINE CALENDARS, EN + ES)
     Built by page-embeds/build_home_book.py. Same embed on Home (/) and /es.
     EN event: cal.com/marlonwalksla/free-tour-dtla
     ES event: cal.com/marlonwalksla/free-tour-dtla-espanol
     Oct 17, 2026: left = three Polaroids walking back in time (2003, 1928, 1781) + the free tour map;
     right = sticky card with the language switch and the calendar.
     ============================================================================== -->
<div class="mwla-book" id="book">
  <div class="mwla-book-head">
    <div class="mwla-book-head-text">
      <h2 class="mwla-book-title" data-pi="title">{text["en"]["title"]}</h2>
      <p class="pc-line" data-pi="line">{text["en"]["line"]}</p>
      <ul class="pc-badges"><li class="pc-badge"><span aria-hidden="true">&#127758;</span><span>Espa&ntilde;ol &amp; English</span></li><li class="pc-badge"><span aria-hidden="true">&#128155;</span><span data-pi="tip">{text["en"]["tip"]}</span></li></ul>
      <a class="mwla-book-wa" id="mwla-book-wa" href="{text["en"]["waHref"]}" target="_blank" rel="noopener noreferrer" data-pi="wa">{text["en"]["wa"]}</a>
    </div>
    {STAMP_FREE}
  </div>

  <div class="mwla-fgrid">
    <div class="mwla-fleft">
      <div class="mwla-pols">{pols}</div>
      <figure class="mwla-q"><blockquote data-pi="qt">{text["en"]["qt"]}</blockquote><figcaption><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span> <span data-pi="qwho">{text["en"]["qwho"]}</span></figcaption></figure>
      <div class="mwla-map" id="mwla-map" aria-label="Free tour route map"></div>
    </div>
    <div class="mwla-fcard">
      <h3 class="mwla-card-h" data-i18n="cardh">{text["en"]["cardh"]}</h3>
      <div class="mwla-lang-switch" role="group" aria-label="Tour language / Idioma del tour">
        <span class="mwla-lang-label">Tour language &middot; Idioma del tour</span>
        <div class="mwla-lang-pill">
          <button type="button" class="mwla-lang-opt is-active" id="mwla-lang-en" onclick="mwlaBookSet('en')" aria-pressed="true">English</button>
          <button type="button" class="mwla-lang-opt" id="mwla-lang-es" onclick="mwlaBookSet('es')" aria-pressed="false">Espa&ntilde;ol</button>
        </div>
      </div>
      <p class="mwla-meet" data-i18n="meet">{text["en"]["meet"]}</p>
      <div class="mwla-book-cals">
        <div class="mwla-book-cal" id="mwla-cal-en"></div>
        <div class="mwla-book-cal" id="mwla-cal-es" style="display:none"></div>
      </div>
    </div>
  </div>
</div>

<style>
  .mwla-book {{ max-width: 1140px; margin: 0 auto; padding: 40px 20px 52px; box-sizing: border-box; font-family: "Nunito", -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; scroll-margin-top: 90px; }}
  .mwla-book *, .mwla-book *::before {{ box-sizing: border-box; }}
  .mwla-book-head {{ display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 24px; align-items: start; max-width: 1060px; margin: 0 auto 28px; text-align: left; }}
  /* Oct 17, 2026 (Marlon): a quote under the Polaroids, like the Team section (no captions under the photos) */
  .mwla-q {{ margin: 22px 0 0; padding-left: 14px; border-left: 4px solid #D6479B; }}
  .mwla-q blockquote {{ margin: 0; font-size: 1rem; line-height: 1.5; color: #3B4440; }}
  .mwla-q figcaption {{ margin-top: 4px; font-size: 0.85rem; color: #5B6663; }}
  .mwla-q figcaption span:first-child {{ color: #E89B00; letter-spacing: 1px; margin-right: 4px; }}
  .mwla-book-title {{ font-size: clamp(1.9rem, 4vw, 2.8rem); line-height: 1.1; color: #0f172a; margin: 0; }}
  .mwla-book-sub {{ font-size: 1.05rem; line-height: 1.55; color: #475569; margin: 0; max-width: 56ch; }}
  .mwla-book-wa {{ display: inline-block; margin-top: 10px; font-size: 0.95rem; font-weight: 700; color: #1B6688 !important; text-decoration: underline; text-underline-offset: 3px; }}

  /* Two columns, like the Team section */
  .mwla-fgrid {{ display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: 28px; align-items: start; }}
  .mwla-back-h {{ font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.35rem; color: #27302E; margin: 0 0 18px; }}
  .mwla-pols {{ position: relative; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; align-items: start; padding: 0 6px; }}
  /* a dotted "time line" running behind the three Polaroids, newest to oldest */
  .mwla-pols::before {{ content: ""; position: absolute; left: 8%; right: 8%; top: 42%; border-top: 3px dotted rgba(39, 48, 46, 0.35); z-index: 0; }}
  .mwla-pol {{ position: relative; z-index: 1; margin: 0; transform: rotate(var(--r)); }}
  .mwla-pol img {{ display: block; width: 100%; height: auto; box-shadow: 0 10px 20px -10px rgba(39, 48, 46, 0.5); }}
  .mwla-tape {{ position: absolute; top: -9px; left: 50%; width: 58px; height: 18px; transform: translateX(-50%) rotate(-4deg); mix-blend-mode: multiply; z-index: 2; }}
  .mwla-pol figcaption {{ display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: 10px; }}
  .mwla-pol b {{ font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.05rem; line-height: 1.15; color: #27302E; }}
  .mwla-pol small {{ font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.85rem; color: #4D5551; }}
  .mwla-map {{ margin-top: 22px; min-width: 0; background: #fff; border: 2.5px solid #27302E; border-radius: 16px; box-shadow: 4px 4px 0 #27302E; padding: 10px 12px 12px; }}
  .mwla-map:empty {{ display: none; }}
  .mwla-fcard {{ background: #ffffff; border-radius: 18px; padding: 20px 18px 18px; box-shadow: 0 12px 30px -18px rgba(39, 48, 46, 0.55); }}
  @media (min-width: 992px) {{ .mwla-fcard {{ position: sticky; top: 90px; }} }}
  .mwla-card-h {{ font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.45rem; color: #27302E; margin: 0 0 12px; }}
  .mwla-lang-switch {{ display: flex; flex-direction: column; align-items: flex-start; gap: 8px; margin: 0 0 12px; }}
  .mwla-lang-label {{ font-size: 0.78rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #27302E; }}
  .mwla-lang-pill {{ display: inline-flex; background: #FFF6E6; border: 2px solid #f3e3b5; border-radius: 50px; padding: 4px; gap: 4px; }}
  .mwla-lang-opt {{ font: inherit; font-size: 1rem; font-weight: 800; color: #475569; background: transparent; border: none; border-radius: 50px; padding: 9px 22px; cursor: pointer; transition: background 0.15s ease-out, color 0.15s ease-out; }}
  .mwla-lang-opt:hover {{ color: #0f172a; }}
  .mwla-lang-opt.is-active {{ background: #FFD43B; color: #27302E; }}
  .mwla-meet {{ font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.95rem; line-height: 1.4; color: #3B4440; margin: 0 0 12px; }}
  .mwla-book-cals {{ min-width: 0; }}
  .mwla-book-cal {{ width: 100%; min-height: 380px; border-radius: 12px; overflow: hidden; }}

  @media (max-width: 991px) {{
    .mwla-fgrid {{ grid-template-columns: 1fr; }}
  }}
  @media (max-width: 900px) {{
    .mwla-book {{ padding: 40px 16px; }}
    .mwla-book-head {{ grid-template-columns: 1fr; gap: 6px; }}
    .mwla-book-head .pc-addr {{ justify-self: end; }}
    .mwla-book-title {{ font-size: clamp(1.7rem, 8vw, 2.2rem); }}
    .mwla-book-head .pc-badge {{ font-size: 0.9rem; }}
    .mwla-pols {{ gap: 12px; }}
    .mwla-pol b {{ font-size: 0.9rem; }}
    .mwla-pol small {{ font-size: 0.75rem; }}
    .mwla-book-cal {{ min-height: 360px; }}
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
      Cal.ns[ev.ns]("ui", {{ theme: "light", hideEventTypeDetails: true, layout: "month_view" }}); // details panel hidden; the line above the calendar says length and meeting point
      loaded[lang] = true;
    }}
    const T = {json.dumps(text, ensure_ascii=False)};
    const root = document.getElementById("book");
    const pageLang = (document.documentElement.getAttribute("lang") || "").toLowerCase().indexOf("es") === 0 ? "es" : "en";
    // Oct 17, 2026 (Marlon): the switch changes ONLY the calendar card. The rest of the page keeps the page language.
    (function () {{
      const t = T[pageLang];
      root.querySelectorAll("[data-pi]").forEach(function (el) {{ const k = el.getAttribute("data-pi"); if (t[k] != null) el.textContent = t[k]; }});
      const wa = document.getElementById("mwla-book-wa"); if (wa) wa.href = t.waHref;
    }})();
    function apply(lang) {{
      lang = lang === "es" ? "es" : "en";
      const t = T[lang];
      root.querySelectorAll("[data-i18n]").forEach(function (el) {{ const k = el.getAttribute("data-i18n"); if (t[k] != null) el.textContent = t[k]; }});
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
<script type="application/json" id="mwla-ra-en">__RAEN__</script>
<script type="application/json" id="mwla-ra-es">__RAES__</script>
<script>
/* Oct 18, 2026 (Marlon): the free tour route map sits under the review (same animated map as the Team page, map only: tap a stop and Ernesto walks there). */
(function () {{
  var box = document.getElementById("mwla-map"); if (!box) return;
  var es = (document.documentElement.getAttribute("lang") || "").toLowerCase().indexOf("es") === 0 || /^\/es(\/|$)/.test(location.pathname);
  var src = document.getElementById(es ? "mwla-ra-es" : "mwla-ra-en"); if (!src) return;
  box.setAttribute("aria-label", es ? "Mapa de la ruta del tour gratis" : "Free tour route map");
  var ra = document.createElement("div"); ra.className = "ra"; ra.setAttribute("data-nolist", ""); ra.setAttribute("data-compact", "");
  ra.setAttribute("data-label", es ? "Mapa de la ruta del tour gratis" : "Free tour route map");
  ra.setAttribute("data-ernesto", "__TG__");
  var js = document.createElement("script"); js.type = "application/json"; js.className = "ra-data"; js.textContent = src.textContent; ra.appendChild(js); box.appendChild(ra);
  var B = "https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@main/";
  if (!document.querySelector('link[href*="route-anim.css"]')) {{ var l = document.createElement("link"); l.rel = "stylesheet"; l.href = B + "route-anim.css?v=1"; document.head.appendChild(l); }}
  function go() {{ if (window.MWRouteAnim) window.MWRouteAnim.init(); }}
  if (window.MWRouteAnim) {{ go(); }} else {{ var s = document.createElement("script"); s.src = B + "route-anim.js?v=1"; s.onload = go; document.head.appendChild(s); }}
}})();
</script>
'''
import json as _j
html = html.replace("__RAEN__", open("route-free-en.json", encoding="utf-8").read().replace("</", "<\\/")).replace("__RAES__", open("route-free-es.json", encoding="utf-8").read().replace("</", "<\\/"))
html = html.replace("__TG__", "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/6a87ce84d9af8f7c9bf12030_Tour%20Guide.avif")
open("home-book.html","w",encoding="utf-8").write(html)
print("wrote home-book.html", len(html))
