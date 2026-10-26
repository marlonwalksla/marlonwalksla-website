# Builds page-embeds/free-passport.html (free tour passport, Downtown Classic). Oct 24, 2026.
# Uses the site's ink stamps (stamps.py): one per stop, ghosted until earned, inked when earned.
# Flow (Marlon, "art project"): tap a stamp = you were there -> a stop sheet with things to do there (from tour-dtla.js, see free-passport-stops.json)
# -> "Send a postcard from here" flips the whole passport over to a postcard back (the Home hero postcard: airmail edge, Polaroid, stamp, Ernesto)
# -> send it as one image. Layout: ONE booklet; blue cover on top on phones, on the left from about 520px.
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import stamps
HERE = os.path.dirname(os.path.abspath(__file__))

# id, top EN, top ES, icon, year, ink, rot, seed, map pin slug (None = own list), EN name, ES name
STOPS = [
 ("walt-disney-concert-hall", "WALT DISNEY CONCERT HALL", "SALA WALT DISNEY", "wdch", "2003", "#2B4F9E", -7, 8, "walt-disney-concert-hall", "Walt Disney Concert Hall", "Sala de Conciertos Walt Disney"),
 ("the-broad", "THE BROAD", "THE BROAD", "broad", "2015", "#C2352A", 6, 3, "the-broad", "The Broad", "The Broad"),
 ("angels-flight", "ANGELS FLIGHT", "ANGELS FLIGHT", "angels", "1901", "#2890B6", -4, 12, "angels-flight-railway", "Angels Flight", "Angels Flight"),
 ("grand-central-market", "GRAND CENTRAL MARKET", "MERCADO GRAND CENTRAL", "stall", "1917", "#E2662A", 5, 4, "grand-central-market", "Grand Central Market", "Mercado Grand Central"),
 ("bradbury-building", "BRADBURY BUILDING", "EDIFICIO BRADBURY", "bradbury", "1893", "#1B8A8F", 8, 14, "bradbury-building", "Bradbury Building", "Edificio Bradbury"),
 ("evolution-of-la-mural", "THE EVOLUTION OF LA", "EVOLUCI&Oacute;N DE LA", "mural", "", "#E89B00", -6, 9, None, "Evolution of LA mural", "Mural Evolución de LA"),
 ("la-city-hall", "LA CITY HALL", "AYUNTAMIENTO DE LA", "city_tower", "1928", "#2E9E57", 4, 6, "la-city-hall", "LA City Hall", "Ayuntamiento de LA"),
 ("hall-of-justice", "HALL OF JUSTICE", "PALACIO DE JUSTICIA", "justice", "1925", "#B8326E", -5, 11, None, "Hall of Justice", "Palacio de Justicia"),
 ("olvera-street", "PLACITA OLVERA", "PLACITA OLVERA", "papel", "1781", "#7A3FA0", -3, 17, "olvera-street-and-el-pueblo", "Olvera Street and El Pueblo", "Calle Olvera y El Pueblo"),
]
SHORT = [("Disney Hall", "Sala Disney"), ("The Broad", "The Broad"), ("Angels Flight", "Angels Flight"), ("Grand Central", "Grand Central"), ("Bradbury", "Bradbury"),
         ("LA mural", "Mural de LA"), ("City Hall", "Ayuntamiento"), ("Hall of Justice", "Palacio de Justicia"), ("Olvera Street", "Calle Olvera")]
# per-stop postcard look: paper tint, two airmail edge colors (stop ink + a complement), darker text accent
PAL = [("#E8EEF4","#8794A3","#2F7FC9","#2A5E92"),   # Disney Hall: brushed steel + sky blue
       ("#EEF0EE","#2B2B2B","#B7BEC4","#2B2B2B"),   # The Broad: concrete white, charcoal, grey
       ("#FFF2E3","#E8672A","#2A2A28","#B8480F"),   # Angels Flight: orange cars, black trim
       ("#FFF1DC","#D8362A","#F0B323","#B0261C"),   # Grand Central Market: neon red + marigold
       ("#F3E1CC","#C96A2B","#8E3B26","#8E3B26"),   # Bradbury: orange wood, brick, tan
       ("#E3EAF1","#4F86BD","#8B9096","#35597F"),   # Evolution of LA: blue wall, grey carving
       ("#F6DCC4","#E8782E","#FFFFFF","#B85410"),   # City Hall: orange tile, white
       ("#EDE8DC","#9C8B6E","#1F3A5F","#1F3A5F"),   # Hall of Justice: limestone + civic blue
       ("#FFF1DE","#D6336C","#1BA5A0","#B02558")]   # Olvera: papel picado pink, turquoise
# default postcard photo per stop, same order as STOPS (photo-only digital shots from the Free tour pages)
CDN = "https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/"
PHOTOS = ["6ad92a0d4c5d80802552eafc_place-disney-hall-02.webp","6ad92a57763e80ce77c7b7f9_place-the-broad-01.webp","6ad929f3c0b148baa5f114ec_place-angels-flight-01.webp",
          "6ad9a9756669a1ba934f62af_WhatsApp%20Image%202026-10-21%20at%2011.12.36%20PM.webp","6ad929ff1c74efa5d6a36134_place-bradbury-building-01.webp",
          "6ad92cb571259b0be160b001_guest-la-07.webp","6ad92a060bb99231ec0db030_place-city-hall-and-grand-park-02.webp",
          "6ada9a382938eba77644cf07_hall%20of%20justice.webp","6ad93001aaac111f9e725c08_place-olvera-street-and-avila-adobe-03.webp"]
# crop per default photo: [zoom, x, y]. Scans with a baked Instax/Polaroid border or people in a corner are cropped in.
VIEWS = [[1,.5,.4],[1,.5,.5],[1,.5,.25],[1.18,.5,.3],[1,.5,0],[2,.64,.11],[1,.5,.2],[1.18,.5,.28],[1,.15,.5]]
# One bonus ("level 2") per stop, Oct 25 2026 (Marlon): "do activity A at location 1". None = no bonus (murals and Hall of Justice have nothing more to do).
# Shared stamp: the camera icon in one pink ink (Ernesto-with-camera art goes here once it is a one-color stamp).
EXTRAS = [("Watch a concert here", "Ve un concierto aqu\u00ed"), ("Go inside the museum", "Entra al museo"), ("Ride Angels Flight", "Sube en Angels Flight"),
          ("Eat something from a market stall", "Come algo de un puesto del mercado"), ("Step into the lobby and look up", "Entra al vest\u00edbulo y mira hacia arriba"),
          None, ("Go up to the observation deck", "Sube al mirador"), None, ("Walk into the Avila Adobe", "Entra a la Casa Avila Adobe")]
XINK = "#C2185B"
BTOP = [("WATCHED A CONCERT", "VI UN CONCIERTO"), ("VISITED THE BROAD", "VISIT&Eacute; THE BROAD"), ("RODE ANGELS FLIGHT", "SUB&Iacute; A ANGELS FLIGHT"),
        ("ATE AT THE MARKET", "COM&Iacute; EN EL MERCADO"), ("LOOKED UP AT BRADBURY", "MIR&Eacute; HACIA ARRIBA"), None,
        ("CLIMBED CITY HALL", "SUB&Iacute; AL MIRADOR"), None, ("VISITED AVILA ADOBE", "ENTR&Eacute; A AVILA ADOBE")]
XS = [None if t is None else [stamps.stamp(f"fpx{n}e", t[0], "BONUS", "polaroid", "", XINK, -6, 21 + n, "", False, 96.0),
                              stamps.stamp(f"fpx{n}s", t[1], "EXTRA", "polaroid", "", XINK, -6, 21 + n, "", False, 96.0)] for n, t in enumerate(BTOP)]
