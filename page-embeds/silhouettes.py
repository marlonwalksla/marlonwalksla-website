# Original one-color LA silhouettes for the postcard backs (Oct 17, 2026, Marlon: "a silhouette or an icon that takes up white space").
# Drawn here as simple shapes, not traced from any photo or stock postcard. No Hollywood Sign (trademark).
# Each returns an SVG string; svg_uri() turns it into a CSS-ready data URI. Colors come from the caller (faint tints).
import urllib.parse

def svg_uri(svg):
    return "data:image/svg+xml," + urllib.parse.quote(svg.strip().replace("\n", ""), safe="/:=,;()' ")

def _palm(x, base, h, lean=0, s=1.0, tw=3):
    """A palm tree: curved trunk and a fan of drooping fronds. x = trunk foot, base = ground y, h = trunk height."""
    tx, ty = x + lean, base - h
    trunk = f'<path d="M{x-tw*s} {base} Q{x+lean*0.2} {base-h*0.5} {tx-tw*0.5*s} {ty} L{tx+tw*0.5*s} {ty} Q{x+lean*0.2+(tw+1)*s} {base-h*0.5} {x+tw*s} {base} Z"/>'
    fronds = ""
    for dx, dy, cx, cy in [(-34, 6, -22, -16), (-30, 22, -22, -4), (34, 6, 22, -16), (30, 22, 22, -4), (-10, -22, -8, -30), (12, -22, 10, -30), (0, -30, 0, -34)]:
        dx, dy, cx, cy = dx*s, dy*s, cx*s, cy*s
        fronds += f'<path d="M{tx} {ty} Q{tx+cx} {ty+cy} {tx+dx} {ty+dy} Q{tx+cx*0.6} {ty+cy*0.55+4*s} {tx} {ty+3*s} Z"/>'
    return trunk + fronds

def skyline(color="#27302E", opacity=1):
    """Hero: Downtown LA skyline (generic towers, one tapered spire, a stepped crown), palms and a Ferris wheel."""
    b = 200
    towers = [(60,92,26),(88,60,30),(120,110,22),(144,70,34),(180,96,24),(206,40,28),(236,84,22),(262,52,30),(294,100,26),
              (322,22,34),(360,66,28),(392,104,24),(418,48,30),(452,88,26),(480,64,22),(506,108,30)]
    d = ''.join(f'<rect x="{x+240}" y="{b-h}" width="{w}" height="{h}"/>' for x,h,w in towers)
    # stepped crown tower and a tapered spire tower in the middle
    d += f'<path d="M640 {b} V70 H648 V58 H656 V46 H664 V58 H672 V70 H680 V{b} Z"/>'
    d += f'<path d="M700 {b} V80 L712 20 L724 80 V{b} Z"/>'
    d += f'<rect x="729" y="{b-90}" width="22" height="90"/>'
    d += f'<path d="M760 {b} V{b-70} L776 {b-70} L776 {b-96} L790 {b-96} L790 {b} Z"/>'
    # Ferris wheel (pier) at the far left
    wheel = '<circle cx="110" cy="110" r="64" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="110" cy="110" r="5"/>'
    for a in range(0, 360, 30):
        import math
        x2, y2 = 110+64*math.cos(math.radians(a)), 110+64*math.sin(math.radians(a))
        wheel += f'<path d="M110 110 L{x2:.1f} {y2:.1f}" stroke="currentColor" stroke-width="1.6"/><circle cx="{x2:.1f}" cy="{y2:.1f}" r="4.5"/>'
    wheel += f'<path d="M110 110 L72 {b} M110 110 L148 {b}" stroke="currentColor" stroke-width="4"/>'
    palms = _palm(880, b, 140, 14) + _palm(930, b, 110, -10, .85) + _palm(1090, b, 150, -12) + _palm(1140, b, 100, 10, .8) + _palm(30, b, 90, 8, .7)
    ground = f'<rect x="0" y="{b-6}" width="1200" height="6"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 {b}" fill="{color}" color="{color}" opacity="{opacity}">{wheel}{d}{palms}{ground}</svg>'

