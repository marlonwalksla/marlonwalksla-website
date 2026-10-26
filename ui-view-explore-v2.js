/* ==============================================================================
 * FILE: ui-view-explore-v2.js
 * CATEGORY: MarlonWalksLA Website - Explore view with quick filters + quiz
 *
 * Replaces the three dropdowns (40 neighborhoods / 74 vibes / categories) with
 * tap chips: Where (region, then location), Mood, Free only, Hide visited.
 * Includes a 3-question "Help me choose" quiz that sets the same filters.
 *
 * Filters are mirrored in the page link so they can be shared:
 *   /maps?area=westside&place=venice&mood=views,food&free=1&hide=visited&lang=es
 *
 * Needs: spot-groups.js (window.MARLON_GROUPS), storage-manager.js, map-core.js
 * ============================================================================== */

(function () {
  const G = () => window.MARLON_GROUPS;
  const params = new URLSearchParams(window.location.search);
  const LANG = (params.get('lang') || document.documentElement.lang || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';

  const T = {
    en: { search: 'Search LA spots...', area: 'Where', all: r => `All of ${r}`, anywhereIn: r => `Anywhere in ${r}`, mood: 'In the mood for', free: 'Free', hide: 'Hide places I’ve been',
          reset: 'Reset', spots: n => `${n} spot${n === 1 ? '' : 's'}`, none: 'No places match. Try removing a filter.',
          quiz: 'Help me choose', q1: 'Where are you staying?', q1b: 'Which part?', q2: 'What are you in the mood for?', q2hint: 'Pick as many as you like',
          q3: 'Anything else?', notSure: 'Not sure / anywhere', next: 'Next', back: 'Back', show: 'Show me', skip: 'Skip',
          pin: 'Pin to My Trip', visit: 'Mark visited',
          passports: 'Passports', stamped: (n, t) => `${n} of ${t} stamped`, open: 'Open my passport', soon: 'soon', stampedOne: 'Stamped', notYet: 'Not stamped yet' },
    es: { search: 'Busca lugares en LA...', area: 'Dónde', all: r => `Todo ${r}`, anywhereIn: r => `Cualquier parte de ${r}`, mood: 'Con ganas de', free: 'Gratis', hide: 'Ocultar donde ya fui',
          reset: 'Borrar', spots: n => `${n} lugar${n === 1 ? '' : 'es'}`, none: 'No hay lugares. Quita un filtro.',
          quiz: 'Ayúdame a elegir', q1: '¿Dónde te estás quedando?', q1b: '¿En qué parte?', q2: '¿Qué se te antoja?', q2hint: 'Elige los que quieras',
          q3: '¿Algo más?', notSure: 'No sé / cualquier zona', next: 'Siguiente', back: 'Atrás', show: 'Muéstrame', skip: 'Saltar',
          pin: 'Guardar en mi viaje', visit: 'Marcar visitado',
          passports: 'Pasaportes', stamped: (n, t) => `${n} de ${t} sellos`, open: 'Abrir mi pasaporte', soon: 'pronto', stampedOne: 'Sellado', notYet: 'Aún sin sello' }
  }[LANG];

  /* ---------- passports (Oct 26, 2026) ----------
   * Passport chips filter the map to one passport's stops. Stamped stops show as visited:
   * stamps with a map pin share marlon_visited_spots with the map; stamps without a pin
   * (Evolution of LA mural, Hall of Justice) use marlon_stamps and get their own markers here.
   * Link straight to one: /maps?passport=downtown-classic&spot=bradbury-building
   * Hidden on marlonwalksla.com until Marlon OKs it: set PASSPORTS_LIVE to true. */
  const PASSPORTS_LIVE = false;
  const ON_LIVE = /^(www\.)?marlonwalksla\.com$/i.test(window.location.hostname);
  const PASSPORTS_ON = PASSPORTS_LIVE || !ON_LIVE;
  const PASSPORT_PAGE = { 'downtown-classic': '/free-tour-passport' };
  let passports = [];
  let extraMarkers = [];

  const label = item => (LANG === 'es' ? item.es : item.en);
  const slugId = p => (p.Slug || p.Item_ID || p.Name || p.id || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let allSpots = [];
  const state = {
    area: params.get('area') || '',
    place: params.get('place') || '',
    moods: (params.get('mood') || '').split(',').filter(Boolean),
    free: params.get('free') === '1',
    hideVisited: params.get('hide') === 'visited',
    q: params.get('q') || '',
    passport: PASSPORTS_ON ? (params.get('passport') || '') : ''
  };

  function readArr(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } }
  function activePassport() { return passports.find(p => p.id === state.passport) || null; }
  function stampDone(s) { return s.spot ? visitedIds().includes(s.spot) : readArr('marlon_stamps').includes(s.id); }
  function passportProgress(p) { const all = p.stamps || []; return { done: all.filter(stampDone).length, total: all.length }; }

  function loadPassports() {
    if (!PASSPORTS_ON) return;
    fetch('https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@main/passport-collections.json')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { passports = (d && d.collections) || []; apply(); })
      .catch(() => {});
  }

  /* ---------- data ---------- */
  function enrich(spot) {
    const p = spot.properties || {};
    return {
      raw: spot,
      id: slugId(p),
      name: p.Name || 'Unnamed Location',
      city: p.City || '',
      category: p.Category || '',
      description: p.Description || '',
      area: G().areaOf(p.City),
      place: G().placeId(p.City),
      moods: G().moodsOf(p),
      free: G().isFree(p)
    };
  }

  function visitedIds() {
    return window.MarlonStorage ? window.MarlonStorage.getVisitedSpots() : [];
  }

  function filtered() {
    const q = state.q.toLowerCase().trim();
    const visited = state.hideVisited ? new Set(visitedIds()) : null;
    const pp = activePassport();
    const ppSet = pp ? new Set((pp.stamps || []).filter(s => s.spot).map(s => s.spot)) : null;
    return allSpots.filter(s =>
      (!ppSet || ppSet.has(s.id)) &&
      (state.place ? s.place === state.place : (!state.area || s.area === state.area)) &&
      (!state.moods.length || state.moods.some(m => s.moods.includes(m))) &&
      (!state.free || s.free) &&
      (!visited || !visited.has(s.id)) &&
      (!q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.city.toLowerCase().includes(q))
    );
  }

  /* ---------- link sync ---------- */
  function syncUrl() {
    try {
      const u = new URL(window.location.href);
      const set = (k, v) => (v ? u.searchParams.set(k, v) : u.searchParams.delete(k));
      set('area', state.area);
      set('place', state.place);
      set('mood', state.moods.join(','));
      set('free', state.free ? '1' : '');
      set('hide', state.hideVisited ? 'visited' : '');
      set('q', state.q.trim());
      if (PASSPORTS_ON) set('passport', state.passport);
      window.history.replaceState(null, '', u.toString());
    } catch (e) { /* ignore */ }
  }

  /* ---------- UI ---------- */
  function buildUI() {
    const bar = document.querySelector('#panel-explore .search-filter-bar');
    if (!bar || bar.querySelector('.mw-quick-filters')) return;

    const oldDropdowns = bar.querySelector('.dropdown-row');
    if (oldDropdowns) oldDropdowns.style.display = 'none';

    const input = document.querySelector('#search-input');
    if (input) { input.placeholder = '🔍 ' + T.search; input.value = state.q; }

    const wrap = document.createElement('div');
    wrap.className = 'mw-quick-filters';
    wrap.innerHTML = `
      <button type="button" class="mw-quiz-btn">✨ ${T.quiz}</button>
      <div class="mw-filter-group mw-pp-group" hidden>
        <div class="mw-filter-label">🎫 ${T.passports}</div>
        <div class="mw-chip-row" data-group="passport"></div>
        <div class="mw-pp-bar" hidden></div>
      </div>
      <div class="mw-filter-group">
        <div class="mw-filter-label">${T.area}</div>
        <div class="mw-chip-row" data-group="area">
          ${G().areas.map(a => `<button type="button" class="mw-chip" data-area="${a.id}">${esc(label(a))}</button>`).join('')}
        </div>
        <div class="mw-chip-row mw-place-row" data-group="place" hidden></div>
      </div>
      <div class="mw-filter-group">
        <div class="mw-filter-label">${T.mood}</div>
        <div class="mw-chip-row" data-group="mood">
          ${G().moods.map(m => `<button type="button" class="mw-chip" data-mood="${m.id}">${m.emoji} ${esc(label(m))}</button>`).join('')}
        </div>
      </div>
      <div class="mw-toggle-row">
        <button type="button" class="mw-chip mw-toggle" data-toggle="free">💸 ${T.free}</button>
        <button type="button" class="mw-chip mw-toggle" data-toggle="hide">✓ ${T.hide}</button>
      </div>
      <div class="mw-result-row">
        <span class="mw-result-count" aria-live="polite"></span>
        <button type="button" class="mw-reset" hidden>${T.reset}</button>
      </div>
      <div class="mw-quiz" hidden></div>
    `;
    bar.appendChild(wrap);

    wrap.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.passport) {
        state.passport = state.passport === b.dataset.passport ? '' : b.dataset.passport;
        if (state.passport) { state.area = ''; state.place = ''; state.moods = []; state.free = false; }
      }
      else if (b.dataset.area) { state.area = state.area === b.dataset.area ? '' : b.dataset.area; state.place = ''; }
      else if ('place' in b.dataset) { state.place = b.dataset.place; }
      else if (b.dataset.mood) {
        const m = b.dataset.mood;
        state.moods = state.moods.includes(m) ? state.moods.filter(x => x !== m) : state.moods.concat(m);
      }
      else if (b.dataset.toggle === 'free') { state.free = !state.free; }
      else if (b.dataset.toggle === 'hide') { state.hideVisited = !state.hideVisited; }
      else if (b.classList.contains('mw-reset')) { resetAll(); return; }
      else if (b.classList.contains('mw-quiz-btn')) { openQuiz(); return; }
      else return;
      apply();
    });

    input?.addEventListener('input', () => { state.q = input.value; apply(); });
    document.querySelector('#search-clear-btn')?.addEventListener('click', () => { state.q = ''; if (input) input.value = ''; apply(); });
    document.querySelector('#reset-all-filters-btn')?.addEventListener('click', resetAll);
  }

  function resetAll() {
    state.area = ''; state.place = ''; state.moods = []; state.free = false; state.hideVisited = false; state.q = ''; state.passport = '';
    const input = document.querySelector('#search-input');
    if (input) input.value = '';
    apply();
  }

  function paintChips() {
    const wrap = document.querySelector('.mw-quick-filters');
    if (!wrap) return;
    wrap.querySelectorAll('[data-area]').forEach(b => b.setAttribute('aria-pressed', b.dataset.area === state.area));
    paintPlaces(wrap);
    // Keep the selected region / location visible in rows that scroll sideways
    wrap.querySelectorAll('.mw-chip-row:not(.mw-wrap)').forEach(row => {
      const on = row.querySelector('[aria-pressed="true"]');
      if (on && (on.offsetLeft < row.scrollLeft || on.offsetLeft + on.offsetWidth > row.scrollLeft + row.clientWidth)) {
        row.scrollLeft = Math.max(0, on.offsetLeft - row.offsetLeft - 8);
      }
    });
    wrap.querySelectorAll('[data-mood]').forEach(b => b.setAttribute('aria-pressed', state.moods.includes(b.dataset.mood)));
    wrap.querySelector('[data-toggle="free"]').setAttribute('aria-pressed', state.free);
    const hideBtn = wrap.querySelector('[data-toggle="hide"]');
    hideBtn.setAttribute('aria-pressed', state.hideVisited);
    hideBtn.hidden = visitedIds().length === 0 && !state.hideVisited;
    paintPassports(wrap);
    const any = state.area || state.place || state.moods.length || state.free || state.hideVisited || state.q.trim() || state.passport;
    wrap.querySelector('.mw-reset').hidden = !any;
    const oldReset = document.querySelector('#reset-all-filters-btn');
    if (oldReset) oldReset.style.display = 'none';
    const clear = document.querySelector('#search-clear-btn');
    if (clear) clear.style.display = state.q ? 'block' : 'none';
  }

  /* Passport chips with stamp progress, and a bar for the selected passport */
  function paintPassports(wrap) {
    const g = wrap.querySelector('.mw-pp-group');
    if (!g) return;
    if (!PASSPORTS_ON || !passports.length) { g.hidden = true; return; }
    g.hidden = false;
    g.querySelector('[data-group="passport"]').innerHTML = passports.map(p => {
      const soon = p.status === 'coming-soon' || !(p.stamps || []).length;
      const pr = passportProgress(p);
      return `<button type="button" class="mw-chip mw-pp-chip" ${soon ? 'disabled' : ''} data-passport="${esc(p.id)}" aria-pressed="${state.passport === p.id}" style="--pp:${esc(p.ink || '#27302E')}"><span class="mw-pp-dot"></span>${esc(label(p.name))} <span class="mw-n">${soon ? T.soon : pr.done + '/' + pr.total}</span></button>`;
    }).join('');
    const bar = g.querySelector('.mw-pp-bar');
    const p = activePassport();
    if (!p) { bar.hidden = true; bar.innerHTML = ''; return; }
    const pr = passportProgress(p);
    const page = PASSPORT_PAGE[p.id];
    bar.hidden = false;
    bar.style.setProperty('--pp', p.ink || '#27302E');
    bar.innerHTML = `<div><b>${esc(label(p.name))}</b> · ${T.stamped(pr.done, pr.total)}</div>` +
      `<div class="mw-pp-track"><span style="width:${pr.total ? Math.round(pr.done / pr.total * 100) : 0}%"></span></div>` +
      (page ? `<a class="mw-pp-open" href="${page}${LANG === 'es' ? '?lang=es' : ''}">${T.open} →</a>` : '');
  }

  /* Markers for passport stamps that are not map pins (shown only while that passport is selected) */
  function paintExtraMarkers() {
    extraMarkers.forEach(m => m.remove());
    extraMarkers = [];
    const p = activePassport();
    const map = window.marlonMapInstance;
    if (!p || !map || !window.mapboxgl) return;
    (p.stamps || []).filter(s => !s.spot && s.location && s.location.coordinates).forEach(s => {
      const done = stampDone(s);
      const el = document.createElement('div');
      el.className = 'mw-stamp-marker' + (done ? ' is-stamped' : '');
      el.style.setProperty('--pp', p.ink || '#27302E');
      el.title = label(s.label);
      el.innerHTML = '<span>🎫</span>';
      const pop = new window.mapboxgl.Popup({ offset: 18 }).setHTML(
        `<div class="mw-stamp-pop"><b>${esc(label(s.label))}</b><br>${esc(s.location.address || '')}<br><small>${done ? '✓ ' + T.stampedOne : T.notYet}</small></div>`);
      const mk = new window.mapboxgl.Marker({ element: el }).setLngLat(s.location.coordinates).setPopup(pop).addTo(map);
      mk._mwId = s.id;
      extraMarkers.push(mk);
    });
  }

  function addPassportStyles() {
    if (!PASSPORTS_ON || document.getElementById('mw-pp-css')) return;
    const st = document.createElement('style');
    st.id = 'mw-pp-css';
    st.textContent = `
      .mw-pp-chip{display:inline-flex;align-items:center;gap:6px}
      .mw-pp-chip .mw-pp-dot{width:10px;height:10px;border-radius:50%;background:var(--pp);flex:none}
      .mw-pp-chip[aria-pressed="true"]{background:var(--pp)!important;color:#fff!important;border-color:var(--pp)!important}
      .mw-pp-chip[aria-pressed="true"] .mw-pp-dot{background:#fff}
      .mw-pp-chip:disabled{opacity:.5;cursor:default}
      .mw-pp-bar{margin-top:8px;padding:10px 12px;border:2px solid var(--pp);border-radius:12px;background:#fff;font-size:.9rem;line-height:1.4}
      .mw-pp-track{height:8px;border-radius:99px;background:#eee;margin:6px 0;overflow:hidden}
      .mw-pp-track span{display:block;height:100%;background:var(--pp)}
      .mw-pp-open{font-weight:700;color:var(--pp);text-decoration:underline}
      .mw-stamp-marker{width:30px;height:30px;border-radius:50%;border:3px dashed var(--pp);background:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.25)}
      .mw-stamp-marker.is-stamped{border-style:solid;background:var(--pp)}
      .mw-stamp-pop{font-size:13px;line-height:1.4}`;
    document.head.appendChild(st);
  }

  /* Locations in a region that actually have spots, with counts */
  function placesIn(areaId) {
    const region = G().areas.find(a => a.id === areaId);
    if (!region) return [];
    return region.cities
      .map(c => ({ city: c, id: G().placeId(c), n: allSpots.filter(s => s.city === c).length }))
      .filter(p => p.n > 0);
  }

  function paintPlaces(wrap) {
    const row = wrap.querySelector('.mw-place-row');
    const region = G().areas.find(a => a.id === state.area);
    const places = region ? placesIn(region.id) : [];
    if (!region || places.length < 2) { row.hidden = true; row.innerHTML = ''; return; }
    row.hidden = false;
    row.innerHTML =
      `<button type="button" class="mw-chip mw-chip-sub" data-place="" aria-pressed="${!state.place}">${esc(T.all(label(region)))}</button>` +
      places.map(p => `<button type="button" class="mw-chip mw-chip-sub" data-place="${p.id}" aria-pressed="${state.place === p.id}">${esc(G().placeLabel(p.city))} <span class="mw-n">${p.n}</span></button>`).join('');
  }

  function apply() {
    const list = filtered();
    paintChips();
    const count = document.querySelector('.mw-result-count');
    if (count) count.textContent = T.spots(list.length);
    if (window.updateMapMarkers) window.updateMapMarkers(list.map(s => s.raw));
    try { paintExtraMarkers(); } catch (e) { /* ignore */ }
    renderSpotCards(list);
    syncUrl();
  }

  /* ---------- spot list ---------- */
  function renderSpotCards(list) {
    const container = document.querySelector('#spot-cards-list');
    if (!container) return;
    if (!list.length) {
      container.innerHTML = `<p class="no-results mw-empty">${T.none}</p>`;
      return;
    }
    const pinned = new Set(window.MarlonStorage ? window.MarlonStorage.getSavedSpotIds() : []);
    const visited = new Set(visitedIds());
    const areaName = id => { const a = G().areas.find(x => x.id === id); return a ? label(a) : ''; };

    container.innerHTML = list.map(s => `
      <div class="spot-card" data-id="${s.id}">
        <div class="spot-card-info">
          <h4>${esc(s.name)}</h4>
          <p>${esc(G().placeLabel(s.city))}${s.area && areaName(s.area) !== s.city ? ' · ' + esc(areaName(s.area)) : ''}</p>
        </div>
        <div class="spot-card-actions">
          <button type="button" class="card-action-btn btn-quick-pin ${pinned.has(s.id) ? 'is-active' : ''}" data-action="pin" data-id="${s.id}" title="${T.pin}" aria-label="${T.pin}">📌</button>
          <button type="button" class="card-action-btn btn-quick-visit ${visited.has(s.id) ? 'is-active' : ''}" data-action="visit" data-id="${s.id}" title="${T.visit}" aria-label="${T.visit}">✅</button>
        </div>
      </div>`).join('') + `<div class="bottom-scroll-spacer" style="height:80px;width:100%;flex-shrink:0;"></div>`;

    container.querySelectorAll('.spot-card').forEach(card => {
      card.addEventListener('click', e => {
        const btn = e.target.closest('.card-action-btn');
        const id = card.dataset.id;
        if (btn) {
          e.stopPropagation();
          if (btn.dataset.action === 'pin' && window.MarlonStorage) window.MarlonStorage.toggleSavedSpot(id);
          if (btn.dataset.action === 'visit' && window.MarlonStorage) window.MarlonStorage.toggleVisitedSpot(id);
          if (window.updateMarlonMarkerStates) window.updateMarlonMarkerStates();
          if (window.updateNavTabCounts) window.updateNavTabCounts();
          apply();
          return;
        }
        const match = (window.MARLON_ALL_MARKERS || []).find(m => m.id === id);
        if (match && match.wrapper) match.wrapper.click();
      });
    });
  }

  /* ---------- quiz ---------- */
  function openQuiz() {
    const box = document.querySelector('.mw-quiz');
    if (!box) return;
    const draft = { area: state.area, place: state.place, moods: state.moods.slice(), free: state.free, hideVisited: state.hideVisited };
    const hasVisited = visitedIds().length > 0;
    let step = 1;

    const render = () => {
      if (step === 1) {
        box.innerHTML = `
          <div class="mw-quiz-step">1 / 3</div>
          <div class="mw-quiz-q">${T.q1}</div>
          <div class="mw-chip-row mw-wrap">
            ${G().areas.map(a => `<button type="button" class="mw-chip" data-q-area="${a.id}" aria-pressed="${draft.area === a.id}">${esc(label(a))}</button>`).join('')}
            <button type="button" class="mw-chip" data-q-area="" aria-pressed="${!draft.area}">${T.notSure}</button>
          </div>
          <div class="mw-quiz-nav"><button type="button" class="mw-link" data-q="close">✕</button></div>`;
      } else if (step === 1.5) {
        const region = G().areas.find(a => a.id === draft.area);
        box.innerHTML = `
          <div class="mw-quiz-step">1 / 3</div>
          <div class="mw-quiz-q">${T.q1b}</div>
          <div class="mw-chip-row mw-wrap">
            ${placesIn(draft.area).map(p => `<button type="button" class="mw-chip" data-q-place="${p.id}" aria-pressed="${draft.place === p.id}">${esc(G().placeLabel(p.city))}</button>`).join('')}
            <button type="button" class="mw-chip" data-q-place="" aria-pressed="${!draft.place}">${esc(T.anywhereIn(label(region)))}</button>
          </div>
          <div class="mw-quiz-nav"><button type="button" class="mw-link" data-q="back">‹ ${T.back}</button></div>`;
      } else if (step === 2) {
        box.innerHTML = `
          <div class="mw-quiz-step">2 / 3</div>
          <div class="mw-quiz-q">${T.q2}</div>
          <div class="mw-quiz-hint">${T.q2hint}</div>
          <div class="mw-chip-row mw-wrap">
            ${G().moods.map(m => `<button type="button" class="mw-chip" data-q-mood="${m.id}" aria-pressed="${draft.moods.includes(m.id)}">${m.emoji} ${esc(label(m))}</button>`).join('')}
          </div>
          <div class="mw-quiz-nav"><button type="button" class="mw-link" data-q="back">‹ ${T.back}</button><button type="button" class="mw-primary" data-q="next">${draft.moods.length ? T.next : T.skip} ›</button></div>`;
      } else {
        box.innerHTML = `
          <div class="mw-quiz-step">3 / 3</div>
          <div class="mw-quiz-q">${T.q3}</div>
          <div class="mw-chip-row mw-wrap">
            <button type="button" class="mw-chip" data-q-toggle="free" aria-pressed="${draft.free}">💸 ${T.free}</button>
            ${hasVisited ? `<button type="button" class="mw-chip" data-q-toggle="hide" aria-pressed="${draft.hideVisited}">✓ ${T.hide}</button>` : ''}
          </div>
          <div class="mw-quiz-nav"><button type="button" class="mw-link" data-q="back">‹ ${T.back}</button><button type="button" class="mw-primary" data-q="done">${T.show} ›</button></div>`;
      }
    };

    box.onclick = e => {
      const b = e.target.closest('button');
      if (!b) return;
      if ('qArea' in b.dataset) {
        draft.area = b.dataset.qArea; draft.place = '';
        step = draft.area && placesIn(draft.area).length > 1 ? 1.5 : 2;
      }
      else if ('qPlace' in b.dataset) { draft.place = b.dataset.qPlace; step = 2; }
      else if (b.dataset.qMood) {
        const m = b.dataset.qMood;
        draft.moods = draft.moods.includes(m) ? draft.moods.filter(x => x !== m) : draft.moods.concat(m);
      }
      else if (b.dataset.qToggle === 'free') draft.free = !draft.free;
      else if (b.dataset.qToggle === 'hide') draft.hideVisited = !draft.hideVisited;
      else if (b.dataset.q === 'next') step = 3;
      else if (b.dataset.q === 'back') {
        if (step === 2) step = draft.area && placesIn(draft.area).length > 1 ? 1.5 : 1;
        else if (step === 1.5) step = 1;
        else step -= 1;
      }
      else if (b.dataset.q === 'close') { closeQuiz(box); return; }
      else if (b.dataset.q === 'done') {
        Object.assign(state, draft);
        closeQuiz(box);
        apply();
        return;
      }
      render();
    };

    render();
    box.hidden = false;
    box.closest('.mw-quick-filters')?.classList.add('is-quizzing');
  }

  function closeQuiz(box) {
    box.hidden = true;
    box.closest('.mw-quick-filters')?.classList.remove('is-quizzing');
  }

  /* ---------- public ---------- */
  window.initExploreView = function (geoJsonData) {
    if (!geoJsonData || !geoJsonData.features || !window.MARLON_GROUPS) return;
    allSpots = geoJsonData.features.map(enrich);
    addPassportStyles();
    buildUI();
    apply();
    loadPassports();
    // /maps?passport=...&spot=<slug>: open that spot (or a stamp without a pin) once the map settles
    const focus = PASSPORTS_ON ? params.get('spot') : '';
    if (focus) setTimeout(() => {
      const m = (window.MARLON_ALL_MARKERS || []).find(x => x.id === focus);
      if (m && m.wrapper) { m.wrapper.click(); return; }
      const e = extraMarkers.find(x => x._mwId === focus);
      if (e && window.marlonMapInstance) { window.marlonMapInstance.flyTo({ center: e.getLngLat(), zoom: 15 }); e.togglePopup(); }
    }, 1800);
    // The map's pin layer is added after the map finishes loading; apply again then
    const map = window.marlonMapInstance;
    if (map && !map.getSource('spots')) map.once('idle', apply);
    if (window.updateNavTabCounts) window.updateNavTabCounts();
  };

  window.reapplyExploreFilters = apply;

  /* Lets other parts of the site set filters, e.g. an area page button */
  window.MarlonExplore = {
    setFilters: function (f) {
      Object.assign(state, {
        area: f.area || '', place: f.place || '', moods: f.moods || [], free: !!f.free, hideVisited: !!f.hideVisited, q: f.q || ''
      });
      apply();
    },
    getFilters: () => JSON.parse(JSON.stringify(state)),
    openQuiz: openQuiz
  };
})();
