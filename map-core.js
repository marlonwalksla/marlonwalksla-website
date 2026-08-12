/* ==============================================================================
 * FILE: map-core.js
 * CATEGORY: MarlonWalksLA Website - Core Mapbox Orchestrator & Smart Cluster Engine
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
  let currentActiveCount = geojsonData.features.length;

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
   * 6. CLUSTER SYNCHRONIZATION (< 10 SHOWS ALL PINS)
   * ========================================================= */
  function updateClusterVisibility() {
    if (!map.getSource('spots')) return;

    if (currentActiveCount < 10) {
      if (map.getLayer('clusters')) {
        map.setLayoutProperty('clusters', 'visibility', 'none');
        map.setLayoutProperty('cluster-count', 'visibility', 'none');
      }
      allMarkers.forEach(m => {
        m.wrapper.style.display = m.isFilteredActive ? 'block' : 'none';
      });
      return;
    }

    if (map.getLayer('clusters')) {
      map.setLayoutProperty('clusters', 'visibility', 'visible');
      map.setLayoutProperty('cluster-count', 'visibility', 'visible');
    }

    const unclusteredFeatures = map.queryRenderedFeatures({ layers: ['unclustered-helper'] });
    const unclusteredIds = new Set(unclusteredFeatures.map(f => {
      const p = f.properties || {};
      return (p.Slug || p.Item_ID || p.Name || f.id || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }));

    allMarkers.forEach(m => {
      if (m.isFilteredActive && unclusteredIds.has(m.id)) {
        m.wrapper.style.display = 'block';
      } else {
        m.wrapper.style.display = 'none';
      }
    });
  }

  window.updateMapMarkers = function(filteredSpots) {
    if (!allMarkers || !map || !map.getSource('spots')) return;

    currentActiveCount = filteredSpots.length;

    const activeIds = new Set(filteredSpots.map(s => {
      const p = s.properties || {};
      return (p.Slug || p.Item_ID || p.Name || s.id || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }));

    allMarkers.forEach(markerObj => {
      markerObj.isFilteredActive = activeIds.has(markerObj.id);
    });

    const filteredGeoJson = {
      type: 'FeatureCollection',
      features: filteredSpots
    };
    map.getSource('spots').setData(filteredGeoJson);

    if (filteredSpots.length > 0 && activeIds.size < allMarkers.length) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredSpots.forEach(s => {
        const coords = s.geometry ? s.geometry.coordinates : [s.lng, s.lat];
        if (coords && coords.length >= 2) bounds.extend([parseFloat(coords[0]), parseFloat(coords[1])]);
      });

      const isMobile = window.innerWidth <= 820;
      map.fitBounds(bounds, {
        padding: isMobile ? { top: 120, bottom: 30, left: 20, right: 20 } : { top: 160, bottom: 50, left: 40, right: 40 },
        maxZoom: 13.5,
        duration: 750
      });
    } else if (activeIds.size === 0 || activeIds.size === allMarkers.length) {
      map.flyTo({ center: dtlaCenter, zoom: 10.2, duration: 750 });
    }

    setTimeout(updateClusterVisibility, 150);
  };

  /* =========================================================
   * 7. MARKER GENERATION & OFFSET PIN POSITION FOR HEADROOM
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
      isFilteredActive: true,
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

      // Generous top padding shifts the pin down so the popup card fits comfortably above it
      map.flyTo({ 
        center: [lng, lat], 
        zoom: 14.0,
        padding: isMobile 
          ? { top: 140, bottom: 20, left: 10, right: 10 } 
          : { top: 180, bottom: 30, left: 30, right: 30 },
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
   * 8. MAP CLUSTER SOURCE & LAYER REGISTRATION
   * ========================================================= */
  map.on('load', () => {
    map.resize();

    map.addSource('spots', {
      type: 'geojson',
      data: geojsonData,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 45
    });

    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'spots',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#2563eb',
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          16, 5,
          20, 15,
          26
        ],
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.92
      }
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'spots',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 13
      },
      paint: {
        'text-color': '#ffffff'
      }
    });

    map.addLayer({
      id: 'unclustered-helper',
      type: 'circle',
      source: 'spots',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-radius': 0,
        'circle-opacity': 0
      }
    });

    map.on('click', 'clusters', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const clusterId = features[0].properties.cluster_id;
      map.getSource('spots').getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom + 0.5,
          duration: 600
        });
      });
    });

    map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = ''; });

    map.on('move', updateClusterVisibility);
    map.on('moveend', updateClusterVisibility);

    if (window.MarlonHotel) window.MarlonHotel.renderMarker(map);
    updateMarkerStates();
    updateClusterVisibility();
  });

  /* =========================================================
   * 9. SAFE BOOTSTRAP
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
};