def city_hall(color="#2E9E57", opacity=1):
    """Team: the 1928 City Hall tower with a few Bunker Hill blocks, and the Angels Flight incline with its two cars."""
    b = 220
    blocks = [(10,70,34),(50,110,26),(82,84,30),(380,96,30),(414,128,26),(446,80,34),(486,104,24)]
    d = ''.join(f'<rect x="{x}" y="{b-h}" width="{w}" height="{h}"/>' for x,h,w in blocks)
    # City Hall: wide base, setbacks, tower shaft, stepped pyramid roof
    d += f'<rect x="150" y="{b-52}" width="150" height="52"/><rect x="170" y="{b-82}" width="110" height="30"/><rect x="190" y="{b-112}" width="70" height="30"/>'
    d += f'<rect x="203" y="{b-150}" width="44" height="38"/><rect x="198" y="{b-158}" width="54" height="8"/>'
    d += f'<path d="M205 {b-158} L225 {b-190} L245 {b-158} Z"/><rect x="223" y="{b-204}" width="4" height="16"/>'
    # Angels Flight: arch towers, incline track, two cars
    d += f'<path d="M310 {b} L368 {b-70}" stroke="{color}" stroke-width="5" fill="none"/><path d="M322 {b} L380 {b-70}" stroke="{color}" stroke-width="5" fill="none"/>'
    d += f'<path d="M322 {b-26} l22 -10 l0 18 l-22 10 z"/><path d="M349 {b-60} l22 -10 l0 18 l-22 10 z"/>'
    d += f'<path d="M296 {b} v-30 q8 -14 16 0 v30 z"/><path d="M366 {b-70} v-22 q8 -12 16 0 v22 z"/>'
    ground = f'<rect x="0" y="{b-6}" width="520" height="6"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 {b}" fill="{color}" opacity="{opacity}">{d}{ground}</svg>'

def kiosko(color="#D6479B", opacity=1):
    """Free tour: the Placita Olvera kiosko (bandstand), an adobe arcade, palms and a string of papel picado flags."""
    b = 220
    d = f'<rect x="150" y="{b-26}" width="150" height="26"/><rect x="160" y="{b-40}" width="130" height="14"/>'
    for i in range(6):
        d += f'<rect x="{168+i*22}" y="{b-110}" width="6" height="70"/>'
    d += f'<rect x="156" y="{b-118}" width="138" height="10"/>'
    d += f'<path d="M150 {b-118} L225 {b-176} L300 {b-118} Z"/><rect x="222" y="{b-196}" width="6" height="26"/><circle cx="225" cy="{b-198}" r="6"/>'
    # adobe arcade at the right: wall with arched openings
    wall = f'<path d="M340 {b} V{b-92} H500 V{b} H470 V{b-34} q-10 -26 -20 0 V{b} H430 V{b-34} q-10 -26 -20 0 V{b} H390 V{b-34} q-10 -26 -20 0 V{b} Z"/>'
    d += wall + f'<rect x="334" y="{b-100}" width="172" height="10"/>'
    d += _palm(60, b, 120, 10) + _palm(100, b, 84, -8, .8)
    # papel picado string
    d += f'<path d="M0 30 Q130 62 260 34 T520 40" fill="none" stroke="{color}" stroke-width="2"/>'
    for i in range(11):
        x = 22 + i*46
        y = 30 + 22*__import__('math').sin(i*0.55)+ (i*0.9)
        d += f'<path d="M{x-12} {y+3} h24 v22 l-4 -4 l-4 4 l-4 -4 l-4 4 l-4 -4 l-4 4 z"/>'
    ground = f'<rect x="0" y="{b-6}" width="520" height="6"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 {b}" fill="{color}" opacity="{opacity}">{d}{ground}</svg>'

