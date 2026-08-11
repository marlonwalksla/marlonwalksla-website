/* ==============================================================================
 * FILE: main-init.js
 * CATEGORY: MarlonWalksLA Website - Master Initialization & 2-Mode Bootstrapper
 * ============================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initModeSwitcher();
  initExploreSubToggles();

  // Trigger Mapbox Engine
  if (typeof window.initMapEngine === 'function') {
    window.initMapEngine();
  }
});

function initModeSwitcher() {
  const modeExploreBtn = document.querySelector('[data-mode="explore"]');
  const modeMyTripBtn = document.querySelector('[data-mode="mytrip"]');
  
  const panelExplore = document.getElementById('panel-explore');
  const panelMyTrip = document.getElementById('panel-mytrip');

  if (!modeExploreBtn || !modeMyTripBtn) return;

  modeExploreBtn.addEventListener('click', () => {
    modeExploreBtn.classList.add('is-active');
    modeMyTripBtn.classList.remove('is-active');

    if (panelExplore) panelExplore.style.display = 'block';
    if (panelMyTrip) panelMyTrip.style.display = 'none';

    if (window.marlonMapInstance) {
      setTimeout(() => window.marlonMapInstance.resize(), 50);
    }
  });

  modeMyTripBtn.addEventListener('click', () => {
    modeMyTripBtn.classList.add('is-active');
    modeExploreBtn.classList.remove('is-active');

    if (panelMyTrip) panelMyTrip.style.display = 'block';
    if (panelExplore) panelExplore.style.display = 'none';

    if (window.initMyTripView && window.marlonGeoData) {
      window.initMyTripView(window.marlonGeoData.features);
    }

    if (window.marlonMapInstance) {
      setTimeout(() => window.marlonMapInstance.resize(), 50);
    }
  });
}

function initExploreSubToggles() {
  const subPlacesBtn = document.querySelector('[data-explore-tab="places"]');
  const subToursBtn = document.querySelector('[data-explore-tab="tours"]');
  
  const viewPlaces = document.getElementById('view-places');
  const viewTours = document.getElementById('view-tours');

  if (!subPlacesBtn || !subToursBtn) return;

  subPlacesBtn.addEventListener('click', () => {
    subPlacesBtn.classList.add('is-active');
    subToursBtn.classList.remove('is-active');
    if (viewPlaces) viewPlaces.style.display = 'block';
    if (viewTours) viewTours.style.display = 'none';
  });

  subToursBtn.addEventListener('click', () => {
    subToursBtn.classList.add('is-active');
    subPlacesBtn.classList.remove('is-active');
    if (viewTours) viewTours.style.display = 'block';
    if (viewPlaces) viewPlaces.style.display = 'none';
  });
}
