# Builds the Home "LA, Your Way" itinerary builder (Oct 17, 2026, Marlon via Gemini, chunk 3):
#   home-private.html / home-private-es.html           = left column: toggle pills + one big Polaroid that follows the last pick
#   home-private-calc.html / home-private-calc-es.html = right column: Estimate calculator + "Finalize Custom Tour"
# The two embeds talk through window.MWPV (state) and the "mwpv" event. The estimate math is the same as the old route chips:
# 60 min hotel pickup and drop-off + minutes at each stop + driving between areas, shown as a range, matched to a flat per-car package.
# PACKAGES prices are PLACEHOLDER estimates (see build_private_builder.py). The Polaroid for places without a photo is a colored card.
# Finalize saves the plan to localStorage ("mwla-private-plan") and opens /private-tour?stops=...&est=... (page-embeds/private-tour-plan.html).
import json

C = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
PACKAGES = [
    {"en": "Half day", "es": "Medio día", "hours": 4, "price": 249},
    {"en": "Full day", "es": "Día completo", "hours": 8, "price": 399},
    {"en": "Long day", "es": "Día largo", "hours": 12, "price": 499},
]
DT_CENTER = (34.0522, -118.2437)
# id: (group, EN name, ES name, EN line, ES line, minutes, lat, lng, photo file or None, placeholder color)
S = [
    ("disney", "dt", "Walt Disney Concert Hall", "Walt Disney Concert Hall", "Steel curves and a hidden garden.", "Curvas de acero y un jardín escondido.", 20, 34.0556, -118.2493, "6ac74a8b6dc6526aa1e35909_polaroid-disney-hall-couple.webp", "#BFE3F2"),
    ("broad", "dt", "The Broad", "The Broad", "Free contemporary art next door.", "Arte contemporáneo gratis, al lado.", 30, 34.0541, -118.2507, None, "#F6C6DF"),
    ("angels", "dt", "Angels Flight", "Angels Flight", "The 1901 railway down Bunker Hill.", "El tranvía de 1901 por Bunker Hill.", 20, 34.0513, -118.2504, "6ac74a89e44a0b1c364553f8_polaroid-angels-flight-car.webp", "#FFE08A"),
    ("gcm", "dt", "Grand Central Market", "Grand Central Market", "30+ food stalls under neon signs.", "Más de 30 puestos de comida bajo letreros de neón.", 40, 34.0509, -118.2491, "6ac74a8872cf323a6f897a43_polaroid-grand-central-market-night.webp", "#FFD2B0"),
    ("bradbury", "dt", "Bradbury Building", "Bradbury Building", "The 1893 atrium from the movies.", "El atrio de 1893 que salió en películas.", 15, 34.0505, -118.2478, "6ac751176ec3f46c273784eb_polaroid-raul-bradbury.webp", "#D9F5E3"),
    ("mural", "dt", "The Evolution of LA mural", "Mural La Evolución de LA", "A wall that tells LA's story.", "Un muro que cuenta la historia de LA.", 10, 34.0521, -118.2452, "6ac75117cf5707658580af96_polaroid-olga-evolution-la.webp", "#E3F6D8"),
    ("cityhall", "dt", "City Hall", "City Hall", "The 1928 tower and its views.", "La torre de 1928 y sus vistas.", 20, 34.0537, -118.2427, "6ac74a889c33f92895c9275a_polaroid-city-hall-couple.webp", "#DCEFFA"),
    ("courts", "dt", "The courthouses", "Los juzgados", "Grand Park and the old courthouses.", "Grand Park y los juzgados antiguos.", 15, 34.0549, -118.2410, None, "#E6DAF7"),
    ("olvera", "dt", "Olvera Street", "Calle Olvera", "Where LA began, in 1781.", "Donde empezó LA, en 1781.", 30, 34.0574, -118.2381, "6ac74a884cd6ef1aef19e7fc_polaroid-olvera-kiosko.webp", "#FFE3F1"),
    ("sign", "la", "Hollywood Sign viewpoint", "Mirador del letrero de Hollywood", "Photos with the sign from Lake Hollywood Park.", "Fotos con el letrero desde Lake Hollywood Park.", 30, 34.1265, -118.3297, "6ac74a88eac936a211a2bc6c_polaroid-hollywood-sign.webp", "#FFE08A"),
    ("griffith", "la", "Griffith Observatory", "Observatorio Griffith", "Views over all of Los Angeles.", "Vistas de todo Los Ángeles.", 60, 34.1184, -118.3004, "6ac74a88ff63a23a7673ee96_polaroid-griffith-sunset.webp", "#FFD2B0"),
    ("urban", "la", "Urban Light", "Urban Light", "The 202 street lamps at LACMA.", "Las 202 farolas de LACMA.", 20, 34.0629, -118.3593, "6ac74a88ef17ffc941f06a81_polaroid-urban-lights.webp", "#BFE3F2"),
    ("grove", "la", "The Grove and Farmers Market", "The Grove y el Farmers Market", "Shops, snacks and the 1934 market.", "Tiendas, antojitos y el mercado de 1934.", 60, 34.072, -118.3576, None, "#F6C6DF"),
    ("bhsign", "la", "Beverly Hills sign", "Letrero de Beverly Hills", "The lily pond and the famous sign.", "El estanque y el famoso letrero.", 15, 34.0717, -118.4045, None, "#D9F5E3"),
    ("rodeo", "la", "Rodeo Drive", "Rodeo Drive", "A walk down the fanciest street in LA.", "Un paseo por la calle más elegante de LA.", 45, 34.0696, -118.4031, None, "#E6DAF7"),
    ("pier", "la", "Santa Monica Pier", "Muelle de Santa Mónica", "The pier, the beach and the end of Route 66.", "El muelle, la playa y el final de la Ruta 66.", 60, 34.0094, -118.4973, None, "#DCEFFA"),
    ("venice", "la", "Venice Beach and Canals", "Venice Beach y los canales", "The boardwalk, then the quiet canals.", "El malecón y luego los canales tranquilos.", 60, 33.985, -118.4695, None, "#E3F6D8"),
    # Oct 19, 2026 (Marlon): challenges are their own column. Minutes are PLACEHOLDERS (Marlon to confirm); they sit at the Downtown pickup point so they add no driving, except Angels Flight.
    ("tacos", "ch", "Eat LA Street Tacos", "Come tacos callejeros de LA", "Taco stand, napkins, big bites.", "Puesto de tacos, servilletas y buenos bocados.", 30, 34.0522, -118.2437, None, "#FFE08A"),
    ("sunset", "ch", "Chase a Sunset", "Persigue un atardecer", "Golden hour over the city.", "La hora dorada sobre la ciudad.", 45, 34.0522, -118.2437, "6ac74a88ff63a23a7673ee96_polaroid-griffith-sunset.webp", "#FFD2B0"),
    ("flight", "ch", "Ride Angels Flight", "Sube a Angels Flight", "The 1901 railway down Bunker Hill.", "El tranvía de 1901 por Bunker Hill.", 20, 34.0513, -118.2504, "6ac74a89e44a0b1c364553f8_polaroid-angels-flight-car.webp", "#FFE08A"),
]
# Oct 19, 2026 (Marlon): fewest characters per option. Short label (EN, ES) used on the buttons and in the estimate; the full name stays on the Polaroid caption.
SHORT = {
    "sign": ("Hollywood Sign", "Letrero Hollywood"), "griffith": ("Griffith", "Griffith"), "urban": ("Urban Light", "Urban Light"),
    "grove": ("The Grove", "The Grove"), "bhsign": ("Beverly Hills", "Beverly Hills"), "rodeo": ("Rodeo Drive", "Rodeo Drive"),
    "pier": ("Santa Monica", "Santa Mónica"), "venice": ("Venice", "Venice"),
    "tacos": ("Street Tacos", "Tacos"), "sunset": ("Sunset", "Atardecer"), "flight": ("Angels Flight", "Angels Flight"),
}
DEFAULT_ON = []  # Oct 19, 2026 (Marlon): nothing pre-picked
T = {
 "en": dict(
  h="Pick your places", hint="Great photo spots, zero planning. Tap to add.",
  g_dt="Downtown, on foot", g_la="Places", g_ch="Challenges",
  cap0="Tap a place and its photo lands here", picked="Your latest pick",
  ch="Estimate your day", chint="Based on what you picked. Marlon confirms the final price.",
  none="Pick a place or a challenge to see your estimate.", yours="Your places", about="About", to="to", hours="hours",
  incl="Hotel pickup and drop-off included", fits="Fits a", car="1 to 4 guests, one price per car", over="That is more than one day. Message Marlon and we will plan two.",
  est="Estimated price", base="Base: pickup, drop-off and driving", cta="Finalize Custom Tour", wait="Pick something first", note="No payment now. Next you send Marlon your details.",
  remove="Remove", count="places picked"),
 "es": dict(
  h="Elige tus lugares", hint="Lugares ideales para fotos, sin planear nada. Toca para agregar.",
  g_dt="Centro, a pie", g_la="Lugares", g_ch="Retos",
  cap0="Toca un lugar y su foto cae aquí", picked="Tu última elección",
  ch="Calcula tu día", chint="Según lo que elegiste. Marlon confirma el precio final.",
  none="Elige un lugar o un reto para ver tu estimado.", yours="Tus lugares", about="Unas", to="a", hours="horas",
  incl="Recogida y regreso al hotel incluidos", fits="Cabe en", car="1 a 4 personas, un precio por auto", over="Es más de un día. Escríbele a Marlon y armamos dos.",
  est="Precio estimado", base="Base: recogida, regreso y manejo", cta="Finalizar mi tour a medida", wait="Elige algo primero", note="Sin pago ahora. Después le mandas tus datos a Marlon.",
  remove="Quitar", count="lugares elegidos"),
}


