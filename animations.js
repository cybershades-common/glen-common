//Marqeee Animation Script

// Variables for scroll tracking
let currentScroll = 0;
let isScrollingDown = true;


function initMarqueeAnimation() {
  
  let tween = gsap.to(".marquee__part", {
    xPercent: -100,
    repeat: -1,
    duration: 10,
    ease: "linear"
  }).totalProgress(0.5); 

 
  gsap.set(".marquee__inner", { xPercent: -50 });

  
  window.addEventListener("scroll", function() {
   
    if (window.pageYOffset > currentScroll) {
      isScrollingDown = true;
    } else {
      isScrollingDown = false;
    }

    
    gsap.to(tween, {
      timeScale: isScrollingDown ? 1 : -1,
      duration: 0.3, 
      ease: "power2.out"
    });

    currentScroll = window.pageYOffset;
  });
}


// ==========================================================================
// VIDEO TESTIMONIALS CLIP/SLIDE ANIMATIONS - START

// ==========================================================================
const VIDEO_SECTION_SELECTOR = '.video-testimonials';
const CLIP_REVEAL_DURATION = 0.9;
const CARD_STAGGER = 0.1;
let videoTestimonialsAnimationsInitialized = false;
const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';

if (hasScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

function initVideoTestimonialsAnimations() {
  if (videoTestimonialsAnimationsInitialized) return;
  const section = document.querySelector(VIDEO_SECTION_SELECTOR);
  if (!section || typeof gsap === 'undefined') return;
  videoTestimonialsAnimationsInitialized = true;

  // Setup reveal animations for desktop cards
  setupVideoCardsReveal(section);
  
  // Setup reveal animations for feature cards  
  setupFeatureCardsReveal();
  
  // Keep mobile and text animations as they work fine
  setupMobileSlideAnimations(section);
  setupTextHideOnPlay(section);
}

function setupVideoCardsReveal(section) {
  const desktopCards = section.querySelectorAll('.cards.desktop-only .card');
  
  if (desktopCards.length > 0) {
    desktopCards.forEach(card => {
      card.classList.add('video-reveal-animation', 'card-clip-reveal');
    });
  }
}

function setupFeatureCardsReveal() {
  const featureCards = document.querySelectorAll('.features-cards-slider .feature-card');
  
  if (featureCards.length > 0) {
    featureCards.forEach(card => {
      card.classList.add('feature-reveal-animation', 'card-clip-reveal');
    });
  }
}

function setupMobileSlideAnimations(section) {
  const sliderEl = section.querySelector('.video-testimonials-swiper .swiper');
  if (!sliderEl) return;

  const cardContents = sliderEl.querySelectorAll('.card-content');
  cardContents.forEach(content => {
    gsap.set(content, { y: 70, opacity: 0 });
  });

  const animateActiveSlide = () => {
    const activeSlide = sliderEl.querySelector('.swiper-slide-active');
    if (!activeSlide) return;
    const cardContent = activeSlide.querySelector('.card-content');
    if (!cardContent) return;

    gsap.to(cardContent, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'back.out(1.7)'
    });
  };
  const hideContent = content => {
    if (!content) return;
    gsap.to(content, {
      y: 40,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.inOut'
    });
  };

  let currentSlideContent = null;

  const attachToSwiper = () => {
    const swiperInstance = sliderEl.swiper;
    if (!swiperInstance) return false;
    const setCurrentContent = () => {
      const activeSlide = sliderEl.querySelector('.swiper-slide-active');
      currentSlideContent = activeSlide?.querySelector('.card-content') || null;
    };

    setCurrentContent();
    if (currentSlideContent) {
      gsap.set(currentSlideContent, { y: 0, opacity: 1 });
    }

    swiperInstance.on('slideChangeTransitionStart', () => {
      hideContent(currentSlideContent);
    });

    swiperInstance.on('slideChangeTransitionEnd', () => {
      setCurrentContent();
      animateActiveSlide();
    });

    return true;
  };

  if (!attachToSwiper()) {
    const poll = setInterval(() => {
      if (attachToSwiper()) {
        clearInterval(poll);
      }
    }, 200);
  }
}

function setupTextHideOnPlay(section) {
  const buttons = section.querySelectorAll('.play-button');
  if (!buttons.length) return;
  buttons.forEach(button => {
    const cardInfo = button.closest('.card')?.querySelector('.card-info');
    if (cardInfo) {
      gsap.set(cardInfo, { x: 0, opacity: 1 });
    }
  });

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') return;
      const button = mutation.target;
      const cardInfo = button.closest('.card')?.querySelector('.card-info');
      if (!cardInfo) return;

      const isActive = button.classList.contains('is-active');
      gsap.to(cardInfo, {
        x: isActive ? -40 : 0,
        opacity: isActive ? 0 : 1,
        duration: 0.35,
        ease: 'power2.out'
      });
    });
  });

  buttons.forEach(button => {
    observer.observe(button, { attributes: true, attributeFilter: ['class'] });
  });
}
// ==========================================================================
// VIDEO TESTIMONIALS CLIP/SLIDE ANIMATIONS - END
// ==========================================================================

