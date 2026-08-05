/* ==============================================================================
 * FILE: ui-itinerary-view.js
 * CATEGORY: MarlonWalksLA Website - Custom Itinerary Checklist
 * ============================================================================== */

window.MarlonItineraryView = {
  activeDay: 'Unassigned',

  renderItinerary: function(container, allMarkers, callbacks) {
    if (!container) return;

    const itinMap = window.MarlonStorage.getItineraryMap();
    const savedRoutesMap = window.MarlonStorage.getSavedRoutesMap();
    const visitedIds = window.MarlonStorage.getVisitedSpots();
    const allPresets = window.MARLON_ROUTES_PRESETS || [];

    const activeDay = this.activeDay;
    const daysList = ['Unassigned', 'Day 1', 'Day 2', 'Day 3', 'Day 4'];

    const activeRouteIds = Object.keys(savedRoutesMap).filter(rId => {
      const assigned = savedRoutesMap[rId] || 'Unassigned';
      return assigned === activeDay;
    });

    const activeCustomSpotIds = Object.keys(itinMap).filter(sId => {
      const assigned = itinMap[sId] || 'Unassigned';
      return assigned === activeDay;
    });

    let html = `
      <div class="itinerary-view-wrapper">
        <div class="featured-feed-header">
          <span class="featured-feed-title">📋 YOUR TRIP ITINERARY</span>
        </div>

        <div class="day-filter-bar">
          <span class="day-label">Plan Day:</span>
          ${daysList.map(d => `
            <button type="button" class="day-pill ${activeDay === d ? 'is-active' : ''}" data-day="${d}">
              ${d}
            </button>
          `).join('')}
        </div>
        
        <div class="itinerary-section">
          <div class="itinerary-blocks-container">
            <!-- ROUTE BLOCKS -->
            ${activeRouteIds.map(routeId => {
              const preset = allPresets.find(p => p.id === routeId);
              if (!preset) return '';
              const routeAssignedDay = savedRoutesMap[routeId] || 'Unassigned';

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
                      <select class="compact-day-select route-day-select" data-route="${preset.id}">
                        <option value="Unassigned" ${routeAssignedDay === 'Unassigned' ? 'selected' : ''}>Unassigned</option>
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
                        <div class="location-pill-card ${isVisited ? 'is-visited' : ''}" data-id="${m.id}">
                          <div class="pill-left-group">
                            <div class="pill-info">
                              <span class="pill-title">📍 ${m.title}</span>
                              <span class="pill-meta">${m.neighborhood}</span>
                            </div>
                          </div>
                          <div class="pill-right-group">
                            <button type="button" class="icon-btn visited-toggle ${isVisited ? 'is-active' : ''}" data-id="${m.id}" title="${isVisited ? 'Completed' : 'Mark Visited'}">✓</button>
                            <button type="button" class="icon-btn remove-nested-spot-btn" data-route="${preset.id}" data-id="${m.id}" title="Remove spot from block">✕</button>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </details>
              `;
            }).join('')}

            <!-- CUSTOM SPOTS -->
            ${activeCustomSpotIds.length > 0 ? `
              <div class="custom-spots-block-title">📌 SAVED LOCATIONS</div>
              ${activeCustomSpotIds.map(sId => {
                const m = allMarkers.find(item => item.id === sId);
                if (!m) return '';
                const spotAssignedDay = itinMap[sId] || 'Unassigned';
                const isVisited = visitedIds.includes(m.id);
                return `
                  <div class="location-pill-card ${isVisited ? 'is-visited' : ''}" data-id="${m.id}">
                    <div class="pill-left-group">
                      <div class="pill-info">
                        <span class="pill-title">📍 ${m.title}</span>
                        <div class="pill-meta-row">
                          <span class="pill-meta">${m.neighborhood}</span>
                          <select class="compact-day-select day-assign-select" data-id="${m.id}">
                            <option value="Unassigned" ${spotAssignedDay === 'Unassigned' ? 'selected' : ''}>Unassigned</option>
                            <option value="Day 1" ${spotAssignedDay === 'Day 1' ? 'selected' : ''}>Day 1</option>
                            <option value="Day 2" ${spotAssignedDay === 'Day 2' ? 'selected' : ''}>Day 2</option>
                            <option value="Day 3" ${spotAssignedDay === 'Day 3' ? 'selected' : ''}>Day 3</option>
                            <option value="Day 4" ${spotAssignedDay === 'Day 4' ? 'selected' : ''}>Day 4</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="pill-right-group">
                      <button type="button" class="icon-btn visited-toggle ${isVisited ? 'is-active' : ''}" data-id="${m.id}" title="${isVisited ? 'Completed' : 'Mark Visited'}">✓</button>
                      <button type="button" class="icon-btn remove-toggle" data-id="${m.id}" title="Remove spot">✕</button>
                    </div>
                  </div>
                `;
              }).join('')}
            ` : ''}

            ${activeRouteIds.length === 0 && activeCustomSpotIds.length === 0 ? `
              <p class="empty-itinerary-msg">No locations in ${activeDay}. Save spots from the map to plan your day!</p>
            ` : ''}
          </div>

          ${(activeRouteIds.length > 0 || activeCustomSpotIds.length > 0) ? `
            <div class="clear-day-container">
              <button type="button" class="clear-day-bottom-btn">🗑️ Clear ${activeDay === 'Unassigned' ? 'Unassigned List' : `${activeDay} Plans`}</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    container.innerHTML = html;

    const clearDayBtn = container.querySelector('.clear-day-bottom-btn');
    if (clearDayBtn && callbacks.onClearDay) {
      clearDayBtn.addEventListener('click', () => {
        if (confirm(`Clear all items in ${activeDay}?`)) {
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

    container.querySelectorAll('.location-pill-card').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.icon-btn') || e.target.closest('.compact-day-select')) return;
        if (callbacks.onSpotClick) callbacks.onSpotClick(el.dataset.id);
      });
    });
  }
};