def observatory(color="#2890B6", opacity=1):
    """Private: Griffith Observatory on its hill (center dome, two side domes), a pair of palms on each side."""
    b = 220
    top = 128  # hill crest where the building sits
    hill = f'<path d="M0 {b} V{top+16} Q90 {top-10} 170 {top} L350 {top} Q420 {top-14} 520 {top+10} V{b} Z"/>'
    d = hill
    d += f'<rect x="170" y="{top-28}" width="180" height="28"/><rect x="148" y="{top-16}" width="224" height="16"/>'
    d += f'<path d="M226 {top-28} a34 34 0 0 1 68 0 Z"/><rect x="258" y="{top-76}" width="4" height="16"/>'
    d += f'<path d="M172 {top-28} a19 19 0 0 1 38 0 Z"/><path d="M310 {top-28} a19 19 0 0 1 38 0 Z"/>'
    d += f'<rect x="212" y="{top-46}" width="5" height="18"/><rect x="303" y="{top-46}" width="5" height="18"/>'
    for i in range(9):
        d += f'<rect x="{156+i*24}" y="{top-30}" width="4" height="14" fill="#fff" fill-opacity="0"/>'
    d += _palm(50, b, 150, 10) + _palm(92, b, 108, -8, .8) + _palm(450, b, 160, -10) + _palm(492, b, 112, 8, .75)
    ground = f'<rect x="0" y="{b-6}" width="520" height="6"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 {b}" fill="{color}" opacity="{opacity}">{d}{ground}</svg>'

def polaroid(color="#6A4C93", opacity=1):
    """Team stamp icon (Oct 18, 2026): two Polaroids with happy little people in the windows."""
    def pol(x, y, rot, people):
        win = f"M10 10 H110 V100 H10 Z"
        frame = f'<path fill-rule="evenodd" d="M0 0 H120 V132 H0 Z {win}"/>'
        ppl = ""
        for cx, cy, r in people:
            ppl += f'<circle cx="{cx}" cy="{cy}" r="{r}"/><path d="M{cx-r*1.7:.0f} 100 Q{cx} {cy+r*1.6:.0f} {cx+r*1.7:.0f} 100 Z"/>'
        return f'<g transform="translate({x} {y}) rotate({rot})">{frame}{ppl}</g>'
    d = pol(150, 34, -9, [(34, 50, 9), (62, 44, 10), (90, 52, 8)])
    d += pol(270, 30, 8, [(38, 52, 9), (66, 46, 10), (92, 54, 8)])
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" fill="{color}" opacity="{opacity}">{d}</svg>'


def pier(color="#B8326E", opacity=1):
    """Private stamp icon: Santa Monica Pier. Oct 24, 2026 (Marlon): just the Ferris wheel and the pier deck with its pilings (no palm, no huts, no stray line)."""
    import math
    cx, cy, r = 260, 90, 74
    d = f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{color}" stroke-width="6"/><circle cx="{cx}" cy="{cy}" r="{r-22}" fill="none" stroke="{color}" stroke-width="3"/>'
    for i in range(12):
        a = i * math.pi / 6
        x, y = cx + r * math.cos(a), cy + r * math.sin(a)
        d += f'<line x1="{cx}" y1="{cy}" x2="{x:.1f}" y2="{y:.1f}" stroke="{color}" stroke-width="3"/><circle cx="{x:.1f}" cy="{y:.1f}" r="8"/>'
    d += f'<circle cx="{cx}" cy="{cy}" r="9"/><path d="M{cx-38} 176 L{cx} {cy} L{cx+38} 176" fill="none" stroke="{color}" stroke-width="6"/>'
    d += '<rect x="150" y="168" width="220" height="12"/>'
    for i in range(8):
        d += f'<rect x="{158+i*29}" y="180" width="6" height="30"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" fill="{color}" opacity="{opacity}">{d}</svg>'

