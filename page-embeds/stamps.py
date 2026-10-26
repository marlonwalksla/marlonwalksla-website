# Round passport-style ink stamps (Oct 17, 2026, Marlon): one landmark per section, replacing the pale silhouettes.
# Inline SVG (so the page fonts work): double ring, curved place name, landmark icon, year. A turbulence filter wobbles the edge and
# leaves a few gaps in the ink, like a real stamp. Colors are flat ink, drawn with multiply so the card shows through.
import re
import json, os
import silhouettes as SIL
_BB = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "icon_bbox.json")))
# Oct 24, 2026 (Marlon: icons look off-center): icon_center.json = where the ink's weight sits inside each icon's box (fractions, 0.5 = middle),
# measured by rendering each icon. Boxes are centered, but base-heavy drawings (buildings, skylines) looked low. OPTICAL is how far toward the
# weight center we move (0 = box center, 1 = weight center).
_CEN = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "icon_center.json")))
OPTICAL = 0.6
_SIZE = {"stall": 0.9}  # Oct 24, 2026 (Marlon): the market stall was a little too big, 90%


def _inner(svg):
    s = re.sub(r"^<svg[^>]*>|</svg>$", "", svg)
    # Oct 18, 2026 (Marlon: "they all have that line in the middle"): the flat ground line under each icon is left over from the old
    # silhouettes. Drop it, so the icon can be bigger. (Sunset keeps its water lines; they are part of that picture.)
    return re.sub(r'<rect x="[\d.]+" y="(?:19\d|2[0-2]\d)" width="(?:2[89]\d|[3-9]\d\d)" height="(?:6|8|9)"(?: rx="\d")?/>', "", s)


def icon(name, ink):
    if name == "cake": return _inner(SIL.cake(ink)), (260, 190, "130 20 260 190", 110)
    if name == "trophy": return _inner(SIL.trophy(ink)), (220, 190, "150 26 220 190", 110)
    if name == "sunset": return _inner(SIL.sunset(ink)), (320, 170, "100 40 320 170", 124)
    if name == "bag": return _inner(SIL.bag(ink)), (300, 220, "0 0 300 220", 112)
    if name == "stall": return _inner(SIL.stall(ink)), (300, 220, "0 0 300 220", 112)
    if name == "swan": return _inner(SIL.swan(ink)), (300, 220, "30 30 250 183", 112)
    if name == "taco": return _inner(SIL.taco(ink)), (380, 220, "30 10 320 200", 120)
    if name == "venice_beach": return _inner(SIL.venice_beach(ink)), (300, 220, "30 40 240 183", 112)
    if name == "papel": return _inner(SIL.papel(ink)), (300, 220, "20 40 260 160", 112)
    if name == "pin": return _inner(SIL.pin(ink)), (300, 220, "66 14 168 200", 112)
    if name == "polaroid": return _inner(SIL.polaroid(ink)), (262, 186, "142 16 262 186", 100)
    if name == "pier": return _inner(SIL.pier(ink)), (520, 220, "140 10 240 210", 138)
    if name == "palms3": return _inner(SIL.palms3(ink)), (520, 220, "60 0 400 220", 146)
    if name == "obs": return _inner(SIL.observatory_clean(ink)), (300, 130, "110 50 300 130", 140)
    if name == "wdch": return _inner(SIL.wdch(ink)), (440, 210, "46 20 440 210", 138)
    if name == "bradbury": return _inner(SIL.bradbury(ink)), (300, 220, "110 6 300 220", 112)
    if name == "skyline": return _inner(SIL.skyline(ink)), (440, 200, "400 0 440 200")
    if name == "angels": return _inner(SIL.angels_flight(ink)), (520, 220, "96 8 348 198", 138)
    if name == "city_tower": return _inner(SIL.city_tower(ink)), (520, 220, "0 0 520 220", 112)
    if name == "broad": return _inner(SIL.broad(ink)), (520, 220, "110 60 300 152", 130)
    if name == "mural": return _inner(SIL.mural(ink)), (520, 220, "130 14 260 198", 112)
    if name == "justice": return _inner(SIL.justice(ink)), (520, 232, "120 0 280 220", 112)
    raise ValueError(name)


