/* ==============================================================================
 * FILE: main-init.js
 * CATEGORY: MarlonWalksLA Website - Master Initialization & CMS Load
 * 
 * OVERVIEW:
 * Acts as the master controller for the website's custom JavaScript. It prevents 
 * scripts from firing prematurely by waiting for Webflow's DOM to load and, 
 * more importantly, for Finsweet's CMS Load attributes to finish rendering 
 * the dynamic tour stop data on the page before executing the logic.
 * 
 * WHAT'S INSIDE:
 * - `window.initMarlonWalksMap`: The master function that triggers both the 
 *   flip cards (`initFlipCards`) and the map engine (`initMapEngine`).
 * - A Finsweet (`fsAttributes`) event listener that waits for the CMS rendering queue.
 * - A fallback `DOMContentLoaded` event listener with an 800ms delay to ensure 
 *   everything fires smoothly.
 * 
 * WHEN TO FEED THIS FILE TO GEMINI / AI:
 * - Feed this file if you want to: Fix timing or loading issues (e.g., the map or cards attempt to load before the Webflow CMS data is ready).
 * - Feed this file if you want to: Add new modular JavaScript files that also need to wait for Finsweet to finish loading.
 * - Feed this file if you want to: Adjust the 800ms fallback timeout delay.
 * ============================================================================== */

/* =============================================================
   main-init.js
   FINSWEET CMS LOAD & INITIALIZATION
   ============================================================= */
window.initMarlonWalksMap = function() {
  if (window.marlonMapInitialized) return;
  window.marlonMapInitialized = true;

  if (typeof window.initFlipCards === 'function') window.initFlipCards();
  if (typeof window.initMapEngine === 'function') window.initMapEngine();
};

// LISTEN TO FINSWEET CMS LOAD EVENT
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsload',
  async (listInstances) => {
    const [listInstance] = listInstances;
    if (listInstance && listInstance.renderingQueue) {
      await listInstance.renderingQueue;
    }
    window.initMarlonWalksMap();
  }
]);

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(window.initMarlonWalksMap, 800);
});
