# Builds the Home "LA, Your Way" itinerary builder (Oct 17, 2026, Marlon via Gemini, chunk 3):
#   home-private.html / home-private-es.html           = left column: toggle pills + one big Polaroid that follows the last pick
#   home-private-calc.html / home-private-calc-es.html = right column: Estimate calculator + "Finalize Custom Tour"
# The two embeds talk through window.MWPV (state) and the "mwpv" event. The estimate math is the same as the old route chips:
# 60 min hotel pickup and drop-off + minutes at each stop + driving between areas, shown as a range, matched to a flat per-car package.
# PACKAGES prices are PLACEHOLDER estimates (see build_private_builder.py). The Polaroid for places without a photo is a colored card.
# Finalize saves the plan to localStorage ("mwla-private-plan") and opens /private-tour?stops=...&est=... (page-embeds/private-tour-plan.html).
import json
import stamps

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
  incl="Hotel pickup and drop-off included", groupl="How many of you?", dropoff="Took a free tour? Add a short drop-off for $60, even to the airport.", people="people", each="each", total="total", listp="List price", save="You save", fits="Fits a", car="1-4 guests, one price per car", over="That is more than one day. Message Marlon and we will plan two.",
  est="Estimated price", base="Base: pickup, drop-off and driving", cta="Finalize Custom Tour", wait="Pick something first", note="No payment now. Next you send Marlon your details.",
  remove="Remove", count="places picked"),
 "es": dict(
  h="Elige tus lugares", hint="Lugares ideales para fotos, sin planear nada. Toca para agregar.",
  g_dt="Centro, a pie", g_la="Lugares", g_ch="Retos",
  cap0="Toca un lugar y su foto cae aquí", picked="Tu última elección",
  ch="Calcula tu día", chint="Según lo que elegiste. Marlon confirma el precio final.",
  none="Elige un lugar o un reto para ver tu estimado.", yours="Tus lugares", about="Unas", to="a", hours="horas",
  incl="Recogida y regreso al hotel incluidos", groupl="¿Cuántos son?", dropoff="¿Hiciste un free tour? Agrega un traslado corto por $60, incluso al aeropuerto.", people="personas", each="c/u", total="total", listp="Precio de lista", save="Ahorras", fits="Cabe en", car="1-4 personas, un precio por auto", over="Es más de un día. Escríbele a Marlon y armamos dos.",
  est="Precio estimado", base="Base: recogida, regreso y manejo", cta="Finalizar mi tour a medida", wait="Elige algo primero", note="Sin pago ahora. Después le mandas tus datos a Marlon.",
  remove="Quitar", count="lugares elegidos"),
}


