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
  const categoryMap = { /* Keep your existing categoryMap object here */ };

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
  let searchView = null, tripView = null, passportView = null;
  let scopeSearchBtn = null, scopeTripBtn = null, scopePassportBtn = null;
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

    // Close bottom sheet when tapping anywhere on the map
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

    searchView.style.display = 'none';
    tripView.style.display = 'none';
    passportView.style.display = 'none';

    if (targetTab === 'search') {
      searchView.style.display = 'flex';
      if (window.MarlonAllLaView) {
        window.MarlonAllLaView.render(
          searchView, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, searchWrapper, 
          () => window.MarlonAllLaView.applyFilters(allMarkers, map, dtlaCenter),
          {
            onImportRoute: () => { updateMarkerStates(); renderItinerary(); },
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
          }
        );
      }
    } else if (targetTab === 'trip') {
      tripView.style.display = 'flex';
      renderItinerary();
    } else if (targetTab === 'passport') {
      passportView.style.display = 'block';
      if (window.MarlonPassport) window.MarlonPassport.render(passportView, hotelAnchorBox, () => { switchTab('search'); setTimeout(() => searchWrapper.querySelector('.map-search-input').focus(), 100); });
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
    const rawCategory = cleanText(props.Category || props.category || 'landmarks');
    const customColor = cleanText(props.Color || props.color || '');
    const neighborhood = cleanText(props.City || props.city || 'Downtown LA');
    const rawTagsStr = cleanText(props.Tags || props.tags || '');

    const catDetails = window.MarlonSpotCard ? window.MarlonSpotCard.getCategoryDetails(rawCategory, customColor, categoryMap, defaultPinSvg) : { color: '#3898ec', icon: defaultPinSvg, name: 'Spot' };

    if (neighborhood) neighborhoods.add(neighborhood);
    if (rawCategory) categories.add(rawCategory);
    if (rawTagsStr) rawTagsStr.split(/[,;]/).forEach(t => { const cleanTag = t.replace(/^#/, '').trim(); if (cleanTag) tagsSet.add(cleanTag); });

    const wrapper = document.createElement('div'); wrapper.className = 'marker-wrapper';
    const inner = document.createElement('div'); inner.className = 'custom-emoji-marker';
    inner.style.backgroundColor = catDetails.color; inner.innerHTML = catDetails.icon;
    wrapper.appendChild(inner);

    const marker = new mapboxgl.Marker({ element: wrapper }).setLngLat([lng, lat]);
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
    
    const titleText = document.createElement('h2'); titleText.className = 'map-hero-cta-title'; 
    titleText.innerText = "Build Your LA Trip";
    titleText.style.marginTop = '0';
    
    const scopeToggleWrap = document.createElement('div'); scopeToggleWrap.className = 'scope-toggle-wrap tri-tab';
    scopeToggleWrap.style.overflowX = 'auto';
    scopeToggleWrap.style.justifyContent = 'flex-start';
    
    scopeSearchBtn = document.createElement('button'); scopeSearchBtn.type = 'button'; scopeSearchBtn.className = 'scope-toggle-btn'; scopeSearchBtn.innerText = `🔍 Search`;
    scopeTripBtn = document.createElement('button'); scopeTripBtn.type = 'button'; scopeTripBtn.className = 'scope-toggle-btn trip-tab-btn is-active'; scopeTripBtn.innerText = `📋 Trip`;
    scopePassportBtn = document.createElement('button'); scopePassportBtn.type = 'button'; scopePassportBtn.className = 'scope-toggle-btn'; scopePassportBtn.innerText = `🪅 Passport`;
    
    scopeSearchBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('search'); });
    scopeTripBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('trip'); });
    scopePassportBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('passport'); });

    scopeToggleWrap.appendChild(scopeSearchBtn); 
    scopeToggleWrap.appendChild(scopeTripBtn); 
    scopeToggleWrap.appendChild(scopePassportBtn);
    mainTitleHeader.appendChild(titleText); mainTitleHeader.appendChild(scopeToggleWrap); topHeaderView.appendChild(mainTitleHeader);
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
