/* ==============================================================================
 * FILE: ui-all-la-view.js
 * CATEGORY: MarlonWalksLA Website - All LA Directory & Filter Controls
 * ============================================================================== */

window.MarlonAllLaView = {
  activeArea: 'All', activeCategories: new Set(), activeTag: 'All',

  render: function(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback, routeCallbacks) {
    if (!container) return;
    container.innerHTML = ``;

    // 1. MASTER SEARCH BAR (TOP)
    if (searchWrapper) {
      searchWrapper.style.marginBottom = '4px';
      container.appendChild(searchWrapper);
    }

    // 2. FILTERS CONTAINER (Fixes the side-by-side squish)
    const filtersContainer = document.createElement('div'); 
    filtersContainer.className = 'filters-master-container';
    
    // Categories
    const catGroup = document.createElement('div'); catGroup.className = 'dashboard-group';
    const catLabel = document.createElement('div'); catLabel.className = 'dashboard-label'; catLabel.innerText = '🏷️ Categories'; catGroup.appendChild(catLabel);
    
    const catPillsBar = document.createElement('div'); catPillsBar.className = 'category-pills-bar';
    Array.from(categories).sort().forEach(cat => {
      const pill = document.createElement('div'); pill.className = 'cat-pill'; pill.dataset.category = cat;
      if (this.activeCategories.has(cat)) pill.classList.add('is-active');
      const catDetails = window.MarlonSpotCard ? window.MarlonSpotCard.getCategoryDetails(cat, '', categoryMap, defaultPinSvg) : { color: '#3898ec', name: cat };
      pill.innerHTML = `<span class="cat-dot" style="background-color:${catDetails.color}; width:8px; height:8px; border-radius:50%; display:inline-block; margin-right:6px;"></span>${catDetails.name}`; 
      catPillsBar.appendChild(pill);
    });
    catGroup.appendChild(catPillsBar); filtersContainer.appendChild(catGroup); 
    
    catPillsBar.addEventListener('click', (e) => {
      e.preventDefault(); const pill = e.target.closest('.cat-pill'); if (!pill) return;
      const cat = pill.dataset.category;
      if (this.activeCategories.has(cat)) { this.activeCategories.delete(cat); pill.classList.remove('is-active'); } 
      else { this.activeCategories.add(cat); pill.classList.add('is-active'); }
      if (applyFiltersCallback) applyFiltersCallback();
    });

    // Vibes
    let vibePillsBar = null;
    if (tagsSet.size > 0) {
      const tagGroup = document.createElement('div'); tagGroup.className = 'dashboard-group';
      const tagLabel = document.createElement('div'); tagLabel.className = 'dashboard-label'; tagLabel.innerText = '✨ Vibe'; tagGroup.appendChild(tagLabel);
      
      vibePillsBar = document.createElement('div'); vibePillsBar.className = 'category-pills-bar';
      Array.from(tagsSet).sort().forEach(tagVal => {
        const pill = document.createElement('div'); pill.className = 'cat-pill vibe-pill'; pill.dataset.tag = tagVal;
        if (this.activeTag === tagVal) pill.classList.add('is-active');
        pill.innerHTML = tagVal.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        vibePillsBar.appendChild(pill);
      });
      tagGroup.appendChild(vibePillsBar); filtersContainer.appendChild(tagGroup);
      
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
    }

    // Neighborhoods & Reset
    const areaGroup = document.createElement('div'); areaGroup.className = 'dashboard-group';
    const areaLabel = document.createElement('div'); areaLabel.className = 'dashboard-label'; areaLabel.innerText = '📍 Neighborhoods'; areaGroup.appendChild(areaLabel);
    const areaSelect = document.createElement('select'); 
    areaSelect.style.padding = '8px'; areaSelect.style.borderRadius = '6px'; areaSelect.style.border = '1px solid #cbd5e0';
    areaSelect.innerHTML = `<option value="All">All LA Neighborhoods</option>`;
    Array.from(neighborhoods).sort().forEach(area => { 
      areaSelect.innerHTML += `<option value="${area}" ${this.activeArea === area ? 'selected' : ''}>${area}</option>`; 
    });
    areaGroup.appendChild(areaSelect); filtersContainer.appendChild(areaGroup); 
    areaSelect.addEventListener('change', (e) => { this.activeArea = e.target.value; if (applyFiltersCallback) applyFiltersCallback(); });

    const resetBtn = document.createElement('button'); resetBtn.type = 'button'; resetBtn.className = 'reset-filters-btn'; resetBtn.innerHTML = '↺ Reset Filters';
    resetBtn.style.padding = '8px'; resetBtn.style.background = '#f1f5f9'; resetBtn.style.border = '1px solid #cbd5e0'; resetBtn.style.borderRadius = '6px'; resetBtn.style.cursor = 'pointer'; resetBtn.style.fontWeight = '700';
    filtersContainer.appendChild(resetBtn);
    
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault(); this.activeArea = 'All'; this.activeTag = 'All'; this.activeCategories.clear();
      if (areaSelect) areaSelect.value = 'All';
      catPillsBar.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('is-active'));
      if (vibePillsBar) vibePillsBar.querySelectorAll('.vibe-pill').forEach(p => p.classList.remove('is-active'));
      if (applyFiltersCallback) applyFiltersCallback();
    });

    container.appendChild(filtersContainer);

    // 3. ROUTES SLIDER (BOTTOM)
    const allPresets = window.MARLON_ROUTES_PRESETS || [];
    if (allPresets.length > 0) {
      const routesSection = document.createElement('div');
      routesSection.className = 'routes-section';
      routesSection.style.marginTop = '8px';
      routesSection.style.borderTop = '2px dashed #cbd5e0';
      routesSection.style.paddingTop = '12px';

      routesSection.innerHTML = `
        <div class="featured-feed-title" style="margin-bottom: 2px;">🚶 Pre-Built Routes</div>
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
    if (visibleCount >= 1) map.fitBounds(bounds, { padding: 60, maxZoom: 13.0, duration: 1000 });
    else map.flyTo({ center: dtlaCenter, zoom: 10.2, duration: 1000 });
  }
};
