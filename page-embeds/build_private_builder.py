# Builds the "Build your day" section for the Private Tours page and splices it into private-top.html
# (replaces the old "Pick a starting point" cards and the pricing row).
# Oct 17, 2026. Prices, stop times and drive speeds are Claude's ESTIMATES for Marlon to adjust:
# edit PRICES / STOPS / PICKUPS below and re-run. Price depends on group size (2 to 4) and hours.
import json, urllib.parse, re
# Oct 26, 2026: these Webflow assets were compressed to AVIF (same name, .avif). Builders must link .avif for them.
_AVIF = set(['6a5138c2a894bfc036a1417c', '6ac74a8b6dc6526aa1e35947', '6ad929b39a56d0d15964851d', '6ad929bf12667b254315c683', '6ad929db59b1d5ccebe76dc4', '6ad929dbc3398f1383c28856', '6ad929e61c74efa5d6a35519', '6ad929e6fd77e7c927620ea9', '6ad929ec3eeaaffdbe379a12', '6ad929ec9a56d0d159649ffd', '6ad929f3c0b148baa5f114ec', '6ad929f90bb99231ec0dacf2', '6ad929ff1c74efa5d6a36134', '6ad929ff382eda62d72912d0', '6ad929ffc027d0e6e95a8a41', '6ad92a060bb99231ec0db030', '6ad92a15bb9f2b81fb009b26', '6ad92a15fd77e7c927622751', '6ad92a443eeaaffdbe37b476', '6ad92a45a6c79d9f41578212', '6ad92c5db637fc8c5f9e0570', '6ad92ca74c83370c9cab47c3', '6ad92caa8bbf326c91e4750f', '6ad92cab137bdbc510c769a6', '6ad92cb38aa41f8f19cfc336', '6ad92cb3add8991e783fc5d8', '6ad92cb5d1848d20e07d8ea2', '6ad92fbdcc8517d84355a504', '6ad92fc1763e80ce77ca4c78', '6ad92fc8bdb0490f2eabadee', '6ad92fccefa7590f943fa69d', '6ad92fd00bb99231ec104ab0', '6ad92fe30bed1f1ae6022809', '6ad92ff02cbe8250c0b64f0d', '6ad92ff02cbe8250c0b65033', '6ad92ff6b2db7b6c094918fa', '6ad93001aaac111f9e725c08', '6ad930022cbe8250c0b65665'])

# Oct 19, 2026 pricing (Marlon): list $60 per person per hour. Group rates $40 / $30 / $25 per person per hour for 2 / 3 / 4 guests,
# and each extra 2-hour block is about 7% cheaper (12 hours costs the same as 10). Totals are for the WHOLE group at 2, 4, 6, 8, 10, 12 hours.
# Same table in build_home_private.py and private-tour-plan.html. Edit them together.
PRICES = {"2": [159, 309, 449, 579, 699, 799], "3": [179, 349, 499, 649, 779, 899], "4": [199, 389, 559, 719, 869, 999]}
LIST_RATE = 60
DROPOFF = 60
from build_home_private import TRIPS  # the six past trips (hours assumed for Venice Canals and Beach and Tacos)