def esc(x):
    return x.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def data_for(lang):
    i = 0 if lang == "en" else 1
    stops = [{"id": s[0], "group": s[1], "name": s[2 + i], "short": SHORT[s[0]][i], "line": s[4 + i], "min": s[6], "lat": s[7], "lng": s[8],
              "photo": (C + s[9]) if s[9] else None, "color": s[10]} for s in S if s[1] in ("la", "ch")]  # Oct 17, 2026 (Marlon): no Downtown-on-foot options; private tours are by car
    return {"lang": lang, "t": T[lang], "stops": stops, "on": DEFAULT_ON, "center": DT_CENTER,
            "packages": [{"label": p[lang], "hours": p["hours"], "price": p["price"]} for p in PACKAGES]}


LEFT_CSS = """<style>
  .pvb { font-family: "Nunito", system-ui, sans-serif; color: #27302E; overflow-x: clip; }
  /* Oct 18, 2026 (Marlon via Gemini): Polaroid Stack. Tapping a place tosses its photo onto the pile; tapping again takes it off. */
  .polaroid-stack-area { position: relative; width: 100%; min-height: 400px; margin: 0 0 18px; --pw: 210px; }
  .stacked-photo { position: absolute; width: var(--pw); box-sizing: border-box; background: #fff; padding: 10px 10px 12px; box-shadow: 0 10px 22px -8px rgba(39, 48, 46, 0.55), 0 2px 4px rgba(39, 48, 46, 0.18);
    transition: all 0.3s ease-out; will-change: transform, opacity; }
  .stacked-photo.is-drop { opacity: 0; margin-top: -46px; }
  .stacked-photo.is-gone { opacity: 0; margin-top: 18px; }
  .stacked-photo .sp-img { position: relative; width: 100%; aspect-ratio: 1 / 1; overflow: hidden; background: #F4EBDD; }
  .stacked-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
  .stacked-photo .sp-card { position: absolute; inset: 0; display: grid; place-items: center; padding: 12px; text-align: center; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.95rem; line-height: 1.25; color: #27302E; }
  .stacked-photo figcaption { margin: 9px 2px 0; text-align: center; font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.02rem; line-height: 1.15; color: #27302E; }
  .stacked-photo .sp-tape { position: absolute; top: -9px; left: 50%; width: 56px; height: 18px; transform: translateX(-50%) rotate(-4deg); background: rgba(255, 140, 40, .6); mix-blend-mode: multiply; }
  .pvb-empty { position: absolute; inset: 0; display: grid; place-items: center; padding: 24px; text-align: center; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 1.05rem; color: #5B6663; border: 3px dashed rgba(39, 48, 46, .25); border-radius: 14px; transition: opacity .2s ease-out; pointer-events: none; }
  .polaroid-stack-area.has-photos .pvb-empty { opacity: 0; }
  @media (max-width: 600px) { .polaroid-stack-area { min-height: 340px; --pw: 168px; } }
  .pvb-h { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.35rem; margin: 0 0 4px; color: #27302E; }
  .pvb-hint { margin: 0 0 14px; font-size: 0.95rem; color: #4D5551; }
  .pvb-g { margin: 14px 0 8px; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: #5B6663; }
  .pvb-pills { display: flex; flex-wrap: wrap; gap: 8px; }
  .pvb-pill { font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.98rem; line-height: 1.2; color: #27302E; background: #fff; border: 2px solid #27302E; border-radius: 999px; padding: 9px 16px; min-height: 44px; cursor: pointer; transition: transform 0.15s ease-out, box-shadow 0.15s ease-out, background 0.15s ease-out; }
  .pvb-pill:hover { transform: translateY(-2px); box-shadow: 0 3px 0 #27302E; }
  .pvb-pill[aria-pressed="true"] { background: #FFD43B; box-shadow: 2px 2px 0 #27302E; font-weight: 600; }
  .pvb-pill[aria-pressed="true"]::before { content: "\\2713"; margin-right: 6px; }
  .pvb-pill:focus-visible { outline: 3px solid #2890B6; outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) { .pvb-pill, .stacked-photo { transition: none; } }
  /* Oct 19, 2026 (Marlon): Places and Challenges side by side, the estimate full width below (the Webflow two-column split becomes one column here, and the dashed divider goes) */
  .mw-split:has(.pvb) { grid-template-columns: minmax(0, 1fr) !important; }
  @media (min-width: 992px) { .mw-bg-private .mw-split-left { border-right: 0 !important; padding-right: 0 !important; } }
  .pvb-cols { display: grid; grid-template-columns: 1.5fr 1fr; gap: 12px 36px; margin: 0 0 22px; }
  .pvb-g { margin: 0 0 8px; }
  .polaroid-stack-area { min-height: 340px; margin: 0; }
  @media (max-width: 700px) { .pvb-cols { grid-template-columns: 1fr; } .polaroid-stack-area { min-height: 320px; } }
</style>
"""