XSJSON = json.dumps(XS, ensure_ascii=False).replace("</", "<\\/")
XJSON = json.dumps(EXTRAS, ensure_ascii=False)
GUIDE = json.load(open(os.path.join(HERE, "free-passport-stops.json")))  # things to do per stop, from tour-dtla.js

def btn(i, s):
    sid, en, es, icon, yr, ink, rot, seed, slug, len_, les = s
    e = stamps.stamp(f"fp{i}e", en, "LOS ANGELES", icon, f"EST. {yr}" if yr else "", ink, rot, seed, "", False, 96.0)
    sp = stamps.stamp(f"fp{i}s", es, "LOS &Aacute;NGELES", icon, f"DESDE {yr}" if yr else "", ink, rot, seed, "", False, 96.0)
    return (f'<button type="button" class="st" data-i="{i}"><span class="en">{e}</span><span class="es">{sp}</span>'
            f'<span class="lb en">{SHORT[i][0]}</span><span class="lb es">{SHORT[i][1]}</span><span class="vh">{len_}</span></button>')

BUTTONS = "".join(btn(i, s) for i, s in enumerate(STOPS))
DATA = ",".join("['%s',%s,'%s','%s']" % (s[0], ("'" + s[8] + "'") if s[8] else "null", s[9], s[10]) for s in STOPS)
PJSON = json.dumps([list(x) for x in PAL])
PHJSON = json.dumps([CDN + x for x in PHOTOS])
VJSON = json.dumps(VIEWS)
GJSON = json.dumps([[g["map"], g["en"], g["es"]] for g in GUIDE], ensure_ascii=False).replace("</", "<\\/")

