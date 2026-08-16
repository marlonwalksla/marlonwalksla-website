/* ==============================================================================
 * FILE: flip-cards.js
 * CATEGORY: MarlonWalksLA Website - 3D Flip Cards & Swiper Logic
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

    // Apply natural organic scatter angles to the Polaroid cards
    const rotationPatterns = [-2.5, 1.8, -1.2, 2.2, -1.8, 1.5];
    const items = Array.from(wrapper.children);
    
    items.forEach((item, index) => {
      const card = item.querySelector('.pc-card');
      if (card) {
        const rotationAngle = rotationPatterns[index % rotationPatterns.length];
        card.style.setProperty('--card-rot', `${rotationAngle}deg`);
      }
    });

    // Build 3D front & back faces for each Polaroid
    const cards = root.querySelectorAll('.pc-card');
    cards.forEach(card => {
      if (!card.querySelector('.pc-flip-area')) {
        const cmsText = card.querySelector('.pc-description-back');
        const cmsMascot = card.querySelector('.pc-image-back');
        const cardButton = card.querySelector('.pc-button');

        const frontElements = Array.from(card.children).filter(
          child => child !== cmsText && child !== cmsMascot && child !== cardButton
        );
        
        const flipArea = document.createElement('div');
        flipArea.className = 'pc-flip-area';
        
        const flipInner = document.createElement('div');
        flipInner.className = 'pc-flip-inner';
        
        const faceFront = document.createElement('div');
        faceFront.className = 'pc-face-front';
        
        const faceBack = document.createElement('div');
        faceBack.className = 'pc-face-back';

        // Populate Front Face
        frontElements.forEach(child => faceFront.appendChild(child));
        const frontHint = document.createElement('div');
        frontHint.className = 'pc-front-hint';
        frontHint.innerText = 'Tap to read review ↺';
        faceFront.appendChild(frontHint);

        // Populate Back Face (Customer Review & Mascot)
        if (cmsMascot && (cmsMascot.getAttribute('src') || cmsMascot.dataset.src)) {
          const mascotImg = document.createElement('img');
          mascotImg.className = 'pc-image-back';
          mascotImg.src = cmsMascot.getAttribute('src') || cmsMascot.dataset.src;
          mascotImg.alt = 'Mascot Review';
          faceBack.appendChild(mascotImg);
        }

        if (cmsText && cmsText.innerHTML.trim() !== '') {
          const backTextContainer = document.createElement('div');
          backTextContainer.className = 'pc-description-back';
          backTextContainer.innerHTML = cmsText.innerHTML;
          faceBack.appendChild(backTextContainer);
        }

        const backHint = document.createElement('div');
        backHint.className = 'pc-back-hint';
        backHint.innerText = 'Tap to flip back ↺';
        faceBack.appendChild(backHint);

        flipInner.appendChild(faceFront);
        flipInner.appendChild(faceBack);
        flipArea.appendChild(flipInner);

        if (cardButton) {
          card.insertBefore(flipArea, cardButton);
        } else {
          card.appendChild(flipArea);
        }
      }
    });

    // Flip Trigger on Card Tap/Click
    root.addEventListener('click', (e) => {
      const flipArea = e.target.closest('.pc-flip-area');
      if (!flipArea) return;
      const card = flipArea.closest('.pc-card');
      if (card && !card.classList.contains('is-swiping')) {
        flipArea.classList.toggle('is-flipped');
      }
    });

    // Initialize Swiper Drag physics
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
