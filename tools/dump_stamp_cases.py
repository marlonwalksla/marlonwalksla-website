# Writes test cases (inputs + Python output) for tools/test_stamp_lib.js
import sys, os, json
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(here, "..", "page-embeds"))
import stamps
icons = ["cake","trophy","sunset","bag","stall","swan","taco","venice_beach","papel","pin","polaroid","pier","palms3","obs","wdch","bradbury","skyline","angels","city_tower","broad","mural","justice"]
tops = ["GRAND CENTRAL MARKET", "EVOLUCI&Oacute;N DEL CENTRO HIST&Oacute;RICO", "PLAZA", "BRADBURY BUILDING"]
cases = []
k = 0
for ic in icons:
    for j, (top, bottom, year, bold, rot, seed) in enumerate([
        (tops[0], "LOS ANGELES", "1917", False, -8, 3),
        (tops[1], "DOWNTOWN LOS ANGELES CALIFORNIA", "", True, 5.5, 7),
        (tops[2], "LOS ANGELES", "", False, -6, 3),
        (tops[3], "LOS ANGELES", "1893", True, 4, 11)]):
        k += 1
        uid = f"t{k}"
        out = stamps.stamp(uid, top, bottom, ic, year, "#1D6F8F", rot=rot, seed=seed, bold=bold, extra="x" if j == 1 else "")
        cases.append(dict(uid=uid, top=top, bottom=bottom, icon=ic, year=year, ink="#1D6F8F", rot=rot, seed=seed, bold=bold, extra="x" if j == 1 else "", out=out))
print(json.dumps(cases))
