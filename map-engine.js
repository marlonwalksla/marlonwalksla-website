/* ==============================================================================
 * FILE: map-engine.js
 * CATEGORY: MarlonWalksLA Website - Mapbox Engine & Saved Itinerary System
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

  window.addEventListener('resize', () => {
    map.resize();
  });

  // ITINERARY LOCAL STORAGE HELPERS
  function getSavedSpots() {
    return JSON.parse(localStorage.getItem('marlon_saved_spots') || '[]');
  }
  function getVisitedSpots() {
    return JSON.parse(localStorage.getItem('marlon_visited_spots') || '[]');
  }
  function toggleSavedSpot(id) {
    let saved = getSavedSpots();
    if (saved.includes(id)) {
      saved = saved.filter(item => item !== id);
    } else {
      saved.push(id);
    }
    localStorage.setItem('marlon_saved_spots', JSON.stringify(saved));
    updateItineraryBadge();
  }
  function toggleVisitedSpot(id) {
    let visited = getVisitedSpots();
    if (visited.includes(id)) {
      visited = visited.filter(item => item !== id);
    } else {
      visited.push(id);
    }
    localStorage.setItem('marlon_visited_spots', JSON.stringify(visited));
    updateItineraryBadge();
  }

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

  function getCategoryDetails(rawCat, overrideColor) {
    if (!rawCat) return { color: overrideColor || '#3898ec', icon: defaultPinSvg, name: 'Spot' };
    const key = String(rawCat).toLowerCase().replace(/&amp;/g, 'and').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    let details = categoryMap[key];
    if (!details) {
      const matchedKey = Object.keys(categoryMap).find(k => key.includes(k) || k.includes(key));
      details = matchedKey ? categoryMap[matchedKey] : { color: overrideColor || '#3898ec', icon: defaultPinSvg, name: rawCat };
    }
    if (overrideColor && overrideColor.trim() !== '' && overrideColor !== '#222222' && !categoryMap[key]) {
      details = { ...details, color: overrideColor };
    }
    return details;
  }

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

  // 1. FETCH GEOJSON DATA
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
  const neighborhoods = new Set();
  const categories = new Set();
  const tagsSet = new Set();
  const coordTracker = {};

  // UI VIEWS
  const form = document.querySelector('.filter-bar form');
  let filterControlsView = null;
  let spotDetailsView = null;
  let itineraryView = null;
  let itineraryBadgeBtn = null;

  if (form) {
    form.innerHTML = '';
    
    filterControlsView = document.createElement('div');
    filterControlsView.id = 'filter-controls-view';
    filterControlsView.style.display = 'flex';
    filterControlsView.style.flexDirection = 'column';
    filterControlsView.style.gap = '12px';
    filterControlsView.style.width = '100%';

    spotDetailsView = document.createElement('div');
    spotDetailsView.id = 'spot-details-view';
    spotDetailsView.style.display = 'none';
    spotDetailsView.style.width = '100%';

    itineraryView = document.createElement('div');
    itineraryView.id = 'itinerary-view';
    itineraryView.style.display = 'none';
    itineraryView.style.width = '100%';

    form.appendChild(filterControlsView);
    form.appendChild(spotDetailsView);
    form.appendChild(itineraryView);
  }

  function showFilterControlsView() {
    if (!filterControlsView || !spotDetailsView || !itineraryView) return;
    spotDetailsView.style.display = 'none';
    itineraryView.style.display = 'none';
    filterControlsView.style.display = 'flex';
    map.resize();
  }

  function showSpotDetailsView(htmlContent, spotId, spotTitle) {
    if (!filterControlsView || !spotDetailsView || !itineraryView) return;
    spotDetailsView.innerHTML = htmlContent;
    filterControlsView.style.display = 'none';
    itineraryView.style.display = 'none';
    spotDetailsView.style.display = 'block';

    const backBtn = spotDetailsView.querySelector('.back-to-filters-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        showFilterControlsView();
      });
    }

    // Attach Toggle Listener for Saved & Visited
    const saveBtn = spotDetailsView.querySelector('.toggle-save-btn');
    const visitedBtn = spotDetailsView.querySelector('.toggle-visited-btn');

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        toggleSavedSpot(spotId);
        const isSaved = getSavedSpots().includes(spotId);
        saveBtn.classList.toggle('is-active', isSaved);
        saveBtn.innerText = isSaved ? '📌 Saved to Itinerary' : '📌 Save to Itinerary';
      });
    }

    if (visitedBtn) {
      visitedBtn.addEventListener('click', () => {
        toggleVisitedSpot(spotId);
        const isVisited = getVisitedSpots().includes(spotId);
        visitedBtn.classList.toggle('is-active', isVisited);
        visitedBtn.innerText = isVisited ? '✅ Visited!' : '✅ Mark as Visited';
      });
    }

    map.resize();
  }

  function renderItineraryView() {
    if (!itineraryView) return;
    const savedIds = getSavedSpots();
    const visitedIds = getVisitedSpots();

    const savedMarkers = allMarkers.filter(m => savedIds.includes(m.id));
    const visitedMarkers = allMarkers.filter(m => visitedIds.includes(m.id));

    let html = `
      <div class="itinerary-card">
        <div class="itinerary-header">
          <button type="button" class="back-to-filters-btn">‹ Back</button>
          <div class="itinerary-title">📋 My LA Trip</div>
        </div>
        
        <div class="itinerary-section">
          <h4 class="itinerary-sub-title">📌 Saved Spots (${savedMarkers.length})</h4>
          ${savedMarkers.length === 0 ? '<p class="empty-itinerary-msg">No spots saved yet. Click 📌 Save on any location to build your day!</p>' : ''}
          <div class="itinerary-list">
            ${savedMarkers.map(m => `
              <div class="itinerary-item" data-id="${m.id}">
                <div>
                  <div class="itinerary-item-name">${m.title}</div>
                  <div class="itinerary-item-meta">📍 ${m.neighborhood}</div>
                </div>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}" target="_blank" class="mini-dir-btn">🚗</a>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="itinerary-section" style="margin-top: 14px;">
          <h4 class="itinerary-sub-title">✅ Completed / Visited (${visitedMarkers.length})</h4>
          <div class="itinerary-list">
            ${visitedMarkers.map(m => `
              <div class="itinerary-item is-visited" data-id="${m.id}">
                <div class="itinerary-item-name">${m.title}</div>
                <span class="visited-check">✓</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    itineraryView.innerHTML = html;
    filterControlsView.style.display = 'none';
    spotDetailsView.style.display = 'none';
    itineraryView.style.display = 'block';

    const backBtn = itineraryView.querySelector('.back-to-filters-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        showFilterControlsView();
      });
    }

    map.resize();
  }

  function updateItineraryBadge() {
    if (!itineraryBadgeBtn) return;
    const count = getSavedSpots().length;
    itineraryBadgeBtn.innerText = `📋 My Itinerary (${count})`;
  }

  // 2. PROCESS GEOJSON FEATURES
  geojsonData.features.forEach((feature, index) => {
    const props = feature.properties || {};
    const coords = feature.geometry ? feature.geometry.coordinates : null;
    if (!coords || coords.length < 2) return;

    let lng = parseFloat(coords[0]);
    let lat = parseFloat(coords[1]);
    
    if (isNaN(lat) || isNaN(lng)) return;

    const spotId = cleanText(props.Slug || props.Item_ID || props.Name || `spot-${index}`).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const title = cleanText(props.Name || props.title || props.name || 'Location');
    const desc = cleanText(props.Description || props.description || props.desc || '');
    const rawCategory = cleanText(props.Category || props.category || 'landmarks');
    const customColor = cleanText(props.Color || props.color || props['Pin Color'] || '');
    const neighborhood = cleanText(props.City || props.city || props.neighborhood || 'Downtown LA');
    const rawTagsStr = cleanText(props.Tags || props.tags || '');

    const catDetails = getCategoryDetails(rawCategory, customColor);

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

    const coordKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
    coordTracker[coordKey] = (coordTracker[coordKey] || 0) + 1;
    if (coordTracker[coordKey] > 1) {
      const overlapIndex = coordTracker[coordKey] - 1;
      const angle = overlapIndex * (2 * Math.PI / 8);
      const offsetRadius = 0.0012 * Math.ceil(overlapIndex / 8);
      lat += offsetRadius * Math.cos(angle);
      lng += offsetRadius * Math.sin(angle);
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'marker-wrapper';

    const inner = document.createElement('div');
    inner.className = 'custom-emoji-marker';
    inner.style.backgroundColor = catDetails.color;
    inner.innerHTML = catDetails.icon;

    wrapper.appendChild(inner);

    const marker = new mapboxgl.Marker({ element: wrapper })
      .setLngLat([lng, lat]);

    const tagsFormatted = parsedTags.length ? `<div class="polaroid-tags">${parsedTags.map(t => `#${formatTagDisplay(t)}`).join('  ')}</div>` : '';
    const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    const isSaved = getSavedSpots().includes(spotId);
    const isVisited = getVisitedSpots().includes(spotId);

    const captionHTML = `
      <div class="polaroid-caption-card">
        <div class="polaroid-caption-header">
          <button type="button" class="back-to-filters-btn">‹ Back</button>
          <span class="polaroid-cat-badge" style="background-color:${catDetails.color};">${catDetails.name}</span>
        </div>
        <div class="polaroid-caption-body">
          <h3 class="polaroid-caption-title">${title}</h3>
          <div class="polaroid-caption-meta">📍 ${neighborhood}</div>
          ${desc ? `<p class="polaroid-caption-desc">${desc}</p>` : ''}
          ${tagsFormatted}
        </div>

        <div class="polaroid-caption-user-actions">
          <button type="button" class="toggle-save-btn ${isSaved ? 'is-active' : ''}">
            ${isSaved ? '📌 Saved to Itinerary' : '📌 Save to Itinerary'}
          </button>
          <button type="button" class="toggle-visited-btn ${isVisited ? 'is-active' : ''}">
            ${isVisited ? '✅ Visited!' : '✅ Mark as Visited'}
          </button>
        </div>

        <div class="polaroid-caption-footer">
          <a href="${directionsLink}" target="_blank" class="polaroid-directions-btn primary-cta">🚗 Get Directions</a>
          <a href="https://marlonwalksla.com" target="_blank" class="polaroid-directions-btn secondary-cta">🎟️ Book Walking Tour</a>
        </div>
      </div>
    `;

    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();

      showSpotDetailsView(captionHTML, spotId, title);

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

      if (window.swiperInstance) {
        window.swiperInstance.slideToLoop(index);
      }
    });

    allMarkers.push({
      id: spotId,
      title: title,
      marker: marker,
      lng: lng,
      lat: lat,
      neighborhood: neighborhood,
      category: rawCategory,
      tags: parsedTags
    });
  });

  map.on('click', () => {
    showFilterControlsView();
  });

  // 3. BUILD FILTER CONTROLS
  let activeArea = 'All';
  const activeCategories = new Set();
  let activeTag = 'All';
  let countBadgeEl = null;

  function createScrollRow(pillsBar) {
    const container = document.createElement('div');
    container.className = 'pills-scroll-container';

    const leftBtn = document.createElement('button');
    leftBtn.type = 'button'; leftBtn.className = 'scroll-arrow-btn'; leftBtn.innerHTML = '‹';

    const rightBtn = document.createElement('button');
    rightBtn.type = 'button'; rightBtn.className = 'scroll-arrow-btn'; rightBtn.innerHTML = '›';

    leftBtn.addEventListener('click', () => pillsBar.scrollBy({ left: -240, behavior: 'smooth' }));
    rightBtn.addEventListener('click', () => pillsBar.scrollBy({ left: 240, behavior: 'smooth' }));

    container.appendChild(leftBtn);
    container.appendChild(pillsBar);
    container.appendChild(rightBtn);
    return container;
  }

  if (filterControlsView) {
    const mainTitleHeader = document.createElement('div');
    mainTitleHeader.className = 'map-section-title-row';

    const titleText = document.createElement('div');
    titleText.className = 'map-section-title';
    titleText.innerText = "📍 Marlon's LA Master Map";

    itineraryBadgeBtn = document.createElement('button');
    itineraryBadgeBtn.type = 'button';
    itineraryBadgeBtn.className = 'itinerary-badge-btn';
    updateItineraryBadge();

    itineraryBadgeBtn.addEventListener('click', () => {
      renderItineraryView();
    });

    mainTitleHeader.appendChild(titleText);
    mainTitleHeader.appendChild(itineraryBadgeBtn);
    filterControlsView.appendChild(mainTitleHeader);

    // 1. CATEGORIES PILLS
    const catGroup = document.createElement('div');
    catGroup.className = 'dashboard-group';

    const catLabel = document.createElement('div');
    catLabel.className = 'dashboard-label';

    const catLabelText = document.createElement('span');
    catLabelText.innerText = '🏷️ CATEGORIES';

    const badgeContainer = document.createElement('div');
    badgeContainer.style.display = 'flex';

    countBadgeEl = document.createElement('span');
    countBadgeEl.className = 'count-badge';
    countBadgeEl.innerText = `${allMarkers.length} SPOTS`;

    badgeContainer.appendChild(countBadgeEl);
    
    catLabel.appendChild(catLabelText);
    catLabel.appendChild(badgeContainer);
    catGroup.appendChild(catLabel);

    const catPillsBar = document.createElement('div');
    catPillsBar.className = 'category-pills-bar';

    Array.from(categories).sort().forEach(cat => {
      const pill = document.createElement('div');
      pill.className = 'cat-pill';
      pill.dataset.category = cat;
      const catDetails = getCategoryDetails(cat);
      pill.innerHTML = `<span class="cat-dot" style="background-color:${catDetails.color}"></span>${catDetails.name}`; 
      catPillsBar.appendChild(pill);
    });

    const catRow = createScrollRow(catPillsBar);
    catGroup.appendChild(catRow);
    filterControlsView.appendChild(catGroup); 

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

    // 2. VIBE DROPDOWN
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
      filterControlsView.appendChild(tagGroup);

      tagSelect.addEventListener('change', (e) => {
        activeTag = e.target.value;
        applyFilters();
      });
    }

    // 3. NEIGHBORHOOD DROPDOWN
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
    filterControlsView.appendChild(areaGroup); 

    areaSelect.addEventListener('change', (e) => {
      activeArea = e.target.value;
      applyFilters();
    });

    // 4. CENTERED RESET BUTTON
    const resetContainer = document.createElement('div');
    resetContainer.style.display = 'flex';
    resetContainer.style.justifyContent = 'center';
    resetContainer.style.width = '100%';
    resetContainer.style.marginTop = '6px';

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'reset-filters-btn';
    resetBtn.innerHTML = '↺ Reset Filters';

    resetContainer.appendChild(resetBtn);
    filterControlsView.appendChild(resetContainer);

    resetBtn.addEventListener('click', () => {
      activeArea = 'All';
      activeTag = 'All';
      activeCategories.clear();

      if (areaSelect) areaSelect.value = 'All';
      if (tagSelect) tagSelect.value = 'All';

      catPillsBar.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('is-active'));

      applyFilters();
      showFilterControlsView();
    });
  }

  function applyFilters() {
    const bounds = new mapboxgl.LngLatBounds();
    let visibleCount = 0;

    allMarkers.forEach(item => {
      const matchesArea = (activeArea === 'All') || (item.neighborhood === activeArea);
      const matchesCategory = (activeCategories.size === 0) || activeCategories.has(item.category);
      const matchesTag = (activeTag === 'All') || item.tags.includes(activeTag);

      if (matchesArea && matchesCategory && matchesTag) {
        item.marker.addTo(map);
        bounds.extend([item.lng, item.lat]);
        visibleCount++;
      } else {
        item.marker.remove();
      }
    });

    if (countBadgeEl) {
      countBadgeEl.innerText = `${visibleCount} ${visibleCount === 1 ? 'SPOT' : 'SPOTS'}`;
    }

    const isFiltered = (activeArea !== 'All') || (activeCategories.size > 0) || (activeTag !== 'All');

    if (!isFiltered) {
      map.flyTo({ center: dtlaCenter, zoom: 10.2, duration: 1200, speed: 0.8 });
    } else if (visibleCount >= 1) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 13.0, duration: 1400 });
    } else {
      map.flyTo({ center: dtlaCenter, zoom: 10.2, duration: 1200, speed: 0.8 });
    }
  }

  map.on('load', () => {
    applyFilters();
    map.resize();
  });
};
