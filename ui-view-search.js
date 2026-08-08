/* ==============================================================================
 * FILE: ui-view-search.js
 * CATEGORY: MarlonWalksLA Website - Tabbed Filter & Search Engine using Central Components
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

    const masterWrap = document.createElement('div');
    masterWrap.className = 'search-view-wrapper';
    masterWrap.style.display = 'flex';
    masterWrap.style.flexDirection = 'column';
    masterWrap.style.gap = '8px';
    masterWrap.style.width = '100%';

    // 1. TOP MODE SWITCHER PILLS
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

    // 2. SUB-FILTER PILLS & FILTERED SPOTS LIST
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

    // Build list items using central MarlonComponents
    let itemsHTML = '';
    if (spotsToDisplay.length === 0) {
      itemsHTML = `<div style="text-align:center; padding:12px; color:#94a3b8; font-size:12px; font-style:italic;">No locations match this filter.</div>`;
    } else {
      itemsHTML = spotsToDisplay.map(m => window.MarlonComponents.renderSpotItemHTML(m)).join('');
    }

    // 3. BUILD REUSABLE SHELL WITH SEARCH AT BOTTOM
    const headerActionsHTML = `
      <button type="button" class="import-preset-btn pin-all-btn" style="font-size:10px; padding:4px 8px;">📌 Pin All</button>
      <button type="button" class="icon-btn remove-toggle mini-reset-btn" title="Clear Filters">✕</button>
    `;

    const shellCard = window.MarlonComponents.createShellCard({
      title: '🔍 Search LA',
      headerActionsHTML: headerActionsHTML,
      itemsHTML: itemsHTML,
      searchWrapper: searchWrapper
    });

    // Inject sub-pills into shell body above items if active
    if (filterPillsRow.style.display !== 'none') {
      const shellBody = shellCard.querySelector('.route-block-body');
      shellBody.insertBefore(filterPillsRow, shellBody.firstChild);
    }

    masterWrap.appendChild(shellCard);
    container.appendChild(masterWrap);

    // 4. ATTACH EVENT LISTENERS
    filterModeBar.querySelectorAll('.day-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.activeTabMode = btn.dataset.mode;
        this.render(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback);
      });
    });

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

    shellCard.querySelectorAll('.spot-info-click').forEach(info => {
      info.addEventListener('click', (e) => {
        e.preventDefault();
        const mId = info.dataset.id;
        const match = allMarkers.find(m => m.id === mId);
        if (match && match.wrapper) match.wrapper.click();
      });
    });

    shellCard.querySelectorAll('.pin-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.MarlonStorage.toggleSavedSpot(btn.dataset.id, 'All');
        this.render(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback);
      });
    });

    shellCard.querySelectorAll('.visited-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.MarlonStorage.toggleVisitedSpot(btn.dataset.id);
        this.render(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback);
      });
    });

    const pinAllBtn = shellCard.querySelector('.pin-all-btn');
    if (pinAllBtn) {
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

        if (addedCount > 0) alert(`📌 Added ${addedCount} spot(s) to your Trip!`);
        else alert(`All visible spots are already in your Trip!`);
        this.render(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback);
      });
    }

    const resetBtn = shellCard.querySelector('.mini-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.activeTabMode === 'categories') this.activeCategories.clear();
        if (this.activeTabMode === 'vibes') this.activeTag = 'All';
        if (this.activeTabMode === 'neighborhoods') this.activeArea = 'All';

        if (applyFiltersCallback) applyFiltersCallback();
        this.render(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, applyFiltersCallback);
      });
    }
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
      
      if (this.activeTabMode === 'popular') {
        isVisible = popularMatches.includes(item.id);
      } else if (this.activeTabMode === 'categories') {
        isVisible = (this.activeCategories.size === 0) || this.activeCategories.has(item.category);
      } else if (this.activeTabMode === 'vibes') {
        isVisible = (this.activeTag === 'All') || (item.tags && item.tags.includes(this.activeTag));
      } else if (this.activeTabMode === 'neighborhoods') {
        isVisible = (this.activeArea === 'All') || (item.neighborhood === this.activeArea);
      }

      if (isVisible) { 
        item.marker.addTo(map); 
        bounds.extend([item.lng, item.lat]); 
        visibleCount++; 
      } else { 
        item.marker.remove(); 
      }
    });

    if (visibleCount >= 1) {
      map.fitBounds(bounds, { padding: 50, maxZoom: 13.0 });
    } else {
      map.flyTo({ center: dtlaCenter, zoom: 10.2 });
    }
  }
