# Builds the "Build your day" section for the Private Tours page and splices it into private-top.html
# (replaces the old "Pick a starting point" cards and the pricing row).
# Oct 17, 2026. Prices, stop times and drive speeds are Claude's ESTIMATES for Marlon to adjust:
# edit PACKAGES / STOPS / PICKUPS below and re-run. Price is per car (1 to 4 guests).
import json, re

PACKAGES = [  # (label, hours, price)
    ("Half day", 4, 249),
    ("Full day", 8, 399),
    ("Long day", 12, 499),
]
# id, name, area, minutes at the stop, lat, lng, one line
STOPS = [
    ("griffith", "Griffith Observatory", "Hollywood", 60, 34.1184, -118.3004, "The best view of the city and the Hollywood Sign."),
    ("sign", "Hollywood Sign viewpoint", "Hollywood", 30, 34.1265, -118.3297, "The classic photo, from a quiet viewpoint."),
    ("urban", "Urban Light", "Mid-City", 20, 34.0629, -118.3593, "The 202 street lamps at LACMA."),
    ("grove", "The Grove and Farmers Market", "Mid-City", 60, 34.0720, -118.3576, "Shops, snacks and the 1934 market."),
    ("bhsign", "Beverly Hills sign", "Beverly Hills", 15, 34.0717, -118.4045, "The lily pond and the famous sign."),
    ("rodeo", "Rodeo Drive", "Beverly Hills", 45, 34.0696, -118.4031, "A walk down the fanciest street in LA."),
    ("pier", "Santa Monica Pier", "Coast", 60, 34.0094, -118.4973, "The pier, the beach and the end of Route 66."),
    ("venice", "Venice Beach and Canals", "Coast", 60, 33.9850, -118.4695, "The boardwalk, then the quiet canals."),
]
PICKUPS = [
    ("dtla", "Downtown LA", 34.0522, -118.2437),
    ("hollywood", "Hollywood", 34.1016, -118.3267),
    ("weho", "West Hollywood or Beverly Hills", 34.0736, -118.3870),
    ("sm", "Santa Monica or Venice", 34.0195, -118.4912),
]
AREA_COLORS = {"Hollywood": "#C9A54B", "Mid-City": "#2890B6", "Beverly Hills": "#B5527E", "Coast": "#3A9B8C"}

data = {
    "packages": [{"label": l, "hours": h, "price": p} for l, h, p in PACKAGES],
    "stops": [{"id": i, "name": n, "area": a, "min": m, "lat": la, "lng": ln} for i, n, a, m, la, ln, _ in STOPS],
    "pickups": [{"id": i, "name": n, "lat": la, "lng": ln} for i, n, la, ln in PICKUPS],
}

cards = []
for i, n, a, m, la, ln, line in STOPS:
    cards.append(
        f'<label class="pb-card" style="--c:{AREA_COLORS[a]}"><input type="checkbox" value="{i}">'
        f'<span class="pb-band">{a}</span><span class="pb-name">{n}</span><span class="pb-line">{line}</span>'
        f'<span class="pb-time">about {m} min</span><span class="pb-check" aria-hidden="true"></span></label>')
pick_opts = "".join(f'<option value="{i}">{n}</option>' for i, n, _, _ in PICKUPS)
pkg_cards = "".join(
    f'<div class="pb-pkg" data-h="{h}"><span class="pb-pkg-h">{l}</span><span class="pb-pkg-t">up to {h} hours</span><span class="pb-pkg-p">${p}</span></div>'
    for l, h, p in PACKAGES)

