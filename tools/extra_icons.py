# Extra stamp icons (Nov 3, 2026): simple category pictures built from basic shapes, so the box around each one is exact.
# export_stamp_icons.py merges ICONS into stamp-icons.json. Every picture is drawn in a 200 x 200 space; ink = the stamp color.
import math
W = '#fff'
def _f(v): return ('%.1f' % v).rstrip('0').rstrip('.')
class S:
    def __init__(s): s.parts = []; s.xs = []; s.ys = []
    def _b(s, x0, y0, x1, y1): s.xs += [x0, x1]; s.ys += [y0, y1]
    def rect(s, x, y, w, h, fill=None, rx=0, bound=True):
        if bound: s._b(x, y, x + w, y + h)
        s.parts.append('<rect x="%s" y="%s" width="%s" height="%s"%s%s/>' % (_f(x), _f(y), _f(w), _f(h), ' rx="%s"' % _f(rx) if rx else '', ' fill="%s"' % fill if fill else ''))
    def circ(s, cx, cy, r, fill=None, bound=True):
        if bound: s._b(cx - r, cy - r, cx + r, cy + r)
        s.parts.append('<circle cx="%s" cy="%s" r="%s"%s/>' % (_f(cx), _f(cy), _f(r), ' fill="%s"' % fill if fill else ''))
    def poly(s, pts, fill=None, bound=True):
        if bound:
            for x, y in pts: s._b(x, y, x, y)
        s.parts.append('<polygon points="%s"%s/>' % (' '.join('%s,%s' % (_f(x), _f(y)) for x, y in pts), ' fill="%s"' % fill if fill else ''))
    def out(s):
        x0, x1, y0, y1 = min(s.xs), max(s.xs), min(s.ys), max(s.ys)
        w, h = x1 - x0, y1 - y0
        return {"body": ''.join(s.parts), "box": [200, 200], "bb": [round(x0, 1), round(y0, 1), round(w, 1), round(h, 1)],
                "cen": [round(((x0 + x1) / 2 - x0) / w, 3), 0.5], "size": 1.0}
def arc(cx, cy, rx, ry, a0, a1, n=24):
    return [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)), cy - ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]
ICONS = {}

s = S()  # star (Walk of Fame)
pts = []
for i in range(10):
    r = 80 if i % 2 == 0 else 33; a = math.radians(90 + i * 36)
    pts.append((100 + r * math.cos(a), 104 - r * math.sin(a)))
s.poly(pts); ICONS['star'] = s.out()

s = S()  # clapperboard (film and TV)
s.rect(30, 92, 140, 80, rx=6); s.rect(24, 58, 152, 28, rx=4)
for i in range(5): s.poly([(36 + i * 30, 86), (52 + i * 30, 86), (64 + i * 30, 58), (48 + i * 30, 58)], fill=W, bound=False)
s.rect(44, 108, 112, 6, fill=W, rx=2); s.rect(44, 124, 76, 6, fill=W, rx=2); ICONS['clapper'] = s.out()

s = S()  # camera (photo spots)
s.rect(22, 66, 156, 100, rx=16); s.poly([(64, 68), (76, 44), (124, 44), (136, 68)])
s.circ(100, 118, 36, fill=W, bound=False); s.circ(100, 118, 25); s.circ(92, 110, 7, fill=W, bound=False); s.rect(146, 78, 20, 10, fill=W, rx=3); ICONS['camera'] = s.out()

s = S()  # vinyl record (music)
s.circ(100, 100, 84)
for r in (70, 58, 46): s.parts.append('<circle cx="100" cy="100" r="%d" fill="none" stroke="%s" stroke-width="2.5"/>' % (r, W))
s.circ(100, 100, 28, fill=W, bound=False); s.circ(100, 100, 18); s.circ(100, 100, 4, fill=W, bound=False); ICONS['record'] = s.out()

s = S()  # waves and sun (beaches)
s.circ(142, 48, 22)
for k in range(3):
    top = [(24 + 152 * i / 30, 100 + k * 28 + 9 * math.sin(i / 30 * 3 * 2 * math.pi)) for i in range(31)]
    bot = [(x, y + 16) for x, y in reversed(top)]
    s.poly(top + bot)
ICONS['wave'] = s.out()

s = S()  # mountain and trail (hills, hikes)
s.poly([(16, 172), (84, 50), (112, 96), (134, 62), (184, 172)]); s.poly([(70, 76), (84, 50), (98, 76), (88, 70), (84, 80), (78, 70)], fill=W, bound=False)
s.circ(158, 38, 14); ICONS['mountain'] = s.out()

