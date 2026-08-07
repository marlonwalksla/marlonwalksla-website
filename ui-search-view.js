/* ==============================================================================
 * FILE: ui-search-view.js
 * CATEGORY: MarlonWalksLA Website - Unified Search & Filter Engine
 * ============================================================================== */

window.MarlonSearchView = {
  activeTabMode: 'popular', // 'popular', 'categories', 'vibes', 'neighborhoods'
  activeArea: 'All',
  activeCategories: new Set(),
  activeTag: 'All',

  // Top 10 Curated LA Locations
  top10Popular: [
    { name: 'Griffith Observatory', emoji: '🔭' },
    { name: 'Santa Monica Pier', emoji: '🎡' },
    { name: 'Venice Canals', emoji: '🚣' },
    { name: 'The Grove', emoji: '🛍️' },
    { name: 'The Broad', emoji: '🎨' },
    { name: 'The Getty Center', emoji: '🏛️' },
    { name: 'Rodeo Drive', emoji: '🌴' },
    { name: 'Hollywood Walk of Fame', emoji: '🌟' },
    { name: 'Lake Hollywood Park', emoji: '🏔️' },
    { name: 'LACMA', emoji: '💡' }
  ],

  render: function(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback) {
    if (!container) return;
    
    container.dataset.isRendered = 'true';
    container.innerHTML = '';

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
    // 2. UNIFIED CARD CONTAINER (SEARCH + PILLS)
    // ==========================================
    const unifiedCard = document.createElement('div');
    unifiedCard.className = 'route-block-card unified-search-card';
    unifiedCard.style.overflow = 'visible';
    unifiedCard.style.display = 'flex';
    unifiedCard.style.flexDirection = 'column';
    unifiedCard.style.gap = '8px';
    unifiedCard.style.padding = '10px 12px';

    // Top Row: Search Input + Red Clear (X) Button
    const cardTopRow = document.createElement('div');
    cardTopRow.style.display = 'flex';
    cardTopRow.style.alignItems = 'center';
    cardTopRow.style.gap = '8px';
    cardTopRow.style.width = '100%';

    if (searchWrapper) {
      searchWrapper.style.flex = '1';
      searchWrapper.style.margin = '0';
      cardTopRow.appendChild(searchWrapper);
    }

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'icon-btn remove-toggle mini-reset-btn';
    resetBtn.title = 'Clear Filters';
    resetBtn.innerHTML = '✕';
    resetBtn.style.flexShrink = '0';

    cardTopRow.appendChild(resetBtn);
    unifiedCard.appendChild(cardTopRow);

    // Content Body: Dynamic Filter Pills
    const filterBody = document.createElement('div');
    filterBody.className = 'unified-filter-body';
    filterBody.style.display = 'flex';
    filterBody.style.flexDirection = 'column';
    filterBody.style.gap = '6px';
    filterBody.style.paddingTop = '2px';

    const allMarkers = window.MARLON_ALL_MARKERS || [];

    // RENDER ACTIVE MODE PILLS DIRECTLY
    if (this.activeTabMode === 'popular') {
      const popPillsBar = document.createElement('div');
      popPillsBar.className = 'category-pills-bar';
      popPillsBar.style.display = 'flex';
      popPillsBar.style.flexWrap = 'wrap';
      popPillsBar.style.gap = '6px';

      this.top10Popular.forEach(cfg => {
        const match = allMarkers.find(m => m.title.toLowerCase().trim().includes(cfg.name.toLowerCase().trim()));
        if (match) {
          const pill = document.createElement('div');
          pill.className = 'cat-pill vibe-pill popular-pill';
          pill.style.cursor = 'pointer';
          pill.innerHTML = `${cfg.emoji} ${match.title}`;

          pill.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            match.wrapper.click(); // Pans map & opens popup
          });
          popPillsBar.appendChild(pill);
        }
      });
      filterBody.appendChild(popPillsBar);
    } else if (this.activeTabMode === 'categories') {
      const catPillsBar = document.createElement('div');
      catPillsBar.className = 'category-pills-bar';
      catPillsBar.style.display = 'flex';
      catPillsBar.style.flexWrap = 'wrap';
      catPillsBar.style.gap = '6px';

      Array.from(categories).sort().forEach(cat => {
        const pill = document.createElement('div');
        pill.className = 'cat-pill';
        pill.dataset.category = cat;
        const catDetails = window.MarlonSpotCard ? window.MarlonSpotCard.getCategoryDetails(cat, '', categoryMap, defaultPinSvg) : { color: '#2B82B9', name: cat };
        pill.style.setProperty('--pill-theme', catDetails.color);

        if (this.activeCategories.has(cat)) pill.classList.add('is-active');
        pill.innerHTML = catDetails.name;
        catPillsBar.appendChild(pill);
      });

      catPillsBar.addEventListener('click', (e) => {
        const pill = e.target.closest('.cat-pill');
        if (!pill) return;
        const cat = pill.dataset.category;
        if (this.activeCategories.has(cat)) {
          this.activeCategories.delete(cat);
          pill.classList.remove('is-active');
        } else {
          this.activeCategories.add(cat);
          pill.classList.add('is-active');
        }
        if (applyFiltersCallback) applyFiltersCallback();
      });

      filterBody.appendChild(catPillsBar);
    } else if (this.activeTabMode === 'vibes') {
      const vibePillsBar = document.createElement('div');
      vibePillsBar.className = 'category-pills-bar';
      vibePillsBar.style.display = 'flex';
      vibePillsBar.style.flexWrap = 'wrap';
      vibePillsBar.style.gap = '6px';

      Array.from(tagsSet).sort().forEach(tagVal => {
        const pill = document.createElement('div');
        pill.className = 'cat-pill vibe-pill';
        pill.dataset.tag = tagVal;

        if (this.activeTag === tagVal) pill.classList.add('is-active');
        pill.innerHTML = tagVal.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        vibePillsBar.appendChild(pill);
      });

      vibePillsBar.addEventListener('click', (e) => {
        const pill = e.target.closest('.vibe-pill');
        if (!pill) return;
        const tag = pill.dataset.tag;
        if (this.activeTag === tag) {
          this.activeTag = 'All';
          pill.classList.remove('is-active');
        } else {
          vibePillsBar.querySelectorAll('.vibe-pill').forEach(p => p.classList.remove('is-active'));
          this.activeTag = tag;
          pill.classList.add('is-active');
        }
        if (applyFiltersCallback) applyFiltersCallback();
      });

      filterBody.appendChild(vibePillsBar);
    } else if (this.activeTabMode === 'neighborhoods') {
      const areaPillsBar = document.createElement('div');
      areaPillsBar.className = 'category-pills-bar';
      areaPillsBar.style.display = 'flex';
      areaPillsBar.style.flexWrap = 'wrap';
      areaPillsBar.style.gap = '6px';

      Array.from(neighborhoods).sort().forEach(area => {
        const pill = document.createElement('div');
        pill.className = 'cat-pill area-pill';
        pill.dataset.area = area;

        if (this.activeArea === area) pill.classList.add('is-active');
        pill.innerHTML = area;
        areaPillsBar.appendChild(pill);
      });

      areaPillsBar.addEventListener('click', (e) => {
        const pill = e.target.closest('.area-pill');
        if (!pill) return;
        const area = pill.dataset.area;
        if (this.activeArea === area) {
          this.activeArea = 'All';
          pill.classList.remove('is-active');
        } else {
          areaPillsBar.querySelectorAll('.area-pill').forEach(p => p.classList.remove('is-active'));
          this.activeArea = area;
          pill.classList.add('is-active');
        }
        if (applyFiltersCallback) applyFiltersCallback();
      });

      filterBody.appendChild(areaPillsBar);
    }

    unifiedCard.appendChild(filterBody);
    masterWrap.appendChild(unifiedCard);
    container.appendChild(masterWrap);

    // MODE SWITCHING LISTENERS
    filterModeBar.querySelectorAll('.day-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.activeTabMode = btn.dataset.mode;
        this.render(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback);
      });
    });

    // RED CIRCULAR RESET BUTTON ACTION
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

// Backward compatibility alias for map-core.js
window.MarlonAllLaView = window.MarlonSearchView;