def wdch(color="#2B4F9E", opacity=1):
    """Walt Disney Concert Hall (Frank Gehry, 2003): angular, leaning, folded stainless-steel panels, NOT round sails (those are the Sydney Opera House)."""
    panels = [
        "M70 176 L96 112 Q124 96 156 100 L170 176 Z",                       # low left fold
        "M150 176 L196 72 Q232 52 276 58 L270 112 L246 176 Z",              # tall left lean
        "M232 176 L286 40 Q330 22 372 36 L352 104 L318 176 Z",              # tallest, leaning right
        "M308 176 L360 96 Q398 84 430 98 L418 148 L392 176 Z",              # right fold
        "M388 176 L428 130 Q452 124 470 134 L466 176 Z",                    # low right fold
    ]
    d = "".join(f'<path d="{p}" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>' for p in panels)
    # fold creases inside the tall panels
    d += '<path d="M196 72 L246 176 M286 40 L318 176 M360 96 L392 176" stroke="#fff" stroke-width="3" fill="none"/>'
    d += '<rect x="50" y="176" width="440" height="22"/><rect x="214" y="182" width="52" height="16" fill="#fff"/><rect x="0" y="214" width="520" height="6"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" fill="{color}" opacity="{opacity}">{d}</svg>'


def bradbury(color="#2E9E57", opacity=1):
    """Bradbury Building (1893): the tall brick facade, rows of windows, a big arched entrance and a heavy cornice."""
    b = 206
    holes = ""
    for r in range(5):
        for c in range(5):
            if r == 4 and c == 2:
                continue
            holes += f" M{168+c*40} {b-132+r*26} h22 v{16 if r < 4 else 14} h-22 Z"
    holes += f" M238 {b} V{b-34} q22 -34 44 0 V{b} Z"
    d = f'<path fill-rule="evenodd" d="M150 {b} V{b-150} H370 V{b} Z{holes}"/>'
    d += f'<rect x="140" y="{b-162}" width="240" height="14"/><rect x="156" y="{b-176}" width="208" height="14"/><rect x="224" y="{b-196}" width="72" height="22"/>'
    d += f'<rect x="136" y="{b-6}" width="248" height="6"/>'
    # a hint of the ironwork: fire-escape rail across the third floor
    d += f'<rect x="158" y="{b-80}" width="204" height="3" fill="#fff"/>'
    d += '<rect x="90" y="206" width="340" height="6"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" fill="{color}" opacity="{opacity}">{d}</svg>'


def city_tower(color="#2890B6", opacity=1):
    """Hero stamp (Oct 18, 2026): just the City Hall tower, one clean shape."""
    b = 214
    d = f'<rect x="196" y="{b-44}" width="128" height="44"/><rect x="214" y="{b-74}" width="92" height="30"/><rect x="232" y="{b-104}" width="56" height="30"/>'
    d += f'<rect x="242" y="{b-150}" width="36" height="46"/><rect x="236" y="{b-158}" width="48" height="8"/>'
    d += f'<path d="M240 {b-158} L260 {b-192} L280 {b-158} Z"/><rect x="258" y="{b-210}" width="4" height="20"/>'
    for i in range(3):
        d += f'<rect x="{248+i*11}" y="{b-142}" width="5" height="28" fill="#fff"/>'
    ground = f'<rect x="150" y="{b}" width="220" height="6"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" fill="{color}" opacity="{opacity}">{d}{ground}</svg>'


def palm(color="#E8412F", opacity=1):
    """Hero stamp: one tall palm tree."""
    d = _palm(260, 214, 200, 10, 1.15)
    d += '<rect x="170" y="214" width="180" height="6"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" fill="{color}" opacity="{opacity}">{d}</svg>'


def sun(color="#E27B1A", opacity=1):
    """Hero stamp: a low sun with rays over the horizon."""
    import math
    cx, cy, r = 260, 168, 54
    d = f'<path d="M{cx-r} {cy} A{r} {r} 0 0 1 {cx+r} {cy} Z"/>'
    for i in range(1, 9):
        a = math.pi * i / 9
        x1, y1 = cx - (r + 14) * math.cos(a), cy - (r + 14) * math.sin(a)
        x2, y2 = cx - (r + 44) * math.cos(a), cy - (r + 44) * math.sin(a)
        d += f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{color}" stroke-width="9" stroke-linecap="round"/>'
    d += '<rect x="120" y="176" width="280" height="8"/><rect x="170" y="194" width="180" height="6"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" fill="{color}" opacity="{opacity}">{d}</svg>'


