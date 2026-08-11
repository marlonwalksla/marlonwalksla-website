// ui-view-mytrip.js
import { getSavedTripData, saveTripData } from './storage-manager.js';[cite: 1]

export function initMyTripView(allSpots) {
  initSubTabSwitcher();
  setupPassportListeners();
  renderDaysView(allSpots);
  renderPassportView(allSpots);
  renderLogisticsView();
}

/**
 * 1. Sub-Tab Navigation Switcher
 * Controls toggles between Days, Passport, and Logistics within "My Trip"
 */
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

      // Update active tab styles
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      // Toggle panel views
      Object.keys(views).forEach(key => {
        if (views[key]) {
          views[key].style.display = key === target ? 'block' : 'none';
        }
      });
    });
  });
}

/**
 * 2. Days & Itinerary View
 * Handles pinned spots, unassigned items, and Day 1–4 assignments
 */
export function renderDaysView(allSpots) {
  const container = document.getElementById('view-days');
  if (!container) return;

  const tripData = getSavedTripData() || { pinned: [], days: {} };[cite: 1]
  const pinnedSpots = allSpots.filter(spot => tripData.pinned.includes(spot.properties.id));

  if (pinnedSpots.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>📍 No saved spots yet!</p>
        <small>Explore LA spots and click "Pin" to build your trip.</small>
      </div>
    `;
    return;
  }

  // Render list of pinned spots with day assignment selectors
  container.innerHTML = `
    <div class="trip-spots-header">
      <h4>📌 Saved Spots (${pinnedSpots.length})</h4>
    </div>
    <div class="trip-spots-list">
      ${pinnedSpots.map(spot => {
        const currentDay = tripData.days[spot.properties.id] || 'Unassigned';
        return `
          <div class="trip-spot-item" data-id="${spot.properties.id}">
            <span class="spot-title">📍 ${spot.properties.name}</span>
            <select class="day-assign-select" data-spot-id="${spot.properties.id}">
              <option value="Unassigned" ${currentDay === 'Unassigned' ? 'selected' : ''}>Unassigned</option>
              <option value="Day 1" ${currentDay === 'Day 1' ? 'selected' : ''}>Day 1</option>
              <option value="Day 2" ${currentDay === 'Day 2' ? 'selected' : ''}>Day 2</option>
              <option value="Day 3" ${currentDay === 'Day 3' ? 'selected' : ''}>Day 3</option>
              <option value="Day 4" ${currentDay === 'Day 4' ? 'selected' : ''}>Day 4</option>
            </select>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Attach listener for day selector changes
  container.querySelectorAll('.day-assign-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const spotId = e.target.getAttribute('data-spot-id');
      const selectedDay = e.target.value;
      
      const updatedData = getSavedTripData() || { pinned: [], days: {} };[cite: 1]
      updatedData.days[spotId] = selectedDay;
      saveTripData(updatedData);[cite: 1]
    });
  });
}

/**
 * 3. Passport View
 * Manages Mascot selection, contact card info, and Visited spots counter
 */
function renderPassportView(allSpots) {
  const container = document.getElementById('view-passport');
  if (!container) return;

  const userData = getSavedTripData() || { mascot: '🐼', name: '', instagram: '', visited: [] };[cite: 1]
  const visitedSpots = allSpots.filter(s => userData.visited.includes(s.properties.id));

  container.innerHTML = `
    <div class="passport-card">
      <h4>👤 Traveler Profile Card</h4>
      
      <label>YOUR MASCOT</label>
      <div class="mascot-selector">
        ${['🦙', '🦁', '🐻', '🦩', '🐯', '🦊', '🐼', '🐨'].map(m => `
          <button class="mascot-btn ${userData.mascot === m ? 'selected' : ''}" data-mascot="${m}">${m}</button>
        `).join('')}
      </div>

      <div class="input-group">
        <label>NAME</label>
        <input type="text" id="user-name" placeholder="Your Name or Nickname" value="${userData.name || ''}">
      </div>

      <div class="input-row">
        <div class="input-group">
          <label>INSTAGRAM</label>
          <input type="text" id="user-ig" placeholder="@username" value="${userData.instagram || ''}">
        </div>
        <div class="input-group">
          <label>PHONE / WHATSAPP</label>
          <input type="text" id="user-phone" placeholder="+1 555-0199" value="${userData.phone || ''}">
        </div>
      </div>
    </div>

    <div class="visited-summary">
      <h4>✅ Visited Spots (${visitedSpots.length})</h4>
      <p class="visited-count-text">You have checked off ${visitedSpots.length} LA landmarks!</p>
    </div>
  `;
}

function setupPassportListeners() {
  const container = document.getElementById('view-passport');
  if (!container) return;

  // Mascot selection
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('mascot-btn')) {
      const selectedMascot = e.target.getAttribute('data-mascot');
      
      container.querySelectorAll('.mascot-btn').forEach(b => b.classList.remove('selected'));
      e.target.classList.add('selected');

      const data = getSavedTripData() || {};[cite: 1]
      data.mascot = selectedMascot;
      saveTripData(data);[cite: 1]
    }
  });

  // Contact Inputs
  container.addEventListener('input', (e) => {
    if (['user-name', 'user-ig', 'user-phone'].includes(e.target.id)) {
      const data = getSavedTripData() || {};[cite: 1]
      data.name = document.getElementById('user-name')?.value || '';
      data.instagram = document.getElementById('user-ig')?.value || '';
      data.phone = document.getElementById('user-phone')?.value || '';
      saveTripData(data);[cite: 1]
    }
  });
}

/**
 * 4. Logistics View
 * Holds hotel accommodations and transit guidance
 */
function renderLogisticsView() {
  const container = document.getElementById('view-logistics');
  if (!container) return;

  container.innerHTML = `
    <div class="logistics-card">
      <h4>🏨 Downtown LA Accommodations</h4>
      <p>Staying in DTLA gives you walking access to historic landmarks, Metro trains, and our tour meet-up spots.</p>
    </div>
    <div class="logistics-card">
      <h4>🚆 LA Metro & Transit</h4>
      <p>Tap card or Apple/Google Pay works on all Metro buses and subways ($1.75 flat fare with free 2-hour transfers).</p>
    </div>
  `;
}
