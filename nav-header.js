/* ==============================================================================
 * FILE: nav-header.js
 * CATEGORY: MarlonWalksLA Website - Global Navigation Header & Mobile Menu Interactions
 * ============================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navCollapseArea = document.querySelector(".nav-collapse-area");

  if (mobileToggle && navCollapseArea) {
    mobileToggle.addEventListener("click", () => {
      // Toggles the menu visibility on mobile
      navCollapseArea.classList.toggle("active");
      
      // Optional: Animate the hamburger lines into an 'X'
      mobileToggle.classList.toggle("is-open");
    });
  }
});
