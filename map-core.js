/* ==============================================================================
 * FILE: map-core.js
 * CATEGORY: MarlonWalksLA Website - Explore Los Angeles Core Engine
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

  let geojsonData = null;
  const primaryUrl = 'https://raw.githack.com/marlonwalksla/marlonwalksla-website/main/spots.geojson';
  const fallbackUrl = 'https://raw.githack.com/marlonwalksla/marlonwalksla-website/main/MarlonWalksLA%20-%20Maps%20(102).geojson';

  try {
    let res = await fetch(primaryUrl);
    if (!res.ok) res = await fetch(fallbackUrl);
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

  const form = document.querySelector('.filter-bar form');
  let topHeaderView = null;
  let marlonToursView = null;
  let featuredSpotsView = null;
  let allLaView = null;
  let visitedView = null;
  let spotDetailsView = null;
  let listCardView = null;

  let tabMarlonBtn = null;
  let tabFeaturedBtn = null;
  let tabAllBtn = null;
  let tabVisitedBtn = null;
  let tabTripBtn = null;

  let featuredSpotFeedEl = null;
  let activeTab = 'marlon'; 
  let activeSelectedRouteId = null;

  if (form) {
    form.innerHTML = '';

    topHeaderView = document.createElement('div');
    topHeaderView.id = 'top-header-view';
    topHeaderView.style.width = '100%';

    marlonToursView = document.createElement('div');
    marlonToursView.id = 'marlon-tours-view';
    marlonToursView.style.display = 'flex';
    marlonToursView.style.flexDirection = 'column';
    marlonToursView.style.gap = '10px';
    marlonToursView.style.width = '100%';

    featuredSpotsView = document.createElement('div');
    featuredSpotsView.id = 'featured-spots-view';
    featuredSpotsView.style.display = 'none';
    featuredSpotsView.style.flexDirection = 'column';
    featuredSpotsView.style.gap = '10px';
    featuredSpotsView.style.width = '100%';

    allLaView = document.createElement('div');
    allLaView.id = 'all-la-view';
    allLaView.style.display = 'none';
    allLaView.style.flexDirection = 'column';
    allLaView.style.gap = '10px';
    allLaView.style.width = '100%';

    visitedView = document.createElement('div');
    visitedView.id = 'visited-view';
    visitedView.style.display = 'none';
    visitedView.style.flexDirection = 'column';
    visitedView.style.gap = '10px';
    visitedView.style.width = '100%';

    spotDetailsView = document.createElement('div');
    spotDetailsView.id = 'spot-details-view';
    spotDetailsView.style.display = 'none';
    spotDetailsView.style.width = '100%';

    listCardView = document.createElement('div');
    listCardView.id = 'list-card-view';
    listCardView.style.display = 'none';
    listCardView.style.flexDirection = 'column';
    listCardView.style.gap = '10px';
    listCardView.style.width = '100%';

    form.appendChild(topHeaderView);
    form.appendChild(marlonToursView);
    form.appendChild(featuredSpotsView);
    form.appendChild(allLaView);
    form.appendChild(visitedView);
    form.appendChild(listCardView);
    form.appendChild(spotDetailsView);
  }

  function updateTabCounts() {
    const tripCount = window.MarlonStorage.getSavedSpotIds().length;
    const visitedCount = window.MarlonStorage.getVisitedSpots().length;

    if (tabMarlonBtn) tabMarlonBtn.innerText = `🚶‍♂️ MarlonWalksLA`;
    if (tabFeaturedBtn) tabFeaturedBtn.innerText = `✨ Featured Spots`;
    if (tabAllBtn) tabAllBtn.innerText = `🌐 All LA`;
    if (tabVisitedBtn) tabVisitedBtn.innerText = `✅ Visited (${visitedCount})`;
    if (tabTripBtn) tabTripBtn.innerText = `📋 Your Trip (${tripCount})`;
  }

  function switchTab(targetTab) {
    activeTab = targetTab;
    topHeaderView.style.display = 'block';
    spotDetailsView.style.display = 'none';

    if (tabMarlonBtn) tabMarlonBtn.classList.toggle('is-active', targetTab === 'marlon');
    if (tabFeaturedBtn) tabFeaturedBtn.classList.toggle('is-active', targetTab === 'featured-spots');
    if (tabAllBtn) tabAllBtn.classList.toggle('is-active', targetTab === 'all');
    if (tabVisitedBtn) tabVisitedBtn.classList.toggle('is-active', targetTab === 'visited');
    if (tabTripBtn) tabTripBtn.classList.toggle('is-active', targetTab === 'trip');

    marlonToursView.style.display = targetTab === 'marlon' ? 'flex' : 'none';
    featuredSpotsView.style.display = targetTab === 'featured-spots' ? 'flex' : 'none';
    allLaView.style.display = targetTab === 'all' ? 'flex' : 'none';
    visitedView.style.display = targetTab === 'visited' ? 'flex' : 'none';
    listCardView.style.display = targetTab === 'trip' ? 'block' : 'none';

    if (targetTab === 'trip') {
      renderItinerary();
    } else if (targetTab === 'visited') {
      renderVisitedFeed();
    } else {
      applyFilters();
    }
    map.resize();
  }

  function showSpotDetailsView() {
    topHeaderView.style.display = 'none';
    marlonToursView.style.display = 'none';
    featuredSpotsView.style.display = 'none';
    allLaView.style.display = 'none';
    visitedView.style.display = 'none';
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

        Object.keys(savedRoutesMap).forEach(rId => {
          if (savedRoutesMap[rId] === dayToClear) {
            window.MarlonStorage.toggleRouteBlock(rId);
          }
        });

        Object.keys(itinMap).forEach(sId => {
          if (itinMap[sId] === dayToClear) {
            window.MarlonStorage.toggleSavedSpot(sId);
          }
        });

        updateMarkerStates();
        renderItinerary();
        renderMarlonTours();
      },
      onRemoveRoute: (rId) => {
        window.MarlonStorage.toggleRouteBlock(rId);
        updateMarkerStates();
        renderItinerary();
        renderMarlonTours();
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

    const activeDay = window.MarlonItineraryView.activeDay;
    const itinMap = window.MarlonStorage.getItineraryMap();
    const savedRoutesMap = window.MarlonStorage.getSavedRoutesMap();
    const allPresets = window.MARLON_ROUTES_PRESETS || [];

    let activeSpotIds = Object.keys(itinMap).filter(sId => (itinMap[sId] || 'Unassigned') === activeDay);
    const activeRouteIds = Object.keys(savedRoutesMap).filter(rId => (savedRoutesMap[rId] || 'Unassigned') === activeDay);

    activeRouteIds.forEach(rId => {
      const p = allPresets.find(item => item.id === rId);
      if (p) {
        p.spotTitles.forEach(t => {
          const cleanT = t.toLowerCase().trim();
          const match = allMarkers.find(m => m.title.toLowerCase().includes(cleanT) || cleanT.includes(m.title.toLowerCase()));
          if (match && !activeSpotIds.includes(match.id) && !window.MarlonStorage.isSpotExcludedFromRoute(rId, match.id)) {
            activeSpotIds.push(match.id);
          }
        });
      }
    });

    applyModeMapFilter(activeSpotIds);
  }

  function renderVisitedFeed() {
    const visitedIds = window.MarlonStorage.getVisitedSpots();
    const visitedSpots = allMarkers.filter(m => visitedIds.includes(m.id));

    visitedView.innerHTML = `
      <div class="featured-feed-header">
        <span class="featured-feed-title">✅ VISITED PASSPORT (${visitedSpots.length})</span>
      </div>
      <div class="featured-spot-feed-container" style="max-height: 380px;">
        ${visitedSpots.length === 0 ? '<p class="empty-itinerary-msg">No locations checked off yet. Mark places as visited as you explore!</p>' : ''}
        ${visitedSpots.map(s => `
          <div class="spot-feed-card" data-id="${s.id}">
            <div class="spot-feed-info">
              <div class="spot-feed-title">${s.title}</div>
              <div class="spot-feed-meta">📍 ${s.neighborhood}</div>
            </div>
            <button type="button" class="spot-feed-save-btn is-active" data-id="${s.id}">
              ✅ Visited
            </button>
          </div>
        `).join('')}
      </div>
    `;

    visitedView.querySelectorAll('.spot-feed-save-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.MarlonStorage.toggleVisitedSpot(btn.dataset.id);
        updateMarkerStates();
        renderVisitedFeed();
      });
    });

    visitedView.querySelectorAll('.spot-feed-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.spot-feed-save-btn')) return;
        const match = allMarkers.find(m => m.id === card.dataset.id);
        if (match) match.wrapper.click();
      });
    });

    applyModeMapFilter(visitedIds);
  }

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
            window.MarlonStorage.toggleSavedSpot(sId, window.MarlonItineraryView.activeDay);
            updateMarkerStates();
            renderMarlonTours();
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

  // 5-TAB HEADER BAR
  if (topHeaderView) {
    const mainTitleHeader = document.createElement('div');
    mainTitleHeader.className = 'map-hero-cta-box';

    const titleText = document.createElement('h2');
    titleText.className = 'map-hero-cta-title';
    titleText.innerText = "Explore Los Angeles";

    const scopeToggleWrap = document.createElement('div');
    scopeToggleWrap.className = 'scope-toggle-wrap tri-tab multi-tab-bar';

    tabMarlonBtn = document.createElement('button');
    tabMarlonBtn.type = 'button';
    tabMarlonBtn.className = 'scope-toggle-btn is-active';

    tabFeaturedBtn = document.createElement('button');
    tabFeaturedBtn.type = 'button';
    tabFeaturedBtn.className = 'scope-toggle-btn';

    tabAllBtn = document.createElement('button');
    tabAllBtn.type = 'button';
    tabAllBtn.className = 'scope-toggle-btn';

    tabVisitedBtn = document.createElement('button');
    tabVisitedBtn.type = 'button';
    tabVisitedBtn.className = 'scope-toggle-btn';

    tabTripBtn = document.createElement('button');
    tabTripBtn.type = 'button';
    tabTripBtn.className = 'scope-toggle-btn trip-tab-btn';

    updateTabCounts();

    tabMarlonBtn.addEventListener('click', () => switchTab('marlon'));
    tabFeaturedBtn.addEventListener('click', () => switchTab('featured-spots'));
    tabAllBtn.addEventListener('click', () => switchTab('all'));
    tabVisitedBtn.addEventListener('click', () => switchTab('visited'));
    tabTripBtn.addEventListener('click', () => switchTab('trip'));

    scopeToggleWrap.appendChild(tabMarlonBtn);
    scopeToggleWrap.appendChild(tabFeaturedBtn);
    scopeToggleWrap.appendChild(tabAllBtn);
    scopeToggleWrap.appendChild(tabVisitedBtn);
    scopeToggleWrap.appendChild(tabTripBtn);

    mainTitleHeader.appendChild(titleText);
    mainTitleHeader.appendChild(scopeToggleWrap);

    topHeaderView.appendChild(mainTitleHeader);

    const divider = document.createElement('hr');
    divider.className = 'filter-section-divider';
    topHeaderView.appendChild(divider);
  }

  // TAB 1: MARLONWALKSLA GUIDED WALKS
  function renderMarlonTours() {
    if (!marlonToursView) return;
    const presets = window.MARLON_ROUTES_PRESETS || [];
    const savedRoutesMap = window.MarlonStorage.getSavedRoutesMap();

    marlonToursView.innerHTML = `
      <div class="featured-feed-header">
        <span class="featured-feed-title">🚶‍♂️ MARLONWALKSLA TOURS</span>
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

    marlonToursView.querySelectorAll('.featured-import-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pId = btn.dataset.preset;
        window.MarlonStorage.toggleRouteBlock(pId, window.MarlonItineraryView.activeDay);
        updateMarkerStates();
        renderMarlonTours();
      });
    });

    marlonToursView.querySelectorAll('.featured-preset-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.featured-import-btn') || e.target.closest('.featured-preview-details')) return;
        const pId = card.dataset.preset;

        if (activeSelectedRouteId === pId) {
          activeSelectedRouteId = null;
          applyFilters();
        } else {
          activeSelectedRouteId = pId;
          panToRouteOnMap(pId);
        }
        renderMarlonTours();
      });
    });
  }

  // TAB 2: FEATURED SPOTS
  if (featuredSpotsView) {
    featuredSpotsView.innerHTML = `
      <div class="featured-feed-header">
        <span class="featured-feed-title">✨ FEATURED LOCATIONS</span>
      </div>
      <div class="featured-spot-feed-container" style="max-height: 380px;"></div>
    `;
    featuredSpotFeedEl = featuredSpotsView.querySelector('.featured-spot-feed-container');
  }

  // TAB 3: ALL LA FILTERS
  let activeArea = 'All';
  const activeCategories = new Set();
  let activeTag = 'All';

  if (allLaView) {
    const headerIntro = document.createElement('div');
    headerIntro.className = 'featured-feed-header';
    headerIntro.innerHTML = `<span class="featured-feed-title">🌐 ALL LOCATIONS</span>`;
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

    resetBtn.addEventListener('click', () => {
      activeArea = 'All';
      activeTag = 'All';
      activeCategories.clear();

      if (areaSelect) areaSelect.value = 'All';
      if (tagSelect) tagSelect.value = 'All';

      catPillsBar.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('is-active'));
      applyFilters();
    });
  }

  function renderSpotFeed(targetContainer, visibleSpots) {
    if (!targetContainer) return;
    const savedSpotIds = window.MarlonStorage.getSavedSpotIds();

    targetContainer.innerHTML = visibleSpots.map(spot => {
      const isSaved = savedSpotIds.includes(spot.id);
      return `
        <div class="spot-feed-card" data-id="${spot.id}">
          <div class="spot-feed-info">
            <div class="spot-feed-title">${spot.title}</div>
            <div class="spot-feed-meta">📍 ${spot.neighborhood}</div>
          </div>
          <button type="button" class="spot-feed-save-btn ${isSaved ? 'is-active' : ''}" data-id="${spot.id}">
            ${isSaved ? '📌 Saved' : '📌 Save'}
          </button>
        </div>
      `;
    }).join('');

    targetContainer.querySelectorAll('.spot-feed-save-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.MarlonStorage.toggleSavedSpot(btn.dataset.id, window.MarlonItineraryView.activeDay);
        updateMarkerStates();
        applyFilters();
      });
    });

    targetContainer.querySelectorAll('.spot-feed-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.spot-feed-save-btn')) return;
        const match = allMarkers.find(m => m.id === card.dataset.id);
        if (match) match.wrapper.click();
      });
    });
  }

  function applyFilters() {
    if (activeTab === 'trip' || activeTab === 'visited') return;

    const bounds = new mapboxgl.LngLatBounds();
    let visibleCount = 0;
    const visibleSpots = [];

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
        visibleSpots.push(item);
      } else {
        item.marker.remove();
      }
    });

    if (activeTab === 'featured-spots') {
      renderSpotFeed(featuredSpotFeedEl, visibleSpots);
    }

    const isFiltered = (activeTab !== 'all') || (activeArea !== 'All') || (activeCategories.size > 0) || (activeTag !== 'All');

    if (!isFiltered) {
      map.flyTo({ center: dtlaCenter, zoom: 10.2, duration: 1200, speed: 0.8 });
    } else if (visibleCount >= 1) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 13.0, duration: 1400 });
    } else {
      map.flyTo({ center: dtlaCenter, zoom: 10.2, duration: 1200, speed: 0.8 });
    }
  }

  const startMapUI = () => {
    updateMarkerStates();
    renderMarlonTours();
    switchTab('marlon');
    map.resize();
  };

  if (map.loaded()) {
    startMapUI();
  } else {
    map.on('load', startMapUI);
  }
};
