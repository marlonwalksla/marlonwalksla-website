# Builds the Home private section column (left side of #private-split): home-private.html and home-private-es.html.
# Oct 17, 2026 (late): same pattern as Team and Free. Three Polaroids + a real story from Marlon's Instagram,
# then three route chips that join into one day on the animated map, hours and the package that fits,
# "Steal this itinerary" (Google Maps with every stop) and "Do it with me".
# Prices/times are the same placeholders as the Private page builder (build_private_builder.py). Edit both together.
import json

C = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
ERN = C + "6a87ce84d9af8f7c9bf12030_Tour%20Guide.avif"
# STAND-INS until Marlon uploads Hollywood Sign and Santa Monica Polaroids: swap the 2nd and 3rd image here.
POLS = [
    (C + "6ac74a88ff63a23a7673ee96_polaroid-griffith-sunset.webp", "Sunset at Griffith Observatory", "Atardecer en el Observatorio Griffith", "-2.5deg", "rgba(255,255,0,.6)"),
    (C + "6ac75116ea4b76796295dd9e_polaroid-familia-nunez-avila.webp", "A family with their Polaroid", "Una familia con su Polaroid", "2deg", "rgba(255,0,255,.45)"),
    (C + "6ac751164510f5f1ff6d218c_polaroid-natalia-olaf-angels-flight.webp", "Natalia and Olaf with their Polaroid", "Natalia y Olaf con su Polaroid", "-1.5deg", "rgba(40,144,182,.45)"),
]
PACKAGES = [  # same as the Private page
    {"en": "Half day", "es": "Medio día", "hours": 4, "price": 249},
    {"en": "Full day", "es": "Día completo", "hours": 8, "price": 399},
    {"en": "Long day", "es": "Día largo", "hours": 12, "price": 499},
]
S = {  # id: (EN name, ES name, EN desc, ES desc, minutes, lat, lng, Google Maps search)
    "sign": ("Hollywood Sign viewpoint", "Mirador del letrero de Hollywood", "Photos with the sign from Lake Hollywood Park.", "Fotos con el letrero desde Lake Hollywood Park.", 30, 34.1265, -118.3297, "Lake Hollywood Park, Los Angeles, CA"),
    "griffith": ("Griffith Observatory", "Observatorio Griffith", "Views over all of Los Angeles.", "Vistas de todo Los Ángeles.", 60, 34.1184, -118.3004, "Griffith Observatory, Los Angeles, CA"),
    "urban": ("Urban Light", "Urban Light", "The 202 street lamps at LACMA.", "Las 202 farolas de LACMA.", 20, 34.0629, -118.3593, "Urban Light, LACMA, Los Angeles, CA"),
    "grove": ("The Grove and Farmers Market", "The Grove y el Farmers Market", "Shops, snacks and the 1934 market.", "Tiendas, antojitos y el mercado de 1934.", 60, 34.072, -118.3576, "The Original Farmers Market, Los Angeles, CA"),
    "bhsign": ("Beverly Hills sign", "Letrero de Beverly Hills", "The lily pond and the famous sign.", "El estanque y el famoso letrero.", 15, 34.0717, -118.4045, "Beverly Gardens Park, Beverly Hills, CA"),
    "rodeo": ("Rodeo Drive", "Rodeo Drive", "A walk down the fanciest street in LA.", "Un paseo por la calle más elegante de LA.", 45, 34.0696, -118.4031, "Rodeo Drive, Beverly Hills, CA"),
    "pier": ("Santa Monica Pier", "Muelle de Santa Mónica", "The pier, the beach and the end of Route 66.", "El muelle, la playa y el final de la Ruta 66.", 60, 34.0094, -118.4973, "Santa Monica Pier, Santa Monica, CA"),
    "venice": ("Venice Beach and Canals", "Venice Beach y los canales", "The boardwalk, then the quiet canals.", "El malecón y luego los canales tranquilos.", 60, 33.985, -118.4695, "Venice Canals, Los Angeles, CA"),
}
ROUTES = [  # order = the order the day runs when routes are combined (east to west)
    {"id": "hol", "en": "Hollywood Views", "es": "Vistas de Hollywood", "color": "#C9A54B", "stops": ["sign", "griffith", "urban"],
     "areas": [["Hollywood Hills", 34.1345, -118.329], ["Griffith Park", 34.13, -118.295], ["Miracle Mile", 34.056, -118.347]]},
    {"id": "mid", "en": "Beverly Hills and Mid-City", "es": "Beverly Hills y Mid-City", "color": "#B5527E", "stops": ["grove", "bhsign", "rodeo"],
     "areas": [["Beverly Hills", 34.0736, -118.4004]]},
    {"id": "coast", "en": "The Coast", "es": "La costa", "color": "#2890B6", "stops": ["pier", "venice"],
     "areas": [["Santa Monica", 34.0195, -118.4912], ["Venice", 33.985, -118.4695]]},
]
T = {
 "en": dict(
   polh="Your LA, in Polaroids",
   story="The tour went so well that we ended up doing a private tour to Lake Hollywood Park to see the sign up close and take photos, before dropping them off at Griffith Observatory.",
   storyby="Marlon, about Belén's family · Instagram",
   pickh="Pick your routes", pickhint="Turn on one, two or all three. They join into one day.",
   maplabel="Route map", about="About", to="to", hours="hours", with_="with pickup and driving",
   fits="Fits a", car="for your whole car", over="That's more than one day. Message me and we'll plan two.",
   steal="Steal this itinerary", copy="Copy the list", copied="Copied!",
   free="The plan is free. The fun is doing it with me.",
   withme="Do it with me", postcard="or send me a postcard",
   prices="See private tour prices", facts="Hotel pickup · up to 4 guests · English or Español",
   wa="Hi Marlon, I'd like a private tour: ", mylist="My LA day, planned with MarlonWalksLA", domore="Do it with Marlon",
   msg="I'd like these routes: ", send="Send my postcard", sending="Sending...",
   stopword="stops"),
 "es": dict(
   polh="Tu LA, en Polaroids",
   story="El tour fue tan bien que terminamos haciendo un tour privado al Lake Hollywood Park para ver el letrero de cerca y sacar fotos, antes de dejarlos en el Observatorio Griffith.",
   storyby="Marlon, sobre la familia de Belén · Instagram",
   pickh="Elige tus rutas", pickhint="Activa una, dos o las tres. Se juntan en un solo día.",
   maplabel="Mapa de la ruta", about="Unas", to="a", hours="horas", with_="con recogida y manejo",
   fits="Cabe en", car="para todo tu auto", over="Es más de un día. Escríbeme y armamos dos.",
   steal="Róbate este itinerario", copy="Copiar la lista", copied="¡Copiada!",
   free="El plan es gratis. Lo divertido es hacerlo conmigo.",
   withme="Hazlo conmigo", postcard="o mándame una postal",
   prices="Ver precios de tours privados", facts="Recogida en tu hotel · hasta 4 personas · English o Español",
   wa="Hola Marlon, me interesa un tour privado: ", mylist="Mi día en LA, planeado con MarlonWalksLA", domore="Hazlo con Marlon",
   msg="Me interesan estas rutas: ", send="Enviar mi postal", sending="Enviando...",
   stopword="paradas"),
}

