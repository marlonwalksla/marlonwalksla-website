/* ==============================================================================
 * FILE: ui-passport.js
 * CATEGORY: MarlonWalksLA Website - Digital Passport & Logistics Hub
 * ============================================================================== */

window.MarlonPassport = {
  render: function(container, hotelAnchorBox, onPromptHotelSearch) {
    if (!container) return;
    
    const profile = window.MarlonStorage.getProfile();
    const avatars = [
      { id: 'default', emoji: '🪅', label: 'Classic Ernesto' },
      { id: 'hiker', emoji: '🥾', label: 'Hiker Ernesto' },
      { id: 'beach', emoji: '🏄‍♂️', label: 'Beach Ernesto' },
      { id: 'taco', emoji: '🌮', label: 'Taco Ernesto' }
    ];

    let html = `
      <div class="featured-feed-header">
        <span class="featured-feed-title" style="margin-top:10px;">🪅 Your Passport</span>
      </div>
      
      <div class="route-block-card" style="margin-bottom: 12px; padding: 12px;">
        <div class="custom-spots-block-title" style="margin-top:0;">1. Choose Your Mascot</div>
        <div class="avatar-grid" style="display: flex; gap: 8px; margin-top: 8px; overflow-x: auto; padding-bottom: 4px;">
          ${avatars.map(a => `
            <div class="avatar-option ${profile.avatar === a.id ? 'is-selected' : ''}" data-id="${a.id}" style="text-align: center; cursor: pointer; opacity: ${profile.avatar === a.id ? '1' : '0.5'}; transition: all 0.2s;">
              <div style="font-size: 32px; background: ${profile.avatar === a.id ? '#eff6ff' : '#f8fafc'}; border: 2px solid ${profile.avatar === a.id ? '#3898ec' : '#cbd5e0'}; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">${a.emoji}</div>
              <div style="font-size: 9px; font-weight: 700; color: #475569; margin-top: 4px; white-space: nowrap;">${a.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="route-block-card" style="margin-bottom: 12px;">
        <div class="route-block-header" style="background-color: #f0f7ff; cursor: default;">
          <span class="route-block-title">2. Basecamp</span>
        </div>
        <div class="route-block-body" id="passport-hotel-container">
          <!-- Hotel box injected here -->
        </div>
      </div>

      <div class="route-block-card">
        <div class="route-block-header" style="background-color: #f0f7ff; cursor: default;">
          <span class="route-block-title">3. Logistics Notes</span>
        </div>
        <div class="route-block-body">
          <label style="font-size: 10px; font-weight: 800; color: #64748b; margin-top: 4px; text-transform: uppercase;">✈️ Flight / Transit Details</label>
          <textarea class="passport-note-input" data-key="flightNotes" placeholder="Confirmation #, departure times..." style="width: 100%; border: 1px dashed #cbd5e0; background: #f8fafc; font-size: 12px; padding: 8px; border-radius: 6px; color: #475569; outline: none; box-sizing: border-box; resize: vertical; min-height: 60px;">${profile.flightNotes || ''}</textarea>

          <label style="font-size: 10px; font-weight: 800; color: #64748b; margin-top: 10px; text-transform: uppercase;">🚗 Rental Car / Parking</label>
          <textarea class="passport-note-input" data-key="carNotes" placeholder="License plate, spot number..." style="width: 100%; border: 1px dashed #cbd5e0; background: #f8fafc; font-size: 12px; padding: 8px; border-radius: 6px; color: #475569; outline: none; box-sizing: border-box; resize: vertical; min-height: 60px;">${profile.carNotes || ''}</textarea>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Inject hotel anchor
    const hotelContainer = container.querySelector('#passport-hotel-container');
    if (hotelAnchorBox && hotelContainer) {
      hotelContainer.appendChild(hotelAnchorBox);
      if (window.MarlonHotel) window.MarlonHotel.updateUI(hotelAnchorBox, onPromptHotelSearch);
    }

    // Avatar Selection Logic
    container.querySelectorAll('.avatar-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.preventDefault();
        container.querySelectorAll('.avatar-option').forEach(o => { o.classList.remove('is-selected'); o.style.opacity = '0.5'; o.querySelector('div').style.borderColor = '#cbd5e0'; o.querySelector('div').style.backgroundColor = '#f8fafc'; });
        opt.classList.add('is-selected');
        opt.style.opacity = '1';
        opt.querySelector('div').style.borderColor = '#3898ec';
        opt.querySelector('div').style.backgroundColor = '#eff6ff';
        window.MarlonStorage.updateProfile('avatar', opt.dataset.id);
      });
    });

    // Notes Save Logic
    container.querySelectorAll('.passport-note-input').forEach(input => {
      input.addEventListener('input', (e) => {
        window.MarlonStorage.updateProfile(input.dataset.key, e.target.value);
      });
    });
  }
};
