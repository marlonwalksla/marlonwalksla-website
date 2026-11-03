# Builds passports.json (root, on main): every passport with the full recipe for each stamp.
# Same fields as the Webflow CMS collections "Passports" and "Passport Stamps", so the page can read the CMS later without changes.
# Run: python3 tools/build_passports_json.py
import json, os, re, sys
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, os.path.join(root, "page-embeds"))
import html
g = json.load(open(os.path.join(root, "spots.geojson"), encoding="utf-8"))
mapid = {}
for f in g["features"]:
    s = re.sub(r"[^a-z0-9]+", "-", f["properties"]["Slug"].lower())
    mapid[re.sub(r"-[0-9a-f]{5}$", "", s)] = s          # old key (no code) -> real map pin id
mapid["la-city-hall"] = "la-city-hall-observation-deck-c13cc"
U = lambda s: html.unescape(s)
def plain(t):
    t = re.sub(r"</li>", " ", t); t = re.sub(r"<[^>]+>", "", t)
    return re.sub(r"\s+", " ", html.unescape(t)).strip()
stops = json.load(open(os.path.join(root, "page-embeds/free-passport-stops.json"), encoding="utf-8"))

# Downtown Classic (same 9 stamps as the free tour passport page)
D = [("walt-disney-concert-hall","WALT DISNEY CONCERT HALL","SALA WALT DISNEY","wdch","2003","#2B4F9E",-7,8,"Walt Disney Concert Hall","Sala de Conciertos Walt Disney"),
("the-broad","THE BROAD","THE BROAD","broad","2015","#C2352A",6,3,"The Broad","The Broad"),
("angels-flight","ANGELS FLIGHT","ANGELS FLIGHT","angels","1901","#2890B6",-4,12,"Angels Flight","Angels Flight"),
("grand-central-market","GRAND CENTRAL MARKET","MERCADO GRAND CENTRAL","stall","1917","#E2662A",5,4,"Grand Central Market","Mercado Grand Central"),
("bradbury-building","BRADBURY BUILDING","EDIFICIO BRADBURY","bradbury","1893","#1B8A8F",8,14,"Bradbury Building","Edificio Bradbury"),
("evolution-of-la-mural","THE EVOLUTION OF LA","EVOLUCI&Oacute;N DE LA","mural","","#E89B00",-6,9,"Evolution of LA mural","Mural Evolución de LA"),
("la-city-hall","LA CITY HALL","AYUNTAMIENTO DE LA","city_tower","1928","#2E9E57",4,6,"LA City Hall","Ayuntamiento de LA"),
("hall-of-justice","HALL OF JUSTICE","PALACIO DE JUSTICIA","justice","1925","#B8326E",-5,11,"Hall of Justice","Palacio de Justicia"),
("olvera-street","PLACITA OLVERA","PLACITA OLVERA","papel","1781","#7A3FA0",-3,17,"Olvera Street and El Pueblo","Calle Olvera y El Pueblo")]
OLD = {"angels-flight":"angels-flight-railway","olvera-street":"olvera-street-and-el-pueblo","walt-disney-concert-hall":"walt-disney-concert-hall","the-broad":"the-broad","grand-central-market":"grand-central-market","bradbury-building":"bradbury-building","la-city-hall":"la-city-hall"}
dstamps = []
for i, d in enumerate(D):
    st = stops[i] if i < len(stops) else {}
    en = (st.get("en") or [[ "", "" ]])[0]; es = (st.get("es") or [[ "", "" ]])[0]
    old = OLD.get(d[0])
    dstamps.append({"id": d[0], "order": i + 1, "name": {"en": d[8], "es": d[9]},
        "top": {"en": U(d[1]), "es": U(d[2])}, "bottom": {"en": "LOS ANGELES", "es": "LOS ÁNGELES"},
        "icon": d[3], "year": d[4], "ink": d[5], "rot": d[6], "seed": d[7],
        "mapId": mapid.get(old) if old else None, "legacyKey": old,
        "tip": {"en": plain(": ".join(x for x in en if x)), "es": plain(": ".join(x for x in es if x))}, "mapLink": st.get("map")})


