/* ==============================================================================
 * FILE: ui-view-passport.js
 * CATEGORY: MarlonWalksLA Website - Passport, Profile & Contact Info Engine
 * ============================================================================== */

window.MarlonPassportView = {
  activeTab: 'you',
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

    // 1. SUB-TAB: YOU
    if (this.activeTab === 'you') {
      const profileContent = `
        <div style="padding: 10px; display:flex; flex-direction:column; gap:10px;">
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
          </div>
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
    } 
    // 2. SUB-TAB: VISITED LOCATIONS
    else if (this.activeTab === 'visited') {
      let visitedItemsHTML = '';
      if (visitedIds.length === 0) {
        visitedItemsHTML = `
          <div style="text-align: center; padding: 24px 8px; color: #64748b; font-size: 12px; line-height: 1.5;">
            <div style="font-size: 24px; margin-bottom: 6px;">📍</div>
            <strong>No visited locations yet!</strong><br>
            Search below to mark places as visited.
          </div>
        `;
      } else {
        visitedItemsHTML = visitedIds.map(sId => {
          let m = allMarkers.find(item => item.id === sId) || extSpotsMap[sId];
          return (m && window.MarlonComponents) ? window.MarlonComponents.renderSpotItemHTML(m) : '';
        }).join('');
      }

      // ADD SEARCH WRAPPER
      const searchWrapper = document.createElement('div');
      searchWrapper.className = 'manual-search-wrap';
      searchWrapper.innerHTML = `
        <input type="text" class="manual-spot-search" placeholder="Search to mark as visited..." style="width:100%;">
        <div class="search-results-dropdown" style="display:none;"></div>
      `;

      if (window.MarlonComponents) {
        const shellCard = window.MarlonComponents.createShellCard({
          title: `✅ Visited Passport (${visitedIds.length})`,
          headerActionsHTML: visitedIds.length > 0 ? `
            <button type="button" class="icon-btn share-visited-btn" title="Share visited places">📤</button>
          ` : '',
          itemsHTML: visitedItemsHTML,
          searchWrapper: searchWrapper
        });
        contentArea.appendChild(shellCard);
      }

      // SEARCH LISTENER
      const input = searchWrapper.querySelector('.manual-spot-search');
      const dropdown = searchWrapper.querySelector('.search-results-dropdown');
      if (input && dropdown) {
        input.addEventListener('input', () => {
          const query = input.value;
          const matches = window.MarlonComponents.getSearchMatches(query, allMarkers, 4);

          if (matches.length === 0 && query.trim().length < 2) { dropdown.style.display = 'none'; return; }

          let dropdownHtml = matches.map(m => `
            <div class="search-result-item" data-id="${m.id}">
              <span>📍 ${m.title}</span>
              <span style="color:#10b981; font-weight:800;">+ Visit</span>
            </div>
          `).join('');

          dropdown.innerHTML = dropdownHtml;
          dropdown.style.display = 'block';

          dropdown.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', (ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              if (window.MarlonStorage) window.MarlonStorage.toggleVisitedSpot(item.dataset.id);
              this.render(container, allMarkers, callbacks);
            });
          });
        });
      }
    } 
    // 3. SUB-TAB: HOTEL
    else if (this.activeTab === 'hotel') {
      const savedHotel = localStorage.getItem('marlon_hotel_address') || '';
      const hotelContent = `
        <div style="padding: 12px; display:flex; flex-direction:column; gap:10px;">
          <div style="font-size:12px; color:#334155; font-weight:700;">📍 Set Your Hotel or Stay Location:</div>
          <div style="display:flex; gap:6px;">
            <input type="text" class="hotel-address-input" value="${savedHotel}" placeholder="e.g. Millennium Biltmore" style="flex:1; padding:8px 10px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;">
            <button type="button" class="import-preset-btn save-hotel-btn" style="padding:6px 12px; font-size:11px;">Save</button>
          </div>
        </div>
      `;
      if (window.MarlonComponents) {
        const shellCard = window.MarlonComponents.createShellCard({ title: '🏨 Hotel Basecamp', itemsHTML: hotelContent });
        contentArea.appendChild(shellCard);
      }
    } 
    // 4. SUB-TAB: TRANSIT
    else if (this.activeTab === 'transit') {
      const transitContent = `
        <div style="padding: 12px; display:flex; flex-direction:column; gap:10px;">
          <div style="background:#eff6ff; border:1px solid #bfdbfe; padding:10px; border-radius:8px;">
            <div style="font-weight:800; font-size:12px; color:#1e40af; margin-bottom:4px;">🚆 Public Transit (TAP Card)</div>
            <div style="font-size:11px; color:#1e3a8a; line-height:1.4;">LA Metro Rail connects DTLA directly to Hollywood and Santa Monica.</div>
          </div>
        </div>
      `;
      if (window.MarlonComponents) {
        const shellCard = window.MarlonComponents.createShellCard({ title: '🚗 LA Transportation Guide', itemsHTML: transitContent });
        contentArea.appendChild(shellCard);
      }
    }

    masterWrap.appendChild(contentArea);
    container.appendChild(masterWrap);

    // MAP PIN VISIBILITY SYNC
    const map = window.marlonMapInstance;
    if (map && allMarkers && allMarkers.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      let visibleCount = 0;

      allMarkers.forEach(m => {
        let isVisible = true; 
        if (this.activeTab === 'visited') {
          isVisible = visitedIds.includes(m.id);
        }

        if (isVisible) {
          m.marker.addTo(map);
          bounds.extend([m.lng, m.lat]);
          visibleCount++;
        } else {
          m.marker.remove();
        }
      });

      if (this.activeTab === 'visited') {
        if (visibleCount >= 1) map.fitBounds(bounds, { padding: 50, maxZoom: 13.5 });
        else map.flyTo({ center: [-118.2437, 34.0522], zoom: 10.2 });
      } else {
        if (visibleCount >= 1) map.fitBounds(bounds, { padding: 50, maxZoom: 11.5 });
      }
    }

    // EVENT LISTENERS
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
    }

    if (this.activeTab === 'visited') {
      container.querySelectorAll('.pin-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          if (window.MarlonStorage) window.MarlonStorage.toggleSavedSpot(btn.dataset.id, 'All');
          this.render(container, allMarkers, callbacks);
        });
      });
      container.querySelectorAll('.visited-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
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