def sunset(color="#E8742A", opacity=1):
    """Hero stamp (Private): a half sun sinking into the horizon, short rays above, water lines below."""
    import math
    cx, cy, r = 260, 140, 58
    d = f'<path d="M{cx-r} {cy} A{r} {r} 0 0 1 {cx+r} {cy} Z"/>'
    for i in range(1, 7):
        a = math.pi * i / 7
        x1, y1 = cx - (r + 12) * math.cos(a), cy - (r + 12) * math.sin(a)
        x2, y2 = cx - (r + 34) * math.cos(a), cy - (r + 34) * math.sin(a)
        d += f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{color}" stroke-width="9" stroke-linecap="round"/>'
    for k, (w, y) in enumerate(((300, 154), (230, 172), (160, 190))):
        d += f'<rect x="{cx - w/2:.0f}" y="{y}" width="{w}" height="8" rx="4"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" fill="{color}" opacity="{opacity}">{d}</svg>'


def palms3(color="#2E9E57", opacity=1):
    """Out of Office stamp: three palm trees of different heights. Oct 24, 2026 (Marlon): wider, with thick trunks you can actually see."""
    d = _palm(150, 214, 96, 12, 1.2, 12) + _palm(260, 214, 132, -4, 1.4, 14) + _palm(372, 214, 80, -12, 1.15, 11)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" fill="{color}" opacity="{opacity}">{d}</svg>'

def observatory_clean(color="#C2352A", opacity=1):
    """Griffith Observatory stamp: the building alone (no hill) so the domes and the long facade read clearly."""
    t = 150
    d = f'<rect x="130" y="{t}" width="260" height="10"/><rect x="146" y="{t-14}" width="228" height="14"/>'
    d += f'<rect x="170" y="{t-40}" width="180" height="26"/>'
    d += f'<path d="M222 {t-40} a38 38 0 0 1 76 0 Z"/><rect x="258" y="{t-96}" width="4" height="18"/>'
    d += f'<path d="M158 {t-14} a22 22 0 0 1 44 0 Z"/><path d="M318 {t-14} a22 22 0 0 1 44 0 Z"/>'
    for i in range(7):
        d += f'<rect x="{184+i*24}" y="{t-32}" width="9" height="16" fill="#fff"/>'
    d += f'<rect x="246" y="{t-14}" width="28" height="14" fill="#fff"/>'
    d += f'<rect x="110" y="{t+10}" width="300" height="6"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" fill="{color}" opacity="{opacity}">{d}</svg>'


def trio(color="#1B8A8F", opacity=1):
    """Free tour stamp: three landmarks side by side: Walt Disney Concert Hall, Bradbury Building, Placita Olvera kiosko."""
    b = 214
    sails = ["M70 190 C80 130 130 88 200 76 C192 118 176 156 158 190 Z", "M150 190 C172 114 246 54 338 40 C326 92 296 146 274 190 Z",
             "M262 190 C292 106 356 70 438 82 C418 124 388 160 376 190 Z", "M360 190 C396 150 438 138 478 150 L478 190 Z"]
    d = '<g transform="translate(-35 119) scale(.5)">' + "".join(f'<path d="{p}" stroke="#fff" stroke-width="6"/>' for p in sails) + '</g>'
    holes = ""
    for r in range(4):
        for c in range(4):
            holes += f" M{206+c*28} {b-92+r*22} h14 v14 h-14 Z"
    holes += f" M246 {b} V{b-30} q10 -16 20 0 V{b} Z"
    d += f'<path fill-rule="evenodd" d="M196 {b} V{b-104} H336 V{b} Z{holes}"/><rect x="190" y="{b-112}" width="152" height="10"/><rect x="226" y="{b-124}" width="80" height="12"/>'
    k = f'<rect x="150" y="{b-26}" width="150" height="26"/><rect x="160" y="{b-40}" width="130" height="14"/>'
    for i in range(6):
        k += f'<rect x="{168+i*22}" y="{b-110}" width="6" height="70"/>'
    k += f'<rect x="156" y="{b-118}" width="138" height="10"/><path d="M150 {b-118} L225 {b-176} L300 {b-118} Z"/><rect x="222" y="{b-196}" width="6" height="26"/><circle cx="225" cy="{b-198}" r="6"/>'
    d += f'<g transform="translate(206 0)">{k}</g><rect x="0" y="{b}" width="520" height="6"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" fill="{color}" opacity="{opacity}">{d}</svg>'


