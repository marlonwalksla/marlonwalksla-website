# Turns tools/passport_content.py into Webflow CMS payloads (field data for the Passports and Passport Stamps collections).
# Usage: python3 tools/make_cms_payload.py passports | stamps <passport-id>  (needs ids.json for stamps: {"<id>-en": "<cms id>", "<id>-es": "<cms id>"})
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import passport_content as PC
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
g = json.load(open(os.path.join(root, "spots.geojson"), encoding="utf-8"))
mapid = {}
for f in g["features"]:
    s = re.sub(r"[^a-z0-9]+", "-", f["properties"]["Slug"].lower()); mapid[re.sub(r"-[0-9a-f]{5}$", "", s)] = s
LANG = {"en": "40a5df515e4e3e5f337edd1f9805c6f4", "es": "73e0f3992e3649495988e40cea29fa75"}
THEME = {"Place": "2bec3cba40aca0d8d98ebd0eead7a654", "Food": "6e02229dfb707566fa2788c65c796a9d", "Film and TV": "87d3a4b44656b21806b6a0fb0309837a", "Theme": "a5cf2a0789a90261c548e8c16e5c9ae3", "Audience": "8afd4ac102acba161ad7db4215a250d5"}
OFFER = {"Free tour": "7960466d010825d78259e7a7b995ec3c", "Team tour": "18c2aa30c8c26d7bd93f5a607d70f716", "Private tour": "9acbcad2240d302151c069d66159eaae"}
COST = {"Free": "fa58510dee722bf7c10b0b02e3a94626", "$": "f77afcb98201fb945ded4ea66a6d2d44", "$$": "f08ced8ba0eda2f841c2fe93b6cae99d"}
LIVE = "53c8658af2cf0f8ab5e38cd29b83010d"
def para(t): return "<p>" + t.replace("&", "&amp;") + "</p>"
def passport(pid, lang):
    c = PC.P[pid]; i = 0 if lang == "en" else 1
    return {"name": c["name"][i], "slug": c["slug_en"] if lang == "en" else c["slug_es"], "tagline-en": c["tagline"][i], "ink-color": c["ink"],
            "audience": c["audience"], "order": c["order"], "status": LIVE, "language": LANG[lang], "theme": THEME[c["theme"]],
            "intro": para(c["intro"][i]), "time-needed": c["time"][i], "getting-around": c["around"][i], "start-point": c["start"][i],
            "offer": OFFER[c["offer"]], "seo-description": c["seo"][i]}
def stamps(pid, ids):
    c = PC.P[pid]; out = []
    seen = []
    for t in c["stamps"]:
        if t[9] not in seen: seen.append(t[9])
    rows = sorted(c["stamps"], key=lambda t: seen.index(t[9]))
    ROTS = [-6, 5, -4, 7, -8, 4, -3, 6, -5, 3, -7, 5]; TI = ["#B84A00", "#C2352A", "#E89B00", "#7A3FA0", "#2E9E57"]
    for i, t in enumerate(rows):
        (sid, pin, nen, nes, ten, tes, icon, year, draft, area, cost, tipen, tipes, chen, ches) = t
        d = {"name": nen, "slug": pid + "-" + sid, "name-es": nes, "order": i + 1, "icon": icon, "stamp-top-en": ten, "stamp-top-es": tes,
             "stamp-bottom-en": "LOS ANGELES", "stamp-bottom-es": "LOS ÁNGELES", "ink-color": TI[i % 5] if pid == "la-tacos" else c["ink"],
             "rotation": ROTS[i % 12], "seed": 3 + i * 2, "tip-en": tipen, "tip-es": tipes, "stand-in-drawing": draft, "area": area,
             "passports": [ids[pid + "-en"], ids[pid + "-es"]]}
        if year: d["year"] = year
        if pin and mapid.get(pin): d["map-id"] = mapid[pin]; d["legacy-key"] = pin
        if cost: d["cost"] = COST[cost]
        if chen: d["challenge-en"] = chen; d["challenge-es"] = ches
        out.append(d)
    return out
if __name__ == "__main__":
    if sys.argv[1] == "passports":
        new = ["photo-spots", "hollywood", "beaches-and-coast", "latino-la", "music", "free-la"]
        print(json.dumps({"create": [passport(p, l) for l in ("en", "es") for p in new], "update_fields": [passport(p, l) for p in ("film-and-tv", "la-tacos") for l in ("en", "es")]}, ensure_ascii=False, separators=(",", ":")))
    else:
        ids = json.load(open(sys.argv[3] if len(sys.argv) > 3 else os.path.join(root, "..", "ids.json")))
        print(json.dumps(stamps(sys.argv[2], ids), ensure_ascii=False, separators=(",", ":")))
