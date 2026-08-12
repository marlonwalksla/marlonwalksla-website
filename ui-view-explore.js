/* ==============================================================================
 * FILE: ui-view-explore.js
 * CATEGORY: MarlonWalksLA Website - Explore LA View Controller
 * ============================================================================== */

let allExploreSpots = [];

function parseSpotProps(spot) {
  const p = spot.properties || {};
  const tagsRaw = p.Tags || p.tags || p.vibe || '';
  let tagList = [];
  if (Array.isArray(tagsRaw)) {
    tagList = tagsRaw;
  } else if (typeof tagsRaw === 'string') {
    tagList = tagsRaw.split(/[,;]/).map(t => t.trim().toLowerCase()).filter(Boolean);
  }

  return {
    id: (p.Slug || p.Item_ID || p.Name || p.id || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: p.Name || p.title || p.name || 'Unnamed Location',
    category: p.Category || p.category || 'Landmarks',
    neighborhood: p.City || p.city || p.neighborhood || 'Downtown LA',
    description: p.Description || p.description || '',
    tags: tagList,
    rawSpot: spot
  };
}

window.initExploreView = function(geoJsonData) {
  if (!geoJsonData || !geoJsonData.features) return;
  allExploreSpots = geoJsonData.features;

  populateDropdownFilters(allExploreSpots);
  setupFilterListeners();
  renderSpotCards(allExploreSpots);
};

function populateDropdownFilters(spots) {
  const categories = new Set();
  const vibes = new Set();
  const neighborhoods = new Set();

  spots.forEach(spot => {
    const item = parseSpotProps(spot);
    if (item.category) categories.add(item.category);
    if (item.neighborhood) neighborhoods.add(item.neighborhood);
    item.tags.forEach(v => vibes.add(v));
  });

  fillSelectElement('#filter-category', Array.from(categories).sort(), 'All Categories');
  fillSelectElement('#filter-vibe', Array.from(vibes).sort(), 'All Vibes');
  fillSelectElement('#filter-neighborhood', Array.from(neighborhoods).sort(), 'All Neighborhoods');
}

function fillSelectElement(selector, items, placeholder) {
  const selectEl = document.querySelector(selector);
  if (!selectEl) return;

  selectEl.innerHTML = `<option value="">${placeholder}</option>`;
  items.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item;
    opt.textContent = item.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    selectEl.appendChild(opt);
  });
}

function setupFilterListeners() {
  const categorySelect = document.querySelector('#filter-category');
  const vibeSelect = document.querySelector('#filter-vibe');
  const neighborhoodSelect = document.querySelector('#filter-neighborhood');
  const searchInput = document.querySelector('#search-input');
  const clearBtn = document.querySelector('#search-clear-btn');
  const resetAllBtn = document.querySelector('#reset-all-filters-btn');

  const applyFilters = () => {
    const catVal = categorySelect?.value || '';
    const vibeVal = vibeSelect?.value || '';
    const neighVal = neighborhoodSelect?.value || '';
    const query = searchInput?.value.toLowerCase().trim() || '';

    if (clearBtn) {
      clearBtn.style.display = query ? 'block' : 'none';
    }

    const isAnyFilterActive = Boolean(query || catVal || vibeVal || neighVal);
    if (resetAllBtn) {
      resetAllBtn.style.display = isAnyFilterActive ? 'inline-flex' : 'none';
    }

    const filtered = allExploreSpots.filter(spot => {
      const item = parseSpotProps(spot);
      const matchesCat = !catVal || item.category === catVal;
      const matchesVibe = !vibeVal || item.tags.includes(vibeVal.toLowerCase());
      const matchesNeigh = !neighVal || item.neighborhood === neighVal;
      const matchesQuery = !query || item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);

      return matchesCat && matchesVibe && matchesNeigh && matchesQuery;
    });

    if (window.updateMapMarkers) {
      window.updateMapMarkers(filtered);
    }
    renderSpotCards(filtered);
  };

  // Expose function globally for mode switches
  window.reapplyExploreFilters = applyFilters;

  [categorySelect, vibeSelect, neighborhoodSelect].forEach(el => {
    el?.addEventListener('change', applyFilters);
  });

  searchInput?.addEventListener('input', applyFilters);

  clearBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    applyFilters();
  });

  resetAllBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (categorySelect) categorySelect.selectedIndex = 0;
    if (vibeSelect) vibeSelect.selectedIndex = 0;
    if (neighborhoodSelect) neighborhoodSelect.selectedIndex = 0;
    applyFilters();
  });
}

function renderSpotCards(spots) {
  const container = document.querySelector('#spot-cards-list');
  if (!container) return;

  if (spots.length === 0) {
    container.innerHTML = `<p class="no-results" style="padding: 12px; color: #64748b; font-size: 0.8rem;">No places match your search.</p>`;
    return;
  }

  const tripData = window.MarlonStorage ? window.MarlonStorage.getSavedTripData() : { pinned: [], visited: [] };
  const pinnedSet = new Set(tripData.pinned || []);
  const visitedSet = new Set(tripData.visited || []);

  container.innerHTML = spots.map(spot => {
    const item = parseSpotProps(spot);
    const isPinned = pinnedSet.has(item.id);
    const isVisited = visitedSet.has(item.id);

    return `
      <div class="spot-card" data-id="${item.id}">
        <div class="spot-card-info">
          <h4>${item.name}</h4>
          <p>${item.neighborhood} • ${item.category}</p>
        </div>
        <div class="spot-card-actions">
          <button type="button" class="card-action-btn btn-quick-pin ${isPinned ? 'is-active' : ''}" data-action="pin" data-id="${item.id}" title="Pin to My Trip">📌</button>
          <button type="button" class="card-action-btn btn-quick-visit ${isVisited ? 'is-active' : ''}" data-action="visit" data-id="${item.id}" title="Mark Visited">✅</button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.spot-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('.card-action-btn');
      const spotId = card.getAttribute('data-id');

      if (targetBtn) {
        e.stopPropagation();
        const action = targetBtn.getAttribute('data-action');

        if (action === 'pin' && window.MarlonStorage) {
          window.MarlonStorage.toggleSavedSpot(spotId);
        } else if (action === 'visit' && window.MarlonStorage) {
          window.MarlonStorage.toggleVisitedSpot(spotId);
        }

        if (window.updateMarlonMarkerStates) window.updateMarlonMarkerStates();
        renderSpotCards(spots);
        return;
      }

      if (window.MARLON_ALL_MARKERS) {
        const match = window.MARLON_ALL_MARKERS.find(m => m.id === spotId);
        if (match && match.wrapper) match.wrapper.click();
      }
    });
  });
}