# Oct 20, 2026 (Marlon): LA, Your Way shows PREVIOUS CUSTOM TRIPS (named adventures with photos) instead of single places. Pick one, see its photos
# and its price for 2/3/4 guests, then book it as is or change it. Hours are real where Marlon said so; "assumed" ones need his OK.
# Photos load from TRIP_IMG (img/trips/ in the repo or a Webflow upload). Missing photos fall back to a colored card. Guest photos only with permission.
TRIP_IMG = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"  # Oct 21, 2026: real photos from Webflow Assets; each entry is "assetId_name|object-position"
# id, tier, hours, color, EN title, ES title, EN stops, ES stops, EN story, ES story, photo file stems (with captions in EN, ES)
TRIPS_ALL = [
    # ---- Couples ----
    ("sunset", "quest", 5, "#FFD6A5", "Sunset Hike", "Caminata al atardecer",
     ["Donuts", "Hollywood Sign", "Griffith sunset", "Rodeo Drive", "Urban Light"], ["Donas", "Letrero de Hollywood", "Atardecer en Griffith", "Rodeo Drive", "Urban Light"],
     "", "",
     ["6ad92a2e8aa41f8f19ce753e_guest-griffith-park-and-observatory-04|50% 50%", "6ad929e02eb98d1ee52bd0c0_place-hollywood-sign-02|50% 50%", "6ad92fe3bfe591314e397347_art-griffith-park-and-observatory-02|50% 50%", "6ad92fc8bdb0490f2eabadee_place-beverly-hills-02|50% 50%", "6ad92ff6b2db7b6c094918fa_place-lacma-urban-light-03|50% 50%"], "couples", True,
     "Private sunset hike for two in Los Angeles: the Hollywood Sign, Griffith Observatory at golden hour and Urban Light.",
     "Caminata privada al atardecer para dos en Los Ángeles: el letrero de Hollywood, el Observatorio Griffith y Urban Light."),
    ("canals", "quest", 4, "#E3F6D8", "Venice Canals", "Canales de Venice",
     ["Venice Canals", "The white bridge"], ["Canales de Venice", "El puente blanco"],
     "", "",
     ["6ad929ec9a56d0d159649ffd_place-venice-canals-01|50% 50%", "6ad929ec3eeaaffdbe379a12_guest-venice-canals-01|50% 50%"], "couples", True,
     "A private family walk through the Venice Canals in Los Angeles, with the famous white bridge.",
     "Una caminata privada en familia por los canales de Venice en Los Ángeles, con el famoso puente blanco."),
    ("tacos", "quest", 4, "#FFE08A", "Beach and Tacos", "Playa y tacos",
     ["Mexican food", "Santa Monica Pier"], ["Comida mexicana", "Muelle de Santa Mónica"],
     "", "",
     ["6ad929e61c74efa5d6a35519_guest-santa-monica-01|50% 50%", "6ad929e6fd77e7c927620ea9_place-santa-monica-01|50% 50%", "6ad929f90bb99231ec0dacf2_guest-avenue-26-tacos-01|50% 50%", "6ad93007add8991e78413dd1_place-santa-monica-03|50% 50%"], "couples", False,
     "A private day with friends in Los Angeles: Mexican food and a sunset at the Santa Monica Pier.",
     "Un día privado con amigos en Los Ángeles: comida mexicana y un atardecer en el muelle de Santa Mónica."),
    # ---- Families ----
    ("fgetty", "short", 4, "#DCEFFA", "The Getty", "El Getty",
     ["Getty Museum", "Sunset view"], ["Museo Getty", "Vista al atardecer"],
     "", "",
     ["6ad929daefa7590f943caa69_guest-getty-center-01|50% 50%", "6ad929db59b1d5ccebe76dc4_place-getty-center-01|50% 50%", "6ad929dbc3398f1383c28856_art-getty-center-01|50% 50%"], "families", True,
     "A private family trip to the Getty Center in Los Angeles, with gardens, art and a sunset view. Parking is not included.",
     "Un viaje privado en familia al Getty Center en Los Ángeles, con jardines, arte y una vista al atardecer. El estacionamiento no está incluido."),
    ("fdowntown", "quest", 4, "#FFD6A5", "Downtown Discovery", "Descubre el centro",
     ["Placita Olvera", "Grand Central Market", "Angels Flight", "Walt Disney Concert Hall"], ["Placita Olvera", "Grand Central Market", "Angels Flight", "Walt Disney Concert Hall"],
     "", "",
     ["6ad92a45a6c79d9f41578212_place-olvera-street-and-avila-adobe-02|50% 50%", "6ad93001aaac111f9e725c08_place-olvera-street-and-avila-adobe-03|50% 50%", "6ad92cab137bdbc510c769a6_place-grand-central-market-01|50% 50%", "6ad929f3c0b148baa5f114ec_place-angels-flight-01|50% 50%", "6ad92a0d4c5d80802552eafc_place-disney-hall-02|50% 50%", "6ad92c76d1848d20e07d636e_guest-disney-hall-02|50% 50%"], "families", True,
     "A private downtown Los Angeles walking tour from Placita Olvera to Walt Disney Concert Hall, with Grand Central Market and Angels Flight.",
     "Un tour privado a pie por el centro de Los Ángeles, de Placita Olvera a Walt Disney Concert Hall, con Grand Central Market y Angels Flight."),
    ("fpier", "quest", 4, "#FFE08A", "Pier and Tacos", "Muelle y tacos",
     ["Mexican food", "Santa Monica Pier"], ["Comida mexicana", "Muelle de Santa Mónica"],
     "", "",
     ["6ad929e6fd77e7c927620ea9_place-santa-monica-01|50% 50%", "6ad93007add8991e78413dd1_place-santa-monica-03|50% 50%", "6ad92fc1763e80ce77ca4c78_archive-avenue-26-tacos-01|50% 50%", "6ad929e61c74efa5d6a35519_guest-santa-monica-01|50% 50%"], "families", False,
     "A private family day at the Santa Monica Pier in Los Angeles, with tacos and beach time.",
     "Un día privado en familia en el muelle de Santa Mónica en Los Ángeles, con tacos y tiempo de playa."),
    # ---- Friends ----
    ("echo", "quest", 5, "#F6C6DF", "Echo Park and Angels Point", "Echo Park y Angels Point",
     ["Echo Park Lake", "Angels Point", "Sunset", "Observatory"], ["Lago Echo Park", "Angels Point", "Atardecer", "Observatorio"],
     "", "",
     ["6ad92a15fd77e7c927622751_place-echo-park-lake-01|50% 50%", "6ad92cb5d1848d20e07d8ea2_guest-echo-park-lake-01|50% 50%", "6ad92a15bb9f2b81fb009b26_place-echo-park-lake-02|50% 50%", "6ad92fd00bb99231ec104ab0_place-echo-park-lake-03|50% 50%", "6ad92a1cad4eddc60c1bf588_place-elysian-park-and-angels-point-01|50% 50%", "6ad92a2e4c83370c9caa0a28_place-griffith-park-and-observatory-01|50% 50%"], "friends", True,
     "A private tour for friends at Echo Park Lake and Angels Point in Los Angeles, with a sunset at the Observatory.",
     "Un tour privado para amigos en el lago Echo Park y Angels Point en Los Ángeles, con atardecer en el Observatorio."),
    ("ftacos", "quest", 4, "#FFE08A", "Taco Crawl", "Ruta de tacos",
     ["Avenue 26 tacos", "Grand Central Market"], ["Tacos de Avenue 26", "Grand Central Market"],
     "", "",
     ["6ad929f90bb99231ec0dacf2_guest-avenue-26-tacos-01|50% 50%", "6ad92fc1763e80ce77ca4c78_archive-avenue-26-tacos-01|50% 50%", "6ad92fdd7fd6d8671dbceb66_guest-grand-central-market-02|50% 50%"], "friends", False,
     "A private taco crawl in Los Angeles, from Avenue 26 to Grand Central Market.",
     "Una ruta privada de tacos en Los Ángeles, de Avenue 26 a Grand Central Market."),
    ("three", "quest", 9, "#D9F5E3", "The Big Day", "El gran día",
     ["Downtown", "Hollywood Sign", "Griffith sunset", "Santa Monica"], ["Centro", "Letrero de Hollywood", "Atardecer en Griffith", "Santa Mónica"],
     "", "",
     ["6ad92fef59b1d5ccebe9ec9a_guest-hollywood-sign-03|50% 50%", "6ad92ff02cbe8250c0b65033_guest-hollywood-sign-04|50% 50%", "6ad92fe30bed1f1ae6022809_art-griffith-park-and-observatory-01|50% 50%", "6ad92a2e1ce84651cd2f933d_guest-griffith-park-and-observatory-02|50% 50%", "6ad929e6cc8517d84352c6fe_art-santa-monica-01|50% 50%"], "friends", True,
     "A private full-day tour for friends in Los Angeles: downtown, the Hollywood Sign, a Griffith sunset and Santa Monica.",
     "Un tour privado de día completo para amigos en Los Ángeles: el centro, el letrero de Hollywood, el atardecer en Griffith y Santa Mónica."),
]
# Oct 23, 2026 (Marlon): one example trip per group, wired to the "Who is coming?" toggle in the estimate card (now named Date Night, Family Outing,
# Fun with Friends). Photos: Date Night = different couples at different places, first the tacos with the German couple; Family Outing = the Getty trio;
# Fun with Friends = the Griffith Observatory sunset polaroids. Routes get updated later. The other trips stay in TRIPS_ALL (parked).
TRIPS = [
    ("sunset", "quest", 5, "#FFD6A5", "Date Night", "Cita en pareja",
     ["Tacos", "Griffith sunset", "Venice Canals", "Santa Monica"], ["Tacos", "Atardecer en Griffith", "Canales de Venice", "Santa Mónica"],
     "", "",
     ["6ad929f90bb99231ec0dacf2_guest-avenue-26-tacos-01|50% 50%", "6ad92a2e8aa41f8f19ce753e_guest-griffith-park-and-observatory-04|50% 50%", "6ad929ec3eeaaffdbe379a12_guest-venice-canals-01|50% 50%", "6ad929e61c74efa5d6a35519_guest-santa-monica-01|50% 50%", "6ac74a8b6dc6526aa1e35909_polaroid-disney-hall-couple|50% 50%", "6ac74a8b6dc6526aa1e35947_polaroid-avila-adobe-couple|50% 50%"], "couples", True,
     "A private date night in Los Angeles with Marlon: tacos, golden hour at Griffith Observatory and a stroll through the Venice Canals.",
     "Una cita privada en Los Ángeles con Marlon: tacos, la hora dorada en el Observatorio Griffith y un paseo por los canales de Venice."),
    ("canals", "quest", 4, "#E3F6D8", "Family Outing", "Salida en familia",
     ["Getty Center"], ["Getty Center"],
     "", "",
     ["6ad929daefa7590f943caa69_guest-getty-center-01|50% 50%", "6ad929db59b1d5ccebe76dc4_place-getty-center-01|50% 50%", "6ad929dbc3398f1383c28856_art-getty-center-01|50% 50%"], "families", True,
     "A private family outing in Los Angeles with Marlon: art, gardens and a sunset view at the Getty Center. Parking is not included.",
     "Una salida privada en familia en Los Ángeles con Marlon: arte, jardines y una vista al atardecer en el Getty Center. El estacionamiento no está incluido."),
    ("tacos", "quest", 4, "#FFE08A", "Fun with Friends", "Diversión con amigos",
     ["Griffith sunset"], ["Atardecer en Griffith"],
     "", "",
     ["6ad92a2e1ce84651cd2f933d_guest-griffith-park-and-observatory-02|50% 50%", "6ad92c79be5324f1c409a7a8_archive-la-23|50% 50%", "6ad92cb27fd6d8671dbbc43a_archive-la-22|50% 50%", "6ad92c787fd6d8671dbba6f2_archive-la-10|50% 50%"], "friends", False,
     "A private sunset hike with friends at Griffith Observatory in Los Angeles.",
     "Una caminata privada al atardecer con amigos en el Observatorio Griffith en Los Ángeles."),
]
TRIP_DEFAULT = "sunset"
CUSTOM_PHOTOS = ["6ad92a1cad4eddc60c1bf588_place-elysian-park-and-angels-point-01|50% 50%", "6ad929bf12667b254315c683_place-bunker-hill-01|50% 50%", "6ad929b39a56d0d15964851d_place-broadway-theaters-01|50% 50%", "6ad93001aaac111f9e725c08_place-olvera-street-and-avila-adobe-03|50% 50%"]  # filler images for "Customize my own": downtown is the way in
CUSTOM = {"en": ("Design Your Day", "Design your own private Los Angeles tour. Start with downtown, then tell Marlon where you want to go and for how long.", "Pick your hours below to see the price."),
          "es": ("Diseña tu día", "Diseña tu propio tour privado en Los Ángeles. Empieza por el centro y dile a Marlon a dónde quieres ir y por cuánto tiempo.", "Elige tus horas abajo para ver el precio.")}
