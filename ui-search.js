/* ==============================================================================
 * FILE: ui-search.js
 * CATEGORY: MarlonWalksLA Website - Master Search Bar (Matches Trip Search Logic)
 * ============================================================================== */

window.MarlonSearch = {
  init: function(wrapper, map, allMarkers, dtlaCenter, callbacks) {
    if (!wrapper) return;
    const input = wrapper.querySelector('.map-search-input');
    const dropdown = wrapper.querySelector('.search-results-dropdown');
    if (!input || !dropdown) return;

    input.addEventListener('input', (e) => {
      const query = input.value.trim().toLowerCase();
      if (query.length < 2) {
        dropdown.style.display = 'none';
        return;
      }

      const curatedMatches = allMarkers.filter(m => 
        m.title.toLowerCase().includes(query) || 
        (m.neighborhood && m.neighborhood.toLowerCase().includes(query))
      ).slice(0, 4);

      let dropdownHtml = curatedMatches.map(m => `
        <div class="search-result-item" data-type="curated" data-id="${m.id}">
          <div>
            <div class="search-result-title">📍 ${m.title}</div>
            <div class="search-result-meta">${m.neighborhood || ''}</div>
          </div>
          <span class="search-badge curated" style="background:#eff6ff; color:#1e40af; padding:4px 8px; border-radius:6px; font-size:9px; font-weight:800; border:1px solid #93c5fd;">+ ADD</span>
        </div>
      `).join('');

      dropdownHtml += `
        <div class="search-result-item" data-type="google" data-query="${input.value.trim()}">
          <div>
            <div class="search-result-title">🗺️ Search "${input.value.trim()}"</div>
            <div class="search-result-meta">Save custom Google Map link</div>
          </div>
          <span class="search-badge address" style="background:#fef3c7; color:#92400e; padding:4px 8px; border-radius:6px; font-size:9px; font-weight:800; border:1px solid #fcd34d;">EXTERNAL</span>
        </div>
      `;

      dropdown.innerHTML = dropdownHtml;
      dropdown.style.display = 'block';

      dropdown.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          
          if (item.dataset.type === 'curated') {
            if (callbacks.onSelectSpot) callbacks.onSelectSpot(item.dataset.id);
            input.value = '';
            dropdown.style.display = 'none';
          } else {
            const extId = 'ext-' + Date.now();
            const gmapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(item.dataset.query);
            const spotData = { id: extId, title: item.dataset.query, neighborhood: 'External Location', gmapsUrl: gmapsUrl, isExternal: true };
            if (window.MarlonStorage.addExternalSpot) window.MarlonStorage.addExternalSpot(spotData, 'All');
            if (callbacks.onSelectSpot) callbacks.onSelectSpot(extId);
            input.value = '';
            dropdown.style.display = 'none';
          }
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) dropdown.style.display = 'none';
    });
  }
};
