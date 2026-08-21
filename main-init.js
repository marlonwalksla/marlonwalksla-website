/* ==============================================================================
 * FILE: main-init.js
 * CATEGORY: MarlonWalksLA Website - Master Initialization & Dynamic Tab Counter
 * ============================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initModeSwitcher();

  // 1. Initialize Interactive Tour & Review Polaroid Slider
  if (typeof window.initFlipCards === 'function') {
    window.initFlipCards();
  }

  // 2. Initialize Interactive Mapbox Engine
  if (typeof window.initMapEngine === 'function') {
    window.initMapEngine();
  }
});

// Dynamic counter for Explore and My Trip tabs
window.updateNavTabCounts = function() {
  const modeExploreBtn = document.querySelector('[data-mode="explore"]');
  const modeMyTripBtn = document.querySelector('[data-mode="mytrip"]');
  
  const totalExplore = (window.marlonGeoData && window.marlonGeoData.features) ? window.marlonGeoData.features.length : 0;
  
  const tripData = window.MarlonStorage ? window.MarlonStorage.getSavedTripData() : null;
  const savedMap = tripData ? (tripData.days || {}) : {};
  const totalPinned = Object.keys(savedMap).length;

  if (modeExploreBtn) {
    modeExploreBtn.textContent = `🧭 Explore LA (${totalExplore})`;
  }
  if (modeMyTripBtn) {
    modeMyTripBtn.textContent = `🧳 My Trip (${totalPinned})`;
  }
};

function initModeSwitcher() {
  const modeExploreBtn = document.querySelector('[data-mode="explore"]');
  const modeToursBtn = document.querySelector('[data-mode="tours"]');
  const modeMyTripBtn = document.querySelector('[data-mode="mytrip"]');
  
  const panelExplore = document.getElementById('panel-explore');
  const panelTours = document.getElementById('panel-tours');
  const panelMyTrip = document.getElementById('panel-mytrip');

  if (!modeExploreBtn || !modeMyTripBtn) return;

  // 1. EXPLORE LA TAB
  modeExploreBtn.addEventListener('click', () => {
    modeExploreBtn.classList.add('is-active');
    if (modeToursBtn) modeToursBtn.classList.remove('is-active');
    modeMyTripBtn.classList.remove('is-active');

    if (panelExplore) panelExplore.style.display = 'block';
    if (panelTours) panelTours.style.display = 'none';
    if (panelMyTrip) panelMyTrip.style.display = 'none';

    // Reapply places filters to reset the map pins
    if (window.reapplyExploreFilters) window.reapplyExploreFilters();
    if (window.marlonMapInstance) setTimeout(() => window.marlonMapInstance.resize(), 50);
  });

  // 2. TOURS TAB
  if (modeToursBtn) {
    modeToursBtn.addEventListener('click', () => {
      modeToursBtn.classList.add('is-active');
      modeExploreBtn.classList.remove('is-active');
      modeMyTripBtn.classList.remove('is-active');

      if (panelTours) panelTours.style.display = 'block';
      if (panelExplore) panelExplore.style.display = 'none';
      if (panelMyTrip) panelMyTrip.style.display = 'none';

      isolateTourPinsOnMap();
      if (window.marlonMapInstance) setTimeout(() => window.marlonMapInstance.resize(), 50);
    });
  }

  // 3. MY TRIP TAB
  modeMyTripBtn.addEventListener('click', () => {
    modeMyTripBtn.classList.add('is-active');
    modeExploreBtn.classList.remove('is-active');
    if (modeToursBtn) modeToursBtn.classList.remove('is-active');

    if (panelMyTrip) panelMyTrip.style.display = 'block';
    if (panelExplore) panelExplore.style.display = 'none';
    if (panelTours) panelTours.style.display = 'none';

    if (window.initMyTripView) {
      const spotFeatures = (window.marlonGeoData && window.marlonGeoData.features) ? window.marlonGeoData.features : [];
      window.initMyTripView(spotFeatures);
    }
    if (window.marlonMapInstance) setTimeout(() => window.marlonMapInstance.resize(), 50);
  });
}

// Custom function to only show pins that belong to your tours
function isolateTourPinsOnMap() {
  if (!window.MARLON_ROUTES_PRESETS || !window.marlonGeoData) return;
  
  // Gather all spot titles that exist inside your preset tours
  let tourSpotTitles = [];
  window.MARLON_ROUTES_PRESETS.forEach(preset => {
    tourSpotTitles = tourSpotTitles.concat(preset.spotTitles);
  });

  // Filter the GeoJSON features to only include those matching tour spots
  const tourFeatures = window.marlonGeoData.features.filter(feature => {
    const spotName = feature.properties.Name || feature.properties.title || '';
    return tourSpotTitles.some(title => spotName.toLowerCase().includes(title.toLowerCase()));
  });

  // Send the filtered list to the map engine to update the canvas
  if (window.updateMapMarkers) {
    window.updateMapMarkers(tourFeatures);
  }
}
