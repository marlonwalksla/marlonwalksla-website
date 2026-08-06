/* ==============================================================================
 * FILE: ui-itinerary-view.js
 * ============================================================================== */
window.MarlonItineraryView = {
  activeDay: 'All',

  getSpotsCountForDay: function(dayName, allMarkers, itinMap, savedRoutesMap, allPresets) {
    if (dayName === 'Popular') {
      const featuredTitles = allPresets.flatMap(p => p.spotTitles.map(t => t.toLowerCase().trim()));
      return allMarkers.filter(m => featuredTitles.some(t => m.title.toLowerCase().trim().includes(t))).length;
    }
    
    if (dayName === 'All') {
      return Object.keys(itinMap).filter(id => !itinMap[id] || itinMap[id] === 'All').length;
    }

    let count = Object.keys(itinMap).filter(sId => itinMap[sId] === dayName).length;
    const dayRouteIds = Object.keys(savedRoutesMap).filter(rId => savedRoutesMap[rId] === dayName);

    dayRouteIds.forEach(rId => {
      const p = allPresets.find(item => item.id === rId);
      if (p) {
        p.spotTitles.forEach(t => {
          const match = allMarkers.find(m => m.title.toLowerCase().includes(t.toLowerCase().trim()));
          if (match && !window.MarlonStorage.isSpotExcludedFromRoute(rId, match.id)) count++;
        });
      }
    });
    return count;
  },

  renderItinerary: function(container, allMarkers, callbacks) {
    if (!container) return;
    const itinMap = window.MarlonStorage.getItineraryMap();
    const savedRoutesMap = window.MarlonStorage.getSavedRoutesMap();
    const visitedIds = window.MarlonStorage.getVisitedSpots();
    const savedSpotIds = window.MarlonStorage.getSavedSpotIds();
    const allPresets = window.MARLON_ROUTES_PRESETS || [];
    const activeDay = this.activeDay;

    const daysList = ['All', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Popular'];
    const dayCounts = {};
    daysList.forEach(d => dayCounts[d] = this.getSpotsCountForDay(d, allMarkers, itinMap, savedRoutesMap, allPresets));

    let activeRouteIds = [];
    let activeCustomSpotIds = [];

    if (activeDay === 'All') {
      activeCustomSpotIds = Object.keys(itinMap).filter(id => !itinMap[id] || itinMap[id] === 'All');
    } else if (activeDay !== 'Popular') {
      activeRouteIds = Object.keys(savedRoutesMap).filter(rId => savedRoutesMap[rId] === activeDay);
      activeCustomSpotIds = Object.keys(itinMap).filter(sId => itinMap[sId] === activeDay);
    }

    // FIX: REMOVED THE DUPLICATE "📋 YOUR TRIP" HEADER HERE
    let html = `
      <div class="itinerary-view-wrapper">
        <div class="day-filter-bar" style="margin-top: 4px;">
          <span class="day-label">Plan Day:</span>
          ${daysList.map(d => `<button type="button" class="day-pill ${activeDay === d ? 'is-active' : ''} ${dayCounts[d] > 0 ? 'has-items' : ''}" data-day="${d}">${d === 'Popular' ? '🔥 Popular' : d} ${dayCounts[d] > 0 ? `(${dayCounts[d]})` : ''}</button>`).join('')}
        </div>
        <div class="itinerary-section">
    `;

    if (activeDay === 'Popular') {
      html += `
        <div class="popular-spots-container">
          <div class="popular-spot-feed-list">
            ${allMarkers.filter(m => allPresets.flatMap(p => p.spotTitles.map(t => t.toLowerCase().trim())).some(t => m.title.toLowerCase().trim().includes(t))).map(m => {
              const isSaved = savedSpotIds.includes(m.id);
              const isVisited = visitedIds.includes(m.id);
              return `
                <div class="itinerary-item spot-feed-card" data-id="${m.id}">
                  <div class="itinerary-item-info">
                    <div class="itinerary-item-name">📍 ${m.title}</div>
                    <div class="spot-feed-meta">${m.neighborhood}</div>
                  </div>
                  <div class="itinerary-item-actions">
                    <button type="button" class="icon-btn nested-icon-btn pin-toggle ${isSaved ? 'is-active' : ''}" data-id="${m.id}" title="Pin">📌</button>
                    <button type="button" class="icon-btn nested-icon-btn visited-toggle ${isVisited ? 'is-active' : ''}" data-id="${m.id}" title="Visited">✓</button>
                    <button type="button" class="icon-btn nested-icon-btn remove-toggle" data-id="${m.id}" title="Remove">✕</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else {
      html += `<div class="itinerary-blocks-container">`;

      // FIX: ALWAYS RENDER A DAY BLOCK WITH CUSTOM TITLE AND EMPTY INPUTS IF NO SPOTS EXIST
      if (activeDay !== 'All' && activeRouteIds.length === 0 && activeCustomSpotIds.length === 0) {
        const customTitle = localStorage.getItem(`marlon_day_title_${activeDay}`) || activeDay;
        html += `
          <div class="route-block-card">
            <div class="route-block-header">
              <input type="text" class="day-title-input" data-day="${activeDay}" value="${customTitle}" placeholder="Name your day (e.g. Museum Day)">
            </div>
            <div class="route-block-body">
              <input type="text" class="empty-slot-input" placeholder="Add a spot manually...">
              <input type="text" class="empty-slot-input" placeholder="Add a spot manually...">
            </div>
          </div>
        `;
      } else {
        html += activeRouteIds.map(routeId => {
          const preset = allPresets.find(p => p.id === routeId);
          if (!preset) return '';
          return `
            <details class="route-block-card" open>
              <summary class="route-block-header">
                <div class="route-block-title-wrap">
                  <span class="route-block-title">${preset.title}</span>
                  <span class="route-block-meta">${preset.duration.split('•')[1] || ''}</span>
                </div>
                <div class="route-block-controls">
                  <select class="route-day-select" data-route="${preset.id}">
                    <option value="Day 1" ${savedRoutesMap[routeId] === 'Day 1' ? 'selected' : ''}>Day 1</option>
                    <option value="Day 2" ${savedRoutesMap[routeId] === 'Day 2' ? 'selected' : ''}>Day 2</option>
                    <option value="Day 3" ${savedRoutesMap[routeId] === 'Day 3' ? 'selected' : ''}>Day 3</option>
                    <option value="Day 4" ${savedRoutesMap[routeId] === 'Day 4' ? 'selected' : ''}>Day 4</option>
                  </select>
                  <button type="button" class="icon-btn remove-route-block-btn" data-route="${preset.id}" title="Remove Route Block">✕</button>
                </div>
              </summary>
              <div class="route-block-body">
                ${preset.spotTitles.map(t => {
                  const match = allMarkers.find(m => m.title.toLowerCase().includes(t.toLowerCase().trim()));
                  if (!match || window.MarlonStorage.isSpotExcludedFromRoute(preset.id, match.id)) return '';
                  const isVisited = visitedIds.includes(match.id);
                  const isSaved = true; 
                  return `
                    <div class="itinerary-item nested-spot-item ${isVisited ? 'is-visited-item' : ''}" data-id="${match.id}">
                      <div class="itinerary-item-info">
                        <div class="itinerary-item-name">📍 ${match.title}</div>
                        <div class="spot-feed-meta">${match.neighborhood}</div>
                      </div>
                      <div class="itinerary-item-actions">
                        <button type="button" class="icon-btn nested-icon-btn pin-toggle ${isSaved ? 'is-active' : ''}" data-id="${match.id}" title="Pin">📌</button>
                        <button type="button" class="icon-btn nested-icon-btn visited-toggle ${isVisited ? 'is-active' : ''}" data-id="${match.id}" title="Visited">✓</button>
                        <button type="button" class="icon-btn nested-icon-btn remove-nested-spot-btn" data-route="${preset.id}" data-id="${match.id}" title="Remove">✕</button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </details>
          `;
        }).join('');

        if (activeCustomSpotIds.length > 0) {
          html += `
            <div class="custom-spots-block-title">📌 Saved Spots (${activeCustomSpotIds.length})</div>
            ${activeCustomSpotIds.map(sId => {
              const m = allMarkers.find(item => item.id === sId);
              if (!m) return '';
              const isVisited = visitedIds.includes(m.id);
              const isSaved = true;
              return `
                <div class="itinerary-item ${isVisited ? 'is-visited-item' : ''}" data-id="${sId}">
                  <div class="itinerary-item-info">
                    <div class="itinerary-item-name">📍 ${m.title}</div>
                    <div class="itinerary-item-meta-row">
                      <span class="spot-feed-meta">${m.neighborhood}</span>
                      <select class="day-assign-select" data-id="${sId}">
                        <option value="All" ${itinMap[sId] === 'All' ? 'selected' : ''}>Unassigned</option>
                        <option value="Day 1" ${itinMap[sId] === 'Day 1' ? 'selected' : ''}>Day 1</option>
                        <option value="Day 2" ${itinMap[sId] === 'Day 2' ? 'selected' : ''}>Day 2</option>
                        <option value="Day 3" ${itinMap[sId] === 'Day 3' ? 'selected' : ''}>Day 3</option>
                        <option value="Day 4" ${itinMap[sId] === 'Day 4' ? 'selected' : ''}>Day 4</option>
                      </select>
                    </div>
                  </div>
                  <div class="itinerary-item-actions">
                    <button type="button" class="icon-btn pin-toggle ${isSaved ? 'is-active' : ''}" data-id="${sId}" title="Pin">📌</button>
                    <button type="button" class="icon-btn visited-toggle ${isVisited ? 'is-active' : ''}" data-id="${sId}" title="Visited">✓</button>
                    <button type="button" class="icon-btn remove-toggle" data-id="${sId}">✕</button>
                  </div>
                </div>
              `;
            }).join('')}
          `;
        }
      }
      
      html += `</div>`;
      if (activeRouteIds.length > 0 || activeCustomSpotIds.length > 0) {
        html += `<div class="clear-day-container"><button type="button" class="clear-day-bottom-btn">🗑️ Clear ${activeDay === 'All' ? 'All Plans' : `${activeDay} Plans`}</button></div>`;
      }
    }
    
    html += `</div></div>`;
    container.innerHTML = html;

    container.querySelectorAll('.day-pill').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); this.activeDay = btn.dataset.day; this.renderItinerary(container, allMarkers, callbacks); }));
    container.querySelectorAll('.pin-toggle').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); window.MarlonStorage.toggleSavedSpot(btn.dataset.id, activeDay !== 'Popular' && activeDay !== 'All' ? activeDay : 'All'); this.renderItinerary(container, allMarkers, callbacks); }));
    container.querySelectorAll('.visited-toggle').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); if (callbacks.onToggleVisited) callbacks.onToggleVisited(btn.dataset.id); }));
    container.querySelectorAll('.remove-toggle').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); if (callbacks.onRemoveSpot) callbacks.onRemoveSpot(btn.dataset.id); }));
    container.querySelectorAll('.remove-nested-spot-btn').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); window.MarlonStorage.excludeSpotFromRoute(btn.dataset.route, btn.dataset.id); this.renderItinerary(container, allMarkers, callbacks); }));
    container.querySelectorAll('.day-title-input').forEach(input => input.addEventListener('change', (e) => { localStorage.setItem(`marlon_day_title_${input.dataset.day}`, e.target.value); }));
    container.querySelectorAll('.day-assign-select').forEach(sel => sel.addEventListener('change', (e) => { e.stopPropagation(); window.MarlonStorage.setSpotDay(sel.dataset.id, sel.value); this.renderItinerary(container, allMarkers, callbacks); }));
    
    const clearDayBtn = container.querySelector('.clear-day-bottom-btn');
    if (clearDayBtn && callbacks.onClearDay) clearDayBtn.addEventListener('click', (e) => { e.preventDefault(); if (confirm(`Clear plans for ${activeDay}?`)) callbacks.onClearDay(activeDay); });
  }
};
