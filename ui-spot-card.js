/* ==============================================================================
 * FILE: ui-spot-card.js
 * CATEGORY: MarlonWalksLA Website - Spot Card Popup Renderer
 * ============================================================================== */

window.MarlonSpotCard = {
  /* =========================================================
   * 1. CATEGORY DETAILS HELPER
   * ========================================================= */
  getCategoryDetails: function(catName, customColor, categoryMap, defaultPinSvg) {
    const cleanCat = (catName || '').toLowerCase().trim();
    if (categoryMap && categoryMap[cleanCat]) {
      return categoryMap[cleanCat];
    }
    return {
      color: customColor || '#ef4444',
      icon: defaultPinSvg,
      name: catName || 'Landmark'
    };
  },

  /* =========================================================
   * 2. MAIN CARD POPUP RENDERER
   * ========================================================= */
  render: function(spotData, container, callbacks, categoryMap, defaultPinSvg) {
    if (!container || !spotData) return;

    const savedSpotIds = window.MarlonStorage ? window.MarlonStorage.getSavedSpotIds() : [];
    const visitedIds = window.MarlonStorage ? window.MarlonStorage.getVisitedSpots() : [];

    const isSaved = savedSpotIds.includes(spotData.id);
    const isVisited = visitedIds.includes(spotData.id);

    const catDetails = this.getCategoryDetails(spotData.category, spotData.customColor, categoryMap, defaultPinSvg);
    const directionsUrl = spotData.isExternal && spotData.gmapsUrl 
      ? spotData.gmapsUrl 
      : `https://www.google.com/maps/dir/?api=1&destination=${spotData.lat},${spotData.lng}`;

    // Mailto draft pre-filling Marlon's email with the location name
    const bookTourSubject = encodeURIComponent(`Walking Tour Inquiry - ${spotData.title}`);
    const bookTourBody = encodeURIComponent(`Hi Marlon,\n\nI'm interested in booking a tour that includes ${spotData.title}!\n\nPreferred Date:\nParty Size:\n\nThanks!`);
    const bookTourMailto = `mailto:marlonwalksla@gmail.com?subject=${bookTourSubject}&body=${bookTourBody}`;

    container.innerHTML = `
      <div class="polaroid-caption-card" data-id="${spotData.id}">
        <div class="polaroid-caption-header">
          <button type="button" class="back-to-filters-btn">‹ Back</button>
          <span class="polaroid-cat-badge" style="background-color: ${catDetails.color};">${catDetails.name}</span>
        </div>

        ${spotData.imageUrl ? `
          <div class="polaroid-spot-img-wrap">
            <img src="${spotData.imageUrl}" alt="${spotData.title}" class="polaroid-spot-img" />
          </div>
        ` : ''}

        <div class="polaroid-caption-body">
          <h3 class="polaroid-caption-title">${spotData.title}</h3>
          <div class="polaroid-caption-meta">📍 ${spotData.neighborhood || 'Downtown LA'}</div>
          ${spotData.desc ? `<p class="polaroid-caption-desc">${spotData.desc}</p>` : ''}
          ${spotData.marlonNote ? `<div class="polaroid-marlon-note">💡 ${spotData.marlonNote}</div>` : ''}
        </div>

        <!-- SINGLE ROW PILL ACTION STRIP -->
        <div class="polaroid-card-action-strip">
          <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" class="card-pill-btn directions-pill">
            🚗 Maps
          </a>
          <button type="button" class="card-pill-btn toggle-save-btn ${isSaved ? 'is-active' : ''}" data-id="${spotData.id}">
            ${isSaved ? '📌 Pinned' : '📌 Pin'}
          </button>
          <button type="button" class="card-pill-btn toggle-visited-btn ${isVisited ? 'is-active' : ''}" data-id="${spotData.id}">
            ${isVisited ? '✓ Visited' : '✓ Visited'}
          </button>
        </div>

        <!-- PRIMARY CTA: BOOK TOUR -->
        <div class="polaroid-caption-footer">
          <a href="${bookTourMailto}" class="polaroid-directions-btn primary-cta book-tour-cta">
            🎟️ Book Tour
          </a>
        </div>
      </div>
    `;

    /* =========================================================
     * 3. EVENT LISTENERS
     * ========================================================= */
    const backBtn = container.querySelector('.back-to-filters-btn');
    if (backBtn && callbacks.onBack) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        callbacks.onBack();
      });
    }

    const saveBtn = container.querySelector('.toggle-save-btn');
    if (saveBtn && callbacks.onToggleSave) {
      saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        callbacks.onToggleSave(spotData.id);
        const nowSaved = window.MarlonStorage.getSavedSpotIds().includes(spotData.id);
        saveBtn.classList.toggle('is-active', nowSaved);
        saveBtn.innerText = nowSaved ? '📌 Pinned' : '📌 Pin';
      });
    }

    const visitedBtn = container.querySelector('.toggle-visited-btn');
    if (visitedBtn && callbacks.onToggleVisited) {
      visitedBtn.addEventListener('click', (e) => {
        e.preventDefault();
        callbacks.onToggleVisited(spotData.id);
        const nowVisited = window.MarlonStorage.getVisitedSpots().includes(spotData.id);
        visitedBtn.classList.toggle('is-active', nowVisited);
        visitedBtn.innerText = nowVisited ? '✓ Visited' : '✓ Visited';
      });
    }
  }
};
