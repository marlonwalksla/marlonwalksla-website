// main-init.js

document.addEventListener('DOMContentLoaded', () => {
  initModeSwitcher();
  initExploreSubToggles();
});

function initModeSwitcher() {
  const modeExploreBtn = document.querySelector('[data-mode="explore"]');
  const modeMyTripBtn = document.querySelector('[data-mode="mytrip"]');
  
  const panelExplore = document.getElementById('panel-explore');
  const panelMyTrip = document.getElementById('panel-mytrip');

  if (!modeExploreBtn || !modeMyTripBtn) return;

  modeExploreBtn.addEventListener('click', () => {
    // Active State UI
    modeExploreBtn.classList.add('is-active');
    modeMyTripBtn.classList.remove('is-active');

    // Panel Visibility
    panelExplore.style.display = 'block';
    panelMyTrip.style.display = 'none';
  });

  modeMyTripBtn.addEventListener('click', () => {
    // Active State UI
    modeMyTripBtn.classList.add('is-active');
    modeExploreBtn.classList.remove('is-active');

    // Panel Visibility
    panelMyTrip.style.display = 'block';
    panelExplore.style.display = 'none';
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
    viewPlaces.style.display = 'block';
    viewTours.style.display = 'none';
  });

  subToursBtn.addEventListener('click', () => {
    subToursBtn.classList.add('is-active');
    subPlacesBtn.classList.remove('is-active');
    viewTours.style.display = 'block';
    viewPlaces.style.display = 'none';
  });
}
