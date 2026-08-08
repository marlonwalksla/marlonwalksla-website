/* ==============================================================================
 * FILE: ui-search.js
 * CATEGORY: MarlonWalksLA Website - Master Search Bar
 * ============================================================================== */

window.MarlonSearch = {
  init: function(wrapper, map, allMarkers, dtlaCenter, callbacks) {
    if (!wrapper) return;
    const input = wrapper.querySelector('.map-search-input');
    const dropdown = wrapper.querySelector('.search-results-dropdown');
    if (!input || !dropdown) return;

    input.addEventListener('input', (e) => {
      const query = input.value;
      const curatedMatches = window.MarlonComponents.getSearchMatches(query, allMarkers, 4);

      if (curatedMatches.length === 0 && query.trim().length < 2) {
        dropdown.style.display = 'none';
        return;
      }

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
        <div class="search-result-item" data-type="google" data-query="${query.trim()}">
          <div>
            <div class="search-result-title">🗺️ Search "${query.trim()}"</div>
            <div class="search-result-meta">Save custom Google Map link</div>
          </div>
          <span class="search-badge address" style="background:#fef3c7; color:#92400e; padding:4px 8px; border-radius:6px; font-size:9px; font-weight:800; border:1px solid #fcd34d;">EXTERNAL</span>
        </div>
      `;

      dropdown.innerHTML = dropdownHtml;
      dropdown.style.display = 'block';
    });

    // Event Delegation for dropdown clicks
    dropdown.addEventListener('click', (ev) => {
      const item = ev.target.closest('.search-result-item');
      if (!item) return;
      
      ev.preventDefault();
      ev.stopPropagation();
      
      if (item.dataset.type === 'curated') {
        if (callbacks.onSelectSpot) callbacks.onSelectSpot(item.dataset.id);
      } else {
        const extId = 'ext-' + Date.now();
        const gmapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(item.dataset.query);
        const spotData = { id: extId, title: item.dataset.query, neighborhood: 'External Location', gmapsUrl: gmapsUrl, isExternal: true };
        if (window.MarlonStorage.addExternalSpot) window.MarlonStorage.addExternalSpot(spotData, 'All');
        if (callbacks.onSelectSpot) callbacks.onSelectSpot(extId);
      }
      
      input.value = '';
      dropdown.style.display = 'none';
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) dropdown.style.display = 'none';
    });
  }
};
