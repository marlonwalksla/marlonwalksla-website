# Builds the Home "LA, Your Way" itinerary builder (Oct 17, 2026, Marlon via Gemini, chunk 3):
#   home-private.html / home-private-es.html           = left column: toggle pills + one big Polaroid that follows the last pick
#   home-private-calc.html / home-private-calc-es.html = right column: Estimate calculator + "Finalize Custom Tour"
# The two embeds talk through window.MWPV (state) and the "mwpv" event. The estimate math is the same as the old route chips:
# 60 min hotel pickup and drop-off + minutes at each stop + driving between areas, shown as a range, matched to a flat per-car package.
# PACKAGES prices are PLACEHOLDER estimates (see build_private_builder.py). The Polaroid for places without a photo is a colored card.
# Finalize saves the plan to localStorage ("mwla-private-plan") and opens /private-tour?stops=...&est=... (page-embeds/private-tour-plan.html).
import json

C = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
# Oct 19, 2026 pricing (Marlon): list $60 per person per hour. Group rates $40 / $30 / $25 per person per hour for 2 / 3 / 4 guests,
# and each extra 2-hour block is about 7% cheaper (12 hours costs the same as 10). Totals are for the WHOLE group at 2, 4, 6, 8, 10, 12 hours.
# Same table lives in build_private_builder.py and private-tour-plan.html. Edit them together.
PRICES = {"2": [159, 309, 449, 579, 699, 799], "3": [179, 349, 499, 649, 779, 899], "4": [199, 389, 559, 719, 869, 999]}
LIST_RATE = 60
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
  incl="Hotel pickup and drop-off included", groupl="How many of you?", dropoff="Took a free tour? Add a short drop-off for $60, even to the airport.", people="people", each="each", total="total", listp="List price", save="You save", fits="Fits a", car="1 to 4 guests, one price per car", over="That is more than one day. Message Marlon and we will plan two.",
  est="Estimated price", base="Base: pickup, drop-off and driving", cta="Finalize Custom Tour", wait="Pick something first", note="No payment now. Next you send Marlon your details.",
  remove="Remove", count="places picked"),
 "es": dict(
  h="Elige tus lugares", hint="Lugares ideales para fotos, sin planear nada. Toca para agregar.",
  g_dt="Centro, a pie", g_la="Lugares", g_ch="Retos",
  cap0="Toca un lugar y su foto cae aquí", picked="Tu última elección",
  ch="Calcula tu día", chint="Según lo que elegiste. Marlon confirma el precio final.",
  none="Elige un lugar o un reto para ver tu estimado.", yours="Tus lugares", about="Unas", to="a", hours="horas",
  incl="Recogida y regreso al hotel incluidos", groupl="¿Cuántos son?", dropoff="¿Hiciste un free tour? Agrega un traslado corto por $60, incluso al aeropuerto.", people="personas", each="c/u", total="total", listp="Precio de lista", save="Ahorras", fits="Cabe en", car="1 a 4 personas, un precio por auto", over="Es más de un día. Escríbele a Marlon y armamos dos.",
  est="Precio estimado", base="Base: recogida, regreso y manejo", cta="Finalizar mi tour a medida", wait="Elige algo primero", note="Sin pago ahora. Después le mandas tus datos a Marlon.",
  remove="Quitar", count="lugares elegidos"),
}


