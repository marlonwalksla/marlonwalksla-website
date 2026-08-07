/* ==============================================================================
 * FILE: map-core.js
 * CATEGORY: MarlonWalksLA Website - Core Mapbox Orchestrator & Mobile Sheet Handler
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
    if (window.innerWidth <= 820) map.setPadding({ bottom: 260 });
    else map.setPadding({ bottom: 0 });
  }
  window.addEventListener('resize', () => { map.resize(); updateMapPadding(); });

  const defaultPinSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

  // CATEGORY MAP WITH UNIQUE COLORS & SVG ICONS
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
  let searchWrapper = null, hotelAnchorBox = null, topHeaderView = null;
  let searchView = null, tripView = null, passportView = null, routesView = null;
  let scopeSearchBtn = null, scopeTripBtn = null, scopePassportBtn = null, scopeRoutesBtn = null;
  let activeTab = 'trip';
  let activePopup = null; 

  if (form) {
    const filterBarParent = form.closest('.filter-bar');
    if (filterBarParent) filterBarParent.classList.add('is-collapsed');
    form.addEventListener('submit', (e) => { e.preventDefault(); e.stopPropagation(); return false; });
    form.innerHTML = '';

    const dragHandle = document.createElement('button'); 
    dragHandle.className = 'mobile-drag-handle'; 
    dragHandle.innerHTML = '↑'; 
    form.appendChild(dragHandle);

    dragHandle.addEventListener('click', (e) => { 
      e.preventDefault(); 
      if (filterBarParent) { 
        const isExpanded = filterBarParent.classList.contains('is-expanded');
        if (isExpanded) {
          filterBarParent.classList.remove('is-expanded'); 
          filterBarParent.classList.add('is-collapsed');
          dragHandle.innerHTML = '↑';
        } else {
          filterBarParent.classList.remove('is-collapsed'); 
          filterBarParent.classList.add('is-expanded');
          dragHandle.innerHTML = '↓';
        }
      } 
    });

    map.on('click', (e) => {
      if (window.innerWidth <= 820 && filterBarParent && filterBarParent.classList.contains('is-expanded')) {
        filterBarParent.classList.remove('is-expanded');
        filterBarParent.classList.add('is-collapsed');
        dragHandle.innerHTML = '↑';
      }
    });

    searchWrapper = document.createElement('div'); searchWrapper.className = 'map-search-wrapper';
    searchWrapper.innerHTML = `<input type="text" class="map-search-input" placeholder="🔍 Search 102 spots, hotels, locations..." /><div class="search-results-dropdown"></div>`;
    hotelAnchorBox = document.createElement('div'); hotelAnchorBox.className = 'hotel-anchor-box';

    topHeaderView = document.createElement('div'); topHeaderView.id = 'top-header-view';
    searchView = document.createElement('div'); searchView.id = 'search-view'; searchView.style.display = 'none';
    tripView = document.createElement('div'); tripView.id = 'trip-view'; tripView.style.display = 'flex'; tripView.style.flexDirection = 'column';
    passportView = document.createElement('div'); passportView.id = 'passport-view'; passportView.style.display = 'none';

    form.appendChild(topHeaderView);
    form.appendChild(searchView);
    form.appendChild(tripView);
    form.appendChild(passportView);
  }

  function updateMarkerStates() {
    const savedSpotIds = window.MarlonStorage.getSavedSpotIds();
    const visitedIds = window.MarlonStorage.getVisitedSpots();
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

    searchView.style.display = 'none';
    tripView.style.display = 'none';
    passportView.style.display = 'none';
    if (routesView) routesView.style.display = 'none';

    if (targetTab === 'search') {
      searchView.style.display = 'flex';
      if (window.MarlonSearchView) {
        window.MarlonSearchView.render(
          searchView, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, 
          () => window.MarlonSearchView.applyFilters(allMarkers, map, dtlaCenter)
        );
      }
    } else if (targetTab === 'trip') {
      tripView.style.display = 'flex';
      renderItinerary();
    } else if (targetTab === 'passport') {
      passportView.style.display = 'block';
      if (window.MarlonPassport) window.MarlonPassport.render(passportView, hotelAnchorBox, () => { switchTab('search'); setTimeout(() => searchWrapper.querySelector('.map-search-input').focus(), 100); });
    } else if (targetTab === 'routes') {
      if (routesView) routesView.style.display = 'block';
      if (window.MarlonRoutesView) {
        window.MarlonRoutesView.render(routesView, {
          onImportRoute: () => { updateMarkerStates(); renderItinerary(); switchTab('trip'); },
          onPanToRoute: (pId) => { 
            const preset = (window.MARLON_ROUTES_PRESETS || []).find(p => p.id === pId); 
            if (preset) { 
              const bounds = new mapboxgl.LngLatBounds(); 
              preset.spotTitles.forEach(t => { 
                const match = allMarkers.find(m => m.title.toLowerCase().includes(t.toLowerCase())); 
                if (match) bounds.extend([match.lng, match.lat]); 
              }); 
              map.fitBounds(bounds, { maxZoom: 13.5 }); 
            } 
          }
        });
      }
    }
    map.resize();
  }

  function renderItinerary() {
    if(window.MarlonItineraryView) {
      window.MarlonItineraryView.renderItinerary(tripView, allMarkers, {
        onClearDay: () => { window.MarlonStorage.clearItinerary(); updateMarkerStates(); renderItinerary(); },
        onRemoveSpot: (sId) => { window.MarlonStorage.toggleSavedSpot(sId); updateMarkerStates(); renderItinerary(); },
        onToggleVisited: (sId) => { window.MarlonStorage.toggleVisitedSpot(sId); updateMarkerStates(); renderItinerary(); },
        onSpotClick: (sId) => { const match = allMarkers.find(m => m.id === sId); if (match) match.wrapper.click(); }
      });
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

    // Get color & icon from categoryMap or fallback
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
      map.flyTo({ center: [lng, lat], zoom: 13.5 });
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
    scopeToggleWrap.style.overflowX = 'auto';
    scopeToggleWrap.style.justifyContent = 'flex-start';
    
    scopeSearchBtn = document.createElement('button'); scopeSearchBtn.type = 'button'; scopeSearchBtn.className = 'scope-toggle-btn'; scopeSearchBtn.innerText = `🔍 Search`;
    scopeTripBtn = document.createElement('button'); scopeTripBtn.type = 'button'; scopeTripBtn.className = 'scope-toggle-btn trip-tab-btn is-active'; scopeTripBtn.innerText = `📋 Trip`;
    scopePassportBtn = document.createElement('button'); scopePassportBtn.type = 'button'; scopePassportBtn.className = 'scope-toggle-btn'; scopePassportBtn.innerText = `🪅 Passport`;
    
    // NEW ROUTES BUTTON
    scopeRoutesBtn = document.createElement('button'); scopeRoutesBtn.type = 'button'; scopeRoutesBtn.className = 'scope-toggle-btn'; scopeRoutesBtn.innerText = `🛣️ Routes`;
    
    scopeSearchBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('search'); });
    scopeTripBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('trip'); });
    scopePassportBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('passport'); });
    scopeRoutesBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('routes'); });

    scopeToggleWrap.appendChild(scopeSearchBtn); 
    scopeToggleWrap.appendChild(scopeTripBtn); 
    scopeToggleWrap.appendChild(scopePassportBtn);
    scopeToggleWrap.appendChild(scopeRoutesBtn);
    
    // Append only the tabs to the header
    mainTitleHeader.appendChild(scopeToggleWrap); 
    topHeaderView.appendChild(mainTitleHeader);

    // Create the Routes Container
    routesView = document.createElement('div'); routesView.id = 'routes-view'; routesView.style.display = 'none';
    form.appendChild(routesView);
  }

  if (window.MarlonSearch) {
    window.MarlonSearch.init(searchWrapper, map, allMarkers, dtlaCenter, {
      onSelectSpot: (spotId) => { window.MarlonStorage.toggleSavedSpot(spotId, 'All'); updateMarkerStates(); if(activeTab === 'trip') renderItinerary(); },
      onSelectHotel: (hotelObj) => { window.MarlonStorage.setHotel(hotelObj); if (window.MarlonHotel) window.MarlonHotel.renderMarker(map); if (window.MarlonHotel) window.MarlonHotel.updateUI(hotelAnchorBox, () => { switchTab('search'); setTimeout(() => searchWrapper.querySelector('.map-search-input').focus(), 100); }); map.flyTo({ center: [hotelObj.lng, hotelObj.lat], zoom: 13.5 }); }
    });
  }
  if (window.MarlonHotel) window.MarlonHotel.updateUI(hotelAnchorBox, () => { switchTab('search'); setTimeout(() => searchWrapper.querySelector('.map-search-input').focus(), 100); });

  map.on('load', () => { 
    updateMapPadding();
    if (window.MarlonHotel) window.MarlonHotel.renderMarker(map); 
    updateMarkerStates(); 
    switchTab('trip'); 
  });
};
