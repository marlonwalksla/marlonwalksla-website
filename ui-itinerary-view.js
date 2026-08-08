/* ==============================================================================
 * FILE: ui-itinerary-view.js
 * CATEGORY: MarlonWalksLA Website - Trip Itinerary using Central Components
 * ============================================================================== */

window.MarlonItineraryView = {
  activeDay: 'All', // 'All', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Visited'

  getSpotsCountForDay: function(dayName, allMarkers, itinMap, savedRoutesMap, allPresets, visitedIds) {
    if (dayName === 'Visited') return visitedIds.length;
    if (dayName === 'All') return Object.keys(itinMap).filter(id => !itinMap[id] || itinMap[id] === 'All').length;
    
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

  showConfirmModal: function(title, message, skipKey, onConfirm) {
    if (localStorage.getItem(skipKey) === 'true') {
      onConfirm();
      return;
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'marlon-modal-overlay';
    overlay.innerHTML = `
      <div class="marlon-modal-box">
        <div class="marlon-modal-title">${title}</div>
        <div class="marlon-modal-text">${message}</div>
        <label class="marlon-modal-checkbox">
          <input type="checkbox" id="marlon-skip-cb"> Don't ask me again
        </label>
        <div class="marlon-modal-actions">
          <button class="marlon-btn-cancel">Cancel</button>
          <button class="marlon-btn-confirm">Yes, Delete</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    overlay.querySelector('.marlon-btn-cancel').onclick = () => overlay.remove();
    overlay.querySelector('.marlon-btn-confirm').onclick = () => {
      if (overlay.querySelector('#marlon-skip-cb').checked) {
        localStorage.setItem(skipKey, 'true');
      }
      overlay.remove();
      onConfirm();
    };
  },

  renderItinerary: function(container, allMarkers, callbacks) {
    if (!container) return;
    const itinMap = window.MarlonStorage.getItineraryMap();
    const savedRoutesMap = window.MarlonStorage.getSavedRoutesMap();
    const visitedIds = window.MarlonStorage.getVisitedSpots();
    const allPresets = window.MARLON_ROUTES_PRESETS || [];
    const extSpotsMap = window.MarlonStorage.getExternalSpots ? window.MarlonStorage.getExternalSpots() : {};
    const activeDay = this.activeDay;

    const daysList = ['All', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Visited'];
    const dayCounts = {};
    daysList.forEach(d => dayCounts[d] = this.getSpotsCountForDay(d, allMarkers, itinMap, savedRoutesMap, allPresets, visitedIds));

    let activeRouteIds = [];
    let activeCustomSpotIds = [];
    let activeDaySpotIds = [];

    if (activeDay === 'Visited') {
      activeCustomSpotIds = [...visitedIds];
      activeDaySpotIds = [...visitedIds];
    } else if (activeDay === 'All') {
      activeCustomSpotIds = Object.keys(itinMap).filter(id => !itinMap[id] || itinMap[id] === 'All');
      activeDaySpotIds = [...activeCustomSpotIds];
    } else {
      activeRouteIds = Object.keys(savedRoutesMap).filter(rId => savedRoutesMap[rId] === activeDay);
      activeCustomSpotIds = Object.keys(itinMap).filter(sId => itinMap[sId] === activeDay);
      
      activeCustomSpotIds.forEach(id => activeDaySpotIds.push(id));
      activeRouteIds.forEach(rId => {
        const p = allPresets.find(item => item.id === rId);
        if (p) {
          p.spotTitles.forEach(t => {
            const cleanT = t.toLowerCase().trim();
            const match = allMarkers.find(m => m.title.toLowerCase().includes(cleanT) || cleanT.includes(m.title.toLowerCase()));
            if (match && !window.MarlonStorage.isSpotExcludedFromRoute(rId, match.id) && !activeDaySpotIds.includes(match.id)) {
              activeDaySpotIds.push(match.id);
            }
          });
        }
      });
    }

    let html = `
      <div class="itinerary-view-wrapper">
        <div class="day-filter-bar" style="margin-top: 4px;">
          ${daysList.map(d => `<button type="button" class="day-pill ${activeDay === d ? 'is-active' : ''} ${dayCounts[d] > 0 ? 'has-items' : ''}" data-day="${d}">${d === 'Visited' ? '✅ Visited' : d} ${dayCounts[d] > 0 ? `(${dayCounts[d]})` : ''}</button>`).join('')}
        </div>
        <div class="itinerary-section">
          <div class="itinerary-blocks-container">
    `;

    // 1. VISITED TAB
    if (activeDay === 'Visited') {
      let itemsHTML = '';
      if (visitedIds.length === 0) {
        itemsHTML = `
          <div style="text-align: center; padding: 16px 8px; color: #64748b; font-size: 12px; line-height: 1.5;">
            <div style="font-size: 24px; margin-bottom: 6px;">📍</div>
            <strong>No visited spots yet!</strong><br>
            Check off places as you explore LA or search in <strong>🔍 Search</strong> or <strong>🛣️ Routes</strong>.
          </div>
        `;
      } else {
        itemsHTML = visitedIds.map(sId => {
          let m = allMarkers.find(item => item.id === sId) || extSpotsMap[sId];
          return m ? window.MarlonComponents.renderSpotItemHTML(m) : '';
        }).join('');
      }

      const shellCard = window.MarlonComponents.createShellCard({
        title: `✅ Visited Passport (${visitedIds.length})`,
        headerActionsHTML: visitedIds.length > 0 ? `<button type="button" class="icon-btn share-day-btn" data-day="Visited" title="Share visited places">📤</button>` : '',
        itemsHTML: itemsHTML
      });

      container.innerHTML = html;
      container.querySelector('.itinerary-blocks-container').appendChild(shellCard);

    // 2. UNASSIGNED (ALL) TAB
    } else if (activeDay === 'All') {
      let itemsHTML = '';
      if (activeCustomSpotIds.length === 0) {
        itemsHTML = `
          <div style="text-align: center; padding: 12px 8px; color: #64748b; font-size: 12px; line-height: 1.5;">
            <div style="font-size: 20px; margin-bottom: 4px;">📌</div>
            <strong>No unassigned spots yet!</strong><br>
            Search in <strong>🔍 Search</strong> or <strong>🛣️ Routes</strong> to add spots.
          </div>
        `;
      } else {
        itemsHTML = activeCustomSpotIds.map(sId => {
          let m = allMarkers.find(item => item.id === sId) || extSpotsMap[sId];
          return m ? window.MarlonComponents.renderSpotItemHTML(m, { showDaySelect: true, showRemoveBtn: true, currentDay: itinMap[sId] }) : '';
        }).join('');
      }

      const shellCard = window.MarlonComponents.createShellCard({
        title: `📌 Unassigned Spots (${activeCustomSpotIds.length})`,
        headerActionsHTML: activeCustomSpotIds.length > 0 ? `
          <button type="button" class="icon-btn share-day-btn" data-day="All" title="Share">📤</button>
          <button type="button" class="icon-btn clear-day-btn" data-day="All" title="Clear">🗑️</button>
        ` : '',
        itemsHTML: itemsHTML
      });

      container.innerHTML = html;
      container.querySelector('.itinerary-blocks-container').appendChild(shellCard);

    // 3. DAY 1..4 TABS
    } else {
      container.innerHTML = html;
      const blocksContainer = container.querySelector('.itinerary-blocks-container');

      // Render Imported Route Blocks
      activeRouteIds.forEach(routeId => {
        const preset = allPresets.find(p => p.id === routeId);
        if (!preset) return;

        let routeItemsHTML = preset.spotTitles.map(t => {
          const match = allMarkers.find(m => m.title.toLowerCase().includes(t.toLowerCase().trim()));
          if (!match || window.MarlonStorage.isSpotExcludedFromRoute(preset.id, match.id)) return '';
          return window.MarlonComponents.renderSpotItemHTML(match);
        }).join('');

        const routeCard = window.MarlonComponents.createShellCard({
          title: `✨ ${preset.title}`,
          headerActionsHTML: `<button type="button" class="icon-btn remove-route-block-btn" data-route="${preset.id}">✕</button>`,
          itemsHTML: routeItemsHTML
        });

        blocksContainer.appendChild(routeCard);
      });

      // Render Custom Day Spots
      let customItemsHTML = '';
      if (activeCustomSpotIds.length === 0 && activeRouteIds.length === 0) {
        customItemsHTML = `
          <div style="text-align: center; padding: 12px 8px; color: #64748b; font-size: 12px; line-height: 1.5;">
            <div style="font-size: 20px; margin-bottom: 4px;">🗺️</div>
            <strong>No plans for ${activeDay} yet!</strong><br>
            Search in <strong>🔍 Search</strong> or <strong>🛣️ Routes</strong> to add spots.
          </div>
        `;
      } else if (activeCustomSpotIds.length > 0) {
        customItemsHTML = activeCustomSpotIds.map(sId => {
          let m = allMarkers.find(item => item.id === sId) || extSpotsMap[sId];
          return m ? window.MarlonComponents.renderSpotItemHTML(m, { showDaySelect: true, showRemoveBtn: true, currentDay: itinMap[sId] }) : '';
        }).join('');
      }

      const customTitle = localStorage.getItem(`marlon_day_title_${activeDay}`) || activeDay;
      const dayShell = window.MarlonComponents.createShellCard({
        title: `📅 ${customTitle}`,
        headerActionsHTML: `
          <button type="button" class="icon-btn share-day-btn" data-day="${activeDay}">📤</button>
          <button type="button" class="icon-btn clear-day-btn" data-day="${activeDay}">🗑️</button>
        `,
        itemsHTML: customItemsHTML
      });

      blocksContainer.appendChild(dayShell);
    }

    // MAP PINS SYNC
    const map = window.marlonMapInstance;
    if (map && allMarkers && allMarkers.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      let visibleCount = 0;

      allMarkers.forEach(m => {
        if (activeDaySpotIds.includes(m.id)) {
          m.marker.addTo(map);
          bounds.extend([m.lng, m.lat]);
          visibleCount++;
        } else {
          m.marker.remove();
        }
      });

      if (visibleCount >= 1) map.fitBounds(bounds, { padding: 60, maxZoom: 13.5 });
      else map.flyTo({ center: [-118.2437, 34.0522], zoom: 10.2 });
    }

    // EVENT LISTENERS
    container.querySelectorAll('.day-pill').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); this.activeDay = btn.dataset.day; this.renderItinerary(container, allMarkers, callbacks); }));
    
    container.querySelectorAll('.pin-toggle').forEach(btn => btn.addEventListener('click', (e) => { 
      e.preventDefault(); e.stopPropagation(); 
      window.MarlonStorage.toggleSavedSpot(btn.dataset.id, activeDay !== 'All' && activeDay !== 'Visited' ? activeDay : 'All'); 
      this.renderItinerary(container, allMarkers, callbacks); 
    }));

    container.querySelectorAll('.visited-toggle').forEach(btn => btn.addEventListener('click', (e) => { 
      e.preventDefault(); e.stopPropagation(); 
      if (callbacks.onToggleVisited) callbacks.onToggleVisited(btn.dataset.id); 
      this.renderItinerary(container, allMarkers, callbacks); 
    }));

    container.querySelectorAll('.remove-toggle').forEach(btn => btn.addEventListener('click', (e) => { 
      e.preventDefault(); e.stopPropagation(); 
      this.showConfirmModal("Remove Spot?", "Remove this location from your trip?", "marlon_skip_remove", () => {
        if (callbacks.onRemoveSpot) callbacks.onRemoveSpot(btn.dataset.id);
        this.renderItinerary(container, allMarkers, callbacks);
      });
    }));

    container.querySelectorAll('.day-assign-select').forEach(sel => sel.addEventListener('change', (e) => { 
      e.stopPropagation(); 
      window.MarlonStorage.setSpotDay(sel.dataset.id, sel.value); 
      this.renderItinerary(container, allMarkers, callbacks); 
    }));
  }
};