LEFT_JS = r"""<script>
(function () {
  var D = JSON.parse(document.getElementById("pvb-data").textContent), t = D.t, S = {}, ORDER = [];
  D.stops.forEach(function (s) { S[s.id] = s; ORDER.push(s.id); });
  var area = document.getElementById("polaroid-stack-area"), zTop = 10, still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pills = [].slice.call(document.querySelectorAll(".pvb-pill")), on = {}, last = null;
  D.on.forEach(function (id) { on[id] = true; last = id; });
  function km(a, b) { var R = 6371, r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLn = (b.lng - a.lng) * r;
    var h = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLn / 2) * Math.sin(dLn / 2);
    return 2 * R * Math.asin(Math.sqrt(h)); }
  function drive(a, b) { return km(a, b) * 1.35 / 25 * 60 + 5; }  // road about 1.35x the straight line, 25 km/h, 5 min to park
  function fmt(h) { return (Math.round(h * 2) / 2).toString().replace(".5", "½"); }
  function place(el) {  // fractions are stored so the pile re-fits when the screen is resized
    var W = area.clientWidth, H = area.clientHeight, pw = el.offsetWidth, ph = el.offsetHeight;
    el.style.left = Math.max(0, (W - pw) * parseFloat(el.dataset.fx)) + "px";
    el.style.top = Math.max(0, (H - ph) * parseFloat(el.dataset.fy)) + "px";
  }
  function show(id, delay) {
    if (!area || area.querySelector('[data-id="' + id + '"]')) return;
    var s = S[id], el = document.createElement("figure");
    el.className = "stacked-photo is-drop"; el.dataset.id = id;
    el.dataset.fx = (0.08 + Math.random() * 0.84).toFixed(3); el.dataset.fy = (0.12 + Math.random() * 0.76).toFixed(3);
    el.dataset.rot = ((Math.random() * 24) - 12).toFixed(1);  // between -12 and +12 degrees
    el.style.zIndex = ++zTop;  // newest lands on top
    var tape = document.createElement("span"); tape.className = "sp-tape"; el.appendChild(tape);
    var box = document.createElement("div"); box.className = "sp-img";
    if (s.photo) { var im = document.createElement("img"); im.src = s.photo; im.alt = s.name; im.loading = "lazy"; box.appendChild(im); }
    else { var c = document.createElement("div"); c.className = "sp-card"; c.style.background = s.color; c.textContent = s.line; box.appendChild(c); }
    var fc = document.createElement("figcaption"); fc.textContent = s.name;
    el.appendChild(box); el.appendChild(fc); area.appendChild(el);
    place(el);
    el.style.transform = "rotate(" + (parseFloat(el.dataset.rot) + (Math.random() < .5 ? -14 : 14)) + "deg) scale(1.12)";
    area.classList.add("has-photos");
    function land() { el.classList.remove("is-drop"); el.style.transform = "rotate(" + el.dataset.rot + "deg)"; }
    if (still) land(); else setTimeout(function () { requestAnimationFrame(function () { requestAnimationFrame(land); }); }, delay || 0);
  }
  function hide(id) {
    var el = area && area.querySelector('[data-id="' + id + '"]'); if (!el) return;
    function done() { if (el.parentNode) el.parentNode.removeChild(el); if (!area.querySelector(".stacked-photo")) area.classList.remove("has-photos"); }
    if (still) { done(); return; }
    el.classList.add("is-gone"); setTimeout(done, 300);
  }
  window.addEventListener("resize", function () { if (area) [].forEach.call(area.querySelectorAll(".stacked-photo"), place); });
  function state() {
    var ids = ORDER.filter(function (id) { return on[id]; }), stops = ids.map(function (id) { return S[id]; });
    var sm = stops.reduce(function (a, s) { return a + s.min; }, 0) + 60, dm = 0, prev = null;
    stops.forEach(function (s) {
      var from = prev || { lat: D.center[0], lng: D.center[1] };  // pickup is Downtown
      dm += drive(from, s); prev = s;
    });
    var st = { ids: ids, names: stops.map(function (s) { return s.short; }), lang: D.lang, lo: null, hi: null, pkg: null, over: false, t: t, last: last };
    if (!ids.length) return st;
    st.lo = (sm + dm * 0.85) / 60; st.hi = (sm + dm * 1.4) / 60;
    var mid = (st.lo + st.hi) / 2;
    for (var k = 0; k < D.packages.length; k++) if (mid <= D.packages[k].hours) { st.pkg = D.packages[k]; break; }
    st.over = !st.pkg; st.range = fmt(st.lo) === fmt(st.hi) ? fmt(st.lo) : fmt(st.lo) + " " + t.to + " " + fmt(st.hi);
    return st;
  }
  function publish() {
    var st = state(); window.MWPV = window.MWPV || {}; window.MWPV.state = st; window.MWPV.remove = function (id) { on[id] = false; hide(id); sync(); };
    try { window.dispatchEvent(new CustomEvent("mwpv", { detail: st })); } catch (e) {}
  }
  function sync() { pills.forEach(function (p) { p.setAttribute("aria-pressed", on[p.dataset.id] ? "true" : "false"); }); publish(); }
  pills.forEach(function (p) {
    p.addEventListener("click", function () {
      var id = p.dataset.id; on[id] = !on[id];
      if (on[id]) { last = id; show(id); } else hide(id);
      sync();
    });
  });
  ORDER.filter(function (id) { return on[id]; }).forEach(function (id, i) { show(id, 150 + i * 220); });
  sync();
})();
</script>
"""