def taco(color="#D6452F", opacity=1):
    """Oct 24, 2026 (Marlon: the old one was bulky): a street taco tipped a little: a slim folded shell with a white crease, ruffled lettuce and tomato spilling out of the top."""
    W = 'stroke="#fff" stroke-width="6" stroke-linejoin="round"'
    d = '<g transform="rotate(-10 190 120)">'
    d += '<path d="M40 120 A150 78 0 0 0 340 120 Q190 134 40 120 Z"/>'
    d += '<path d="M72 128 A118 54 0 0 0 308 128" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>'
    top = "M46 124 Q30 98 54 92 Q50 72 74 74 Q74 52 98 58 Q104 36 126 48 Q138 26 158 44 Q176 22 192 44 Q210 26 226 46 Q246 32 256 54 Q278 44 286 66 Q308 62 306 84 Q330 88 322 108 Q338 116 334 126 Q190 140 46 124 Z"
    d += f'<path d="{top}" {W}/>'
    d += '<path d="M72 102 q14 -14 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>'
    d += '<circle cx="124" cy="76" r="12" fill="#fff"/><circle cx="214" cy="72" r="10" fill="#fff"/>'
    d += '</g>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 220" fill="{color}" opacity="{opacity}">{d}</svg>'


def angels_flight(color="#2890B6", opacity=1):
    """Challenge stamp: Angels Flight, two little cars on the short incline railway between two arched gates."""
    import math
    d = '<path d="M120 196 L400 64" stroke="%s" stroke-width="10" fill="none"/><path d="M142 206 L422 74" stroke="%s" stroke-width="10" fill="none"/>' % (color, color)
    ang = math.degrees(math.atan2(-132, 280))
    for t in (0.30, 0.72):
        x = 130 + 280 * t; y = 201 - 132 * t
        d += f'<g transform="translate({x:.0f} {y:.0f}) rotate({ang:.1f}) scale(1.25)"><rect x="-34" y="-34" width="68" height="34" rx="4"/><rect x="-24" y="-26" width="14" height="14" fill="#fff"/><rect x="-5" y="-26" width="14" height="14" fill="#fff"/><rect x="14" y="-26" width="12" height="14" fill="#fff"/></g>'
    # top and bottom gates
    d += '<path d="M400 74 V30 a22 22 0 0 1 44 0 V84 H430 V36 a8 8 0 0 0 -16 0 V74 Z"/>'
    d += '<path d="M96 206 V162 a22 22 0 0 1 44 0 V206 H126 V168 a8 8 0 0 0 -16 0 V206 Z"/>'
    d += '<rect x="70" y="206" width="400" height="8"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" fill="{color}" opacity="{opacity}">{d}</svg>'


if __name__ == "__main__":
    import sys
    out = sys.argv[1]
    for name, fn, col in (("skyline", skyline, "#27302E"), ("cityhall", city_hall, "#2E9E57"), ("kiosko", kiosko, "#D6479B"), ("observatory", observatory, "#2890B6")):
        open(f"{out}/{name}.svg", "w").write(fn(col))
    print("ok")

