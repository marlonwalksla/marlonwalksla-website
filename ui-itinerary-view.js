/* ==============================================================================
 * FILE: ui-itinerary-view.js
 * CATEGORY: MarlonWalksLA Website - Itinerary & Visited Passport Views
 * ============================================================================== */

window.MarlonItineraryView = {
  activeDay: 'Day 1',

  renderItinerary: function(container, allMarkers, callbacks) {
    if (!container) return;

    const itinMap = window.MarlonStorage.getItineraryMap();
    const savedRoutesMap = window.MarlonStorage.getSavedRoutesMap();
    const visitedIds = window.MarlonStorage.getVisitedSpots();
    const allPresets = window.MARLON_ROUTES_PRESETS || [];

    const activeDay = this.activeDay;

    const activeRouteIds = Object.keys(savedRoutesMap).filter(rId => savedRoutesMap[rId] === activeDay);
    const activeCustomSpotIds = Object.keys(itinMap).filter(sId => itinMap[sId] === activeDay);

    const availablePresets = allPresets.filter(p => !savedRoutesMap[p.id]);
    const totalSavedCount = window.MarlonStorage.getSavedSpotIds().length;

    let html = `
      <div class="itinerary-card">
        <div class="itinerary-header">
          <button type="button" class="back-to-filters-btn">‹ Back</button>
          <div class="itinerary-title">📋 Planned Itinerary (${totalSavedCount})</div>
          ${totalSavedCount > 0 ? '<button type="button" class="clear-itinerary-btn">🗑️ Clear All</button>' : '<div></div>'}
        </div>

        <div class="day-filter-bar">
          <span class="day-label">Plan Day:</span>
          <button type="button" class="day-pill ${activeDay === 'Day 1' ? 'is-active' : ''}" data-day="Day 1">Day 1</button>
          <button type="button" class="day-pill ${activeDay === 'Day 2' ? 'is-active' : ''}" data-day="Day 2">Day 2</button>
          <button type="button" class="day-pill ${activeDay === 'Day 3' ? 'is-active' : ''}" data-day="Day 3">Day 3</button>
        </div>
        
        <div class="itinerary-section">
          ${availablePresets.length > 0 ? `
            <div class="preset-import-box">
              <div class="preset-title">✨ Import Route into ${activeDay}:</div>
              <div class="preset-list">
                ${availablePresets.map(p => `
                  <div class="preset-item">
                    <div>
                      <div class="preset-item-name">${p.title}</div>
                      <div class="preset-item-meta">${p.duration}</div>
                    </div>
                    <button type="button" class="import-preset-btn" data-preset="${p.id}">⚡ Import Block</button>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="itinerary-blocks-container">
            ${activeRouteIds.map(routeId => {
              const preset = allPresets.find(p => p.id === routeId);
              if (!preset) return '';

              const routeSpotMarkers = [];
              preset.spotTitles.forEach(t => {
                const cleanT = t.toLowerCase().trim();
                const match = allMarkers.find(m => m.title.toLowerCase().includes(cleanT) || cleanT.includes(m.title.toLowerCase()));
                if (match) routeSpotMarkers.push(match);
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
                        <option value="Day 1" ${activeDay === 'Day 1' ? 'selected' : ''}>Day 1</option>
                        <option value="Day 2" ${activeDay === 'Day 2' ? 'selected' : ''}>Day 2</option>
                        <option value="Day 3" ${activeDay === 'Day 3' ? 'selected' : ''}>Day 3</option>
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
                            <div class="itinerary-item-name">${m.title}</div>
                            <div class="itinerary-item-meta">📍 ${m.neighborhood}</div>
                          </div>
                          <div class="itinerary-item-actions">
                            <button type="button" class="icon-btn visited-toggle ${isVisited ? 'is-active' : ''}" data-id="${m.id}">✓</button>
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
                const isVisited = visitedIds.includes(m.id);
                return `
                  <div class="itinerary-item ${isVisited ? 'is-visited-item' : ''}" data-id="${m.id}">
                    <div class="itinerary-item-info">
                      <div class="itinerary-item-name">${m.title}</div>
                      <div class="itinerary-item-meta-row">
                        <span>📍 ${m.neighborhood}</span>
                        <select class="day-assign-select" data-id="${m.id}">
                          <option value="Day 1" ${activeDay === 'Day 1' ? 'selected' : ''}>Day 1</option>
                          <option value="Day 2" ${activeDay === 'Day 2' ? 'selected' : ''}>Day 2</option>
                          <option value="Day 3" ${activeDay === 'Day 3' ? 'selected' : ''}>Day 3</option>
                        </select>
                      </div>
                    </div>
                    <div class="itinerary-item-actions">
                      <button type="button" class="icon-btn visited-toggle ${isVisited ? 'is-active' : ''}" data-id="${m.id}">✓</button>
                      <button type="button" class="icon-btn remove-toggle" data-id="${m.id}">✕</button>
                    </div>
                  </div>
                `;
              }).join('')}
            ` : ''}

            ${activeRouteIds.length === 0 && activeCustomSpotIds.length === 0 ? `
              <p class="empty-itinerary-msg">No plans for ${activeDay} yet. Save spots from the map or import a route above!</p>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    const backBtn = container.querySelector('.back-to-filters-btn');
    if (backBtn && callbacks.onBack) backBtn.addEventListener('click', callbacks.onBack);

    const clearBtn = container.querySelector('.clear-itinerary-btn');
    if (clearBtn && callbacks.onClear) clearBtn.addEventListener('click', callbacks.onClear);

    container.querySelectorAll('.day-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeDay = btn.dataset.day;
        this.renderItinerary(container, allMarkers, callbacks);
        if (callbacks.onDayChange) callbacks.onDayChange(this.activeDay);
      });
    });

    container.querySelectorAll('.import-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (callbacks.onImportPreset) callbacks.onImportPreset(btn.dataset.preset, this.activeDay);
      });
    });

    container.querySelectorAll('.remove-route-block-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (callbacks.onRemoveRoute) callbacks.onRemoveRoute(btn.dataset.route);
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
  },

  renderVisited: function(container, allMarkers, callbacks) {
    if (!container) return;

    const savedIds = window.MarlonStorage.getSavedSpotIds();
    const visitedIds = window.MarlonStorage.getVisitedSpots();
    const visitedMarkers = allMarkers.filter(m => visitedIds.includes(m.id));

    let html = `
      <div class="itinerary-card visited-passport-card">
        <div class="itinerary-header">
          <button type="button" class="back-to-filters-btn">‹ Back</button>
          <div class="itinerary-title">✅ Visited Passport (${visitedIds.length})</div>
        </div>
        
        <div class="itinerary-section">
          ${visitedIds.length === 0 ? '<p class="empty-itinerary-msg">No spots visited yet. Click ✅ Visited on places you have explored!</p>' : ''}
          <div class="itinerary-list">
            ${visitedMarkers.map(m => {
              const isSaved = savedIds.includes(m.id);
              return `
                <div class="itinerary-item is-visited-item" data-id="${m.id}">
                  <div class="itinerary-item-info">
                    <div class="itinerary-item-name">${m.title}</div>
                    <div class="itinerary-item-meta">📍 ${m.neighborhood}</div>
                  </div>
                  <div class="itinerary-item-actions">
                    <button type="button" class="icon-btn save-toggle ${isSaved ? 'is-active' : ''}" data-id="${m.id}">📌</button>
                    <button type="button" class="icon-btn visited-toggle is-active" data-id="${m.id}">✓</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    const backBtn = container.querySelector('.back-to-filters-btn');
    if (backBtn && callbacks.onBack) backBtn.addEventListener('click', callbacks.onBack);

    container.querySelectorAll('.save-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (callbacks.onToggleSave) callbacks.onToggleSave(btn.dataset.id);
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
        if (e.target.closest('.icon-btn')) return;
        if (callbacks.onSpotClick) callbacks.onSpotClick(el.dataset.id);
      });
    });
  }
};