def left_html(lang):
    t = T[lang]; data = data_for(lang)
    i = 0 if lang == "en" else 1

    def pills(group):
        return "".join(f'<button type="button" class="pvb-pill" data-id="{s[0]}" aria-pressed="false">{esc(SHORT[s[0]][i])}</button>' for s in S if s[1] == group)
    js_data = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    return f"""<!-- ==============================================================================
     MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: LA, YOUR WAY - ITINERARY BUILDER (LEFT COLUMN). Built by page-embeds/build_home_private.py
     Oct 17, 2026 (Marlon via Gemini): pills + a Polaroid Stack (Oct 18: photos drop onto a messy pile, tap again to remove). The estimate lives in home-private-calc.html (right column).
     ============================================================================== -->
<div class="mw-offer pvb" id="private-tours">
  <h3 class="pvb-h">{t["h"]}</h3>
  <p class="pvb-hint">{t["hint"]}</p>
  <div class="pvb-cols">
    <div class="pvb-col"><p class="pvb-g">{t["g_la"]}</p><div class="pvb-pills" role="group" aria-label="{t["g_la"]}">{pills("la")}</div></div>
    <div class="pvb-col"><p class="pvb-g">{t["g_ch"]}</p><div class="pvb-pills" role="group" aria-label="{t["g_ch"]}">{pills("ch")}</div></div>
  </div>
  <div class="polaroid-stack-area" id="polaroid-stack-area" role="group" aria-label="{esc(t['h'])}"><p class="pvb-empty">{esc(t["cap0"])}</p></div>
</div>
<script type="application/json" id="pvb-data">{js_data}</script>
""" + LEFT_CSS + LEFT_JS


