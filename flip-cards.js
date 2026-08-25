/* ==============================================================================
 * FILE: flip-cards.js
 * CATEGORY: MarlonWalksLA Website - Lightweight Centered Rewind Carousel
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

    // 1. Separate Reviewer Name & Gold Stars
    root.querySelectorAll('.pc-title').forEach(titleEl => {
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

    // 2. Set Organic Polaroid Scatter Rotation
    const rotationPatterns = [-2.8, 2.2, -1.8, 2.5, -2.2, 1.8];
    Array.from(wrapper.children).forEach((item, index) => {
      const card = item.querySelector('.pc-card');
      if (card) {
        const rotationAngle = rotationPatterns[index % rotationPatterns.length];
        card.style.setProperty('--card-rot', `${rotationAngle}deg`);
      }
    });

    // 3. Inject Navigation & Pagination Controls if missing
    let controlsBar = root.querySelector('.swiper-custom-controls');
    if (!controlsBar) {
      controlsBar = document.createElement('div');
      controlsBar.className = 'swiper-custom-controls';
      controlsBar.innerHTML = `
        <button class="swiper-custom-prev" aria-label="Previous slide">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div class="swiper-custom-pagination"></div>
        <button class="swiper-custom-next" aria-label="Next slide">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      `;
      swiperContainer.parentNode.insertBefore(controlsBar, swiperContainer.nextSibling);
    }

    // 4. Initialize Zero-Clone Centered Rewind Swiper
    let touchStartX = 0;

    new Swiper(swiperContainer, {
      slidesPerView: 'auto',
      centeredSlides: true,
      rewind: true,
      spaceBetween: 24,
      grabCursor: true,
      observer: true,
      observeParents: true,

      navigation: {
        nextEl: controlsBar.querySelector('.swiper-custom-next'),
        prevEl: controlsBar.querySelector('.swiper-custom-prev')
      },
      pagination: {
        el: controlsBar.querySelector('.swiper-custom-pagination'),
        type: 'bullets',
        clickable: true
      },

      breakpoints: {
        0: {
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 14
        },
        768: {
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 20
        },
        992: {
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 24
        }
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