T["en"].update(pto="to", perhr="per person, per hour", disc="Bigger groups and longer tours cost less per person.", locl="Places on this trip", durl="How long?", dur=[("half", "Half day"), ("full", "Full day"), ("other", "Other")], whol="Pick your plan", who=[("couples", "&#128145;", "Date Night"), ("families", "&#128106;", "Family Outing"), ("friends", "&#127881;", "Fun with Friends"), ("custom", "&#128506;&#65039;", "Design Your Day")], prev="Previous photo", next="Next photo", dot="Show photo {n}", trip_custom="Your way", hrsq="How many hours?", yourtrip="Your trip", cta4="Design your trip", ch="Your estimate",
  val_in=["Hotel pickup and drop-off", "Driving", "Instant photos"], val_out=["Food", "Parking"], h="Start from a real trip", hint="Tap Date Night, Family Outing or Fun with Friends to flip through real trips. Do one as is, or make it yours.",
  trip_short="Short Journey", trip_quest="Quest", cap0="Tap a trip and its photos land here", stopsl="Stops", hrsl="hours",
  none="Pick a trip to see your estimate.", cta2="Book this trip", cta3="Change it, make it yours", note2="No payment now. Next you send Marlon your details.")
T["es"].update(pto="a", perhr="por persona, por hora", disc="Los grupos más grandes y los tours más largos cuestan menos por persona.", locl="Lugares de este viaje", durl="¿Cuánto tiempo?", dur=[("half", "Medio día"), ("full", "Día completo"), ("other", "Otro")], whol="Elige tu plan", who=[("couples", "&#128145;", "Cita en pareja"), ("families", "&#128106;", "Salida en familia"), ("friends", "&#127881;", "Diversión con amigos"), ("custom", "&#128506;&#65039;", "Diseña tu día")], prev="Foto anterior", next="Foto siguiente", dot="Ver foto {n}", trip_custom="A tu manera", hrsq="¿Cuántas horas?", yourtrip="Tu viaje", cta4="Diseña tu viaje", ch="Tu estimado",
  val_in=["Recogida y regreso al hotel", "Manejo", "Fotos instantáneas"], val_out=["Comida", "Estacionamiento"], h="Empieza con un viaje real", hint="Toca Cita en pareja, Salida en familia o Diversión con amigos para ver viajes reales. Haz uno tal cual, o hazlo tuyo.",
  trip_short="Viaje corto", trip_quest="Aventura", cap0="Toca un viaje y sus fotos caen aquí", stopsl="Paradas", hrsl="horas",
  none="Elige un viaje para ver tu estimado.", cta2="Reservar este viaje", cta3="Cámbialo, hazlo tuyo", note2="Sin pago ahora. Después le mandas tus datos a Marlon.")


def esc(x):
    return x.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


# Oct 23, 2026 (Marlon): every photo has a subtitle (who is in it) and a place; under the photos is a list of the places of the trip (like the review
# under the Team photos). Tapping a place jumps to its photo. NAMES ARE PLACEHOLDERS until Marlon has the real ones: change them here.
# Each entry: (asset file, place key, English subtitle, Spanish subtitle)
PHOTOS = {
    "sunset": [
        ("6ad929f90bb99231ec0dacf2_guest-avenue-26-tacos-01", "tacos", "Grabbing tacos with Alana and Petr", "Comiendo tacos con Alana y Petr"),
        ("6ad92a2e8aa41f8f19ce753e_guest-griffith-park-and-observatory-04", "griffith", "Javier and Jenny taking in the sunset", "Javier y Jenny disfrutando el atardecer"),
        ("6ad929ec3eeaaffdbe379a12_guest-venice-canals-01", "venice", "Sofia and Marco walking the Venice Canals", "Sofia y Marco caminando por los canales de Venice"),
        ("6ad929e61c74efa5d6a35519_guest-santa-monica-01", "santamonica", "Dana and Chris on the Santa Monica Pier", "Dana y Chris en el muelle de Santa Mónica"),
        ("6ad92ca74c83370c9cab47c3_guest-city-hall-01", "downtown", "Lena and Tom posing at City Hall", "Lena y Tom posando en el Ayuntamiento"),
        ("6ad92cb5d1848d20e07d8ea2_guest-echo-park-lake-01", "echopark", "Ana and Ben walk around Echo Park Lake", "Ana y Ben caminan por el lago Echo Park"),
    ],
    "canals": [
        ("6ad929daefa7590f943caa69_guest-getty-center-01", "getty", "Sunset at the Getty Center", "Atardecer en el Getty Center"),
        ("6ad92a2e1ce84651cd2f933d_guest-griffith-park-and-observatory-02", "griffith", "Brother and sister hiking together with their family", "Hermano y hermana de caminata con su familia"),
    ],
    "tacos": [
        ("6ad92c771ce84651cd30cb11_archive-bar-01", "gcm", "Cheers with Alejandro at Grand Central Market", "Salud con Alejandro en Grand Central Market"),
        ("6ad92cb38aa41f8f19cfc336_guest-bulleit-neon-01", "gcm", "The crew under the neon lights at Grand Central Market", "El grupo bajo las luces de neón en Grand Central Market"),
        ("6ad92fddd1848d20e07ee8cd_guest-grand-central-market-01", "gcm", "Lunch break at Grand Central Market", "Pausa para comer en Grand Central Market"),
        ("6ad92a2e137bdbc510c64f01_guest-griffith-park-and-observatory-03", "griffith", "Sunset at the observatory", "Atardecer en el observatorio"),
    ],
    "custom": [
        ("6ad92a1cad4eddc60c1bf588_place-elysian-park-and-angels-point-01", "elysian", "Elysian Park and Angels Point", "Elysian Park y Angels Point"),
        ("6ad929bf12667b254315c683_place-bunker-hill-01", "bunker", "Bunker Hill", "Bunker Hill"),
        ("6ad929b39a56d0d15964851d_place-broadway-theaters-01", "broadway", "The Broadway theaters", "Los teatros de Broadway"),
        ("6ad93001aaac111f9e725c08_place-olvera-street-and-avila-adobe-03", "olvera", "Olvera Street", "Calle Olvera"),
    ],
}
LOCS = {
    "sunset": [("tacos", "Tacos", "Tacos"), ("griffith", "Griffith Observatory", "Observatorio Griffith"), ("venice", "Venice Canals", "Canales de Venice"), ("santamonica", "Santa Monica", "Santa Mónica"),
               ("downtown", "Downtown LA", "Centro de LA"), ("echopark", "Echo Park", "Echo Park")],
    "canals": [("getty", "Getty Center", "Getty Center"), ("griffith", "Griffith Observatory", "Observatorio Griffith")],
    "tacos": [("gcm", "Grand Central Market", "Grand Central Market"), ("griffith", "Griffith Observatory", "Observatorio Griffith")],
    "custom": [("elysian", "Elysian Park", "Elysian Park"), ("bunker", "Bunker Hill", "Bunker Hill"), ("broadway", "Broadway", "Broadway"), ("olvera", "Olvera Street", "Calle Olvera")],
}