def stamp(uid, top, bottom, name, year, ink, rot=-8, seed=3, extra="", bold=False, cy_year=90.0):
    import html as _h
    n = len(_h.unescape(top)); tsz, tls = (13, 1.2) if n <= 21 else (11, 0.5)
    bn = len(_h.unescape(bottom)); bsz, bls = (12.5, 1.8) if bn <= 20 else (10.5, 0.8)
    body, dims = icon(name, ink)[0], icon(name, ink)[1]
    # Oct 23, 2026 (Marlon): icons centered in the circle. Use the drawing's real bounding box (icon_bbox.json, measured in a browser), keep the old
    # left/right crop of the wide landmarks, then scale so the box's corners sit inside the free area (radius R) and center it on the circle.
    bx, by, bw, bh = _BB[name if name in _BB else "observatory_clean"]
    if len(dims) > 2:
        vx, vy, vw, vh = [float(v) for v in dims[2].split()]
        x0, x1 = max(bx, vx), min(bx + bw, vx + vw)
        if x1 - x0 > 10: bx, bw = x0, x1 - x0
    EA, EB = (68.0, 50.0) if year else (76.0, 60.0)  # free area is an ellipse: wide and short icons may run closer to the sides
    sc = 1.0 / (((bw / 2 / EA) ** 2 + (bh / 2 / EB) ** 2) ** 0.5)
    sc = min(sc, 140.0 / bw) * _SIZE.get(name, 1.0)
    cy = cy_year if year else 100.0
    fx, fy = _CEN.get(name, (0.5, 0.5))
    while True:  # shift toward the ink's weight center, then shrink a little if a corner would leave the free area
        iw, ih = bw * sc, bh * sc
        ix, iy = 100 - iw / 2 + (0.5 - fx) * iw * OPTICAL, cy - ih / 2 + (0.5 - fy) * ih * OPTICAL
        if all(((x - 100) / EA) ** 2 + ((y - cy) / EB) ** 2 <= 1.1 for x in (ix, ix + iw) for y in (iy, iy + ih)) or sc < 0.2: break
        sc *= 0.98
    vb = f"{bx:.1f} {by:.1f} {bw:.1f} {bh:.1f}"
    yr = f'<text x="100" y="{iy + ih + 14:.0f}" text-anchor="middle" font-size="11" letter-spacing="2">{year}</text>' if year else ""
    return (f'<svg class="stamp{(" " + extra) if extra else ""}" viewBox="0 0 200 200" role="img" aria-label="{top}" style="--r:{rot}deg" xmlns="http://www.w3.org/2000/svg">'
            f'<defs><filter id="{uid}-f" x="-8%" y="-12%" width="116%" height="124%">'
            f'<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="{seed}" result="w"/>'
            f'<feDisplacementMap in="SourceGraphic" in2="w" scale="3.2" result="d"/>'
            f'<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="{seed + 4}" result="n"/>'
            f'<feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -5 0 0 0 3.7" result="m"/>'
            f'<feComposite in="d" in2="m" operator="in"/></filter>'
            f'<path id="{uid}-t" d="M 38.0 122.6 A 66 66 0 1 1 162.0 122.6"/><path id="{uid}-b" d="M 18 100 A 82 82 0 0 0 182 100"/></defs>'
            f'<g filter="url(#{uid}-f)" fill="{ink}" stroke="none" font-family="Fredoka, Lilita One, sans-serif" font-weight="700" style="color:{ink}">'
            f'<circle cx="100" cy="100" r="96" fill="none" stroke="{ink}" stroke-width="4"/><circle cx="100" cy="100" r="89" fill="none" stroke="{ink}" stroke-width="1.5"/>'
            f'<text font-size="{tsz + (1.5 if bold else 0)}" letter-spacing="{tls + (0.6 if bold else 0)}" text-anchor="middle"{(" stroke=" + chr(34) + ink + chr(34) + " stroke-width=" + chr(34) + "0.9" + chr(34) + " stroke-linejoin=" + chr(34) + "round" + chr(34)) if bold else ""}><textPath href="#{uid}-t" startOffset="50%">{top}</textPath></text>'
            f'<text font-size="{bsz}" letter-spacing="{bls}" text-anchor="middle"><textPath href="#{uid}-b" startOffset="50%">{bottom}</textPath></text>'
            f'<svg x="{ix:.1f}" y="{iy:.1f}" width="{iw:.1f}" height="{ih:.1f}" viewBox="{vb}" fill="{ink}">{body}</svg>{yr}</g></svg>')


def num_stamp(uid, top, bottom, ink, nid, text="15", rot=6, seed=5):
    """Ink stamp with a big number in the middle (Oct 23, 2026): the number element gets id=nid so the card can update it."""
    return (f'<svg class="stamp" viewBox="0 0 200 200" role="img" aria-label="{top}" style="--r:{rot}deg" xmlns="http://www.w3.org/2000/svg">'
            f'<defs><filter id="{uid}-f" x="-8%" y="-12%" width="116%" height="124%">'
            f'<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="{seed}" result="w"/>'
            f'<feDisplacementMap in="SourceGraphic" in2="w" scale="3.2" result="d"/>'
            f'<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="{seed + 4}" result="n"/>'
            f'<feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -5 0 0 0 3.7" result="m"/>'
            f'<feComposite in="d" in2="m" operator="in"/></filter>'
            f'<path id="{uid}-t" d="M 38.0 122.6 A 66 66 0 1 1 162.0 122.6"/><path id="{uid}-b" d="M 18 100 A 82 82 0 0 0 182 100"/></defs>'
            f'<g filter="url(#{uid}-f)" fill="{ink}" stroke="none" font-family="Fredoka, Lilita One, sans-serif" font-weight="700" style="color:{ink}">'
            f'<circle cx="100" cy="100" r="96" fill="none" stroke="{ink}" stroke-width="4"/><circle cx="100" cy="100" r="89" fill="none" stroke="{ink}" stroke-width="1.5"/>'
            f'<text font-size="13" letter-spacing="1.2" text-anchor="middle"><textPath href="#{uid}-t" startOffset="50%">{top}</textPath></text>'
            f'<text font-size="12.5" letter-spacing="1.8" text-anchor="middle"><textPath href="#{uid}-b" startOffset="50%">{bottom}</textPath></text>'
            f'<text id="{nid}" x="100" y="127" text-anchor="middle" font-size="78" font-family="Lilita One, Fredoka, sans-serif" font-weight="400">{text}</text></g></svg>')
