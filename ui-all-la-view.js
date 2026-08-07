/* ==============================================================================
 * FILE: ui-all-la-view.js
 * CATEGORY: MarlonWalksLA Website - All LA Directory & Filter Controls
 * ============================================================================== */

window.MarlonAllLaView = {
  activeArea: 'All', activeCategories: new Set(), activeTag: 'All',

  render: function(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, hotelAnchorBox, applyFiltersCallback) {
    if (!container) return;
    container.innerHTML = ``;

    if (searchWrapper) container.appendChild(searchWrapper);
    if (hotelAnchorBox) container.appendChild(hotelAnchorBox);

    const headerIntro = document.createElement('div');
    headerIntro.className = 'featured-feed-header';
    headerIntro.innerHTML = `<span class="featured-feed-title" style="margin-top:10px;">🌐 All Locations</span>`;
    container.appendChild(headerIntro);

    const catGroup = document.createElement('div'); catGroup.className = 'dashboard-group';
    const catLabel = document.createElement('div'); catLabel.className = 'dashboard-label'; catLabel.innerText = '🏷️ Categories'; catGroup.appendChild(catLabel);
    
    const catPillsBar = document.createElement('div'); catPillsBar.className = 'category-pills-bar';
    Array.from(categories).sort().forEach(cat => {
      const pill = document.createElement('div'); pill.className = 'cat-pill'; pill.dataset.category = cat;
      const catDetails = window.MarlonSpotCard ? window.MarlonSpotCard.getCategoryDetails(cat, '', categoryMap, defaultPinSvg) : { color: '#3898ec', name: cat };
      pill.innerHTML = `<span class="cat-dot" style="background-color:${catDetails.color}"></span>${catDetails.name}`; 
      catPillsBar.appendChild(pill);
    });
    catGroup.appendChild(catPillsBar); container.appendChild(catGroup); 
    
    catPillsBar.addEventListener('click', (e) => {
      e.preventDefault(); const pill = e.target.closest('.cat-pill'); if (!pill) return;
      const cat = pill.dataset.category;
      if (this.activeCategories.has(cat)) { this.activeCategories.delete(cat); pill.classList.remove('is-active'); } 
      else { this.activeCategories.add(cat); pill.classList.add('is-active'); }
      if (applyFiltersCallback) applyFiltersCallback();
    });

    let vibePillsBar = null;
    if (tagsSet.size > 0) {
      const tagGroup = document.createElement('div'); tagGroup.className = 'dashboard-group';
      const tagLabel = document.createElement('div'); tagLabel.className = 'dashboard-label'; tagLabel.innerText = '✨ Vibe'; tagGroup.appendChild(tagLabel);
      
      vibePillsBar = document.createElement('div'); vibePillsBar.className = 'category-pills-bar';
      Array.from(tagsSet).sort().forEach(tagVal => {
        const pill = document.createElement('div'); pill.className = 'cat-pill vibe-pill'; pill.dataset.tag = tagVal;
        pill.innerHTML = tagVal.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        vibePillsBar.appendChild(pill);
      });
      tagGroup.appendChild(vibePillsBar); container.appendChild(tagGroup);
      
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

    const areaGroup = document.createElement('div'); areaGroup.className = 'dashboard-group';
    const areaLabel = document.createElement('div'); areaLabel.className = 'dashboard-label'; areaLabel.innerText = '📍 Neighborhoods'; areaGroup.appendChild(areaLabel);
    const areaSelect = document.createElement('select'); areaSelect.innerHTML = `<option value="All">All LA Neighborhoods</option>`;
    Array.from(neighborhoods).sort().forEach(area => { areaSelect.innerHTML += `<option value="${area}">${area}</option>`; });
    areaGroup.appendChild(areaSelect); container.appendChild(areaGroup); 
    
    areaSelect.addEventListener('change', (e) => { this.activeArea = e.target.value; if (applyFiltersCallback) applyFiltersCallback(); });

    const resetBtn = document.createElement('button'); resetBtn.type = 'button'; resetBtn.className = 'reset-filters-btn'; resetBtn.innerHTML = '↺ Reset Filters';
    container.appendChild(resetBtn);
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault(); this.activeArea = 'All'; this.activeTag = 'All'; this.activeCategories.clear();
      if (areaSelect) areaSelect.value = 'All';
      catPillsBar.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('is-active'));
      if (vibePillsBar) vibePillsBar.querySelectorAll('.vibe-pill').forEach(p => p.classList.remove('is-active'));
      if (applyFiltersCallback) applyFiltersCallback();
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
      if (matchesArea && matchesCategory && matchesTag) { item.marker.addTo(map); bounds.extend([item.lng, item.lat]); visibleCount++; } 
      else { item.marker.remove(); }
    });
    if (visibleCount >= 1) map.fitBounds(bounds, { padding: 60, maxZoom: 13.0, duration: 1000 });
    else map.flyTo({ center: dtlaCenter, zoom: 10.2, duration: 1000 });
  }
};
