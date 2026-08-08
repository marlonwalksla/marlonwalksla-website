/* ==============================================================================
 * FILE: ui-view-passport.js
 * CATEGORY: MarlonWalksLA Website - Passport, Profile & Contact Info Engine
 * ============================================================================== */

window.MarlonPassportView = {
  activeTab: 'you', // 'you', 'visited', 'hotel', 'transit'
  selectedMascot: localStorage.getItem('marlon_mascot') || '🦙',
  userName: localStorage.getItem('marlon_user_name') || '',
  userEmail: localStorage.getItem('marlon_user_email') || '',
  userIg: localStorage.getItem('marlon_user_ig') || '',
  userWa: localStorage.getItem('marlon_user_wa') || '',

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

    // Sub-Tab Navigation Bar
    const tabNav = document.createElement('div');
    tabNav.className = 'day-filter-bar';
    tabNav.style.marginBottom = '8px';
    tabNav.style.marginTop = '4px';

    const tabs = [
      { id: 'you', label: '👤 You' },
      { id: 'visited', label: `✅ Visited (${visitedIds.length})` },
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

    // -------------------------------------------------------------------------
    // 1. SUB-TAB: YOU (PROFILE & CONTACT CARD)
    // -------------------------------------------------------------------------
    if (this.activeTab === 'you') {
      const profileContent = `
        <div style="padding: 10px; display:flex; flex-direction:column; gap:10px;">
          <!-- Mascot Picker -->
          <div>
            <label style="font-size:10px; font-weight:800; color:#64748b; display:block; margin-bottom:4px;">YOUR MASCOT</label>
            <div class="mascot-picker-wrap" style="display:flex; gap:6px; overflow-x:auto; padding-bottom: 2px;">
              ${this.mascots.map(m => `
                <button type="button" class="mascot-btn ${this.selectedMascot === m ? 'is-active' : ''}" data-mascot="${m}" style="font-size:18px; border:1.5px solid ${this.selectedMascot === m ? '#2563eb' : '#cbd5e1'}; background:${this.selectedMascot === m ? '#eff6ff' : '#fff'}; border-radius:50%; width:34px; height:34px; cursor:pointer; flex-shrink:0;">
                  ${m}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Profile Fields -->
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div>
              <label style="font-size:10px; font-weight:800; color:#64748b; display:block; margin-bottom:2px;">NAME</label>
              <input type="text" class="profile-input" data-key="marlon_user_name" value="${this.userName}" placeholder="Your Name or Nickname" style="width:100%; padding:8px 10px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px; font-weight:700; box-sizing:border-box;">
            </div>

            <div style="display:flex; gap:6px;">
              <div style="flex:1;">
                <label style="font-size:10px; font-weight:800; color:#64748b; display:block; margin-bottom:2px;">INSTAGRAM</label>
                <input type="text" class="profile-input" data-key="marlon_user_ig" value="${this.userIg}" placeholder="@username" style="width:100%; padding:8px 10px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px; box-sizing:border-box;">
              </div>
              <div style="flex:1;">
                <label style="font-size:10px; font-weight:800; color:#64748b; display:block; margin-bottom:2px;">WHATSAPP / PHONE</label>
                <input type="text" class="profile-input" data-key="marlon_user_wa" value="${this.userWa}" placeholder="+1 555-0199" style="width:100%; padding:8px 10px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px; box-sizing:border-box;">
              </div>
            </div>

            <div>
              <label style="font-size:10px; font-weight:800; color:#64748b; display:block; margin-bottom:2px;">EMAIL</label>
              <input type="email" class="profile-input" data-key="marlon_user_email" value="${this.userEmail}" placeholder="your.email@example.com" style="width:100%; padding:8px 10px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px; box-sizing:border-box;">
            </div>
          </div>

          <!-- Share Contact Card Button -->
          <button type="button" class="import-preset-btn share-contact-btn" style="padding:10px; font-size:12px; font-weight:800; margin-top:4px; text-align:center;">
            📲 Share Contact Card
          </button>
        </div>
      `;

      if (window.MarlonComponents) {
        const shellCard = window.MarlonComponents.createShellCard({
          title: '👤 Traveler Profile Card',
          itemsHTML: profileContent
        });
        contentArea.appendChild(shellCard);
      }

    // -------------------------------------------------------------------------
    // 2. SUB-TAB: VISITED LOCATIONS
    // -------------------------------------------------------------------------
    } else if (this.activeTab === 'visited') {
      let visitedItemsHTML = '';
      if (visitedIds.length === 0) {
        visitedItemsHTML = `
          <div style="text-align: center; padding: 24px 8px; color: #64748b; font-size: 12px; line-height: 1.5;">
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

      if (window.MarlonComponents) {
        const shellCard = window.MarlonComponents.createShellCard({
          title: `✅ Visited Passport (${visitedIds.length})`,
          headerActionsHTML: visitedIds.length > 0 ? `
            <button type="button" class="icon-btn share-visited-btn" title="Share visited places">📤</button>
          ` : '',
          itemsHTML: visitedItemsHTML
        });
        contentArea.appendChild(shellCard);
      }

    // -------------------------------------------------------------------------
    // 3. SUB-TAB: HOTEL
    // -------------------------------------------------------------------------
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

    // -------------------------------------------------------------------------
    // 4. SUB-TAB: TRANSIT
    // -------------------------------------------------------------------------
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

    // Sub-tab Navigation Listeners
    tabNav.querySelectorAll('.day-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.activeTab = btn.dataset.tab;
        this.render(container, allMarkers, callbacks);
      });
    });

    // Profile & Contact Card Listeners
    if (this.activeTab === 'you') {
      container.querySelectorAll('.mascot-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.selectedMascot = btn.dataset.mascot;
          localStorage.setItem('marlon_mascot', this.selectedMascot);
          this.render(container, allMarkers, callbacks);
        });
      });

      container.querySelectorAll('.profile-input').forEach(input => {
        input.addEventListener('input', (e) => {
          const key = input.dataset.key;
          const val = e.target.value.trim();
          localStorage.setItem(key, val);
          if (key === 'marlon_user_name') this.userName = val;
          if (key === 'marlon_user_email') this.userEmail = val;
          if (key === 'marlon_user_ig') this.userIg = val;
          if (key === 'marlon_user_wa') this.userWa = val;
        });
      });

      const shareContactBtn = container.querySelector('.share-contact-btn');
      if (shareContactBtn) {
        shareContactBtn.addEventListener('click', (e) => {
          e.preventDefault();
          let text = `👋 Hi! I'm ${this.userName || 'a fellow traveler'} ${this.selectedMascot}\n`;
          if (this.userIg) text += `📸 IG: ${this.userIg}\n`;
          if (this.userWa) text += `💬 WhatsApp: ${this.userWa}\n`;
          if (this.userEmail) text += `✉️ Email: ${this.userEmail}\n`;
          text += `\nShared via MarlonWalksLA Map 🗺️`;

          navigator.clipboard.writeText(text).then(() => {
            alert('📲 Contact Card copied to clipboard! Paste it in chat or notes.');
          }).catch(() => {
            alert(text);
          });
        });
      }
    }

    // Visited Tab Listeners
    if (this.activeTab === 'visited') {
      const shareVisitedBtn = container.querySelector('.share-visited-btn');
      if (shareVisitedBtn) {
        shareVisitedBtn.addEventListener('click', (e) => {
          e.preventDefault();
          let shareText = `🗺️ ${this.selectedMascot} ${this.userName || 'Explorer'}'s Visited LA Spots:\n\n`;
          visitedIds.forEach(id => {
            let m = allMarkers.find(item => item.id === id) || extSpotsMap[id];
            if (m) shareText += `✅ ${m.title}\n`;
          });
          navigator.clipboard.writeText(shareText).then(() => alert('Copied visited places to clipboard!'));
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

    // Hotel Save Listener
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