CALC_CSS = """<style>
  /* the native "Private Tour Inquiry" form stays in Webflow (and on the Private page) but is hidden on Home: the calculator replaces it */
  .mw-form-card:has(.pcq) > *:not(.w-embed) { display: none !important; }
  .mw-form-card:has(.pcq) { margin-top: 0; padding: 24px 24px 20px; box-shadow: 6px 6px 0 #27302E; }
  .pcq { font-family: "Nunito", system-ui, sans-serif; color: #27302E; }
  .pcq-title { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.8rem; line-height: 1.1; margin: 0 0 6px; color: #27302E; }
  .pcq-hint { margin: 0 0 14px; font-size: 0.95rem; line-height: 1.45; color: #4D5551; }
  .pcq-list { list-style: none; margin: 0 0 14px; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
  .pcq-list li { display: inline-flex; align-items: center; gap: 6px; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.9rem; background: #fff; border: 2px solid #27302E; border-radius: 999px; padding: 3px 6px 3px 12px; }
  .pcq-list button { width: 26px; height: 26px; border-radius: 50%; border: 0; background: #F1E4CB; color: #27302E; font-size: 1rem; line-height: 1; cursor: pointer; }
  .pcq-list button:focus-visible { outline: 3px solid #2890B6; outline-offset: 2px; }
  .pcq-none { margin: 0 0 14px; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 1.05rem; color: #3B4440; }
  .pcq-out { margin: 4px 0 8px; }
  .pcq-cap { display: block; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 0.85rem; color: #5B6663; margin-top: 3px; }
  .pcq-hours { font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1.25rem; font-variant-numeric: tabular-nums; }
  .pcq-price { display: block; font-family: "Lilita One", sans-serif; font-size: clamp(3rem, 6vw, 3.8rem); line-height: 1; margin-top: 12px; font-variant-numeric: tabular-nums; }
  .pcq-fit { margin: 6px 0 0; font-size: 1rem; line-height: 1.45; color: #27302E; }
  .pcq-incl { margin: 10px 0 16px; font-size: 0.92rem; color: #4D5551; }
  .pcq-cta { display: block; width: 100%; text-align: center; font-family: "Lilita One", sans-serif; font-size: 1.3rem; letter-spacing: 0.01em; color: #27302E; background: #FFD43B; border: 2.5px solid #27302E; border-radius: 999px; padding: 13px 24px; min-height: 48px; box-shadow: 4px 4px 0 #27302E; cursor: pointer; transition: transform 0.18s ease-out, box-shadow 0.18s ease-out; }
  .pcq-cta:hover:not([aria-disabled="true"]) { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #27302E; }
  .pcq-cta:active:not([aria-disabled="true"]) { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #27302E; }
  .pcq-cta:focus-visible { outline: 3px solid #2890B6; outline-offset: 4px; }
  .pcq-cta[aria-disabled="true"] { background: #E9E2D2; color: #6B726F; box-shadow: none; cursor: not-allowed; }
  .pcq-ern { display: flex; align-items: center; gap: 12px; }
  .pcq-ern img { height: 84px; width: auto; flex: none; }
  .pcq-note { margin: 10px 0 0; text-align: center; font-size: 0.88rem; color: #5B6663; }
  @media (prefers-reduced-motion: reduce) { .pcq-cta { transition: none; } }
  /* Oct 19, 2026 (Marlon): the estimate sits below the picks, full width: what you picked on the left, the price and button on the right */
  @media (min-width: 800px) { .pcq { display: grid; grid-template-columns: 1.3fr 1fr; gap: 28px; align-items: start; } }
</style>
"""

