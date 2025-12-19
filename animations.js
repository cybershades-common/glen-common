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
// Adjust CLIP_REVEAL_DURATION or CARD_STAGGER to tweak animation feel.
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

  setupDesktopCardReveal(section);
  setupMobileSlideAnimations(section);
  setupTextHideOnPlay(section);
}

function setupDesktopCardReveal(section) {
  const desktopCards = section.querySelectorAll('.cards.desktop-only .card');
  const cardsContainer = section.querySelector('.cards.desktop-only');
  
  // Also target features cards slider
  const featureCards = document.querySelectorAll('.features-cards-slider .feature-card');
  const featuresContainer = document.querySelector('.features-cards-slider');
  
  // Combine both sets of cards
  const allCards = [...desktopCards, ...featureCards];
  const containers = [cardsContainer, featuresContainer].filter(Boolean);
  
  if (!allCards.length || !containers.length) return;

  // Force initial hidden state for all cards
  allCards.forEach(card => {
    card.style.clipPath = 'inset(100% 0% 0% 0%)';
    card.style.opacity = '0';
  });

  // Create separate animations for each container
  containers.forEach(container => {
    const containerCards = container === cardsContainer ? desktopCards : featureCards;
    if (!containerCards.length) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',  
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        markers: false,
        onRefresh: () => {
          // Ensure cards stay hidden on refresh
          containerCards.forEach(card => {
            card.style.clipPath = 'inset(100% 0% 0% 0%)';
            card.style.opacity = '0';
          });
        }
      }
    });

    // Add animations to timeline
    tl.to(containerCards, {
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });
  });
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

function initAnimations() {
  if (typeof gsap === 'undefined') {
    console.error('GSAP is required for animations. Please include GSAP library.');
    return;
  }

  initMarqueeAnimation();
  initVideoTestimonialsAnimations();

  console.log('Animations initialized successfully');
}


document.addEventListener('DOMContentLoaded', initAnimations);


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}
