/* ==============================================================================
 * FILE: ui-view-trip.js
 * CATEGORY: MarlonWalksLA Website - Trip Itinerary Module
 * ============================================================================== */

window.MarlonItineraryView = {
  activeDay: 'All',

  getSpotsCountForDay: function(dayName, allMarkers, itinMap, savedRoutesMap, allPresets) {
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

  renderItinerary: function(container, allMarkers = [], callbacks = {}) {
    if (!container) return;
    container.innerHTML = '';

    const itinMap = window.MarlonStorage ? window.MarlonStorage.getItineraryMap() : {};
    const savedRoutesMap = window.MarlonStorage ? window.MarlonStorage.getSavedRoutesMap() : {};
    const allPresets = window.MARLON_ROUTES_PRESETS || [];
    const extSpotsMap = (window.MarlonStorage && window.MarlonStorage.getExternalSpots) ? window.MarlonStorage.getExternalSpots() : {};
    const activeDay = this.activeDay;

    const daysList = ['All', 'Day 1', 'Day 2', 'Day 3', 'Day 4'];
    const dayCounts = {};
    daysList.forEach(d => dayCounts[d] = this.getSpotsCountForDay(d, allMarkers, itinMap, savedRoutesMap, allPresets));

    let activeRouteIds = [];
    let activeCustomSpotIds = [];
    let activeDaySpotIds = [];

    if (activeDay === 'All') {
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

    const masterWrap = document.createElement('div');
    masterWrap.className = 'itinerary-view-wrapper';
    masterWrap.style.display = 'flex';
    masterWrap.style.flexDirection = 'column';
    masterWrap.style.height = '100%';

    const dayBar = document.createElement('div');
    dayBar.className = 'day-filter-bar';
    dayBar.style.marginTop = '4px';
    dayBar.style.marginBottom = '8px';
    dayBar.innerHTML = daysList.map(d => `
      <button type="button" class="day-pill ${activeDay === d ? 'is-active' : ''} ${dayCounts[d] > 0 ? 'has-items' : ''}" data-day="${d}">
        ${d === 'All' ? '📌 Unassigned' : d} ${dayCounts[d] > 0 ? `(${dayCounts[d]})` : ''}
      </button>
    `).join('');

    masterWrap.appendChild(dayBar);

    const blocksContainer = document.createElement('div');
    blocksContainer.className = 'itinerary-blocks-container';
    blocksContainer.style.flex = '1';
    blocksContainer.style.display = 'flex';
    blocksContainer.style.flexDirection = 'column';
    blocksContainer.style.overflow = 'hidden';

    // Upward-popping search wrapper for the Trip tab
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'manual-search-wrap';
    searchWrapper.innerHTML = `
      <input type="text" class="manual-spot-search" data-day="${activeDay}" placeholder="Search 102 spots or Google Maps..." style="width:100%;">
      <div class="search-results-dropdown" style="display:none;"></div>
    `;

    if (activeDay === 'All') {
      let itemsHTML = '';
      if (activeCustomSpotIds.length === 0) {
        itemsHTML = `
          <div style="text-align: center; padding: 24px 8px; color: #64748b; font-size: 12px; line-height: 1.5;">
            <div style="font-size: 24px; margin-bottom: 6px;">📌</div>
            <strong>No unassigned spots yet!</strong><br>
            Search below or explore in <strong>🔍 Search</strong> or <strong>🛣️ Routes</strong>.
          </div>
        `;
      } else {
        itemsHTML = activeCustomSpotIds.map(sId => {
          let m = allMarkers.find(item => item.id === sId) || extSpotsMap[sId];
          return (m && window.MarlonComponents) ? window.MarlonComponents.renderSpotItemHTML(m, { showDaySelect: true, showRemoveBtn: true, currentDay: itinMap[sId] }) : '';
        }).join('');
      }

      if (window.MarlonComponents) {
        const shellCard = window.MarlonComponents.createShellCard({
          title: `📌 Unassigned Spots (${activeCustomSpotIds.length})`,
          headerActionsHTML: activeCustomSpotIds.length > 0 ? `
            <button type="button" class="icon-btn clear-day-btn" data-day="All" title="Clear All">🗑️</button>
          ` : '',
          itemsHTML: itemsHTML,
          searchWrapper: searchWrapper
        });
        blocksContainer.appendChild(shellCard);
      }

    } else {
      activeRouteIds.forEach(routeId => {
        const preset = allPresets.find(p => p.id === routeId);
        if (!preset) return;

        let routeItemsHTML = preset.spotTitles.map(t => {
          const match = allMarkers.find(m => m.title.toLowerCase().includes(t.toLowerCase().trim()));
          if (!match || window.MarlonStorage.isSpotExcludedFromRoute(preset.id, match.id)) return '';
          return window.MarlonComponents.renderSpotItemHTML(match);
        }).join('');

        if (window.MarlonComponents) {
          const routeCard = window.MarlonComponents.createShellCard({
            title: `✨ ${preset.title}`,
            headerActionsHTML: `<button type="button" class="icon-btn remove-route-block-btn" data-route="${preset.id}">✕</button>`,
            itemsHTML: routeItemsHTML
          });
          blocksContainer.appendChild(routeCard);
        }
      });

      let customItemsHTML = '';
      if (activeCustomSpotIds.length === 0 && activeRouteIds.length === 0) {
        customItemsHTML = `
          <div style="text-align: center; padding: 24px 8px; color: #64748b; font-size: 12px; line-height: 1.5;">
            <div style="font-size: 24px; margin-bottom: 6px;">🗺️</div>
            <strong>No plans for ${activeDay} yet!</strong><br>
            Search below or explore <strong>🔍 Search</strong> or <strong>🛣️ Routes</strong>.
          </div>
        `;
      } else if (activeCustomSpotIds.length > 0) {
        customItemsHTML = activeCustomSpotIds.map(sId => {
          let m = allMarkers.find(item => item.id === sId) || extSpotsMap[sId];
          return (m && window.MarlonComponents) ? window.MarlonComponents.renderSpotItemHTML(m, { showDaySelect: true, showRemoveBtn: true, currentDay: itinMap[sId] }) : '';
        }).join('');
      }

      const customTitle = localStorage.getItem(`marlon_day_title_${activeDay}`) || activeDay;
      if (window.MarlonComponents) {
        const dayShell = window.MarlonComponents.createShellCard({
          title: `📅 ${customTitle}`,
          headerActionsHTML: `<button type="button" class="icon-btn clear-day-btn" data-day="${activeDay}" title="Clear Day">🗑️</button>`,
          itemsHTML: customItemsHTML,
          searchWrapper: searchWrapper
        });
        blocksContainer.appendChild(dayShell);
      }
    }

    masterWrap.appendChild(blocksContainer);
    container.appendChild(masterWrap);

    // Map Pin Visibility Sync
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

      if (visibleCount >= 1) map.fitBounds(bounds, { padding: 50, maxZoom: 13.5 });
      else map.flyTo({ center: [-118.2437, 34.0522], zoom: 10.2 });
    }

    // Attach Event Listeners
    dayBar.querySelectorAll('.day-pill').forEach(btn => btn.addEventListener('click', (e) => { 
      e.preventDefault(); 
      this.activeDay = btn.dataset.day; 
      this.renderItinerary(container, allMarkers, callbacks); 
    }));
    
    container.querySelectorAll('.pin-toggle').forEach(btn => btn.addEventListener('click', (e) => { 
      e.preventDefault(); 
      e.stopPropagation(); 
      if (window.MarlonStorage) window.MarlonStorage.toggleSavedSpot(btn.dataset.id, activeDay !== 'All' ? activeDay : 'All'); 
      this.renderItinerary(container, allMarkers, callbacks); 
    }));

    container.querySelectorAll('.visited-toggle').forEach(btn => btn.addEventListener('click', (e) => { 
      e.preventDefault(); 
      e.stopPropagation(); 
      if (callbacks.onToggleVisited) callbacks.onToggleVisited(btn.dataset.id); 
      this.renderItinerary(container, allMarkers, callbacks); 
    }));

    container.querySelectorAll('.remove-toggle').forEach(btn => btn.addEventListener('click', (e) => { 
      e.preventDefault(); 
      e.stopPropagation(); 
      if (callbacks.onRemoveSpot) callbacks.onRemoveSpot(btn.dataset.id);
      this.renderItinerary(container, allMarkers, callbacks);
    }));

    container.querySelectorAll('.day-assign-select').forEach(sel => sel.addEventListener('change', (e) => { 
      e.stopPropagation(); 
      if (window.MarlonStorage) window.MarlonStorage.setSpotDay(sel.dataset.id, sel.value); 
      this.renderItinerary(container, allMarkers, callbacks); 
    }));

    container.querySelectorAll('.clear-day-btn').forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (callbacks.onClearDay) callbacks.onClearDay(btn.dataset.day);
      this.renderItinerary(container, allMarkers, callbacks);
    }));

    // Inner Search Bar Autocomplete Dropdown
    const input = searchWrapper.querySelector('.manual-spot-search');
    const dropdown = searchWrapper.querySelector('.search-results-dropdown');
    if (input && dropdown) {
      input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        if (query.length < 2) { dropdown.style.display = 'none'; return; }

        const matches = allMarkers.filter(m => 
          m.title.toLowerCase().includes(query) || (m.neighborhood && m.neighborhood.toLowerCase().includes(query))
        ).slice(0, 4);

        let dropdownHtml = matches.map(m => `
          <div class="search-result-item" data-id="${m.id}">
            <span>📍 ${m.title}</span>
            <span style="color:#2563eb; font-weight:800;">+ Add</span>
          </div>
        `).join('');

        dropdown.innerHTML = dropdownHtml;
        dropdown.style.display = 'block';

        dropdown.querySelectorAll('.search-result-item').forEach(item => {
          item.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            if (window.MarlonStorage) window.MarlonStorage.toggleSavedSpot(item.dataset.id, activeDay);
            this.renderItinerary(container, allMarkers, callbacks);
          });
        });
      });
    }
  }
};