CALC_JS = r"""<script>
(function () {
  var root = document.getElementById("pcq"); if (!root) return;
  var t = JSON.parse(document.getElementById("pcq-t").textContent);
  var list = root.querySelector(".pcq-list"), none = root.querySelector(".pcq-none"), out = root.querySelector(".pcq-out");
  var hrs = root.querySelector(".pcq-hours"), price = root.querySelector(".pcq-price"), fit = root.querySelector(".pcq-fit"), cta = root.querySelector(".pcq-cta");
  var st = null;
  function render(s) {
    st = s; if (!s) return;
    list.innerHTML = "";
    s.ids.forEach(function (id, i) {
      var li = document.createElement("li"), sp = document.createElement("span"), b = document.createElement("button");
      sp.textContent = s.names[i]; b.type = "button"; b.textContent = "×"; b.setAttribute("aria-label", t.remove + " " + s.names[i]);
      b.addEventListener("click", function () { if (window.MWPV && window.MWPV.remove) window.MWPV.remove(id); });
      li.appendChild(sp); li.appendChild(b); list.appendChild(li);
    });
    var has = s.ids.length > 0;
    none.hidden = has; out.hidden = !has; list.hidden = !has;
    if (has) {
      hrs.textContent = t.about + " " + s.range + " " + t.hours;
      if (s.pkg) { price.textContent = "$" + s.pkg.price; fit.innerHTML = ""; fit.appendChild(document.createTextNode(t.fits + " ")); var sg = document.createElement("strong"); sg.textContent = s.pkg.label; fit.appendChild(sg); fit.appendChild(document.createTextNode(", " + t.car + ".")); }
      else { price.textContent = "$499+"; fit.textContent = t.over; }
    }
    cta.setAttribute("aria-disabled", has ? "false" : "true");
    cta.textContent = has ? t.cta : t.wait;
  }
  window.addEventListener("mwpv", function (e) { render(e.detail); });
  if (window.MWPV && window.MWPV.state) render(window.MWPV.state);
  else render({ ids: [], names: [] });
  cta.addEventListener("click", function () {
    if (!st || !st.ids.length) return;
    var plan = { v: 1, lang: st.lang, ids: st.ids, names: st.names, hours: st.range, pkg: st.pkg ? st.pkg.label : "", price: st.pkg ? st.pkg.price : null, over: !!st.over, saved: new Date().toISOString() };
    try { localStorage.setItem("mwla-private-plan", JSON.stringify(plan)); } catch (e) {}
    var q = "stops=" + encodeURIComponent(st.ids.join(",")) + "&est=" + (st.pkg ? st.pkg.price : "") + "&pkg=" + encodeURIComponent(plan.pkg) + "&h=" + encodeURIComponent(st.range) + "&lang=" + st.lang;
    window.location.href = "/private-tour?" + q;
  });
})();
</script>
"""

