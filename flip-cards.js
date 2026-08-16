/* ==============================================================================
 * FILE: flip-cards.js
 * CATEGORY: MarlonWalksLA Website - Polaroid Reviews Carousel
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

    // 1. Split Reviewer Name on line 1 and Gold Stars on line 2 (Only if stars exist in text)
    const titles = root.querySelectorAll('.pc-title');
    titles.forEach(titleEl => {
      if (!titleEl.querySelector('.pc-reviewer-stars')) {
        const rawText = titleEl.innerText || titleEl.textContent || '';
        const starMatch = rawText.match(/[⭐★\u2605\u2B50]+/g);
        if (starMatch) {
          const stars = starMatch.join(' ');
          const nameOnly = rawText.replace(/[⭐★\u2605\u2B50]/g, '').trim();
          titleEl.innerHTML = `<span class="pc-reviewer-name">${nameOnly}</span><span class="pc-reviewer-stars">${stars}</span>`;
        }
      }
    });

    // 2. Natural organic Polaroid scatter rotation angles for idle cards
    const rotationPatterns = [-2.8, 2.2, -1.8, 2.5, -2.2, 1.8];
    const items = Array.from(wrapper.children);
    
    items.forEach((item, index) => {
      const card = item.querySelector('.pc-card');
      if (card) {
        const rotationAngle = rotationPatterns[index % rotationPatterns.length];
        card.style.setProperty('--card-rot', `${rotationAngle}deg`);
      }
    });

    // 3. Swiper Drag Scroll Physics with Wider Spacing
    let touchStartX = 0;

    new Swiper(swiperContainer, {
      slidesPerView: 'auto',
      spaceBetween: 32, // Increased spacing between cards
      grabCursor: true,
      freeMode: {
        enabled: true,
        sticky: false,
        momentumBounce: false,
      },
      observer: true,
      observeParents: true,

      breakpoints: {
        0: { spaceBetween: 20 },
        768: { spaceBetween: 32 }
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
