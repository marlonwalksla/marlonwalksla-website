# Original one-color LA silhouettes for the postcard backs (Oct 17, 2026, Marlon: "a silhouette or an icon that takes up white space").
# Drawn here as simple shapes, not traced from any photo or stock postcard. No Hollywood Sign (trademark).
# Each returns an SVG string; svg_uri() turns it into a CSS-ready data URI. Colors come from the caller (faint tints).
import urllib.parse

def svg_uri(svg):
    return "data:image/svg+xml," + urllib.parse.quote(svg.strip().replace("\n", ""), safe="/:=,;()' ")

def _palm(x, base, h, lean=0, s=1.0):
    """A palm tree: curved trunk and a fan of drooping fronds. x = trunk foot, base = ground y, h = trunk height."""
    tx, ty = x + lean, base - h
    trunk = f'<path d="M{x-3*s} {base} Q{x+lean*0.2} {base-h*0.5} {tx-1.5*s} {ty} L{tx+1.5*s} {ty} Q{x+lean*0.2+4*s} {base-h*0.5} {x+3*s} {base} Z"/>'
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

if __name__ == "__main__":
    import sys
    out = sys.argv[1]
    for name, fn, col in (("skyline", skyline, "#27302E"), ("cityhall", city_hall, "#2E9E57"), ("kiosko", kiosko, "#D6479B"), ("observatory", observatory, "#2890B6")):
        open(f"{out}/{name}.svg", "w").write(fn(col))
    print("ok")
