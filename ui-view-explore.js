/* ==============================================================================
 * FILE: ui-view-explore.js
 * CATEGORY: MarlonWalksLA Website - Explore LA View Controller
 * ============================================================================== */

let allExploreSpots = [];

window.initExploreView = function(geoJsonData) {
  if (!geoJsonData || !geoJsonData.features) return;
  allExploreSpots = geoJsonData.features;
  populateDropdownFilters(allExploreSpots);
  setupFilterListeners();
};

function populateDropdownFilters(spots) {
  const categories = new Set();
  const vibes = new Set();
  const neighborhoods = new Set();

  spots.forEach(spot => {
    const props = spot.properties;
    if (props.category) categories.add(props.category);
    if (props.vibe) {
      if (Array.isArray(props.vibe)) {
        props.vibe.forEach(v => vibes.add(v));
      } else {
        vibes.add(props.vibe);
      }
    }
    if (props.neighborhood) neighborhoods.add(props.neighborhood);
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
    opt.textContent = item;
    selectEl.appendChild(opt);
  });
}

function setupFilterListeners() {
  const categorySelect = document.querySelector('#filter-category');
  const vibeSelect = document.querySelector('#filter-vibe');
  const neighborhoodSelect = document.querySelector('#filter-neighborhood');
  const searchInput = document.querySelector('#search-input');

  const applyFilters = () => {
    const catVal = categorySelect?.value || '';
    const vibeVal = vibeSelect?.value || '';
    const neighVal = neighborhoodSelect?.value || '';
    const query = searchInput?.value.toLowerCase().trim() || '';

    const filtered = allExploreSpots.filter(spot => {
      const p = spot.properties || {};
      const matchesCat = !catVal || p.category === catVal;
      const matchesVibe = !vibeVal || (Array.isArray(p.vibe) ? p.vibe.includes(vibeVal) : p.vibe === vibeVal);
      const matchesNeigh = !neighVal || p.neighborhood === neighVal;
      const matchesQuery = !query || (p.name && p.name.toLowerCase().includes(query));

      return matchesCat && matchesVibe && matchesNeigh && matchesQuery;
    });

    if (window.updateMapMarkers) {
      window.updateMapMarkers(filtered);
    }
    renderSpotCards(filtered);
  };

  [categorySelect, vibeSelect, neighborhoodSelect].forEach(el => {
    el?.addEventListener('change', applyFilters);
  });

  searchInput?.addEventListener('input', applyFilters);
}

function renderSpotCards(spots) {
  const container = document.querySelector('#spot-cards-list');
  if (!container) return;

  if (spots.length === 0) {
    container.innerHTML = `<p class="no-results">No places match your search.</p>`;
    return;
  }

  container.innerHTML = spots.map(spot => `
    <div class="spot-card" data-id="${spot.properties.id || ''}">
      <h4>${spot.properties.name || 'Unnamed Location'}</h4>
      <p>${spot.properties.neighborhood || ''} • ${spot.properties.category || ''}</p>
    </div>
  `).join('');
}
