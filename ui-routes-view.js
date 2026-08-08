/* ==============================================================================
 * FILE: ui-routes-view.js
 * CATEGORY: MarlonWalksLA Website - Featured Routes & Tour Experiences
 * ============================================================================== */

window.MarlonRoutesView = {
  activeTab: 'freetour', // 'freetour', 'selfguided', 'private', 'explore'

  render: function(container, presets, callbacks) {
    if (!container) return;
    container.innerHTML = '';

    const masterWrap = document.createElement('div');
    masterWrap.className = 'routes-view-wrapper';
    masterWrap.style.display = 'flex';
    masterWrap.style.flexDirection = 'column';
    masterWrap.style.height = '100%';

    // Route Sub-Tab Nav
    const tabNav = document.createElement('div');
    tabNav.className = 'day-filter-bar';
    tabNav.style.marginBottom = '8px';
    tabNav.style.marginTop = '4px';

    const tabs = [
      { id: 'freetour', label: '🎟️ Free Tour' },
      { id: 'selfguided', label: '🎧 Self-Guided' },
      { id: 'private', label: '🥾 Private Tour' },
      { id: 'explore', label: '🚲 Explore LA' }
    ];

    tabNav.innerHTML = tabs.map(t => `
      <button type="button" class="day-pill ${this.activeTab === t.id ? 'is-active' : ''}" data-tab="${t.id}">
        ${t.label}
      </button>
    `).join('');

    masterWrap.appendChild(tabNav);

    const contentArea = document.createElement('div');
    contentArea.style.flex = '1';
    contentArea.style.display = 'flex';
    contentArea.style.flexDirection = 'column';
    contentArea.style.overflow = 'hidden';

    let cardTitle = '';
    let cardContent = '';

    if (this.activeTab === 'freetour') {
      cardTitle = '🏛️ DTLA Free Walking Tour';
      cardContent = `
        <div style="padding: 12px; display:flex; flex-direction:column; gap:10px;">
          <div style="font-size:12px; color:#334155; line-height:1.5;">
            Join Marlon's flagship 2-hour walking tour through historic DTLA architecture, markets, hidden tunnels, and rich culture.
          </div>
          <div style="background:#eff6ff; border:1px solid #bfdbfe; padding:10px; border-radius:8px;">
            <div style="font-weight:800; font-size:12px; color:#1e40af;">📍 Highlights</div>
            <div style="font-size:11px; color:#1e3a8a; margin-top:2px;">Bradbury Building • Grand Central Market • Angels Flight • Last Bookstore</div>
          </div>
          <a href="https://freetour.com" target="_blank" class="import-preset-btn" style="text-align:center; text-decoration:none; padding:10px; font-weight:800;">
            🎟️ Book Free Walk
          </a>
        </div>
      `;
    } else if (this.activeTab === 'selfguided') {
      cardTitle = '🎧 Hollywood Stars & Glamour Tour';
      cardContent = `
        <div style="padding: 12px; display:flex; flex-direction:column; gap:10px;">
          <div style="font-size:12px; color:#334155; line-height:1.5;">
            Self-guided audio walkthrough of Hollywood's iconic landmarks at your own pace.
          </div>
          <div style="background:#fefce8; border:1px solid #fef08a; padding:10px; border-radius:8px;">
            <div style="font-weight:800; font-size:12px; color:#854d0e;">📍 Highlights</div>
            <div style="font-size:11px; color:#713f12; margin-top:2px;">TCL Chinese Theatre • Walk of Fame • Dolby Theatre • El Capitan</div>
          </div>
          <button type="button" class="import-preset-btn add-preset-btn" data-preset="hollywood" style="padding:10px; font-weight:800;">
            ➕ Add Hollywood Route to Trip
          </button>
        </div>
      `;
    } else if (this.activeTab === 'private') {
      cardTitle = '🥾 Hike to Griffith Observatory';
      cardContent = `
        <div style="padding: 12px; display:flex; flex-direction:column; gap:10px;">
          <div style="font-size:12px; color:#334155; line-height:1.5;">
            Guided private scenic hike leading directly up to the Griffith Observatory with panoramic sunset views over the Hollywood Sign and LA basin.
          </div>
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:10px; border-radius:8px;">
            <div style="font-weight:800; font-size:12px; color:#166534;">📍 Highlights</div>
            <div style="font-size:11px; color:#14532d; margin-top:2px;">Ferndell Trail • Observatory Viewpoint • Greek Theatre</div>
          </div>
          <button type="button" class="import-preset-btn" style="padding:10px; font-weight:800;">
            ✉️ Request Private Hike
          </button>
        </div>
      `;
    } else if (this.activeTab === 'explore') {
      cardTitle = '🚲 Santa Monica & Venice Coastal Bike Trail';
      cardContent = `
        <div style="padding: 12px; display:flex; flex-direction:column; gap:10px;">
          <div style="font-size:12px; color:#334155; line-height:1.5;">
            Cruise the famous Marvin Braude bike path along the Pacific Coast from Santa Monica Pier to the Venice Canals.
          </div>
          <div style="background:#faf5ff; border:1px solid #e9d5ff; padding:10px; border-radius:8px;">
            <div style="font-weight:800; font-size:12px; color:#6b21a8;">📍 Highlights</div>
            <div style="font-size:11px; color:#581c87; margin-top:2px;">Santa Monica Pier • Muscle Beach • Venice Skatepark • Venice Canals</div>
          </div>
          <button type="button" class="import-preset-btn add-preset-btn" data-preset="coastal" style="padding:10px; font-weight:800;">
            ➕ Add Coastal Bike Route to Trip
          </button>
        </div>
      `;
    }

    const shellCard = window.MarlonComponents.createShellCard({
      title: cardTitle,
      itemsHTML: cardContent
    });

    contentArea.appendChild(shellCard);
    masterWrap.appendChild(contentArea);
    container.appendChild(masterWrap);

    // Event Listeners
    tabNav.querySelectorAll('.day-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.activeTab = btn.dataset.tab;
        this.render(container, presets, callbacks);
      });
    });

    container.querySelectorAll('.add-preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const presetKey = btn.dataset.preset;
        if (callbacks.onImportPreset) callbacks.onImportPreset(presetKey);
      });
    });
  }
};