def price_at(n, h):
    T = PRICES[str(n)]; x = min(12, max(2, h)); i = min(4, int((x - 2) // 2)); f = (x - 2 - i * 2) / 2
    return int((T[i] + (T[i + 1] - T[i]) * f) / 10 + 0.5) * 10 - 1


def trip_cards():
    out = []
    for r in [x for x in TRIPS if x[12]]:  # card = shown on the Private page (skips trips that reuse another trip's photos)
        rows = "".join(f'<p><span class="price">${int(price_at(n, r[2]) / n + 0.5)}</span> each for {n} &middot; ${price_at(n, r[2])} total</p>' for n in (2, 3, 4))
        was = int(LIST_RATE * 2 * r[2])
        sv = round((1 - price_at(4, r[2]) / (LIST_RATE * 4 * r[2])) * 100)
        msg = "Hi Marlon! I would like to do this trip from your site: " + r[4]
        img = f'<img src="https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/{r[10][0].split("|")[0]}{".avif" if r[10][0].split("|")[0].split("_")[0] in _AVIF else ".webp"}" alt="" loading="lazy" onerror="this.remove()" style="width:100%;aspect-ratio:4/3;object-fit:cover;object-position:{r[10][0].split("|")[1]};border-radius:8px;margin-bottom:10px">'
        out.append(f'<div class="tp-card tp-center">{img}<h3 class="tp-h3">{r[4]}</h3><p><strong>{r[2]} hours</strong></p><p>{r[6][0] if False else ", ".join(r[6])}</p>{rows}<p><span class="pcq-badge" style="background:#DFF5E3;color:#1E6B3A;padding:2px 10px;border-radius:99px;font-weight:700">Up to {sv}% off list price</span></p><p>{r[13]}</p><a class="tp-btn yellow" href="https://wa.me/12692670410?text={urllib.parse.quote(msg)}" target="_blank" rel="noopener">Ask about this trip</a></div>')
    return "".join(out)
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
    "prices": PRICES, "listRate": LIST_RATE,
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
grp_btns = "".join(f'<button type="button" class="pb-g" data-n="{n}" aria-pressed="{"true" if n == 2 else "false"}">{n}</button>' for n in (2, 3, 4))

SECTION = f'''  <!-- ===== Build your day (Oct 17, 2026). Built by page-embeds/build_private_builder.py. Prices and times are estimates for Marlon to confirm. ===== -->
  <section class="tp-section" id="build">
    <div class="tp-wrap">
      <h2 class="tp-h2">Build your day</h2>
      <p class="tp-sub">Tap the stops you want. You&rsquo;ll see about how long the day takes, with driving, and what it costs. The more of you, the less each of you pays.</p>
      <div class="pb">
        <div class="pb-left">
          <label class="pb-pick">Pickup from <select id="pb-pickup">{pick_opts}</select></label>
          <div class="pb-grid">{"".join(cards)}</div>
        </div>
        <aside class="pb-sum" aria-live="polite">
          <h3 class="pb-sum-h">Your day</h3>
          <ol class="pb-list" id="pb-list"><li class="pb-empty">Pick a stop or two to start.</li></ol>
          <div class="pb-total"><span id="pb-hours">0 hours</span><small id="pb-drive">with driving</small></div>
          <div class="pb-grp" role="group" aria-label="How many of you?"><span class="pb-grpl">How many of you?</span>{grp_btns}</div>
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
      .pb-sum {{ background: #fff; border: 1.5px solid #E4DCCB; border-radius: 14px; padding: 18px; box-shadow: 0 10px 26px -18px rgba(39, 48, 46, 0.6); }}
      .pb-sum-h {{ margin: 0 0 8px; font-size: 1.25rem; }}
      .pb-list {{ margin: 0 0 12px; padding-left: 20px; display: grid; gap: 3px; color: #27302E; font-size: 0.95rem; }}
      .pb-empty {{ list-style: none; margin-left: -20px; color: #64748b; }}
      .pb-total {{ display: flex; align-items: baseline; gap: 8px; margin: 6px 0 12px; }}
      .pb-total span {{ font-size: 1.45rem; font-weight: 900; color: #27302E; }}
      .pb-total small {{ color: #64748b; }}
      .pb-grp {{ display: flex; align-items: center; gap: 8px; margin: 4px 0 8px; }}
      .pb-grpl {{ font-weight: 800; font-size: 0.92rem; margin-right: 4px; }}
      .pb-g {{ font: inherit; font-weight: 800; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; background: #fff; color: #27302E; border: 2px solid #E4DCCB; }}
      .pb-g[aria-pressed="true"] {{ background: #FFD43B; border-color: #27302E; }}
      .pb-each {{ font-size: 1.7rem; font-weight: 900; color: #27302E; }}
      .pb-was {{ text-decoration: line-through; color: #64748b; }}
      .pb-badge {{ display: inline-block; margin-left: 6px; padding: 2px 10px; border-radius: 99px; background: #DFF5E3; color: #1E6B3A; font-weight: 800; font-size: 0.82rem; }}
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
      var n = 2;
      function priceAt(g, h) {{
        var T = D.prices[g], x = Math.min(12, Math.max(2, h)), i = Math.min(4, Math.floor((x - 2) / 2)), f = (x - 2 - i * 2) / 2;
        return Math.round((T[i] + (T[i + 1] - T[i]) * f) / 10) * 10 - 1;
      }}
      document.querySelectorAll(".pb-g").forEach(function (g) {{ g.addEventListener("click", function () {{
        n = +g.dataset.n; document.querySelectorAll(".pb-g").forEach(function (o) {{ o.setAttribute("aria-pressed", o === g ? "true" : "false"); }}); upd();
      }}); }});
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
        var fitEl = document.getElementById("pb-fit"), send = document.getElementById("pb-send"), q = null;
        if (order.length && lo <= 12) {{
          var hh = Math.min(hi, 12), pl = priceAt(n, lo), ph = priceAt(n, hh), list = Math.round(D.listRate * n * hh), pct = Math.round((1 - ph / list) * 100);
          q = {{ lo: pl, hi: ph }};
          fitEl.innerHTML = '<span class="pb-each">$' + Math.round(pl / n) + (ph !== pl ? "&ndash;" + Math.round(ph / n) : "") + '</span> each &middot; $' + pl + (ph !== pl ? " to $" + ph : "") + " total for " + n + ' people<br><span class="pb-was">List price $' + list + '</span><span class="pb-badge">You save ' + pct + '%</span>';
        }} else if (order.length) {{
          fitEl.textContent = "That's more than one day. Pick fewer stops, or message me and we'll plan two days.";
        }} else {{ fitEl.textContent = ""; }}
        var msg = "Hi Marlon, I'd like a private tour. Pickup: " + start.name + ". Stops: " + order.map(function (s) {{ return s.name; }}).join(", ") + ". " + n + " people" + (q ? ", about $" + q.hi + "." : ".");
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
      <h2 class="tp-h2">Trips we have done, with prices</h2>
      <p class="tp-sub">Real days with real guests. Pick one and Marlon runs it again for you, or changes it to fit. Prices are for 2, 3 or 4 guests. Hotel pickup, drop-off, driving and instant photos are included.</p>
      <div class="tp-grid-3 tp-price-row">${trip_cards()}</div>
      <p style="margin-top:18px;text-align:center"><a class="tp-btn yellow" href="https://wa.me/12692670410?text=Hi%20Marlon!%20Which%20trip%20do%20you%20recommend%3F%20Or%20I%20want%20to%20customize%20my%20own." target="_blank" rel="noopener">Tell Marlon which trip you want, or customize your own</a></p>
    </div>
  </section>

  <section class="tp-section">
    <div class="tp-wrap">
      <h2 class="tp-h2">Or build your own: more of you, less each</h2>
      <p class="tp-sub">List price is $60 per person per hour. Every extra person gets a better rate, and so does every extra 2 hours. Hotel pickup and drop-off, driving and instant photos are included.</p>
      <div class="tp-grid-3 tp-price-row">
        <div class="tp-card tp-center"><h3 class="tp-h3">Half day &middot; about 4 hours</h3><p><s>$60 each per hour</s></p>
          <p><span class="price">${int(PRICES["2"][1] / 2 + 0.5)}</span> each for 2 &middot; ${PRICES["2"][1]} total</p>
          <p><span class="price">${int(PRICES["3"][1] / 3 + 0.5)}</span> each for 3 &middot; ${PRICES["3"][1]} total</p>
          <p><span class="price">${int(PRICES["4"][1] / 4 + 0.5)}</span> each for 4 &middot; ${PRICES["4"][1]} total</p>
          <p>One or two areas, done well.</p></div>
        <div class="tp-card tp-center"><h3 class="tp-h3">Full day &middot; 9am to 9pm</h3><p><s>$60 each per hour</s></p>
          <p><span class="price">${int(PRICES["2"][5] / 2 + 0.5)}</span> each for 2 &middot; ${PRICES["2"][5]} total</p>
          <p><span class="price">${int(PRICES["3"][5] / 3 + 0.5)}</span> each for 3 &middot; ${PRICES["3"][5]} total</p>
          <p><span class="price">${int(PRICES["4"][5] / 4 + 0.5)}</span> each for 4 &middot; ${PRICES["4"][5]} total</p>
          <p>LA in a day, from the Hollywood Sign to the beach. 12 hours cost the same as 10.</p></div>
        <div class="tp-card tp-center"><h3 class="tp-h3">Short drop-off</h3><p>For guests who took a free tour</p><div class="price">${DROPOFF}</div>
          <p>One stop plus a drop-off, about 1 to 2 hours. Airport included: watch the planes land at the In-N-Out by LAX, or see the Hollywood Sign and get dropped at Griffith Observatory.</p></div>
      </div>
      <p style="margin-top:12px;color:#475569">Other lengths are in between: use the builder above. Parking and tickets at stops aren&rsquo;t included. Marlon confirms the final price.</p>
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
