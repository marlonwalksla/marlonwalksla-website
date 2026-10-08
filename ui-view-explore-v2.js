/* ==============================================================================
 * FILE: ui-view-explore-v2.js
 * CATEGORY: MarlonWalksLA Website - Explore view with quick filters + quiz
 *
 * Replaces the three dropdowns (40 neighborhoods / 74 vibes / categories) with
 * tap chips: Part of town, Mood, Free only, Hide visited. Includes a 3-question
 * "Help me choose" quiz that sets the same filters.
 *
 * Filters are mirrored in the page link so they can be shared:
 *   /maps?area=eastside&mood=views,food&free=1&hide=visited&lang=es
 *
 * Needs: spot-groups.js (window.MARLON_GROUPS), storage-manager.js, map-core.js
 * ============================================================================== */

(function () {
  const G = () => window.MARLON_GROUPS;
  const params = new URLSearchParams(window.location.search);
  const LANG = (params.get('lang') || document.documentElement.lang || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';

  const T = {
    en: { search: 'Search LA spots...', area: 'Part of town', mood: 'In the mood for', free: 'Free', hide: 'Hide places I’ve been',
          reset: 'Reset', spots: n => `${n} spot${n === 1 ? '' : 's'}`, none: 'No places match. Try removing a filter.',
          quiz: 'Help me choose', q1: 'Where are you staying?', q2: 'What are you in the mood for?', q2hint: 'Pick as many as you like',
          q3: 'Anything else?', notSure: 'Not sure / anywhere', next: 'Next', back: 'Back', show: 'Show me', skip: 'Skip',
          pin: 'Pin to My Trip', visit: 'Mark visited' },
    es: { search: 'Busca lugares en LA...', area: 'Zona', mood: 'Con ganas de', free: 'Gratis', hide: 'Ocultar donde ya fui',
          reset: 'Borrar', spots: n => `${n} lugar${n === 1 ? '' : 'es'}`, none: 'No hay lugares. Quita un filtro.',
          quiz: 'Ayúdame a elegir', q1: '¿Dónde te estás quedando?', q2: '¿Qué se te antoja?', q2hint: 'Elige los que quieras',
          q3: '¿Algo más?', notSure: 'No sé / cualquier zona', next: 'Siguiente', back: 'Atrás', show: 'Muéstrame', skip: 'Saltar',
          pin: 'Guardar en mi viaje', visit: 'Marcar visitado' }
  }[LANG];

  const label = item => (LANG === 'es' ? item.es : item.en);
  const slugId = p => (p.Slug || p.Item_ID || p.Name || p.id || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let allSpots = [];
  const state = {
    area: params.get('area') || '',
    moods: (params.get('mood') || '').split(',').filter(Boolean),
    free: params.get('free') === '1',
    hideVisited: params.get('hide') === 'visited',
    q: params.get('q') || ''
  };

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
    return allSpots.filter(s =>
      (!state.area || s.area === state.area) &&
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
      set('mood', state.moods.join(','));
      set('free', state.free ? '1' : '');
      set('hide', state.hideVisited ? 'visited' : '');
      set('q', state.q.trim());
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
      <div class="mw-filter-group">
        <div class="mw-filter-label">${T.area}</div>
        <div class="mw-chip-row" data-group="area">
          ${G().areas.map(a => `<button type="button" class="mw-chip" data-area="${a.id}">${esc(label(a))}</button>`).join('')}
        </div>
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
      if (b.dataset.area) { state.area = state.area === b.dataset.area ? '' : b.dataset.area; }
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
    state.area = ''; state.moods = []; state.free = false; state.hideVisited = false; state.q = '';
    const input = document.querySelector('#search-input');
    if (input) input.value = '';
    apply();
  }

  function paintChips() {
    const wrap = document.querySelector('.mw-quick-filters');
    if (!wrap) return;
    wrap.querySelectorAll('[data-area]').forEach(b => b.setAttribute('aria-pressed', b.dataset.area === state.area));
    wrap.querySelectorAll('[data-mood]').forEach(b => b.setAttribute('aria-pressed', state.moods.includes(b.dataset.mood)));
    wrap.querySelector('[data-toggle="free"]').setAttribute('aria-pressed', state.free);
    const hideBtn = wrap.querySelector('[data-toggle="hide"]');
    hideBtn.setAttribute('aria-pressed', state.hideVisited);
    hideBtn.hidden = visitedIds().length === 0 && !state.hideVisited;
    const any = state.area || state.moods.length || state.free || state.hideVisited || state.q.trim();
    wrap.querySelector('.mw-reset').hidden = !any;
    const oldReset = document.querySelector('#reset-all-filters-btn');
    if (oldReset) oldReset.style.display = 'none';
    const clear = document.querySelector('#search-clear-btn');
    if (clear) clear.style.display = state.q ? 'block' : 'none';
  }

  function apply() {
    const list = filtered();
    paintChips();
    const count = document.querySelector('.mw-result-count');
    if (count) count.textContent = T.spots(list.length);
    if (window.updateMapMarkers) window.updateMapMarkers(list.map(s => s.raw));
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
          <p>${esc(s.city)}${s.area && areaName(s.area) !== s.city ? ' · ' + esc(areaName(s.area)) : ''}</p>
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
    const draft = { area: state.area, moods: state.moods.slice(), free: state.free, hideVisited: state.hideVisited };
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
      if ('qArea' in b.dataset) { draft.area = b.dataset.qArea; step = 2; }
      else if (b.dataset.qMood) {
        const m = b.dataset.qMood;
        draft.moods = draft.moods.includes(m) ? draft.moods.filter(x => x !== m) : draft.moods.concat(m);
      }
      else if (b.dataset.qToggle === 'free') draft.free = !draft.free;
      else if (b.dataset.qToggle === 'hide') draft.hideVisited = !draft.hideVisited;
      else if (b.dataset.q === 'next') step = 3;
      else if (b.dataset.q === 'back') step -= 1;
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
    buildUI();
    apply();
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
        area: f.area || '', moods: f.moods || [], free: !!f.free, hideVisited: !!f.hideVisited, q: f.q || ''
      });
      apply();
    },
    getFilters: () => JSON.parse(JSON.stringify(state)),
    openQuiz: openQuiz
  };
})();
