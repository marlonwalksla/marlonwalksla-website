/* ==============================================================================
 * FILE: map-engine.js
 * CATEGORY: MarlonWalksLA Website - Mapbox Engine & Filtering Logic
 * ============================================================================== */

window.initMapEngine = function() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  mapboxgl.accessToken = 'pk.eyJ1IjoibWFybG9ud2Fsa3NsYSIsImEiOiJjbXM5YWhuOGIwbGVjMzRwbTZ0b2I2emZlIn0.UgW7MpYibACH6Axk1WgoSA';

  const dtlaCenter = [-118.2437, 34.0522];

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: dtlaCenter,
    zoom: 10
  });

  const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true
  });
  map.addControl(geolocate, 'top-right');

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
    return str.replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  }

  const allSpotsData = [];
  const neighborhoods = new Set();
  const categories = new Set();
  const tagsSet = new Set();
  const coordTracker = {}; 

  document.querySelectorAll('.map-location-marker').forEach((item, index) => {
    let lat = parseFloat(item.getAttribute('data-lat'));
    let lng = parseFloat(item.getAttribute('data-lng'));
    const title = cleanText(item.getAttribute('data-title') || 'Location');
    const desc = cleanText(item.getAttribute('data-desc') || '');
    const rawCategory = cleanText(item.getAttribute('data-category') || 'landmarks');
    const customColor = cleanText(item.getAttribute('data-color') || item.getAttribute('data-pin-color') || '');
    const neighborhood = cleanText(item.getAttribute('data-neighborhood') || 'Downtown LA');
    const rawTagsStr = cleanText(item.getAttribute('data-tags') || '');

    const catDetails = getCategoryDetails(rawCategory, customColor);

    if (neighborhood) neighborhoods.add(neighborhood);
    if (rawCategory) categories.add(rawCategory);

    let parsedTags = [];
    const parentCard = item.closest('.w-dyn-item') || item.parentElement;
    if (parentCard) {
      const tagNodes = parentCard.querySelectorAll('.tag-item, [id^="tag-item"], [class*="tag-item"]');
      tagNodes.forEach(node => {
        const text = cleanText(node.textContent);
        if (text) {
          text.split(/[,;]/).forEach(t => {
            const cleanTag = t.replace(/^#/, '').trim();
            if (cleanTag) parsedTags.push(cleanTag);
          });
        }
      });
    }

    if (parsedTags.length === 0 && rawTagsStr) {
      rawTagsStr.split(/[,;]/).forEach(t => {
        const cleanTag = t.replace(/^#/, '').trim();
        if (cleanTag) parsedTags.push(cleanTag);
      });
    }
    
    parsedTags = [...new Set(parsedTags)];
    parsedTags.forEach(t => tagsSet.add(t));

    if (!isNaN(lat) && !isNaN(lng)) {
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

      const tagsFormatted = parsedTags.length ? `<div class="popup-tags">Tags: ${parsedTags.join(', ')}</div>` : '';
      const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      const popupHTML = `
        <div class="marlon-popup-content">
          <h3 class="popup-title">${title}</h3>
          <div class="popup-meta">${neighborhood} &bull; ${catDetails.name}</div>
          ${desc ? `<div class="popup-desc">${desc}</div>` : ''}
          ${tagsFormatted}
          <a href="${directionsLink}" target="_blank" class="popup-btn">🚗 Get Directions</a>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: true, closeOnClick: true, maxWidth: '280px' })
        .setLngLat([lng, lat])
        .setHTML(popupHTML);

      const marker = new mapboxgl.Marker({ element: wrapper })
        .setLngLat([lng, lat]);

      wrapper.addEventListener('click', () => {
        const targetZoom = Math.min(Math.max(map.getZoom(), 13.5), 14.5);
        const activePopups = document.querySelectorAll('.mapboxgl-popup');
        activePopups.forEach(p => p.remove());

        map.flyTo({ 
          center: [lng, lat], 
          zoom: targetZoom, 
          duration: 1200, 
          padding: { top: 120 } 
        });

        map.once('moveend', () => {
          popup.addTo(map);
        });

        if (window.swiperInstance) {
          window.swiperInstance.slideToLoop(index);
        }
      });

      allSpotsData.push({
        id: index,
        marker: marker,
        lng: lng,
        lat: lat,
        neighborhood: neighborhood,
        category: rawCategory,
        tags: parsedTags,
        title: title
      });
    }
  });

  const activeMarkersMap = {};

  function syncVisibleMarkers() {
    if (!map.getSource('spots')) return;
    const features = map.querySourceFeatures('spots', {
      filter: ['!', ['has', 'point_count']]
    });

    const visibleIds = new Set();
    features.forEach(f => {
      const id = f.properties.id;
      visibleIds.add(id);
      if (!activeMarkersMap[id]) {
        const spot = allSpotsData[id];
        if (spot) {
          spot.marker.addTo(map);
          activeMarkersMap[id] = spot.marker;
        }
      }
    });

    Object.keys(activeMarkersMap).forEach(id => {
      if (!visibleIds.has(Number(id))) {
        activeMarkersMap[id].remove();
        delete activeMarkersMap[id];
      }
    });
  }

  const form = document.querySelector('.filter-bar form');
  let activeArea = 'All';
  const activeCategories = new Set(['All']);
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

  if (form) {
    form.innerHTML = '';

    const catGroup = document.createElement('div');
    catGroup.className = 'dashboard-group';

    const catLabel = document.createElement('div');
    catLabel.className = 'dashboard-label';
    const catLabelText = document.createElement('span');
    catLabelText.innerText = '🏷️ Categories';

    const badgeContainer = document.createElement('div');
    badgeContainer.style.display = 'flex';
    badgeContainer.style.gap = '10px';

    countBadgeEl = document.createElement('span');
    countBadgeEl.className = 'count-badge';
    countBadgeEl.innerText = `${allSpotsData.length} SPOTS`;

    const viewsBadgeEl = document.createElement('span');
    viewsBadgeEl.id = 'map-views-badge';
    viewsBadgeEl.className = 'count-badge';
    viewsBadgeEl.style.color = '#718096';
    viewsBadgeEl.innerText = '30,000 VIEWS';

    badgeContainer.appendChild(countBadgeEl);
    badgeContainer.appendChild(viewsBadgeEl);
    
    catLabel.appendChild(catLabelText);
    catLabel.appendChild(badgeContainer);
    catGroup.appendChild(catLabel);

    const catPillsBar = document.createElement('div');
    catPillsBar.className = 'category-pills-bar';

    const allCatPill = document.createElement('div');
    allCatPill.className = 'cat-pill is-active';
    allCatPill.dataset.category = 'All';
    allCatPill.innerText = 'All Categories';
    catPillsBar.appendChild(allCatPill);

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
    form.appendChild(catGroup); 

    catPillsBar.addEventListener('click', (e) => {
      const pill = e.target.closest('.cat-pill');
      if (!pill) return;
      const cat = pill.dataset.category;

      if (cat === 'All') {
        activeCategories.clear();
        activeCategories.add('All');
        catPillsBar.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('is-active'));
        allCatPill.classList.add('is-active');
      } else {
        allCatPill.classList.remove('is-active');
        activeCategories.delete('All');
        if (activeCategories.has(cat)) {
          activeCategories.delete(cat);
          pill.classList.remove('is-active');
        } else {
          activeCategories.add(cat);
          pill.classList.add('is-active');
        }
        if (activeCategories.size === 0) {
          activeCategories.add('All');
          allCatPill.classList.add('is-active');
        }
      }
      applyFilters();
    });

    if (tagsSet.size > 0) {
      const tagGroup = document.createElement('div');
      tagGroup.className = 'dashboard-group';

      const tagLabel = document.createElement('div');
      tagLabel.className = 'dashboard-label';
      tagLabel.innerText = '✨ Filter by Vibe';
      tagGroup.appendChild(tagLabel);

      const tagSelect = document.createElement('select');
      tagSelect.innerHTML = `<option value="All">All Vibes</option>`;
      Array.from(tagsSet).sort().forEach(tagVal => {
        tagSelect.innerHTML += `<option value="${tagVal}">${tagVal}</option>`;
      });

      tagGroup.appendChild(tagSelect);
      form.appendChild(tagGroup);

      tagSelect.addEventListener('change', (e) => {
        activeTag = e.target.value;
        applyFilters();
      });
    }

    const areaGroup = document.createElement('div');
    areaGroup.className = 'dashboard-group';

    const areaLabel = document.createElement('div');
    areaLabel.className = 'dashboard-label';
    areaLabel.innerText = '📍 Neighborhoods';
    areaGroup.appendChild(areaLabel);

    const areaSelect = document.createElement('select');
    areaSelect.innerHTML = `<option value="All">All LA Neighborhoods</option>`;
    Array.from(neighborhoods).sort().forEach(area => {
      areaSelect.innerHTML += `<option value="${area}">${area}</option>`;
    });

    areaGroup.appendChild(areaSelect);
    form.appendChild(areaGroup); 

    areaSelect.addEventListener('change', (e) => {
      activeArea = e.target.value;
      applyFilters();
    });
  }

  function applyFilters() {
    const bounds = new mapboxgl.LngLatBounds();
    let visibleCount = 0;
    const filteredFeatures = [];

    allSpotsData.forEach(item => {
      const matchesArea = (activeArea === 'All') || (item.neighborhood === activeArea);
      const matchesCategory = activeCategories.has('All') || activeCategories.has(item.category);
      const matchesTag = (activeTag === 'All') || item.tags.includes(activeTag);

      if (matchesArea && matchesCategory && matchesTag) {
        bounds.extend([item.lng, item.lat]);
        visibleCount++;
        filteredFeatures.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [item.lng, item.lat] },
          properties: { id: item.id }
        });
      }
    });

    if (countBadgeEl) {
      countBadgeEl.innerText = `${visibleCount} ${visibleCount === 1 ? 'SPOT' : 'SPOTS'}`;
    }

    const source = map.getSource('spots');
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: filteredFeatures
      });
    }

    if (activeArea === 'All') {
      map.flyTo({ center: dtlaCenter, zoom: 10.2, duration: 1800 });
    } else if (visibleCount >= 1) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 14.0, duration: 1800 });
    } else {
      map.flyTo({ center: dtlaCenter, zoom: 10.2, duration: 1800 });
    }
  }

  async function trackAndDisplayViews() {
    const viewsBadge = document.getElementById('map-views-badge');
    if (!viewsBadge) return;
    
    const BASE_VIEWS = 30000; 
    viewsBadge.innerText = `${BASE_VIEWS.toLocaleString()} VIEWS`;

    try {
      const res = await fetch('https://api.counterapi.dev/v1/marlonwalksla/master-map-views/up');
      const data = await res.json();
      const addedViews = data.count || data.value || 0;
      
      if (addedViews > 0) {
        let startTimestamp = null;
        const duration = 2000; 
        
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const easeOut = progress * (2 - progress); 
          const current = Math.floor(easeOut * addedViews + BASE_VIEWS);
          viewsBadge.innerText = `${current.toLocaleString()} VIEWS`;
          if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
      }
    } catch (err) {
      viewsBadge.innerText = `${BASE_VIEWS.toLocaleString()} VIEWS`;
    }
  }

  map.on('load', () => {
    map.addSource('spots', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
      cluster: true,
      clusterMaxZoom: 13.5,
      clusterRadius: 40
    });

    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'spots',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#3898ec',
        'circle-radius': ['step', ['get', 'point_count'], 16, 10, 20, 30, 24],
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff'
      }
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'spots',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 13
      },
      paint: {
        'text-color': '#ffffff'
      }
    });

    map.on('click', 'clusters', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const clusterId = features[0].properties.cluster_id;
      map.getSource('spots').getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom + 0.5
        });
      });
    });

    map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = ''; });

    map.on('move', syncVisibleMarkers);
    map.on('moveend', syncVisibleMarkers);

    applyFilters();
    trackAndDisplayViews();
  });
};
