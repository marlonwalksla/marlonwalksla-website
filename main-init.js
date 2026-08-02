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