# Bonus stamps (Nov 3, 2026): small extras that belong to a place. They sit under their place, do not count toward the passport total,
# and tell a visitor what to look forward to there. (id, parent, name EN, name ES, top EN, top ES, icon, map pin or None, tip EN, tip ES, challenge EN, challenge ES, cost)
BONUS = [
 ("wdch-garden", "walt-disney-concert-hall", "Explore the garden", "Explora el jard\u00edn", "THE GARDEN", "EL JARD\u00cdN", "flower", None,
  "The garden is behind the hall. Find the fountain covered in broken blue and white tiles.", "El jard\u00edn est\u00e1 detr\u00e1s de la sala. Busca la fuente cubierta de pedazos de azulejo azul y blanco.",
  "Find the rose fountain.", "Encuentra la fuente de la rosa.", "Free"),
 ("wdch-inside", "walt-disney-concert-hall", "Go inside", "Entra a la sala", "INSIDE THE HALL", "DENTRO DE LA SALA", "door", None,
  "Step inside when it is open and look up at the wood ceiling. Check the hall's website for hours and tours.", "Entra cuando est\u00e9 abierto y mira hacia arriba, al techo de madera. Revisa el sitio de la sala para ver horarios y tours.",
  "Look up at the wood ceiling.", "Mira hacia arriba, al techo de madera.", "Free"),
 ("broad-honeycomb", "the-broad", "Honeycomb wall", "Pared de panal", "HONEYCOMB WALL", "PARED DE PANAL", "camera", None,
  "The outside wall looks like a honeycomb. Look at it from across the street.", "La pared de afuera parece un panal. M\u00edrala desde el otro lado de la calle.",
  "Take a photo of the honeycomb wall.", "Toma una foto de la pared de panal.", "Free"),
 ("angels-ride", "angels-flight", "Ride Angels Flight", "S\u00fabete a Angels Flight", "RIDE IT", "S\u00daBETE", "angels", None,
  "The little railway climbs Bunker Hill. The fare is $1.50, or 75 cents with TAP.", "El funicular sube Bunker Hill. Cuesta $1.50, o 75 centavos con TAP.",
  "Ride it once.", "S\u00fabete una vez.", "$"),
 ("gcm-sign", "grand-central-market", "Find the neon sign", "Busca el letrero de ne\u00f3n", "NEON SIGN", "LETRERO DE NE\u00d3N", "camera", None,
  "Look for the big neon sign at the entrance.", "Busca el letrero grande de ne\u00f3n en la entrada.",
  "Take a photo under the sign.", "Toma una foto debajo del letrero.", "Free"),
 ("bradbury-lobby", "bradbury-building", "Step into the lobby", "Entra al lobby", "THE LOBBY", "EL LOBBY", "door", None,
  "The lobby is open to visitors in the daytime. Look up at the glass roof and the iron stairs.", "El lobby est\u00e1 abierto a visitantes de d\u00eda. Mira hacia arriba, al techo de vidrio y las escaleras de hierro.",
  "Look up at the glass roof.", "Mira hacia arriba, al techo de vidrio.", "Free"),
 ("cityhall-deck", "la-city-hall", "Go up to the deck", "Sube al mirador", "OBSERVATION DECK", "MIRADOR", "skyline", None,
  "The observation deck is free when it is open. Check the city's website for days and hours.", "El mirador es gratis cuando est\u00e1 abierto. Revisa el sitio de la ciudad para ver d\u00edas y horarios.",
  "Find Walt Disney Concert Hall from above.", "Encuentra la Sala Walt Disney desde arriba.", "Free"),
 ("olvera-avila", "olvera-street", "Visit the Avila Adobe", "Visita la Avila Adobe", "AVILA ADOBE", "AVILA ADOBE", "mission", None,
  "The oldest house in LA, built in 1818. It is free to walk in when it is open.", "La casa m\u00e1s antigua de LA, construida en 1818. Es gratis entrar cuando est\u00e1 abierta.",
  "Walk through the old rooms.", "Camina por los cuartos antiguos.", "Free"),
 ("olvera-taquito", "olvera-street", "Try a taquito", "Prueba un taquito", "TAQUITOS", "TAQUITOS", "taco", None,
  "A famous Olvera Street snack. Share one with a friend.", "Un snack famoso de la calle Olvera. Comparte uno con un amigo.",
  "Try a taquito.", "Prueba un taquito.", "$"),
]
_kids = {}
for b in BONUS: _kids.setdefault(b[1], []).append(b)
_new = []
for d in dstamps:
    _new.append(d)
    for k, b in enumerate(_kids.get(d["id"], [])):
        real = mapid.get(b[7]) if b[7] else None
        _new.append({"id": b[0], "bonus": True, "parent": d["id"], "name": {"en": b[2], "es": b[3]}, "top": {"en": b[4], "es": b[5]},
            "bottom": {"en": "LOS ANGELES", "es": "LOS \u00c1NGELES"}, "icon": b[6], "year": "", "ink": d["ink"], "rot": [5, -4, 6][k % 3], "seed": d["seed"] + 5 + k * 3,
            "mapId": real or (b[7] if b[7] and b[7] in mapid.values() else None), "legacyKey": None, "draft": False, "area": "", "cost": b[12],
            "tip": {"en": b[8], "es": b[9]}, "challenge": {"en": b[10], "es": b[11]}, "mapLink": None})
