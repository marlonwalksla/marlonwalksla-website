/* ==============================================================================
 * FILE: ui-spot-card.js
 * CATEGORY: MarlonWalksLA Website - Polaroid Spot Story Card Renderer
 * ============================================================================== */

window.MarlonSpotCard = {
  getCategoryDetails: function(rawCat, overrideColor, categoryMap, defaultPinSvg) {
    if (!rawCat) return { color: overrideColor || '#3898ec', icon: defaultPinSvg, name: 'Spot' };
    const key = String(rawCat).toLowerCase().replace(/&amp;/g, 'and').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    let details = categoryMap[key];
    if (!details) {
      const matchedKey = Object.keys(categoryMap).find(k => key.includes(k) || k.includes(key));
      details = matchedKey ? categoryMap[matchedKey] : { color: overrideColor || '#3898ec', icon: defaultPinSvg, name: rawCat };
    }
    if (overrideColor && overrideColor.trim() !== '' && overrideColor !== '#222222' && !categoryMap[key]) {
      details = { ...details, color: overrideColor };
    }
    return details;
  },

  formatTagDisplay: function(tagStr) {
    if (!tagStr) return '';
    return String(tagStr)
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  },

  render: function(spot, container, callbacks, categoryMap, defaultPinSvg) {
    if (!container) return;

    const isSaved = window.MarlonStorage.getSavedSpotIds().includes(spot.id);
    const isVisited = window.MarlonStorage.getVisitedSpots().includes(spot.id);

    const catDetails = this.getCategoryDetails(spot.category, spot.customColor, categoryMap, defaultPinSvg);
    const tagsFormatted = spot.tags.length ? `<div class="polaroid-tags">${spot.tags.map(t => `#${this.formatTagDisplay(t)}`).join('  ')}</div>` : '';
    const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;

    const imageHTML = spot.spotImage ? `<div class="polaroid-spot-img-wrap"><img src="${spot.spotImage}" alt="${spot.title}" class="polaroid-spot-img" /></div>` : '';
    const noteHTML = spot.marlonNote ? `<blockquote class="polaroid-marlon-note"><strong>💡 Marlon's Tip:</strong> "${spot.marlonNote}"</blockquote>` : '';
    
    let socialLinksHTML = '';
    if (spot.instagramUrl || spot.tiktokUrl) {
      socialLinksHTML = `<div class="polaroid-social-row">`;
      if (spot.instagramUrl) socialLinksHTML += `<a href="${spot.instagramUrl}" target="_blank" class="social-btn instagram">📸 Watch Reel</a>`;
      if (spot.tiktokUrl) socialLinksHTML += `<a href="${spot.tiktokUrl}" target="_blank" class="social-btn tiktok">🎵 Watch TikTok</a>`;
      socialLinksHTML += `</div>`;
    }

    const htmlContent = `
      <div class="polaroid-caption-card">
        <div class="polaroid-caption-header">
          <button type="button" class="back-to-filters-btn">‹ Back</button>
          <span class="polaroid-cat-badge" style="background-color:${catDetails.color};">${catDetails.name}</span>
        </div>
        ${imageHTML}
        <div class="polaroid-caption-body">
          <h3 class="polaroid-caption-title">${spot.title}</h3>
          <div class="polaroid-caption-meta">📍 ${spot.neighborhood}</div>
          ${spot.desc ? `<p class="polaroid-caption-desc">${spot.desc}</p>` : ''}
          ${noteHTML}
          ${socialLinksHTML}
          ${tagsFormatted}
        </div>

        <div class="polaroid-caption-user-actions">
          <button type="button" class="toggle-save-btn ${isSaved ? 'is-active' : ''}">
            ${isSaved ? '📌' : '📌 Add to Trip'}
          </button>
          <button type="button" class="toggle-visited-btn ${isVisited ? 'is-active' : ''}">
            ${isVisited ? '✅' : '✅ Add to Visited'}
          </button>
        </div>

        <div class="polaroid-caption-footer">
          <a href="${directionsLink}" target="_blank" class="polaroid-directions-btn primary-cta">🚗 Get Directions</a>
          <a href="https://marlonwalksla.com" target="_blank" class="polaroid-directions-btn secondary-cta">🎟️ Book Walking Tour</a>
        </div>
      </div>
    `;

    container.innerHTML = htmlContent;

    const backBtn = container.querySelector('.back-to-filters-btn');
    if (backBtn && callbacks.onBack) backBtn.addEventListener('click', callbacks.onBack);

    const saveBtn = container.querySelector('.toggle-save-btn');
    if (saveBtn && callbacks.onToggleSave) {
      saveBtn.addEventListener('click', () => {
        callbacks.onToggleSave(spot.id);
        const freshSaved = window.MarlonStorage.getSavedSpotIds().includes(spot.id);
        saveBtn.classList.toggle('is-active', freshSaved);
        saveBtn.innerHTML = freshSaved ? '📌 Saved to Itinerary' : '📌 Save to Itinerary';
      });
    }

    const visitedBtn = container.querySelector('.toggle-visited-btn');
    if (visitedBtn && callbacks.onToggleVisited) {
      visitedBtn.addEventListener('click', () => {
        callbacks.onToggleVisited(spot.id);
        const freshVisited = window.MarlonStorage.getVisitedSpots().includes(spot.id);
        visitedBtn.classList.toggle('is-active', freshVisited);
        visitedBtn.innerHTML = freshVisited ? '✅ Visited!' : '✅ Mark as Visited';
      });
    }
  }
};
