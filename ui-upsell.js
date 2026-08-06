/* ==============================================================================
 * FILE: ui-upsell.js
 * CATEGORY: MarlonWalksLA Website - Recommended Tour Card (Anchored at Bottom)
 * ============================================================================== */

window.MarlonUpsell = {
  renderCard: function(container, allMarkers) {
    if (!container) return;

    const savedSpotIds = window.MarlonStorage.getSavedSpotIds();
    const savedSpots = allMarkers.filter(m => savedSpotIds.includes(m.id));

    let dtlaCount = 0;
    let hollywoodCount = 0;

    savedSpots.forEach(s => {
      if (s.neighborhood && s.neighborhood.toLowerCase().includes('dtla')) dtlaCount++;
      if (s.neighborhood && s.neighborhood.toLowerCase().includes('hollywood')) hollywoodCount++;
    });

    let existingUpsell = container.querySelector('.proximity-upsell-card');
    if (existingUpsell) existingUpsell.remove();

    let tourTitle = "🚶 DTLA Free Walking Tour";
    let tourDesc = dtlaCount >= 1 
      ? `You have ${dtlaCount} DTLA spot(s) saved! Join Marlon's 2-hr historic walking tour.`
      : "Marlon's flagship 2-hour walking tour through historic DTLA architecture, markets, and culture.";
    let tourUrl = "https://www.freetour.com/los-angeles/free-tour-of-downtown-los-angeles";
    let btnText = "🎟️ Book Free Walk";

    if (hollywoodCount > dtlaCount) {
      tourTitle = "🎬 Hollywood Movie Magic Guide";
      tourDesc = "Near your Hollywood pins! Unlock self-guided audio stories and cinema history.";
      btnText = "🔓 Unlock Audio Guide";
    }

    const card = document.createElement('div');
    card.className = 'proximity-upsell-card';
    card.innerHTML = `
      <div class="proximity-upsell-header">
        <span class="proximity-badge">RECOMMENDED TOUR</span>
      </div>
      <div class="proximity-title">${tourTitle}</div>
      <div class="proximity-desc">${tourDesc}</div>
      <button type="button" class="proximity-cta-btn">${btnText}</button>
    `;

    const ctaBtn = card.querySelector('.proximity-cta-btn');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(tourUrl, '_blank');
      });
    }

    // APPEND TO THE BOTTOM OF YOUR TRIP TAB
    container.appendChild(card);
  }
};
