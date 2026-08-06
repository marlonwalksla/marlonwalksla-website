/* ==============================================================================
 * FILE: ui-itinerary-view.js
 * CATEGORY: MarlonWalksLA Website - Trip Designer Checklist (All + Days 1-4)
 * ============================================================================== */

window.MarlonItineraryView = {
  activeDay: 'All',

  getSpotsCountForDay: function(dayName, allMarkers, itinMap, savedRoutesMap, allPresets) {
    if (dayName === 'All') {
      return window.MarlonStorage.getSavedSpotIds().length;
    }

    let count = Object.keys(itinMap).filter(sId => itinMap[sId] === dayName).length;
    const dayRouteIds = Object.keys(savedRoutesMap).filter(rId => savedRoutesMap[rId] === dayName);

    dayRouteIds.forEach(rId => {
      const p = allPresets.find(item => item.id === rId);
      if (p) {
        p.spotTitles.forEach(t => {
          const cleanT = t.toLowerCase().trim();
          const match = allMarkers.find(m => m.title.toLowerCase().includes(cleanT) || cleanT.includes(m.title.toLowerCase()));
          if (match && !window.MarlonStorage.isSpotExcludedFromRoute(rId, match.id)) {
            count++;
          }
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
    const allPresets = window.MARLON_ROUTES_PRESETS || [];

    const activeDay = this.activeDay;

    const daysList = ['All', 'Day 1', 'Day 2', 'Day 3', 'Day 4'];
    const dayCounts = {};
    daysList.forEach(d => {
      dayCounts[d] = this.getSpotsCountForDay(d, allMarkers, itinMap, savedRoutesMap, allPresets);
    });

    let activeRouteIds = [];
    let activeCustomSpotIds = [];

    if (activeDay === 'All') {
      activeRouteIds = Object.keys(savedRoutesMap);
      activeCustomSpotIds = Object.keys(itinMap);
    } else {
      activeRouteIds = Object.keys(savedRoutesMap).filter(rId => savedRoutesMap[rId] === activeDay);
      activeCustomSpotIds = Object.keys(itinMap).filter(sId => itinMap[sId] === activeDay);
    }

    let html = `
      <div class="itinerary-view-wrapper">
        <div class="featured-feed-header">
          <span class="featured-feed-title">📋 YOUR CUSTOM ITINERARY</span>
          <span class="featured-feed-subtitle">Group your days, check off spots as you go, and export your map:</span>
        </div>

        <div class="day-filter-bar">
          <span class="day-label">Plan Day:</span>
          ${daysList.map(d => {
            const hasItems = dayCounts[d] > 0;
            return `
              <button type="button" class="day-pill ${activeDay === d ? 'is-active' : ''} ${hasItems ? 'has-items' : ''}" data-day="${d}">
                ${d} ${hasItems ? `(${dayCounts[d]})` : ''}
              </button>
            `;
          }).join('')}
        </div>
        
        <div class="itinerary-section">
          <!-- COLLAPSIBLE ROUTE BLOCKS & CUSTOM SPOTS CHECKLIST -->
          <div class="itinerary-blocks-container">
            ${activeRouteIds.map(routeId => {
              const preset = allPresets.find(p => p.id === routeId);
              if (!preset) return '';
              const routeAssignedDay = savedRoutesMap[routeId] || 'Day 1';

              const routeSpotMarkers = [];
              preset.spotTitles.forEach(t => {
                const cleanT = t.toLowerCase().trim();
                const match = allMarkers.find(m => m.title.toLowerCase().includes(cleanT) || cleanT.includes(m.title.toLowerCase()));
                if (match && !window.MarlonStorage.isSpotExcludedFromRoute(preset.id, match.id)) {
                  routeSpotMarkers.push(match);
                }
              });

              return `
                <details class="route-block-card" open>
                  <summary class="route-block-header">
                    <div class="route-block-title-wrap">
                      <span class="route-block-title">${preset.title}</span>
                      <span class="route-block-meta">${routeSpotMarkers.length} Spots • ${preset.duration.split('•')[1] || ''}</span>
                    </div>
                    <div class="route-block-controls">
                      <select class="route-day-select" data-route="${preset.id}">
                        <option value="Day 1" ${routeAssignedDay === 'Day 1' ? 'selected' : ''}>Day 1</option>
                        <option value="Day 2" ${routeAssignedDay === 'Day 2' ? 'selected' : ''}>Day 2</option>
                        <option value="Day 3" ${routeAssignedDay === 'Day 3' ? 'selected' : ''}>Day 3</option>
                        <option value="Day 4" ${routeAssignedDay === 'Day 4' ? 'selected' : ''}>Day 4</option>
                      </select>
                      <button type="button" class="icon-btn remove-route-block-btn" data-route="${preset.id}" title="Remove Route Block">✕</button>
                    </div>
                  </summary>

                  <div class="route-block-body">
                    ${routeSpotMarkers.map(m => {
                      const isVisited = visitedIds.includes(m.id);
                      return `
                        <div class="itinerary-item nested-spot-item ${isVisited ? 'is-visited-item' : ''}" data-id="${m.id}">
                          <div class="itinerary-item-info">
                            <div class="itinerary-item-name">📍 ${m.title}</div>
                            <div class="itinerary-item-meta">${m.neighborhood}</div>
                          </div>
                          <div class="itinerary-item-actions">
                            <button type="button" class="icon-btn nested-icon-btn visited-toggle ${isVisited ? 'is-active' : ''}" data-id="${m.id}" title="${isVisited ? 'Completed' : 'Mark Visited'}">✓</button>
                            <button type="button" class="icon-btn nested-icon-btn remove-nested-spot-btn" data-route="${preset.id}" data-id="${m.id}" title="Remove spot from block">✕</button>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </details>
              `;
            }).join('')}

            ${activeCustomSpotIds.length > 0 ? `
              <div class="custom-spots-block-title">📌 Custom Saved Spots (${activeCustomSpotIds.length})</div>
              ${activeCustomSpotIds.map(sId => {
                const m = allMarkers.find(item => item.id === sId);
                if (!m) return '';
                const spotAssignedDay = itinMap[sId] || 'Day 1';
                const isVisited = visitedIds.includes(m.id);
                return `
                  <div class="itinerary-item ${isVisited ? 'is-visited-item' : ''}" data-id="${m.id}">
                    <div class="itinerary-item-info">
                      <div class="itinerary-item-name">📍 ${m.title}</div>
                      <div class="itinerary-item-meta-row">
                        <span>${m.neighborhood}</span>
                        <select class="day-assign-select" data-id="${m.id}">
                          <option value="Day 1" ${spotAssignedDay === 'Day 1' ? 'selected' : ''}>Day 1</option>
                          <option value="Day 2" ${spotAssignedDay === 'Day 2' ? 'selected' : ''}>Day 2</option>
                          <option value="Day 3" ${spotAssignedDay === 'Day 3' ? 'selected' : ''}>Day 3</option>
                          <option value="Day 4" ${spotAssignedDay === 'Day 4' ? 'selected' : ''}>Day 4</option>
                        </select>
                      </div>
                    </div>
                    <div class="itinerary-item-actions">
                      <button type="button" class="icon-btn visited-toggle ${isVisited ? 'is-active' : ''}" data-id="${m.id}" title="${isVisited ? 'Completed' : 'Mark Visited'}">✓</button>
                      <button type="button" class="icon-btn remove-toggle" data-id="${m.id}">✕</button>
                    </div>
                  </div>
                `;
              }).join('')}
            ` : ''}

            ${activeRouteIds.length === 0 && activeCustomSpotIds.length === 0 ? `
              <p class="empty-itinerary-msg">No plans for ${activeDay} yet. Pin spots from Featured or All LA to build your day!</p>
            ` : ''}
          </div>

          <!-- CLEAR DAY BUTTON AT THE BOTTOM -->
          ${(activeRouteIds.length > 0 || activeCustomSpotIds.length > 0) ? `
            <div class="clear-day-container">
              <button type="button" class="clear-day-bottom-btn">🗑️ Clear ${activeDay === 'All' ? 'All Plans' : `${activeDay} Plans`}</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    container.innerHTML = html;

    const clearDayBtn = container.querySelector('.clear-day-bottom-btn');
    if (clearDayBtn && callbacks.onClearDay) {
      clearDayBtn.addEventListener('click', () => {
        const msg = activeDay === 'All' ? 'Clear your entire planned itinerary?' : `Clear all route blocks and spots planned for ${activeDay}?`;
        if (confirm(msg)) {
          callbacks.onClearDay(activeDay);
        }
      });
    }

    container.querySelectorAll('.day-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeDay = btn.dataset.day;
        this.renderItinerary(container, allMarkers, callbacks);
        if (callbacks.onDayChange) callbacks.onDayChange(this.activeDay);
      });
    });

    container.querySelectorAll('.remove-route-block-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (callbacks.onRemoveRoute) callbacks.onRemoveRoute(btn.dataset.route);
      });
    });

    container.querySelectorAll('.remove-nested-spot-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (callbacks.onRemoveNestedSpot) callbacks.onRemoveNestedSpot(btn.dataset.route, btn.dataset.id);
      });
    });

    container.querySelectorAll('.route-day-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        e.stopPropagation();
        if (callbacks.onChangeRouteDay) callbacks.onChangeRouteDay(sel.dataset.route, sel.value);
      });
    });

    container.querySelectorAll('.day-assign-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        e.stopPropagation();
        if (callbacks.onChangeSpotDay) callbacks.onChangeSpotDay(sel.dataset.id, sel.value);
      });
    });

    container.querySelectorAll('.remove-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (callbacks.onRemoveSpot) callbacks.onRemoveSpot(btn.dataset.id);
      });
    });

    container.querySelectorAll('.visited-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (callbacks.onToggleVisited) callbacks.onToggleVisited(btn.dataset.id);
      });
    });

    container.querySelectorAll('.itinerary-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.icon-btn') || e.target.closest('.day-assign-select') || e.target.closest('.route-day-select')) return;
        if (callbacks.onSpotClick) callbacks.onSpotClick(el.dataset.id);
      });
    });
  }
};