// ==========================================================================
// STAFF SECTION ANIMATIONS - START
// ==========================================================================

function initStaffAnimations() {
  const staffSection = document.querySelector('.staff-section');
  if (!staffSection) return;

  const staffCards = staffSection.querySelectorAll('.grid_card');
  if (!staffCards.length) return;

  // Add animation classes to staff cards
  staffCards.forEach(card => {
    card.classList.add('staff-reveal-animation', 'staff-circle-expand');
  });

  // Set initial state for staff cards
  gsap.set('.staff-circle-expand', {
    '--circle-clip': '0%',
  });
}

// ==========================================================================
// STAFF SECTION ANIMATIONS - END
// ==========================================================================

// ==========================================================================
// FEATURED CARDS SCROLL EFFECT - START
// ==========================================================================

function initFeaturedCardsScrollEffect() {
  const featuresSlider = document.querySelector('.features-cards-slider');
  if (!featuresSlider) return;

  const cards = featuresSlider.querySelectorAll('.feature-card');
  if (!cards.length) return;

  // Add subtle scroll-based parallax effect to cards
  cards.forEach((card, index) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1, // Smooth scrubbing
        onUpdate: (self) => {
          // Create subtle inward movement effect on scroll
          const progress = self.progress;
          const moveAmount = (progress - 0.5) * 20; // Subtle 20px movement
          
          gsap.set(card, {
            y: moveAmount,
            scale: 1 - Math.abs(progress - 0.5) * 0.05, // Slight scale effect
          });
        }
      }
    });
  });

  console.log(`Added scroll effect to ${cards.length} feature cards`);
}

// ==========================================================================
// FEATURED CARDS SCROLL EFFECT - END
// ==========================================================================

function initAnimations() {
  if (typeof gsap === 'undefined') {
    return;
  }

  initMarqueeAnimation();
  initVideoTestimonialsAnimations();
  initStaffAnimations();
  initRevealAnimations();
  // Featured cards now use swiper instead of GSAP scroll effect

  // Safe ScrollTrigger refresh after animations are set up
  if (typeof ScrollTrigger !== 'undefined') {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }

}

// Card reveal animation system
function initRevealAnimations() {
  const videoItems = document.querySelectorAll('.video-reveal-animation');
  const featureItems = document.querySelectorAll('.feature-reveal-animation');
  const staffItems = document.querySelectorAll('.staff-reveal-animation');
  
  const allAnimationItems = [...videoItems, ...featureItems, ...staffItems];
  if (!allAnimationItems.length) return;

  // Set initial state for clip reveal items
  const clipItems = document.querySelectorAll('.card-clip-reveal');
  if (clipItems.length > 0) {
    gsap.set('.card-clip-reveal', {
      '--clip-value': '100%',
    });
  }

  function animation_def({card, ease_default = 'power1.out', index = 0, is_static = false} = {}) {
    if (!is_static) {
      gsap.to(card, {
        duration: 0.7, ease: ease_default, x: 0, y: 0, delay: index * 0.1
      });
    }
    gsap.to(card, {
      duration: 0.5, ease: ease_default, autoAlpha: 1, delay: index * 0.1 + 0.1
    });
  }

  function animateRevealElements(elements) {
    elements.forEach((card, index) => {
      if (card.classList.contains('card-clip-reveal')) {
        // Smooth clip reveal animation for cards
        gsap.fromTo(card, {
          '--clip-value': '100%',
        }, {
          duration: 1.1,
          ease: 'power3.out',
          '--clip-value': '0%',
          delay: index * 0.2,
          onStart: function() {
            card.classList.add('animation-started');
          },
          onComplete: function () {
            card.classList.add('clip-animation-complete', 'animation-finished');
          }
        });
      }
      
      if (card.classList.contains('staff-circle-expand')) {
        gsap.fromTo(card, {
          '--circle-clip': '0%',
        }, {
          duration: 1.2,
          ease: 'power3.out',
          '--circle-clip': '100%',
          delay: index * 0.15,
          onComplete: function () {
            card.classList.add('circle-animation-complete');
          }
        });
      }
    });
  }

  // ScrollTrigger reveal animation for all elements
  ScrollTrigger.batch('.video-reveal-animation, .feature-reveal-animation, .staff-reveal-animation', {
    start: 'top bottom-=100', 
    once: true, 
    onEnter: elements => {
      animateRevealElements(elements);
    }
  });
}


if (typeof ScrollTrigger !== 'undefined') {
  // Refresh on window resize (already standard practice)
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
  
  // Gentle refresh on page visibility change (handles soft refresh)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }
  });
}


document.addEventListener('DOMContentLoaded', initAnimations);


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}
