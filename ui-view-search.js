/* ==============================================================================
 * FILE: ui-view-search.js
 * CATEGORY: MarlonWalksLA Website - Tabbed Filter & Search Engine using Central Components
 * ============================================================================== */

window.MarlonSearchView = {
  activeTabMode: 'popular',
  activeArea: 'All',
  activeCategories: new Set(),
  activeTag: 'All',

  top10Popular: [
    'Griffith Observatory', 'Santa Monica Pier', 'Venice Canals', 'The Grove', 
    'The Broad', 'The Getty Center', 'Rodeo Drive', 'Hollywood Walk of Fame', 
    'Lake Hollywood Park', 'LACMA'
  ],

  render: function(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback) {
    if (!container) return;
    container.innerHTML = '';
    const allMarkers = window.MARLON_ALL_MARKERS || [];

    const masterWrap = document.createElement('div');
    masterWrap.className = 'search-view-wrapper';
    masterWrap.style.display = 'flex';
    masterWrap.style.flexDirection = 'column';
    masterWrap.style.gap = '8px';
    masterWrap.style.width = '100%';

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

    const filterPillsRow = document.createElement('div');
    filterPillsRow.className = 'category-pills-bar';
    filterPillsRow.style.display = 'flex';
    filterPillsRow.style.flexWrap = 'wrap';
    filterPillsRow.style.gap = '6px';
    filterPillsRow.style.marginBottom = '6px';

    let spotsToDisplay = [];

    if (this.activeTabMode === 'popular') {
      filterPillsRow.style.display = 'none';
      this.top10Popular.forEach(name => {
        const match = allMarkers.find(m => m.title.toLowerCase().trim().includes(name.toLowerCase().trim()));
        if (match && !spotsToDisplay.includes(match)) spotsToDisplay.push(match);
      });
    } else if (this.activeTabMode === 'categories') {
      Array.from(categories).sort().forEach(cat => {
        const pill = document.createElement('div'); pill.className = 'cat-pill'; pill.dataset.category = cat;
        if (this.activeCategories.has(cat)) pill.classList.add('is-active');
        pill.innerHTML = (categoryMap[cat] ? categoryMap[cat].name : cat);
        filterPillsRow.appendChild(pill);
      });
      spotsToDisplay = allMarkers.filter(m => (this.activeCategories.size === 0) || this.activeCategories.has(m.category));
    } else if (this.activeTabMode === 'vibes') {
      Array.from(tagsSet).sort().forEach(tagVal => {
        const pill = document.createElement('div'); pill.className = 'cat-pill vibe-pill'; pill.dataset.tag = tagVal;
        if (this.activeTag === tagVal) pill.classList.add('is-active');
        pill.innerHTML = tagVal.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        filterPillsRow.appendChild(pill);
      });
      spotsToDisplay = allMarkers.filter(m => (this.activeTag === 'All') || (m.tags && m.tags.includes(this.activeTag)));
    } else if (this.activeTabMode === 'neighborhoods') {
      Array.from(neighborhoods).sort().forEach(area => {
        const pill = document.createElement('div'); pill.className = 'cat-pill area-pill'; pill.dataset.area = area;
        if (this.activeArea === area) pill.classList.add('is-active');
        pill.innerHTML = area;
        filterPillsRow.appendChild(pill);
      });
      spotsToDisplay = allMarkers.filter(m => (this.activeArea === 'All') || (m.neighborhood === this.activeArea));
    }

    let itemsHTML = spotsToDisplay.length === 0 
      ? `<div style="text-align:center; padding:12px; color:#94a3b8; font-size:12px; font-style:italic;">No locations match this filter.</div>`
      : spotsToDisplay.map(m => window.MarlonComponents.renderSpotItemHTML(m)).join('');

    const shellCard = window.MarlonComponents.createShellCard({
      title: '🔍 Search LA',
      headerActionsHTML: `
        <button type="button" class="import-preset-btn pin-all-btn" style="font-size:10px; padding:4px 8px;">📌 Pin All</button>
        <button type="button" class="icon-btn remove-toggle mini-reset-btn" title="Clear Filters">✕</button>
      `,
      itemsHTML: itemsHTML,
      searchWrapper: searchWrapper
    });

    if (filterPillsRow.style.display !== 'none') {
      const shellBody = shellCard.querySelector('.route-block-body');
      shellBody.insertBefore(filterPillsRow, shellBody.firstChild);
    }

    masterWrap.appendChild(shellCard);
    container.appendChild(masterWrap);

    // Event Delegation
    masterWrap.addEventListener('click', (e) => {
      const modeBtn = e.target.closest('.day-pill');
      if (modeBtn) {
        e.preventDefault();
        this.activeTabMode = modeBtn.dataset.mode;
        this.render(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback);
        if (applyFiltersCallback) applyFiltersCallback();
        return;
      }

      const pillBtn = e.target.closest('.cat-pill');
      if (pillBtn) {
        e.preventDefault();
        if (this.activeTabMode === 'categories') {
          const cat = pillBtn.dataset.category;
          this.activeCategories.has(cat) ? this.activeCategories.delete(cat) : this.activeCategories.add(cat);
        } else if (this.activeTabMode === 'vibes') {
          this.activeTag = (this.activeTag === pillBtn.dataset.tag) ? 'All' : pillBtn.dataset.tag;
        } else if (this.activeTabMode === 'neighborhoods') {
          this.activeArea = (this.activeArea === pillBtn.dataset.area) ? 'All' : pillBtn.dataset.area;
        }
        this.render(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback);
        if (applyFiltersCallback) applyFiltersCallback();
        return;
      }

      const infoBtn = e.target.closest('.spot-info-click');
      if (infoBtn) {
        const match = allMarkers.find(m => m.id === infoBtn.dataset.id);
        if (match && match.wrapper) match.wrapper.click();
      }

      const pinToggle = e.target.closest('.pin-toggle');
      if (pinToggle) {
        e.stopPropagation();
        window.MarlonStorage.toggleSavedSpot(pinToggle.dataset.id, 'All');
        this.render(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback);
      }

      const resetBtn = e.target.closest('.mini-reset-btn');
      if (resetBtn) {
        e.stopPropagation();
        this.activeCategories.clear();
        this.activeTag = 'All';
        this.activeArea = 'All';
        this.render(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback);
        if (applyFiltersCallback) applyFiltersCallback();
      }
    });
  },

  applyFilters: function(allMarkers, map, dtlaCenter) {
    if (!allMarkers || !map) return;
    const bounds = new mapboxgl.LngLatBounds();
    let visibleCount = 0;

    let popularMatches = [];
    if (this.activeTabMode === 'popular') {
      this.top10Popular.forEach(name => {
        const match = allMarkers.find(m => m.title.toLowerCase().trim().includes(name.toLowerCase().trim()));
        if (match) popularMatches.push(match.id);
      });
    }

    allMarkers.forEach(item => {
      let isVisible = false;
      if (this.activeTabMode === 'popular') isVisible = popularMatches.includes(item.id);
      else if (this.activeTabMode === 'categories') isVisible = (this.activeCategories.size === 0) || this.activeCategories.has(item.category);
      else if (this.activeTabMode === 'vibes') isVisible = (this.activeTag === 'All') || (item.tags && item.tags.includes(this.activeTag));
      else if (this.activeTabMode === 'neighborhoods') isVisible = (this.activeArea === 'All') || (item.neighborhood === this.activeArea);

      if (isVisible) { 
        item.marker.addTo(map); 
        bounds.extend([item.lng, item.lat]); 
        visibleCount++; 
      } else { 
        item.marker.remove(); 
      }
    });

    if (visibleCount > 0) {
      map.fitBounds(bounds, { padding: 40, maxZoom: 13.5, duration: 800 });
    } else {
      map.flyTo({ center: dtlaCenter, zoom: 10.2 });
    }
  }
};
