/* ==============================================================================
 * FILE: map-core.js
 * CATEGORY: MarlonWalksLA Website - Core Mapbox Orchestrator & Marker Engine
 * ============================================================================== */

window.initMapEngine = async function() {
  /* =========================================================
   * 1. MAPBOX INITIALIZATION & SETUP
   * ========================================================= */
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error("Map container #map not found in DOM");
    return;
  }

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

  window.addEventListener('resize', () => { map.resize(); });

  /* =========================================================
   * 2. ICONS & CATEGORY DICTIONARY
   * ========================================================= */
  const defaultPinSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';

  const categoryMap = {
    food: { color: '#ef4444', name: 'Food & Dining', icon: defaultPinSvg },
    drinks: { color: '#8b5cf6', name: 'Bars & Cocktails', icon: defaultPinSvg },
    culture: { color: '#3b82f6', name: 'Arts & Culture', icon: defaultPinSvg },
    landmarks: { color: '#f59e0b', name: 'Landmarks', icon: defaultPinSvg },
    shopping: { color: '#ec4899', name: 'Shopping', icon: defaultPinSvg },
    nature: { color: '#10b981', name: 'Parks & Nature', icon: defaultPinSvg }
  };

  function cleanText(str) { 
    return str ? String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim() : ''; 
  }

  /* =========================================================
   * 3. DATA FETCHING
   * ========================================================= */
  let geojsonData = null;
  try {
    let res = await fetch('https://raw.githack.com/marlonwalksla/marlonwalksla-website/main/spots.geojson');
    if (!res.ok) res = await fetch('https://raw.githack.com/marlonwalksla/marlonwalksla-website/main/MarlonWalksLA%20-%20Spots.geojson');
    if (res.ok) geojsonData = await res.json();
  } catch (err) { 
    console.error('Failed to load GeoJSON dataset:', err); 
  }

  if (!geojsonData || !geojsonData.features) return;

  window.marlonGeoData = geojsonData;

  /* =========================================================
   * 4. STATE VARIABLES & MARKER STORAGE
   * ========================================================= */
  const allMarkers = [];
  window.MARLON_ALL_MARKERS = allMarkers;
  let activePopup = null; 
  let activePopupSpotId = null;

  /* =========================================================
   * 5. MARKER STATE MANAGEMENT
   * ========================================================= */
  function updateMarkerStates() {
    const savedSpotIds = window.MarlonStorage ? window.MarlonStorage.getSavedSpotIds() : [];
    const visitedIds = window.MarlonStorage ? window.MarlonStorage.getVisitedSpots() : [];
    allMarkers.forEach(m => {
      if (visitedIds.includes(m.id)) { 
        m.wrapper.classList.add('is-visited-pin'); 
        m.wrapper.classList.remove('is-pinned-ring'); 
      } else if (savedSpotIds.includes(m.id)) { 
        m.wrapper.classList.add('is-pinned-ring'); 
        m.wrapper.classList.remove('is-visited-pin'); 
      } else { 
        m.wrapper.classList.remove('is-visited-pin'); 
        m.wrapper.classList.remove('is-pinned-ring'); 
      }
    });
  }

  window.updateMarlonMarkerStates = updateMarkerStates;

  /* =========================================================
   * 6. FILTER MARKERS ON MAP
   * ========================================================= */
  window.updateMapMarkers = function(filteredSpots) {
    if (!allMarkers) return;
    const activeIds = new Set(filteredSpots.map(s => s.id || (s.properties && s.properties.id)));

    allMarkers.forEach(markerObj => {
      if (markerObj.wrapper) {
        if (activeIds.size === 0 || activeIds.has(markerObj.id)) {
          markerObj.wrapper.style.display = 'block';
        } else {
          markerObj.wrapper.style.display = 'none';
        }
      }
    });
  };

  /* =========================================================
   * 7. MARKER GENERATION
   * ========================================================= */
  geojsonData.features.forEach((feature, index) => {
    const props = feature.properties || {};
    const coords = feature.geometry ? feature.geometry.coordinates : null;
    if (!coords || coords.length < 2) return;

    const lng = parseFloat(coords[0]), lat = parseFloat(coords[1]);
    const spotId = cleanText(props.Slug || props.Item_ID || props.Name || props.id || `spot-${index}`).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    props.id = spotId;

    const title = cleanText(props.Name || props.title || props.name || 'Location');
    const rawCategory = cleanText(props.Category || props.category || 'landmarks').toLowerCase();
    const customColor = cleanText(props.Color || props.color || '');
    const neighborhood = cleanText(props.City || props.city || props.neighborhood || 'Downtown LA');

    const catLookup = categoryMap[rawCategory] || (window.MarlonSpotCard ? window.MarlonSpotCard.getCategoryDetails(rawCategory, customColor, categoryMap, defaultPinSvg) : null);
    const catDetails = catLookup || { color: customColor || '#ef4444', icon: defaultPinSvg, name: rawCategory };

    const wrapper = document.createElement('div'); 
    wrapper.className = 'marker-wrapper';
    const inner = document.createElement('div'); 
    inner.className = 'custom-emoji-marker';
    inner.style.backgroundColor = catDetails.color; 
    inner.innerHTML = catDetails.icon;
    wrapper.appendChild(inner);

    const marker = new mapboxgl.Marker({ element: wrapper }).setLngLat([lng, lat]).addTo(map);
    
    const spotData = { 
      id: spotId, 
      title: title, 
      desc: cleanText(props.Description || props.description || ''), 
      category: rawCategory, 
      neighborhood: neighborhood, 
      wrapper: wrapper, 
      marker: marker, 
      lng: lng, 
      lat: lat, 
      customColor: customColor, 
      properties: props
    };

    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();

      if (activePopup && activePopupSpotId === spotId) {
        activePopup.remove();
        activePopup = null;
        activePopupSpotId = null;
        return;
      }

      const isMobile = window.innerWidth <= 820;
      
      map.flyTo({ 
        center: [lng, lat], 
        zoom: 13.5,
        padding: { top: isMobile ? 240 : 30, bottom: 10, left: 10, right: 10 }
      });

      if (activePopup) activePopup.remove();

      if (window.MarlonSpotCard) {
        const popupContainer = document.createElement('div');
        window.MarlonSpotCard.render(spotData, popupContainer, {
          onBack: () => { 
            if (activePopup) activePopup.remove(); 
            activePopup = null;
            activePopupSpotId = null;
          },
          onToggleSave: (id) => { 
            if (window.MarlonStorage) window.MarlonStorage.toggleSavedSpot(id); 
            updateMarkerStates(); 
          },
          onToggleVisited: (id) => { 
            if (window.MarlonStorage) window.MarlonStorage.toggleVisitedSpot(id); 
            updateMarkerStates(); 
          }
        }, categoryMap, defaultPinSvg);
        
        activePopup = new mapboxgl.Popup({ 
          offset: 25, 
          closeOnClick: true, 
          focusAfterOpen: false,
          anchor: 'bottom'
        })
          .setLngLat([lng, lat])
          .setDOMContent(popupContainer)
          .addTo(map);

        activePopupSpotId = spotId;

        activePopup.on('close', () => {
          activePopup = null;
          activePopupSpotId = null;
        });
      }
    });

    allMarkers.push(spotData);
  });

  /* =========================================================
   * 8. BOOTSTRAP UI VIEWS (EXPLORE LA & MY TRIP)
   * ========================================================= */
  if (window.initExploreView) {
    window.initExploreView(geojsonData);
  }
  if (window.initMyTripView) {
    window.initMyTripView(geojsonData.features);
  }

  map.on('load', () => { 
    if (window.MarlonHotel) window.MarlonHotel.renderMarker(map);
    updateMarkerStates(); 
  });
};