def _ph(tid, i):
    return [TRIP_IMG + f + ".webp|50% 50%|" + (en, es)[i] + "|" + k for f, k, en, es in PHOTOS[tid]]


def _lc(tid, i):
    return [{"k": k, "n": (en, es)[i]} for k, en, es in LOCS[tid]]


def data_for(lang):
    i = 0 if lang == "en" else 1
    trips = [{"id": r[0], "tier": r[1], "hours": r[2], "color": r[3], "name": r[4 + i], "stops": r[6 + i], "story": r[13 + i], "who": r[11],
              "photos": _ph(r[0], i), "locs": _lc(r[0], i)} for r in TRIPS]
    trips.append({"id": "custom", "tier": "custom", "hours": 4, "color": "#FFF1B8", "name": CUSTOM[lang][0], "stops": [], "story": CUSTOM[lang][1], "who": "", "photos": _ph("custom", i), "locs": _lc("custom", i)})
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
  .pvb-pill[hidden] { display: none; }
  .pvb-tag { display: inline-block; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.85rem; padding: 2px 12px; border-radius: 99px; background: #FFD43B; border: 2px solid #27302E; }
  .polaroid-stack-area { min-height: 380px; }
  @media (max-width: 700px) { .pvb-cols { grid-template-columns: 1fr; } .polaroid-stack-area { min-height: 320px; } }
</style>
"""

LEFT_JS = r"""<script>
(function () {
  var D = JSON.parse(document.getElementById("pvb-data").textContent), t = D.t, TR = {};
  D.trips.forEach(function (r) { TR[r.id] = r; });
  var story = document.getElementById("pvb-story"), cur = null;
  var car = document.getElementById("pvc");
  /* Oct 23, 2026: photos use the shared slider (mw-slider.js); this page only gives it the slides and listens for the current one */
  /* Oct 23, 2026 (Marlon): a real review under the photos, one per group. All five-star reviews from the review sheet; swap in private-tour ones when they arrive. */
  var QUOTES = {
    couples: ["He was so friendly and patient, my husband loved the little game\u2026", "Dilek K. \u00B7 FreeTour.com"],
    families: ["It has been a wonderful tour\u2026 my family and I have enjoyed a lot.", "Bel\u00E9n L. \u00B7 FreeTour.com"],
    friends: ["Marlon was the best walking tour I have been on (I've done 10+ total). He was extremely knowledgeable about the city of LA, and was very fun and flexible.", "Nayen V. \u00B7 Google"],
    custom: ["Marlon was flexible, I had to reschedule and he was very open to it. He is very knowledgeable, he shared so much and went over time.", "Beatrice \u00B7 Google"]
  };
  function setQuote(r) {
    var q = QUOTES[r.id === "custom" ? "custom" : r.who] || QUOTES.custom, fg = document.getElementById("pvb-q");
    if (!fg) return;
    fg.querySelector("blockquote").textContent = "\u201C" + q[0] + "\u201D"; fg.querySelector(".pvb-by").textContent = q[1];
  }
  function lockQ() { if (window.MWS) window.MWS.lockQuote(document.querySelector("#pvb-q blockquote"), Object.keys(QUOTES).map(function (k) { return QUOTES[k][0]; })); }
  if (window.MWS) lockQ(); else window.addEventListener("mws:ready", lockQ);
  function items(r) {
    return r.photos.map(function (p) { var sp = p.split("|"); return { src: sp[0], pos: sp[1], cap: sp[2] || "", alt: sp[2] || r.name, key: sp[3] || "", kind: "photo" }; });
  }
  function load(r) {
    if (!car.mws) { if (window.MWS) window.MWS.init(car); else { window.addEventListener("mws:ready", function () { if (cur) load(TR[cur]); }, { once: true }); return; } }
    if (car.mws) car.mws.load(items(r).length ? items(r) : [{ kind: "card", color: r.color, cap: r.name }]); }
  document.addEventListener("mws:change", function (e) {
    if (e.detail.root !== car) return;
    var lk = e.detail.slide ? e.detail.slide.getAttribute("data-key") || "" : "";
    /* Oct 23, 2026 (Marlon): the "Places on this trip" list lives in the estimate card (under Pick your plan); it hears the current place here */
    window.MWPV = window.MWPV || {}; window.MWPV.loc = lk;
    try { window.dispatchEvent(new CustomEvent("mwloc", { detail: lk })); } catch (x) {}
  });
  function state() {
    var r = cur && TR[cur]; if (!r) return { ids: [], names: [], lang: D.lang, t: t };
    return { ids: [r.id], names: [r.name], locs: r.locs, stops: r.stops, lang: D.lang, hours: r.hours, lo: r.hours, hi: r.hours, range: String(r.hours), tier: r.tier, trip: r.id, custom: r.id === "custom", over: false, t: t };
  }
  function publish() {
    window.MWPV = window.MWPV || {}; window.MWPV.state = state();
    try { window.dispatchEvent(new CustomEvent("mwpv", { detail: window.MWPV.state })); } catch (e) {}
  }
  function pick(id) {
    cur = id; var r = TR[id];
    load(r); setQuote(r);
    story.innerHTML = "";
    story.hidden = true; /* Oct 23, 2026 (Marlon): no text under the photos for Design Your Day; it moves to the main page */
    publish();
  }
  window.MWPV = window.MWPV || {};
  window.MWPV.setHours = function (h) { var r = TR[cur]; if (r && r.id === "custom") { r.hours = h; publish(); } };
  /* Oct 21, 2026 (Marlon): trips are listed per group (Couples, Families, Friends); the estimate card sets the group through window.MWPV.who */
  function applyWho(w, force) {
    var id = null;
    if (w === "custom") id = "custom"; else D.trips.forEach(function (r) { if (!id && r.who === w) id = r.id; });
    if (force || !cur) pick(id || D.on);
  }
  window.addEventListener("mwwho", function (e) { applyWho(e.detail, true); });
  /* a tap on a place chip in the estimate card jumps to that place's first photo */
  window.addEventListener("mwlocgo", function (e) { var L = TR[cur].photos; for (var k = 0; k < L.length; k++) { if (L[k].split("|")[3] === e.detail) { if (car.mws) car.mws.set(k); break; } } });
  /* Oct 23, 2026 (Marlon): on wide screens the estimate card sits on the left and the trip photos on the right (stacked order on phones is unchanged) */
  function swapCols() {
    var a = document.getElementById("private-tours"), b = document.querySelector(".mw-form-card .pcq"); if (!a || !b) return false;
    var card = b.closest(".mw-form-card"), anc = a.parentElement;
    while (anc && !anc.contains(card)) anc = anc.parentElement;
    if (!anc) return false;
    var ca = a, cb = card;
    while (ca.parentElement !== anc) ca = ca.parentElement;
    while (cb.parentElement !== anc) cb = cb.parentElement;
    if (ca === cb) return false;
    var dsp = getComputedStyle(anc).display; if (dsp.indexOf("flex") < 0 && dsp.indexOf("grid") < 0) return true; // float layout: leave as is
    anc.classList.add("mwp-swap"); ca.classList.add("mwp-swap-l"); cb.classList.add("mwp-swap-r");
    return true;
  }
  var tries = 0; (function waitSwap() { if (!swapCols() && tries++ < 20) setTimeout(waitSwap, 400); })();
  applyWho((window.MWPV && window.MWPV.who) || "couples", true);
})();
</script>
"""


def left_html(lang):
    t = T[lang]; data = data_for(lang)
    js_data = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    return f"""<!-- ==============================================================================
     MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: LA, YOUR WAY - PREVIOUS TRIPS (LEFT COLUMN). Built by page-embeds/build_home_private.py
     Oct 20, 2026 (Marlon): pick a past custom trip (or "Customize my own"). Its photos are a carousel (arrows, dots, swipe), same idea as the hero.
     The estimate lives in home-private-calc.html (right column) and reads the pick through window.MWPV.
     ============================================================================== -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@main/mw-slider.css?v=1">
<script src="https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@main/mw-slider.js?v=1" defer></script>
<div class="mw-offer pvb" id="private-tours">
  <div class="mws" id="pvc" data-mws style="--mws-w: 420px; --mws-ar: 1 / 1" data-prev="{t['prev']}" data-next="{t['next']}" data-dot="{t['dot']}" aria-label="{esc(t['h'])}"><div class="mws-stage"></div></div>
  <figure class="pvb-q" id="pvb-q"><blockquote></blockquote><figcaption><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span> <span class="pvb-by"></span></figcaption></figure>
  <div class="pvb-story" id="pvb-story" hidden></div>
</div>
<script type="application/json" id="pvb-data">{js_data}</script>
""" + LEFT_CSS + CAR_CSS + LEFT_JS


CAR_CSS = """<style>
  /* Oct 20, 2026 (Marlon): the trip photos are a carousel, like the hero */
  .polaroid-stack-area { display: none; }
  @media (min-width: 992px) { .mwp-swap > .mwp-swap-l { order: 2; } .mwp-swap > .mwp-swap-r { order: 1; } }
  /* Oct 20, 2026 (Marlon): shorter left column */
  .pvb .pvb-pill { font-size: 0.88rem; padding: 5px 12px; min-height: 34px; border-width: 1.5px; }
  .pvb .pvb-pills { gap: 6px; margin-bottom: 10px; }
  .pvb .pvb-hint { margin-bottom: 10px; }
  .pvb-q { margin: 14px auto 0; max-width: 420px; padding-left: 14px; border-left: 4px solid #2E9E57; }
  .pvb-q blockquote { margin: 0; font-size: 1rem; line-height: 1.5; color: #3B4440; min-height: 4.5em; }
  .pvb-q figcaption { margin-top: 4px; font-size: 0.85rem; color: #5B6663; }
  .pvb-q figcaption span { color: #E89B00; letter-spacing: 1px; margin-right: 4px; }
  .pvb-q figcaption .pvb-by { color: inherit; letter-spacing: normal; margin-right: 0; }
  /* Oct 23, 2026 (Marlon): on phones the quote goes above the photos so the photos sit right above the plan buttons that control them */
  @media (max-width: 991px) { .pvb { display: flex; flex-direction: column; } .pvb-q { order: -1; margin: 0 auto 16px; } }
  .pvb-story { margin-top: 8px; font-size: 0.92rem; line-height: 1.4; }
  .pvb-story p { margin-top: 4px; }
</style>
"""

CALC_CSS = """<style>
  /* the native "Private Tour Inquiry" form stays in Webflow (and on the Private page) but is hidden on Home: the calculator replaces it */
  .mw-form-card:has(.pcq) > *:not(.w-embed) { display: none !important; }
  .mw-form-card:has(.pcq) { margin-top: 0; padding: 20px 22px 18px; box-shadow: 6px 6px 0 #27302E; }
  .pcq { font-family: "Nunito", system-ui, sans-serif; color: #27302E; position: relative; }
  .pcq-st, .pcq-st2 { position: absolute; inset: 0; mix-blend-mode: multiply; opacity: 0.92; }
  .pcq-sum { display: flex; justify-content: center; gap: 10px; margin: 6px 0 14px; }
  .pcq-slot { position: relative; width: 92px; height: 92px; flex: none; }
  @media (max-width: 420px) { .pcq-slot { width: 84px; height: 84px; } .pcq-sum { gap: 6px; } }
  .pcq-st2[hidden] { display: none; }
  .pcq-st.pop, .pcq-st2.pop { animation: pcqpop 0.35s cubic-bezier(.2, 1.4, .4, 1); }
  .pcq-st2 svg { width: 100%; height: 100%; transform: rotate(var(--r)); overflow: visible; }
  .pcq-st[hidden] { display: none; }
  .pcq-st svg { width: 100%; height: 100%; transform: rotate(var(--r)); overflow: visible; }
  .pcq-st.pop { animation: pcqpop 0.35s cubic-bezier(.2, 1.4, .4, 1); }
  @keyframes pcqpop { from { opacity: 0; transform: scale(1.5) rotate(-12deg); } to { opacity: 0.92; transform: none; } }
  @media (prefers-reduced-motion: reduce) { .pcq-st.pop { animation: none; } }
  .pcq-wrow .pcq-rowl { display: block; width: 100%; margin-bottom: 2px; }
  .pcq-title { font-family: "Lilita One", sans-serif; font-weight: 400; font-size: 1.6rem; line-height: 1.1; margin: 0 0 4px; color: #27302E; }
  .pcq-trip { margin: 0 0 12px; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1.1rem; line-height: 1.25; color: #27302E; }
  .pcq-trip span { display: inline-block; margin-right: 6px; padding: 1px 10px; border-radius: 99px; background: #FFD43B; border: 2px solid #27302E; font-size: 0.8rem; }
  .pcq-none { margin: 0 0 12px; font-family: "Fredoka", sans-serif; font-weight: 500; font-size: 1.05rem; color: #3B4440; }
  .pcq-row { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 8px; margin: 0 0 10px; }
  .pcq-rowl { font-weight: 700; margin-right: 4px; }
  .pcq-g, .pcq-h { font: inherit; font-family: "Fredoka", sans-serif; font-weight: 600; min-width: 38px; height: 38px; padding: 0 6px; border-radius: 99px; cursor: pointer; background: #FFFDF8; color: #27302E; border: 2px solid #D9CFBC; }
  .pcq-w { font: inherit; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.9rem; height: 38px; padding: 0 12px; border-radius: 99px; cursor: pointer; background: #FFFDF8; color: #27302E; border: 2px solid #D9CFBC; }
  .pcq-w:focus-visible { outline: 3px solid #2890B6; outline-offset: 2px; }
  .pcq-d { font: inherit; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.9rem; height: 38px; padding: 0 14px; border-radius: 99px; cursor: pointer; background: #FFFDF8; color: #27302E; border: 2px solid #D9CFBC; }
  .pcq-d:focus-visible { outline: 3px solid #2890B6; outline-offset: 2px; }
  .pcq-g[aria-pressed="true"], .pcq-h[aria-pressed="true"], .pcq-w[aria-pressed="true"], .pcq-d[aria-pressed="true"] { background: #FFD43B; border-color: #27302E; }
  .pcq-g:focus-visible, .pcq-h:focus-visible { outline: 3px solid #2890B6; outline-offset: 2px; }
  .pcq-out { margin: 4px 0 6px; }
  /* Oct 23, 2026 (Marlon): "Places on this trip" sits in the card, under Pick your plan; the highlighted place follows the photo */
  .pcq-locwrap { margin: 14px 0 0; padding-left: 14px; border-left: 4px solid #2E9E57; }
  .pcq-locwrap[hidden] { display: none; }
  .pcq-locl { margin: 0 0 8px; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.85rem; color: #5B6663; }
  .pcq-locs { display: flex; flex-wrap: wrap; gap: 6px 8px; }
  .pcq-loc { font: inherit; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.88rem; height: 34px; padding: 0 12px; border-radius: 99px; cursor: pointer; background: #FFFDF8; color: #27302E; border: 2px solid #D9CFBC; }
  .pcq-loc[aria-pressed="true"] { background: #FFD43B; border-color: #27302E; }
  .pcq-loc:focus-visible { outline: 3px solid #2890B6; outline-offset: 2px; }
  /* Oct 23, 2026 (Marlon): the price, the facts and the button live in their own tinted panel, split from the choices by a dashed line */
  .pcq-res { margin: 18px -22px -18px; padding: 18px 22px 18px; background: #D5EAF6; border-top: 2px dashed rgba(39, 48, 46, 0.3); border-radius: 0 0 14px 14px; }
  .pcq-res .pcq-out { margin: 0 0 14px; }
  .pcq-res .pcq-sub { margin: 10px 0 0; font-family: "Nunito", system-ui, sans-serif; font-weight: 400; font-size: 0.92rem; line-height: 1.4; color: #4D5551; }
  .pcq-res .pcq-val { margin: 14px 0 0; }
  .pcq-res .pcq-val li { background: #fff; }
  .pcq-res .pcq-val li.no { background: #FFE4EA; }
  .pcq-price { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 10px; font-family: "Lilita One", sans-serif; font-size: clamp(2.2rem, 5vw, 2.9rem); line-height: 1; font-variant-numeric: tabular-nums; }
  .pcq-price small { font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1.1rem; color: #27302E; }
  .pcq-sub { margin: 6px 0 0; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1.2rem; color: #27302E; }
  .pcq-fit { margin: 4px 0 0; font-size: 0.95rem; line-height: 1.45; color: #27302E; }
  .pcq-fit s { color: #5B6663; }
  .pcq-badge { display: inline-block; padding: 2px 10px; border-radius: 99px; background: #DFF5E3; color: #1E6B3A; font-weight: 700; font-size: 0.85rem; }
  .pcq-val { list-style: none; margin: 8px 0 6px; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
  .pcq-val li { font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 0.88rem; line-height: 1.2; color: #1E6B3A; background: #DFF5E3; border: 2px solid #1E6B3A; border-radius: 999px; padding: 4px 10px; }
  .pcq-val li::before { content: none; }
  .pcq-val li.no { color: #A12B4A; background: #FFE4EA; border: 2px solid #E58AA3; }
  .pcq-val li.no::before { content: none; }
  .pcq-incl { margin: 6px 0 12px; font-size: 0.88rem; color: #4D5551; }
  .pcq-cta { display: block; width: 100%; text-align: center; font-family: "Lilita One", sans-serif; font-size: 1.3rem; letter-spacing: 0.01em; color: #27302E; background: #FFD43B; border: 2.5px solid #27302E; border-radius: 999px; padding: 11px 24px; min-height: 48px; box-shadow: 4px 4px 0 #27302E; cursor: pointer; transition: transform 0.18s ease-out, box-shadow 0.18s ease-out; }
  .pcq-cta:hover:not([aria-disabled="true"]) { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #27302E; }
  .pcq-cta:active:not([aria-disabled="true"]) { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #27302E; }
  .pcq-cta:focus-visible { outline: 3px solid #2890B6; outline-offset: 4px; }
  .pcq-cta[aria-disabled="true"] { background: #E9E2D2; color: #6B726F; box-shadow: none; cursor: not-allowed; }
  .pcq-alt { display: block; width: 100%; margin-top: 6px; text-align: center; font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1rem; color: #27302E; background: transparent; border: 0; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; min-height: 40px; }
  .pcq-alt:focus-visible { outline: 3px solid #2890B6; outline-offset: 2px; }
  .pcq-alt[hidden], .pcq-row[hidden] { display: none; }
  .pcq-note { margin: 4px 0 0; text-align: center; font-size: 0.85rem; color: #5B6663; }
  @media (prefers-reduced-motion: reduce) { .pcq-cta { transition: none; } }
</style>
"""

CALC_JS = r"""<script>
(function () {
  var root = document.getElementById("pcq"); if (!root) return;
  var t = JSON.parse(document.getElementById("pcq-t").textContent);
  var none = root.querySelector(".pcq-none"), out = root.querySelector(".pcq-out"), wrow = root.querySelector(".pcq-wrow");
  var price = root.querySelector(".pcq-price"), sub = root.querySelector(".pcq-sub"), fit = root.querySelector(".pcq-fit"), cta = root.querySelector(".pcq-cta"), alt = root.querySelector(".pcq-alt"), vals = root.querySelector(".pcq-val");
  var st = null, n = 2, who = "couples", oh = 4, last = null, locwrap = root.querySelector(".pcq-locwrap"), locsEl = document.getElementById("pcq-locs"), lastLoc = null;
  /* Oct 23, 2026 (Marlon): no more Half day / Full day / Other. An example trip uses its own hours; only "Customize my own" asks for hours. */
  function hrs() { return oh; }
  function press(sel, attr, val) { [].slice.call(root.querySelectorAll(sel)).forEach(function (o) { o.setAttribute("aria-pressed", o.dataset[attr] === String(val) ? "true" : "false"); }); }
  window.MWPV = window.MWPV || {}; window.MWPV.who = who;
  function priceAt(g, h) {
    var T = t.prices[g], x = Math.min(12, Math.max(2, h)), i = Math.min(4, Math.floor((x - 2) / 2)), f = (x - 2 - i * 2) / 2;
    return Math.round((T[i] + (T[i + 1] - T[i]) * f) / 10) * 10 - 1;
  }
  function quote(s) {
    var h = Math.min(12, hrs()), total = priceAt(n, h), list = Math.round(t.listRate * n * h);
    /* Oct 22, 2026 (Marlon): hours and people are the two multipliers; the range runs from the hours picked to one more hour (tours can run long) */
    var hi = priceAt(n, Math.min(12, h + 1)); if (hi < total) hi = total;
    return { total: total, hi: hi, each: Math.round(total / n), eachHi: Math.round(hi / n), list: list, pct: Math.round((1 - total / list) * 100) };
  }
  [].slice.call(root.querySelectorAll(".pcq-g")).forEach(function (g) {
    g.addEventListener("click", function () {
      n = +g.dataset.n;
      [].slice.call(root.querySelectorAll(".pcq-g")).forEach(function (o) { o.setAttribute("aria-pressed", o === g ? "true" : "false"); });
      if (st) render(st);
    });
  });
  [].slice.call(root.querySelectorAll(".pcq-w")).forEach(function (b) {
    b.addEventListener("click", function () {
      who = b.dataset.w; window.MWPV = window.MWPV || {}; window.MWPV.who = who; press(".pcq-w", "w", who);
      [].slice.call(root.querySelectorAll(".pcq-st")).forEach(function (el) { var on = el.getAttribute("data-w") === who; el.hidden = !on; el.classList.remove("pop"); if (on) { void el.offsetWidth; el.classList.add("pop"); } });
      try { window.dispatchEvent(new CustomEvent("mwwho", { detail: who })); } catch (e) {}
    });
  });
  [].slice.call(root.querySelectorAll(".pcq-h")).forEach(function (b) {
    b.addEventListener("click", function () { oh = +b.dataset.h; press(".pcq-h", "h", oh); if (st) render(st); });
  });
  var lastStamp = null;
  function markLoc(k) {
    [].slice.call(locsEl.children).forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.k === k ? "true" : "false"); });
    var key = k || (locsEl.children[0] && locsEl.children[0].dataset.k) || "";
    [].slice.call(root.querySelectorAll(".pcq-st2[data-l]")).forEach(function (el) { var on = el.getAttribute("data-l") === key; el.hidden = !on; if (on && key !== lastStamp) { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); } });
    lastStamp = key;
  }
  function renderLocs(s, has) {
    var list = has && s.locs ? s.locs : []; locwrap.hidden = !list.length;
    if (s.trip === lastLoc && locsEl.children.length === list.length) { markLoc(window.MWPV && window.MWPV.loc); return; }
    lastLoc = s.trip; locsEl.innerHTML = "";
    list.forEach(function (l) {
      var b = document.createElement("button"); b.type = "button"; b.className = "pcq-loc"; b.dataset.k = l.k; b.textContent = l.n; b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () { try { window.dispatchEvent(new CustomEvent("mwlocgo", { detail: l.k })); } catch (e) {} });
      locsEl.appendChild(b);
    });
    markLoc(window.MWPV && window.MWPV.loc);
  }
  window.addEventListener("mwloc", function (e) { markLoc(e.detail); });
  function render(s) {
    st = s; if (!s) return;
    var has = s.ids.length > 0;
    renderLocs(s, has);
    if (has && s.trip !== last) { last = s.trip; if (!s.custom && s.hours) { oh = s.hours; press(".pcq-h", "h", oh); } }
    none.hidden = has; out.hidden = !has; wrow.hidden = !has;
    if (has) {
      /* Oct 23, 2026 (Marlon): the card gives one rule-of-thumb number; the real estimate (people, hours, discounts) is on the booking page */
      price.innerHTML = ""; price.appendChild(document.createTextNode("$" + t.pphLo + " " + t.pto + " $" + t.pphHi));
      var sm = document.createElement("small"); sm.textContent = t.perhr; price.appendChild(sm);
      sub.textContent = t.disc; fit.innerHTML = "";
    }
    cta.setAttribute("aria-disabled", has ? "false" : "true");
    cta.textContent = has ? t.cta4 : t.wait; alt.hidden = true;
  }
  window.addEventListener("mwpv", function (e) { render(e.detail); });
  if (window.MWPV && window.MWPV.state) render(window.MWPV.state);
  else render({ ids: [], names: [] });
  function go(custom) {
    if (!st || !st.ids.length) return;
    var qt = quote(st); custom = custom || st.custom;
    var plan = { v: 3, lang: st.lang, ids: st.ids, names: st.names, hours: String(hrs()), n: n, price: qt.total, priceLo: qt.total, priceHi: qt.hi, trip: st.trip, custom: !!custom, saved: new Date().toISOString() };
    try { localStorage.setItem("mwla-private-plan", JSON.stringify(plan)); } catch (e) {}
    var q = "stops=" + encodeURIComponent(st.ids.join(",")) + "&n=" + n + "&est=" + qt.total + "&lo=" + qt.total + "&hi=" + qt.hi + "&h=" + hrs() + "&lang=" + st.lang + (who && who !== "custom" ? "&who=" + who : "") + (custom ? "&custom=1" : "");
    window.location.href = "/private-tour?" + q;
  }
  cta.addEventListener("click", function () { go(st && st.custom); });
  alt.addEventListener("click", function () { go(true); });
})();
</script>
"""

ERN = C + "6a87ce84d9af8f7c9bf12030_Tour%20Guide.avif"


# Oct 23, 2026 (Marlon): an ink stamp in the corner of the estimate card, one per plan. key: (icon, ink, rotation, seed, EN top, ES top)
STAMP = {
    "couples": ("sunset", "#D6479B", -7, 6, "DATE NIGHT", "CITA EN PAREJA"),
    "families": ("trio", "#1B6688", 7, 9, "FAMILY OUTING", "SALIDA EN FAMILIA"),
    "friends": ("taco", "#E89B00", -8, 3, "FUN WITH FRIENDS", "CON AMIGOS"),
    "custom": ("sun", "#2E9E57", 7, 4, "DESIGN YOUR DAY", "DISEÑA TU DÍA"),
}


# Oct 23, 2026 (Marlon): second stamp = the place picked in "Places on this trip". key: (icon, ink, rotation, seed, EN top, ES top)
LOCST = {
    "tacos": ("taco", "#E89B00", -6, 3, "TACOS", "TACOS"),
    "griffith": ("obs", "#C2352A", 7, 5, "GRIFFITH OBSERVATORY", "OBSERVATORIO GRIFFITH"),
    "venice": ("canal", "#2890B6", -8, 7, "VENICE CANALS", "CANALES DE VENICE"),
    "santamonica": ("pier", "#B8326E", 6, 9, "SANTA MONICA", "SANTA M&Oacute;NICA"),
    "downtown": ("skyline", "#1B6688", -7, 11, "DOWNTOWN LA", "CENTRO DE LA"),
    "echopark": ("swan", "#2E9E57", 8, 13, "ECHO PARK", "ECHO PARK"),
    "getty": ("sun", "#E27B1A", -6, 15, "GETTY CENTER", "GETTY CENTER"),
    "gcm": ("gcm", "#E2662A", 7, 4, "GRAND CENTRAL MARKET", "GRAND CENTRAL MARKET"),
    "elysian": ("palm", "#2E9E57", -8, 6, "ELYSIAN PARK", "ELYSIAN PARK"),
    "bunker": ("wdch", "#2B4F9E", 6, 8, "BUNKER HILL", "BUNKER HILL"),
    "broadway": ("bradbury", "#C2352A", -7, 10, "BROADWAY", "BROADWAY"),
    "olvera": ("kiosko", "#D6479B", 8, 12, "OLVERA STREET", "CALLE OLVERA"),
}


def calc_html(lang):
    t = T[lang]
    pp = [PRICES[g][k] / (int(g) * 2 * (k + 1)) for g in PRICES for k in range(6)]  # price per person per hour at every group size and length
    keys = ["locl", "hrsl", "pto", "perhr", "disc", "cta2", "cta3", "cta4", "wait", "each", "people", "total", "listp", "save", "yourtrip"]
    tj = json.dumps({**{k: t[k] for k in keys}, "prices": PRICES, "listRate": LIST_RATE, "pphLo": int(round(min(pp) / 5.0) * 5), "pphHi": int(round(max(pp) / 5.0) * 5)}, ensure_ascii=False)
    EM_IN = ["&#127976;", "&#128663;", "&#128248;"]; EM_OUT = ["&#127869;&#65039;", "&#127359;"]  # Oct 23, 2026: emoji instead of check and X marks
    vin = "".join(f"<li>{EM_IN[k]} {esc(x)}</li>" for k, x in enumerate(t["val_in"])) + "".join(f'<li class="no">{EM_OUT[k]} {esc(x)}</li>' for k, x in enumerate(t["val_out"]))
    wb = "".join(f'<button type="button" class="pcq-w" data-w="{k}" aria-pressed="{"true" if k == "couples" else "false"}"><span aria-hidden="true">{e}</span> {l}</button>' for k, e, l in t["who"])
    hb = "".join(f'<button type="button" class="pcq-h" data-h="{h}" aria-pressed="{"true" if h == 4 else "false"}">{h}</button>' for h in (2, 4, 6, 8, 10, 12))
    sts = "".join(f'<span class="pcq-st" data-w="{k}"{"" if k == "couples" else " hidden"}>' + stamps.stamp("pcs" + k[:3], (v[5] if lang == "es" else v[4]), "LA A TU MANERA" if lang == "es" else "LA, YOUR WAY", v[0], "", v[1], v[2], v[3]) + "</span>" for k, v in STAMP.items())
    es = lang == "es"
    LA = "LOS &Aacute;NGELES" if es else "LOS ANGELES"
    locs = "".join(f'<span class="pcq-st2" data-l="{k}" hidden>' + stamps.stamp("pcl" + k[:4], (v[5] if es else v[4]), LA, v[0], "", v[1], v[2], v[3]) + "</span>" for k, v in LOCST.items())
    mine = stamps.stamp("pcsx", "DISE&Ntilde;A TU VIAJE" if es else "DESIGN YOUR TRIP", "HAZLO TUYO" if es else "MAKE IT YOURS", "pin", "", "#6A4C93", -6, 17)
    sum_row = f'<div class="pcq-sum" aria-hidden="true"><div class="pcq-slot">{sts}</div><div class="pcq-slot">{locs}</div><div class="pcq-slot"><span class="pcq-st2">{mine}</span></div></div>'
    return f"""<!-- MARLONWALKSLA - HOME{' ES' if lang == 'es' else ''}: ESTIMATE CALCULATOR (right column, inside the Webflow .mw-form-card). Built by page-embeds/build_home_private.py.
     Oct 20, 2026 (Marlon): shows the trip you picked, then how many people, then the price (the biggest number is the full price). No Ernesto. Reads the pick from home-private.html through window.MWPV. -->
<div class="pcq" id="pcq">
  <h3 class="pcq-title">{t["ch"]}</h3>
  <p class="pcq-none" hidden>{t["none"]}</p>
  <div class="pcq-row pcq-wrow" role="group" aria-label="{t["whol"]}" hidden><span class="pcq-rowl">{t["whol"]}</span>{wb}</div>
  <div class="pcq-locwrap" hidden><p class="pcq-locl">{t["locl"]}</p><div class="pcq-locs" id="pcq-locs" role="group" aria-label="{t["locl"]}"></div></div>
  <div class="pcq-res">
  <div class="pcq-out" aria-live="polite" hidden>
    <div class="pcq-price"></div>
    <p class="pcq-sub"></p>
    <p class="pcq-fit"></p>
    {sum_row}
  </div>
  <button type="button" class="pcq-cta" aria-disabled="true">{t["wait"]}</button>
  <button type="button" class="pcq-alt" hidden>{t["cta3"]}</button>
  </div>
</div>
<script type="application/json" id="pcq-t">{tj}</script>
""" + CALC_CSS + CALC_JS


if __name__ == "__main__":
    for lang, suf in (("en", ""), ("es", "-es")):
        open(f"home-private{suf}.html", "w", encoding="utf-8").write(left_html(lang))
        open(f"home-private-calc{suf}.html", "w", encoding="utf-8").write(calc_html(lang))
        print("wrote", lang)
