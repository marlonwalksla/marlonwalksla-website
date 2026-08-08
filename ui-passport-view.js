/* ==============================================================================
 * FILE: ui-passport-view.js
 * CATEGORY: MarlonWalksLA Website - Passport View Module
 * ============================================================================== */

window.MarlonPassportView = {
  activeTab: 'you',
  selectedMascot: localStorage.getItem('marlon_mascot') || '🦙',
  userName: localStorage.getItem('marlon_user_name') || 'LA Explorer',

  mascots: ['🦙', '🦁', '🐻', '🦩', '🐯', '🦊', '🐼', '🐨'],

  render: function(container, allMarkers = [], callbacks = {}) {
    if (!container) return;
    container.innerHTML = '';

    const visitedIds = window.MarlonStorage ? window.MarlonStorage.getVisitedSpots() : [];
    const extSpotsMap = (window.MarlonStorage && window.MarlonStorage.getExternalSpots) ? window.MarlonStorage.getExternalSpots() : {};

    const masterWrap = document.createElement('div');
    masterWrap.className = 'passport-view-wrapper';
    masterWrap.style.display = 'flex';
    masterWrap.style.flexDirection = 'column';
    masterWrap.style.height = '100%';

    const tabNav = document.createElement('div');
    tabNav.className = 'day-filter-bar';
    tabNav.style.marginBottom = '8px';
    tabNav.style.marginTop = '4px';

    const tabs = [
      { id: 'you', label: `👤 You (${visitedIds.length})` },
      { id: 'hotel', label: '🏨 Hotel' },
      { id: 'transit', label: '🚗 Transit' }
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

    if (this.activeTab === 'you') {
      let visitedItemsHTML = '';
      if (visitedIds.length === 0) {
        visitedItemsHTML = `
          <div style="text-align: center; padding: 20px 8px; color: #64748b; font-size: 12px; line-height: 1.5;">
            <div style="font-size: 24px; margin-bottom: 6px;">📍</div>
            <strong>No visited locations yet!</strong><br>
            Mark places with a ✓ as you explore LA to build your Passport list.
          </div>
        `;
      } else {
        visitedItemsHTML = visitedIds.map(sId => {
          let m = allMarkers.find(item => item.id === sId) || extSpotsMap[sId];
          return (m && window.MarlonComponents) ? window.MarlonComponents.renderSpotItemHTML(m) : '';
        }).join('');
      }

      const profileHeaderHTML = `
        <div style="padding: 10px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 8px;">
          <div style="display:flex; align-items:center; gap: 10px; margin-bottom: 8px;">
            <div class="mascot-picker-wrap" style="display:flex; gap:4px; overflow-x:auto; flex:1; padding-bottom: 2px;">
              ${this.mascots.map(m => `
                <button type="button" class="mascot-btn ${this.selectedMascot === m ? 'is-active' : ''}" data-mascot="${m}" style="font-size:18px; border:1px solid ${this.selectedMascot === m ? '#2563eb' : '#cbd5e1'}; background:${this.selectedMascot === m ? '#eff6ff' : '#fff'}; border-radius:50%; width:32px; height:32px; cursor:pointer;">
                  ${m}
                </button>
              `).join('')}
            </div>
          </div>
          <div style="display:flex; gap: 6px;">
            <input type="text" class="user-name-input" value="${this.userName}" placeholder="Your Name" style="flex:1; padding:6px 10px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px; font-weight:700;">
            <button type="button" class="import-preset-btn share-profile-btn" style="font-size:11px; padding:6px 10px;">📤 Share</button>
          </div>
        </div>
      `;

      if (window.MarlonComponents) {
        const shellCard = window.MarlonComponents.createShellCard({
          title: `✅ Visited Locations (${visitedIds.length})`,
          itemsHTML: visitedItemsHTML
        });
        const shellBody = shellCard.querySelector('.route-block-body');
        if (shellBody) shellBody.insertAdjacentHTML('afterbegin', profileHeaderHTML);
        contentArea.appendChild(shellCard);
      }

    } else if (this.activeTab === 'hotel') {
      const savedHotel = localStorage.getItem('marlon_hotel_address') || '';

      const hotelContent = `
        <div style="padding: 12px; display:flex; flex-direction:column; gap:10px;">
          <div style="font-size:12px; color:#334155; font-weight:700;">
            📍 Set Your Hotel or Stay Location:
          </div>
          <div style="display:flex; gap:6px;">
            <input type="text" class="hotel-address-input" value="${savedHotel}" placeholder="e.g. Millennium Biltmore Hotel DTLA" style="flex:1; padding:8px 10px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;">
            <button type="button" class="import-preset-btn save-hotel-btn" style="padding:6px 12px; font-size:11px;">Save</button>
          </div>
          <div style="background:#f1f5f9; padding:12px; border-radius:8px; border:1px solid #e2e8f0; margin-top:6px;">
            <div style="font-weight:800; font-size:12px; color:#0f172a; margin-bottom:4px;">🏨 Spots Near Your Stay</div>
            <div style="font-size:11px; color:#64748b; line-height:1.4;">
              Setting your hotel pin centers your map around your stay and highlights walking distance dining, coffee, and nightlife spots.
            </div>
          </div>
        </div>
      `;

      if (window.MarlonComponents) {
        const shellCard = window.MarlonComponents.createShellCard({
          title: '🏨 Hotel Basecamp',
          itemsHTML: hotelContent
        });
        contentArea.appendChild(shellCard);
      }

    } else if (this.activeTab === 'transit') {
      const transitContent = `
        <div style="padding: 12px; display:flex; flex-direction:column; gap:10px;">
          <div style="background:#eff6ff; border:1px solid #bfdbfe; padding:10px; border-radius:8px;">
            <div style="font-weight:800; font-size:12px; color:#1e40af; margin-bottom:4px;">🚆 Public Transit (TAP Card)</div>
            <div style="font-size:11px; color:#1e3a8a; line-height:1.4;">
              LA Metro Rail connects DTLA directly to Hollywood, Santa Monica, and Pasadena. Tap cards work on all buses and trains.
            </div>
          </div>
          <div style="background:#fefce8; border:1px solid #fef08a; padding:10px; border-radius:8px;">
            <div style="font-weight:800; font-size:12px; color:#854d0e; margin-bottom:4px;">🚗 Rental Car & Parking Tips</div>
            <div style="font-size:11px; color:#713f12; line-height:1.4;">
              Best for Griffith Park, Beverly Hills, and Malibu. Use SpotHero or ParkWhiz for discounted garage parking in DTLA and Hollywood.
            </div>
          </div>
        </div>
      `;

      if (window.MarlonComponents) {
        const shellCard = window.MarlonComponents.createShellCard({
          title: '🚗 LA Transportation Guide',
          itemsHTML: transitContent
        });
        contentArea.appendChild(shellCard);
      }
    }

    masterWrap.appendChild(contentArea);
    container.appendChild(masterWrap);

    tabNav.querySelectorAll('.day-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.activeTab = btn.dataset.tab;
        this.render(container, allMarkers, callbacks);
      });
    });

    if (this.activeTab === 'you') {
      container.querySelectorAll('.mascot-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.selectedMascot = btn.dataset.mascot;
          localStorage.setItem('marlon_mascot', this.selectedMascot);
          this.render(container, allMarkers, callbacks);
        });
      });

      const nameInput = container.querySelector('.user-name-input');
      if (nameInput) {
        nameInput.addEventListener('change', (e) => {
          this.userName = e.target.value;
          localStorage.setItem('marlon_user_name', this.userName);
        });
      }

      const shareBtn = container.querySelector('.share-profile-btn');
      if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
          e.preventDefault();
          let shareText = `🗺️ ${this.selectedMascot} ${this.userName}'s LA Passport:\nVisited ${visitedIds.length} spots in Los Angeles!\n\n`;
          visitedIds.forEach(id => {
            let m = allMarkers.find(item => item.id === id) || extSpotsMap[id];
            if (m) shareText += `✅ ${m.title}\n`;
          });
          navigator.clipboard.writeText(shareText).then(() => alert('Copied Passport to clipboard!'));
        });
      }

      container.querySelectorAll('.pin-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.MarlonStorage) window.MarlonStorage.toggleSavedSpot(btn.dataset.id, 'All');
          this.render(container, allMarkers, callbacks);
        });
      });

      container.querySelectorAll('.visited-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (callbacks.onToggleVisited) callbacks.onToggleVisited(btn.dataset.id);
          this.render(container, allMarkers, callbacks);
        });
      });
    }

    if (this.activeTab === 'hotel') {
      const saveHotelBtn = container.querySelector('.save-hotel-btn');
      const hotelInput = container.querySelector('.hotel-address-input');
      if (saveHotelBtn && hotelInput) {
        saveHotelBtn.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.setItem('marlon_hotel_address', hotelInput.value);
          alert('Saved Hotel address!');
        });
      }
    }
  }
};
