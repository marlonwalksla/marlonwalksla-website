/* ==============================================================================
 * FILE: ui-search-view.js
 * CATEGORY: MarlonWalksLA Website - Tabbed Filter & Search Engine with Item Controls
 * ============================================================================== */

window.MarlonSearchView = {
  activeTabMode: 'popular', // 'popular', 'categories', 'vibes', 'neighborhoods'
  activeArea: 'All',
  activeCategories: new Set(),
  activeTag: 'All',

  top10Popular: [
    'Griffith Observatory',
    'Santa Monica Pier',
    'Venice Canals',
    'The Grove',
    'The Broad',
    'The Getty Center',
    'Rodeo Drive',
    'Hollywood Walk of Fame',
    'Lake Hollywood Park',
    'LACMA'
  ],

  render: function(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback) {
    if (!container) return;
    
    container.dataset.isRendered = 'true';
    container.innerHTML = '';

    const allMarkers = window.MARLON_ALL_MARKERS || [];
    const savedSpotIds = window.MarlonStorage.getSavedSpotIds();
    const visitedIds = window.MarlonStorage.getVisitedSpots();

    const masterWrap = document.createElement('div');
    masterWrap.className = 'search-view-wrapper';
    masterWrap.style.display = 'flex';
    masterWrap.style.flexDirection = 'column';
    masterWrap.style.gap = '8px';
    masterWrap.style.width = '100%';

    // ==========================================
    // 1. TOP MODE SWITCHER PILLS
    // ==========================================
    const filterModeBar = document.createElement('div');
    filterModeBar.className = 'day-filter-bar';
    filterModeBar.style.marginTop = '2px';

    const modes = [
      { id: 'popular', label: '🔥 Popular' },
      { id: 'categories', label: '🏷️ Categories' },
      { id: 'vibes', label: '✨ Vibes' },
      { id: 'neighborhoods', label: '📍 Neighborhoods' }
    ];

    filterModeBar.innerHTML = modes.map(m => `
      <button type="button" class="day-pill ${this.activeTabMode === m.id ? 'is-active' : ''}" data-mode="${m.id}">
        ${m.label}
      </button>
    `).join('');

    masterWrap.appendChild(filterModeBar);

    // ==========================================
    // 2. UNIFIED CARD CONTAINER (SEARCH + ACTIONS)
    // ==========================================
    const unifiedCard = document.createElement('div');
    unifiedCard.className = 'route-block-card unified-search-card';
    unifiedCard.style.overflow = 'visible';
    unifiedCard.style.display = 'flex';
    unifiedCard.style.flexDirection = 'column';
    unifiedCard.style.gap = '8px';
    unifiedCard.style.padding = '10px 12px';

    // Top Row: Search Bar + Pin All Button + Clear Reset Button
    const cardTopRow = document.createElement('div');
    cardTopRow.style.display = 'flex';
    cardTopRow.style.alignItems = 'center';
    cardTopRow.style.gap = '6px';
    cardTopRow.style.width = '100%';

    if (searchWrapper) {
      searchWrapper.style.flex = '1';
      searchWrapper.style.margin = '0';
      cardTopRow.appendChild(searchWrapper);
    }

    const pinAllBtn = document.createElement('button');
    pinAllBtn.type = 'button';
    pinAllBtn.className = 'import-preset-btn';
    pinAllBtn.title = 'Pin All Visible Spots to Trip';
    pinAllBtn.innerHTML = '📌 Pin All';
    pinAllBtn.style.fontSize = '10px';
    pinAllBtn.style.padding = '6px 10px';
    pinAllBtn.style.whiteSpace = 'nowrap';
    pinAllBtn.style.flexShrink = '0';

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'icon-btn remove-toggle mini-reset-btn';
    resetBtn.title = 'Clear Filters';
    resetBtn.innerHTML = '✕';
    resetBtn.style.flexShrink = '0';

    cardTopRow.appendChild(pinAllBtn);
    cardTopRow.appendChild(resetBtn);
    unifiedCard.appendChild(cardTopRow);

    // Sub-Filter Pills (Categories / Vibes / Neighborhoods)
    const filterPillsRow = document.createElement('div');
    filterPillsRow.className = 'category-pills-bar';
    filterPillsRow.style.display = 'flex';
    filterPillsRow.style.flexWrap = 'wrap';
    filterPillsRow.style.gap = '6px';

    let spotsToDisplay = [];

    if (this.activeTabMode === 'popular') {
      filterPillsRow.style.display = 'none';
      this.top10Popular.forEach(name => {
        const match = allMarkers.find(m => m.title.toLowerCase().trim().includes(name.toLowerCase().trim()));
        if (match && !spotsToDisplay.includes(match)) {
          spotsToDisplay.push(match);
        }
      });
    } else if (this.activeTabMode === 'categories') {
      Array.from(categories).sort().forEach(cat => {
        const pill = document.createElement('div');
        pill.className = 'cat-pill';
        pill.dataset.category = cat;
        const catDetails = window.MarlonSpotCard ? window.MarlonSpotCard.getCategoryDetails(cat, '', categoryMap, defaultPinSvg) : { color: '#2B82B9', name: cat };
        pill.style.setProperty('--pill-theme', catDetails.color);

        if (this.activeCategories.has(cat)) pill.classList.add('is-active');
        pill.innerHTML = catDetails.name;
        filterPillsRow.appendChild(pill);
      });

      spotsToDisplay = allMarkers.filter(m => (this.activeCategories.size === 0) || this.activeCategories.has(m.category));
    } else if (this.activeTabMode === 'vibes') {
      Array.from(tagsSet).sort().forEach(tagVal => {
        const pill = document.createElement('div');
        pill.className = 'cat-pill vibe-pill';
        pill.dataset.tag = tagVal;

        if (this.activeTag === tagVal) pill.classList.add('is-active');
        pill.innerHTML = tagVal.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        filterPillsRow.appendChild(pill);
      });

      spotsToDisplay = allMarkers.filter(m => (this.activeTag === 'All') || (m.tags && m.tags.includes(this.activeTag)));
    } else if (this.activeTabMode === 'neighborhoods') {
      Array.from(neighborhoods).sort().forEach(area => {
        const pill = document.createElement('div');
        pill.className = 'cat-pill area-pill';
        pill.dataset.area = area;

        if (this.activeArea === area) pill.classList.add('is-active');
        pill.innerHTML = area;
        filterPillsRow.appendChild(pill);
      });

      spotsToDisplay = allMarkers.filter(m => (this.activeArea === 'All') || (m.neighborhood === this.activeArea));
    }

    unifiedCard.appendChild(filterPillsRow);

    // ==========================================
    // 3. SPOTS LIST CONTAINER (MATCHES TRIP ITINERARY ROWS)
    // ==========================================
    const spotsListContainer = document.createElement('div');
    spotsListContainer.className = 'popular-spot-feed-list';
    spotsListContainer.style.display = 'flex';
    spotsListContainer.style.flexDirection = 'column';
    spotsListContainer.style.gap = '6px';
    spotsListContainer.style.maxHeight = '320px';
    spotsListContainer.style.overflowY = 'auto';
    spotsListContainer.style.paddingRight = '2px';
    spotsListContainer.style.marginTop = '4px';

    if (spotsToDisplay.length === 0) {
      spotsListContainer.innerHTML = `<div style="text-align:center; padding:12px; color:#94a3b8; font-size:12px; font-style:italic;">No locations match this filter.</div>`;
    } else {
      spotsListContainer.innerHTML = spotsToDisplay.map(m => {
        const isSaved = savedSpotIds.includes(m.id);
        const isVisited = visitedIds.includes(m.id);
        const gmapsLink = `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`;

        return `
          <div class="itinerary-item nested-spot-item ${isVisited ? 'is-visited-item' : ''}" data-id="${m.id}">
            <div class="itinerary-item-info spot-info-click" data-id="${m.id}" style="flex: 1; padding-right: 4px; cursor: pointer;">
              <div class="itinerary-item-name" style="margin-bottom: 2px;">📍 ${m.title}</div>
              ${m.neighborhood ? `<div class="spot-feed-meta">${m.neighborhood}</div>` : ''}
            </div>
            <div class="itinerary-item-actions" style="gap: 4px; display: flex; align-items: center;">
              <a href="${gmapsLink}" target="_blank" class="icon-btn" title="Open Map" style="text-decoration:none;">🚗</a>
              <button type="button" class="icon-btn pin-toggle ${isSaved ? 'is-active' : ''}" data-id="${m.id}" title="Pin to Trip">📌</button>
              <button type="button" class="icon-btn visited-toggle ${isVisited ? 'is-active' : ''}" data-id="${m.id}" title="Visited">✓</button>
            </div>
          </div>
        `;
      }).join('');
    }

    unifiedCard.appendChild(spotsListContainer);
    masterWrap.appendChild(unifiedCard);
    container.appendChild(masterWrap);

    // ==========================================
    // 4. ATTACH EVENT LISTENERS
    // ==========================================
    
    // Mode switcher pills
    filterModeBar.querySelectorAll('.day-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.activeTabMode = btn.dataset.mode;
        this.render(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback);
      });
    });

    // Filter sub-pills (Categories / Vibes / Neighborhoods)
    filterPillsRow.addEventListener('click', (e) => {
      const pill = e.target.closest('.cat-pill');
      if (!pill) return;

      if (this.activeTabMode === 'categories') {
        const cat = pill.dataset.category;
        if (this.activeCategories.has(cat)) this.activeCategories.delete(cat);
        else this.activeCategories.add(cat);
      } else if (this.activeTabMode === 'vibes') {
        const tag = pill.dataset.tag;
        if (this.activeTag === tag) this.activeTag = 'All';
        else this.activeTag = tag;
      } else if (this.activeTabMode === 'neighborhoods') {
        const area = pill.dataset.area;
        if (this.activeArea === area) this.activeArea = 'All';
        else this.activeArea = area;
      }

      if (applyFiltersCallback) applyFiltersCallback();
      this.render(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback);
    });

    // Click on item row text -> Fly to marker & open detail popup
    spotsListContainer.querySelectorAll('.spot-info-click').forEach(info => {
      info.addEventListener('click', (e) => {
        e.preventDefault();
        const mId = info.dataset.id;
        const match = allMarkers.find(m => m.id === mId);
        if (match && match.wrapper) match.wrapper.click();
      });
    });

    // Pin toggle button on individual spot row
    spotsListContainer.querySelectorAll('.pin-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.MarlonStorage.toggleSavedSpot(btn.dataset.id, 'All');
        this.render(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback);
      });
    });

    // Visited toggle button on individual spot row
    spotsListContainer.querySelectorAll('.visited-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.MarlonStorage.toggleVisitedSpot(btn.dataset.id);
        this.render(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback);
      });
    });

    // Pin All Button action
    pinAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const currentSaved = window.MarlonStorage.getSavedSpotIds();
      let addedCount = 0;

      spotsToDisplay.forEach(m => {
        if (!currentSaved.includes(m.id)) {
          window.MarlonStorage.toggleSavedSpot(m.id, 'All');
          addedCount++;
        }
      });

      if (addedCount > 0) {
        alert(`📌 Added ${addedCount} spot(s) to your Trip!`);
      } else {
        alert(`All visible spots are already in your Trip!`);
      }
      this.render(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback);
    });

    // Clear Reset button action
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.activeTabMode === 'categories') this.activeCategories.clear();
      if (this.activeTabMode === 'vibes') this.activeTag = 'All';
      if (this.activeTabMode === 'neighborhoods') this.activeArea = 'All';

      if (applyFiltersCallback) applyFiltersCallback();
      this.render(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback);
    });
  },

  applyFilters: function(allMarkers, map, dtlaCenter) {
    if (!allMarkers || !map) return;
    const bounds = new mapboxgl.LngLatBounds();
    let visibleCount = 0;
    allMarkers.forEach(item => {
      const matchesArea = (this.activeArea === 'All') || (item.neighborhood === this.activeArea);
      const matchesCategory = (this.activeCategories.size === 0) || this.activeCategories.has(item.category);
      const matchesTag = (this.activeTag === 'All') || (item.tags && item.tags.includes(this.activeTag));
      if (matchesArea && matchesCategory && matchesTag) { 
        item.marker.addTo(map); 
        bounds.extend([item.lng, item.lat]); 
        visibleCount++; 
      } else { 
        item.marker.remove(); 
      }
    });
    if (visibleCount >= 1) {
      map.fitBounds(bounds, { maxZoom: 13.0 });
    } else {
      map.flyTo({ center: dtlaCenter, zoom: 10.2 });
    }
  }
};