SECTION = f'''  <!-- ===== Build your day (Oct 17, 2026). Built by page-embeds/build_private_builder.py. Prices and times are estimates for Marlon to confirm. ===== -->
  <section class="tp-section" id="build">
    <div class="tp-wrap">
      <h2 class="tp-h2">Build your day</h2>
      <p class="tp-sub">Tap the stops you want. You&rsquo;ll see about how long the day takes, with driving, and which day fits. One price for your whole car, 1 to 4 guests.</p>
      <div class="pb">
        <div class="pb-left">
          <label class="pb-pick">Pickup from <select id="pb-pickup">{pick_opts}</select></label>
          <div class="pb-grid">{"".join(cards)}</div>
        </div>
        <aside class="pb-sum" aria-live="polite">
          <h3 class="pb-sum-h">Your day</h3>
          <ol class="pb-list" id="pb-list"><li class="pb-empty">Pick a stop or two to start.</li></ol>
          <div class="pb-total"><span id="pb-hours">0 hours</span><small id="pb-drive">with driving</small></div>
          <div class="pb-pkgs">{pkg_cards}</div>
          <p class="pb-fit" id="pb-fit"></p>
          <a class="pb-btn" id="pb-send" href="https://wa.me/12692670410" target="_blank" rel="noopener">Send me this day</a>
          <a class="pb-form" href="#private-inquiry">or use the form below</a>
          <p class="pb-note">Pickup and drop-off at your hotel, driving and instant photos included. Parking and tickets at stops aren&rsquo;t included; I street park when I can. Times are estimates; LA traffic decides the rest.</p>
        </aside>
      </div>
    </div>
    <script type="application/json" id="pb-data">{json.dumps(data, separators=(",", ":"))}</script>
    <style>
      .pb {{ display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 24px; align-items: start; margin-top: 18px; }}
      .pb-pick {{ display: inline-flex; align-items: center; gap: 10px; font-weight: 700; margin-bottom: 14px; }}
      .pb-pick select {{ font: inherit; font-weight: 600; padding: 8px 12px; border: 2px solid #27302E; border-radius: 10px; background: #fff; }}
      .pb-grid {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }}
      .pb-card {{ position: relative; display: flex; flex-direction: column; gap: 3px; padding: 12px 14px 12px; background: #FFFDF8; border: 1.5px solid #E4DCCB; border-top: 6px solid var(--c); border-radius: 6px; cursor: pointer; box-shadow: 0 6px 14px -10px rgba(39, 48, 46, 0.5); transition: transform 0.15s ease-out, box-shadow 0.15s ease-out; }}
      .pb-card:hover {{ transform: translateY(-2px); }}
      .pb-card input {{ position: absolute; opacity: 0; pointer-events: none; }}
      .pb-card:has(input:focus-visible) {{ outline: 3px solid #2890B6; outline-offset: 2px; }}
      .pb-card:has(input:checked) {{ border-color: var(--c); background: #fff; box-shadow: 0 0 0 2px var(--c), 0 10px 18px -12px rgba(39, 48, 46, 0.6); }}
      .pb-band {{ font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--c); }}
      .pb-name {{ font-weight: 800; font-size: 1.02rem; color: #27302E; }}
      .pb-line {{ font-size: 0.9rem; color: #475569; }}
      .pb-time {{ font-size: 0.8rem; color: #64748b; }}
      .pb-check {{ position: absolute; top: 10px; right: 10px; width: 22px; height: 22px; border-radius: 50%; border: 2px solid #C8BFAE; background: #fff; }}
      .pb-card:has(input:checked) .pb-check {{ background: var(--c); border-color: var(--c); box-shadow: inset 0 0 0 4px #fff; }}
      .pb-sum {{ position: sticky; top: 90px; background: #fff; border: 1.5px solid #E4DCCB; border-radius: 14px; padding: 18px; box-shadow: 0 10px 26px -18px rgba(39, 48, 46, 0.6); }}
      .pb-sum-h {{ margin: 0 0 8px; font-size: 1.25rem; }}
      .pb-list {{ margin: 0 0 12px; padding-left: 20px; display: grid; gap: 3px; color: #27302E; font-size: 0.95rem; }}
      .pb-empty {{ list-style: none; margin-left: -20px; color: #64748b; }}
      .pb-total {{ display: flex; align-items: baseline; gap: 8px; margin: 6px 0 12px; }}
      .pb-total span {{ font-size: 1.45rem; font-weight: 900; color: #27302E; }}
      .pb-total small {{ color: #64748b; }}
      .pb-pkgs {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }}
      .pb-pkg {{ display: flex; flex-direction: column; align-items: center; text-align: center; padding: 10px 6px; border: 1.5px solid #E4DCCB; border-radius: 10px; color: #64748b; }}
      .pb-pkg.is-fit {{ border-color: #C9A54B; background: #FBF5E4; color: #27302E; box-shadow: 0 0 0 2px #C9A54B; }}
      .pb-pkg-h {{ font-weight: 800; font-size: 0.92rem; }}
      .pb-pkg-t {{ font-size: 0.78rem; }}
      .pb-pkg-p {{ font-weight: 900; font-size: 1.2rem; margin-top: 4px; }}
      .pb-fit {{ min-height: 1.2em; margin: 10px 0 12px; font-size: 0.92rem; color: #27302E; }}
      .pb-btn {{ display: block; text-align: center; font-weight: 800; color: #27302E !important; text-decoration: none !important; background: #FFD43B; border: 2.5px solid #27302E; border-radius: 999px; padding: 12px 18px; box-shadow: 4px 4px 0 #27302E; }}
      .pb-btn:hover {{ transform: translate(-1px, -1px); box-shadow: 5px 5px 0 #27302E; }}
      .pb-btn[aria-disabled="true"] {{ opacity: 0.5; pointer-events: none; }}
      .pb-form {{ display: block; text-align: center; margin-top: 10px; font-weight: 700; }}
      .pb-note {{ margin: 12px 0 0; font-size: 0.82rem; line-height: 1.45; color: #64748b; }}
      @media (max-width: 860px) {{ .pb {{ grid-template-columns: 1fr; }} .pb-sum {{ position: static; }} }}
      @media (max-width: 520px) {{ .pb-grid {{ grid-template-columns: 1fr; }} }}
    </style>
    <script>
    (function () {{
      var D = JSON.parse(document.getElementById("pb-data").textContent);
      var byId = {{}}; D.stops.forEach(function (s) {{ byId[s.id] = s; }});
      var pick = document.getElementById("pb-pickup"), boxes = document.querySelectorAll(".pb-card input");
      function km(a, b) {{ var R = 6371, r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLn = (b.lng - a.lng) * r;
        var h = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLn / 2) * Math.sin(dLn / 2);
        return 2 * R * Math.asin(Math.sqrt(h)); }}
      // Rough LA driving: road distance about 1.35x straight line, about 25 km/h average, plus 5 min to park at each stop
      function drive(a, b) {{ return km(a, b) * 1.35 / 25 * 60 + 5; }}
      function routeMin(start, list) {{ var t = 0, at = start; list.forEach(function (s) {{ t += drive(at, s); at = s; }}); return t + (list.length ? drive(at, start) - 5 : 0); }}
      function fmt(h) {{ return (Math.round(h * 2) / 2).toString().replace(".5", "&frac12;"); }}
      function upd() {{
        var start = D.pickups.filter(function (p) {{ return p.id === pick.value; }})[0];
        var chosen = D.stops.filter(function (s) {{ return document.querySelector('.pb-card input[value="' + s.id + '"]').checked; }});
        var fwd = routeMin(start, chosen), rev = routeMin(start, chosen.slice().reverse());
        var order = rev < fwd ? chosen.slice().reverse() : chosen, driveMin = Math.min(fwd, rev);
        var stopMin = chosen.reduce(function (t, s) {{ return t + s.min; }}, 0);
        var lo = (stopMin + driveMin * 0.85) / 60, hi = (stopMin + driveMin * 1.4) / 60;
        var list = document.getElementById("pb-list");
        list.innerHTML = order.length ? order.map(function (s) {{ return "<li>" + s.name + "</li>"; }}).join("") : '<li class="pb-empty">Pick a stop or two to start.</li>';
        document.getElementById("pb-hours").innerHTML = order.length ? "about " + fmt(lo) + " to " + fmt(hi) + " hours" : "0 hours";
        document.getElementById("pb-drive").textContent = order.length ? "with about " + Math.round(driveMin / 5) * 5 + " min of driving" : "with driving";
        var fit = null;
        document.querySelectorAll(".pb-pkg").forEach(function (el) {{ el.classList.remove("is-fit"); }});
        if (order.length) {{ for (var i = 0; i < D.packages.length; i++) {{ if ((lo + hi) / 2 <= D.packages[i].hours) {{ fit = D.packages[i]; break; }} }} }}
        var fitEl = document.getElementById("pb-fit"), send = document.getElementById("pb-send");
        if (fit) {{
          document.querySelector('.pb-pkg[data-h="' + fit.hours + '"]').classList.add("is-fit");
          fitEl.innerHTML = "This fits a <strong>" + fit.label.toLowerCase() + "</strong>: $" + fit.price + " for your whole car.";
        }} else if (order.length) {{
          fitEl.textContent = "That's more than one day. Pick fewer stops, or message me and we'll plan two days.";
        }} else {{ fitEl.textContent = ""; }}
        var msg = "Hi Marlon, I'd like a private tour. Pickup: " + start.name + ". Stops: " + order.map(function (s) {{ return s.name; }}).join(", ") + (fit ? ". " + fit.label + " ($" + fit.price + ")." : ".");
        send.href = "https://wa.me/12692670410?text=" + encodeURIComponent(msg);
        send.setAttribute("aria-disabled", order.length ? "false" : "true");
      }}
      pick.addEventListener("change", upd); boxes.forEach(function (b) {{ b.addEventListener("change", upd); }});
      // Start with a classic first day so the tool shows what it does
      ["griffith", "sign", "urban"].forEach(function (id) {{ var b = document.querySelector('.pb-card input[value="' + id + '"]'); if (b) b.checked = true; }});
      upd();
    }})();
    </script>
  </section>

  <section class="tp-section">
    <div class="tp-wrap">
      <h2 class="tp-h2">Simple pricing, for your whole car</h2>
      <div class="tp-grid-3 tp-price-row">
        <div class="tp-card tp-center"><h3 class="tp-h3">Half day &middot; up to 4 hours</h3><div class="price">${PACKAGES[0][2]}</div><p>One or two areas, done well.</p></div>
        <div class="tp-card tp-center"><h3 class="tp-h3">Full day &middot; up to 8 hours</h3><div class="price">${PACKAGES[1][2]}</div><p>LA in a day, from the Hollywood Sign to the beach.</p></div>
        <div class="tp-card tp-center"><h3 class="tp-h3">Long day &middot; up to 12 hours</h3><div class="price">${PACKAGES[2][2]}</div><p>The whole day, from the beach to the city lights.</p></div>
      </div>
      <p style="margin-top:12px;color:#475569">One price for 1 to 4 guests, with hotel pickup and drop-off, driving and instant photos included. Parking and tickets at stops aren&rsquo;t included.</p>
    </div>
  </section>
'''

p = "private-top.html"
s = open(p, encoding="utf-8").read()
start = s.index('  <section class="tp-section">\n    <div class="tp-wrap">\n      <h2 class="tp-h2">Pick a starting point</h2>') if "Pick a starting point" in s else s.index("  <!-- ===== Build your day")
end_marker = '  <section class="tp-section tp-route-sec">'
end = s.index(end_marker)
s = s[:start] + SECTION + "\n" + s[end:]
open(p, "w", encoding="utf-8").write(s)
print("spliced builder into", p, len(s))
