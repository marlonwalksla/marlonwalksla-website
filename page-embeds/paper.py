# Paper texture for the Home cards (Oct 17, 2026, Marlon: "too flat"): paper fibers, soft darker edges, one fold line across each card
# (a different height per card), plus the fold lines at the very top and bottom edges. Drawn on a ::before layer, so it needs no images
# except one tiny inline noise tile. rule(selector, fold_percent) returns the CSS rule.
import urllib.parse

_FIB = ("<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='f'><feTurbulence type='fractalNoise' "
        "baseFrequency='.9 .03' numOctaves='2' seed='7'/><feColorMatrix values='0 0 0 0 .35 0 0 0 0 .3 0 0 0 0 .2 0 0 0 .12 0'/></filter>"
        "<rect width='240' height='240' filter='url(#f)'/></svg>")
FIBERS = 'url("data:image/svg+xml,' + urllib.parse.quote(_FIB, safe=" =:/;,'") + '")'
_EDGE = "rgba(39,48,46,.22) 0, rgba(39,48,46,.22) 1px, rgba(255,255,255,.7) 1px, rgba(255,255,255,.7) 3px, rgba(39,48,46,.10) 3px, rgba(39,48,46,0) 14px"


def bg(fold=None):
    # Oct 18, 2026 (Marlon): the fold and edge crease lines got in the way, so only the grain and the soft darker edges are left.
    return ", ".join([
        "radial-gradient(ellipse at 50% 45%, rgba(110,80,40,0) 55%, rgba(110,80,40,.10) 100%)",
        FIBERS + " 0 0 / 240px 240px repeat",
    ])


def rule(selector, fold=None):
    return (f'{selector} {{ content: "" !important; display: block !important; position: absolute; inset: 0; background: {bg(fold)} !important; '
            "pointer-events: none; z-index: 3; transform: none !important; border: 0 !important; outline: 0 !important; "
            "box-shadow: none !important; width: auto !important; height: auto !important; }")
