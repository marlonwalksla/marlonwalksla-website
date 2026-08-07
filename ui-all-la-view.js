/* ==============================================================================
 * FILE: ui-all-la-view.js
 * CATEGORY: MarlonWalksLA Website - All LA Directory & Filter Controls
 * ============================================================================== */

window.MarlonAllLaView = {
  activeArea: 'All', activeCategories: new Set(), activeTag: 'All',

  render: function(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback, routeCallbacks) {
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
    // 1. COLLAPSIBLE CATEGORIES
    // ==========================================
    const catGroup = document.createElement('details'); 
    catGroup.className = 'filter-details-group';
    catGroup.open = true; // Open by default
    
    const catSummary = document.createElement('summary'); 
    catSummary.className = 'filter-summary';
    catSummary.innerHTML = `
      <div class="filter-summary-title">🏷️ Categories</div>
      <button type="button" class="mini-reset-btn">Reset</button>
    `;
    catGroup.appendChild(catSummary);
    
    const catBody = document.createElement('div');
    catBody.className = 'filter-details-body';
    
    const catPillsBar = document.createElement('div'); 
    catPillsBar.className = 'category-pills-bar';
    Array.from(categories).sort().forEach(cat => {
      const pill = document.createElement('div'); pill.className = 'cat-pill'; pill.dataset.category = cat;
      if (this.activeCategories.has(cat)) pill.classList.add('is-active');
      const catDetails = window.MarlonSpotCard ? window.MarlonSpotCard.getCategoryDetails(cat, '', categoryMap, defaultPinSvg) : { color: '#2B82B9', name: cat };
      pill.innerHTML = `<span class="cat-dot" style="background-color:${catDetails.color}; width:8px; height:8px; border-radius:50%; display:inline-block; margin-right:6px;"></span>${catDetails.name}`; 
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
      e.preventDefault(); e.stopPropagation(); // Prevents the accordion from closing
      this.activeCategories.clear();
      catPillsBar.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('is-active'));
      if (applyFiltersCallback) applyFiltersCallback();
    });

    // ==========================================
    // 2. COLLAPSIBLE VIBES
    // ==========================================
    let vibePillsBar = null;
    if (tagsSet.size > 0) {
      const tagGroup = document.createElement('details'); 
      tagGroup.className = 'filter-details-group';
      
      const tagSummary = document.createElement('summary'); 
      tagSummary.className = 'filter-summary';
      tagSummary.innerHTML = `
        <div class="filter-summary-title">✨ Vibe</div>
        <button type="button" class="mini-reset-btn">Reset</button>
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
    // 3. COLLAPSIBLE NEIGHBORHOODS
    // ==========================================
    const areaGroup = document.createElement('details'); 
    areaGroup.className = 'filter-details-group';
    
    const areaSummary = document.createElement('summary'); 
    areaSummary.className = 'filter-summary';
    areaSummary.innerHTML = `
      <div class="filter-summary-title">📍 Neighborhoods</div>
      <button type="button" class="mini-reset-btn">Reset</button>
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

    // Master Reset Button (Clears Everything)
    const masterResetBtn = document.createElement('button'); masterResetBtn.type = 'button'; masterResetBtn.className = 'reset-filters-btn'; masterResetBtn.innerHTML = '↺ Clear All Filters';
    masterResetBtn.style.padding = '10px'; masterResetBtn.style.background = '#f1f5f9'; masterResetBtn.style.border = '1px solid #cbd5e0'; masterResetBtn.style.borderRadius = '8px'; masterResetBtn.style.cursor = 'pointer'; masterResetBtn.style.fontWeight = '800'; masterResetBtn.style.color = '#475569';
    filtersContainer.appendChild(masterResetBtn);
    
    masterResetBtn.addEventListener('click', (e) => {
      e.preventDefault(); 
      this.activeArea = 'All'; this.activeTag = 'All'; this.activeCategories.clear();
      areaPillsBar.querySelectorAll('.area-pill').forEach(p => p.classList.remove('is-active'));
      catPillsBar.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('is-active'));
      if (vibePillsBar) vibePillsBar.querySelectorAll('.vibe-pill').forEach(p => p.classList.remove('is-active'));
      if (applyFiltersCallback) applyFiltersCallback();
    });

    container.appendChild(filtersContainer);

    // ==========================================
    // 4. ROUTES SLIDER (BOTTOM)
    // ==========================================
    const allPresets = window.MARLON_ROUTES_PRESETS || [];
    if (allPresets.length > 0) {
      const routesSection = document.createElement('div');
      routesSection.className = 'routes-section';
      routesSection.style.marginTop = '12px';
      routesSection.style.borderTop = '2px dashed #cbd5e0';
      routesSection.style.paddingTop = '16px';

      routesSection.innerHTML = `
        <div class="featured-feed-title" style="margin-bottom: 4px; font-size: 14px; font-weight: 800;">🚶 Pre-Built Routes</div>
        <div class="routes-slider-wrapper">
          ${allPresets.map(preset => `
            <div class="route-slide-card">
              <div style="font-size: 13px; font-weight: 800; color: #0f172a;">${preset.title}</div>
              <div style="font-size: 10px; font-weight: 700; color: #3b82f6;">${preset.duration} • ${preset.spotTitles.length} stops</div>
              <div style="font-size: 11px; color: #475569; margin: 4px 0; line-height: 1.4;">${preset.desc}</div>
              <div style="display: flex; gap: 6px; margin-top: auto; padding-top: 8px;">
                 <button type="button" class="import-route-btn" data-id="${preset.id}" style="flex:1; background:#2563eb; color:#fff; border:none; padding:8px; border-radius:6px; font-size:11px; font-weight:800; cursor:pointer;">+ Add to Trip</button>
                 <button type="button" class="view-route-btn" data-id="${preset.id}" style="flex:1; background:#f8fafc; color:#475569; border:1px solid #cbd5e0; padding:8px; border-radius:6px; font-size:11px; font-weight:800; cursor:pointer;">🗺️ View</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      container.appendChild(routesSection);

      routesSection.querySelectorAll('.import-route-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          window.MarlonStorage.toggleRouteBlock(btn.dataset.id, 'Day 1');
          alert('Route added to Day 1!');
          if (routeCallbacks && routeCallbacks.onImportRoute) routeCallbacks.onImportRoute();
        });
      });
      routesSection.querySelectorAll('.view-route-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          if (routeCallbacks && routeCallbacks.onPanToRoute) routeCallbacks.onPanToRoute(btn.dataset.id);
        });
      });
    }
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