# Oct 20, 2026 (Marlon): LA, Your Way shows PREVIOUS CUSTOM TRIPS (named adventures with photos) instead of single places. Pick one, see its photos
# and its price for 2/3/4 guests, then book it as is or change it. Hours are real where Marlon said so; "assumed" ones need his OK.
# Photos load from TRIP_IMG (img/trips/ in the repo or a Webflow upload). Missing photos fall back to a colored card. Guest photos only with permission.
TRIP_IMG = "https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@test/img/trips/"
# id, tier, hours, color, EN title, ES title, EN stops, ES stops, EN story, ES story, photo file stems (with captions in EN, ES)
TRIPS = [
    ("sunset", "quest", 5, "#FFD6A5", "Date Night: Sunset Hike", "Cita: Caminata al atardecer",
     ["Donuts", "Hollywood Sign", "Griffith sunset", "Rodeo Drive", "Urban Light"], ["Donas", "Letrero de Hollywood", "Atardecer en Griffith", "Rodeo Drive", "Urban Light"],
     "A couple on their first vacation in 10 years. He wanted her birthday to be special. Donuts first, then the Hollywood Sign, sunset at the Observatory, and Urban Light.",
     "Una pareja en sus primeras vacaciones en 10 años. Él quería un cumpleaños especial para ella. Primero donas, luego el letrero de Hollywood, el atardecer en el Observatorio y Urban Light.",
     ["hollywood-sign-griffith-urban-light-01-donut-stop", "hollywood-sign-griffith-urban-light-03-sunset-hike", "hollywood-sign-griffith-urban-light-02-griffith-skyline", "hollywood-sign-griffith-urban-light-06-rodeo-drive", "hollywood-sign-griffith-urban-light-07-urban-light", "hollywood-sign-griffith-urban-light-08-polaroid-urban-light"]),
    ("echo", "quest", 5, "#F6C6DF", "Echo Park and Angels Point", "Echo Park y Angels Point",
     ["Echo Park Lake", "Angels Point", "Sunset", "Observatory"], ["Lago Echo Park", "Angels Point", "Atardecer", "Observatorio"],
     "Parents and their son-in-law, while the daughter was at work. We had more time, so we went to these spots and traded photos. Fun for me too.",
     "Unos papás y su yerno, mientras la hija trabajaba. Teníamos más tiempo, así que fuimos a estos lugares y nos tomamos fotos unos a otros. También fue divertido para mí.",
     ["echo-park-and-angels-point-01-echo-park-lake", "echo-park-and-angels-point-02-polaroid-echo-park-the-two", "echo-park-and-angels-point-03-the-three-at-sunset", "echo-park-and-angels-point-04-photographer-at-sunset", "echo-park-and-angels-point-05-polaroid-angels-point", "echo-park-and-angels-point-07-observatory-night"]),
    ("getty", "short", 4, "#DCEFFA", "Explore Getty Museum", "Explora el Museo Getty",
     ["Getty Museum", "Sunset view"], ["Museo Getty", "Vista al atardecer"],
     "An Israeli couple in their 80s on a world cruise. The Getty was the one thing she wanted to see. We made sure they had a beautiful sunset before they sailed. Getty parking is not included.",
     "Una pareja israelí de más de 80 años en un crucero por el mundo. El Getty era lo único que ella quería ver. Nos aseguramos de que vieran un atardecer hermoso antes de zarpar. El estacionamiento del Getty no está incluido.",
     ["the-getty-at-sunset-01-the-three-of-us", "the-getty-at-sunset-02-getty-garden", "the-getty-at-sunset-03-sunset-view", "the-getty-at-sunset-04-polaroid-the-couple"]),
    ("canals", "quest", 4, "#E3F6D8", "Date Night: Venice Canals", "Cita: Canales de Venice",
     ["Venice Canals", "The white bridge"], ["Canales de Venice", "El puente blanco"],
     "A date for two. She had seen this bridge in a movie, so we went to find it.",
     "Una cita para dos. Ella había visto este puente en una película, así que fuimos a buscarlo.",
     ["venice-canals-date-01-canal-walk", "venice-canals-date-02-white-bridge", "venice-canals-date-03-her-on-the-bridge", "venice-canals-date-04-marlon-at-the-canal"]),
    ("tacos", "quest", 4, "#FFE08A", "Beach and Tacos", "Playa y tacos",
     ["Mexican food", "Santa Monica Pier"], ["Comida mexicana", "Muelle de Santa Mónica"],
     "A honeymoon couple on their last stop before flying home. They wanted Mexican food and Santa Monica. Done.",
     "Una pareja de luna de miel en su última parada antes de volar a casa. Querían comida mexicana y Santa Mónica. Listo.",
     ["santa-monica-and-tacos-02-tacos-together", "santa-monica-and-tacos-01-pier-at-night"]),
    ("three", "quest", 9, "#D9F5E3", "Three Countries, Three Locations", "Tres países, tres lugares",
     ["Downtown", "Hollywood Sign", "Griffith sunset", "Santa Monica"], ["Centro", "Letrero de Hollywood", "Atardecer en Griffith", "Santa Mónica"],
     "A Canadian, a Mexican and an American. We did the whole three countries together, from the Hollywood Sign to a sunset at the Observatory.",
     "Un canadiense, una mexicana y un estadounidense. Hicimos los tres países juntos, del letrero de Hollywood a un atardecer en el Observatorio.",
     ["three-countries-three-locations-01-marlon-hollywood-sign-polaroid", "three-countries-three-locations-02-christy-sunset-polaroid", "three-countries-three-locations-04-the-three-polaroids", "three-countries-three-locations-05-griffith-sunset", "three-countries-three-locations-06-griffith-dusk"]),
]
TRIP_DEFAULT = "sunset"
T["en"].update(h="Start from a real trip", hint="Past guests, past days. Pick one to see the photos and the price. Tap a photo to bring it to the front. Do it as is, or make it yours.",
  trip_short="Short Journey", trip_quest="Quest", cap0="Tap a trip and its photos land here", stopsl="Stops", hrsl="hours",
  none="Pick a trip to see your estimate.", cta2="Book this trip", cta3="Change it, make it yours", note2="No payment now. Next you send Marlon your details.")
