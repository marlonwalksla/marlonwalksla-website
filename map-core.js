/* ==============================================================================
 * FILE: map-core.js
 * CATEGORY: MarlonWalksLA Website - Master Map Engine & Smart Planning Hub
 * ============================================================================== */

window.initMapEngine = async function() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  mapboxgl.accessToken = 'pk.eyJ1IjoibWFybG9ud2Fsa3NsYSIsImEiOiJjbXM5YWhuOGIwbGVjMzRwbTZ0b2I2emZlIn0.UgW7MpYibACH6Axk1WgoSA';

  const dtlaCenter = [-118.2437, 34.0522];

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: dtlaCenter,
    zoom: 10.2
  });

  const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true
  });
  map.addControl(geolocate, 'top-right');

  window.addEventListener('resize', () => map.resize());

  const defaultPinSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

  const categoryMap = {
    'cafes': { color: '#a855f7', name: 'Cafes', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>' },
    'dining': { color: '#ef4444', name: 'Dining', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/></svg>' },
    'nightlife': { color: '#6366f1', name: 'Nightlife', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 22h8M12 15v7M19 3l-7 8-7-7h14z"/></svg>' },
    'landmarks': { color: '#f59e0b', name: 'Landmarks', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
    'arts': { color: '#ec4899', name: 'Arts', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2C6.5 2 2 6.5 2 12c0 5.5 4.5 10 10 10a2.5 2.5 0 0 0 2.5-2.5"/></svg>' },
    'shopping': { color: '#06b6d4', name: 'Shopping', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg>' },
    'parks': { color: '#10b981', name: 'Parks', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 18h8M12 2L3 14h18L12 2z"/></svg>' },
    'entertainment': { color: '#2563eb', name: 'Entertainment', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>' }
  };

  function cleanText(str) {
    if (!str) return '';
    return String(str).replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  }

  // FETCH GEOJSON DATA
  let geojsonData = null;
  try {
    let res = await fetch('https://raw.githack.com/marlonwalksla/marlonwalksla-website/main/spots.geojson');
    if (!res.ok) res = await fetch('https://raw.githack.com/marlonwalksla/marlonwalksla-website/main/MarlonWalksLA%20-%20Maps%20(102).geojson');
    if (res.ok) geojsonData = await res.json();
  } catch (err) {
    console.error('Failed to load GeoJSON dataset:', err);
  }

  if (!geojsonData || !geojsonData.features) return;

  const allMarkers = [];
  window.MARLON_ALL_MARKERS = allMarkers;

  const neighborhoods = new Set();
  const categories = new Set();

  // HOTEL MARKER SETUP
  let hotelMarker = null;

  function renderHotelMarkerOnMap() {
    const hotel = window.MarlonStorage.getHotel();
    if (hotelMarker) hotelMarker.remove();

    if (hotel && hotel.lat && hotel.lng) {
      const el = document.createElement('div');
      el.className = 'hotel-marker-pin';
      el.innerText = '🏨';
      el.title = `Your Base: ${hotel.name}`;

      hotelMarker = new mapboxgl.Marker({ element: el })
        .setLngLat([hotel.lng, hotel.lat])
        .addTo(map);
    }
  }

  // UI CONTAINER SETUP & WEBFLOW FORM SUBMIT PREVENTION
  const form = document.querySelector('.filter-bar form');
  let searchWrapper = null;
  let hotelAnchorBox = null;
  let topHeaderView = null;
  let featuredView = null;
  let allLaView = null;
  let spotDetailsView = null;
  let listCardView = null;

  let scopeFeaturedBtn = null;
  let scopeAllBtn = null;
  let scopeTripBtn = null;

  let activeTab = 'trip';

  if (form) {
    // CRITICAL BUGFIX: Prevent Webflow form submission redirect
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });

    form.innerHTML = '';

    // Mobile Drag Handle
    const dragHandle = document.createElement('div');
    dragHandle.className = 'mobile-drag-handle';
    form.appendChild(dragHandle);

    // Global Search Component
    searchWrapper = document.createElement('div');
    searchWrapper.className = 'map-search-wrapper';
    searchWrapper.innerHTML = `
      <input type="text" class="map-search-input" placeholder="🔍 Search 102 spots, hotels, locations..." />
      <div class="search-results-dropdown"></div>
    `;
    form.appendChild(searchWrapper);

    // Hotel Anchor Box
    hotelAnchorBox = document.createElement('div');
    hotelAnchorBox.className = 'hotel-anchor-box';
    form.appendChild(hotelAnchorBox);

    topHeaderView = document.createElement('div');
    topHeaderView.id = 'top-header-view';

    featuredView = document.createElement('div');
    featuredView.id = 'featured-view';
    featuredView.style.display = 'none';

    allLaView = document.createElement('div');
    allLaView.id = 'all-la-view';
    allLaView.style.display = 'none';

    spotDetailsView = document.createElement('div');
    spotDetailsView.id = 'spot-details-view';
    spotDetailsView.style.display = 'none';

    listCardView = document.createElement('div');
    listCardView.id = 'list-card-view';
    listCardView.style.display = 'flex';
    listCardView.style.flexDirection = 'column';

    form.appendChild(topHeaderView);
    form.appendChild(listCardView);
    form.appendChild(featuredView);
    form.appendChild(allLaView);
    form.appendChild(spotDetailsView);

    setupSearchEvents(searchWrapper);
  }

  function updateHotelBoxUI() {
    const hotel = window.MarlonStorage.getHotel();
    if (!hotel) {
      hotelAnchorBox.innerHTML = `
        <div>
          <div class="hotel-anchor-title">🏨 Where are you staying?</div>
          <div class="hotel-anchor-sub">Set your hotel to see distances on map</div>
        </div>
        <button type="button" class="featured-import-btn" id="set-hotel-btn">Set Base</button>
      `;
      document.getElementById('set-hotel-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        promptHotelSearch();
      });
    } else {
      hotelAnchorBox.innerHTML = `
        <div>
          <div class="hotel-anchor-title">🏨 Base: ${hotel.name}</div>
          <div class="hotel-anchor-sub">${hotel.address || 'Los Angeles'}</div>
        </div>
        <button type="button" class="clear-itinerary-btn" id="change-hotel-btn">Edit</button>
      `;
      document.getElementById('change-hotel-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.MarlonStorage.clearHotel();
        renderHotelMarkerOnMap();
        updateHotelBoxUI();
      });
    }
  }

  function promptHotelSearch() {
    const input = searchWrapper.querySelector('.map-search-input');
    input.focus();
    input.placeholder = "🏨 Type hotel name or address...";
  }

  // SEARCH AUTOCOMPLETE LOGIC
  function setupSearchEvents(wrapper) {
    const input = wrapper.querySelector('.map-search-input');
    const dropdown = wrapper.querySelector('.search-results-dropdown');

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') e.preventDefault();
    });

    input.addEventListener('input', async () => {
      const query = input.value.trim().toLowerCase();
      if (query.length < 2) {
        dropdown.style.display = 'none';
        return;
      }

      const curatedMatches = allMarkers.filter(m => 
        m.title.toLowerCase().includes(query) || 
        m.neighborhood.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query)
      ).slice(0, 5);

      let html = curatedMatches.map(m => `
        <div class="search-result-item" data-type="curated" data-id="${m.id}">
          <div>
            <div class="search-result-title">📍 ${m.title}</div>
            <div class="search-result-meta">${m.neighborhood} • ${m.category}</div>
          </div>
          <span class="search-badge curated">Spot</span>
        </div>
      `).join('');

      if (query.length > 3) {
        try {
          const geoRes = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?proximity=${dtlaCenter[0]},${dtlaCenter[1]}&access_token=${mapboxgl.accessToken}`);
          const geoData = await geoRes.json();
          if (geoData.features) {
            const externalMatches = geoData.features.slice(0, 3);
            html += externalMatches.map(f => `
              <div class="search-result-item" data-type="address" data-lng="${f.center[0]}" data-lat="${f.center[1]}" data-name="${f.text}">
                <div>
                  <div class="search-result-title">🏨 ${f.text}</div>
                  <div class="search-result-meta">${f.place_name}</div>
                </div>
                <span class="search-badge address">Hotel / Place</span>
              </div>
            `).join('');
          }
        } catch(e) {}
      }

      dropdown.innerHTML = html;
      dropdown.style.display = 'block';

      dropdown.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const type = item.dataset.type;
          if (type === 'curated') {
            const match = allMarkers.find(m => m.id === item.dataset.id);
            if (match) {
              window.MarlonStorage.toggleSavedSpot(match.id, 'Day 1');
              updateMarkerStates();
              renderItinerary();
              match.wrapper.click();
            }
          } else {
            const hotelObj = {
              id: 'hotel-' + Date.now(),
              name: item.dataset.name,
              lng: parseFloat(item.dataset.lng),
              lat: parseFloat(item.dataset.lat),
              address: 'Custom Base'
            };
            window.MarlonStorage.setHotel(hotelObj);
            renderHotelMarkerOnMap();
            updateHotelBoxUI();
            map.flyTo({ center: [hotelObj.lng, hotelObj.lat], zoom: 13.5 });
          }
          dropdown.style.display = 'none';
          input.value = '';
          input.placeholder = "🔍 Search 102 spots, hotels, locations...";
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) dropdown.style.display = 'none';
    });
  }

  function updateTabCounts() {
    const featuredPresets = window.MARLON_ROUTES_PRESETS || [];
    const featuredTitles = featuredPresets.flatMap(p => p.spotTitles.map(t => t.toLowerCase().trim()));
    const featuredCount = allMarkers.filter(m => featuredTitles.some(t => m.title.toLowerCase().trim().includes(t))).length;

    const allCount = allMarkers.length;
    const tripCount = window.MarlonStorage.getSavedSpotIds().length;

    if (scopeFeaturedBtn) scopeFeaturedBtn.innerText = `✨ Featured (${featuredCount})`;
    if (scopeAllBtn) scopeAllBtn.innerText = `🌐 All LA (${allCount})`;
    if (scopeTripBtn) scopeTripBtn.innerText = `🎒 Your Trip (${tripCount})`;
  }

  function switchTab(targetTab) {
    activeTab = targetTab;
    topHeaderView.style.display = 'block';
    spotDetailsView.style.display = 'none';

    if (scopeFeaturedBtn) scopeFeaturedBtn.classList.toggle('is-active', targetTab === 'featured');
    if (scopeAllBtn) scopeAllBtn.classList.toggle('is-active', targetTab === 'all');
    if (scopeTripBtn) scopeTripBtn.classList.toggle('is-active', targetTab === 'trip');

    if (targetTab === 'featured') {
      featuredView.style.display = 'flex';
      allLaView.style.display = 'none';
      listCardView.style.display = 'none';
    } else if (targetTab === 'all') {
      featuredView.style.display = 'none';
      allLaView.style.display = 'flex';
      listCardView.style.display = 'none';
    } else if (targetTab === 'trip') {
      featuredView.style.display = 'none';
      allLaView.style.display = 'none';
      listCardView.style.display = 'flex';
      renderItinerary();
    }
    map.resize();
  }

  function updateMarkerStates() {
    const savedSpotIds = window.MarlonStorage.getSavedSpotIds();
    const visitedIds = window.MarlonStorage.getVisitedSpots();

    allMarkers.forEach(m => {
      const isVisited = visitedIds.includes(m.id);
      const isPinned = savedSpotIds.includes(m.id);

      if (isVisited) {
        m.wrapper.classList.add('is-visited-pin');
        m.wrapper.classList.remove('is-pinned-ring');
      } else if (isPinned) {
        m.wrapper.classList.add('is-pinned-ring');
        m.wrapper.classList.remove('is-visited-pin');
      } else {
        m.wrapper.classList.remove('is-visited-pin');
        m.wrapper.classList.remove('is-pinned-ring');
      }
    });
    updateTabCounts();
  }

  function renderItinerary() {
    window.MarlonItineraryView.renderItinerary(listCardView, allMarkers, {
      onClearDay: () => {
        window.MarlonStorage.clearItinerary();
        updateMarkerStates();
        renderItinerary();
      },
      onRemoveSpot: (sId) => {
        window.MarlonStorage.toggleSavedSpot(sId);
        updateMarkerStates();
        renderItinerary();
      },
      onToggleVisited: (sId) => {
        window.MarlonStorage.toggleVisitedSpot(sId);
        updateMarkerStates();
        renderItinerary();
      },
      onSpotClick: (sId) => {
        const match = allMarkers.find(m => m.id === sId);
        if (match) match.wrapper.click();
      }
    });

    renderProximityUpsellCard();
  }

  // ALWAYS VISIBLE RECOMMENDED TOUR CARD ENGINE
  function renderProximityUpsellCard() {
    if (!listCardView) return;

    const savedSpotIds = window.MarlonStorage.getSavedSpotIds();
    const savedSpots = allMarkers.filter(m => savedSpotIds.includes(m.id));
    
    let dtlaCount = 0;
    let hollywoodCount = 0;

    savedSpots.forEach(s => {
      if (s.neighborhood && s.neighborhood.toLowerCase().includes('dtla')) dtlaCount++;
      if (s.neighborhood && s.neighborhood.toLowerCase().includes('hollywood')) hollywoodCount++;
    });

    let existingUpsell = listCardView.querySelector('.proximity-upsell-card');
    if (existingUpsell) existingUpsell.remove();

    let tourTitle = "🚶 DTLA Free Walking Tour";
    let tourDesc = dtlaCount >= 1 
      ? `You have ${dtlaCount} DTLA spot(s) saved! Join Marlon's 2-hr historic walking tour.`
      : "Marlon's flagship 2-hour walking tour through historic DTLA architecture, markets, and culture.";
    let tourUrl = "https://marlonwalksla.com";
    let btnText = "🎟️ Book Free Walk";

    if (hollywoodCount > dtlaCount) {
      tourTitle = "🎬 Hollywood Movie Magic Guide";
      tourDesc = "Near your Hollywood pins! Unlock self-guided audio stories and cinema history.";
      btnText = "🔓 Unlock Audio Guide";
    }

    const card = document.createElement('div');
    card.className = 'proximity-upsell-card';
    card.innerHTML = `
      <div class="proximity-upsell-header">
        <span class="proximity-badge">RECOMMENDED TOUR</span>
      </div>
      <div class="proximity-title">${tourTitle}</div>
      <div class="proximity-desc">${tourDesc}</div>
      <button type="button" class="proximity-cta-btn">${btnText}</button>
    `;

    card.querySelector('.proximity-cta-btn').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.open(tourUrl, '_blank');
    });

    listCardView.prepend(card);
  }

  // PROCESS GEOJSON FEATURES
  geojsonData.features.forEach((feature, index) => {
    const props = feature.properties || {};
    const coords = feature.geometry ? feature.geometry.coordinates : null;
    if (!coords || coords.length < 2) return;

    const lng = parseFloat(coords[0]);
    const lat = parseFloat(coords[1]);

    const spotId = cleanText(props.Slug || props.Item_ID || props.Name || `spot-${index}`).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const title = cleanText(props.Name || props.title || props.name || 'Location');
    const rawCategory = cleanText(props.Category || props.category || 'landmarks');
    const customColor = cleanText(props.Color || props.color || '');
    const neighborhood = cleanText(props.City || props.city || 'Downtown LA');

    const catDetails = window.MarlonSpotCard ? window.MarlonSpotCard.getCategoryDetails(rawCategory, customColor, categoryMap, defaultPinSvg) : { color: '#3898ec', icon: defaultPinSvg, name: 'Spot' };

    if (neighborhood) neighborhoods.add(neighborhood);
    if (rawCategory) categories.add(rawCategory);

    const wrapper = document.createElement('div');
    wrapper.className = 'marker-wrapper';

    const inner = document.createElement('div');
    inner.className = 'custom-emoji-marker';
    inner.style.backgroundColor = catDetails.color;
    inner.innerHTML = catDetails.icon;
    wrapper.appendChild(inner);

    const marker = new mapboxgl.Marker({ element: wrapper }).setLngLat([lng, lat]);

    const spotData = {
      id: spotId,
      title: title,
      desc: cleanText(props.Description || ''),
      category: rawCategory,
      neighborhood: neighborhood,
      wrapper: wrapper,
      marker: marker,
      lng: lng,
      lat: lat
    };

    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      map.flyTo({ center: [lng, lat], zoom: 13.5 });
    });

    allMarkers.push(spotData);
  });

  // INITIALIZE HEADER CONTROLS
  if (topHeaderView) {
    const mainTitleHeader = document.createElement('div');
    mainTitleHeader.className = 'map-hero-cta-box';

    const titleText = document.createElement('h2');
    titleText.className = 'map-hero-cta-title';
    titleText.innerText = "Your LA Story";

    const scopeToggleWrap = document.createElement('div');
    scopeToggleWrap.className = 'scope-toggle-wrap tri-tab';

    scopeFeaturedBtn = document.createElement('button');
    scopeFeaturedBtn.type = 'button';
    scopeFeaturedBtn.className = 'scope-toggle-btn';

    scopeAllBtn = document.createElement('button');
    scopeAllBtn.type = 'button';
    scopeAllBtn.className = 'scope-toggle-btn';

    scopeTripBtn = document.createElement('button');
    scopeTripBtn.type = 'button';
    scopeTripBtn.className = 'scope-toggle-btn trip-tab-btn is-active';

    updateTabCounts();

    scopeFeaturedBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('featured'); });
    scopeAllBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('all'); });
    scopeTripBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('trip'); });

    scopeToggleWrap.appendChild(scopeTripBtn);
    scopeToggleWrap.appendChild(scopeFeaturedBtn);
    scopeToggleWrap.appendChild(scopeAllBtn);

    mainTitleHeader.appendChild(titleText);
    mainTitleHeader.appendChild(scopeToggleWrap);
    topHeaderView.appendChild(mainTitleHeader);
  }

  map.on('load', () => {
    updateHotelBoxUI();
    renderHotelMarkerOnMap();
    updateMarkerStates();
    switchTab('trip');
  });
};