def esc(x):
    return x.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def build(lang):
    t = T[lang]
    data = {"lang": lang, "t": t, "packages": [{"label": p[lang], "hours": p["hours"], "price": p["price"]} for p in PACKAGES],
            "stops": {k: {"name": v[0 if lang == "en" else 1], "desc": v[2 if lang == "en" else 3], "min": v[4], "lat": v[5], "lng": v[6], "q": v[7]} for k, v in S.items()},
            "routes": [{"id": r["id"], "name": r[lang], "color": r["color"], "stops": r["stops"],
                        "areas": [{"name": a[0], "lat": a[1], "lng": a[2]} for a in r["areas"]]} for r in ROUTES]}
    pols = "".join(
        f'<figure class="pvp-pol pc-pol" style="--r:{r}"><span class="pvp-tape pc-tape" style="background:{tape}"></span><img src="{src}" alt="{alt_en if lang == "en" else alt_es}" loading="lazy"></figure>'
        for src, alt_en, alt_es, r, tape in POLS)
    chips = "".join(
        f'<button type="button" class="pvr-chip" data-route="{r["id"]}" style="--c:{r["color"]}" aria-pressed="{"true" if r["id"] == "hol" else "false"}">'
        f'<span class="pvr-dot" aria-hidden="true"></span><span class="pvr-name">{esc(r[lang])}</span>'
        f'<span class="pvr-stops">{esc(" · ".join(S[s][0 if lang == "en" else 1] for s in r["stops"]))}</span></button>'
        for r in ROUTES)
    js_data = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    return f"""<!-- ==============================================================================
     MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: PRIVATE TOURS (LEFT COLUMN)  Built by page-embeds/build_home_private.py
     Oct 17, 2026 (late): Polaroids + Marlon's story, then route chips that join into one day on the map,
     hours + the package that fits, "Steal this itinerary" (Google Maps) and "Do it with me".
     The inquiry form on the right is the native Webflow form "Private Tour Inquiry" (styled as a postcard by postcard-forms.css, inlined in the Home hero embed).
     ============================================================================== -->
<div class="mw-offer pv" id="private-tours">
  <div class="pvp">
    <h3 class="pvp-h pc-hide-stamps">{t["polh"]}</h3>
    <i data-pc-home="pc-priv" hidden></i><div class="pvp-row pc-pols" id="pc-priv">{pols}</div>
    <figure class="pvp-q"><blockquote>&ldquo;{esc(t["story"])}&rdquo;</blockquote><figcaption>{esc(t["storyby"])}</figcaption></figure>
  </div>

  <h3 class="pvr-h">{t["pickh"]}</h3>
  <p class="pvr-hint">{t["pickhint"]}</p>
  <div class="pvr-chips" role="group" aria-label="{t["pickh"]}">{chips}</div>

  <div class="mw-route pvr-map" id="pvr-map"></div>

  <div class="pvr-sum" aria-live="polite">
    <p class="pvr-hours" id="pvr-hours"></p>
    <p class="pvr-fit" id="pvr-fit"></p>
    <div class="pvr-acts">
      <a class="pvr-steal" id="pvr-steal" href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">&#128506; {t["steal"]}</a>
      <button type="button" class="pvr-copy" id="pvr-copy">{t["copy"]}</button>
    </div>
    <p class="pvr-free">{t["free"]}</p>
    <div class="pvr-acts">
      <a class="pvr-with" id="pvr-with" href="https://wa.me/12692670410" target="_blank" rel="noopener noreferrer">&#128172; {t["withme"]}</a>
      <a class="pvr-post" id="pvr-post" href="#private-tour-form">&#9993; {t["postcard"]}</a>
    </div>
  </div>

  <p class="pvr-facts">{t["facts"]} &middot; <a class="mw-offer-more" href="/private-tours-los-angeles">{t["prices"]} &rarr;</a></p>
</div>
<script type="application/json" id="pvr-data">{js_data}</script>
<style>
  .pv .pvp {{ margin: 0 0 24px; }}
  .pvp-h, .pvr-h {{ font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.35rem; color: #27302E; margin: 0 0 16px; }}
  .pvp-row {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; align-items: start; padding: 0 6px; }}
  .pvp-pol {{ position: relative; margin: 0; transform: rotate(var(--r)); }}
  .pvp-pol img {{ display: block; width: 100%; height: auto; box-shadow: 0 10px 20px -10px rgba(39, 48, 46, 0.5); }}
  .pvp-tape {{ position: absolute; top: -9px; left: 50%; width: 58px; height: 18px; transform: translateX(-50%) rotate(-4deg); mix-blend-mode: multiply; z-index: 1; }}
  .pvp-q {{ margin: 18px 0 0; padding-left: 14px; border-left: 4px solid #C9A54B; }}
  .pvp-q blockquote {{ margin: 0; font-size: 1rem; line-height: 1.5; color: #3B4440; }}
  .pvp-q figcaption {{ margin-top: 4px; font-size: 0.85rem; color: #5B6663; }}
  .pvr-h {{ margin: 0 0 4px; }}
  .pvr-hint {{ margin: 0 0 12px; font-size: 0.95rem; color: #4D5551; }}
  .pvr-chips {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }}
  .pvr-chip {{ font: inherit; text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 2px; padding: 10px 12px 10px 34px; position: relative; background: #FFFDF8; color: #27302E; border: 2px solid #D9CFBC; border-radius: 12px; transition: transform 0.15s ease-out, box-shadow 0.15s ease-out, border-color 0.15s ease-out; }}
  .pvr-chip:hover {{ transform: translateY(-2px); }}
  .pvr-chip:focus-visible {{ outline: 3px solid #2890B6; outline-offset: 2px; }}
  .pvr-dot {{ position: absolute; left: 11px; top: 13px; width: 15px; height: 15px; border-radius: 50%; border: 2.5px solid var(--c); background: #fff; }}
  .pvr-chip[aria-pressed="true"] {{ border-color: var(--c); background: #fff; box-shadow: 0 0 0 1.5px var(--c), 0 8px 16px -12px rgba(39, 48, 46, 0.6); }}
  .pvr-chip[aria-pressed="true"] .pvr-dot {{ background: var(--c); box-shadow: inset 0 0 0 2.5px #fff; }}
  .pvr-name {{ font-weight: 800; font-size: 0.98rem; line-height: 1.2; }}
  .pvr-stops {{ font-size: 0.78rem; line-height: 1.3; color: #5B6663; }}
  .pvr-map {{ margin-top: 16px; }}
  .pvr-sum {{ margin-top: 14px; }}
  .pvr-hours {{ margin: 0; font-family: "Lilita One", sans-serif; font-size: 1.3rem; color: #27302E; }}
  .pvr-hours small {{ font-family: "Nunito", sans-serif; font-size: 0.9rem; color: #5B6663; margin-left: 4px; }}
  .pvr-fit {{ margin: 2px 0 12px; font-size: 1rem; color: #27302E; }}
  .pvr-acts {{ display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center; }}
  .pvr-steal, .pvr-with {{ display: inline-block; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1rem; color: #27302E !important; text-decoration: none !important; background: #fff; border: 2px solid #27302E; border-radius: 999px; padding: 9px 18px; box-shadow: 3px 3px 0 #27302E; transition: transform 0.15s ease-out, box-shadow 0.15s ease-out; }}
  .pvr-with {{ background: #FFD43B; }}
  .pvr-steal:hover, .pvr-with:hover {{ transform: translate(-1px, -1px); box-shadow: 4px 4px 0 #27302E; }}
  .pvr-copy {{ font: inherit; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.95rem; color: #1B6688; background: none; border: 0; padding: 6px 2px; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }}
  .pvr-post {{ font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.95rem; color: #1B6688 !important; text-decoration: underline !important; text-underline-offset: 3px; }}
  .pvr-free {{ margin: 16px 0 10px; font-family: "Caveat", cursive; font-weight: 700; font-size: 1.55rem; line-height: 1.15; color: #1F2A44; }}
  .pvr-facts {{ margin: 18px 0 0; font-size: 0.9rem; color: #4D5551; }}
  .pvr-facts .mw-offer-more {{ padding: 0; font-size: 0.95rem; }}
  @media (max-width: 600px) {{ .pvr-chips {{ grid-template-columns: 1fr; }} .pvp-row {{ gap: 12px; }} }}
  @media (prefers-reduced-motion: reduce) {{ .pvr-chip, .pvr-steal, .pvr-with {{ transition: none; }} }}
</style>
<script>
(function () {{
  var D = JSON.parse(document.getElementById("pvr-data").textContent), t = D.t;
  var box = document.getElementById("pvr-map"), chips = [].slice.call(document.querySelectorAll(".pvr-chip"));
  if (!box || !chips.length) return;
  function km(a, b) {{ var R = 6371, r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLn = (b.lng - a.lng) * r;
    var h = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLn / 2) * Math.sin(dLn / 2);
    return 2 * R * Math.asin(Math.sqrt(h)); }}
  // Same rough LA math as the Private page: road about 1.35x straight line, about 25 km/h, 5 min to park; plus 60 min hotel pickup and drop-off
  function drive(a, b) {{ return km(a, b) * 1.35 / 25 * 60 + 5; }}
  function fmt(h) {{ return (Math.round(h * 2) / 2).toString().replace(".5", "½"); }}
  function picked() {{ return D.routes.filter(function (r) {{ return chips.some(function (c) {{ return c.dataset.route === r.id && c.getAttribute("aria-pressed") === "true"; }}); }}); }}
  var cur = [];
  function draw(routes) {{
    var stops = [], areas = [];
    routes.forEach(function (r) {{ r.stops.forEach(function (id) {{ stops.push(D.stops[id]); }}); areas = areas.concat(r.areas); }});
    var ra = document.createElement("div");
    ra.className = "ra"; ra.setAttribute("data-compact", ""); ra.setAttribute("data-nolist", "");
    ra.setAttribute("data-label", t.maplabel); ra.setAttribute("data-ernesto", "{ERN}");
    var sc = document.createElement("script"); sc.type = "application/json"; sc.className = "ra-data";
    sc.textContent = JSON.stringify({{ mode: "drive", areas: areas, stops: stops.map(function (s) {{ return {{ name: s.name, desc: s.desc, lat: s.lat, lng: s.lng }}; }}) }});
    ra.appendChild(sc); box.innerHTML = ""; box.appendChild(ra);
    if (window.MWRouteAnim) window.MWRouteAnim.init();
    cur = stops;
    var dm = 0; for (var i = 1; i < stops.length; i++) dm += drive(stops[i - 1], stops[i]);
    var sm = stops.reduce(function (a, s) {{ return a + s.min; }}, 0) + 60;
    var lo = (sm + dm * 0.85) / 60, hi = (sm + dm * 1.4) / 60, mid = (lo + hi) / 2, fit = null;
    for (var k = 0; k < D.packages.length; k++) if (mid <= D.packages[k].hours) {{ fit = D.packages[k]; break; }}
    document.getElementById("pvr-hours").innerHTML = t.about + " " + fmt(lo) + " " + t.to + " " + fmt(hi) + " " + t.hours + "<small>" + t.with_ + "</small>";
    document.getElementById("pvr-fit").innerHTML = fit ? t.fits + " <strong>" + fit.label + ", $" + fit.price + "</strong> " + t.car + "." : t.over;
    var q = stops.map(function (s) {{ return encodeURIComponent(s.q); }});
    document.getElementById("pvr-steal").href = "https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=" + q[q.length - 1] + (q.length > 1 ? "&waypoints=" + q.slice(0, -1).join("%7C") : "");
    var names = routes.map(function (r) {{ return r.name; }}).join(" + ");
    document.getElementById("pvr-with").href = "https://wa.me/12692670410?text=" + encodeURIComponent(t.wa + names + (fit ? " (" + fit.label + ")" : ""));
    document.getElementById("pvr-post").setAttribute("data-msg", t.msg + names + ".");
  }}
  chips.forEach(function (c) {{
    c.addEventListener("click", function () {{
      var on = c.getAttribute("aria-pressed") === "true";
      if (on && picked().length === 1) return; // keep at least one route on
      c.setAttribute("aria-pressed", on ? "false" : "true");
      draw(picked());
    }});
  }});
  document.getElementById("pvr-copy").addEventListener("click", function () {{
    var b = this, txt = t.mylist + "\\n" + cur.map(function (s, i) {{ return (i + 1) + ". " + s.name; }}).join("\\n") +
      "\\n" + document.getElementById("pvr-steal").href + "\\n" + t.domore + ": https://www.marlonwalksla.com/private-tours-los-angeles";
    function done() {{ var o = b.textContent; b.textContent = t.copied; setTimeout(function () {{ b.textContent = o; }}, 1600); }}
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () {{ window.prompt("", txt); }});
    else window.prompt("", txt);
  }});
  // "Send me a postcard": jump to the form and start the message with the routes they picked
  document.getElementById("pvr-post").addEventListener("click", function () {{
    var m = document.getElementById("priv-msg");
    if (m && !m.value) m.value = this.getAttribute("data-msg") || "";
  }});
  // The form button reads like mailing a postcard
  function sendBtn() {{ document.querySelectorAll("#private-tour-form .mw-form-submit").forEach(function (b) {{ b.value = t.send; b.setAttribute("data-wait", t.sending); }}); }}
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", sendBtn); else sendBtn();
  draw(picked());
}})();
</script>
"""

for lang, name in (("en", "home-private.html"), ("es", "home-private-es.html")):
    open(name, "w", encoding="utf-8").write(build(lang))
    print("wrote", name)
