/* ==============================================================================
 * FILE: ui-view-explore.js
 * CATEGORY: MarlonWalksLA Website - Explore LA View Controller
 * ============================================================================== */

let allExploreSpots = [];

// Helper to normalize GeoJSON properties (handles Capitalized & Lowercase keys)
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
  
  // Render initial spot cards list immediately
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
    // Format slugified tags (e.g. "beach-vibes" -> "Beach Vibes")
    opt.textContent = item.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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

  [categorySelect, vibeSelect, neighborhoodSelect].forEach(el => {
    el?.addEventListener('change', applyFilters);
  });

  searchInput?.addEventListener('input', applyFilters);
}

function renderSpotCards(spots) {
  const container = document.querySelector('#spot-cards-list');
  if (!container) return;

  if (spots.length === 0) {
    container.innerHTML = `<p class="no-results" style="padding: 12px; color: #64748b;">No places match your search.</p>`;
    return;
  }

  container.innerHTML = spots.map(spot => {
    const item = parseSpotProps(spot);
    return `
      <div class="spot-card" data-id="${item.id}" style="cursor: pointer;">
        <h4>${item.name}</h4>
        <p>${item.neighborhood} • ${item.category}</p>
      </div>
    `;
  }).join('');

  // Click listener on spot cards to fly map to spot
  container.querySelectorAll('.spot-card').forEach(card => {
    card.addEventListener('click', () => {
      const spotId = card.getAttribute('data-id');
      if (window.MARLON_ALL_MARKERS) {
        const match = window.MARLON_ALL_MARKERS.find(m => m.id === spotId);
        if (match && match.wrapper) {
          match.wrapper.click();
        }
      }
    });
  });
}
