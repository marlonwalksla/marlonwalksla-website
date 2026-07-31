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
  // B. MAPBOX & HERO POLAROID ENGINE
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

  // UNIVERSAL CATEGORY DICTIONARY (SUPPORTS OLD & NEW NAMES)
  const categoryMap = {
    'iconic-la-landmarks': { color: '#f59e0b', emoji: '📸', name: 'Iconic Landmarks' },
    'iconic landmarks': { color: '#f59e0b', emoji: '📸', name: 'Iconic Landmarks' },
    'must-see': { color: '#f59e0b', emoji: '⭐', name: 'Must See' },
    'must see': { color: '#f59e0b', emoji: '⭐', name: 'Must See' },

    'parks-views': { color: '#10b981', emoji: '🌲', name: 'Parks & Views' },
    'parks & views': { color: '#10b981', emoji: '🌲', name: 'Parks & Views' },

    'quick-bites-street-food': { color: '#f97316', emoji: '🌮', name: 'Quick Bites' },
    'quick bites & street food': { color: '#f97316', emoji: '🌮', name: 'Quick Bites' },

    'sit-down-dining': { color: '#ef4444', emoji: '🍽️', name: 'Sit-Down Dining' },
    'sit down dining': { color: '#ef4444', emoji: '🍽️', name: 'Sit-Down Dining' },
    'food-dining': { color: '#ef4444', emoji: '🍔', name: 'Food & Dining' },
    'food & dining': { color: '#ef4444', emoji: '🍔', name: 'Food & Dining' },

    'coffee-treats': { color: '#a855f7', emoji: '☕', name: 'Coffee & Treats' },
    'coffee & treats': { color: '#a855f7', emoji: '☕', name: 'Coffee & Treats' },

    'nightlife-bars': { color: '#6366f1', emoji: '🍸', name: 'Nightlife & Bars' },
    'nightlife & bars': { color: '#6366f1', emoji: '🍸', name: 'Nightlife & Bars' },

    'malls-outlets': { color: '#06b6d4', emoji: '🛍️', name: 'Malls & Outlets' },
    'malls & outlets': { color: '#06b6d4', emoji: '🛍️', name: 'Malls & Outlets' },
    'shopping': { color: '#06b6d4', emoji: '🛍️', name: 'Shopping' },

    'local-shopping-districts': { color: '#3b82f6', emoji: '🏘️', name: 'Local Shopping' },
    'local shopping districts': { color: '#3b82f6', emoji: '🏘️', name: 'Local Shopping' },

    'museums-art': { color: '#ec4899', emoji: '🎨', name: 'Museums & Art' },
    'museums & art': { color: '#ec4899', emoji: '🎨', name: 'Museums & Art' },

    'entertainment-sports': { color: '#14b8a6', emoji: '🍿', name: 'Entertainment & Sports' },
    'entertainment & sports': { color: '#14b8a6', emoji: '🍿', name: 'Entertainment & Sports' }
  };

  function getCategoryDetails(rawCat) {
    if (!rawCat) return { color: '#3898ec', emoji: '📍', name: 'Spot' };
    const key = String(rawCat).toLowerCase().replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    if (categoryMap[key]) return categoryMap[key];
    const slugKey = key.replace(/ /g, '-').replace(/&/g, '').replace(/--/g, '-');
    if (categoryMap[slugKey]) return categoryMap[slugKey];
    return { color: '#3898ec', emoji: '📍', name: rawCat };
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
  const coordTracker = {}; 

  document.querySelectorAll('.map-location-marker').forEach((item, index) => {
    let lat = parseFloat(item.getAttribute('data-lat'));
    let lng = parseFloat(item.getAttribute('data-lng'));
    const title = cleanText(item.getAttribute('data-title') || 'Location');
    const desc = cleanText(item.getAttribute('data-desc') || '');
    const rawCategory = cleanText(item.getAttribute('data-category') || 'must-see');
    const neighborhood = cleanText(item.getAttribute('data-neighborhood') || 'Downtown LA');

    const catDetails = getCategoryDetails(rawCategory);

    if (neighborhood) neighborhoods.add(neighborhood);
    if (rawCategory) categories.add(rawCategory);

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
      inner.innerText = catDetails.emoji;

      wrapper.appendChild(inner);

      const marker = new mapboxgl.Marker({ element: wrapper })
        .setLngLat([lng, lat]);

      wrapper.addEventListener('click', () => {
        const captionMeta = `${neighborhood}  •  ${catDetails.name}\n${desc}`;
        updatePolaroidCaption(title, captionMeta, lat, lng);
        
        const targetZoom = Math.max(map.getZoom(), 15.5);
        map.flyTo({ center: [lng, lat], zoom: targetZoom, duration: 2500 });

        if (window.swiperInstance) {
          window.swiperInstance.slideToLoop(index);
        }
      });

      allMarkers.push({
        marker: marker,
        lng: lng,
        lat: lat,
        neighborhood: neighborhood,
        category: rawCategory
      });
    }
  });

  const form = document.querySelector('.filter-bar form');
  let activeArea = 'All';
  const activeCategories = new Set(['All']);
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
    allAreaPill.innerText = '🌐 All LA';
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
    form.prepend(areaGroup); 

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
    allCatPill.innerText = '🌐 All Categories';
    catPillsBar.appendChild(allCatPill);

    Array.from(categories).sort().forEach(cat => {
      const pill = document.createElement('div');
      pill.className = 'cat-pill';
      pill.dataset.category = cat;
      
      const catDetails = getCategoryDetails(cat);
      pill.innerText = `${catDetails.emoji} ${catDetails.name}`; 
      
      catPillsBar.appendChild(pill);
    });

    const catRow = createScrollRow(catPillsBar);
    catGroup.appendChild(catRow);
    form.insertBefore(catGroup, form.children[1]); 

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
  }

  // 3. MULTI-SELECT MAP FILTERING
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

      const matchesActivity = activeCategories.has('All') || 
                              activeCategories.has(item.category);

      if (matchesArea && matchesActivity) {
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

    const currentZoom = map.getZoom();

    if (activeArea === 'All') {
      const targetZoom = Math.max(currentZoom, 10.5);
      map.flyTo({ center: dtlaCenter, zoom: targetZoom, duration: 2500 });
    } else if (visibleCount >= 1) {
      const center = bounds.getCenter();
      const targetZoom = Math.max(currentZoom, 13.5);
      map.flyTo({ center: [center.lng, center.lat], zoom: targetZoom, duration: 2500 });
    } else {
      map.flyTo({ center: dtlaCenter, zoom: 10.5, duration: 2500 });
    }
  }

  // 4. FETCH AND INCREMENT TOTAL MAP VIEWS
  async function trackAndDisplayViews() {
    const viewsBadge = document.getElementById('map-views-badge');
    if (!viewsBadge) return;

    const BASE_VIEWS = 30000; 

    try {
      const res = await fetch('https://api.counterapi.dev/v1/marlonwalksla/master-map-views/up');
      const data = await res.json();
      const apiCount = data.count || data.value || 0;
      const totalViews = BASE_VIEWS + apiCount;
      viewsBadge.innerText = `${totalViews.toLocaleString()} VIEWS`;
    } catch (err) {
      viewsBadge.innerText = `${BASE_VIEWS.toLocaleString()} VIEWS`;
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
