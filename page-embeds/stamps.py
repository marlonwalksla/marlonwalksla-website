# Round passport-style ink stamps (Oct 17, 2026, Marlon): one landmark per section, replacing the pale silhouettes.
# Inline SVG (so the page fonts work): double ring, curved place name, landmark icon, year. A turbulence filter wobbles the edge and
# leaves a few gaps in the ink, like a real stamp. Colors are flat ink, drawn with multiply so the card shows through.
import re
import silhouettes as SIL


def _inner(svg):
    return re.sub(r"^<svg[^>]*>|</svg>$", "", svg)


def icon(name, ink):
    if name == "gcm": return _inner(SIL.gcm(ink)), (520, 220)
    if name == "observatory": return _inner(SIL.observatory(ink)), (520, 220)
    if name == "kiosko": return _inner(SIL.kiosko(ink)), (520, 220)
    if name == "city_tower": return _inner(SIL.city_tower(ink)), (160, 220, "180 0 160 220", 60)
    if name == "palm": return _inner(SIL.palm(ink)), (220, 220, "150 0 220 220", 88)
    if name == "sun": return _inner(SIL.sun(ink)), (280, 160, "120 50 280 160", 108)
    if name == "polaroid": return _inner(SIL.polaroid(ink)), (520, 220)
    if name == "pier": return _inner(SIL.pier(ink)), (520, 220)
    if name == "wdch": return _inner(SIL.wdch(ink)), (520, 220)
    if name == "city_hall": return _inner(SIL.city_hall(ink)), (520, 220)
    if name == "skyline": return _inner(SIL.skyline(ink)), (440, 200, "400 0 440 200")
    raise ValueError(name)


def stamp(uid, top, bottom, name, year, ink, rot=-8, seed=3, extra=""):
    body, dims = icon(name, ink)[0], icon(name, ink)[1]
    w, h = dims[0], dims[1]
    vb = dims[2] if len(dims) > 2 else f"0 0 {w} {h}"
    iw = float(dims[3]) if len(dims) > 3 else 112.0; ih = iw * h / w
    ix, iy = 100 - iw / 2, 96 - ih / 2
    yr = f'<text x="100" y="{min(iy + ih + 14, 146):.0f}" text-anchor="middle" font-size="11" letter-spacing="2">{year}</text>' if year else ""
    return (f'<svg class="stamp{(" " + extra) if extra else ""}" viewBox="0 0 200 200" role="img" aria-label="{top}" style="--r:{rot}deg" xmlns="http://www.w3.org/2000/svg">'
            f'<defs><filter id="{uid}-f" x="-5%" y="-5%" width="110%" height="110%">'
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
            f'<svg x="{ix:.1f}" y="{iy:.1f}" width="{iw}" height="{ih:.1f}" viewBox="{vb}" fill="{ink}">{body}</svg>{yr}</g></svg>')