HTML = r'''<!-- Free tour passport (Downtown Classic). GENERATED by build_free_passport.py, edit that file, not this one.
     Self-contained embed: no account, saved in this browser only.
     URLs: ?mode=start (QR 1, welcome)  ?mode=end (QR 2, auto-stamps + thank you)  ?lang=es (Spanish; /es paths too)
     Stamps with a pin slug share the map's visited list (localStorage marlon_visited_spots); stamps without a pin use marlon_stamps. -->
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Fredoka:wght@400;500;700&family=Lilita+One&family=Nunito:wght@400;700&display=swap" rel="stylesheet">
<style>
#fp{--peach:#FFEDE2;--sage:#DFE8C0;--olive:#30312B;--cream:#FDFCDF;--blue:#1D6F8F;--muted:#4A4B43;--red:#E8412F;max-width:560px;margin:0 auto;padding:16px 16px 40px;color:var(--olive);font-family:'Nunito',system-ui,sans-serif;font-size:16px;line-height:1.5;box-sizing:border-box}
#fp *{box-sizing:border-box}
#fp h1,#fp h2{font-family:'Lilita One',sans-serif;font-weight:400;margin:0;line-height:1.05}
#fp h2{font-size:28px;margin-bottom:10px}
#fp [hidden]{display:none!important}
/* flip: the whole passport turns over to the postcard */
#fp .flip{position:relative;perspective:1800px;transition:height .55s ease}
#fp .face{position:absolute;left:0;top:0;width:100%;backface-visibility:hidden;-webkit-backface-visibility:hidden;transition:transform .85s cubic-bezier(.4,.1,.2,1),visibility 0s .42s}
#fp .face *{backface-visibility:hidden;-webkit-backface-visibility:hidden}
#fp .face.back{transform:rotateY(180deg);visibility:hidden}
#fp .flip.flipped .face.back{visibility:visible}
#fp .flip.flipped .face.front{visibility:hidden}
#fp .flip.flipped .face.front{transform:rotateY(-180deg)}
#fp .flip.flipped .face.back{transform:rotateY(0)}
/* the booklet: cover + stamp page in one frame */
#fp .book{display:flex;flex-wrap:wrap;background:var(--cream);border:3px solid var(--olive);border-radius:24px;overflow:hidden;box-shadow:5px 5px 0 var(--olive)}
#fp .cover{flex:1 1 100%;background:var(--blue);color:var(--cream);padding:18px 18px 20px;display:flex;flex-direction:row;align-items:center;gap:14px;border-bottom:3px solid var(--olive);position:relative}
#fp .cover:after{content:"";position:absolute;left:0;right:0;bottom:-3px;height:3px;background:repeating-linear-gradient(90deg,var(--olive) 0 8px,transparent 8px 14px)}
#fp .kick{font-family:'Fredoka',sans-serif;font-weight:500;font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:.95}
#fp .cover h1{font-size:30px;margin-top:4px}
#fp .cover p{margin:6px 0 0;font-family:'Fredoka',sans-serif;font-size:16px;line-height:1.25;opacity:.95}
#fp .badge{flex:0 0 76px;width:76px;height:76px;border-radius:50%;border:4px solid var(--cream);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Lilita One',sans-serif;line-height:1;text-align:center}
#fp .badge b{font-weight:400;font-size:26px}
#fp .badge span{font-family:'Fredoka',sans-serif;font-weight:500;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-top:2px}
#fp .cmain{flex:1;min-width:0}
#fp .cbtn{display:inline-flex;align-items:center;justify-content:center;margin-top:12px;min-height:44px;padding:8px 18px;border-radius:999px;background:var(--cream);color:var(--olive);font-family:'Lilita One',sans-serif;font-size:20px;text-decoration:none;border:2px solid var(--olive);cursor:pointer}
#fp .cnote{margin:10px 0 0;font-family:'Fredoka',sans-serif;font-size:14px;opacity:.95}
#fp .pages{flex:1 1 100%;padding:18px 10px 14px}
#fp .grid{display:flex;flex-wrap:wrap}
#fp .st{flex:0 0 33.33%;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:2px;background:none;border:0;padding:4px;cursor:pointer;color:inherit;min-height:44px;position:relative;border-radius:14px}
#fp .st svg{width:100%;height:auto;display:block;transform:rotate(var(--r));transition:opacity .3s,filter .3s,transform .3s}
#fp .st:not(.on) svg{opacity:.34;filter:grayscale(1)}
#fp .st.on svg{opacity:1;transform:rotate(var(--r)) scale(1.03)}
#fp .st.sel{background:rgba(29,111,143,.12);box-shadow:0 0 0 3px var(--blue) inset}
#fp .lb{font-family:'Fredoka',sans-serif;font-weight:500;font-size:14px;line-height:1.1;text-align:center;color:var(--olive)}
#fp .st:not(.on) .lb{color:var(--muted);font-weight:400}
#fp .vh{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
#fp .st>.en{display:block;width:100%}#fp .st>.es{display:none;width:100%}#fp.is-es .st>.en{display:none}#fp.is-es .st>.es{display:block}
#fp .st>.vh{display:block;width:1px}
#fp .es{display:none}#fp.is-es .es{display:inline}#fp.is-es .en{display:none}
#fp .note{font-family:'Fredoka',sans-serif;font-size:14px;color:var(--muted);text-align:center;margin:6px 0 0}
@media (min-width:520px){
 #fp .cover{flex:0 0 190px;flex-direction:column;align-items:stretch;justify-content:space-between;gap:20px;padding:22px 18px;border-bottom:0;border-right:3px solid var(--olive)}
 #fp .cover:after{left:auto;right:-3px;top:0;bottom:0;width:3px;height:auto;background:repeating-linear-gradient(180deg,var(--olive) 0 8px,transparent 8px 14px)}
 #fp .cover h1{font-size:28px}
 #fp .badge{align-self:center;order:2;flex-basis:auto}
 #fp .cmain{order:1;flex:0 0 auto}
 #fp .pages{flex:1 1 300px;min-width:0;padding:20px 12px 14px}
}
/* stop sheet: what to do where you just stamped */
#fp .sheet{margin-top:20px;background:#fff;border:3px solid var(--olive);border-radius:20px;padding:18px;animation:fpin .35s ease}
@keyframes fpin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
#fp .sheet .chip{display:inline-block;font-family:'Fredoka',sans-serif;font-weight:500;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;background:var(--sage);border:2px solid var(--olive);border-radius:999px;padding:2px 12px}
#fp .sheet h2{margin:8px 0 2px}
#fp .sheet .todo{font-family:'Fredoka',sans-serif;font-weight:500;font-size:14px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin:12px 0 4px}
#fp .sheet .tip{border-top:2px solid var(--olive);padding:10px 0;font-size:15px;line-height:1.45}
#fp .sheet .tip b{display:block;font-family:'Fredoka',sans-serif;font-weight:500;font-size:17px}
#fp .sheet .tip ul{margin:4px 0 0;padding-left:20px}
#fp .sheet a.lnk,#fp .lnk{background:none;border:0;padding:8px 0;min-height:44px;font:inherit;font-family:'Fredoka',sans-serif;font-size:14px;color:var(--muted);text-decoration:underline;cursor:pointer;display:inline-block}
/* postcard back (the Home hero postcard) */
#fp .pcb{--bg:#FFF8EC;--a:#E8412F;--b:#2890B6;--t:#E8412F;background:var(--bg);border:3px solid var(--olive);border-radius:24px;padding:14px 14px 18px;box-shadow:5px 5px 0 var(--olive)}
#fp .pcb-top{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
#fp .pcb select{font:inherit;font-size:15px;padding:6px 10px;border:2px solid var(--olive);border-radius:10px;background:#fff;color:var(--olive);max-width:60%}
#fp .paper{position:relative;margin-top:10px;background:var(--bg);padding:28px 22px 18px}
#fp .paper:before{content:"";position:absolute;inset:0;border:11px solid transparent;border-image:repeating-linear-gradient(-45deg,var(--a) 0 16px,transparent 16px 26px,var(--b) 26px 42px,transparent 42px 52px) 11;pointer-events:none}
#fp .paper>*{position:relative}
#fp .pp-head small{display:block;font-family:'Fredoka',sans-serif;font-weight:500;font-size:12px;letter-spacing:1.6px;text-transform:uppercase}
#fp .pp-head b{font-family:'Lilita One',sans-serif;font-weight:400;font-size:28px;line-height:1.05}
#fp .pol{position:relative;width:78%;margin:14px auto 6px;background:#fff;padding:9px 9px 34px;border-radius:3px;box-shadow:0 4px 10px rgba(0,0,0,.25);transform:rotate(2deg);cursor:pointer}
#fp .pol .tape{position:absolute;left:50%;top:-12px;width:78px;height:22px;margin-left:-39px;background:rgba(255,190,140,.8);background:color-mix(in srgb,var(--a) 55%,#fff);opacity:.9;transform:rotate(-3deg)}
#fp .pol-img{aspect-ratio:1/1;background:color-mix(in srgb,var(--b) 25%,#fff) 0 0/cover no-repeat;overflow:hidden;display:flex;align-items:center;justify-content:center;text-align:center;font-family:'Fredoka',sans-serif;font-weight:500;font-size:15px;color:var(--muted);padding:10px}
#fp .pol-img.has{cursor:grab;touch-action:none}
#fp .pctl{margin-top:12px;background:#fff;border:2px solid var(--olive);border-radius:16px;padding:10px 12px 8px;position:relative}
#fp .pctl:after{content:"";position:absolute;left:50%;bottom:-9px;width:14px;height:14px;margin-left:-7px;background:#fff;border-right:2px solid var(--olive);border-bottom:2px solid var(--olive);transform:rotate(45deg)}
#fp .pctl-h{font-family:'Fredoka',sans-serif;font-weight:500;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted)}
#fp .pctl-row{display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;margin-top:4px}
#fp .pbtn{min-height:40px;padding:6px 16px;border-radius:999px;border:2px solid var(--olive);background:#FFDD55;color:var(--olive);font-family:'Fredoka',sans-serif;font-weight:500;font-size:15px;cursor:pointer}
#fp .pctl-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
#fp .zm{display:flex;align-items:center;gap:10px;width:100%;margin-top:10px;font-family:'Fredoka',sans-serif;font-weight:500;font-size:14px;color:var(--muted)}
#fp .zm input{flex:1;min-width:80px;accent-color:var(--t)}
#fp .post{position:absolute;right:-38px;top:-26px;width:104px;transform:rotate(-8deg);pointer-events:none}
#fp .post svg{width:100%;height:auto;display:block;transform:none}
#fp .pp-line{display:flex;align-items:baseline;gap:8px;margin-top:12px}
#fp .pp-line span{font-family:'Caveat','Fredoka',cursive;font-size:30px;color:var(--t);flex:none;min-width:52px}
#fp .pp-line input{flex:1;min-width:0;font-family:'Caveat','Fredoka',cursive;font-size:32px;color:var(--olive);background:rgba(255,255,255,.65);border:2px dashed var(--t);border-radius:10px;padding:0 10px}
#fp .pp-line input::placeholder,#fp .pp-msg::placeholder{color:rgba(48,49,43,.4)}
#fp .pp-msg{width:100%;margin-top:12px;font-family:'Caveat','Fredoka',cursive;font-size:30px;line-height:1.15;color:var(--olive);background:rgba(255,255,255,.65);border:2px dashed var(--t);border-radius:10px;padding:8px 12px;min-height:120px;resize:none;overflow:hidden;display:block}
#fp .pp-ft{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:10px;border-top:2px solid var(--olive);padding-top:10px;font-family:'Fredoka',sans-serif;font-size:13px;line-height:1.3}
#fp .pp-ft img{width:52px;height:52px;border-radius:50%;flex:none}
#fp .pp-ft>span{flex:1 1 180px;min-width:0}
#fp .pp-ft .cluster{flex:1 1 100%;max-width:none;margin:4px 0 0}
#fp .pp-ft em{display:block;font-family:'Caveat','Fredoka',cursive;font-style:normal;font-size:24px;color:var(--t);line-height:1}
#fp input[type=file]{position:absolute;opacity:0;width:1px;height:1px}
#fp .btn{display:flex;align-items:center;justify-content:center;min-height:48px;padding:12px;border-radius:999px;text-decoration:none;text-align:center;font-family:'Lilita One',sans-serif;font-size:22px;border:2px solid var(--olive);cursor:pointer;margin-top:12px;width:100%}
#fp .btn.main{background:var(--olive);color:var(--peach)}
#fp .btn.yel{background:#FFDD55;color:var(--olive)}
#fp .btn.line{background:none;color:var(--olive);font-family:'Fredoka',sans-serif;font-weight:500;font-size:18px}
#fp .dark{background:var(--olive);color:var(--peach);border-radius:20px;padding:20px;margin-top:20px}
#fp .dark p{margin:0 0 4px;font-family:'Fredoka',sans-serif;line-height:1.35}
#fp .xt{display:flex;align-items:center;gap:12px;width:100%;margin-top:14px;padding:8px 12px 8px 8px;background:var(--sage);border:2px solid var(--olive);border-radius:16px;cursor:pointer;color:inherit;text-align:left;font:inherit}
#fp .xt .xs{flex:0 0 76px;width:76px}
#fp .xt svg{width:100%;height:auto;display:block;transition:opacity .3s,filter .3s}
#fp .xt:not(.on) svg{opacity:.34;filter:grayscale(1)}
#fp .xt b{display:block;font-family:'Fredoka',sans-serif;font-weight:500;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted)}
#fp .xt .xtx{font-family:'Fredoka',sans-serif;font-weight:500;font-size:18px;line-height:1.2}
#fp .xt small{display:block;font-family:'Fredoka',sans-serif;font-size:13px;color:var(--muted);margin-top:2px}
#fp .cluster{display:flex;flex-wrap:wrap;justify-content:center;margin:0 auto;max-width:360px}
#fp .cluster:empty{display:none}
#fp .cluster span{flex:0 0 20%;max-width:20%;display:block;margin:0 -2px}
#fp .cluster svg{width:100%;height:auto;display:block;transform:rotate(var(--r))}
#fp .stk{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
#fp .stl{flex:0 0 100%;font-family:'Fredoka',sans-serif;font-weight:500;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-top:4px}
#fp .sp{width:58px;height:58px;padding:2px;border:2px solid transparent;border-radius:12px;background:none;cursor:pointer;opacity:.45}
#fp .sp.full{opacity:.2;filter:grayscale(1);cursor:not-allowed}
#fp .note.warn{color:#B3261E;font-weight:700}
#fp .note.shake{animation:fpshake .4s}
@keyframes fpshake{0%,100%{transform:none}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
#fp .sp.on{opacity:1;border-color:var(--olive);background:#fff}
#fp .sp svg{width:100%;height:auto;display:block}
#fp .btn.rmv{color:#B3261E;border-color:#B3261E;font-family:'Fredoka',sans-serif;font-weight:500;font-size:17px;min-height:48px}
@media (min-width:860px){
 #fp{max-width:940px}
 #fp .cover{flex-basis:270px}
 #fp .grid{max-width:560px;margin:0 auto}
 #fp .sheet #fp-sh-tips{display:grid;grid-template-columns:1fr 1fr;gap:0 28px}
 #fp .sheet .btn{max-width:420px}
 #fp .paper{display:grid;grid-template-columns:1.05fr 1fr;grid-template-areas:"head pol" "fr pol" "tt pol" "msg pol" "ft ft";column-gap:40px;padding:40px 44px 22px;align-items:start}
 #fp .paper>.pp-head{grid-area:head}#fp .paper>.pcol{grid-area:pol}#fp .pcol .pol{width:88%;margin:6px auto 0}
 #fp .paper>.fr{grid-area:fr}#fp .paper>.tt{grid-area:tt}#fp .paper>.pp-msg{grid-area:msg;min-height:190px}#fp .paper>.pp-ft{grid-area:ft;margin-top:18px}
 #fp .pp-head b{font-size:44px}
 #fp .pp-msg{font-size:36px}
 #fp .pp-ft .cluster{flex:0 0 330px;margin:0 0 0 auto}
 #fp .post{width:130px;right:-44px;top:-34px}
 #fp .pcb{padding:18px 20px 22px}
 #fp .btn{max-width:420px;margin-left:auto;margin-right:auto}
}
#fp :focus-visible{outline:3px solid var(--olive);outline-offset:2px;border-radius:12px}
@media (prefers-reduced-motion:reduce){#fp .note.shake{animation:none}#fp .st svg,#fp .face,#fp .flip{transition:none}#fp .sheet{animation:none}}
</style>
<div id="fp" aria-live="polite">
  <div class="flip" id="fp-flip">
    <div class="face front" id="fp-front">
      <div class="book">
        <div class="cover">
          <div class="cmain">
            <div class="kick" id="fp-kick"></div>
            <h1 id="fp-h"></h1>
            <p id="fp-sub"></p>
            <button type="button" class="cbtn" id="fp-pcgo" hidden></button>
            <p class="cnote" id="fp-cnote"></p>
          </div>
          <div class="badge" role="img" id="fp-badge"><b id="fp-n">0</b><span id="fp-of"></span></div>
        </div>
        <div class="pages">
          <div class="grid" id="fp-grid">@@BUTTONS@@</div>
          <p class="note" id="fp-save"></p>
        </div>
      </div>
    </div>
    <div class="face back" id="fp-back" aria-hidden="true" inert>
      <div class="pcb">
        <div class="pcb-top">
          <button type="button" class="lnk" id="fp-pc-back"></button>
          <select id="fp-pc-place" aria-label="Place"></select>
        </div>
        <div class="pctl" role="group" aria-labelledby="fp-pctl-h">
          <div class="pctl-top"><div class="pctl-h" id="fp-pctl-h"></div><button type="button" class="pbtn" id="fp-chg"></button></div>
          <label class="zm"><span id="fp-zl"></span><input type="range" id="fp-zoom" min="1" max="3" step="0.02" value="1"></label>
          <button type="button" class="lnk" id="fp-dflt" hidden></button>
          <p class="note" id="fp-phint" style="text-align:left;margin:2px 0 0"></p>
          <div class="pctl-h" id="fp-sth" style="margin-top:12px"></div>
          <div class="stk" id="fp-stk"></div>
          <p class="note" id="fp-ste" style="text-align:left;margin:4px 0 0"></p>
        </div>
        <div class="paper">
          <div class="pp-head"><small id="fp-pv-gr"></small><b id="fp-pv-place"></b></div>
          <div class="pcol"><div class="pol" id="fp-pol" role="button" tabindex="0">
            <div class="tape"></div>
            <div class="pol-img" id="fp-pv-ph"><span id="fp-pv-empty"></span></div>
            <div class="post" id="fp-post" aria-hidden="true"></div>
          </div></div>
          <input id="fp-pc-file" type="file" accept="image/*">
          <div class="pp-line fr"><span id="fp-l-from"></span><input id="fp-pc-from" type="text" maxlength="16" autocomplete="given-name"></div>
          <div class="pp-line tt"><span id="fp-l-to"></span><input id="fp-pc-to" type="text" maxlength="40" autocomplete="off"></div>
          <textarea class="pp-msg" id="fp-pc-msg" maxlength="140" aria-label="Message"></textarea>
          <div class="pp-ft"><img src="https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/6a052bdf15f429ade21cc6f5_Circle%20Full.webp" alt="" crossorigin="anonymous"><span><em id="fp-and"></em>MarlonWalksLA &middot; @marlonwalksla<br>WhatsApp +1 269 267 0410 &middot; marlonwalksla.com</span><div class="cluster" id="fp-cl"></div></div>
        </div>
        <button class="btn main" id="fp-pc-send" type="button"></button>
        <button class="btn line" id="fp-pc-save" type="button"></button>
        <p class="note" id="fp-pc-priv"></p>
      </div>
    </div>
  </div>
  <p class="fp-maplink" style="text-align:center;margin:14px 0 0"><a class="btn line" id="fp-allmap"></a></p>
  <div class="sheet" id="fp-sheet" hidden>
    <span class="chip" id="fp-sh-chip"></span>
    <h2 id="fp-sh-h"></h2>
    <div class="todo" id="fp-sh-todo"></div>
    <div id="fp-sh-tips"></div>
    <button class="xt" id="fp-xt" type="button" hidden><span class="xs" id="fp-xt-i"></span><span><b id="fp-xt-k"></b><span class="xtx" id="fp-xt-t"></span><small id="fp-xt-s"></small></span></button>
    <button class="btn main" id="fp-sh-card" type="button"></button>
    <a class="btn line" id="fp-sh-map" target="_blank" rel="noopener"></a>
    <a class="btn line" id="fp-sh-onmap"></a>
    <button class="btn line rmv" id="fp-sh-rm" type="button"></button>
  </div>
  <div id="fp-start" hidden><a class="btn main" id="fp-go" href="#fp-grid"></a></div>
  <div id="fp-end" hidden>
    <div class="dark">
      <h2 id="fp-rv-h" style="color:var(--peach)"></h2>
      <p id="fp-rv-p"></p>
      <a class="btn yel" id="fp-rv" target="_blank" rel="noopener"></a>
      <p class="note" id="fp-rv-n" style="color:var(--peach);opacity:.9"></p>
    </div>
  </div>
  <a class="btn line" id="fp-map" href="/maps"></a>
  <a class="btn line" id="fp-ig" href="https://www.instagram.com/marlonwalksla/" target="_blank" rel="noopener"></a>
  <a class="btn line" id="fp-wa" href="https://wa.me/12692670410" target="_blank" rel="noopener"></a>
  <button class="btn line" id="fp-reset" type="button" style="border-color:transparent;font-size:14px;min-height:44px"></button>
</div>
<script>
(function(){
  // TODO Marlon: paste your Google review link here (Google Business Profile > Ask for reviews). Fallback is a search for your reviews.
  var REVIEW_URL='';
  var P=new URLSearchParams(location.search);
  var es=P.get('lang')==='es'||/^\/es(\/|$)/.test(location.pathname);
  var mode=P.get('mode');
  var T=es?{
    kick:'Pasaporte',h:{start:'Bienvenidos. Vamos a explorar el centro.',end:'9 sellos. Lo lograste.',def:'Clásico del Centro'},
    sub:{start:'Toca cada sello cuando llegues a cada parada.',end:'El Clásico del Centro está completo.',def:'9 sellos para ganar caminando.'},
    of:'de 9',save:'Guardado en este teléfono. Sin cuenta.',
    pcgo:'Enviar una postal',cn0:'Toca un sello cuando llegues. Cada parada trae cosas por hacer y una postal.',cn1:'Cada sello abre una postal.',
    chip:'Sello ganado',todo:'Qué hacer aquí',card:'Enviar una postal desde aquí',dir:'Cómo llegar',onmap:'Ver en el mapa',allmap:'Ver mi pasaporte en el mapa',rm:'Quitar este sello',
    back:'← Volver al pasaporte',gr:'Saludos desde',from:'De',to:'Para',and:'¡Marlon y Ernesto!',amp:'y',sth:'Agrega tus sellos',full:'completo',stf:'Ya tienes el máximo. Toca un sello elegido para cambiarlo.',sa:'Lo que hice',sw:'Adónde fui',edh:'Escribe tu nota',edp:'Toca las cajas con línea punteada en la postal para escribir tus nombres y tu mensaje.',phf:'Tu nombre',pht2:'Su nombre',stp:'Elige hasta 5 de los que ganaste. Van en la postal.',ste:'Gana más sellos en el recorrido para agregarlos aquí.',up:'Toca para agregar tu foto',pht:'Tu foto',chg:'Cambiar foto',zl:'Zoom',dflt:'Usar la foto de la parada',hint:'Arrastra la foto para moverla. \u00bfFoto de una Polaroid? Haz zoom hasta que solo la imagen llene el marco.',
    def:function(p){return 'Estoy explorando '+p+' con Marlon y Ernesto. ¡Ojalá estuvieras aquí!'},
    send:'Enviar mi postal',pcsave:'Guardar la imagen',priv:'Tu foto se queda en tu teléfono hasta que la envíes.',
    go:'Empezar a sellar',xk:'Extra',xh:'Toca cuando lo hayas hecho',xd:'Hecho',xn:'extra',rvh:'¿Qué tal la caminata?',rvp:'Una reseña honesta ayuda a otros viajeros a encontrar un tour como este.',rv:'Dejar una reseña en Google',rvn:'Toma unos 30 segundos. Necesitas iniciar sesión en Google.',
    map:'Abrir el mapa de LA',ig:'Sigue a @marlonwalksla',wa:'Escribe a Marlon por WhatsApp',reset:'Borrar mis sellos del pasaporte',
    confirm:'¿Borrar todos los sellos de este pasaporte?',sig:'Explora LA con Marlon: https://www.marlonwalksla.com'
  }:{
    kick:'Passport',h:{start:"Welcome. Let's explore downtown.",end:'9 stamps. You did it.',def:'Downtown Classic'},
    sub:{start:'Tap each stamp when you reach each stop.',end:'Downtown Classic is complete.',def:'9 stamps to earn on foot.'},
    of:'of 9',save:'Saved on this phone. No account.',
    pcgo:'Send a postcard',cn0:'Tap a stamp when you get there. Every stop comes with things to do and a postcard.',cn1:'Every stamp opens a postcard.',
    chip:'Stamp earned',todo:'Things to do here',card:'Send a postcard from here',dir:'Directions',onmap:'See it on the map',allmap:'See my passport on the map',rm:'Remove this stamp',
    back:'← Back to my passport',gr:'Greetings from',from:'From',to:'To',and:'Marlon & Ernesto!',amp:'&',sth:'Add your stamps',full:'full',stf:'That is the max. Tap a chosen stamp to swap it out.',sa:'What I did',sw:'Where I went',edh:'Write your note',edp:'Tap the dashed boxes on the card to type your names and your message.',phf:'Your name',pht2:'Their name',stp:'Pick up to 5 you earned. They go on the postcard.',ste:'Earn more stamps on your walk to add them here.',up:'Tap to add your photo',pht:'Your photo',chg:'Change photo',zl:'Zoom',dflt:'Use the stop photo',hint:'Drag the photo to move it. Photo of a Polaroid? Zoom in until only the picture fills the frame.',
    def:function(p){return "I'm exploring "+p+' with Marlon and Ernesto. Wish you were here!'},
    send:'Send my postcard',pcsave:'Save the image',priv:'Your photo stays on your phone until you send it.',
    go:'Start stamping',xk:'Bonus',xh:"Tap when you've done it",xd:'Done',xn:'bonus',rvh:'How was the walk?',rvp:'However it went, an honest review helps other travelers find a walk like this.',rv:'Leave a Google review',rvn:'Takes about 30 seconds. You need to be signed in to Google.',
    map:'Open the LA map',ig:'Follow @marlonwalksla',wa:'Message Marlon on WhatsApp',reset:'Clear my passport stamps',
    confirm:'Clear all stamps on this passport?',sig:'Explore LA with Marlon: https://www.marlonwalksla.com'
  };
  // id, pin slug (null = own list), EN name, ES name
  var S=[@@DATA@@];
  // [directions url, things to do EN, things to do ES] per stop (from tour-dtla.js)
  var G=@@GUIDE@@;
  // postcard look per stop: paper tint, edge color 1, edge color 2, text accent
  var PAL=@@PAL@@;
  // default photo per stop
  var PH=@@PHOTOS@@;
  var VW=@@VIEWS@@;
  var ERN='https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/6a052bdf15f429ade21cc6f5_Circle%20Full.webp';
  var root=document.getElementById('fp');if(es)root.classList.add('is-es');
  function rd(k){try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}}
  function wr(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function has(s){return s[1]?rd('marlon_visited_spots').indexOf(s[1])>-1:rd('marlon_stamps').indexOf(s[0])>-1}
  function set(s,on){
    var k=s[1]?'marlon_visited_spots':'marlon_stamps',id=s[1]||s[0],a=rd(k),i=a.indexOf(id);
    if(on&&i<0)a.push(id);if(!on&&i>-1)a.splice(i,1);wr(k,a);
  }
  var XT=@@EXTRAS@@;
  var XS=@@XS@@;
  var MAXS=5,selK=[],stTouched=false,kn=0;
  function xhas(i){return rd('marlon_extras').indexOf(S[i][0])>-1}
  function xset(i,on){var a=rd('marlon_extras'),k=a.indexOf(S[i][0]);if(on&&k<0)a.push(S[i][0]);if(!on&&k>-1)a.splice(k,1);wr('marlon_extras',a)}
  function xcount(){var n=0;S.forEach(function(s,i){if(XT[i]&&has(s)&&xhas(i))n++});return n}
  var $=function(i){return document.getElementById(i)};
  var btns=[].slice.call(document.querySelectorAll('#fp .st'));
  var cur=-1,flipped=false,msgTouched=false,photo=null,photoOk=true,custom=false,z=1,px=.5,py=.5,tok=0,ernImg=null;
  var flip=$('fp-flip'),front=$('fp-front'),back=$('fp-back');
  function name(i){return es?S[i][3]:S[i][2]}
  function fit(){var f=flipped?back:front;flip.style.height=(f.offsetHeight+8)+'px'}
  function render(){
    var n=S.filter(has).length,m=mode==='start'||mode==='end'?mode:'def';
    $('fp-h').textContent=(m==='def'&&n===9)?T.h.end:T.h[m];
    $('fp-sub').textContent=(m==='def'&&n===9)?T.sub.end:T.sub[m];
    $('fp-n').textContent=n;
    $('fp-badge').setAttribute('aria-label',n+' '+T.of);
    btns.forEach(function(b,i){var on=has(S[i]);b.classList.toggle('on',on);b.classList.toggle('sel',i===cur);b.setAttribute('aria-pressed',on?'true':'false')});
    $('fp-pcgo').hidden=n<1;$('fp-pcgo').textContent=T.pcgo;
    var xc=xcount();$('fp-cnote').textContent=(n<1?T.cn0:(n<9?T.cn1:''))+(xc?(n<9?' ':'')+'+ '+xc+' '+T.xn:'');
    fillPlaces();
    var am=$('fp-allmap');if(am){am.textContent=T.allmap;am.href='/maps?passport=downtown-classic'+(es?'&lang=es':'');}
    fit();
  }
  /* stop sheet */
  function openSheet(i){
    cur=i;var g=G[i],tips=(es?g[2]:g[1]);
    $('fp-sh-chip').textContent='✓ '+T.chip;$('fp-sh-h').textContent=name(i);$('fp-sh-todo').textContent=T.todo;
    $('fp-xt-i').innerHTML=XT[i]?XS[i][es?1:0]:'';
    var h='';tips.forEach(function(t){h+='<div class="tip"><b>'+t[0]+'</b>'+t[1]+'</div>'});$('fp-sh-tips').innerHTML=h;
    $('fp-sh-card').textContent=T.card;$('fp-sh-map').textContent=T.dir;$('fp-sh-map').href=g[0];$('fp-sh-onmap').textContent=T.onmap;$('fp-sh-onmap').href='/maps?passport=downtown-classic&spot='+(S[i][1]||S[i][0])+(es?'&lang=es':'');$('fp-sh-rm').textContent=T.rm;
    var xb=$('fp-xt');xb.hidden=!XT[i];
    if(XT[i]){xb.classList.toggle('on',xhas(i));$('fp-xt-k').textContent=T.xk;$('fp-xt-t').textContent=es?XT[i][1]:XT[i][0];$('fp-xt-s').textContent=xhas(i)?'\u2713 '+T.xd:T.xh}
    $('fp-sheet').hidden=false;render();
    setTimeout(function(){try{$('fp-sheet').scrollIntoView({behavior:'smooth',block:'nearest'})}catch(e){}},60);
  }
  btns.forEach(function(b,i){b.onclick=function(){if(!has(S[i]))set(S[i],true);openSheet(i)}});
  $('fp-xt').onclick=function(){if(cur<0||!XT[cur])return;xset(cur,!xhas(cur));openSheet(cur)};
  $('fp-sh-rm').onclick=function(){if(cur>-1){set(S[cur],false);xset(cur,false)}cur=-1;$('fp-sheet').hidden=true;render()};
  $('fp-sh-card').onclick=function(){openCard(cur)};
  $('fp-pcgo').onclick=function(){var i=cur>-1&&has(S[cur])?cur:-1;if(i<0)for(var k=S.length-1;k>=0;k--)if(has(S[k])){i=k;break}openCard(i)};
  /* postcard */
  function fillPlaces(){
    var sel=$('fp-pc-place'),keep=sel.value;sel.innerHTML='';
    S.forEach(function(s,i){if(has(s)){var o=document.createElement('option');o.value=i;o.textContent=name(i);sel.appendChild(o)}});
    if(keep!==''&&has(S[+keep]))sel.value=keep;
  }
  function openCard(i){
    if(i<0)return;fillPlaces();$('fp-pc-place').value=i;updCard(true);setFlip(true);
  }
  function setFlip(on){
    flipped=on;flip.classList.toggle('flipped',on);
    if(on){back.removeAttribute('inert');back.setAttribute('aria-hidden','false');front.setAttribute('inert','');front.setAttribute('aria-hidden','true');$('fp-sheet').hidden=true}
    else{front.removeAttribute('inert');front.setAttribute('aria-hidden','false');back.setAttribute('inert','');back.setAttribute('aria-hidden','true')}
    fit();setTimeout(function(){try{flip.scrollIntoView({behavior:'smooth',block:'start'})}catch(e){}},50);
  }
  $('fp-pc-back').onclick=function(){setFlip(false)};
  function grow(){var m=$('fp-pc-msg');m.style.height='auto';m.style.height=(m.scrollHeight+4)+'px'}
  function fromName(){return $('fp-pc-from').value.trim().slice(0,16)}
  function andTxt(){var f=fromName();return f?(es?'\u00a1'+f+', Marlon y Ernesto!':f+', Marlon & Ernesto!'):T.and}
  /* stamps on the postcard: pick up to 4 from the ones earned (bonuses first, then other stops) */
  function reid(svg,pref){var m=svg.match(/id="([^"]+)-f"/);return m?svg.split(m[1]).join(pref+m[1]):svg}
  function svgOf(k){var t=k.charAt(0),i=+k.slice(1);if(t==='b')return XS[i][es?1:0];var v=btns[i].querySelector(es?'.es svg':'.en svg');return v?v.outerHTML:''}
  function stLabel(k){var i=+k.slice(1);return k.charAt(0)==='b'?XT[i][es?1:0]:name(i)}
  function cands(){var pl=+$('fp-pc-place').value,a=[];S.forEach(function(s,i){if(XT[i]&&has(s)&&xhas(i))a.push('b'+i)});S.forEach(function(s,i){if(i!==pl&&has(s))a.push('s'+i)});return a}
  function drawStamps(){
    var c=cands();
    if(!stTouched)selK=c.slice(0,MAXS);else selK=selK.filter(function(k){return c.indexOf(k)>-1});
    var pk=$('fp-stk');pk.innerHTML='';
    function mk(k){
      var b=document.createElement('button'),on=selK.indexOf(k)>-1;b.type='button';b.className='sp'+(on?' on':'')+(!on&&selK.length>=MAXS?' full':'');b.setAttribute('aria-pressed',on?'true':'false');b.setAttribute('aria-label',stLabel(k));if(!on&&selK.length>=MAXS)b.setAttribute('aria-disabled','true');
      b.innerHTML=reid(svgOf(k),'p'+(++kn));
      b.onclick=function(){var x=selK.indexOf(k);if(x<0&&selK.length>=MAXS){var n=$('fp-ste');n.classList.remove('shake');void n.offsetWidth;n.classList.add('shake');return}if(x>-1)selK.splice(x,1);else if(selK.length<MAXS)selK.push(k);stTouched=true;drawStamps()};
      pk.appendChild(b);
    }
    function grp(label,keys){if(!keys.length)return;var h=document.createElement('div');h.className='stl';h.textContent=label;pk.appendChild(h);keys.forEach(mk)}
    grp(T.sa,c.filter(function(k){return k.charAt(0)==='b'}));
    grp(T.sw,c.filter(function(k){return k.charAt(0)==='s'}));
    var full=selK.length>=MAXS;
    $('fp-sth').textContent=T.sth+(c.length?' ('+selK.length+'/'+MAXS+(full?' '+T.full:'')+')':'');
    $('fp-ste').textContent=c.length?(full?T.stf:T.stp):T.ste;$('fp-ste').classList.toggle('warn',full);
    $('fp-cl').innerHTML=selK.map(function(k){return '<span>'+reid(svgOf(k),'c'+(++kn))+'</span>'}).join('');
    fit();
  }
  function place(){return name(+$('fp-pc-place').value||0)}
  function updCard(newPlace){
    var i=+$('fp-pc-place').value;if(isNaN(i))return;
    $('fp-pv-gr').textContent=T.gr;$('fp-pv-place').textContent=name(i);
    if(newPlace&&!msgTouched)$('fp-pc-msg').value=T.def(name(i));
    // each stop has its own paper tint and edge colors
    var pc=PAL[i],pcb=back.querySelector('.pcb');
    pcb.style.setProperty('--bg',pc[0]);pcb.style.setProperty('--a',pc[1]);pcb.style.setProperty('--b',pc[2]);pcb.style.setProperty('--t',pc[3]);
    // the earned stamp is the postage
    var svg=btns[i].querySelector(es?'.es svg':'.en svg');
    if(svg){$('fp-post').innerHTML=svg.outerHTML.replace(/fp(\d)([es])-/g,'fpp$1$2-').replace(/<svg /,'<svg style="--r:0deg" ')}
    if(newPlace&&!custom)useDefault(i);
    $('fp-and').textContent=andTxt();grow();drawStamps();
  }
  /* photo: the stop's own photo by default, or the guest's. Drag to move, slider to zoom. */
  function lay(){
    var el=$('fp-pv-ph');el.classList.toggle('has',!!photo);
    if(!photo){el.style.backgroundImage='none';return}
    var s=el.clientWidth,iw=photo.naturalWidth,ih=photo.naturalHeight,r=Math.max(s/iw,s/ih)*z,w=iw*r,h=ih*r;
    el.style.backgroundSize=w+'px '+h+'px';el.style.backgroundPosition=((s-w)*px)+'px '+((s-h)*py)+'px';
  }
  function setPhoto(im,src,ok,isCustom,v){
    v=v||[1,.5,.5];photo=im;photoOk=ok;custom=isCustom;z=v[0];px=v[1];py=v[2];$('fp-zoom').value=z;$('fp-zoom').disabled=!im;
    $('fp-pv-ph').style.backgroundImage=im?'url("'+src+'")':'none';$('fp-pv-empty').textContent=im?'':T.up;
    $('fp-dflt').hidden=!isCustom;lay();fit();
  }
  function useDefault(i){
    var my=++tok,src=PH[i];
    loadImg(src,true).then(function(im){
      if(im)return [im,true];
      return loadImg(src,false).then(function(i2){return [i2,false]}); // shows on screen, left off the image if the CDN blocks canvas use
    }).then(function(r){if(my!==tok)return;setPhoto(r[0],src,r[1],false,VW[i])});
  }
  $('fp-zoom').addEventListener('input',function(){z=+this.value;lay()});
  $('fp-pol').onclick=function(e){if(!photo)$('fp-pc-file').click()};
  $('fp-pol').addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();$('fp-pc-file').click()}});
  $('fp-chg').onclick=function(){$('fp-pc-file').click()};
  $('fp-dflt').onclick=function(){useDefault(+$('fp-pc-place').value)};
  (function(){var el=$('fp-pv-ph'),d=null;
    el.addEventListener('pointerdown',function(e){if(!photo)return;d={x:e.clientX,y:e.clientY};try{el.setPointerCapture(e.pointerId)}catch(x){}});
    el.addEventListener('pointermove',function(e){
      if(!d||!photo)return;var s=el.clientWidth,r=Math.max(s/photo.naturalWidth,s/photo.naturalHeight)*z,w=photo.naturalWidth*r,h=photo.naturalHeight*r;
      if(w>s+1)px=Math.min(1,Math.max(0,px+(e.clientX-d.x)/(s-w)));
      if(h>s+1)py=Math.min(1,Math.max(0,py+(e.clientY-d.y)/(s-h)));
      d={x:e.clientX,y:e.clientY};lay();
    });
    var up=function(){d=null};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  })();
  $('fp-pc-place').addEventListener('change',function(){updCard(true)});
  $('fp-pc-msg').addEventListener('input',function(){msgTouched=true;grow();fit()});
  $('fp-pc-from').addEventListener('input',function(){$('fp-and').textContent=andTxt();fit()});
  $('fp-pc-file').addEventListener('change',function(){
    var f=this.files&&this.files[0];if(!f)return;
    var u=URL.createObjectURL(f),im=new Image();tok++;
    im.onload=function(){setPhoto(im,u,true,true)};
    im.src=u;
  });
  /* one image: the Home postcard, as a picture */
  function loadImg(src,cors){return new Promise(function(res){var im=new Image();if(cors)im.crossOrigin='anonymous';im.onload=function(){res(im)};im.onerror=function(){res(null)};im.src=src})}
  function fitText(c,txt,font,max){var sz=96;do{c.font=font.replace('##',sz);sz-=4}while(c.measureText(txt).width>max&&sz>36)}
  function wrap(c,text,x,y,w,lh,maxLines){var words=text.split(/\s+/),line='',n=0;for(var i=0;i<words.length;i++){var t=line?line+' '+words[i]:words[i];if(c.measureText(t).width>w&&line){c.fillText(line,x,y);y+=lh;line=words[i];if(++n>=maxLines-1&&i<words.length-1){c.fillText(line+'…',x,y);return y+lh}}else line=t}c.fillText(line,x,y);return y+lh}
  function draw(ern,stampIm,xs){
    xs=xs||[];
    var W=1600,H=1100,cv=document.createElement('canvas');cv.width=W;cv.height=H;var c=cv.getContext('2d');
    c.fillStyle=PAL[+$('fp-pc-place').value][0];c.fillRect(0,0,W,H);
    var olive='#30312B',i=+$('fp-pc-place').value,pc=PAL[i],red=pc[3];
    // left: text
    c.fillStyle=olive;c.font='500 34px Fredoka, sans-serif';c.fillText(T.gr.toUpperCase(),100,150);
    fitText(c,name(i),'400 ##px "Lilita One", sans-serif',780);c.fillText(name(i),100,240);
    c.fillStyle=red;c.font='500 62px Caveat, Fredoka, cursive';
    var fr=$('fp-pc-from').value.trim(),to=$('fp-pc-to').value.trim(),y=340;
    c.fillText(T.from+': '+(fr||'______'),100,y);c.fillText(T.to+': '+(to||'______'),100,y+80);
    c.fillStyle=olive;c.font='500 60px Caveat, Fredoka, cursive';
    wrap(c,$('fp-pc-msg').value.trim()||T.def(name(i)),100,520,780,76,5);
    c.fillStyle=olive;c.fillRect(100,H-260,780,4);
    if(ern)c.drawImage(ern,100,H-235,170,170);
    var tx=ern?300:100;
    c.fillStyle=red;c.font='500 66px Caveat, Fredoka, cursive';var at=andTxt();c.font='500 66px Caveat, Fredoka, cursive';var aw=c.measureText(at).width,maxw=880-tx,sz=66;while(aw>maxw&&sz>30){sz-=2;c.font='500 '+sz+'px Caveat, Fredoka, cursive';aw=c.measureText(at).width}c.fillText(at,tx,H-165);
    c.fillStyle=olive;c.font='500 32px Fredoka, sans-serif';c.fillText('MarlonWalksLA  ·  @marlonwalksla',tx,H-115);
    c.font='400 28px Fredoka, sans-serif';c.fillText('WhatsApp +1 269 267 0410  ·  marlonwalksla.com',tx,H-72);
    // right: tilted Polaroid with tape
    var pk=xs.length?.9:1;c.save();c.translate(1230,xs.length?520:560);c.scale(pk,pk);c.rotate(2*Math.PI/180);
    c.shadowColor='rgba(0,0,0,.3)';c.shadowBlur=26;c.shadowOffsetY=10;c.fillStyle='#fff';c.fillRect(-320,-400,640,800);c.shadowColor='transparent';
    c.save();c.beginPath();c.rect(-290,-370,580,580);c.clip();c.fillStyle=pc[2]+'40';c.fillRect(-290,-370,580,580);
    if(photo&&photoOk){var r=Math.max(580/photo.naturalWidth,580/photo.naturalHeight)*z,w=photo.naturalWidth*r,h=photo.naturalHeight*r;c.drawImage(photo,-290+(580-w)*px,-370+(580-h)*py,w,h)}
    c.restore();
    c.save();c.translate(0,-400);c.rotate(-3*Math.PI/180);c.globalAlpha=.6;c.fillStyle=pc[2];c.fillRect(-80,-22,160,46);c.globalAlpha=1;c.restore();
    c.restore();
    if(xs.length){var sz=124,tot=xs.length*sz-(xs.length-1)*12,x0=1540-tot;xs.forEach(function(im,j){if(!im)return;c.save();c.translate(x0+j*(sz-12)+sz/2,982);c.rotate((j%2?5:-5)*Math.PI/180);c.drawImage(im,-sz/2,-sz/2,sz,sz);c.restore()})}
    if(stampIm){c.save();c.translate(1440,230);c.rotate(-8*Math.PI/180);c.drawImage(stampIm,-130,-130,260,260);c.restore()}
    // airmail edge
    var bw=26;c.lineWidth=bw;c.setLineDash([60,60]);c.strokeStyle=pc[1];c.strokeRect(bw/2+6,bw/2+6,W-bw-12,H-bw-12);c.strokeStyle=pc[2];c.lineDashOffset=-60;c.strokeRect(bw/2+6,bw/2+6,W-bw-12,H-bw-12);c.setLineDash([]);c.lineDashOffset=0;
    return cv;
  }
  function stampImage(){
    var i=+$('fp-pc-place').value,svg=btns[i].querySelector(es?'.es svg':'.en svg');if(!svg)return Promise.resolve(null);
    var s=svg.outerHTML.replace(/<svg /,'<svg width="520" height="520" ').replace(/ style="[^"]*"/,'');
    return loadImg('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s),false);
  }
  function makeBlob(){
    var fonts=document.fonts?Promise.all(['400 40px "Lilita One"','500 30px Fredoka','500 40px Caveat'].map(function(f){return document.fonts.load(f)})).catch(function(){}):Promise.resolve();
    var xp=Promise.all(selK.map(function(k){var v=svgOf(k).replace(/<svg /,'<svg width="520" height="520" ').replace(/ style="[^"]*"/,'');return loadImg('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(v),false)}));
    return Promise.all([fonts,loadImg(ERN,true),stampImage(),xp]).then(function(r){
      ernImg=r[1];
      return new Promise(function(res){function go(withE){try{draw(withE?ernImg:null,r[2],r[3]).toBlob(function(b){res(b)},'image/png')}catch(e){if(withE)go(false);else res(null)}}go(true)});
    });
  }
  function pcText(){var to=$('fp-pc-to').value.trim();return (to?to+', ':'')+T.gr+' '+place()+'! '+($('fp-pc-msg').value.trim()||T.def(place()))+' '+T.sig}
  function dl(b){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='postcard-from-la.png';document.body.appendChild(a);a.click();a.remove()}
  $('fp-pc-send').onclick=function(){
    makeBlob().then(function(b){
      if(!b){window.open('https://wa.me/?text='+encodeURIComponent(pcText()));return}
      var f=new File([b],'postcard-from-la.png',{type:'image/png'});
      if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],text:pcText()}).catch(function(){});else dl(b);
    });
  };
  $('fp-pc-save').onclick=function(){makeBlob().then(function(b){if(b)dl(b)})};
  /* static text */
  $('fp-kick').textContent=T.kick;$('fp-of').textContent=T.of;$('fp-save').textContent=T.save;
  $('fp-go').textContent=T.go;
  $('fp-pc-from').placeholder=T.phf;$('fp-pc-to').placeholder=T.pht2;
  $('fp-pc-back').textContent=T.back;$('fp-pv-empty').textContent=T.up;$('fp-l-from').textContent=T.from+':';$('fp-l-to').textContent=T.to+':';$('fp-and').textContent=andTxt();
  $('fp-pctl-h').textContent=T.pht;$('fp-chg').textContent=T.chg;$('fp-zl').textContent=T.zl;$('fp-dflt').textContent=T.dflt;$('fp-phint').textContent=T.hint;$('fp-pc-send').textContent=T.send;$('fp-pc-save').textContent=T.pcsave;$('fp-pc-priv').textContent=T.priv;
  $('fp-rv-h').textContent=T.rvh;$('fp-rv-p').textContent=T.rvp;$('fp-rv-n').textContent=T.rvn;
  var rv=$('fp-rv');rv.textContent=T.rv;rv.href=REVIEW_URL||'https://www.google.com/search?q=MarlonWalksLA+reviews';
  $('fp-map').textContent=T.map;$('fp-map').href=es?'/maps?lang=es':'/maps';
  $('fp-ig').textContent=T.ig;$('fp-wa').textContent=T.wa;
  $('fp-reset').textContent=T.reset;
  $('fp-reset').onclick=function(){if(confirm(T.confirm)){S.forEach(function(s,i){set(s,false);xset(i,false)});cur=-1;$('fp-sheet').hidden=true;render()}};
  $('fp-start').hidden=mode!=='start';$('fp-end').hidden=mode!=='end';
  if(mode==='end')S.forEach(function(s){set(s,true)}); // QR 2: everyone who finished the walk gets all 9
  render();
  if(window.ResizeObserver){var ro=new ResizeObserver(fit);ro.observe(front);ro.observe(back)}
  window.addEventListener('resize',function(){grow();fit()});window.addEventListener('load',fit);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
})();
</script>
'''
out = HTML.replace("@@XS@@", XSJSON).replace("@@EXTRAS@@", XJSON).replace("@@BUTTONS@@", BUTTONS).replace("@@DATA@@", DATA).replace("@@GUIDE@@", GJSON).replace("@@PAL@@", PJSON).replace("@@PHOTOS@@", PHJSON).replace("@@VIEWS@@", VJSON)
open(os.path.join(HERE, "free-passport.html"), "w").write(out)
print("free-passport.html", len(out), "bytes", "EMDASH" if "—" in out else "no em dash")