T["es"].update(h="Empieza con un viaje real", hint="Huéspedes y días reales. Elige uno para ver las fotos y el precio. Toca una foto para traerla al frente. Hazlo tal cual, o hazlo tuyo.",
  trip_short="Viaje corto", trip_quest="Aventura", cap0="Toca un viaje y sus fotos caen aquí", stopsl="Paradas", hrsl="horas",
  none="Elige un viaje para ver tu estimado.", cta2="Reservar este viaje", cta3="Cámbialo, hazlo tuyo", note2="Sin pago ahora. Después le mandas tus datos a Marlon.")


def esc(x):
    return x.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def data_for(lang):
    i = 0 if lang == "en" else 1
    trips = [{"id": r[0], "tier": r[1], "hours": r[2], "color": r[3], "name": r[4 + i], "stops": r[6 + i], "story": r[8 + i],
              "photos": [TRIP_IMG + p + ".webp" for p in r[10]]} for r in TRIPS]
    return {"lang": lang, "t": T[lang], "trips": trips, "on": TRIP_DEFAULT, "prices": PRICES, "listRate": LIST_RATE}


LEFT_CSS = """<style>
  .pvb { font-family: "Nunito", system-ui, sans-serif; color: #27302E; overflow-x: clip; }
  /* Oct 18, 2026 (Marlon via Gemini): Polaroid Stack. Tapping a place tosses its photo onto the pile; tapping again takes it off. */
  .polaroid-stack-area { position: relative; width: 100%; min-height: 400px; margin: 0 0 18px; --pw: 210px; }
  .stacked-photo { position: absolute; width: var(--pw); box-sizing: border-box; background: #fff; padding: 10px 10px 12px; box-shadow: 0 10px 22px -8px rgba(39, 48, 46, 0.55), 0 2px 4px rgba(39, 48, 46, 0.18);
    transition: all 0.3s ease-out; will-change: transform, opacity; }
  .stacked-photo { cursor: pointer; }
  .stacked-photo:focus-visible { outline: 3px solid #2890B6; outline-offset: 3px; }
  .stacked-photo.is-top { box-shadow: 0 16px 30px -8px rgba(39, 48, 46, 0.6), 0 2px 4px rgba(39, 48, 46, 0.18); }
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
  .pvb-g { margin: 0 0 8px; }
  .polaroid-stack-area { min-height: 340px; margin: 0; }
  .pvb-pills { margin: 0 0 14px; }
  .pvb-story { margin: 14px 0 0; font-size: 1rem; line-height: 1.5; color: #27302E; }
  .pvb-story p { margin: 6px 0 0; }
  .pvb-tag { display: inline-block; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.85rem; padding: 2px 12px; border-radius: 99px; background: #FFD43B; border: 2px solid #27302E; }
  .polaroid-stack-area { min-height: 380px; }
  @media (max-width: 700px) { .pvb-cols { grid-template-columns: 1fr; } .polaroid-stack-area { min-height: 320px; } }
</style>
"""