def gcm(color="#2E9E57", opacity=1):
    """Team (Oct 17, 2026, Marlon): ONE building, Grand Central Market on Broadway: wide 1897 facade, arched entrance, and the tall vertical blade sign."""
    b = 220
    outer = f"M100 {b} V{b-120} H420 V{b} Z"
    holes = ""
    for row_y in (b-104, b-66):
        for i in range(7):
            x = 112 + i * 43
            if row_y == b-66 and 3 <= i <= 3:
                continue
            holes += f" M{x} {row_y} h24 v26 h-24 Z"
    holes += f" M246 {b} V{b-52} q14 -22 28 0 V{b} Z"  # arched entrance
    d = f'<path fill-rule="evenodd" d="{outer}{holes}"/>'
    d += f'<rect x="94" y="{b-130}" width="332" height="10"/><rect x="232" y="{b-150}" width="56" height="20"/><rect x="254" y="{b-162}" width="12" height="12"/>'
    d += f'<rect x="70" y="{b-196}" width="20" height="170"/><rect x="66" y="{b-204}" width="28" height="10"/>'
    d += f'<rect x="108" y="{b-30}" width="124" height="8"/><rect x="288" y="{b-30}" width="124" height="8"/>'
    blocks = []  # Oct 18, 2026: one building only, no side blocks
    d += ''.join(f'<rect x="{x}" y="{b-h}" width="{w}" height="{h}"/>' for x, h, w in blocks)
    ground = f'<rect x="0" y="{b-6}" width="520" height="6"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 {b}" fill="{color}" opacity="{opacity}">{d}{ground}</svg>'


def cake(color="#D6479B", opacity=1):
    """Team stamp icon (Oct 20, 2026): a two-layer birthday cake with three lit candles."""
    d = '<rect x="150" y="200" width="220" height="9" rx="4"/><rect x="170" y="140" width="180" height="54" rx="8"/><rect x="200" y="94" width="120" height="40" rx="8"/>'
    for x in (226, 256, 286):
        d += f'<rect x="{x}" y="62" width="9" height="28" rx="3"/><path d="M{x+4.5} 26 Q{x+15} 42 {x+4.5} 54 Q{x-6} 42 {x+4.5} 26 Z"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" fill="{color}" opacity="{opacity}">{d}</svg>'


def trophy(color="#E89B00", opacity=1):
    """Team stamp icon (Oct 20, 2026): a trophy cup with handles, for milestones."""
    d = '<path d="M205 36 H315 V92 Q315 140 260 150 Q205 140 205 92 Z"/><rect x="247" y="150" width="26" height="30"/><rect x="212" y="180" width="96" height="18" rx="5"/><rect x="196" y="198" width="128" height="10" rx="4"/>'
    d += f'<path d="M205 52 Q160 52 164 88 Q168 112 208 116" fill="none" stroke="{color}" stroke-width="11" stroke-linecap="round"/><path d="M315 52 Q360 52 356 88 Q352 112 312 116" fill="none" stroke="{color}" stroke-width="11" stroke-linecap="round"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" fill="{color}" opacity="{opacity}">{d}</svg>'


def bag(color="#C2352A", opacity=1):
    """Lunch stamp icon (Oct 23, 2026): a paper takeout bag with two handles, a folded top and a white heart, for catered lunch."""
    d = f'<path d="M112 74 V54 Q112 24 150 24 Q188 24 188 54 V74" fill="none" stroke="{color}" stroke-width="9" stroke-linecap="round"/>'
    d += '<path d="M66 70 H234 L246 204 H54 Z"/>'
    d += '<path d="M66 92 H234" stroke="#fff" stroke-width="5" fill="none"/>'
    d += '<path d="M150 180 C108 152 110 120 134 120 C144 120 150 128 150 128 C150 128 156 120 166 120 C190 120 192 152 150 180 Z" fill="#fff"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220" fill="{color}" opacity="{opacity}">{d}</svg>'


def stall(color="#E2662A", opacity=1):
    """Lunch stamp icon (Oct 23, 2026): a market stall with a striped awning, a counter and a row of fruit, for 'everyone buys their own'."""
    d = '<path d="M30 104 L62 40 H238 L270 104 Z"/>'
    for i in range(1, 5):
        d += f'<path d="M{62 + 35 * i} 40 L{30 + 48 * i} 104" stroke="#fff" stroke-width="5" fill="none"/>'
    for j in range(5):
        d += f'<circle cx="{54 + 48 * j}" cy="104" r="24"/>'
    d += '<rect x="44" y="110" width="9" height="94"/><rect x="247" y="110" width="9" height="94"/>'
    d += '<rect x="44" y="164" width="212" height="40"/>'
    for j in range(6):
        d += f'<circle cx="{82 + 27 * j}" cy="148" r="12"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220" fill="{color}" opacity="{opacity}">{d}</svg>'


