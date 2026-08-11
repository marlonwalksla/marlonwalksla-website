/* ==============================================================================
 * FILE: main-init.js
 * CATEGORY: MarlonWalksLA Website - Master Initialization & Data Bootstrap
 * ============================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initModeSwitcher();
  initExploreSubToggles();
  bootstrapDataFeed();
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
  });

  modeMyTripBtn.addEventListener('click', () => {
    modeMyTripBtn.classList.add('is-active');
    modeExploreBtn.classList.remove('is-active');

    if (panelMyTrip) panelMyTrip.style.display = 'block';
    if (panelExplore) panelExplore.style.display = 'none';

    // Refresh My Trip views when switching tabs
    if (window.initMyTripView && window.marlonGeoData) {
      window.initMyTripView(window.marlonGeoData.features);
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

function bootstrapDataFeed() {
  fetch('https://raw.githack.com/marlonwalksla/marlonwalksla-website/main/spots.geojson')
    .then(res => res.json())
    .then(data => {
      window.marlonGeoData = data;

      // Populate Explore LA view (Dropdowns + Spot Cards)
      if (window.initExploreView) {
        window.initExploreView(data);
      }

      // Populate My Trip view
      if (window.initMyTripView && data.features) {
        window.initMyTripView(data.features);
      }
    })
    .catch(err => console.error("Error loading spots.geojson:", err));
}
