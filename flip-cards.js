/* ==============================================================================
 * FILE: flip-cards.js
 * CATEGORY: MarlonWalksLA Website - Review Cards Swiper & Unified Footer Group
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

    // 1. Bundle Ernesto + Reviewer Name/Stars into a single centered group
    const cards = root.querySelectorAll('.pc-card');
    cards.forEach(card => {
      const mascot = card.querySelector('.pc-image-back');
      const title = card.querySelector('.pc-title');

      // Break stars onto their own clean line
      if (title && !title.querySelector('.pc-reviewer-stars')) {
        const rawText = title.innerText || title.textContent;
        if (rawText.includes('⭐') || rawText.includes('★')) {
          const starMatch = rawText.match(/[⭐★\s]+/);
          const stars = starMatch ? starMatch[0].trim() : '⭐⭐⭐⭐⭐';
          const nameOnly = rawText.replace(/[⭐★]/g, '').trim();
          title.innerHTML = `<span class="pc-reviewer-name">${nameOnly}</span><span class="pc-reviewer-stars">${stars}</span>`;
        }
      }

      // Group mascot + title together
      if (mascot && title && !card.querySelector('.pc-footer-group')) {
        const footerGroup = document.createElement('div');
        footerGroup.className = 'pc-footer-group';
        card.insertBefore(footerGroup, mascot);
        footerGroup.appendChild(mascot);
        footerGroup.appendChild(title);
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