s = S()  # museum (columns)
s.poly([(22, 78), (100, 28), (178, 78)]); s.rect(30, 82, 140, 10)
for x in (40, 72, 108, 140): s.rect(x, 98, 20, 54)
s.rect(24, 154, 152, 10); s.rect(14, 166, 172, 12); ICONS['museum'] = s.out()

s = S()  # theater (curtain and stage)
s.rect(22, 26, 156, 148, rx=8)
s.poly(arc(100, 90, 52, 50, 0, 180) + [(48, 174), (152, 174)], fill=W, bound=False)
s.poly([(22, 26), (66, 26), (22, 120)], fill=None, bound=False); s.poly([(178, 26), (134, 26), (178, 120)], fill=None, bound=False)
s.poly([(100, 88), (106, 104), (123, 104), (110, 114), (115, 130), (100, 120), (85, 130), (90, 114), (77, 104), (94, 104)])
ICONS['theater'] = s.out()

s = S()  # mission (arched wall and bell)
s.rect(76, 72, 48, 100); s.circ(100, 72, 24)
s.rect(28, 118, 48, 54); s.circ(52, 118, 24); s.rect(124, 118, 48, 54); s.circ(148, 118, 24)
s.rect(86, 126, 28, 46, fill=W, bound=False); s.circ(100, 126, 14, fill=W, bound=False)
s.parts.append('<path d="M100 56 C92 56 90 66 88 74 L112 74 C110 66 108 56 100 56 Z" fill="%s"/>' % W)
s.rect(20, 172, 160, 8); ICONS['mission'] = s.out()

s = S()  # steps (stairs)
s.poly([(22, 176), (22, 150), (56, 150), (56, 124), (90, 124), (90, 98), (124, 98), (124, 72), (158, 72), (158, 46), (178, 46), (178, 176)])
ICONS['stairs'] = s.out()

s = S()  # lighthouse
s.poly([(78, 172), (122, 172), (112, 72), (88, 72)]); s.rect(84, 52, 32, 20, rx=3); s.poly([(80, 52), (100, 30), (120, 52)]); s.rect(64, 172, 72, 10)
for y0, y1 in ((96, 112), (130, 146)):
    xl = lambda y: 88 - (y - 72) * 10 / 100; xr = lambda y: 112 + (y - 72) * 10 / 100
    s.poly([(xl(y0), y0), (xr(y0), y0), (xr(y1), y1), (xl(y1), y1)], fill=W, bound=False)
s.poly([(80, 60), (22, 42), (22, 78)]); s.poly([(120, 60), (178, 42), (178, 78)]); ICONS['lighthouse'] = s.out()

s = S()  # bridge (arch bridge)
s.rect(18, 88, 164, 10)
top = arc(100, 168, 70, 70, 20, 160, 30); inn = arc(100, 168, 58, 58, 160, 20, 30); s.poly(top + inn)
for x in (66, 82, 100, 118, 134):
    yy = 168 - 70 * math.sqrt(max(0, 1 - ((x - 100) / 70) ** 2)); s.rect(x - 3, 98, 6, max(0, yy - 98))
s.rect(26, 98, 12, 76); s.rect(162, 98, 12, 76); s.rect(14, 174, 172, 8); ICONS['bridge'] = s.out()

s = S()  # fire (campfire)
s.poly([(100, 22), (126, 60), (146, 92), (148, 116), (132, 136), (100, 144), (68, 136), (52, 116), (54, 92), (74, 64), (80, 84), (92, 60)])
s.poly([(100, 80), (116, 104), (122, 122), (110, 134), (100, 136), (90, 134), (78, 122), (84, 104)], fill=W, bound=False)
s.poly([(28, 168), (36, 156), (170, 176), (162, 184)]); s.poly([(172, 168), (164, 156), (30, 176), (38, 184)]); ICONS['fire'] = s.out()

s = S()  # flower (garden)
for i in range(6):
    a = math.radians(i * 60 + 30); s.circ(100 + 34 * math.cos(a), 74 - 34 * math.sin(a), 22)
s.circ(100, 74, 15, fill=W, bound=False); s.circ(100, 74, 7)
s.rect(96, 108, 8, 66); s.poly([(100, 150), (64, 130), (72, 156), (100, 160)]); s.poly([(100, 140), (136, 120), (128, 146), (100, 150)]); ICONS['flower'] = s.out()

s = S()  # door (go inside)
s.rect(56, 62, 88, 110); s.circ(100, 62, 44)
s.rect(68, 82, 28, 38, fill=W, bound=False); s.rect(104, 82, 28, 38, fill=W, bound=False); s.circ(126, 146, 5, fill=W, bound=False)
s.rect(36, 172, 128, 8); ICONS['door'] = s.out()