LEFT_JS = r"""<script>
(function () {
  var D = JSON.parse(document.getElementById("pvb-data").textContent), t = D.t, TR = {};
  D.trips.forEach(function (r) { TR[r.id] = r; });
  var area = document.getElementById("polaroid-stack-area"), zTop = 10, still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pills = [].slice.call(document.querySelectorAll(".pvb-pill")), story = document.getElementById("pvb-story"), cur = null, timers = [];
  function place(el) {
    var W = area.clientWidth, H = area.clientHeight, pw = el.offsetWidth, ph = el.offsetHeight;
    el.style.left = Math.max(0, (W - pw) * parseFloat(el.dataset.fx)) + "px";
    el.style.top = Math.max(0, (H - ph) * parseFloat(el.dataset.fy)) + "px";
  }
  function drop(r, src, i, delay) {
    var el = document.createElement("figure");
    el.className = "stacked-photo is-drop";
    el.dataset.fx = (0.06 + Math.random() * 0.88).toFixed(3); el.dataset.fy = (0.08 + Math.random() * 0.84).toFixed(3);
    el.dataset.rot = ((Math.random() * 24) - 12).toFixed(1);
    el.style.zIndex = ++zTop;
    var tape = document.createElement("span"); tape.className = "sp-tape"; el.appendChild(tape);
    var box = document.createElement("div"); box.className = "sp-img";
    var card = document.createElement("div"); card.className = "sp-card"; card.style.background = r.color; card.textContent = r.name; box.appendChild(card);
    var im = new Image(); im.alt = ""; im.loading = "lazy"; im.onload = function () { box.appendChild(im); card.style.display = "none"; };
    im.src = src;  // a missing photo leaves the colored card
    el.appendChild(box); area.appendChild(el); place(el);
    el.tabIndex = 0; el.setAttribute("role", "button"); el.setAttribute("aria-label", r.name + " " + (i + 1));
    function top() { el.style.zIndex = ++zTop; el.classList.add("is-top"); [].forEach.call(area.querySelectorAll(".is-top"), function (o) { if (o !== el) o.classList.remove("is-top"); }); }
    el.addEventListener("click", top); el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); top(); } });
    el.style.transform = "rotate(" + (parseFloat(el.dataset.rot) + (Math.random() < .5 ? -14 : 14)) + "deg) scale(1.12)";
    function land() { el.classList.remove("is-drop"); el.style.transform = "rotate(" + el.dataset.rot + "deg)"; }
    if (still) land(); else timers.push(setTimeout(function () { requestAnimationFrame(function () { requestAnimationFrame(land); }); }, delay));
  }
  function clearPile() {
    timers.forEach(clearTimeout); timers = [];
    [].slice.call(area.querySelectorAll(".stacked-photo")).forEach(function (el) { if (el.parentNode) el.parentNode.removeChild(el); });
  }
  window.addEventListener("resize", function () { if (area) [].forEach.call(area.querySelectorAll(".stacked-photo"), place); });
  function state() {
    var r = cur && TR[cur]; if (!r) return { ids: [], names: [], lang: D.lang, t: t };
    return { ids: [r.id], names: [r.name], stops: r.stops, lang: D.lang, hours: r.hours, lo: r.hours, hi: r.hours, range: String(r.hours), tier: r.tier, trip: r.id, over: false, t: t };
  }
  function publish() {
    window.MWPV = window.MWPV || {}; window.MWPV.state = state();
    try { window.dispatchEvent(new CustomEvent("mwpv", { detail: window.MWPV.state })); } catch (e) {}
  }
  function pick(id) {
    cur = id; var r = TR[id];
    pills.forEach(function (p) { p.setAttribute("aria-pressed", p.dataset.id === id ? "true" : "false"); });
    clearPile(); area.classList.add("has-photos");
    r.photos.forEach(function (src, i) { drop(r, src, i, 80 + i * 200); });
    story.innerHTML = "";
    var tag = document.createElement("span"); tag.className = "pvb-tag"; tag.textContent = (r.tier === "short" ? t.trip_short : t.trip_quest) + " · " + r.hours + " " + t.hrsl;
    var p = document.createElement("p"); p.textContent = r.story;
    story.appendChild(tag); story.appendChild(p); story.hidden = false;
    publish();
  }
  pills.forEach(function (p) { p.addEventListener("click", function () { pick(p.dataset.id); }); });
  pick(D.on);
})();
</script>
"""


