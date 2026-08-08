/* ==============================================================================
 * FILE: map-core.js
 * CATEGORY: MarlonWalksLA Website - Core Mapbox Orchestrator
 * ============================================================================== */

window.initMapEngine = async function() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  mapboxgl.accessToken = 'pk.eyJ1IjoibWFybG9ud2Fsa3NsYSIsImEiOiJjbXM5YWhuOGIwbGVjMzRwbTZ0b2I2emZlIn0.UgW7MpYibACH6Axk1WgoSA';
  const dtlaCenter = [-118.2437, 34.0522];

  const map = new mapboxgl.Map({ container: 'map', style: 'mapbox://styles/mapbox/streets-v12', center: dtlaCenter, zoom: 10.2 });
  window.marlonMapInstance = map;

  const geolocate = new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true, showUserHeading: true });
  map.addControl(geolocate, 'top-right');

  function updateMapPadding() {
    if (window.innerWidth <= 820) map.setPadding({ top: 10, bottom: 20, left: 10, right: 10 });
    else map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });
  }
  window.addEventListener('resize', () => { map.resize(); updateMapPadding(); });

  const defaultPinSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

  const categoryMap = {
    'landmarks': { color: '#ef4444', name: 'Landmarks', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h6M9 14h6M9 18h6"/></svg>' },
    'arts': { color: '#a855f7', name: 'Arts & Culture', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>' },
    'dining': { color: '#f59e0b', name: 'Dining & Food', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8v13M14 8v13M10 8v13M6 8v13M6 3v5M18 3v5"/></svg>' },
    'entertainment': { color: '#ec4899', name: 'Entertainment', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>' },
    'nightlife': { color: '#6366f1', name: 'Nightlife', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' },
    'parks': { color: '#10b981', name: 'Parks & Nature', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 22h20L12 2z"/></svg>' },
    'shopping': { color: '#06b6d4', name: 'Shopping', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>' }
  };

  function cleanText(str) { return str ? String(str).replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim() : ''; }

  let geojsonData = null;
  try {
    let res = await fetch('https://raw.githack.com/marlonwalksla/marlonwalksla-website/main/spots.geojson');
    if (!res.ok) res = await fetch('https://raw.githack.com/marlonwalksla/marlonwalksla-website/main/MarlonWalksLA%20-%20Maps%20(102).geojson');
    if (res.ok) geojsonData = await res.json();
  } catch (err) { console.error('Failed to load GeoJSON dataset:', err); }

  if (!geojsonData || !geojsonData.features) return;

  const allMarkers = [];
  window.MARLON_ALL_MARKERS = allMarkers;
  const neighborhoods = new Set();
  const categories = new Set();
  const tagsSet = new Set();

  const form = document.querySelector('.filter-bar form');
  let searchWrapper = null, topHeaderView = null;
  let searchView = null, tripView = null, passportView = null, routesView = null;
  let scopeSearchBtn = null, scopeTripBtn = null, scopePassportBtn = null, scopeRoutesBtn = null;
  let activeTab = 'search';
  let activePopup = null; 

  const callbacks = {
    onSelectSpot: function (spotId) {
      const match = allMarkers.find(m => m.id === spotId);
      if (match && match.wrapper) match.wrapper.click();
    },
    onRemoveSpot: function (spotId) {
      if (window.MarlonStorage) window.MarlonStorage.removeSavedSpot(spotId);
      updateMarkerStates();
      renderItinerary();
    },
    onClearDay: function (dayName) {
      if (window.MarlonStorage) window.MarlonStorage.clearDay(dayName);
      updateMarkerStates();
      renderItinerary();
    },
    onToggleVisited: function (spotId) {
      if (window.MarlonStorage) window.MarlonStorage.toggleVisitedSpot(spotId);
      updateMarkerStates();
      renderItinerary();
    },
    onImportPreset: function (presetKey) {
      if (window.MarlonStorage && window.MARLON_ROUTES_PRESETS) {
        const preset = window.MARLON_ROUTES_PRESETS.find(p => p.id === presetKey || p.key === presetKey);
        if (preset) {
          window.MarlonStorage.saveRouteBlock(preset.id, 'Day 1');
          switchTab('trip');
        }
      }
    }
  };

  if (form) {
    form.addEventListener('submit', (e) => { e.preventDefault(); e.stopPropagation(); return false; });
    form.innerHTML = '';

    searchWrapper = document.createElement('div'); searchWrapper.className = 'map-search-wrapper';
    searchWrapper.innerHTML = `<input type="text" class="map-search-input" placeholder="🔍 Search 102 spots, hotels, locations..." /><div class="search-results-dropdown"></div>`;

    topHeaderView = document.createElement('div'); topHeaderView.id = 'top-header-view';
    searchView = document.createElement('div'); searchView.id = 'search-view'; searchView.className = 'view-is-hidden';
    tripView = document.createElement('div'); tripView.id = 'trip-view'; tripView.className = 'view-is-hidden';
    passportView = document.createElement('div'); passportView.id = 'passport-view'; passportView.className = 'view-is-hidden';
    routesView = document.createElement('div'); routesView.id = 'routes-view'; routesView.className = 'view-is-hidden';

    form.appendChild(topHeaderView);
    form.appendChild(searchView);
    form.appendChild(tripView);
    form.appendChild(passportView);
    form.appendChild(routesView);
  }

  function updateMarkerStates() {
    const savedSpotIds = window.MarlonStorage ? window.MarlonStorage.getSavedSpotIds() : [];
    const visitedIds = window.MarlonStorage ? window.MarlonStorage.getVisitedSpots() : [];
    allMarkers.forEach(m => {
      if (visitedIds.includes(m.id)) { m.wrapper.classList.add('is-visited-pin'); m.wrapper.classList.remove('is-pinned-ring'); }
      else if (savedSpotIds.includes(m.id)) { m.wrapper.classList.add('is-pinned-ring'); m.wrapper.classList.remove('is-visited-pin'); }
      else { m.wrapper.classList.remove('is-visited-pin'); m.wrapper.classList.remove('is-pinned-ring'); }
    });
  }

  function switchTab(targetTab) {
    activeTab = targetTab;
    
    if (scopeSearchBtn) scopeSearchBtn.classList.toggle('is-active', targetTab === 'search');
    if (scopeTripBtn) scopeTripBtn.classList.toggle('is-active', targetTab === 'trip');
    if (scopePassportBtn) scopePassportBtn.classList.toggle('is-active', targetTab === 'passport');
    if (scopeRoutesBtn) scopeRoutesBtn.classList.toggle('is-active', targetTab === 'routes');

    const views = [searchView, tripView, passportView, routesView];
    views.forEach(v => {
      if (v) { v.classList.remove('view-is-active'); v.classList.add('view-is-hidden'); }
    });

    if (targetTab === 'search' && searchView) {
      searchView.classList.remove('view-is-hidden');
      searchView.classList.add('view-is-active');
      if (window.MarlonSearchView) {
        window.MarlonSearchView.render(
          searchView, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, 
          () => window.MarlonSearchView.applyFilters(allMarkers, map, dtlaCenter)
        );
      }
    } else if (targetTab === 'trip' && tripView) {
      tripView.classList.remove('view-is-hidden');
      tripView.classList.add('view-is-active');
      renderItinerary();
    } else if (targetTab === 'passport' && passportView) {
      passportView.classList.remove('view-is-hidden');
      passportView.classList.add('view-is-active');
      if (window.MarlonPassportView) window.MarlonPassportView.render(passportView, allMarkers, callbacks);
    } else if (targetTab === 'routes' && routesView) {
      routesView.classList.remove('view-is-hidden');
      routesView.classList.add('view-is-active');
      if (window.MarlonRoutesView) {
        const allPresets = window.MARLON_ROUTES_PRESETS || [];
        window.MarlonRoutesView.render(routesView, allPresets, callbacks);
      }
    }
    if (map) map.resize();
  }

  function initDefaultTab() {
    const savedSpots = window.MarlonStorage ? window.MarlonStorage.getSavedSpotIds() : [];
    const savedRoutes = window.MarlonStorage ? window.MarlonStorage.getSavedRoutesMap() : {};

    const hasSavedSpots = Array.isArray(savedSpots) && savedSpots.length > 0;
    const hasSavedRoutes = savedRoutes && Object.keys(savedRoutes).length > 0;

    const initialTab = (hasSavedSpots || hasSavedRoutes) ? 'trip' : 'search';
    switchTab(initialTab);
  }

  function renderItinerary() {
    if (window.MarlonItineraryView && tripView) {
      window.MarlonItineraryView.renderItinerary(tripView, allMarkers, callbacks);
    }
  }

  geojsonData.features.forEach((feature, index) => {
    const props = feature.properties || {};
    const coords = feature.geometry ? feature.geometry.coordinates : null;
    if (!coords || coords.length < 2) return;

    const lng = parseFloat(coords[0]), lat = parseFloat(coords[1]);
    const spotId = cleanText(props.Slug || props.Item_ID || props.Name || `spot-${index}`).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const title = cleanText(props.Name || props.title || props.name || 'Location');
    const rawCategory = cleanText(props.Category || props.category || 'landmarks').toLowerCase();
    const customColor = cleanText(props.Color || props.color || '');
    const neighborhood = cleanText(props.City || props.city || 'Downtown LA');
    const rawTagsStr = cleanText(props.Tags || props.tags || '');

    const catLookup = categoryMap[rawCategory] || (window.MarlonSpotCard ? window.MarlonSpotCard.getCategoryDetails(rawCategory, customColor, categoryMap, defaultPinSvg) : null);
    const catDetails = catLookup || { color: customColor || '#ef4444', icon: defaultPinSvg, name: rawCategory };

    if (neighborhood) neighborhoods.add(neighborhood);
    if (rawCategory) categories.add(rawCategory);
    if (rawTagsStr) rawTagsStr.split(/[,;]/).forEach(t => { const cleanTag = t.replace(/^#/, '').trim(); if (cleanTag) tagsSet.add(cleanTag); });

    const wrapper = document.createElement('div'); wrapper.className = 'marker-wrapper';
    const inner = document.createElement('div'); inner.className = 'custom-emoji-marker';
    inner.style.backgroundColor = catDetails.color; inner.innerHTML = catDetails.icon;
    wrapper.appendChild(inner);

    const marker = new mapboxgl.Marker({ element: wrapper }).setLngLat([lng, lat]).addTo(map);
    
    const spotData = { id: spotId, title: title, desc: cleanText(props.Description || ''), category: rawCategory, neighborhood: neighborhood, wrapper: wrapper, marker: marker, lng: lng, lat: lat, customColor: customColor, tags: Array.from(tagsSet) };
    
    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      map.flyTo({ center: [lng, lat], zoom: 13.5, padding: { top: 10, bottom: window.innerWidth <= 820 ? 40 : 0, left: 10, right: 10 } });
      if (activePopup) activePopup.remove();
      if (window.MarlonSpotCard) {
        const popupContainer = document.createElement('div');
        window.MarlonSpotCard.render(spotData, popupContainer, {
          onBack: () => { if(activePopup) activePopup.remove(); },
          onToggleSave: (id) => { window.MarlonStorage.toggleSavedSpot(id); updateMarkerStates(); if(activeTab === 'trip') renderItinerary(); },
          onToggleVisited: (id) => { window.MarlonStorage.toggleVisitedSpot(id); updateMarkerStates(); if(activeTab === 'trip') renderItinerary(); }
        }, categoryMap, defaultPinSvg);
        activePopup = new mapboxgl.Popup({ offset: 25, closeOnClick: true, focusAfterOpen: false })
          .setLngLat([lng, lat])
          .setDOMContent(popupContainer)
          .addTo(map);
      }
    });
    allMarkers.push(spotData);
  });

  if (topHeaderView) {
    const mainTitleHeader = document.createElement('div'); mainTitleHeader.className = 'map-hero-cta-box';
    mainTitleHeader.style.marginTop = '0'; mainTitleHeader.style.paddingTop = '0';
        
    const scopeToggleWrap = document.createElement('div'); scopeToggleWrap.className = 'scope-toggle-wrap tri-tab';
    
    scopeSearchBtn = document.createElement('button'); scopeSearchBtn.type = 'button'; scopeSearchBtn.className = 'scope-toggle-btn'; scopeSearchBtn.innerText = `🔍 Search`;
    scopeTripBtn = document.createElement('button'); scopeTripBtn.type = 'button'; scopeTripBtn.className = 'scope-toggle-btn trip-tab-btn'; scopeTripBtn.innerText = `📋 Trip`;
    scopePassportBtn = document.createElement('button'); scopePassportBtn.type = 'button'; scopePassportBtn.className = 'scope-toggle-btn'; scopePassportBtn.innerText = `🪅 Passport`;
    scopeRoutesBtn = document.createElement('button'); scopeRoutesBtn.type = 'button'; scopeRoutesBtn.className = 'scope-toggle-btn'; scopeRoutesBtn.innerText = `🛣️ Routes`;
    
    scopeSearchBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('search'); });
    scopeTripBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('trip'); });
    scopePassportBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('passport'); });
    scopeRoutesBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('routes'); });

    scopeToggleWrap.appendChild(scopeSearchBtn); 
    scopeToggleWrap.appendChild(scopeTripBtn); 
    scopeToggleWrap.appendChild(scopePassportBtn);
    scopeToggleWrap.appendChild(scopeRoutesBtn);
    
    mainTitleHeader.appendChild(scopeToggleWrap); 
    topHeaderView.appendChild(mainTitleHeader);
  }

  if (window.MarlonSearch) {
    window.MarlonSearch.init(searchWrapper, map, allMarkers, dtlaCenter, callbacks);
  }

  map.on('load', () => { 
    updateMapPadding();
    if (window.MarlonHotel) window.MarlonHotel.renderMarker(map);
    updateMarkerStates(); 
    initDefaultTab(); 
  });
};
