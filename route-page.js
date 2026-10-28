/* Route pages (/routes/*): hero, offers, "Good to know" and a booking block, added on top of the CMS template.
   The Webflow template stays the source of the title, intro, stops and map. This file only wraps them.
   Per-route text lives in CFG below (EN and ES). Loaded from the Routes Template head, pinned by commit. */
(function () {
  var B = 'https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/';
  var OFFER = {
    free:    { en: ['Book the free tour', '/free-walking-tour-los-angeles', 'Tip-based, 2 to 2.5 hours, in English'], es: ['Reserva el free tour', '/free-tour-los-angeles-espanol', 'Por propina, de 2 a 2,5 horas, en español'] },
    team:    { en: ['Plan a team walk', '/team-outings-los-angeles', 'For groups of 5 or more, about 5 hours'], es: ['Planea la caminata de tu equipo', '/salidas-de-equipo-los-angeles', 'Para grupos de 5 o más, unas 5 horas'] },
    private: { en: ['Plan a private tour', '/private-tour-los-angeles', 'Up to 4 guests, 2 to 12 hours'], es: ['Planea tu tour privado', '/tours-privados-los-angeles', 'Hasta 4 personas, de 2 a 12 horas'] }
  };
  var COMMON = {
    shoes: { en: 'Walking: mostly sidewalks, with a few hills and stairs around Bunker Hill. Wear comfortable shoes.', es: 'Caminata: casi todo por banquetas, con algunas subidas y escaleras en Bunker Hill. Usa zapatos cómodos.' },
    bring: { en: 'Bring: water, sunscreen or a hat, and a charged phone. The LA sun is strong most of the year.', es: 'Lleva: agua, bloqueador o gorra y el celular cargado. El sol de LA es fuerte casi todo el año.' },
    slow:  { en: 'Need a slower pace or a step-free route? Message Marlon before the day.', es: '¿Necesitas ir más despacio o una ruta sin escaleras? Escríbele a Marlon antes del día.' }
  };
  var CFG = {
    'the-grand-loop': { lang: 'en', twin: 'el-circuito-grand', lunch: true, offers: ['team', 'private'], img: 'https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/6ad3cf8b582d5e6e7bbb815a_team-tour-green-birthday.webp',
      eyebrow: 'Walking route', lead: 'A walking loop that starts and ends at Grand Central Market: Angels Flight, The Broad, Walt Disney Concert Hall and City Hall.',
      cap: "Kara's birthday walk at Grand Central Market", chips: ['📍 Starts at Grand Central Market', '🗣️ English or Español'],
      gtk: ['Start: Grand Central Market, 317 S Broadway (the Hill St entrance). Marlon sends the exact meeting spot when you book.',
            'Time: about 5 hours on a team tour, with lunch as the last stop. Private tours are shaped around your group.', COMMON.shoes.en, COMMON.bring.en,
            'Food: Grand Central Market has many stalls. Lunch is not included in the price, so come hungry.',
            'Angels Flight: the ride is part of the day, and the fare is included.',
            'Getting there: Pershing Square Metro station (B and D lines) is a short walk away. Parking garages are nearby; prices vary.', COMMON.slow.en],
      lunchText: "See what's for lunch at Grand Central Market" },
    'el-circuito-grand': { lang: 'es', twin: 'the-grand-loop', lunch: true, offers: ['team', 'private'], img: 'https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/6ad3cf8b582d5e6e7bbb815a_team-tour-green-birthday.webp',
      eyebrow: 'Ruta a pie', lead: 'Un circuito a pie que empieza y termina en Grand Central Market: Angels Flight, The Broad, el Walt Disney Concert Hall y el Ayuntamiento.',
      cap: 'La caminata de cumpleaños de Kara en Grand Central Market', chips: ['📍 Empieza en Grand Central Market', '🗣️ Español o English'],
      gtk: ['Inicio: Grand Central Market, 317 S Broadway (entrada de Hill St). Marlon te manda el punto exacto cuando reservas.',
            'Duración: unas 5 horas en un tour de equipo, con el almuerzo como última parada. Los tours privados se arman a la medida de tu grupo.', COMMON.shoes.es, COMMON.bring.es,
            'Comida: Grand Central Market tiene muchos puestos. El almuerzo no está incluido en el precio, así que llega con hambre.',
            'Angels Flight: el paseo es parte del día y el pasaje está incluido.',
            'Cómo llegar: la estación de Metro Pershing Square (líneas B y D) queda a pocos pasos. Hay estacionamientos cerca; los precios cambian.', COMMON.slow.es],
      lunchText: 'Mira qué hay para almorzar en Grand Central Market' },
    'downtown-la-history-walk': { lang: 'en', twin: 'recorrido-historico-centro-de-los-angeles', lunch: false, offers: ['free', 'team'], img: 'cb/6ad92ca91f82698d1862237d_guest-olvera-street-01.webp',
      eyebrow: 'Walking route', lead: 'From Walt Disney Concert Hall to Placita Olvera, where Los Angeles began in 1781.',
      cap: 'Placita Olvera, where the walk ends', chips: ['📍 Starts at Walt Disney Concert Hall', '⏱️ 2 to 2.5 hours', '🗣️ English or Español'],
      gtk: ['Start: Walt Disney Concert Hall, 600 W 1st St. Marlon sends the exact meeting spot when you book.',
            'Time: 2 to 2.5 hours on the free tour. Free tours run on tips.', COMMON.shoes.en, COMMON.bring.en,
            'Food: you pass Grand Central Market, so grab a snack there. Food is not included.',
            'The end: the walk finishes at Placita Olvera, next to Union Station.',
            'Getting there: Civic Center/Grand Park Metro station (B and D lines) is a short walk away. Parking garages are nearby; prices vary.', COMMON.slow.en] },
    'recorrido-historico-centro-de-los-angeles': { lang: 'es', twin: 'downtown-la-history-walk', lunch: false, offers: ['free', 'team'], img: 'cb/6ad92ca91f82698d1862237d_guest-olvera-street-01.webp',
      eyebrow: 'Ruta a pie', lead: 'Del Walt Disney Concert Hall a la Placita Olvera, donde nació Los Ángeles en 1781.',
      cap: 'Placita Olvera, donde termina la caminata', chips: ['📍 Empieza en el Walt Disney Concert Hall', '⏱️ De 2 a 2,5 horas', '🗣️ Español o English'],
      gtk: ['Inicio: Walt Disney Concert Hall, 600 W 1st St. Marlon te manda el punto exacto cuando reservas.',
            'Duración: de 2 a 2,5 horas en el free tour. Los free tours funcionan por propinas.', COMMON.shoes.es, COMMON.bring.es,
            'Comida: pasas por Grand Central Market, así que puedes comprar algo ahí. La comida no está incluida.',
            'El final: la caminata termina en la Placita Olvera, junto a Union Station.',
            'Cómo llegar: la estación de Metro Civic Center/Grand Park (líneas B y D) queda a pocos pasos. Hay estacionamientos cerca; los precios cambian.', COMMON.slow.es] }
  };
  var T = {
    en: { gtk: 'Good to know', gtkNote: 'Plans can change. Marlon confirms the details by email when you book.', ctaH: 'Walk this route with Marlon and Ernesto', ctaS: 'Pick the way that fits you.', about: 'About this route', stops: 'stops' },
    es: { gtk: 'Bueno saber', gtkNote: 'Los planes pueden cambiar. Marlon confirma los detalles por correo cuando reservas.', ctaH: 'Recorre esta ruta con Marlon y Ernesto', ctaS: 'Elige la opción que te quede mejor.', about: 'Sobre esta ruta', stops: 'paradas' }
  };
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function run() {
    var sec = document.querySelector('[data-route-slug]'), c = document.querySelector('.route-container');
    if (!sec || !c || c.querySelector('.rp-hero')) return;
    var cfg = CFG[sec.getAttribute('data-route-slug')]; if (!cfg) return;
    var L = cfg.lang, t = T[L], h1 = c.querySelector('.route-title'), intro = c.querySelector('.route-intro');
    var hero = el('div', 'rp-hero'), txt = el('div', 'rp-hero-text');
    txt.appendChild(el('span', 'rp-eyebrow', esc(cfg.eyebrow)));
    if (h1) txt.appendChild(h1);
    txt.appendChild(el('p', 'rp-lead', esc(cfg.lead)));
    var chips = el('ul', 'rp-facts'); var facts = cfg.chips.slice();
    facts.forEach(function (f) { chips.appendChild(el('li', '', esc(f))); }); txt.appendChild(chips);
    var btns = el('div', 'rp-btns');
    cfg.offers.forEach(function (k, i) { var o = OFFER[k][L]; btns.appendChild(el('a', 'rp-btn' + (i ? ' ghost' : ''), esc(o[0]))).href = o[1]; });
    txt.appendChild(btns);
    var fig = el('figure', 'rp-hero-img'); var im = el('img'); im.src = /^http/.test(cfg.img) ? cfg.img : B + cfg.img.replace('cb/', ''); im.alt = cfg.cap; fig.appendChild(im); fig.appendChild(el('figcaption', '', esc(cfg.cap)));
    hero.appendChild(txt); hero.appendChild(fig); c.insertBefore(hero, c.firstChild);
    var vend = c.querySelector('.vendors-link');
    if (vend) { if (cfg.lunch) { vend.classList.add('rp-btn', 'ghost', 'rp-lunch'); vend.textContent = cfg.lunchText; vend.setAttribute('target', '_blank'); vend.setAttribute('rel', 'noopener'); } else { vend.style.display = 'none'; } }
    var g = el('section', 'rp-gtk'); g.appendChild(el('h2', 'rp-h2', esc(t.gtk)));
    var ul = el('ul', 'rp-gtk-list'); cfg.gtk.forEach(function (x) { var i = x.indexOf(':'); ul.appendChild(el('li', '', '<strong>' + esc(x.slice(0, i + 1)) + '</strong>' + esc(x.slice(i + 1)))); });
    g.appendChild(ul); g.appendChild(el('p', 'rp-note', esc(t.gtkNote))); c.appendChild(g);
    var cta = el('section', 'rp-cta'); cta.appendChild(el('h2', 'rp-h2', esc(t.ctaH))); cta.appendChild(el('p', 'rp-cta-sub', esc(t.ctaS)));
    var row = el('div', 'rp-cta-row');
    cfg.offers.forEach(function (k, i) { var o = OFFER[k][L], box = el('div', 'rp-offer'), a = el('a', 'rp-btn' + (i ? ' ghost' : ''), esc(o[0])); a.href = o[1]; box.appendChild(a); box.appendChild(el('span', '', esc(o[2]))); row.appendChild(box); });
    cta.appendChild(row); c.appendChild(cta);
    if (intro) { var d = el('details', 'rp-about'); d.appendChild(el('summary', '', esc(t.about))); d.appendChild(intro); c.appendChild(d); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
