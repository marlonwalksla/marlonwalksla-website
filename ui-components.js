/* ==============================================================================
 * FILE: ui-components.js
 * CATEGORY: MarlonWalksLA Website - Reusable UI Shells & Spot Row Components
 * ============================================================================== */

window.MarlonComponents = {
  
  getSearchMatches: function(query, allMarkers, limit = 4) {
    if (!query || query.length < 2) return [];
    const lowerQuery = query.toLowerCase().trim();
    return allMarkers.filter(m => 
      m.title.toLowerCase().includes(lowerQuery) || 
      (m.neighborhood && m.neighborhood.toLowerCase().includes(lowerQuery))
    ).slice(0, limit);
  },

  renderSpotItemHTML: function(spot, options = {}) {
    const savedSpotIds = window.MarlonStorage.getSavedSpotIds();
    const visitedIds = window.MarlonStorage.getVisitedSpots();
    
    const isSaved = savedSpotIds.includes(spot.id);
    const isVisited = visitedIds.includes(spot.id);
    const gmapsLink = spot.isExternal ? spot.gmapsUrl : `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;

    return `
      <div class="itinerary-item nested-spot-item ${isVisited ? 'is-visited-item' : ''}" data-id="${spot.id}">
        <div class="itinerary-item-info spot-info-click" data-id="${spot.id}" style="flex: 1; padding-right: 4px; cursor: pointer;">
          <div class="itinerary-item-name" style="margin-bottom: 2px;">📍 ${spot.title}</div>
          <!-- Neighborhood removed per request -->
        </div>
        <div class="itinerary-item-actions" style="gap: 4px; display: flex; align-items: center;">
          ${options.showDaySelect ? `
            <select class="day-assign-select" data-id="${spot.id}" style="margin-right: 2px; padding: 2px 4px !important;">
              <option value="All" ${!options.currentDay || options.currentDay === 'All' ? 'selected' : ''}>Unassigned</option>
              <option value="Day 1" ${options.currentDay === 'Day 1' ? 'selected' : ''}>Day 1</option>
              <option value="Day 2" ${options.currentDay === 'Day 2' ? 'selected' : ''}>Day 2</option>
              <option value="Day 3" ${options.currentDay === 'Day 3' ? 'selected' : ''}>Day 3</option>
              <option value="Day 4" ${options.currentDay === 'Day 4' ? 'selected' : ''}>Day 4</option>
            </select>
          ` : ''}
          <a href="${gmapsLink}" target="_blank" class="icon-btn" title="Open Map" style="text-decoration:none;">🚗</a>
          <button type="button" class="icon-btn pin-toggle ${isSaved ? 'is-active' : ''}" data-id="${spot.id}" title="Pin to Trip">📌</button>
          <button type="button" class="icon-btn visited-toggle ${isVisited ? 'is-active' : ''}" data-id="${spot.id}" title="Visited">✓</button>
          ${options.showRemoveBtn ? `<button type="button" class="icon-btn remove-toggle" data-id="${spot.id}">✕</button>` : ''}
        </div>
      </div>
    `;
  },

  createShellCard: function(options = {}) {
    const card = document.createElement('div');
    card.className = 'route-block-card reusable-shell-card';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.overflow = 'visible';
    card.style.marginBottom = '10px';

    const header = document.createElement('div');
    header.className = 'route-block-header';
    header.style.backgroundColor = '#f0f7ff';
    header.style.justifyContent = 'space-between';
    header.innerHTML = `
      <span class="route-block-title" style="font-size: 13px;">${options.title || 'Locations'}</span>
      <div style="display:flex; gap: 6px; align-items:center;">
        ${options.headerActionsHTML || ''}
      </div>
    `;
    card.appendChild(header);

    const body = document.createElement('div');
    body.className = 'route-block-body';
    body.style.display = 'flex';
    body.style.flexDirection = 'column';
    body.style.gap = '6px';
    body.style.padding = '8px';

    const listFeed = document.createElement('div');
    listFeed.className = 'shell-items-feed';
    listFeed.style.display = 'flex';
    listFeed.style.flexDirection = 'column';
    listFeed.style.gap = '6px';
    // Removed max-height here so the flexbox layout controls the height dynamically
    listFeed.style.overflowY = 'auto';
    listFeed.innerHTML = options.itemsHTML || '';

    body.appendChild(listFeed);

    if (options.searchWrapper) {
      const searchWrapContainer = document.createElement('div');
      searchWrapContainer.className = 'manual-search-wrap';
      searchWrapContainer.style.position = 'relative';
      searchWrapContainer.style.marginTop = '6px';
      searchWrapContainer.appendChild(options.searchWrapper);
      body.appendChild(searchWrapContainer);
    }

    card.appendChild(body);
    return card;
  }
};
