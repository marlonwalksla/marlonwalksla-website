/* ==============================================================================
 * FILE: ui-search.js
 * CATEGORY: MarlonWalksLA Website - Global Search & Geocoding Autocomplete
 * ============================================================================== */

window.MarlonSearch = {
  init: function(wrapper, map, allMarkers, dtlaCenter, callbacks) {
    if (!wrapper) return;

    const input = wrapper.querySelector('.map-search-input');
    const dropdown = wrapper.querySelector('.search-results-dropdown');
    if (!input || !dropdown) return;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') e.preventDefault();
    });

    input.addEventListener('input', async () => {
      const query = input.value.trim().toLowerCase();
      if (query.length < 2) {
        dropdown.style.display = 'none';
        return;
      }

      // 1. Filter internal 102 curated spots
      const curatedMatches = allMarkers.filter(m => 
        m.title.toLowerCase().includes(query) || 
        (m.neighborhood && m.neighborhood.toLowerCase().includes(query)) ||
        (m.category && m.category.toLowerCase().includes(query))
      ).slice(0, 5);

      let html = curatedMatches.map(m => `
        <div class="search-result-item" data-type="curated" data-id="${m.id}">
          <div>
            <div class="search-result-title">📍 ${m.title}</div>
            <div class="search-result-meta">${m.neighborhood || ''} • ${m.category || ''}</div>
          </div>
          <span class="search-badge curated">Spot</span>
        </div>
      `).join('');

      // 2. Fetch external addresses and hotels via Mapbox Geocoding API
      if (query.length > 3 && typeof mapboxgl !== 'undefined') {
        try {
          const geoRes = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?proximity=${dtlaCenter[0]},${dtlaCenter[1]}&access_token=${mapboxgl.accessToken}`);
          const geoData = await geoRes.json();
          if (geoData.features) {
            const externalMatches = geoData.features.slice(0, 3);
            html += externalMatches.map(f => `
              <div class="search-result-item" data-type="address" data-lng="${f.center[0]}" data-lat="${f.center[1]}" data-name="${f.text}">
                <div>
                  <div class="search-result-title">🏨 ${f.text}</div>
                  <div class="search-result-meta">${f.place_name}</div>
                </div>
                <span class="search-badge address">Hotel / Place</span>
              </div>
            `).join('');
          }
        } catch (e) {
          console.error("Geocoding fetch error:", e);
        }
      }

      dropdown.innerHTML = html;
      dropdown.style.display = 'block';

      // Attach click listeners to search results
      dropdown.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const type = item.dataset.type;

          if (type === 'curated') {
            if (callbacks && callbacks.onSelectSpot) {
              callbacks.onSelectSpot(item.dataset.id);
            }
          } else {
            const hotelObj = {
              id: 'hotel-' + Date.now(),
              name: item.dataset.name,
              lng: parseFloat(item.dataset.lng),
              lat: parseFloat(item.dataset.lat),
              address: 'Custom Base'
            };
            if (callbacks && callbacks.onSelectHotel) {
              callbacks.onSelectHotel(hotelObj);
            }
          }

          dropdown.style.display = 'none';
          input.value = '';
          input.placeholder = "🔍 Search 102 spots, hotels, locations...";
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) dropdown.style.display = 'none';
    });
  }
};
