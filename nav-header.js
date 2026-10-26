/* ==============================================================================
 * FILE: nav-header.js
 * CATEGORY: MarlonWalksLA Website - Mobile Navigation Menu Toggle
 * ============================================================================== */

// Oct 26, 2026: mark the live domain so tour-pages.css can hide draft marks there (test site keeps them).
try { if (/^(www\.)?marlonwalksla\.com$/i.test(location.hostname)) document.documentElement.classList.add('mw-live'); } catch (e) {}

document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navCollapse = document.querySelector('.nav-collapse-area');

  if (mobileToggle && navCollapse) {
    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navCollapse.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });

    // Close menu when tapping outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navCollapse.contains(e.target)) {
        navCollapse.classList.remove('active');
        mobileToggle.classList.remove('active');
      }
    });
  }
});
