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
const CARD_STAGGER = 0.15;
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
  if (!desktopCards.length) return;

  gsap.set(desktopCards, {
    clipPath: 'inset(100% 0% 0% 0%)',
    yPercent: 20,
    opacity: 0
  });

  const timeline = gsap.timeline({ paused: true });
  desktopCards.forEach((card, index) => {
    timeline.to(card, {
      clipPath: 'inset(0% 0% 0% 0%)',
      yPercent: 0,
      opacity: 1,
      duration: CLIP_REVEAL_DURATION,
      ease: 'power3.out'
    }, index * CARD_STAGGER);
  });

  if (hasScrollTrigger) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 90%',
      once: true,
      onEnter: () => timeline.play()
    });
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.disconnect();
          timeline.play();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(section);
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
