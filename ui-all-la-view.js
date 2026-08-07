/* ==============================================================================
 * FILE: ui-all-la-view.js
 * CATEGORY: MarlonWalksLA Website - All LA Directory & Filter Controls
 * ============================================================================== */

window.MarlonAllLaView = {
  activeArea: 'All', activeCategories: new Set(), activeTag: 'All',

  render: function(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback) {
    if (!container) return;
    
    if (container.dataset.isRendered === 'true') return;
    container.dataset.isRendered = 'true';
    container.innerHTML = ``;

    if (searchWrapper) {
      searchWrapper.style.marginTop = '16px';
      searchWrapper.style.marginBottom = '8px';
      container.appendChild(searchWrapper);
    }

    const filtersContainer = document.createElement('div'); 
    filtersContainer.className = 'filters-master-container';

    // ==========================================
    // 1. POPULAR SPOTS (Horizontal Feed)
    // ==========================================
    const allMarkers = window.MARLON_ALL_MARKERS || [];
    const targetCities = ['DTLA', 'Hollywood', 'Santa Monica', 'Venice'];
    const popularSpots = allMarkers.filter(m => targetCities.some(city => m.neighborhood && m.neighborhood.toLowerCase().includes(city.toLowerCase())));
    
    if (popularSpots.length > 0) {
      const popGroup = document.createElement('details'); 
      popGroup.className = 'filter-details-group';
      popGroup.style.marginBottom = '14px';
      popGroup.open = true;
      
      const popSummary = document.createElement('summary'); 
      popSummary.className = 'filter-summary';
      popSummary.innerHTML = `<div class="filter-summary-title">🔥 Popular Spots</div>`;
      popGroup.appendChild(popSummary);
      
      const popBody = document.createElement('div');
      popBody.className = 'filter-details-body';
      popBody.style.padding = '12px 14px';
      
      const popSlider = document.createElement('div');
      popSlider.className = 'routes-slider-wrapper'; 
      popSlider.style.display = 'flex';
      popSlider.style.gap = '8px';
      popSlider.style.overflowX = 'auto';
      popSlider.style.paddingBottom = '8px';
      
      popularSpots.forEach(m => {
        const card = document.createElement('div');
        card.className = 'route-slide-card';
        card.style.minWidth = '140px';
        card.style.cursor = 'pointer';
        card.innerHTML = `
          <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">📍 ${m.title}</div>
          <div style="font-size: 10px; color: #475569;">${m.neighborhood}</div>
        `;
        card.addEventListener('click', (e) => {
          e.preventDefault();
          m.wrapper.click(); // Triggers the map to fly to it and open the popup
        });
        popSlider.appendChild(card);
      });
      
      popBody.appendChild(popSlider);
      popGroup.appendChild(popBody);
      filtersContainer.appendChild(popGroup);
    }

    // ==========================================
    // 2. COLLAPSIBLE CATEGORIES (Soft Tinted Pills)
    // ==========================================
    const catGroup = document.createElement('details'); 
    catGroup.className = 'filter-details-group';
    catGroup.style.marginBottom = '14px';
    catGroup.open = true; 
    
    const catSummary = document.createElement('summary'); 
    catSummary.className = 'filter-summary';
    catSummary.innerHTML = `
      <div class="filter-summary-title">🏷️ Categories</div>
      <button type="button" class="mini-reset-btn" title="Clear">✕</button>
    `;
    catGroup.appendChild(catSummary);
    
    const catBody = document.createElement('div');
    catBody.className = 'filter-details-body';
    
    const catPillsBar = document.createElement('div'); 
    catPillsBar.className = 'category-pills-bar';
    Array.from(categories).sort().forEach(cat => {
      const pill = document.createElement('div'); pill.className = 'cat-pill'; pill.dataset.category = cat;
      const catDetails = window.MarlonSpotCard ? window.MarlonSpotCard.getCategoryDetails(cat, '', categoryMap, defaultPinSvg) : { color: '#2B82B9', name: cat };
      pill.style.setProperty('--pill-theme', catDetails.color);
      
      if (this.activeCategories.has(cat)) pill.classList.add('is-active');
      pill.innerHTML = catDetails.name; 
      catPillsBar.appendChild(pill);
    });
    catBody.appendChild(catPillsBar); catGroup.appendChild(catBody); filtersContainer.appendChild(catGroup); 
    
    catPillsBar.addEventListener('click', (e) => {
      e.preventDefault(); const pill = e.target.closest('.cat-pill'); if (!pill) return;
      const cat = pill.dataset.category;
      if (this.activeCategories.has(cat)) { this.activeCategories.delete(cat); pill.classList.remove('is-active'); } 
      else { this.activeCategories.add(cat); pill.classList.add('is-active'); }
      if (applyFiltersCallback) applyFiltersCallback();
    });

    catSummary.querySelector('.mini-reset-btn').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation(); 
      this.activeCategories.clear();
      catPillsBar.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('is-active'));
      if (applyFiltersCallback) applyFiltersCallback();
    });

    // ==========================================
    // 3. COLLAPSIBLE VIBES (Unicolor Pills)
    // ==========================================
    let vibePillsBar = null;
    if (tagsSet.size > 0) {
      const tagGroup = document.createElement('details'); 
      tagGroup.className = 'filter-details-group';
      tagGroup.style.marginBottom = '14px';
      
      const tagSummary = document.createElement('summary'); 
      tagSummary.className = 'filter-summary';
      tagSummary.innerHTML = `
        <div class="filter-summary-title">✨ Vibe</div>
        <button type="button" class="mini-reset-btn" title="Clear">✕</button>
      `;
      tagGroup.appendChild(tagSummary);
      
      const tagBody = document.createElement('div');
      tagBody.className = 'filter-details-body';
      
      vibePillsBar = document.createElement('div'); 
      vibePillsBar.className = 'category-pills-bar';
      Array.from(tagsSet).sort().forEach(tagVal => {
        const pill = document.createElement('div'); pill.className = 'cat-pill vibe-pill'; pill.dataset.tag = tagVal;

        if (this.activeTag === tagVal) pill.classList.add('is-active');
        pill.innerHTML = tagVal.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        vibePillsBar.appendChild(pill);
      });
      tagBody.appendChild(vibePillsBar); tagGroup.appendChild(tagBody); filtersContainer.appendChild(tagGroup);
      
      vibePillsBar.addEventListener('click', (e) => {
        e.preventDefault(); const pill = e.target.closest('.vibe-pill'); if (!pill) return;
        const tag = pill.dataset.tag;
        if (this.activeTag === tag) { this.activeTag = 'All'; pill.classList.remove('is-active'); } 
        else { 
          vibePillsBar.querySelectorAll('.vibe-pill').forEach(p => p.classList.remove('is-active'));
          this.activeTag = tag; pill.classList.add('is-active'); 
        }
        if (applyFiltersCallback) applyFiltersCallback();
      });

      tagSummary.querySelector('.mini-reset-btn').addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        this.activeTag = 'All';
        vibePillsBar.querySelectorAll('.vibe-pill').forEach(p => p.classList.remove('is-active'));
        if (applyFiltersCallback) applyFiltersCallback();
      });
    }

    // ==========================================
    // 4. COLLAPSIBLE NEIGHBORHOODS (Unicolor Pills)
    // ==========================================
    const areaGroup = document.createElement('details'); 
    areaGroup.className = 'filter-details-group';
    
    const areaSummary = document.createElement('summary'); 
    areaSummary.className = 'filter-summary';
    areaSummary.innerHTML = `
      <div class="filter-summary-title">📍 Neighborhoods</div>
      <button type="button" class="mini-reset-btn" title="Clear">✕</button>
    `;
    areaGroup.appendChild(areaSummary);
    
    const areaBody = document.createElement('div');
    areaBody.className = 'filter-details-body';
    
    const areaPillsBar = document.createElement('div'); 
    areaPillsBar.className = 'category-pills-bar';
    Array.from(neighborhoods).sort().forEach(area => { 
      const pill = document.createElement('div'); pill.className = 'cat-pill area-pill'; pill.dataset.area = area;

      if (this.activeArea === area) pill.classList.add('is-active');
      pill.innerHTML = area;
      areaPillsBar.appendChild(pill);
    });
    areaBody.appendChild(areaPillsBar); areaGroup.appendChild(areaBody); filtersContainer.appendChild(areaGroup); 
    
    areaPillsBar.addEventListener('click', (e) => {
      e.preventDefault(); const pill = e.target.closest('.area-pill'); if (!pill) return;
      const area = pill.dataset.area;
      if (this.activeArea === area) { this.activeArea = 'All'; pill.classList.remove('is-active'); } 
      else { 
        areaPillsBar.querySelectorAll('.area-pill').forEach(p => p.classList.remove('is-active'));
        this.activeArea = area; pill.classList.add('is-active'); 
      }
      if (applyFiltersCallback) applyFiltersCallback();
    });

    areaSummary.querySelector('.mini-reset-btn').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      this.activeArea = 'All';
      areaPillsBar.querySelectorAll('.area-pill').forEach(p => p.classList.remove('is-active'));
      if (applyFiltersCallback) applyFiltersCallback();
    });

    container.appendChild(filtersContainer);
  },

  applyFilters: function(allMarkers, map, dtlaCenter) {
    if (!allMarkers || !map) return;
    const bounds = new mapboxgl.LngLatBounds();
    let visibleCount = 0;
    allMarkers.forEach(item => {
      const matchesArea = (this.activeArea === 'All') || (item.neighborhood === this.activeArea);
      const matchesCategory = (this.activeCategories.size === 0) || this.activeCategories.has(item.category);
      const matchesTag = (this.activeTag === 'All') || (item.tags && item.tags.includes(this.activeTag));
      if (matchesArea && matchesCategory && matchesTag) { item.marker.addTo(map); bounds.extend([item.lng, item.lat]); visibleCount++; } 
      else { item.marker.remove(); }
    });
    if (visibleCount >= 1) {
       map.fitBounds(bounds, { maxZoom: 13.0 });
    } else {
       map.flyTo({ center: dtlaCenter, zoom: 10.2 });
    }
  }
};