def venice_beach(color="#2890B6", opacity=1):
    """Oct 24, 2026 (Marlon, replaces the Venice Canals stamp): Venice Beach. A lifeguard tower on stilts with a flag, a palm, and waves."""
    d = '<path d="M88 112 L140 78 L192 112 Z"/>'
    d += '<rect x="102" y="112" width="76" height="40"/><rect x="116" y="124" width="22" height="18" fill="#fff"/><rect x="148" y="124" width="16" height="18" fill="#fff"/>'
    d += '<rect x="106" y="152" width="8" height="40"/><rect x="166" y="152" width="8" height="40"/><path d="M112 160 L168 188 M168 160 L112 188" stroke="%s" stroke-width="5" fill="none"/>' % color
    d += '<rect x="139" y="44" width="4" height="36"/><path d="M143 44 L172 54 L143 64 Z"/>'
    d += _palm(236, 192, 108, 10, .85, 4.5)
    d += '<rect x="44" y="190" width="212" height="6" rx="3"/>'
    d += f'<path d="M30 210 Q60 198 90 210 T150 210 T210 210 T270 210" fill="none" stroke="{color}" stroke-width="7" stroke-linecap="round"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220" fill="{color}" opacity="{opacity}">{d}</svg>'


def papel(color="#D6479B", opacity=1):
    """Oct 24, 2026: papel picado, the cut-paper flags strung across Olvera Street (replaces the kiosko stamp)."""
    d = '<path d="M20 56 Q150 116 280 56" fill="none" stroke="%s" stroke-width="4"/>' % color
    d += '<path d="M20 126 Q150 186 280 126" fill="none" stroke="%s" stroke-width="4"/>' % color
    for y0 in (56, 126):
        for i in range(6):
            t = (i + 0.5) / 6
            x = 20 + 260 * t
            y = y0 + 120 * t * (1 - t) - 2
            d += f'<path d="M{x-17:.1f} {y:.1f} h34 v40 l-6 -7 l-6 7 l-5 -7 l-6 7 l-5 -7 l-6 7 z"/>'
            d += f'<path d="M{x:.1f} {y+8:.1f} l6 9 l-6 9 l-6 -9 z" fill="#fff"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220" fill="{color}" opacity="{opacity}">{d}</svg>'


def swan(color="#2E9E57", opacity=1):
    """Oct 24, 2026 (Marlon: hard to even tell it was an animal): a swan in side view, a long S-curved neck, round head, beak, an eye and a folded wing."""
    d = '<path d="M30 88 Q58 118 110 118 Q160 118 186 104 Q216 122 198 150 Q172 180 110 176 Q54 172 40 132 Q34 112 30 88 Z"/>'
    d += f'<path d="M184 114 C224 104 228 70 206 58 C188 46 196 22 222 24" fill="none" stroke="{color}" stroke-width="17" stroke-linecap="round"/>'
    d += '<circle cx="222" cy="24" r="14"/><path d="M232 19 L258 28 L232 35 Z"/><circle cx="224" cy="21" r="4" fill="#fff"/>'
    d += '<path d="M62 136 Q108 102 154 132 Q122 166 80 152 Z" fill="none" stroke="#fff" stroke-width="6" stroke-linejoin="round"/><path d="M92 132 Q116 124 136 134" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>'
    d += f'<path d="M30 202 Q60 190 90 202 T150 202 T210 202 T270 202" fill="none" stroke="{color}" stroke-width="7" stroke-linecap="round"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220" fill="{color}" opacity="{opacity}">{d}</svg>'


def pin(color="#6A4C93", opacity=1):
    """Stamp icon (Oct 23, 2026): a map pin with a white dot, for 'design your trip'."""
    d = '<path d="M150 14 C98 14 66 54 66 98 C66 142 112 178 150 214 C188 178 234 142 234 98 C234 54 202 14 150 14 Z"/><circle cx="150" cy="96" r="32" fill="#fff"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220" fill="{color}" opacity="{opacity}">{d}</svg>'
