/* ==============================================================================
 * FILE: ui-routes.js
 * CATEGORY: MarlonWalksLA Website - Dedicated Routes & Monetization Tab
 * ============================================================================== */

window.MarlonRoutesView = {
  render: function(container, callbacks) {
    if (!container) return;
    
    // We only need to render this once unless data changes
    if (container.dataset.isRendered === 'true') return;
    container.dataset.isRendered = 'true';

    let html = `<div class="routes-master-container" style="padding-top: 12px; display: flex; flex-direction: column; gap: 20px;">`;

    // ==========================================
    // 1. PREMIUM / AFFILIATE EXPERIENCES
    // ==========================================
    html += `
      <div>
        <div class="dashboard-label" style="font-size: 14px; margin-bottom: 8px;">🌟 Recommended Experiences</div>
        
        <!-- Hollywood Experience -->
        <div class="route-slide-card" style="margin-bottom: 12px; border: 1.5px solid #cbd5e0; background: #fafaf9;">
          <div style="font-size: 14px; font-weight: 800; color: #0f172a;">🎬 Hollywood History Tour</div>
          <div style="font-size: 11px; font-weight: 700; color: #ec4899; margin-bottom: 6px;">Self-Guided Audio • By MarlonWalksLA</div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 12px; line-height: 1.4;">Explore the golden age of cinema at your own pace. Unlock my exclusive audio guide and hidden map locations.</div>
          <div style="display: flex; gap: 8px;">
             <button type="button" class="buy-affiliate-btn" onclick="window.open('https://your-audio-tour-link.com', '_blank')" style="flex:1; background:#ec4899; color:#fff; border:none; padding:10px; border-radius:6px; font-size:12px; font-weight:800; cursor:pointer;">Unlock for $9.99</button>
          </div>
        </div>

        <!-- Santa Monica / Venice Bike Affiliate -->
        <div class="route-slide-card" style="margin-bottom: 12px; border: 1.5px solid #cbd5e0; background: #fafaf9;">
          <div style="font-size: 14px; font-weight: 800; color: #0f172a;">🚲 Santa Monica & Venice by Bike</div>
          <div style="font-size: 11px; font-weight: 700; color: #f59e0b; margin-bottom: 6px;">Half-Day Activity • Affiliate Partner</div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 12px; line-height: 1.4;">The absolute best way to see the coastline. Rent a bike right on the pier and cruise the iconic strand down to Muscle Beach.</div>
          <div style="display: flex; gap: 8px;">
             <button type="button" class="buy-affiliate-btn" onclick="window.open('https://your-bike-rental-affiliate-link.com', '_blank')" style="flex:1; background:#f59e0b; color:#fff; border:none; padding:10px; border-radius:6px; font-size:12px; font-weight:800; cursor:pointer;">Rent a Bike</button>
             <button type="button" class="view-route-btn add-free-points-btn" data-preset="venice-bike" style="flex:1; background:#f8fafc; color:#475569; border:1px solid #cbd5e0; padding:10px; border-radius:6px; font-size:12px; font-weight:800; cursor:pointer;">+ Add Free Spots</button>
          </div>
        </div>
        
        <!-- Griffith Hike Affiliate -->
        <div class="route-slide-card" style="border: 1.5px solid #cbd5e0; background: #fafaf9;">
          <div style="font-size: 14px; font-weight: 800; color: #0f172a;">🥾 Hike to the Observatory</div>
          <div style="font-size: 11px; font-weight: 700; color: #10b981; margin-bottom: 6px;">Scenic Trail • Local Favorite</div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 12px; line-height: 1.4;">Skip the parking nightmare. Add the trailhead to your map, or book a guided sunset hike for the best photos of the Hollywood sign.</div>
          <div style="display: flex; gap: 8px;">
             <button type="button" class="buy-affiliate-btn" onclick="window.open('https://your-guided-hike-link.com', '_blank')" style="flex:1; background:#10b981; color:#fff; border:none; padding:10px; border-radius:6px; font-size:12px; font-weight:800; cursor:pointer;">Book Guided Hike</button>
          </div>
        </div>
      </div>
    `;

    // ==========================================
    // 2. FREE PRE-BUILT ROUTES (Moved from Search)
    // ==========================================
    const allPresets = window.MARLON_ROUTES_PRESETS || [];
    if (allPresets.length > 0) {
      html += `
        <div>
          <div class="dashboard-label" style="font-size: 14px; margin-bottom: 8px;">🗺️ Free Pre-Built Itineraries</div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${allPresets.map(preset => `
              <div class="route-slide-card" style="border: 1px solid #e2e8f0;">
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">${preset.title}</div>
                <div style="font-size: 10px; font-weight: 700; color: #2563eb;">${preset.duration} • ${preset.spotTitles.length} stops</div>
                <div style="font-size: 12px; color: #475569; margin: 4px 0 10px 0; line-height: 1.4;">${preset.desc}</div>
                <div style="display: flex; gap: 6px;">
                   <button type="button" class="import-route-btn" data-id="${preset.id}" style="flex:1; background:#2563eb; color:#fff; border:none; padding:8px; border-radius:6px; font-size:11px; font-weight:800; cursor:pointer;">+ Add to Trip</button>
                   <button type="button" class="view-route-btn view-preset-btn" data-id="${preset.id}" style="flex:1; background:#f8fafc; color:#475569; border:1px solid #cbd5e0; padding:8px; border-radius:6px; font-size:11px; font-weight:800; cursor:pointer;">📍 View Map</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    html += `</div>`;
    container.innerHTML = html;

    // Attach functionality to the dynamically created buttons
    container.querySelectorAll('.import-route-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        window.MarlonStorage.toggleRouteBlock(btn.dataset.id, 'Day 1');
        alert('Route added to Day 1!');
        if (callbacks && callbacks.onImportRoute) callbacks.onImportRoute();
      });
    });

    container.querySelectorAll('.view-preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        if (callbacks && callbacks.onPanToRoute) callbacks.onPanToRoute(btn.dataset.id);
      });
    });
  }
};
