function initMarlonWalksMap() {
  if (window.marlonMapInitialized) return;
  window.marlonMapInitialized = true;

  if (typeof window.initMarlonWalksCards === 'function') {
    window.initMarlonWalksCards();
  }

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
    'coffee-cafes': { color: '#a855f7', name: 'Cafes', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>' },
    'dining': { color: '#ef4444', name: 'Dining', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>' },
    'food-dining': { color: '#ef4444', name: 'Dining', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>' },
    'nightlife': { color: '#6366f1', name: 'Nightlife', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8M12 15v7M19 3l-7 8-7-7h14z"/></svg>' },
    'landmarks': { color: '#f59e0b', name: 'Landmarks', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
    'arts': { color: '#ec4899', name: 'Arts', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12c0 5.5 4.5 10 10 10a2.5 2.5 0 0 0 2.5-2.5c0-.88-.45-1.63-1.12-2.07a1.08 1.08 0 0 1-.41-.85c0-.6.48-1.08 1.08-1.08h1.45A5.5 5.5 0 0 0 21 10c0-5.5-4.5-8-9-8z"/><circle cx="7.5" cy="11.5" r="1" fill="currentColor"/><circle cx="12" cy="7.5" r="1" fill="currentColor"/><circle cx="16.5" cy="10.5" r="1" fill="currentColor"/></svg>' },
    'shopping': { color: '#06b6d4', name: 'Shopping', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>' },
    'parks': { color: '#10b981', name: 'Parks', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 18h8M12 2L3 14h18L12 2z"/></svg>' },
    'entertainment': { color: '#2563eb', name: 'Entertainment', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18M17 3v18M3 7.5h18M3 12h18M3 16.5h18"/></svg>' }
  };

  function getCategoryDetails(rawCat, overrideColor) {
    if (!rawCat) return { color: overrideColor || '#3898ec', icon: defaultPinSvg, name: 'Spot' };
    const key = String(rawCat).toLowerCase().replace(/&amp;/g, 'and').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    let details = categoryMap[key];
    if (!details) {
      const matchedKey = Object.keys(categoryMap).find(k => key.includes(k) || k.includes(key));
      details = matchedKey ? categoryMap[matchedKey] : { color: overrideColor || '#3898ec', icon: defaultPinSvg, name: rawCat };
    }
    return details;
  }

  function cleanText(str) {
    return str ? str.replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim() : '';
  }

  const titleEl = document.getElementById('selected-title');
  const descEl = document.getElementById('selected-description');
  const btnEl = document.getElementById('selected-button');

  function updatePolaroidCaption(title, desc, lat, lng) {
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;
    if (btnEl) {
      if (lat && lng) {
        btnEl.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        btnEl.target = '_blank';
        btnEl.classList.add('is-visible');
        btnEl.textContent = '🚗 Get Directions';
      } else {
        btnEl.classList.remove('is-visible');
      }
    }
  }

  updatePolaroidCaption(
    'Tap any pin to explore!',
    'Select a spot on the map to unlock details, category tags, and directions.',
    null,
    null
  );

  const allMarkers = [];
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
    const customColor = cleanText(item.getAttribute('data-color') || '');
    const neighborhood = cleanText(item.getAttribute('data-neighborhood') || 'Downtown LA');
    const rawTagsStr = cleanText(item.getAttribute('data-tags') || '');

    const catDetails = getCategoryDetails(rawCategory, customColor);

    if (neighborhood) neighborhoods.add(neighborhood);
    if (rawCategory) categories.add(rawCategory);

    const parentCard = item.closest('.w-dyn-item') || item.parentElement;
    const tagNodes = parentCard ? parentCard.querySelectorAll('.tag-item, #tag-item, [id="tag-item"]') : [];
    let parsedTags = Array.from(tagNodes).map(node => cleanText(node.textContent)).filter(Boolean);

    if (parsedTags.length === 0 && rawTagsStr) {
      parsedTags = rawTagsStr.split(/[,;]/).map(t => t.trim()).filter(Boolean);
    }

    parsedTags = parsedTags.map(t => t.replace(/^#/, '').trim()).filter(t => t && t !== '#');
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

      const marker = new mapboxgl.Marker({ element: wrapper }).setLngLat([lng, lat]);

      wrapper.addEventListener('click', () => {
        const tagsFormatted = parsedTags.length ? `\nTags: ${parsedTags.join(', ')}` : '';
        const captionMeta = `${neighborhood}  •  ${catDetails.name}\n${desc}${tagsFormatted}`;
        updatePolaroidCaption(title, captionMeta, lat, lng);
        
        map.flyTo({ center: [lng, lat], zoom: map.getZoom(), duration: 1200 });

        if (window.swiperInstance) {
          window.swiperInstance.slideToLoop(index);
        }
      });

      allMarkers.push({ marker, lng, lat, neighborhood, category: rawCategory, tags: parsedTags });
    }
  });

  const filterBar = document.querySelector('.filter-bar');
  const form = document.querySelector('.filter-bar form');
  let activeArea = 'All';
  const activeCategories = new Set(['All']);
  const activeTags = new Set(['All']);
  let countBadgeEl = null;

  // Mobile Drawer Controls
  if (filterBar) {
    let backdrop = document.querySelector('.mobile-filter-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'mobile-filter-backdrop';
      document.body.appendChild(backdrop);
    }

    const mapPolaroid = document.querySelector('.map-master-polaroid');
    let triggerBtn = document.querySelector('.mobile-filter-trigger');
    if (!triggerBtn && mapPolaroid) {
      triggerBtn = document.createElement('button');
      triggerBtn.type = 'button';
      triggerBtn.className = 'mobile-filter-trigger';
      triggerBtn.innerHTML = `🔍 Filter Spots (<span id="trigger-count">${allMarkers.length}</span>)`;
      mapPolaroid.appendChild(triggerBtn);
    }

    const closeDrawer = () => {
      filterBar.classList.remove('is-open');
      backdrop.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    if (triggerBtn) triggerBtn.addEventListener('click', () => {
      filterBar.classList.add('is-open');
      backdrop.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
    
    backdrop.addEventListener('click', closeDrawer);

    if (form && !form.querySelector('.sheet-header')) {
      const sheetHeader = document.createElement('div');
      sheetHeader.className = 'sheet-header';
      sheetHeader.innerHTML = `<span class="sheet-title">Filter LA Locations</span><button type="button" class="sheet-close-btn">&times;</button>`;
      form.insertBefore(sheetHeader, form.firstChild);
      sheetHeader.querySelector('.sheet-close-btn').addEventListener('click', closeDrawer);

      const applyBtn = document.createElement('button');
      applyBtn.type = 'button';
      applyBtn.className = 'sheet-apply-btn';
      applyBtn.innerText = 'Show Spots';
      applyBtn.addEventListener('click', closeDrawer);
      form.appendChild(applyBtn);
    }
  }

  function createScrollRow(pillsBar) {
    const container = document.createElement('div');
    container.className = 'pills-scroll-container';

    const leftBtn = document.createElement('button');
    leftBtn.type = 'button';
    leftBtn.className = 'scroll-arrow-btn';
    leftBtn.innerHTML = '‹';

    const rightBtn = document.createElement('button');
    rightBtn.type = 'button';
    rightBtn.className = 'scroll-arrow-btn';
    rightBtn.innerHTML = '›';

    leftBtn.addEventListener('click', () => pillsBar.scrollBy({ left: -240, behavior: 'smooth' }));
    rightBtn.addEventListener('click', () => pillsBar.scrollBy({ left: 240, behavior: 'smooth' }));

    container.appendChild(leftBtn);
    container.appendChild(pillsBar);
    container.appendChild(rightBtn);

    return container;
  }

  if (form) {
    form.querySelectorAll('.dashboard-group').forEach(el => el.remove());

    // 1. NEIGHBORHOODS
    const areaGroup = document.createElement('div');
    areaGroup.className = 'dashboard-group';

    const areaLabel = document.createElement('div');
    areaLabel.className = 'dashboard-label';
    areaLabel.innerHTML = `<span>📍 Neighborhoods</span>`;
    
    const badgeContainer = document.createElement('div');
    badgeContainer.style.display = 'flex';
    badgeContainer.style.gap = '10px';

    countBadgeEl = document.createElement('span');
    countBadgeEl.className = 'count-badge';
    countBadgeEl.innerText = `${allMarkers.length} SPOTS`;

    const viewsBadgeEl = document.createElement('span');
    viewsBadgeEl.id = 'map-views-badge';
    viewsBadgeEl.className = 'count-badge';
    viewsBadgeEl.style.color = '#718096';
    viewsBadgeEl.innerText = '30,000 VIEWS';

    badgeContainer.appendChild(countBadgeEl);
    badgeContainer.appendChild(viewsBadgeEl);
    areaLabel.appendChild(badgeContainer);
    areaGroup.appendChild(areaLabel);

    const areaPillsBar = document.createElement('div');
    areaPillsBar.className = 'neighborhood-pills-bar';

    const allAreaPill = document.createElement('div');
    allAreaPill.className = 'area-pill is-active';
    allAreaPill.dataset.area = 'All';
    allAreaPill.innerText = 'All LA';
    areaPillsBar.appendChild(allAreaPill);

    Array.from(neighborhoods).sort().forEach(area => {
      const pill = document.createElement('div');
      pill.className = 'area-pill';
      pill.dataset.area = area;
      pill.innerText = area;
      areaPillsBar.appendChild(pill);
    });

    areaGroup.appendChild(createScrollRow(areaPillsBar));
    form.appendChild(areaGroup); 

    areaPillsBar.addEventListener('click', (e) => {
      const pill = e.target.closest('.area-pill');
      if (!pill) return;
      activeArea = pill.dataset.area;
      areaPillsBar.querySelectorAll('.area-pill').forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      applyFilters();
    });

    // 2. CATEGORIES
    const catGroup = document.createElement('div');
    catGroup.className = 'dashboard-group';

    const catLabel = document.createElement('div');
    catLabel.className = 'dashboard-label';
    catLabel.innerText = '🏷️ Categories';
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

    catGroup.appendChild(createScrollRow(catPillsBar));
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

    // 3. TAGS / VIBES
    if (tagsSet.size > 0) {
      const tagGroup = document.createElement('div');
      tagGroup.className = 'dashboard-group';

      const tagLabel = document.createElement('div');
      tagLabel.className = 'dashboard-label';
      tagLabel.innerText = '✨ Filter by Vibe';
      tagGroup.appendChild(tagLabel);

      const tagPillsBar = document.createElement('div');
      tagPillsBar.className = 'category-pills-bar';

      const allTagPill = document.createElement('div');
      allTagPill.className = 'cat-pill is-active';
      allTagPill.dataset.tag = 'All';
      allTagPill.innerText = 'All Vibes';
      tagPillsBar.appendChild(allTagPill);

      Array.from(tagsSet).sort().forEach(tagVal => {
        const pill = document.createElement('div');
        pill.className = 'cat-pill';
        pill.dataset.tag = tagVal;
        pill.innerText = tagVal;
        tagPillsBar.appendChild(pill);
      });

      tagGroup.appendChild(createScrollRow(tagPillsBar));
      form.appendChild(tagGroup);

      tagPillsBar.addEventListener('click', (e) => {
        const pill = e.target.closest('.cat-pill');
        if (!pill) return;
        const tagVal = pill.dataset.tag;

        if (tagVal === 'All') {
          activeTags.clear();
          activeTags.add('All');
          tagPillsBar.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('is-active'));
          allTagPill.classList.add('is-active');
        } else {
          allTagPill.classList.remove('is-active');
          activeTags.delete('All');
          if (activeTags.has(tagVal)) {
            activeTags.delete(tagVal);
            pill.classList.remove('is-active');
          } else {
            activeTags.add(tagVal);
            pill.classList.add('is-active');
          }
          if (activeTags.size === 0) {
            activeTags.add('All');
            allTagPill.classList.add('is-active');
          }
        }
        applyFilters();
      });
    }
  }

  function applyFilters() {
    updatePolaroidCaption(
      'Tap any pin to explore!',
      'Select a spot on the map to unlock details, category tags, and directions.',
      null,
      null
    );

    const bounds = new mapboxgl.LngLatBounds();
    let visibleCount = 0;

    allMarkers.forEach(item => {
      const matchesArea = (activeArea === 'All') || (item.neighborhood.toLowerCase() === activeArea.toLowerCase());
      const matchesCategory = activeCategories.has('All') || activeCategories.has(item.category);
      const matchesTag = activeTags.has('All') || item.tags.some(t => activeTags.has(t));

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

    const triggerCount = document.getElementById('trigger-count');
    if (triggerCount) {
      triggerCount.innerText = visibleCount;
    }

    if (activeArea === 'All') {
      map.flyTo({ center: dtlaCenter, zoom: 10.5, duration: 2000 });
    } else if (visibleCount >= 1) {
      map.fitBounds(bounds, { padding: 70, maxZoom: 14.0, duration: 2000 });
    } else {
      map.flyTo({ center: dtlaCenter, zoom: 10.5, duration: 2000 });
    }
  }

  async function trackAndDisplayViews() {
    const viewsBadge = document.getElementById('map-views-badge');
    if (!viewsBadge) return;
    const BASE_VIEWS = 30000; 

    try {
      const res = await fetch('https://api.counterapi.dev/v1/marlonwalksla/master-map-views/up');
      const data = await res.json();
      const apiCount = data.count || data.value || 0;
      viewsBadge.innerText = `${(BASE_VIEWS + apiCount).toLocaleString()} VIEWS`;
    } catch (err) {
      viewsBadge.innerText = `${BASE_VIEWS.toLocaleString()} VIEWS`;
    }
  }

  map.on('load', () => {
    applyFilters();
    trackAndDisplayViews();
  });
}

window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsload',
  async (listInstances) => {
    const [listInstance] = listInstances;
    if (listInstance && listInstance.renderingQueue) {
      await listInstance.renderingQueue;
    }
    initMarlonWalksMap();
  }
]);

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initMarlonWalksMap, 800);
});
