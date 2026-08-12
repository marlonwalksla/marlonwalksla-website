/* ==============================================================================
 * FILE: map-core.js
 * CATEGORY: MarlonWalksLA Website - Core Mapbox Orchestrator & Marker Engine
 * ============================================================================== */

window.initMapEngine = async function() {
  /* =========================================================
   * 1. MAPBOX INITIALIZATION & SETUP
   * ========================================================= */
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
  map.addControl(geolocate, 'bottom-right');

  window.addEventListener('resize', () => { map.resize(); });
  setTimeout(() => { map.resize(); }, 100);
  setTimeout(() => { map.resize(); }, 500);

  /* =========================================================
   * 2. ICONS & CATEGORY DICTIONARY
   * ========================================================= */
  const defaultPinSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';

  const categoryMap = {
    food: { color: '#ef4444', name: 'Food & Dining', icon: defaultPinSvg },
    dining: { color: '#ef4444', name: 'Food & Dining', icon: defaultPinSvg },
    drinks: { color: '#8b5cf6', name: 'Bars & Cocktails', icon: defaultPinSvg },
    nightlife: { color: '#8b5cf6', name: 'Nightlife', icon: defaultPinSvg },
    arts: { color: '#3b82f6', name: 'Arts & Culture', icon: defaultPinSvg },
    culture: { color: '#3b82f6', name: 'Arts & Culture', icon: defaultPinSvg },
    landmarks: { color: '#f59e0b', name: 'Landmarks', icon: defaultPinSvg },
    shopping: { color: '#ec4899', name: 'Shopping', icon: defaultPinSvg },
    nature: { color: '#10b981', name: 'Parks & Nature', icon: defaultPinSvg },
    entertainment: { color: '#6366f1', name: 'Entertainment', icon: defaultPinSvg }
  };

  function cleanText(str) { 
    return str ? String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim() : ''; 
  }

  /* =========================================================
   * 3. DATA FETCHING (ASYNC)
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

    if (window.updateNavTabCounts) {
      window.updateNavTabCounts();
    }
  }

  window.updateMarlonMarkerStates = updateMarkerStates;

  /* =========================================================
   * 6. FILTER MARKERS & AUTO-FIT ALL ACTIVE PINS ON MAP
   * ========================================================= */
  window.updateMapMarkers = function(filteredSpots) {
    if (!allMarkers || !map) return;

    const activeIds = new Set(filteredSpots.map(s => {
      const p = s.properties || {};
      return (p.Slug || p.Item_ID || p.Name || s.id || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }));

    const bounds = new mapboxgl.LngLatBounds();
    let visibleCount = 0;

    allMarkers.forEach(markerObj => {
      if (markerObj.wrapper) {
        const isMatch = activeIds.has(markerObj.id);
        if (isMatch) {
          markerObj.wrapper.style.display = 'block';
          bounds.extend([markerObj.lng, markerObj.lat]);
          visibleCount++;
        } else {
          markerObj.wrapper.style.display = 'none';
        }
      }
    });

    if (visibleCount > 0 && activeIds.size > 0 && activeIds.size < allMarkers.length) {
      const isMobile = window.innerWidth <= 820;
      const paddingOptions = isMobile 
        ? { top: 35, bottom: 35, left: 25, right: 25 } 
        : { top: 50, bottom: 50, left: 40, right: 40 };

      // Dynamically fit ALL active pins inside the viewport
      map.fitBounds(bounds, {
        padding: paddingOptions,
        maxZoom: 14.0,
        duration: 750
      });
    } else if (activeIds.size === 0 || activeIds.size === allMarkers.length) {
      map.flyTo({ center: dtlaCenter, zoom: 10.2, duration: 750 });
    }
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
    wrapper.style.cursor = 'pointer';

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
      const currentZoom = map.getZoom();
      const targetZoom = Math.max(currentZoom, 13.5);

      map.flyTo({ 
        center: [lng, lat], 
        zoom: targetZoom,
        padding: { top: isMobile ? 240 : 30, bottom: 10, left: 10, right: 10 },
        duration: 750
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
   * 8. SAFE BOOTSTRAP
   * ========================================================= */
  const tripData = window.MarlonStorage ? window.MarlonStorage.getSavedTripData() : null;
  const savedMap = tripData ? (tripData.days || {}) : {};
  const hasSavedSpots = Object.keys(savedMap).length > 0;

  const modeExploreBtn = document.querySelector('[data-mode="explore"]');
  const modeMyTripBtn = document.querySelector('[data-mode="mytrip"]');
  const panelExplore = document.getElementById('panel-explore');
  const panelMyTrip = document.getElementById('panel-mytrip');

  if (hasSavedSpots) {
    if (modeMyTripBtn) modeMyTripBtn.classList.add('is-active');
    if (modeExploreBtn) modeExploreBtn.classList.remove('is-active');
    if (panelMyTrip) panelMyTrip.style.display = 'block';
    if (panelExplore) panelExplore.style.display = 'none';

    if (window.initExploreView) window.initExploreView(geojsonData);
    if (window.initMyTripView) window.initMyTripView(geojsonData.features);
  } else {
    if (modeExploreBtn) modeExploreBtn.classList.add('is-active');
    if (modeMyTripBtn) modeMyTripBtn.classList.remove('is-active');
    if (panelExplore) panelExplore.style.display = 'block';
    if (panelMyTrip) panelMyTrip.style.display = 'none';

    if (window.initExploreView) window.initExploreView(geojsonData);
    if (window.initMyTripView) window.initMyTripView(geojsonData.features);
  }

  map.on('load', () => { 
    map.resize();
    if (window.MarlonHotel) window.MarlonHotel.renderMarker(map);
    updateMarkerStates(); 
  });
};
