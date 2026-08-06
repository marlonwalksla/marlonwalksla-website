/* ==============================================================================
 * FILE: ui-featured-view.js
 * CATEGORY: MarlonWalksLA Website - Featured Routes Sidebar Feed
 * ============================================================================== */

window.MarlonFeaturedView = {
  activeSelectedRouteId: null,

  render: function(container, allMarkers, callbacks) {
    if (!container) return;
    const presets = window.MARLON_ROUTES_PRESETS || [];
    const savedRoutesMap = window.MarlonStorage.getSavedRoutesMap();

    const existingList = container.querySelector('.featured-preset-list');
    const savedScrollPos = existingList ? existingList.scrollTop : 0;

    container.innerHTML = `
      <div class="featured-feed-header">
        <span class="featured-feed-title">🎯 EXPLORE WITH MARLON & ERNESTO</span>
        <span class="featured-feed-subtitle">Click a card to frame map pins, or add to your trip:</span>
      </div>

      <div class="featured-preset-list">
        ${presets.map(p => {
          const isImported = !!savedRoutesMap[p.id];
          const isSelected = this.activeSelectedRouteId === p.id;
          return `
            <div class="featured-preset-card ${isImported ? 'is-imported' : ''} ${isSelected ? 'is-selected' : ''}" data-preset="${p.id}">
              <div class="featured-card-main-row">
                <div class="featured-preset-info">
                  <div class="featured-preset-title">${p.title}</div>
                  <div class="featured-preset-meta">${p.duration}</div>
                  <div class="featured-preset-desc">${p.description || ''}</div>
                </div>
                <button type="button" class="featured-import-btn ${isImported ? 'is-active' : ''}" data-preset="${p.id}">
                  ${isImported ? '📌 Added' : '📌 Add'}
                </button>
              </div>

              <details class="featured-preview-details">
                <summary class="featured-preview-summary">▼ View Included Spots (${p.spotTitles.length})</summary>
                <div class="featured-preview-list">
                  ${p.spotTitles.map(t => `<div class="featured-preview-item">📍 ${t}</div>`).join('')}
                </div>
              </details>
            </div>
          `;
        }).join('')}
      </div>
    `;

    const newList = container.querySelector('.featured-preset-list');
    if (newList) newList.scrollTop = savedScrollPos;

    container.querySelectorAll('.featured-import-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pId = btn.dataset.preset;
        window.MarlonStorage.toggleRouteBlock(pId, 'Day 1');
        if (callbacks && callbacks.onImportRoute) callbacks.onImportRoute(pId);
        this.render(container, allMarkers, callbacks);
      });
    });

    container.querySelectorAll('.featured-preset-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.closest('.featured-import-btn') || e.target.closest('.featured-preview-details')) return;
        const pId = card.dataset.preset;

        if (this.activeSelectedRouteId === pId) {
          this.activeSelectedRouteId = null;
          if (callbacks && callbacks.onResetRoutePan) callbacks.onResetRoutePan();
        } else {
          this.activeSelectedRouteId = pId;
          if (callbacks && callbacks.onPanToRoute) callbacks.onPanToRoute(pId);
        }
        this.render(container, allMarkers, callbacks);
      });
    });
  }
};
