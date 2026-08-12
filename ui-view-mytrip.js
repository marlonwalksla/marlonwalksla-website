/* ==============================================================================
 * FILE: ui-view-mytrip.js
 * CATEGORY: MarlonWalksLA Website - Modular My Trip View Controller
 * ============================================================================== */

/* ==============================================================================
 * SECTION 1: UTILITIES & DATA PARSING
 * ============================================================================== */
function parseSpotInfo(spot) {
  if (!spot) return { id: '', name: 'Location' };
  const p = spot.properties || spot;
  const rawId = spot.id || p.id || p.Slug || p.Item_ID || p.Name || p.name || '';
  const cleanId = String(rawId).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const cleanName = spot.title || p.Name || p.name || p.title || cleanId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Location';
  return { id: cleanId, name: cleanName, rawSpot: spot };
}


/* ==============================================================================
 * SECTION 2: PRIMARY VIEW INITIALIZER & SUB-TAB SWITCHER
 * ============================================================================== */
window.initMyTripView = function(allSpots) {
  initSubTabSwitcher(allSpots);
  setupPassportListeners();
  renderDaysView(allSpots);
  renderPassportView(allSpots);
  renderLogisticsView();
  
  const panelMyTrip = document.getElementById('panel-mytrip');
  if (panelMyTrip && panelMyTrip.style.display !== 'none') {
    focusMapOnPinnedSpots(allSpots);
  }

  if (window.updateNavTabCounts) window.updateNavTabCounts();
};

function initSubTabSwitcher(allSpots) {
  const tabs = document.querySelectorAll('[data-mytrip-tab]');
  const views = {
    days: document.getElementById('view-days'),
    passport: document.getElementById('view-passport'),
    logistics: document.getElementById('view-logistics')
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-mytrip-tab');
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      Object.keys(views).forEach(key => {
        if (views[key]) {
          views[key].style.display = key === target ? 'block' : 'none';
        }
      });

      if (target === 'days') {
        focusMapOnPinnedSpots(allSpots);
      }
    });
  });
}


/* ==============================================================================
 * SECTION 3: MAP FOCUS & PIN ISOLATION LOGIC
 * ============================================================================== */
function focusMapOnPinnedSpots(allSpots) {
  if (!window.MarlonStorage) return;
  const tripData = window.MarlonStorage.getSavedTripData() || { days: {} };
  const savedMap = tripData.days || {};
  const savedSpotIds = Object.keys(savedMap);

  const pinnedSpots = (allSpots || []).filter(spot => {
    const info = parseSpotInfo(spot);
    return savedSpotIds.includes(info.id);
  });

  if (window.updateMapMarkers) {
    window.updateMapMarkers(pinnedSpots);
  }
}


/* ==============================================================================
 * SECTION 4: DAYS SUB-VIEW RENDERER & ACTIONS (ITINERARY LIST)
 * ============================================================================== */
