/* ==============================================================================
 * FILE: map-core.js
 * CATEGORY: MarlonWalksLA Website - Master Map Engine & Interactive Hub
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
    'cafes': { color: '#a855f7', name: 'Cafes', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>' },
    'dining': { color: '#ef4444', name: 'Dining', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>' },
    'nightlife': { color: '#6366f1', name: 'Nightlife', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8M12 15v7M19 3l-7 8-7-7h14z"/></svg>' },
    'landmarks': { color: '#f59e0b', name: 'Landmarks', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
    'arts': { color: '#ec4899', name: 'Arts', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12c0 5.5 4.5 10 10 10a2.5 2.5 0 0 0 2.5-2.5c0-.88-.45-1.63-1.12-2.07a1.08 1.08 0 0 1-.41-.85c0-.6.48-1.08 1.08-1.08h1.45A5.5 5.5 0 0 0 21 10c0-5.5-4.5-8-9-8z"/><circle cx="7.5" cy="11.5" r="1" fill="currentColor"/><circle cx="12" cy="7.5" r="1" fill="currentColor"/><circle cx="16.5" cy="10.5" r="1" fill="currentColor"/></svg>' },
    'shopping': { color: '#06b6d4', name: 'Shopping', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>' },
    'parks': { color: '#10b981', name: 'Parks', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 18h8M12 2L3 14h18L12 2z"/></svg>' },
    'entertainment': { color: '#2563eb', name: 'Entertainment', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M13 5v2"/><path d="M13 11v2"/><path d="M13 17v2"/></svg>' }
  };

  function cleanText(str) {
    if (!str) return '';
    return String(str).replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  }

  function formatTagDisplay(tagStr) {
    if (!tagStr) return '';
    return String(tagStr)
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
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
  const tagsSet = new Set();

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

  // UI CONTAINERS & WEBFLOW FORM INTERCEPTOR
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
  let activeSelectedRouteId = null;

  if (form) {
    // STOP WEBFLOW FORM SUBMIT REDIRECT
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
    featuredView.style.flexDirection = 'column';
    featuredView.style.gap = '10px';

    allLaView = document.createElement('div');
    allLaView.id = 'all-la-view';
    allLaView.style.display = 'none';
    allLaView.style.flexDirection = 'column';
    allLaView.style.gap = '10px';

    spotDetailsView = document.createElement('div');
    spotDetailsView.id = 'spot-details-view';
    spotDetailsView.style.display = 'none';

    listCardView = document.createElement('div');
    listCardView.id = 'list-card-view';
    listCardView.style.display = 'flex';
    listCardView.style.flexDirection = 'column';
    listCardView.style.gap = '10px';

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
    if (scopeTripBtn) scopeTripBtn.innerText = `📋 Your Trip (${tripCount})`;
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
      applyFilters();
    } else if (targetTab === 'all') {
      featuredView.style.display = 'none';
      allLaView.style.display = 'flex';
      listCardView.style.display = 'none';
      applyFilters();
    } else if (targetTab === 'trip') {
      featuredView.style.display = 'none';
      allLaView.style.display = 'none';
      listCardView.style.display = 'flex';
      renderItinerary();
    }
    map.resize();
  }

  function showSpotDetailsView() {
    topHeaderView.style.display = 'none';
    featuredView.style.display = 'none';
    allLaView.style.display = 'none';
    listCardView.style.display = 'none';
    spotDetailsView.style.display = 'block';
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

  function panToRouteOnMap(routeId) {
    const presets = window.MARLON_ROUTES_PRESETS || [];
    const preset = presets.find(p => p.id === routeId);

    if (preset) {
      const targetSpotIds = [];
      preset.spotTitles.forEach(t => {
        const cleanT = t.toLowerCase().trim();
        const match = allMarkers.find(m => m.title.toLowerCase().includes(cleanT) || cleanT.includes(m.title.toLowerCase()));
        if (match) targetSpotIds.push(match.id);
      });
      if (targetSpotIds.length > 0) applyModeMapFilter(targetSpotIds);
    }
  }

  function applyModeMapFilter(targetIds) {
    const bounds = new mapboxgl.LngLatBounds();
    let visibleCount = 0;

    allMarkers.forEach(item => {
      if (targetIds.includes(item.id)) {
        item.marker.addTo(map);
        bounds.extend([item.lng, item.lat]);
        visibleCount++;
      } else {
        item.marker.remove();
      }
    });

    if (visibleCount >= 1) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 13.5, duration: 1200 });
    } else {
      map.flyTo({ center: dtlaCenter, zoom: 10.2, duration: 1200 });
    }
  }

  function renderItinerary() {
    window.MarlonItineraryView.renderItinerary(listCardView, allMarkers, {
      onClearDay: (dayToClear) => {
        const savedRoutesMap = window.MarlonStorage.getSavedRoutesMap();
        const itinMap = window.MarlonStorage.getItineraryMap();

        if (dayToClear === 'All') {
          window.MarlonStorage.clearItinerary();
        } else {
          Object.keys(savedRoutesMap).forEach(rId => {
            if (savedRoutesMap[rId] === dayToClear) window.MarlonStorage.toggleRouteBlock(rId);
          });
          Object.keys(itinMap).forEach(sId => {
            if (itinMap[sId] === dayToClear) window.MarlonStorage.toggleSavedSpot(sId);
          });
        }

        updateMarkerStates();
        renderItinerary();
        renderFeaturedPackages();
      },
      onRemoveRoute: (rId) => {
        window.MarlonStorage.toggleRouteBlock(rId);
        updateMarkerStates();
        renderItinerary();
        renderFeaturedPackages();
      },
      onRemoveNestedSpot: (rId, sId) => {
        window.MarlonStorage.excludeSpotFromRoute(rId, sId);
        updateMarkerStates();
        renderItinerary();
      },
      onChangeRouteDay: (rId, day) => {
        window.MarlonStorage.setRouteDay(rId, day);
        renderItinerary();
      },
      onChangeSpotDay: (sId, day) => {
        window.MarlonStorage.setSpotDay(sId, day);
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

  // ALWAYS-VISIBLE RECOMMENDED TOUR CARD ENGINE
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

  // RENDER FEATURED PACKAGES TAB
  function renderFeaturedPackages() {
    if (!featuredView) return;
    const presets = window.MARLON_ROUTES_PRESETS || [];
    const savedRoutesMap = window.MarlonStorage.getSavedRoutesMap();

    const existingList = featuredView.querySelector('.featured-preset-list');
    const savedScrollPos = existingList ? existingList.scrollTop : 0;

    featuredView.innerHTML = `
      <div class="featured-feed-header">
        <span class="featured-feed-title">🎯 EXPLORE WITH MARLON & ERNESTO</span>
        <span class="featured-feed-subtitle">Click a card to frame map pins, or add to your trip:</span>
      </div>

      <div class="featured-preset-list">
        ${presets.map(p => {
          const isImported = !!savedRoutesMap[p.id];
          const isSelected = activeSelectedRouteId === p.id;
          return `
            <div class="featured-preset-card ${isImported ? 'is-imported' : ''} ${isSelected ? 'is-selected' : ''}" data-preset="${p.id}">
              <div class="featured-card-main-row">
                <div class="featured-preset-info">
                  <div class="featured-preset-title">${p.title}</div>
                  <div class="featured-preset-meta">${p.duration}</div>
                  <div class="featured-preset-desc">${p.description || ''}</div>
                </div>
                <button type="button" class="featured-import-btn ${isImported ? 'is-active' : ''}" data-preset="${p.id}">
                  ${isImported ? '📌 Added' : '📌 Add'}
                </button>
              </div>

              <details class="featured-preview-details">
                <summary class="featured-preview-summary">▼ View Included Spots (${p.spotTitles.length})</summary>
                <div class="featured-preview-list">
                  ${p.spotTitles.map(t => `<div class="featured-preview-item">📍 ${t}</div>`).join('')}
                </div>
              </details>
            </div>
          `;
        }).join('')}
      </div>
    `;

    const newList = featuredView.querySelector('.featured-preset-list');
    if (newList) newList.scrollTop = savedScrollPos;

    featuredView.querySelectorAll('.featured-import-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pId = btn.dataset.preset;
        window.MarlonStorage.toggleRouteBlock(pId, window.MarlonItineraryView.activeDay === 'All' || window.MarlonItineraryView.activeDay === 'Popular' ? 'Day 1' : window.MarlonItineraryView.activeDay);
        updateMarkerStates();
        renderFeaturedPackages();
      });
    });

    featuredView.querySelectorAll('.featured-preset-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.closest('.featured-import-btn') || e.target.closest('.featured-preview-details')) return;
        const pId = card.dataset.preset;

        if (activeSelectedRouteId === pId) {
          activeSelectedRouteId = null;
          applyFilters();
        } else {
          activeSelectedRouteId = pId;
          panToRouteOnMap(pId);
        }
        renderFeaturedPackages();
      });
    });

    applyFilters();
  }

  // BUILD ALL LA FILTERS TAB
  let activeArea = 'All';
  const activeCategories = new Set();
  let activeTag = 'All';

  if (allLaView) {
    const headerIntro = document.createElement('div');
    headerIntro.className = 'featured-feed-header';
    headerIntro.innerHTML = `
      <span class="featured-feed-title">🌐 EXPLORE ALL LOCATIONS</span>
      <span class="featured-feed-subtitle">Filter by category, vibe, or neighborhood to curate your route:</span>
    `;
    allLaView.appendChild(headerIntro);

    const catGroup = document.createElement('div');
    catGroup.className = 'dashboard-group';

    const catLabel = document.createElement('div');
    catLabel.className = 'dashboard-label';
    catLabel.innerText = '🏷️ CATEGORIES';
    catGroup.appendChild(catLabel);

    const catPillsBar = document.createElement('div');
    catPillsBar.className = 'category-pills-bar stacked';

    Array.from(categories).sort().forEach(cat => {
      const pill = document.createElement('div');
      pill.className = 'cat-pill';
      pill.dataset.category = cat;
      const catDetails = window.MarlonSpotCard ? window.MarlonSpotCard.getCategoryDetails(cat, '', categoryMap, defaultPinSvg) : { color: '#3898ec', name: cat };
      pill.innerHTML = `<span class="cat-dot" style="background-color:${catDetails.color}"></span>${catDetails.name}`; 
      catPillsBar.appendChild(pill);
    });

    catGroup.appendChild(catPillsBar);
    allLaView.appendChild(catGroup); 

    catPillsBar.addEventListener('click', (e) => {
      e.preventDefault();
      const pill = e.target.closest('.cat-pill');
      if (!pill) return;
      const cat = pill.dataset.category;

      if (activeCategories.has(cat)) {
        activeCategories.delete(cat);
        pill.classList.remove('is-active');
      } else {
        activeCategories.add(cat);
        pill.classList.add('is-active');
      }
      applyFilters();
    });

    let tagSelect = null;
    if (tagsSet.size > 0) {
      const tagGroup = document.createElement('div');
      tagGroup.className = 'dashboard-group';

      const tagLabel = document.createElement('div');
      tagLabel.className = 'dashboard-label';
      tagLabel.innerText = '✨ VIBE';
      tagGroup.appendChild(tagLabel);

      tagSelect = document.createElement('select');
      tagSelect.innerHTML = `<option value="All">All Vibes</option>`;
      Array.from(tagsSet).sort().forEach(tagVal => {
        tagSelect.innerHTML += `<option value="${tagVal}">${formatTagDisplay(tagVal)}</option>`;
      });

      tagGroup.appendChild(tagSelect);
      allLaView.appendChild(tagGroup);

      tagSelect.addEventListener('change', (e) => {
        activeTag = e.target.value;
        applyFilters();
      });
    }

    const areaGroup = document.createElement('div');
    areaGroup.className = 'dashboard-group';

    const areaLabel = document.createElement('div');
    areaLabel.className = 'dashboard-label';
    areaLabel.innerText = '📍 NEIGHBORHOODS';
    areaGroup.appendChild(areaLabel);

    const areaSelect = document.createElement('select');
    areaSelect.innerHTML = `<option value="All">All LA Neighborhoods</option>`;
    Array.from(neighborhoods).sort().forEach(area => {
      areaSelect.innerHTML += `<option value="${area}">${area}</option>`;
    });

    areaGroup.appendChild(areaSelect);
    allLaView.appendChild(areaGroup); 

    areaSelect.addEventListener('change', (e) => {
      activeArea = e.target.value;
      applyFilters();
    });

    const resetContainer = document.createElement('div');
    resetContainer.style.display = 'flex';
    resetContainer.style.justifyContent = 'center';
    resetContainer.style.width = '100%';

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'reset-filters-btn';
    resetBtn.innerHTML = '↺ Reset Filters';

    resetContainer.appendChild(resetBtn);
    allLaView.appendChild(resetContainer);

    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      activeArea = 'All';
      activeTag = 'All';
      activeCategories.clear();

      if (areaSelect) areaSelect.value = 'All';
      if (tagSelect) tagSelect.value = 'All';

      catPillsBar.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('is-active'));
      applyFilters();
    });
  }

  function applyFilters() {
    if (activeTab === 'trip') return;

    const bounds = new mapboxgl.LngLatBounds();
    let visibleCount = 0;

    const featuredPresets = window.MARLON_ROUTES_PRESETS || [];
    const featuredTitles = featuredPresets.flatMap(p => p.spotTitles.map(t => t.toLowerCase().trim()));

    allMarkers.forEach(item => {
      const cleanTitle = item.title.toLowerCase().trim();
      const isFeaturedSpot = featuredTitles.some(t => cleanTitle.includes(t) || t.includes(cleanTitle));

      const matchesScope = (activeTab === 'all') || isFeaturedSpot;
      const matchesArea = (activeArea === 'All') || (item.neighborhood === activeArea);
      const matchesCategory = (activeCategories.size === 0) || activeCategories.has(item.category);
      const matchesTag = (activeTag === 'All') || item.tags.includes(activeTag);

      if (matchesScope && matchesArea && matchesCategory && matchesTag) {
        item.marker.addTo(map);
        bounds.extend([item.lng, item.lat]);
        visibleCount++;
      } else {
        item.marker.remove();
      }
    });

    const isFiltered = (activeTab !== 'all') || (activeArea !== 'All') || (activeCategories.size > 0) || (activeTag !== 'All');

    if (!isFiltered) {
      map.flyTo({ center: dtlaCenter, zoom: 10.2, duration: 1200, speed: 0.8 });
    } else if (visibleCount >= 1) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 13.0, duration: 1400 });
    } else {
      map.flyTo({ center: dtlaCenter, zoom: 10.2, duration: 1200, speed: 0.8 });
    }
  }

  // PROCESS GEOJSON FEATURES
  geojsonData.features.forEach((feature, index) => {
    const props = feature.properties || {};
    const coords = feature.geometry ? feature.geometry.coordinates : null;
    if (!coords || coords.length < 2) return;

    const lng = parseFloat(coords[0]);
    const lat = parseFloat(coords[1]);
    
    if (isNaN(lat) || isNaN(lng)) return;

    const spotId = cleanText(props.Slug || props.Item_ID || props.Name || `spot-${index}`).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const title = cleanText(props.Name || props.title || props.name || 'Location');
    const desc = cleanText(props.Description || props.description || props.desc || '');
    const rawCategory = cleanText(props.Category || props.category || 'landmarks');
    const customColor = cleanText(props.Color || props.color || props['Pin Color'] || '');
    const neighborhood = cleanText(props.City || props.city || props.neighborhood || 'Downtown LA');
    const rawTagsStr = cleanText(props.Tags || props.tags || '');

    const marlonNote = cleanText(props.Note || props.MarlonNote || props.PersonalNote || props.tip || '');
    const spotImage = cleanText(props.Image || props.Photo || props.image_url || '');
    const instagramUrl = cleanText(props.Instagram || props.instagram_url || '');
    const tiktokUrl = cleanText(props.TikTok || props.tiktok_url || '');

    const catDetails = window.MarlonSpotCard ? window.MarlonSpotCard.getCategoryDetails(rawCategory, customColor, categoryMap, defaultPinSvg) : { color: '#3898ec', icon: defaultPinSvg, name: 'Spot' };

    if (neighborhood) neighborhoods.add(neighborhood);
    if (rawCategory) categories.add(rawCategory);

    let parsedTags = [];
    if (rawTagsStr) {
      rawTagsStr.split(/[,;]/).forEach(t => {
        const cleanTag = t.replace(/^#/, '').trim();
        if (cleanTag) parsedTags.push(cleanTag);
      });
    }
    parsedTags = [...new Set(parsedTags)];
    parsedTags.forEach(t => tagsSet.add(t));

    const wrapper = document.createElement('div');
    wrapper.className = 'marker-wrapper';

    const inner = document.createElement('div');
    inner.className = 'custom-emoji-marker';
    inner.style.backgroundColor = catDetails.color;
    inner.innerHTML = catDetails.icon;

    wrapper.appendChild(inner);

    const marker = new mapboxgl.Marker({ element: wrapper })
      .setLngLat([lng, lat]);

    const spotData = {
      id: spotId,
      title: title,
      desc: desc,
      category: rawCategory,
      customColor: customColor,
      neighborhood: neighborhood,
      tags: parsedTags,
      marlonNote: marlonNote,
      spotImage: spotImage,
      instagramUrl: instagramUrl,
      tiktokUrl: tiktokUrl,
      wrapper: wrapper,
      marker: marker,
      lng: lng,
      lat: lat
    };

    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();

      if (window.MarlonSpotCard) {
        showSpotDetailsView();
        window.MarlonSpotCard.render(spotData, spotDetailsView, {
          onBack: () => switchTab(activeTab),
          onToggleSave: (sId) => {
            window.MarlonStorage.toggleSavedSpot(sId, window.MarlonItineraryView.activeDay === 'All' || window.MarlonItineraryView.activeDay === 'Popular' ? 'Day 1' : window.MarlonItineraryView.activeDay);
            updateMarkerStates();
            renderFeaturedPackages();
          },
          onToggleVisited: (sId) => {
            window.MarlonStorage.toggleVisitedSpot(sId);
            updateMarkerStates();
          }
        }, categoryMap, defaultPinSvg);
      }

      const currentZoom = map.getZoom();
      const targetZoom = Math.max(currentZoom, 12.0);

      map.flyTo({ 
        center: [lng, lat], 
        zoom: targetZoom, 
        duration: 1200,
        speed: 0.8,
        curve: 1.2,
        essential: true
      });
    });

    allMarkers.push(spotData);
  });

  map.on('click', () => {
    if (topHeaderView.style.display === 'none') {
      switchTab(activeTab);
    }
  });

  // INITIALIZE TOP HEADER
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

    scopeAllBtn = document.type = 'button';
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
    renderFeaturedPackages();
    switchTab('trip');
  });
};
