"""Nov 28, 2026: build guides.json for the new /guides hub and the guide pages (/guides/<slug>, /guias/<slug>).

Reads passports.json (stamps: names, tips, icons, map ids) and spots.geojson (coordinates), adds the guide-page
words that live only here (one line per stop, areas, photos), and writes guides.json at the repo root.
page-embeds/guides.html reads guides.json. Run from the repo root:  python3 tools/build_guides_json.py

Words: simple, "Explore" voice, no em dashes, "instant photo" (never the brand names), Latin American Spanish (tu).
The page intro and SEO text are NOT here: they live in the Webflow CMS (collections Guides and Guides (ES)).
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from passport_content import P as PC  # slugs of the Nov 2 guides

PASS = json.loads((ROOT / "passports.json").read_text())
SPOTS = {f["properties"]["Slug"]: f for f in json.loads((ROOT / "spots.geojson").read_text())["features"]}
POL = "https://cdn.prod.website-files.com/6a516a44ad462676ba76d689/"

# Guide slugs. EN /guides/<en>, ES /guias/<es>. "page": a CMS item exists, so the hub links to the guide page
# (others link to the LA Map with that guide open until their page is made).
SLUGS = {"la-tourist": ("la-tourist", "turista-en-la"), "downtown-classic": ("downtown-classic", "clasico-del-centro")}
for k, v in PC.items():
    SLUGS[k] = (v["slug_en"], v["slug_es"])
PAGES = {"la-tourist"}

# Free walking tour stops (Downtown LA History Walk). Guide stops here get a small "On the free tour" note.
# Nov 28, 2026 (Marlon): the "On my free walking tour" tag is off. Kept in the data in case it comes back.
FREE_TOUR = {"walt-disney-concert-hall", "the-broad", "grand-central-market", "olvera-street-and-el-pueblo", "olvera-street",
             "angels-flight", "bradbury-building", "la-city-hall"}

# Extra words per guide page: areas (stop numbers), one line per stop, a photo where we have a real one.
EXTRA = {
    "la-tourist": {
        "areas": [
            {"from": 1, "en": "Hollywood and Griffith", "es": "Hollywood y Griffith"},
            {"from": 5, "en": "The beach and the Westside", "es": "La playa y el Westside"},
            {"from": 9, "en": "Downtown on foot", "es": "El centro a pie"},
        ],
        "stops": {
            "griffith-observatory": ("The best view of LA, with the Hollywood Sign on one side and the city on the other.",
                                     "La mejor vista de LA, con el letrero de Hollywood de un lado y la ciudad del otro.",
                                     "6ad93d4377d6a74feb17629a_6ad92a2e4c83370c9caa0a28_place-griffith-park-and-observatory-01.webp"),
            "hollywood-walk-of-fame": ("More than 2,700 stars line Hollywood Boulevard.",
                                       "Más de 2,700 estrellas a lo largo de Hollywood Boulevard.", None),
            "hollywood-sign-viewpoint-lake-hollywood-park": ("See the sign up close from the quiet park below it.",
                                                             "Ve el letrero de cerca desde el parque tranquilo que está abajo.",
                                                             "6ad93d771ae24522ff516014_6ad929e02eb98d1ee52bd0c0_place-hollywood-sign-02.webp"),
            "tcl-chinese-theatre": ("The 1927 movie palace with the stars' handprints out front.",
                                    "El cine de 1927 con las huellas de las estrellas en la entrada.",
                                    "6ad93deca132d3bca4ce61f5_6ad9300ccc8517d84355cd90_place-tcl-chinese-theatre-01.webp"),
            "santa-monica-pier": ("Ferris wheel, ocean air and the end of Route 66.",
                                  "Rueda de la fortuna, aire de mar y el final de la Ruta 66.",
                                  "6ad93deba132d3bca4ce61e6_6ad929e6fd77e7c927620ea9_place-santa-monica-01.webp"),
            "venice-beach-boardwalk": ("LA's most colorful boardwalk, right on the sand.",
                                       "El malecón más colorido de LA, junto a la arena.", None),
            "the-getty-center": ("Art, gardens and big views from a hilltop.",
                                 "Arte, jardines y grandes vistas desde una colina.",
                                 "6ad93d3f77d6a74feb176166_6ad929db59b1d5ccebe76dc4_place-getty-center-01.webp"),
            "rodeo-drive": ("Three famous blocks of Beverly Hills shops and photo spots.",
                            "Tres cuadras famosas de tiendas y fotos en Beverly Hills.", None),
            "walt-disney-concert-hall": ("Frank Gehry's steel waves, with a garden hidden up the stairs.",
                                         "Las olas de acero de Frank Gehry, con un jardín escondido arriba.",
                                         "6ad93e1e77d6a74feb17da6a_6ad92a0d4c5d80802552eafc_place-disney-hall-02.webp"),
            "the-broad": ("Modern art next door to Disney Hall, free with a timed ticket.",
                          "Arte moderno junto a la Sala Disney, gratis con boleto con horario.",
                          "6ad93e1377d6a74feb17d46b_6ad92a57763e80ce77c7b7f9_place-the-broad-01.webp"),
            "grand-central-market": ("LA's food hall since 1917. Come hungry.",
                                     "El mercado de comida de LA desde 1917. Ven con hambre.",
                                     "6ac7517319a57efcf2aab47f_6ac74a8872cf323a6f897a43_polaroid-grand-central-market-night.jpeg"),
            "olvera-street-and-el-pueblo": ("Where Los Angeles began in 1781, with music, papel picado and taquitos.",
                                            "Donde nació Los Ángeles en 1781, con música, papel picado y taquitos.",
                                            "6ad93daf932fa55114d72098_6ad92c62ad4eddc60c1d00fa_place-olvera-street-01.webp"),
        },
        # Olvera naming rule: EN leads with Olvera Street, ES with Placita Olvera.
        "names": {"olvera-street-and-el-pueblo": ("Olvera Street", "Placita Olvera")},
    },
}


# Nov 27, 2026 (mobile spec): stop details for the slide-up panel on the guide page.
# hood (EN, ES), time (EN, ES), category (EN, ES), tours: first is the main button, second a small link.
# Tour keys are resolved in page-embeds/guides.html (free, foodwalk, sunset, beach, getty, build).
# Last item: row icons (transit, foot, park, tour), at most 2, explained in the guide's symbol key.
META = {
    "la-tourist": {
        "griffith-observatory": (("Hollywood / Griffith Park", "Hollywood / Griffith Park"), ("1.5 to 2 hrs", "1.5 a 2 h"), ("Views and astronomy", "Vistas y astronomía"), ["sunset"], ["transit","park"]),
        "hollywood-walk-of-fame": (("Hollywood", "Hollywood"), ("45 to 60 min", "45 a 60 min"), ("Pop culture", "Cultura pop"), ["sunset"], ["transit","foot"]),
        "hollywood-sign-viewpoint-lake-hollywood-park": (("Hollywood Hills", "Colinas de Hollywood"), ("1 to 1.5 hrs", "1 a 1.5 h"), ("Iconic view", "Vista icónica"), ["sunset"], ["park","foot"]),
        "tcl-chinese-theatre": (("Hollywood", "Hollywood"), ("30 to 45 min", "30 a 45 min"), ("Movie history", "Historia del cine"), ["sunset"], ["transit","foot"]),
        "santa-monica-pier": (("Santa Monica", "Santa Monica"), ("1.5 to 2.5 hrs", "1.5 a 2.5 h"), ("Beach and boardwalk", "Playa y malecón"), ["beach"], ["transit","foot"]),
        "venice-beach-boardwalk": (("Venice", "Venice"), ("1.5 to 2 hrs", "1.5 a 2 h"), ("Street culture and canals", "Cultura callejera y canales"), ["beach"], ["park","foot"]),
        "the-getty-center": (("Brentwood", "Brentwood"), ("2.5 to 3.5 hrs", "2.5 a 3.5 h"), ("Art and hilltop views", "Arte y vistas"), ["getty"], ["park"]),
        "rodeo-drive": (("Beverly Hills", "Beverly Hills"), ("45 to 60 min", "45 a 60 min"), ("Shopping and architecture", "Compras y arquitectura"), ["build"], ["park","foot"]),
        "walt-disney-concert-hall": (("Downtown LA", "Centro de LA"), ("45 to 60 min", "45 a 60 min"), ("Architecture and music", "Arquitectura y música"), ["free", "foodwalk"], ["transit","tour"]),
        "the-broad": (("Downtown LA", "Centro de LA"), ("1.5 to 2 hrs", "1.5 a 2 h"), ("Modern art", "Arte moderno"), ["free", "foodwalk"], ["transit","tour"]),
        "grand-central-market": (("Downtown LA", "Centro de LA"), ("1 to 1.5 hrs", "1 a 1.5 h"), ("Food hall", "Mercado de comida"), ["foodwalk", "free"], ["transit","tour"]),
        "olvera-street-and-el-pueblo": (("Downtown LA", "Centro de LA"), ("1 to 1.5 hrs", "1 a 1.5 h"), ("Where LA began", "Donde nació LA"), ["free", "foodwalk"], ["transit","tour"]),
    },
}


# Nov 28, 2026: street address shown under the stop name (tap = Google Maps directions to the pin coordinates).
ADDR = {
    "griffith-observatory": "2800 E Observatory Rd, Los Angeles",
    "hollywood-walk-of-fame": "Hollywood Blvd at Highland Ave, Hollywood",
    "hollywood-sign-viewpoint-lake-hollywood-park": "Lake Hollywood Park, 3160 Canyon Lake Dr",
    "tcl-chinese-theatre": "6925 Hollywood Blvd, Hollywood",
    "santa-monica-pier": "200 Santa Monica Pier, Santa Monica",
    "venice-beach-boardwalk": "Ocean Front Walk at Windward Ave, Venice",
    "the-getty-center": "1200 Getty Center Dr, Los Angeles",
    "rodeo-drive": "Rodeo Dr at Wilshire Blvd, Beverly Hills",
    "walt-disney-concert-hall": "111 S Grand Ave, Downtown LA",
    "the-broad": "221 S Grand Ave, Downtown LA",
    "grand-central-market": "317 S Broadway, Downtown LA",
    "olvera-street-and-el-pueblo": "125 Paseo de la Plaza, Downtown LA",
}

def coords(mid):
    f = SPOTS.get(mid or "")
    return f["geometry"]["coordinates"] if f else None


out = []
for p in sorted(PASS["passports"], key=lambda x: x["order"]):
    if p.get("status") != "live":
        continue
    ex = EXTRA.get(p["id"], {})
    stops = []
    for s in p["stamps"]:
        if s.get("bonus"):
            continue  # bonus stamps stay on the map for now
        line = ex.get("stops", {}).get(s["id"])
        nm = ex.get("names", {}).get(s["id"])
        st = {
            "id": s["id"], "mapId": s.get("mapId"), "legacyKey": s.get("legacyKey"),
            "name": {"en": nm[0], "es": nm[1]} if nm else s["name"],
            "tip": s.get("tip"), "icon": s["icon"], "year": s.get("year", ""), "top": s["top"], "bottom": s["bottom"],
            "ink": s.get("ink") or p["ink"], "rot": s.get("rot", -6), "seed": s.get("seed", 3), "draft": bool(s.get("draft")),
            "coords": coords(s.get("mapId")), "free": (s.get("legacyKey") or s["id"]) in FREE_TOUR or s["id"] in FREE_TOUR,
            "history": s.get("history"),
        }
        if p["id"] == "la-tourist" and s["id"] in ADDR:
            st["addr"] = ADDR[s["id"]]
        mt = META.get(p["id"], {}).get(s["id"])
        if mt:
            st["hood"] = {"en": mt[0][0], "es": mt[0][1]}
            st["time"] = {"en": mt[1][0], "es": mt[1][1]}
            st["cat"] = {"en": mt[2][0], "es": mt[2][1]}
            st["tours"] = mt[3]
            if len(mt) > 4:
                st["icons"] = mt[4]
        if line:
            st["line"] = {"en": line[0], "es": line[1]}
            if line[2]:
                st["photo"] = POL + line[2]
        stops.append(st)
    for i, st in enumerate(stops):
        st["n"] = i + 1
    en, es = SLUGS[p["id"]]
    tg = dict(p["tagline"])
    if "tour gratis" in tg.get("es", ""):
        tg["es"] = tg["es"].replace("tour gratis", "free tour")  # CANON: never "tour gratis" in Spanish copy
    out.append({"id": p["id"], "name": p["name"], "tagline": tg, "ink": p["ink"], "slug": {"en": en, "es": es},
                "page": p["id"] in PAGES, "areas": ex.get("areas", []), "stops": stops})

missing = [(g["id"], s["id"]) for g in out for s in g["stops"] if not s["coords"]]
data = {"version": 1, "built": "tools/build_guides_json.py", "guides": out}
txt = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
assert "—" not in txt, "no em dashes"
(ROOT / "guides.json").write_text(txt)
print("guides.json", len(txt), "bytes,", len(out), "guides; stops without a pin:", missing)