def left_html(lang):
    t = T[lang]; data = data_for(lang)
    pills = "".join(f'<button type="button" class="pvb-pill" data-id="{r["id"]}" aria-pressed="false">{esc(r["name"])}</button>' for r in data["trips"])
    js_data = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    return f"""<!-- ==============================================================================
     MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: LA, YOUR WAY - PREVIOUS TRIPS (LEFT COLUMN). Built by page-embeds/build_home_private.py
     Oct 20, 2026 (Marlon): the place pills and Challenges are gone. Pick a past custom trip: its photos drop on the pile and its story shows.
     The estimate lives in home-private-calc.html (right column) and reads the pick through window.MWPV.
     ============================================================================== -->
<div class="mw-offer pvb" id="private-tours">
  <h3 class="pvb-h">{t["h"]}</h3>
  <p class="pvb-hint">{t["hint"]}</p>
  <div class="pvb-pills" role="group" aria-label="{esc(t['h'])}">{pills}</div>
  <div class="polaroid-stack-area" id="polaroid-stack-area" role="group" aria-label="{esc(t['h'])}"><p class="pvb-empty">{esc(t["cap0"])}</p></div>
  <div class="pvb-story" id="pvb-story" hidden></div>
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
  .pcq-grp { display: flex; align-items: center; gap: 8px; margin: 0 0 12px; }
  .pcq-grpl { font-weight: 700; margin-right: 4px; }
  .pcq-g { font: inherit; font-family: "Fredoka", sans-serif; font-weight: 600; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; background: #FFFDF8; color: #27302E; border: 2px solid #D9CFBC; }
  .pcq-g[aria-pressed="true"] { background: #FFD43B; border-color: #27302E; }
  .pcq-g:focus-visible { outline: 3px solid #2890B6; outline-offset: 2px; }
  .pcq-badge { display: inline-block; padding: 2px 10px; border-radius: 99px; background: #DFF5E3; color: #1E6B3A; font-weight: 700; font-size: 0.85rem; }
  .pcq-price { white-space: nowrap; font-size: clamp(2.3rem, 4.6vw, 3.1rem) !important; }
  .pcq-price small { font-family: "Nunito", sans-serif; font-size: 1rem; font-weight: 700; color: #4D5551; }
  .pcq-fit s { color: #5B6663; }
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
  .pcq-alt { display: block; width: 100%; margin-top: 10px; text-align: center; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1rem; color: #27302E; background: transparent; border: 0; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; min-height: 44px; }
  .pcq-alt:focus-visible { outline: 3px solid #2890B6; outline-offset: 2px; }
  .pcq-alt[hidden] { display: none; }
</style>
"""

CALC_JS = r"""<script>
(function () {
  var root = document.getElementById("pcq"); if (!root) return;
  var t = JSON.parse(document.getElementById("pcq-t").textContent);
  var list = root.querySelector(".pcq-list"), none = root.querySelector(".pcq-none"), out = root.querySelector(".pcq-out");
  var hrs = root.querySelector(".pcq-hours"), price = root.querySelector(".pcq-price"), fit = root.querySelector(".pcq-fit"), cta = root.querySelector(".pcq-cta");
  var st = null, n = 2, alt = root.querySelector(".pcq-alt");
  function priceAt(g, h) {
    var T = t.prices[g], x = Math.min(12, Math.max(2, h)), i = Math.min(4, Math.floor((x - 2) / 2)), f = (x - 2 - i * 2) / 2;
    return Math.round((T[i] + (T[i + 1] - T[i]) * f) / 10) * 10 - 1;
  }
  function quote(s) {
    if (s.lo > 12) return null;
    var hi = Math.min(s.hi, 12), lo = priceAt(n, s.lo), top = priceAt(n, hi), list = Math.round(t.listRate * n * hi);
    return { lo: lo, hi: top, eachLo: Math.round(lo / n), eachHi: Math.round(top / n), list: list, pct: Math.round((1 - top / list) * 100) };
  }
  [].slice.call(root.querySelectorAll(".pcq-g")).forEach(function (g) {
    g.addEventListener("click", function () {
      n = +g.dataset.n;
      [].slice.call(root.querySelectorAll(".pcq-g")).forEach(function (o) { o.setAttribute("aria-pressed", o === g ? "true" : "false"); });
      if (st) render(st);
    });
  });
  function render(s) {
    st = s; if (!s) return;
    list.innerHTML = "";
    s.ids.forEach(function (id, i) {
    });
    (s.stops || []).forEach(function (nm) {
      var li = document.createElement("li"), sp = document.createElement("span"); sp.textContent = nm; li.style.paddingRight = "12px"; li.appendChild(sp); list.appendChild(li);
    });
    var has = s.ids.length > 0;
    none.hidden = has; out.hidden = !has; list.hidden = !has;
    if (has) {
      hrs.textContent = s.range + " " + t.hrsl;
      var q = quote(s);
      if (q) {
        price.textContent = "$" + q.eachLo + (q.eachHi !== q.eachLo ? "-" + q.eachHi : "");
        var sm = document.createElement("small"); sm.textContent = " " + t.each; price.appendChild(sm);
        fit.innerHTML = ""; fit.appendChild(document.createTextNode("$" + q.lo + (q.hi !== q.lo ? " " + t.to + " $" + q.hi : "") + " " + t.total + " (" + n + " " + t.people + ")"));
        var br = document.createElement("br"), was = document.createElement("s"), bd = document.createElement("span");
        was.textContent = t.listp + " $" + q.list; bd.className = "pcq-badge"; bd.textContent = t.save + " " + q.pct + "%";
        fit.appendChild(br); fit.appendChild(was); fit.appendChild(document.createTextNode(" ")); fit.appendChild(bd);
      } else { price.textContent = "$1,000+"; fit.textContent = t.over; }
    }
    cta.setAttribute("aria-disabled", has ? "false" : "true");
    cta.textContent = has ? t.cta2 : t.wait; alt.hidden = !has; alt.textContent = t.cta3;
  }
  window.addEventListener("mwpv", function (e) { render(e.detail); });
  if (window.MWPV && window.MWPV.state) render(window.MWPV.state);
  else render({ ids: [], names: [] });
  function go(custom) {
    if (!st || !st.ids.length) return;
    var qt = quote(st);
    var plan = { v: 3, lang: st.lang, ids: st.ids, names: st.names, hours: st.range, n: n, price: qt ? qt.hi : null, priceLo: qt ? qt.lo : null, trip: st.trip, custom: !!custom, saved: new Date().toISOString() };
    try { localStorage.setItem("mwla-private-plan", JSON.stringify(plan)); } catch (e) {}
    var q = "stops=" + encodeURIComponent(st.ids.join(",")) + "&n=" + n + "&est=" + (qt ? qt.hi : "") + "&lo=" + (qt ? qt.lo : "") + "&h=" + encodeURIComponent(st.range) + "&lang=" + st.lang + (custom ? "&custom=1" : "");
    window.location.href = "/private-tour?" + q;
  }
  cta.addEventListener("click", function () { go(false); });
  alt.addEventListener("click", function () { go(true); });
})();
</script>
"""

