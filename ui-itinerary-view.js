/* ==============================================================================
 * FILE: ui-itinerary-view.js
 * CATEGORY: MarlonWalksLA Website - Custom Explorer Itinerary Checklist
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
          <span class="featured-feed-title">🗺️ YOUR LA EXPLORER TRIP</span>
          <span class="featured-feed-subtitle">Map out your LA adventure, route your stops, and check off locations as you explore:</span>
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
          <!-- COLLAPSIBLE ROUTE PACKAGES -->
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
                      <span class="route-block-meta">${routeSpotMarkers.length} Stops • ${preset.duration.split('•')[1] || ''}</span>
                    </div>
                    <div class="route-block-controls">
                      <select class="route-day-select compact-day-select" data-route="${preset.id}">
                        <option value="Day 1" ${routeAssignedDay === 'Day 1' ? 'selected' : ''}>Day 1</option>
                        <option value="Day 2" ${routeAssignedDay === 'Day 2' ? 'selected' : ''}>Day 2</option>
                        <option value="Day 3" ${routeAssignedDay === 'Day 3' ? 'selected' : ''}>Day 3</option>
                        <option value="Day 4" ${routeAssignedDay === 'Day 4' ? 'selected' : ''}>Day 4</option>
                      </select>
                      <button type="button" class="icon-btn remove-route-block-btn" data-route="${preset.id}" title="Remove Route Package">✕</button>
                    </div>
                  </summary>

                  <div class="route-block-body waypoint-timeline-container">
                    ${routeSpotMarkers.map((m, idx) => {
                      const isVisited = visitedIds.includes(m.id);
                      const isLast = idx === routeSpotMarkers.length - 1;
                      return `
                        <div class="waypoint-row">
                          <div class="waypoint-timeline">
                            <span class="waypoint-node ${idx === 0 ? 'is-start' : 'is-stop'}"></span>
                            ${!isLast ? '<span class="waypoint-line"></span>' : ''}
                          </div>

                          <div class="location-pill-card ${isVisited ? 'is-visited' : ''}" data-id="${m.id}">
                            <div class="pill-left-group">
                              <button type="button" class="icon-btn pin-location-btn" data-id="${m.id}" title="Center Map on Location">📍</button>
                              <div class="pill-info">
                                <div class="pill-title">${m.title}</div>
                                <div class="pill-meta">${m.neighborhood}</div>
                              </div>
                            </div>

                            <div class="pill-right-group">
                              <span class="time-spent-badge" title="Estimated time spent">⏱️ 45m</span>
                              <div class="pill-actions">
                                <button type="button" class="icon-btn visited-toggle ${isVisited ? 'is-active' : ''}" data-id="${m.id}" title="${isVisited ? 'Explored!' : 'Mark Visited'}">✓</button>
                                <button type="button" class="icon-btn remove-nested-spot-btn" data-route="${preset.id}" data-id="${m.id}" title="Remove stop">✕</button>
                              </div>
                            </div>
                          </div>
                        </div>

                        ${!isLast ? `
                          <div class="eta-connector-row">
                            <span class="eta-spacer"></span>
                            <div class="eta-pill-badge" title="Travel time between stops">
                              <span class="eta-icon">🚶</span> <span class="eta-text">-- min</span>
                            </div>
                          </div>
                        ` : ''}
                      `;
                    }).join('')}
                  </div>
                </details>
              `;
            }).join('')}

            <!-- MY LOCATIONS SECTION -->
            ${activeCustomSpotIds.length > 0 ? `
              <div class="custom-spots-block-title">📍 MY LOCATIONS (${activeCustomSpotIds.length})</div>
              <div class="waypoint-timeline-container">
                ${activeCustomSpotIds.map((sId, idx) => {
                  const m = allMarkers.find(item => item.id === sId);
                  if (!m) return '';
                  const spotAssignedDay = itinMap[sId] || 'Day 1';
                  const isVisited = visitedIds.includes(m.id);
                  const isLast = idx === activeCustomSpotIds.length - 1;
                  return `
                    <div class="waypoint-row">
                      <div class="waypoint-timeline">
                        <span class="waypoint-node ${idx === 0 ? 'is-start' : 'is-stop'}"></span>
                        ${!isLast ? '<span class="waypoint-line"></span>' : ''}
                      </div>

                      <div class="location-pill-card ${isVisited ? 'is-visited' : ''}" data-id="${m.id}">
                        <div class="pill-left-group">
                          <button type="button" class="icon-btn pin-location-btn" data-id="${m.id}" title="Center Map on Location">📍</button>
                          <div class="pill-info">
                            <div class="pill-title">${m.title}</div>
                            <div class="pill-meta-row">
                              <span class="pill-meta">${m.neighborhood}</span>
                              <select class="day-assign-select compact-day-select" data-id="${m.id}">
                                <option value="Day 1" ${spotAssignedDay === 'Day 1' ? 'selected' : ''}>Day 1</option>
                                <option value="Day 2" ${spotAssignedDay === 'Day 2' ? 'selected' : ''}>Day 2</option>
                                <option value="Day 3" ${spotAssignedDay === 'Day 3' ? 'selected' : ''}>Day 3</option>
                                <option value="Day 4" ${spotAssignedDay === 'Day 4' ? 'selected' : ''}>Day 4</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div class="pill-right-group">
                          <span class="time-spent-badge" title="Estimated time spent">⏱️ 45m</span>
                          <div class="pill-actions">
                            <button type="button" class="icon-btn visited-toggle ${isVisited ? 'is-active' : ''}" data-id="${m.id}" title="${isVisited ? 'Explored!' : 'Mark Visited'}">✓</button>
                            <button type="button" class="icon-btn remove-toggle" data-id="${m.id}" title="Remove location">✕</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    ${!isLast ? `
                      <div class="eta-connector-row">
                        <span class="eta-spacer"></span>
                        <div class="eta-pill-badge" title="Travel time between stops">
                          <span class="eta-icon">🚶</span> <span class="eta-text">-- min</span>
                        </div>
                      </div>
                    ` : ''}
                  `;
                }).join('')}
              </div>
            ` : ''}

            ${activeRouteIds.length === 0 && activeCustomSpotIds.length === 0 ? `
              <p class="empty-itinerary-msg">No spots saved for ${activeDay} yet. Discover LA locations in the Featured or All LA tab!</p>
            ` : ''}
          </div>

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
        const msg = activeDay === 'All' ? 'Clear your entire planned trip?' : `Clear all route packages and locations saved for ${activeDay}?`;
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

    container.querySelectorAll('.pin-location-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (callbacks.onSpotClick) callbacks.onSpotClick(btn.dataset.id);
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
