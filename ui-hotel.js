/* ==============================================================================
 * FILE: ui-hotel.js
 * CATEGORY: MarlonWalksLA Website - Hotel Anchor UI & Marker Engine
 * ============================================================================== */

window.MarlonHotel = {
  hotelMarker: null,

  renderMarker: function(map) {
    const hotel = window.MarlonStorage.getHotel();
    if (this.hotelMarker) this.hotelMarker.remove();

    if (hotel && hotel.lat && hotel.lng && typeof mapboxgl !== 'undefined') {
      const el = document.createElement('div');
      el.className = 'hotel-marker-pin';
      el.innerText = '🏨';
      el.title = `Your Base: ${hotel.name}`;

      this.hotelMarker = new mapboxgl.Marker({ element: el })
        .setLngLat([hotel.lng, hotel.lat])
        .addTo(map);
    }
  },

  updateUI: function(container, onPromptSearch) {
    if (!container) return;
    const hotel = window.MarlonStorage.getHotel();

    if (!hotel) {
      container.innerHTML = `
        <div>
          <div class="hotel-anchor-title">🏨 Where are you staying?</div>
          <div class="hotel-anchor-sub">Set your hotel to see distances on map</div>
        </div>
        <button type="button" class="featured-import-btn" id="set-hotel-btn">Set Base</button>
      `;
      const btn = container.querySelector('#set-hotel-btn');
      if (btn && onPromptSearch) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          onPromptSearch();
        });
      }
    } else {
      container.innerHTML = `
        <div>
          <div class="hotel-anchor-title">🏨 Base: ${hotel.name}</div>
          <div class="hotel-anchor-sub">${hotel.address || 'Los Angeles'}</div>
        </div>
        <button type="button" class="clear-itinerary-btn" id="change-hotel-btn">Edit</button>
      `;
      const editBtn = container.querySelector('#change-hotel-btn');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.MarlonStorage.clearHotel();
          if (window.marlonMapInstance) this.renderMarker(window.marlonMapInstance);
          this.updateUI(container, onPromptSearch);
        });
      }
    }
  }
};
