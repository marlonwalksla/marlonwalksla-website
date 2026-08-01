function initMarlonWalksMap() {
  if (window.marlonMapInitialized) return;
  window.marlonMapInitialized = true;

  // =============================================================
  // A. POLAROID SWIPER ENGINE & 3D CARD FLIP MECHANICS
  // =============================================================
  const roots = document.querySelectorAll('.pc-root');
  
  roots.forEach((root) => {
    if (root.getAttribute('data-swiper-initialized') === 'true') return;
    root.setAttribute('data-swiper-initialized', 'true');

    const wrapper = root.querySelector('.swiper-wrapper');
    const swiperContainer = root.querySelector('.swiper');
    if (!wrapper || !swiperContainer) return;

    const rotationPatterns = [-3, 2, -1.5, 3, -2];
    const items = Array.from(wrapper.children);
    
    items.forEach((item, index) => {
      const card = item.querySelector('.pc-card');
      if (card) {
        const rotationAngle = rotationPatterns[index % rotationPatterns.length];
        card.style.setProperty('--card-rot', `${rotationAngle}deg`);
      }
    });
    
    if (items.length > 0 && items.length < 8) {
      const dupsNeeded = Math.ceil(8 / items.length) - 1;
      for (let i = 0; i < dupsNeeded; i++) {
        items.forEach(item => {
          const clone = item.cloneNode(true);
          wrapper.appendChild(clone);
        });
      }
    }

    const cards = root.querySelectorAll('.pc-card');
    cards.forEach(card => {
      if (!card.querySelector('.pc-flip-area')) {
        const button = card.querySelector('.pc-button');
        const cmsText = card.querySelector('.pc-description-back');
        const cmsMascot = card.querySelector('.pc-image-back');

        const childrenToWrap = Array.from(card.children).filter(
          child => child !== button && child !== cmsText && child !== cmsMascot
        );
        
        const flipArea = document.createElement('div');
        flipArea.className = 'pc-flip-area';
        const flipInner = document.createElement('div');
        flipInner.className = 'pc-flip-inner';
        const faceFront = document.createElement('div');
        faceFront.className = 'pc-face-front';
        const faceBack = document.createElement('div');
        faceBack.className = 'pc-face-back';

        childrenToWrap.forEach(child => faceFront.appendChild(child));

        const frontHint = document.createElement('div');
        frontHint.className = 'pc-front-hint';
        frontHint.innerText = 'Tap to flip ↺';
        faceFront.appendChild(frontHint);

        if (cmsText && cmsText.innerHTML.trim() !== '') {
          const backTextContainer = document.createElement('div');
          backTextContainer.className = 'pc-description-back';
          backTextContainer.innerHTML = cmsText.innerHTML;
          faceBack.appendChild(backTextContainer);
        }

        if (cmsMascot && (cmsMascot.getAttribute('src') || cmsMascot.dataset.src)) {
          const mascotImg = document.createElement('img');
          mascotImg.className = 'pc-image-back';
          mascotImg.src = cmsMascot.getAttribute('src') || cmsMascot.dataset.src;
          mascotImg.alt = cmsMascot.getAttribute('alt') || 'Mascot';
          faceBack.appendChild(mascotImg);
        }

        const backHint = document.createElement('div');
        backHint.className = 'pc-back-hint';
        backHint.innerText = 'Tap to flip ↺';
        faceBack.appendChild(backHint);

        flipInner.appendChild(faceFront);
        flipInner.appendChild(faceBack);
        flipArea.appendChild(flipInner);
        
        if (button) {
          card.insertBefore(flipArea, button);
        } else {
          card.appendChild(flipArea);
        }
      }
    });

    root.addEventListener('click', (e) => {
      const flipArea = e.target.closest('.pc-flip-area');
      if (!flipArea) return;
      const card = flipArea.closest('.pc-card');
      if (card && !card.classList.contains('is-swiping')) {
        flipArea.classList.toggle('is-flipped');
      }
    });

    let touchStartX = 0;

    window.swiperInstance = new Swiper(swiperContainer, {
      loop: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      spaceBetween: 40,
      speed: 400,
      grabCursor: true,
      touchRatio: 1.0,
      observer: true,
      observeParents: true,

      breakpoints: {
        0: { spaceBetween: 25 },
        480: { spaceBetween: 40 }
      },

      on: {
        touchStart(s, e) {
          touchStartX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
        },
        touchMove(s, e) {
          const currentX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
          const diffX = currentX - touchStartX;
          const activeSlide = s.slides[s.activeIndex];
          
          if (activeSlide) {
            const activeCard = activeSlide.querySelector('.pc-card');
            if (activeCard) {
              activeCard.classList.add('is-swiping');
              const dragRot = Math.max(-8, Math.min(8, diffX * 0.04));
              activeCard.style.setProperty('--drag-rot', `${dragRot}deg`);
            }
          }
        },
        touchEnd(s) {
          s.slides.forEach(slide => {
            const activeCard = slide.querySelector('.pc-card');
            if (activeCard) {
              activeCard.style.setProperty('--drag-rot', '0deg');
              setTimeout(() => activeCard.classList.remove('is-swiping'), 100);
            }
          });
        }
      }
    });
  });

  // =============================================================
  // B. MAPBOX & HERO POLAROID ENGINE (8 CATEGORIES & TAGS)
  // =============================================================
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

  // CLEAN VECTOR SVG ICONS FOR THE 8 PRIMARY CATEGORIES & ALIASES
  const defaultPinSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

  const categoryMap = {
    'cafes': { color: '#a855f7', name: 'Cafes', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>' },
    'coffee-cafes': { color: '#a855f7', name: 'Cafes', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>' },

    'dining': { color: '#ef4444', name: 'Dining', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v20M21 2v6a3 3 0 0 1-3 3M3 2v7a4 4 0 0 0 4 4v9M11 2v20"/></svg>' },
    'food-dining': { color: '#ef4444', name: 'Dining', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v20M21 2v6a3 3 0 0 1-3 3M3 2v7a4 4 0 0 0 4 4v9M11 2v20"/></svg>' },

    'nightlife': { color: '#6366f1', name: 'Nightlife', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8M12 15v7M19 3l-7 8-7-7h14z"/></svg>' },
    'nightlife-bars': { color: '#6366f1', name: 'Nightlife', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8M12 15v7M19 3l-7 8-7-7h14z"/></svg>' },

    'landmarks': { color: '#f59e0b', name: 'Landmarks', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
    'must-see': { color: '#f59e0b', name: 'Landmarks', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },

    'arts': { color: '#ec4899', name: 'Arts', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>' },
    'museums-art': { color: '#ec4899', name: 'Arts', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>' },

    'shopping': { color: '#06b6d4', name: 'Shopping', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>' },
    'shopping-markets': { color: '#06b6d4', name: 'Shopping', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>' },

    'parks': { color: '#10b981', name: 'Parks', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 18h8M12 2L3 14h18L12 2z"/></svg>' },
    'parks-open-spaces': { color: '#10b981', name: 'Parks', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 18h8M12 2L3 14h18L12 2z"/></svg>' },

    'entertainment': { color: '#14b8a6', name: 'Entertainment', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h.01M18 12h.01M10 12h4"/></svg>' },
    'entertainment-sports': { color: '#14b8a6', name: 'Entertainment', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h.01M18 12h.01M10 12h4"/></svg>' }
  };

  function getCategoryDetails(rawCat, overrideColor) {
    if (!rawCat) return { color: overrideColor || '#3898ec', icon: defaultPinSvg, name: 'Spot' };
    
    const key = String(rawCat)
      .toLowerCase()
      .replace(/&amp;/g, 'and')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
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
    const customColor = cleanText(item.getAttribute('data-color') || item.getAttribute('data-pin-color') || '');
    const neighborhood = cleanText(item.getAttribute('data-neighborhood') || 'Downtown LA');
    const rawTagsStr = cleanText(item.getAttribute('data-tags') || '');

    const catDetails = getCategoryDetails(rawCategory, customColor);

    if (neighborhood) neighborhoods.add(neighborhood);
    if (rawCategory) categories.add(rawCategory);

    const parsedTags = rawTagsStr ? rawTagsStr.split(';').map(t => t.trim()).filter(Boolean) : [];
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

      const marker = new mapboxgl.Marker({ element: wrapper })
        .setLngLat([lng, lat]);

      wrapper.addEventListener('click', () => {
        const tagsFormatted = parsedTags.length ? `\nTags: ${parsedTags.join(', ')}` : '';
        const captionMeta = `${neighborhood}  •  ${catDetails.name}\n${desc}${tagsFormatted}`;
        updatePolaroidCaption(title, captionMeta, lat, lng);
        
        // Comfortably frame pin while keeping neighborhood context visible
        const targetZoom = Math.min(Math.max(map.getZoom(), 13.5), 14.0);
        map.flyTo({ center: [lng, lat], zoom: targetZoom, duration: 1800 });

        if (window.swiperInstance) {
          window.swiperInstance.slideToLoop(index);
        }
      });

      allMarkers.push({
        marker: marker,
        lng: lng,
        lat: lat,
        neighborhood: neighborhood,
        category: rawCategory,
        tags: parsedTags
      });
    }
  });

  const form = document.querySelector('.filter-bar form');
  let activeArea = 'All';
  const activeCategories = new Set(['All']);
  const activeTags = new Set(['All']);
  let countBadgeEl = null;

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

    leftBtn.addEventListener('click', () => {
      pillsBar.scrollBy({ left: -240, behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
      pillsBar.scrollBy({ left: 240, behavior: 'smooth' });
    });

    container.appendChild(leftBtn);
    container.appendChild(pillsBar);
    container.appendChild(rightBtn);

    return container;
  }

  if (form) {
    form.querySelectorAll('.dashboard-group').forEach(el => el.remove());

    // 1. DYNAMIC NEIGHBORHOOD DASHBOARD GROUP
    const areaGroup = document.createElement('div');
    areaGroup.className = 'dashboard-group';

    const areaLabel = document.createElement('div');
    areaLabel.className = 'dashboard-label';
    
    const labelText = document.createElement('span');
    labelText.innerText = '📍 Neighborhoods';
    
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
    viewsBadgeEl.innerText = '👁️ 30,000 VIEWS';

    badgeContainer.appendChild(countBadgeEl);
    badgeContainer.appendChild(viewsBadgeEl);

    areaLabel.appendChild(labelText);
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

    const areaRow = createScrollRow(areaPillsBar);
    areaGroup.appendChild(areaRow);
    form.appendChild(areaGroup); 

    areaPillsBar.addEventListener('click', (e) => {
      const pill = e.target.closest('.area-pill');
      if (!pill) return;

      activeArea = pill.dataset.area;
      areaPillsBar.querySelectorAll('.area-pill').forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');

      applyFilters();
    });

    // 2. DYNAMIC CATEGORIES DASHBOARD GROUP
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

    // 3. DYNAMIC TAGS DASHBOARD GROUP
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

      const tagRow = createScrollRow(tagPillsBar);
      tagGroup.appendChild(tagRow);
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

  // 4. MULTI-SELECT MAP FILTERING (NEIGHBORHOODS + CATEGORIES + TAGS)
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
      const matchesArea = (activeArea === 'All') || 
                          (item.neighborhood.toLowerCase() === activeArea.toLowerCase());

      const matchesCategory = activeCategories.has('All') || 
                               activeCategories.has(item.category);

      const matchesTag = activeTags.has('All') || 
                         item.tags.some(t => activeTags.has(t));

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

    if (activeArea === 'All') {
      map.flyTo({ center: dtlaCenter, zoom: 10.5, duration: 2000 });
    } else if (visibleCount >= 1) {
      // Automatically fit bounds around all visible pins in the neighborhood
      map.fitBounds(bounds, { padding: 70, maxZoom: 14.0, duration: 2000 });
    } else {
      map.flyTo({ center: dtlaCenter, zoom: 10.5, duration: 2000 });
    }
  }

  // 5. FETCH AND INCREMENT TOTAL MAP VIEWS
  async function trackAndDisplayViews() {
    const viewsBadge = document.getElementById('map-views-badge');
    if (!viewsBadge) return;

    const BASE_VIEWS = 30000; 

    try {
      const res = await fetch('https://api.counterapi.dev/v1/marlonwalksla/master-map-views/up');
      const data = await res.json();
      const apiCount = data.count || data.value || 0;
      const totalViews = BASE_VIEWS + apiCount;
      viewsBadge.innerText = `👁️ ${totalViews.toLocaleString()} VIEWS`;
    } catch (err) {
      viewsBadge.innerText = `👁️ ${BASE_VIEWS.toLocaleString()} VIEWS`;
    }
  }

  map.on('load', () => {
    applyFilters();
    trackAndDisplayViews();
  });
}

// LISTEN TO FINSWEET CMS LOAD EVENT
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