function renderDaysView(allSpots) {
  const container = document.getElementById('view-days');
  if (!container) return;

  // Preserve scroll position across re-renders
  const scrollContainer = container.querySelector('.trip-grouped-list');
  const savedScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

  if (window.updateNavTabCounts) window.updateNavTabCounts();

  const tripData = window.MarlonStorage ? window.MarlonStorage.getSavedTripData() : { pinned: [], days: {}, visited: [] };
  const savedMap = tripData.days || {};
  const savedSpotIds = Object.keys(savedMap);
  const visitedSet = new Set(tripData.visited || []);

  if (savedSpotIds.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 20px 12px; text-align: center; color: #64748b;">
        <p style="margin: 0 0 4px 0; font-weight: 700; font-size: 0.9rem;">📍 No saved spots yet!</p>
        <small style="font-size: 0.78rem;">Explore LA spots and click "Pin" on any card or map pin to build your itinerary.</small>
      </div>
    `;
    return;
  }

  const dayGroups = { 'Day 1': [], 'Day 2': [], 'Day 3': [], 'Day 4': [], 'Unassigned': [] };
  
  savedSpotIds.forEach(spotId => {
    const match = (allSpots || []).find(s => parseSpotInfo(s).id === spotId);
    const spotName = match ? parseSpotInfo(match).name : spotId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const assignedDay = savedMap[spotId] || 'Unassigned';
    
    if (!dayGroups[assignedDay]) dayGroups[assignedDay] = [];
    dayGroups[assignedDay].push({ id: spotId, name: spotName, isVisited: visitedSet.has(spotId) });
  });

  let htmlContent = `<div class="trip-grouped-list">`;

  Object.keys(dayGroups).forEach(dayName => {
    const spots = dayGroups[dayName];
    if (spots.length === 0) return;

    htmlContent += `
      <div class="day-group-header" style="font-size: 0.78rem; font-weight: 800; color: #2563eb; background: #eff6ff; padding: 4px 8px; border-radius: 6px; margin: 8px 0 4px 0;">
        📅 ${dayName} (${spots.length})
      </div>
      ${spots.map(s => `
        <div class="trip-spot-item" data-id="${s.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 4px;">
          <span class="spot-title" style="font-size: 0.8rem; font-weight: 700; color: #0f172a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; margin-right: 6px; cursor: pointer;">📍 ${s.name}</span>
          <div style="display: flex; align-items: center; gap: 4px;">
            <select class="day-assign-select" data-spot-id="${s.id}" style="font-size: 0.72rem; font-weight: 600; padding: 2px 4px; border-radius: 4px; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; outline: none;">
              <option value="Day 1" ${dayName === 'Day 1' ? 'selected' : ''}>Day 1</option>
              <option value="Day 2" ${dayName === 'Day 2' ? 'selected' : ''}>Day 2</option>
              <option value="Day 3" ${dayName === 'Day 3' ? 'selected' : ''}>Day 3</option>
              <option value="Day 4" ${dayName === 'Day 4' ? 'selected' : ''}>Day 4</option>
              <option value="Unassigned" ${dayName === 'Unassigned' ? 'selected' : ''}>Unassigned</option>
            </select>
            <button type="button" class="btn-mytrip-action btn-pin-toggle is-active" data-id="${s.id}" title="Unpin Spot">📌</button>
            <button type="button" class="btn-mytrip-action btn-visit-toggle ${s.isVisited ? 'is-active' : ''}" data-id="${s.id}" title="Toggle Visited">✅</button>
          </div>
        </div>
      `).join('')}
    `;
  });

  htmlContent += `<div class="bottom-scroll-spacer" style="height: 50px; width: 100%; flex-shrink: 0;"></div></div>`;
  container.innerHTML = htmlContent;

  // Restore scroll position
  const newScrollContainer = container.querySelector('.trip-grouped-list');
  if (newScrollContainer) {
    newScrollContainer.scrollTop = savedScrollTop;
  }

  container.querySelectorAll('.day-assign-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const spotId = e.target.getAttribute('data-spot-id');
      const selectedDay = e.target.value;
      if (window.MarlonStorage) window.MarlonStorage.setSpotDay(spotId, selectedDay);
      renderDaysView(allSpots);
    });
  });

  container.querySelectorAll('.btn-pin-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const spotId = btn.getAttribute('data-id');
      if (window.MarlonStorage) window.MarlonStorage.toggleSavedSpot(spotId);
      if (window.updateMarlonMarkerStates) window.updateMarlonMarkerStates();
      
      renderDaysView(allSpots);
      focusMapOnPinnedSpots(allSpots);
    });
  });

  container.querySelectorAll('.btn-visit-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const spotId = btn.getAttribute('data-id');
      if (window.MarlonStorage) window.MarlonStorage.toggleVisitedSpot(spotId);
      if (window.updateMarlonMarkerStates) window.updateMarlonMarkerStates();
      renderDaysView(allSpots);
    });
  });

  container.querySelectorAll('.spot-title').forEach(titleEl => {
    titleEl.addEventListener('click', () => {
      const itemEl = titleEl.closest('.trip-spot-item');
      const spotId = itemEl?.getAttribute('data-id');
      if (spotId && window.MARLON_ALL_MARKERS) {
        const match = window.MARLON_ALL_MARKERS.find(m => m.id === spotId);
        if (match && match.wrapper) match.wrapper.click();
      }
    });
  });
}


/* ==============================================================================
 * SECTION 5: PASSPORT SUB-VIEW RENDERER & LISTENERS
 * ============================================================================== */
function renderPassportView(allSpots) {
  const container = document.getElementById('view-passport');
  if (!container) return;

  const userData = window.MarlonStorage ? window.MarlonStorage.getSavedTripData() : { mascot: '🐼', name: '', instagram: '', visited: [] };
  const visitedIds = userData.visited || [];

  const visitedNames = visitedIds.map(id => {
    const match = (allSpots || []).find(s => parseSpotInfo(s).id === id);
    return match ? parseSpotInfo(match).name : id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  });

  container.innerHTML = `
    <div class="passport-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <h4 style="margin: 0; font-size: 0.88rem; color: #0f172a; font-weight: 800;">👤 Traveler Profile Card</h4>
        <button id="share-passport-btn" type="button" style="font-size: 0.7rem; font-weight: 700; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 3px 8px; cursor: pointer;">📋 Copy Handle</button>
      </div>
      
      <label style="font-size: 0.7rem; font-weight: 800; color: #64748b; display: block; margin-bottom: 4px;">YOUR MASCOT</label>
      <div class="mascot-selector" style="display: flex; gap: 4px; margin-bottom: 10px; overflow-x: auto; padding-bottom: 4px;">
        ${['🦙', '🦁', '🐻', '🦩', '🐯', '🦊', '🐼', '🐨'].map(m => `
          <button class="mascot-btn ${userData.mascot === m ? 'selected' : ''}" data-mascot="${m}" type="button" style="padding: 4px 8px; font-size: 1.1rem; background: ${userData.mascot === m ? '#e0f2fe' : '#f1f5f9'}; border: 1px solid ${userData.mascot === m ? '#0284c7' : '#cbd5e1'}; border-radius: 6px; cursor: pointer;">${m}</button>
        `).join('')}
      </div>

      <div class="input-group" style="margin-bottom: 8px;">
        <label style="font-size: 0.7rem; font-weight: 800; color: #64748b; display: block; margin-bottom: 2px;">NAME</label>
        <input type="text" id="user-name" placeholder="Your Name or Nickname" value="${userData.name || ''}" style="width: 100%; padding: 6px 8px; font-size: 0.8rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
      </div>

      <div class="input-row" style="display: flex; gap: 6px;">
        <div class="input-group" style="flex: 1;">
          <label style="font-size: 0.7rem; font-weight: 800; color: #64748b; display: block; margin-bottom: 2px;">INSTAGRAM</label>
          <input type="text" id="user-ig" placeholder="@username" value="${userData.instagram || ''}" style="width: 100%; padding: 6px 8px; font-size: 0.8rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
        </div>
        <div class="input-group" style="flex: 1;">
          <label style="font-size: 0.7rem; font-weight: 800; color: #64748b; display: block; margin-bottom: 2px;">WHATSAPP</label>
          <input type="text" id="user-phone" placeholder="+1 555-0199" value="${userData.phone || ''}" style="width: 100%; padding: 6px 8px; font-size: 0.8rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
        </div>
      </div>
    </div>

    <div class="visited-summary" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px;">
      <h4 style="margin: 0 0 6px 0; font-size: 0.85rem; color: #0f172a; font-weight: 800;">✅ Visited Spots (${visitedNames.length})</h4>
      ${visitedNames.length > 0 ? `
        <div class="visited-chips-wrap" style="display: flex; flex-wrap: wrap; gap: 4px; max-height: 120px; overflow-y: auto;">
          ${visitedNames.map(name => `<span class="visited-chip" style="font-size: 0.72rem; background: #dcfce7; color: #15803d; font-weight: 700; padding: 2px 6px; border-radius: 6px;">✓ ${name}</span>`).join('')}
        </div>
      ` : `<p style="margin: 0; font-size: 0.78rem; color: #64748b;">Tap ✅ on any spot card to check off places you've visited!</p>`}
    </div>
    <div class="bottom-scroll-spacer" style="height: 50px; width: 100%; flex-shrink: 0;"></div>
  `;
}

function setupPassportListeners() {
  const container = document.getElementById('view-passport');
  if (!container) return;

  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('mascot-btn')) {
      const selectedMascot = e.target.getAttribute('data-mascot');
      container.querySelectorAll('.mascot-btn').forEach(b => {
        b.style.background = '#f1f5f9';
        b.style.borderColor = '#cbd5e1';
      });
      e.target.style.background = '#e0f2fe';
      e.target.style.borderColor = '#0284c7';

      if (window.MarlonStorage) {
        const data = window.MarlonStorage.getSavedTripData() || {};
        data.mascot = selectedMascot;
        window.MarlonStorage.saveTripData(data);
      }
    } else if (e.target.id === 'share-passport-btn') {
      const name = document.getElementById('user-name')?.value || 'LA Explorer';
      const ig = document.getElementById('user-ig')?.value || '';
      const textToCopy = `Hey! I'm ${name} on Marlon's DTLA Walk! ${ig ? 'IG: ' + ig : ''}`;
      navigator.clipboard.writeText(textToCopy);
      e.target.innerText = 'Copied! 🎉';
      setTimeout(() => { e.target.innerText = '📋 Copy Handle'; }, 2000);
    }
  });

  container.addEventListener('input', (e) => {
    if (['user-name', 'user-ig', 'user-phone'].includes(e.target.id)) {
      if (window.MarlonStorage) {
        const data = window.MarlonStorage.getSavedTripData() || {};
        data.name = document.getElementById('user-name')?.value || '';
        data.instagram = document.getElementById('user-ig')?.value || '';
        data.phone = document.getElementById('user-phone')?.value || '';
        window.MarlonStorage.saveTripData(data);
      }
    }
  });
}


/* ==============================================================================
 * SECTION 6: LOGISTICS SUB-VIEW RENDERER & LISTENERS
 * ============================================================================== */
function renderLogisticsView() {
  const container = document.getElementById('view-logistics');
  if (!container) return;

  const currentHotel = window.MarlonStorage ? window.MarlonStorage.getHotelAddress() : '';

  container.innerHTML = `
    <div class="logistics-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; margin-bottom: 8px;">
      <h4 style="margin: 0 0 4px 0; font-size: 0.85rem; color: #0f172a; font-weight: 800;">🏨 Set Hotel Basecamp</h4>
      <p style="margin: 0 0 6px 0; font-size: 0.75rem; color: #475569;">Enter your DTLA hotel name to save your basecamp location:</p>
      <div style="display: flex; gap: 6px;">
        <input type="text" id="hotel-input" placeholder="e.g. Biltmore Hotel DTLA" value="${currentHotel}" style="flex: 1; padding: 6px 8px; font-size: 0.78rem; border: 1px solid #cbd5e1; border-radius: 6px;" />
        <button id="save-hotel-btn" type="button" style="padding: 6px 10px; font-size: 0.75rem; font-weight: 800; background: #2563eb; color: #ffffff; border: none; border-radius: 6px; cursor: pointer;">Save</button>
      </div>
    </div>

    <div class="logistics-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; margin-bottom: 8px;">
      <h4 style="margin: 0 0 4px 0; font-size: 0.85rem; color: #0f172a; font-weight: 800;">🚶 Tour Directions</h4>
      <a href="https://maps.google.com/?q=Pershing+Square+Los+Angeles" target="_blank" rel="noopener" style="display: block; width: 100%; padding: 8px 0; font-size: 0.78rem; font-weight: 800; text-align: center; color: #ffffff; background: #059669; border-radius: 6px; text-decoration: none;">🗺️ Get Directions to Tour Meetup</a>
    </div>

    <div class="logistics-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px;">
      <h4 style="margin: 0 0 4px 0; font-size: 0.85rem; color: #0f172a; font-weight: 800;">🚆 LA Metro & Transit</h4>
      <p style="margin: 0; font-size: 0.78rem; color: #475569; line-height: 1.35;">Tap card or Apple/Google Pay works on all Metro buses and subways ($1.75 flat fare with free 2-hour transfers).</p>
    </div>
    <div class="bottom-scroll-spacer" style="height: 50px; width: 100%; flex-shrink: 0;"></div>
  `;

  document.getElementById('save-hotel-btn')?.addEventListener('click', () => {
    const val = document.getElementById('hotel-input')?.value || '';
    if (window.MarlonStorage) window.MarlonStorage.setHotelAddress(val);
    const btn = document.getElementById('save-hotel-btn');
    if (btn) {
      btn.innerText = 'Saved! 🏨';
      setTimeout(() => { btn.innerText = 'Save'; }, 2000);
    }
  });
}