ERN = C + "6a87ce84d9af8f7c9bf12030_Tour%20Guide.avif"


def calc_html(lang):
    t = T[lang]
    tj = json.dumps({"remove": t["remove"], "about": t["about"], "to": t["to"], "hours": t["hours"], "fits": t["fits"], "car": t["car"], "over": t["over"], "cta": t["cta"], "wait": t["wait"]}, ensure_ascii=False)
    return f"""<!-- MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: ESTIMATE CALCULATOR (right column, inside the Webflow .mw-form-card). Built by page-embeds/build_home_private.py. Oct 17, 2026 (Marlon via Gemini). Reads the picks from home-private.html through window.MWPV. -->
<div class="pcq" id="pcq">
 <div class="pcq-l">
  <h3 class="pcq-title">{t["ch"]}</h3>
  <p class="pcq-hint">{t["chint"]}</p>
  <p class="pcq-none" hidden>{t["none"]}</p>
  <ul class="pcq-list" aria-label="{t["yours"]}" hidden></ul>
 </div>
 <div class="pcq-r">
  <div class="pcq-out" aria-live="polite" hidden>
    <span class="pcq-hours"></span>
    <span class="pcq-price"></span>
    <span class="pcq-cap">{t["est"]}</span>
    <p class="pcq-fit"></p>
  </div>
  <p class="pcq-incl">{t["incl"]}</p>
  <div class="pcq-ern"><img src="{ERN}" alt="" aria-hidden="true" loading="lazy"><button type="button" class="pcq-cta" aria-disabled="true">{t["cta"]}</button></div>
  <p class="pcq-note">{t["note"]}</p>
 </div>
</div>
<script type="application/json" id="pcq-t">{tj}</script>
""" + CALC_CSS + CALC_JS


for lang, suf in (("en", ""), ("es", "-es")):
    open(f"home-private{suf}.html", "w", encoding="utf-8").write(left_html(lang))
    open(f"home-private-calc{suf}.html", "w", encoding="utf-8").write(calc_html(lang))
    print("wrote", lang)
