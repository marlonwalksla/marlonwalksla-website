/* ==============================================================================
 * FILE: map-engine.js
 * CATEGORY: MarlonWalksLA Website - Adventure Builder & Story Map Engine
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

  // LOCAL STORAGE HELPERS
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
    updateHeaderBadges();
    updateMarkerStates();
    if (activeViewMode === 'itinerary') applyModeMapFilter(getSavedSpots());
  }
  function toggleVisitedSpot(id) {
    let visited = getVisitedSpots();
    if (visited.includes(id)) {
      visited = visited.filter(item => item !== id);
    } else {
      visited.push(id);
    }
    localStorage.setItem('marlon_visited_spots', JSON.stringify(visited));
    updateHeaderBadges();
    updateMarkerStates();
    if (activeViewMode === 'visited') {
      renderVisitedView();
    } else if (activeViewMode === 'itinerary') {
      renderItineraryView();
    }
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

  // UI VIEWS MANAGEMENT
  const form = document.querySelector('.filter-bar form');
  let filterControlsView = null;
  let spotDetailsView = null;
  let listCardView = null;
  let itineraryBadgeBtn = null;
  let visitedBadgeBtn = null;
  let activeViewMode = 'filters'; // 'filters' | 'itinerary' | 'visited'

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

    listCardView = document.createElement('div');
    listCardView.id = 'list-card-view';
    listCardView.style.display = 'none';
    listCardView.style.width = '100%';

    form.appendChild(filterControlsView);
    form.appendChild(spotDetailsView);
    form.appendChild(listCardView);
  }

  function showFilterControlsView() {
    if (!filterControlsView || !spotDetailsView || !listCardView) return;
    activeViewMode = 'filters';
    spotDetailsView.style.display = 'none';
    listCardView.style.display = 'none';
    filterControlsView.style.display = 'flex';
    applyFilters();
    map.resize();
  }

  function showSpotDetailsView(htmlContent, spotId) {
    if (!filterControlsView || !spotDetailsView || !listCardView) return;
    spotDetailsView.innerHTML = htmlContent;
    filterControlsView.style.display = 'none';
    listCardView.style.display = 'none';
    spotDetailsView.style.display = 'block';

    const backBtn = spotDetailsView.querySelector('.back-to-filters-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (activeViewMode === 'itinerary') {
          renderItineraryView();
        } else if (activeViewMode === 'visited') {
          renderVisitedView();
        } else {
          showFilterControlsView();
        }
      });
    }

    const saveBtn = spotDetailsView.querySelector('.toggle-save-btn');
    const visitedBtn = spotDetailsView.querySelector('.toggle-visited-btn');

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        toggleSavedSpot(spotId);
        const isSaved = getSavedSpots().includes(spotId);
        saveBtn.classList.toggle('is-active', isSaved);
        saveBtn.innerHTML = isSaved ? '📌 Saved to Itinerary' : '📌 Save to Itinerary';
      });
    }

    if (visitedBtn) {
      visitedBtn.addEventListener('click', () => {
        toggleVisitedSpot(spotId);
        const isVisited = getVisitedSpots().includes(spotId);
        visitedBtn.classList.toggle('is-active', isVisited);
        visitedBtn.innerHTML = isVisited ? '✅ Visited!' : '✅ Mark as Visited';
      });
    }

    map.resize();
  }

  function updateMarkerStates() {
    const visitedIds = getVisitedSpots();
    allMarkers.forEach(m => {
      const isVisited = visitedIds.includes(m.id);
      if (isVisited) {
        m.wrapper.classList.add('is-visited-pin');
      } else {
        m.wrapper.classList.remove('is-visited-pin');
      }
    });
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

  // RENDER SAVED ITINERARY VIEW
  function renderItineraryView() {
    if (!listCardView) return;
    activeViewMode = 'itinerary';

    const savedIds = getSavedSpots();
    const visitedIds = getVisitedSpots();
    const itineraryMarkers = allMarkers.filter(m => savedIds.includes(m.id));

    const totalCount = itineraryMarkers.length;
    const completedCount = itineraryMarkers.filter(m => visitedIds.includes(m.id)).length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    let html = `
      <div class="itinerary-card">
        <div class="itinerary-header">
          <button type="button" class="back-to-filters-btn">‹ Back</button>
          <div class="itinerary-title">📋 Planned Itinerary (${totalCount})</div>
        </div>

        <div class="itinerary-progress-box">
          <div class="itinerary-progress-label">
            <span>🎯 Itinerary Progress</span>
            <strong>${completedCount} / ${totalCount} Completed (${progressPercent}%)</strong>
          </div>
          <div class="itinerary-progress-track">
            <div class="itinerary-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>
        
        <div class="itinerary-section">
          ${totalCount === 0 ? '<p class="empty-itinerary-msg">No spots saved yet. Click 📌 Save on any spot to build your day!</p>' : ''}
          <div class="itinerary-list">
            ${itineraryMarkers.map(m => {
              const isVisited = visitedIds.includes(m.id);
              return `
                <div class="itinerary-item ${isVisited ? 'is-visited-item' : ''}" data-id="${m.id}">
                  <div class="itinerary-item-info">
                    <div class="itinerary-item-name">${m.title}</div>
                    <div class="itinerary-item-meta">📍 ${m.neighborhood}</div>
                  </div>
                  <div class="itinerary-item-actions">
                    <button type="button" class="list-check-btn ${isVisited ? 'is-checked' : ''}" data-id="${m.id}">
                      ${isVisited ? '✓ Visited' : 'Mark Visited'}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    listCardView.innerHTML = html;
    filterControlsView.style.display = 'none';
    spotDetailsView.style.display = 'none';
    listCardView.style.display = 'block';

    const backBtn = listCardView.querySelector('.back-to-filters-btn');
    if (backBtn) {
      backBtn.addEventListener('click', showFilterControlsView);
    }

    listCardView.querySelectorAll('.list-check-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleVisitedSpot(btn.dataset.id);
      });
    });

    listCardView.querySelectorAll('.itinerary-item').forEach(el => {
      el.addEventListener('click', () => {
        const match = allMarkers.find(m => m.id === el.dataset.id);
        if (match) match.wrapper.click();
      });
    });

    applyModeMapFilter(savedIds);
    map.resize();
  }

  // RENDER LIFETIME VISITED PASSPORT VIEW
  function renderVisitedView() {
    if (!listCardView) return;
    activeViewMode = 'visited';

    const visitedIds = getVisitedSpots();
    const visitedMarkers = allMarkers.filter(m => visitedIds.includes(m.id));
    const totalSpots = allMarkers.length;
    const progressPercent = Math.round((visitedIds.length / totalSpots) * 100);

    let html = `
      <div class="itinerary-card visited-passport-card">
        <div class="itinerary-header">
          <button type="button" class="back-to-filters-btn">‹ Back</button>
          <div class="itinerary-title">✅ Visited Passport (${visitedIds.length})</div>
        </div>

        <div class="itinerary-progress-box">
          <div class="itinerary-progress-label">
            <span>🏆 Total LA Explored</span>
            <strong>${visitedIds.length} / ${totalSpots} Spots (${progressPercent}%)</strong>
          </div>
          <div class="itinerary-progress-track">
            <div class="itinerary-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>
        
        <div class="itinerary-section">
          ${visitedIds.length === 0 ? '<p class="empty-itinerary-msg">No spots visited yet. Click ✅ Visited on places you have explored!</p>' : ''}
          <div class="itinerary-list">
            ${visitedMarkers.map(m => `
              <div class="itinerary-item is-visited-item" data-id="${m.id}">
                <div class="itinerary-item-info">
                  <div class="itinerary-item-name">${m.title}</div>
                  <div class="itinerary-item-meta">📍 ${m.neighborhood}</div>
                </div>
                <div class="itinerary-item-actions">
                  <span class="visited-badge">✓ Explored</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    listCardView.innerHTML = html;
    filterControlsView.style.display = 'none';
    spotDetailsView.style.display = 'none';
    listCardView.style.display = 'block';

    const backBtn = listCardView.querySelector('.back-to-filters-btn');
    if (backBtn) {
      backBtn.addEventListener('click', showFilterControlsView);
    }

    listCardView.querySelectorAll('.itinerary-item').forEach(el => {
      el.addEventListener('click', () => {
        const match = allMarkers.find(m => m.id === el.dataset.id);
        if (match) match.wrapper.click();
      });
    });

    applyModeMapFilter(visitedIds);
    map.resize();
  }

  function updateHeaderBadges() {
    if (itineraryBadgeBtn) {
      const savedCount = getSavedSpots().length;
      itineraryBadgeBtn.innerText = `📋 Planned Itinerary (${savedCount})`;
    }
    if (visitedBadgeBtn) {
      const visitedCount = getVisitedSpots().length;
      visitedBadgeBtn.innerText = `✅ Visited Passport (${visitedCount})`;
    }
  }

  // 2. PROCESS GEOJSON FEATURES WITH RICH STORYTELLING (NOTES, PHOTOS, SOCIAL)
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

    // STORYTELLING EXTENSIONS (Note, Image, Social Media links)
    const marlonNote = cleanText(props.Note || props.MarlonNote || props.PersonalNote || props.tip || '');
    const spotImage = cleanText(props.Image || props.Photo || props.image_url || '');
    const instagramUrl = cleanText(props.Instagram || props.instagram_url || '');
    const tiktokUrl = cleanText(props.TikTok || props.tiktok_url || '');

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

    // Dynamic Rich Story HTML Assembly
    const imageHTML = spotImage ? `<div class="polaroid-spot-img-wrap"><img src="${spotImage}" alt="${title}" class="polaroid-spot-img" /></div>` : '';
    const noteHTML = marlonNote ? `<blockquote class="polaroid-marlon-note"><strong>💡 Marlon's Tip:</strong> "${marlonNote}"</blockquote>` : '';
    
    let socialLinksHTML = '';
    if (instagramUrl || tiktokUrl) {
      socialLinksHTML = `<div class="polaroid-social-row">`;
      if (instagramUrl) socialLinksHTML += `<a href="${instagramUrl}" target="_blank" class="social-btn instagram">📸 Watch Instagram Reel</a>`;
      if (tiktokUrl) socialLinksHTML += `<a href="${tiktokUrl}" target="_blank" class="social-btn tiktok">🎵 Watch TikTok</a>`;
      socialLinksHTML += `</div>`;
    }

    const captionHTML = `
      <div class="polaroid-caption-card">
        <div class="polaroid-caption-header">
          <button type="button" class="back-to-filters-btn">‹ Back</button>
          <span class="polaroid-cat-badge" style="background-color:${catDetails.color};">${catDetails.name}</span>
        </div>
        ${imageHTML}
        <div class="polaroid-caption-body">
          <h3 class="polaroid-caption-title">${title}</h3>
          <div class="polaroid-caption-meta">📍 ${neighborhood}</div>
          ${desc ? `<p class="polaroid-caption-desc">${desc}</p>` : ''}
          ${noteHTML}
          ${socialLinksHTML}
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

      showSpotDetailsView(captionHTML, spotId);

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
      wrapper: wrapper,
      marker: marker,
      lng: lng,
      lat: lat,
      neighborhood: neighborhood,
      category: rawCategory,
      tags: parsedTags
    });
  });

  map.on('click', () => {
    if (activeViewMode === 'itinerary') {
      renderItineraryView();
    } else if (activeViewMode === 'visited') {
      renderVisitedView();
    } else {
      showFilterControlsView();
    }
  });

  // 3. BUILD FILTER CONTROLS WITH DUAL CTA BUTTONS
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
    mainTitleHeader.className = 'map-hero-cta-box';

    const titleText = document.createElement('h2');
    titleText.className = 'map-hero-cta-title';
    titleText.innerText = "Build Your LA Adventure";

    const subtitleText = document.createElement('p');
    subtitleText.className = 'map-hero-cta-subtitle';
    subtitleText.innerText = "Curate your personal itinerary, save must-see spots, and check off places as you explore!";

    // Dual CTA Buttons Box (Planned Itinerary + Visited Passport)
    const toggleGroup = document.createElement('div');
    toggleGroup.className = 'itinerary-toggle-group';

    itineraryBadgeBtn = document.createElement('button');
    itineraryBadgeBtn.type = 'button';
    itineraryBadgeBtn.className = 'itinerary-badge-btn primary-mode';

    visitedBadgeBtn = document.createElement('button');
    visitedBadgeBtn.type = 'button';
    visitedBadgeBtn.className = 'itinerary-badge-btn visited-mode';

    updateHeaderBadges();

    itineraryBadgeBtn.addEventListener('click', renderItineraryView);
    visitedBadgeBtn.addEventListener('click', renderVisitedView);

    toggleGroup.appendChild(itineraryBadgeBtn);
    toggleGroup.appendChild(visitedBadgeBtn);

    mainTitleHeader.appendChild(titleText);
    mainTitleHeader.appendChild(subtitleText);
    mainTitleHeader.appendChild(toggleGroup);

    filterControlsView.appendChild(mainTitleHeader);

    const divider = document.createElement('hr');
    divider.className = 'filter-section-divider';
    filterControlsView.appendChild(divider);

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
      activeViewMode = 'filters';
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
        activeViewMode = 'filters';
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
      activeViewMode = 'filters';
      activeArea = e.target.value;
      applyFilters();
    });

    // 4. RESET BUTTON
    const resetContainer = document.createElement('div');
    resetContainer.style.display = 'flex';
    resetContainer.style.justifyContent = 'center';
    resetContainer.style.width = '100%';
    resetContainer.style.marginTop = '4px';

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'reset-filters-btn';
    resetBtn.innerHTML = '↺ Reset Filters';

    resetContainer.appendChild(resetBtn);
    filterControlsView.appendChild(resetContainer);

    resetBtn.addEventListener('click', () => {
      activeViewMode = 'filters';
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
    if (activeViewMode === 'itinerary') {
      applyModeMapFilter(getSavedSpots());
      return;
    }
    if (activeViewMode === 'visited') {
      applyModeMapFilter(getVisitedSpots());
      return;
    }

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
    updateMarkerStates();
    applyFilters();
    map.resize();
  });
};