dstamps = _new
for _i, _x in enumerate(dstamps): _x["order"] = _i + 1

# LA Tourist: the classic first-visit list. Icons are stand-ins where there is no drawing of the place yet (flagged "draft": true).
T = [("griffith-observatory","GRIFFITH OBSERVATORY","OBSERVATORIO GRIFFITH","obs","1935","Griffith Observatory","Observatorio Griffith",False,"Free to get in. Come near sunset for the city lights.","Entrada gratis. Ve cerca del atardecer para ver las luces de la ciudad."),
("hollywood-walk-of-fame","WALK OF FAME","PASEO DE LA FAMA","star","1960","Hollywood Walk of Fame","Paseo de la Fama de Hollywood",False,"Look down. Find a star for someone you love.","Mira al piso. Busca la estrella de alguien que quieres."),
("hollywood-sign-viewpoint-lake-hollywood-park","HOLLYWOOD SIGN","LETRERO DE HOLLYWOOD","mountain","1923","Hollywood Sign view","Vista del letrero de Hollywood",True,"The park at Lake Hollywood has a clear view and a dog park.","El parque de Lake Hollywood tiene una vista clara del letrero."),
("tcl-chinese-theatre","TCL CHINESE THEATRE","TEATRO CHINO TCL","theater","1927","TCL Chinese Theatre","Teatro Chino TCL",True,"Put your hands in the famous cement prints in the front yard.","Pon tus manos en las huellas de cemento del patio de enfrente."),
("santa-monica-pier","SANTA MONICA PIER","MUELLE DE SANTA MONICA","pier","1909","Santa Monica Pier","Muelle de Santa Monica",False,"Walk to the end of the pier and look back at the coast.","Camina hasta el final del muelle y mira hacia la costa."),
("venice-beach-boardwalk","VENICE BEACH","VENICE BEACH","venice_beach","1905","Venice Beach Boardwalk","Malecón de Venice Beach",False,"Skaters, muscle beach and street art. Explore it slowly.","Patinadores, Muscle Beach y arte callejero. Explóralo con calma."),
("the-getty-center","THE GETTY CENTER","EL GETTY CENTER","museum","1997","The Getty Center","El Getty Center",True,"Free to get in. Parking costs money, so take the tram up the hill.","Entrada gratis. El estacionamiento cuesta, usa el tranvía hasta arriba."),
("rodeo-drive","RODEO DRIVE","RODEO DRIVE","bag","","Rodeo Drive","Rodeo Drive",False,"Window shopping is free. Walk it and enjoy the people watching.","Ver las vitrinas es gratis. Camina y disfruta ver pasar a la gente."),
("walt-disney-concert-hall","WALT DISNEY CONCERT HALL","SALA WALT DISNEY","wdch","2003","Walt Disney Concert Hall","Sala de Conciertos Walt Disney",False,"The steel curves look different from every side. Walk all the way around.","Las curvas de acero cambian en cada lado. Camina alrededor."),
("the-broad","THE BROAD","THE BROAD","broad","2015","The Broad","The Broad",False,"Free to get in, but book a time online. The line outside moves fast.","Entrada gratis, pero reserva hora en línea. La fila avanza rápido."),
("grand-central-market","GRAND CENTRAL MARKET","MERCADO GRAND CENTRAL","stall","1917","Grand Central Market","Mercado Grand Central",False,"Share a few things from different stalls. Explore before you buy.","Comparte algo de varios puestos. Explora antes de comprar."),
("olvera-street-and-el-pueblo","PLACITA OLVERA","PLACITA OLVERA","papel","1781","Olvera Street and El Pueblo","Calle Olvera y El Pueblo",False,"This is where LA started. Try the taquitos and look for the papel picado.","Aquí empezó LA. Prueba los taquitos y busca el papel picado.")]
INKS = ["#1D6F8F"]
tstamps = []
for i, t in enumerate(T):
    old = t[0]
    tstamps.append({"id": t[0], "order": i + 1, "name": {"en": t[5], "es": t[6]},
        "top": {"en": t[1], "es": t[2]}, "bottom": {"en": "LOS ANGELES", "es": "LOS ÁNGELES"},
        "icon": t[3], "year": t[4], "ink": "#1D6F8F", "rot": [-6, 5, -4, 7, -8, 4, -3, 6, -5, 3, -7, 5][i], "seed": 3 + i * 2,
        "mapId": mapid.get(old), "legacyKey": old, "draft": t[7],
        "tip": {"en": t[8], "es": t[9]}, "mapLink": None})

