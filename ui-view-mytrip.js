/* ==============================================================================
 * FILE: ui-view-mytrip.js
 * CATEGORY: MarlonWalksLA Website - My Trip View Controller
 * ============================================================================== */

// Helper to reliably extract spot ID and Name across GeoJSON and Marker objects
function parseSpotInfo(spot) {
  if (!spot) return { id: '', name: 'Location' };
  
  const p = spot.properties || spot;
  const rawId = spot.id || p.id || p.Slug || p.Item_ID || p.Name || p.name || '';
  const cleanId = String(rawId).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  const cleanName = spot.title || p.Name || p.name || p.title || 
    cleanId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Location';

  return { id: cleanId, name: cleanName };
}

window.initMyTripView = function(allSpots) {
  initSubTabSwitcher();
  setupPassportListeners();
  renderDaysView(allSpots);
  renderPassportView(allSpots);
  renderLogisticsView();
};

function initSubTabSwitcher() {
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
    });
  });
}

function renderDaysView(allSpots) {
  const container = document.getElementById('view-days');
  if (!container) return;

  const tripData = window.MarlonStorage ? window.MarlonStorage.getSavedTripData() : { pinned: [], days: {} };
  const savedMap = tripData.days || {};
  const savedSpotIds = Object.keys(savedMap);

  if (savedSpotIds.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 20px 12px; text-align: center; color: #64748b;">
        <p style="margin: 0 0 4px 0; font-weight: 700; font-size: 0.9rem;">📍 No saved spots yet!</p>
        <small style="font-size: 0.78rem;">Explore LA spots and click "Pin" on any card or map pin to build your itinerary.</small>
      </div>
    `;
    return;
  }

  // Look up each saved ID in allSpots array
  const spotItemsHtml = savedSpotIds.map(spotId => {
    const match = (allSpots || []).find(s => parseSpotInfo(s).id === spotId);
    const spotName = match ? parseSpotInfo(match).name : spotId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const currentDay = savedMap[spotId] || 'Unassigned';

    return `
      <div class="trip-spot-item" data-id="${spotId}" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 6px;">
        <span class="spot-title" style="font-size: 0.82rem; font-weight: 700; color: #0f172a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 65%;">📍 ${spotName}</span>
        <select class="day-assign-select" data-spot-id="${spotId}" style="font-size: 0.75rem; font-weight: 600; padding: 4px 6px; border-radius: 6px; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; outline: none; cursor: pointer;">
          <option value="Unassigned" ${currentDay === 'Unassigned' ? 'selected' : ''}>Unassigned</option>
          <option value="Day 1" ${currentDay === 'Day 1' ? 'selected' : ''}>Day 1</option>
          <option value="Day 2" ${currentDay === 'Day 2' ? 'selected' : ''}>Day 2</option>
          <option value="Day 3" ${currentDay === 'Day 3' ? 'selected' : ''}>Day 3</option>
          <option value="Day 4" ${currentDay === 'Day 4' ? 'selected' : ''}>Day 4</option>
        </select>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="trip-spots-header" style="margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
      <h4 style="margin: 0; font-size: 0.85rem; color: #1e293b; font-weight: 800;">📌 Saved Spots (${savedSpotIds.length})</h4>
    </div>
    <div class="trip-spots-list" style="max-height: 260px; overflow-y: auto;">
      ${spotItemsHtml}
    </div>
  `;

  // Attach change listeners to sync day assignments with local storage
  container.querySelectorAll('.day-assign-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const spotId = e.target.getAttribute('data-spot-id');
      const selectedDay = e.target.value;
      if (window.MarlonStorage) {
        window.MarlonStorage.setSpotDay(spotId, selectedDay);
      }
    });
  });
}

function renderPassportView(allSpots) {
  const container = document.getElementById('view-passport');
  if (!container) return;

  const userData = window.MarlonStorage ? window.MarlonStorage.getSavedTripData() : { mascot: '🐼', name: '', instagram: '', visited: [] };
  const visitedIds = userData.visited || [];

  container.innerHTML = `
    <div class="passport-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; margin-bottom: 10px;">
      <h4 style="margin: 0 0 8px 0; font-size: 0.88rem; color: #0f172a; font-weight: 800;">👤 Traveler Profile Card</h4>
      
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
      <h4 style="margin: 0 0 2px 0; font-size: 0.85rem; color: #0f172a; font-weight: 800;">✅ Visited Spots (${visitedIds.length})</h4>
      <p style="margin: 0; font-size: 0.78rem; color: #64748b;">You have checked off ${visitedIds.length} LA landmarks!</p>
    </div>
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

function renderLogisticsView() {
  const container = document.getElementById('view-logistics');
  if (!container) return;

  container.innerHTML = `
    <div class="logistics-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; margin-bottom: 8px;">
      <h4 style="margin: 0 0 4px 0; font-size: 0.85rem; color: #0f172a; font-weight: 800;">🏨 Downtown LA Accommodations</h4>
      <p style="margin: 0; font-size: 0.78rem; color: #475569; line-height: 1.35;">Staying in DTLA gives you walking access to historic landmarks, Metro subways, and our walking tour meet-up spots.</p>
    </div>
    <div class="logistics-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px;">
      <h4 style="margin: 0 0 4px 0; font-size: 0.85rem; color: #0f172a; font-weight: 800;">🚆 LA Metro & Transit</h4>
      <p style="margin: 0; font-size: 0.78rem; color: #475569; line-height: 1.35;">Tap card or Apple/Google Pay works on all Metro buses and subways ($1.75 flat fare with free 2-hour transfers).</p>
    </div>
  `;
}
