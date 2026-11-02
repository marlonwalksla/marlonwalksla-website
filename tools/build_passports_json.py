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

# LA Tourist: the classic first-visit list. Icons are stand-ins where there is no drawing of the place yet (flagged "draft": true).
T = [("griffith-observatory","GRIFFITH OBSERVATORY","OBSERVATORIO GRIFFITH","obs","1935","Griffith Observatory","Observatorio Griffith",False,"Free to get in. Come near sunset for the city lights.","Entrada gratis. Ve cerca del atardecer para ver las luces de la ciudad."),
("hollywood-walk-of-fame","WALK OF FAME","PASEO DE LA FAMA","pin","1960","Hollywood Walk of Fame","Paseo de la Fama de Hollywood",True,"Look down. Find a star for someone you love.","Mira al piso. Busca la estrella de alguien que quieres."),
("hollywood-sign-viewpoint-lake-hollywood-park","HOLLYWOOD SIGN","LETRERO DE HOLLYWOOD","palms3","1923","Hollywood Sign view","Vista del letrero de Hollywood",True,"The park at Lake Hollywood has a clear view and a dog park.","El parque de Lake Hollywood tiene una vista clara del letrero."),
("tcl-chinese-theatre","TCL CHINESE THEATRE","TEATRO CHINO TCL","trophy","1927","TCL Chinese Theatre","Teatro Chino TCL",True,"Put your hands in the famous cement prints in the front yard.","Pon tus manos en las huellas de cemento del patio de enfrente."),
("santa-monica-pier","SANTA MONICA PIER","MUELLE DE SANTA MONICA","pier","1909","Santa Monica Pier","Muelle de Santa Monica",False,"Walk to the end of the pier and look back at the coast.","Camina hasta el final del muelle y mira hacia la costa."),
("venice-beach-boardwalk","VENICE BEACH","VENICE BEACH","venice_beach","1905","Venice Beach Boardwalk","Malecón de Venice Beach",False,"Skaters, muscle beach and street art. Explore it slowly.","Patinadores, Muscle Beach y arte callejero. Explóralo con calma."),
("the-getty-center","THE GETTY CENTER","EL GETTY CENTER","polaroid","1997","The Getty Center","El Getty Center",True,"Free to get in. Parking costs money, so take the tram up the hill.","Entrada gratis. El estacionamiento cuesta, usa el tranvía hasta arriba."),
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
  {"id": "la-tacos", "order": 3, "status": "coming-soon", "name": {"en": "LA Tacos", "es": "Tacos de LA"}, "tagline": {"en": "Coming soon.", "es": "Muy pronto."}, "audience": "food lovers", "ink": "#B84A00", "stamps": []}]}
json.dump(out, open(os.path.join(root, "passports.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("passports.json", os.path.getsize(os.path.join(root, "passports.json")), "bytes;", sum(len(p["stamps"]) for p in out["passports"]), "stamps")
miss = [s["id"] for p in out["passports"] for s in p["stamps"] if s["legacyKey"] and not s["mapId"]]
print("no map id:", miss)