out = {"version": 1,
 "note": "Same fields as the Webflow CMS collections Passports and Passport Stamps. draft=true means the icon is a stand-in until the real drawing exists. legacyKey is the old saved key (no code on the end); mapId is the real map pin id.",
 "passports": [
  {"id": "la-tourist", "order": 1, "status": "live", "name": {"en": "LA Tourist", "es": "Turista en LA"}, "tagline": {"en": "The big first-visit list. Explore the city one stamp at a time.", "es": "La lista grande para tu primera visita. Explora la ciudad un sello a la vez."}, "audience": "visitors", "ink": "#1D6F8F", "stamps": tstamps},
  {"id": "downtown-classic", "order": 2, "status": "live", "name": {"en": "Downtown Classic", "es": "Clásico del Centro"}, "tagline": {"en": "The stops of our free walking tour.", "es": "Las paradas de nuestro tour gratis."}, "audience": "tour guests", "ink": "#7A2A6A", "stamps": dstamps},
  ]}
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import passport_content as PC
TACO_INKS = ["#B84A00", "#C2352A", "#E89B00", "#7A3FA0", "#2E9E57"]
ROTS = [-6, 5, -4, 7, -8, 4, -3, 6, -5, 3, -7, 5]
for pid, c in PC.P.items():
    st = []
    for i, t in enumerate(c["stamps"]):
        (sid, pin, nen, nes, ten, tes, icon, year, draft, area, cost, tipen, tipes, chen, ches) = t
        real = mapid.get(pin) if pin else None
        if pin and not real: print("NO PIN FOR", pid, sid, pin)
        st.append({"id": sid, "order": i + 1, "name": {"en": nen, "es": nes}, "top": {"en": ten, "es": tes},
            "bottom": {"en": "LOS ANGELES", "es": "LOS ÁNGELES"}, "icon": icon, "year": year,
            "ink": TACO_INKS[i % 5] if pid == "la-tacos" else c["ink"], "rot": ROTS[i % 12], "seed": 3 + i * 2,
            "mapId": real, "legacyKey": pin if real else None, "draft": draft, "area": area, "cost": cost,
            "tip": {"en": tipen, "es": tipes}, "challenge": {"en": chen, "es": ches}, "mapLink": None})
    seen = []
    for x in st:
        if x["area"] not in seen: seen.append(x["area"])
    st.sort(key=lambda x: seen.index(x["area"]))      # keep each area together (stable)
    for i, x in enumerate(st): x["order"] = i + 1
    out["passports"].append({"id": pid, "order": c["order"], "status": "live", "name": {"en": c["name"][0], "es": c["name"][1]},
        "tagline": {"en": c["tagline"][0], "es": c["tagline"][1]}, "audience": c["audience"], "ink": c["ink"], "stamps": st})
out["passports"].sort(key=lambda p: p["order"])

# Nov 3, 2026: stamps whose place has a History story (Blogs EN /blog/<slug>, Blogs ES /historias/<slug>)
STORIES = {
    "walt-disney-concert-hall": ("walt-disney-concert-hall", "walt-disney-concert-hall"),
    "the-broad": ("the-broad", "the-broad"),
    "angels-flight": ("angels-flight", "angels-flight"),
    "la-city-hall": ("city-hall", "city-hall"),
    "olvera-street": ("olvera-street", "calle-olvera"),
    "olvera-street-and-el-pueblo": ("olvera-street", "calle-olvera"),
}
for _p in out["passports"]:
    for _s in _p["stamps"]:
        if _s["id"] in STORIES and not _s.get("bonus"):
            _en, _es = STORIES[_s["id"]]
            _s["history"] = {"en": "/blog/" + _en, "es": "/historias/" + _es}
json.dump(out, open(os.path.join(root, "passports.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("passports.json", os.path.getsize(os.path.join(root, "passports.json")), "bytes;", sum(len(p["stamps"]) for p in out["passports"]), "stamps")
miss = [s["id"] for p in out["passports"] for s in p["stamps"] if s["legacyKey"] and not s["mapId"]]
print("no map id:", miss)