ERN = C + "6a87ce84d9af8f7c9bf12030_Tour%20Guide.avif"


def calc_html(lang):
    t = T[lang]
    tj = json.dumps({"remove": t["remove"], "about": t["about"], "to": t["to"], "hours": t["hours"], "fits": t["fits"], "car": t["car"], "over": t["over"], "cta": t["cta"], "wait": t["wait"], "each": t["each"], "hrsl": t["hrsl"], "cta2": t["cta2"], "cta3": t["cta3"], "people": t["people"], "total": t["total"], "listp": t["listp"], "save": t["save"], "prices": PRICES, "listRate": LIST_RATE}, ensure_ascii=False)
    return f"""<!-- MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: ESTIMATE CALCULATOR (right column, inside the Webflow .mw-form-card). Built by page-embeds/build_home_private.py. Oct 17, 2026 (Marlon via Gemini). Reads the picks from home-private.html through window.MWPV. -->
<div class="pcq" id="pcq">
 <div class="pcq-l">
  <h3 class="pcq-title">{t["ch"]}</h3>
  <p class="pcq-hint">{t["chint"]}</p>
  <p class="pcq-none" hidden>{t["none"]}</p>
  <ul class="pcq-list" aria-label="{t["stopsl"]}" hidden></ul>
 </div>
 <div class="pcq-r">
  <div class="pcq-grp" role="group" aria-label="{t["groupl"]}"><span class="pcq-grpl">{t["groupl"]}</span><button type="button" class="pcq-g" data-n="2" aria-pressed="true">2</button><button type="button" class="pcq-g" data-n="3" aria-pressed="false">3</button><button type="button" class="pcq-g" data-n="4" aria-pressed="false">4</button></div>
  <div class="pcq-out" aria-live="polite" hidden>
    <span class="pcq-hours"></span>
    <span class="pcq-price"></span>
    <span class="pcq-cap">{t["est"]}</span>
    <p class="pcq-fit"></p>
  </div>
  <p class="pcq-incl">{t["incl"]}</p>
  <p class="pcq-incl pcq-drop">{t["dropoff"]}</p>
  <div class="pcq-ern"><img src="{ERN}" alt="" aria-hidden="true" loading="lazy"><button type="button" class="pcq-cta" aria-disabled="true">{t["cta"]}</button></div>
  <button type="button" class="pcq-alt" hidden></button>
  <p class="pcq-note">{t["note2"]}</p>
 </div>
</div>
<script type="application/json" id="pcq-t">{tj}</script>
""" + CALC_CSS + CALC_JS


if __name__ == "__main__":
    for lang, suf in (("en", ""), ("es", "-es")):
        open(f"home-private{suf}.html", "w", encoding="utf-8").write(left_html(lang))
        open(f"home-private-calc{suf}.html", "w", encoding="utf-8").write(calc_html(lang))
        print("wrote", lang)
