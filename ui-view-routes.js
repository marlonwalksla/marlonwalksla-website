/* ==============================================================================
 * FILE: ui-view-routes.js
 * CATEGORY: MarlonWalksLA Website - Featured Routes & Tour Experiences
 * ============================================================================== */

window.MarlonRoutesView = {
  activeTab: 'freetour',

  render: function(container, presets, callbacks) {
    if (!container) return;
    container.innerHTML = '';

    const masterWrap = document.createElement('div');
    masterWrap.className = 'routes-view-wrapper';
    masterWrap.style.display = 'flex';
    masterWrap.style.flexDirection = 'column';
    masterWrap.style.height = '100%';

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
        <div class="route-view-content">
          <div class="route-view-desc">Join Marlon's flagship 2-hour walking tour through historic DTLA architecture, markets, hidden tunnels, and rich culture.</div>
          <div class="route-highlight-box theme-blue">
            <div class="route-highlight-title">📍 Highlights</div>
            <div class="route-highlight-list">Bradbury Building • Grand Central Market • Angels Flight • Last Bookstore</div>
          </div>
          <a href="https://freetour.com" target="_blank" class="import-preset-btn" style="text-align:center; text-decoration:none; padding:10px; font-weight:800;">🎟️ Book Free Walk</a>
        </div>
      `;
    } else if (this.activeTab === 'selfguided') {
      cardTitle = '🎧 Hollywood Stars & Glamour Tour';
      cardContent = `
        <div class="route-view-content">
          <div class="route-view-desc">Self-guided audio walkthrough of Hollywood's iconic landmarks at your own pace.</div>
          <div class="route-highlight-box theme-yellow">
            <div class="route-highlight-title">📍 Highlights</div>
            <div class="route-highlight-list">TCL Chinese Theatre • Walk of Fame • Dolby Theatre • El Capitan</div>
          </div>
          <button type="button" class="import-preset-btn add-preset-btn" data-preset="hollywood" style="padding:10px; font-weight:800;">➕ Add Hollywood Route to Trip</button>
        </div>
      `;
    } else if (this.activeTab === 'private') {
      cardTitle = '🥾 Hike to Griffith Observatory';
      cardContent = `
        <div class="route-view-content">
          <div class="route-view-desc">Guided private scenic hike leading directly up to the Griffith Observatory with panoramic sunset views over the Hollywood Sign and LA basin.</div>
          <div class="route-highlight-box theme-green">
            <div class="route-highlight-title">📍 Highlights</div>
            <div class="route-highlight-list">Ferndell Trail • Observatory Viewpoint • Greek Theatre</div>
          </div>
          <button type="button" class="import-preset-btn" style="padding:10px; font-weight:800;">✉️ Request Private Hike</button>
        </div>
      `;
    } else if (this.activeTab === 'explore') {
      cardTitle = '🚲 Santa Monica & Venice Coastal Bike Trail';
      cardContent = `
        <div class="route-view-content">
          <div class="route-view-desc">Cruise the famous Marvin Braude bike path along the Pacific Coast from Santa Monica Pier to the Venice Canals.</div>
          <div class="route-highlight-box theme-purple">
            <div class="route-highlight-title">📍 Highlights</div>
            <div class="route-highlight-list">Santa Monica Pier • Muscle Beach • Venice Skatepark • Venice Canals</div>
          </div>
          <button type="button" class="import-preset-btn add-preset-btn" data-preset="coastal" style="padding:10px; font-weight:800;">➕ Add Coastal Bike Route to Trip</button>
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

    // Event Delegation for Nav and Interactions
    masterWrap.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('.day-pill');
      if (tabBtn) {
        e.preventDefault();
        this.activeTab = tabBtn.dataset.tab;
        this.render(container, presets, callbacks);
        return;
      }

      const presetBtn = e.target.closest('.add-preset-btn');
      if (presetBtn) {
        e.preventDefault();
        if (callbacks.onImportPreset) callbacks.onImportPreset(presetBtn.dataset.preset);
      }
    });
  }
};
