/* ==============================================================================
 * FILE: flip-cards.js
 * CATEGORY: MarlonWalksLA Website - 3D Flip Cards & Swiper Logic
 * 
 * OVERVIEW:
 * Handles the interactive JavaScript logic and dynamic DOM manipulation for the 
 * polaroid-style tour stop cards. It initializes the Swiper.js carousel, dynamically 
 * constructs the 3D front/back faces of the cards from CMS data, and manages the 
 * drag physics and click-to-flip interactions.
 * 
 * WHAT'S INSIDE:
 * - Staggered static rotation logic (`--card-rot`) to give cards a scattered look.
 * - Auto-cloning mechanism to ensure Swiper loops smoothly even if there are fewer than 8 cards.
 * - Dynamic DOM construction for the 180-degree flip effect, sorting CMS elements 
 *   into `.pc-face-front` and `.pc-face-back`.
 * - Click event listeners to trigger the flip (prevented when actively swiping).
 * - Swiper.js initialization with touch event listeners for physics-based rotation 
 *   while dragging (`--drag-rot`).
 * 
 * WHEN TO FEED THIS FILE TO GEMINI / AI:
 * - Feed this file if you want to: Change the drag physics, swipe speed, or rotation limits while interacting with the carousel.
 * - Feed this file if you want to: Adjust Swiper breakpoint spacing or loop behavior.
 * - Feed this file if you want to: Add new custom Webflow CMS fields to the cards (like tags or hours) and need to ensure the JS maps them correctly to the front or back face.
 * ============================================================================== */

window.initFlipCards = function() {
  const roots = document.querySelectorAll('.pc-root');
  
  roots.forEach((root) => {
    if (root.getAttribute('data-swiper-initialized') === 'true') return;
    root.setAttribute('data-swiper-initialized', 'true');

    const wrapper = root.querySelector('.swiper-wrapper');
    const swiperContainer = root.querySelector('.swiper');
    if (!wrapper || !swiperContainer) return;

    const rotationPatterns = [-3, 2, -1.5, 3, -2];
    const items = Array.from(wrapper.children);
    
    items.forEach((item, index) => {
      const card = item.querySelector('.pc-card');
      if (card) {
        const rotationAngle = rotationPatterns[index % rotationPatterns.length];
        card.style.setProperty('--card-rot', `${rotationAngle}deg`);
      }
    });
    
    if (items.length > 0 && items.length < 8) {
      const dupsNeeded = Math.ceil(8 / items.length) - 1;
      for (let i = 0; i < dupsNeeded; i++) {
        items.forEach(item => {
          const clone = item.cloneNode(true);
          wrapper.appendChild(clone);
        });
      }
    }

    const cards = root.querySelectorAll('.pc-card');
    cards.forEach(card => {
      if (!card.querySelector('.pc-flip-area')) {
        const button = card.querySelector('.pc-button');
        const cmsText = card.querySelector('.pc-description-back');
        const cmsMascot = card.querySelector('.pc-image-back');

        const childrenToWrap = Array.from(card.children).filter(
          child => child !== button && child !== cmsText && child !== cmsMascot
        );
        
        const flipArea = document.createElement('div');
        flipArea.className = 'pc-flip-area';
        const flipInner = document.createElement('div');
        flipInner.className = 'pc-flip-inner';
        const faceFront = document.createElement('div');
        faceFront.className = 'pc-face-front';
        const faceBack = document.createElement('div');
        faceBack.className = 'pc-face-back';

        childrenToWrap.forEach(child => faceFront.appendChild(child));

        const frontHint = document.createElement('div');
        frontHint.className = 'pc-front-hint';
        frontHint.innerText = 'Tap to flip ↺';
        faceFront.appendChild(frontHint);

        if (cmsText && cmsText.innerHTML.trim() !== '') {
          const backTextContainer = document.createElement('div');
          backTextContainer.className = 'pc-description-back';
          backTextContainer.innerHTML = cmsText.innerHTML;
          faceBack.appendChild(backTextContainer);
        }

        if (cmsMascot && (cmsMascot.getAttribute('src') || cmsMascot.dataset.src)) {
          const mascotImg = document.createElement('img');
          mascotImg.className = 'pc-image-back';
          mascotImg.src = cmsMascot.getAttribute('src') || cmsMascot.dataset.src;
          mascotImg.alt = cmsMascot.getAttribute('alt') || 'Mascot';
          faceBack.appendChild(mascotImg);
        }

        const backHint = document.createElement('div');
        backHint.className = 'pc-back-hint';
        backHint.innerText = 'Tap to flip ↺';
        faceBack.appendChild(backHint);

        flipInner.appendChild(faceFront);
        flipInner.appendChild(faceBack);
        flipArea.appendChild(flipInner);
        
        if (button) {
          card.insertBefore(flipArea, button);
        } else {
          card.appendChild(flipArea);
        }
      }
    });

    root.addEventListener('click', (e) => {
      const flipArea = e.target.closest('.pc-flip-area');
      if (!flipArea) return;
      const card = flipArea.closest('.pc-card');
      if (card && !card.classList.contains('is-swiping')) {
        flipArea.classList.toggle('is-flipped');
      }
    });

    let touchStartX = 0;

    window.swiperInstance = new Swiper(swiperContainer, {
      loop: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      spaceBetween: 40,
      speed: 400,
      grabCursor: true,
      touchRatio: 1.0,
      observer: true,
      observeParents: true,

      breakpoints: {
        0: { spaceBetween: 25 },
        480: { spaceBetween: 40 }
      },

      on: {
        touchStart(s, e) {
          touchStartX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
        },
        touchMove(s, e) {
          const currentX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
          const diffX = currentX - touchStartX;
          const activeSlide = s.slides[s.activeIndex];
          
          if (activeSlide) {
            const activeCard = activeSlide.querySelector('.pc-card');
            if (activeCard) {
              activeCard.classList.add('is-swiping');
              const dragRot = Math.max(-8, Math.min(8, diffX * 0.04));
              activeCard.style.setProperty('--drag-rot', `${dragRot}deg`);
            }
          }
        },
        touchEnd(s) {
          s.slides.forEach(slide => {
            const activeCard = slide.querySelector('.pc-card');
            if (activeCard) {
              activeCard.style.setProperty('--drag-rot', '0deg');
              setTimeout(() => activeCard.classList.remove('is-swiping'), 100);
            }
          });
        }
      }
    });
  });
};
