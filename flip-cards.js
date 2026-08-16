/* ==============================================================================
 * FILE: flip-cards.js
 * CATEGORY: MarlonWalksLA Website - Review Cards Swiper & White Plate Engine
 * ============================================================================== */

window.initFlipCards = function() {
  const roots = document.querySelectorAll('.pc-root');
  if (!roots.length) return;

  roots.forEach((root) => {
    if (root.getAttribute('data-swiper-initialized') === 'true') return;
    root.setAttribute('data-swiper-initialized', 'true');

    const wrapper = root.querySelector('.swiper-wrapper');
    const swiperContainer = root.querySelector('.swiper');
    if (!wrapper || !swiperContainer) return;

    // 1. Process Review Cards Only (Leaves Landmark Guides untouched)
    const cards = root.querySelectorAll('.pc-card');
    cards.forEach(card => {
      const descBack = card.querySelector('.pc-description-back');
      const mascot = card.querySelector('.pc-image-back');
      const title = card.querySelector('.pc-title');

      const isReviewCard = descBack && descBack.innerHTML.trim() !== '';

      if (isReviewCard && !card.querySelector('.pc-review-plate')) {
        // Only format stars if they actually exist in the CMS field
        if (title) {
          const rawTitle = title.innerText || title.textContent || '';
          const starMatch = rawTitle.match(/[⭐★\u2605\u2B50]+/g);
          if (starMatch) {
            const stars = starMatch.join(' ');
            const nameOnly = rawTitle.replace(/[⭐★\u2605\u2B50]/g, '').trim();
            title.innerHTML = `<span class="pc-reviewer-name">${nameOnly}</span><span class="pc-reviewer-stars">${stars}</span>`;
          }
        }

        // Build white framed inset plate below the photo
        const plate = document.createElement('div');
        plate.className = 'pc-review-plate';

        const footerRow = document.createElement('div');
        footerRow.className = 'pc-footer-row';

        card.insertBefore(plate, descBack);
        plate.appendChild(descBack);

        if (mascot) footerRow.appendChild(mascot);
        if (title) footerRow.appendChild(title);
        plate.appendChild(footerRow);
      }
    });

    // 2. Natural organic Polaroid scatter rotation angles
    const rotationPatterns = [-2.5, 1.8, -1.2, 2.2, -1.8, 1.5];
    const items = Array.from(wrapper.children);
    
    items.forEach((item, index) => {
      const card = item.querySelector('.pc-card');
      if (card) {
        const rotationAngle = rotationPatterns[index % rotationPatterns.length];
        card.style.setProperty('--card-rot', `${rotationAngle}deg`);
      }
    });

    // 3. Swiper Drag Scroll Physics
    let touchStartX = 0;

    new Swiper(swiperContainer, {
      slidesPerView: 'auto',
      spaceBetween: 20,
      grabCursor: true,
      freeMode: {
        enabled: true,
        sticky: false,
        momentumBounce: false,
      },
      observer: true,
      observeParents: true,

      breakpoints: {
        0: { spaceBetween: 14 },
        768: { spaceBetween: 20 }
      },

      on: {
        touchStart(s, e) {
          touchStartX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
        },
        touchMove(s, e) {
          const currentX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
          const diffX = currentX - touchStartX;
          
          if (Math.abs(diffX) > 8) {
            const activeSlide = s.slides[s.activeIndex];
            if (activeSlide) {
              const activeCard = activeSlide.querySelector('.pc-card');
              if (activeCard) {
                activeCard.classList.add('is-swiping');
                const dragRot = Math.max(-6, Math.min(6, diffX * 0.03));
                activeCard.style.setProperty('--drag-rot', `${dragRot}deg`);
              }
            }
          }
        },
        touchEnd(s) {
          s.slides.forEach(slide => {
            const activeCard = slide.querySelector('.pc-card');
            if (activeCard) {
              activeCard.style.setProperty('--drag-rot', '0deg');
              setTimeout(() => activeCard.classList.remove('is-swiping'), 120);
            }
          });
        }
      }
    });
  });
};
