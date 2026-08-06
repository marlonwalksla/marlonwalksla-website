/* ==============================================================================
 * FILE: map-core.js
 * CATEGORY: MarlonWalksLA Website - Core Mapbox Orchestrator & Mobile Sheet Handler
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
  window.marlonMapInstance = map;

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
  const tagsSet = new Set();

  // UI CONTAINER SETUP & PREVENT WEBFLOW SUBMIT
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
    const filterBarParent = form.closest('.filter-bar');
    if (filterBarParent) filterBarParent.classList.add('is-collapsed');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });

    form.innerHTML = '';

    // Mobile Drag Handle with Toggle Click Listener
    const dragHandle = document.createElement('div');
    dragHandle.className = 'mobile-drag-handle';
    form.appendChild(dragHandle);

    dragHandle.addEventListener('click', (e) => {
      e.preventDefault();
      if (filterBarParent) {
        filterBarParent.classList.toggle('is-expanded');
        filterBarParent.classList.toggle('is-collapsed');
      }
    });

    searchWrapper = document.createElement('div');
    searchWrapper.className = 'map-search-wrapper';
    searchWrapper.innerHTML = `
      <input type="text" class="map-search-input" placeholder="🔍 Search 102 spots, hotels, locations..." />
      <div class="search-results-dropdown"></div>
    `;
    form.appendChild(searchWrapper);

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
      if (window.MarlonFeaturedView) {
        window.MarlonFeaturedView.render(featuredView, allMarkers, {
          onImportRoute: () => { updateMarkerStates(); renderItinerary(); },
          onPanToRoute: (pId) => {
            const preset = (window.MARLON_ROUTES_PRESETS || []).find(p => p.id === pId);
            if (preset) {
              const bounds = new mapboxgl.LngLatBounds();
              preset.spotTitles.forEach(t => {
                const match = allMarkers.find(m => m.title.toLowerCase().includes(t.toLowerCase()));
                if (match) bounds.extend([match.lng, match.lat]);
              });
              map.fitBounds(bounds, { padding: 60, maxZoom: 13.5 });
            }
          },
          onResetRoutePan: () => map.flyTo({ center: dtlaCenter, zoom: 10.2 })
        });
      }
    } else if (targetTab === 'all') {
      featuredView.style.display = 'none';
      allLaView.style.display = 'flex';
      listCardView.style.display = 'none';
      // FIX FOR ALL LA PINS NOT SHOWING
      if (window.MarlonAllLaView) {
        window.MarlonAllLaView.applyFilters(allMarkers, map, dtlaCenter);
      }
    } else if (targetTab === 'trip') {
      featuredView.style.display = 'none';
      allLaView.style.display = 'none';
      listCardView.style.display = 'flex';
      renderItinerary();
    }
    map.resize();
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

    if (window.MarlonUpsell) window.MarlonUpsell.renderCard(listCardView, allMarkers);
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
    const rawTagsStr = cleanText(props.Tags || props.tags || '');

    const catDetails = window.MarlonSpotCard ? window.MarlonSpotCard.getCategoryDetails(rawCategory, customColor, categoryMap, defaultPinSvg) : { color: '#3898ec', icon: defaultPinSvg, name: 'Spot' };

    if (neighborhood) neighborhoods.add(neighborhood);
    if (rawCategory) categories.add(rawCategory);

    if (rawTagsStr) {
      rawTagsStr.split(/[,;]/).forEach(t => {
        const cleanTag = t.replace(/^#/, '').trim();
        if (cleanTag) tagsSet.add(cleanTag);
      });
    }

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

  // BUILD HEADER SWITCHER
  if (topHeaderView) {
    const mainTitleHeader = document.createElement('div');
    mainTitleHeader.className = 'map-hero-cta-box';

    const titleText = document.createElement('h2');
    titleText.className = 'map-hero-cta-title';
    titleText.innerText = "Your LA Story";

    const scopeToggleWrap = document.createElement('div');
    scopeToggleWrap.className = 'scope-toggle-wrap tri-tab';

    scopeFeaturedBtn = document.createElement('button');
    scopeFeaturedBtn.type = 'button'; scopeFeaturedBtn.className = 'scope-toggle-btn';

    scopeAllBtn = document.createElement('button');
    scopeAllBtn.type = 'button'; scopeAllBtn.className = 'scope-toggle-btn';

    scopeTripBtn = document.createElement('button');
    scopeTripBtn.type = 'button'; scopeTripBtn.className = 'scope-toggle-btn trip-tab-btn is-active';

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

  // INITIALIZE SUB-MODULES
  if (window.MarlonSearch) {
    window.MarlonSearch.init(searchWrapper, map, allMarkers, dtlaCenter, {
      onSelectSpot: (spotId) => {
        window.MarlonStorage.toggleSavedSpot(spotId, 'Day 1');
        updateMarkerStates();
        renderItinerary();
      },
      onSelectHotel: (hotelObj) => {
        window.MarlonStorage.setHotel(hotelObj);
        if (window.MarlonHotel) window.MarlonHotel.renderMarker(map);
        if (window.MarlonHotel) window.MarlonHotel.updateUI(hotelAnchorBox, () => searchWrapper.querySelector('.map-search-input').focus());
        map.flyTo({ center: [hotelObj.lng, hotelObj.lat], zoom: 13.5 });
      }
    });
  }

  if (window.MarlonHotel) {
    window.MarlonHotel.updateUI(hotelAnchorBox, () => searchWrapper.querySelector('.map-search-input').focus());
  }

  if (window.MarlonAllLaView) {
    window.MarlonAllLaView.render(allLaView, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, () => {
      window.MarlonAllLaView.applyFilters(allMarkers, map, dtlaCenter);
    });
  }

  map.on('load', () => {
    if (window.MarlonHotel) window.MarlonHotel.renderMarker(map);
    updateMarkerStates();
    switchTab('trip');
  });
};
