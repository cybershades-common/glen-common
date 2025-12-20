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

  initPreloaderAnimation();
  initMarqueeAnimation();
  initVideoTestimonialsAnimations();
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
  
  const allAnimationItems = [...videoItems, ...featureItems];
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
    });
  }

  // ScrollTrigger reveal animation for all elements
  ScrollTrigger.batch('.video-reveal-animation, .feature-reveal-animation', {
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


// ==========================================================================
// PRELOADER HERO TEXT ANIMATIONS - START
// ==========================================================================

function initPreloaderAnimation() {
  // Prevent scroll during preloader
  document.body.style.overflow = 'hidden';

  // GSAP Timeline for glen preloader animation
  const glenTl = gsap.timeline();

  // Check if mobile
  const isMobile = window.innerWidth <= 768;
  
  // Calculate exact preloader duration and restore scroll
  const preloaderDuration = 3000; // 3 seconds for both mobile and desktop
  setTimeout(() => {
    document.body.style.overflow = '';
  }, preloaderDuration);
  
  // Set initial states
  gsap.set(".glen-sunrise-container", { y: 0, scale: 0.5 });
  gsap.set(".glen-logo-container", { opacity: 0, y: 100, scale: 0.3, filter: "blur(10px)" });
  gsap.set("#glen-preloader", { y: 0 });
  gsap.set("#hero-script-text", { opacity: 0 }); // Hide hero text initially
  
  // Wrap and hide bold text in hero initially
  const heroHeading = document.querySelector(".hero__title-line");
  if (heroHeading) {
    // Find all text nodes that aren't inside the script span
    const walker = document.createTreeWalker(
      heroHeading,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Skip if parent is the script span or if text is just whitespace
          if (node.parentElement.classList.contains('hero__title-script') || 
              !node.textContent.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    
    // Wrap each text node in a span for animation
    textNodes.forEach(textNode => {
      const span = document.createElement('span');
      span.className = 'hero__bold-text';
      span.textContent = textNode.textContent;
      span.style.display = 'inline-block';
      textNode.parentNode.replaceChild(span, textNode);
    });
    
    // Now set initial animation state
    const boldElements = heroHeading.querySelectorAll('.hero__bold-text');
    gsap.set(boldElements, { y: 100, opacity: 0 });
  }

  // Animation sequence
  if (isMobile) {
    // Mobile animation - less rise
    glenTl.to(".glen-sunrise-container", {
      y: "-80vh",
      scale: 1.8,
      duration: 3,
      ease: "none"
    })
    .to(".glen-logo-container", {
      opacity: 1,
      y: "-15vh",
      scale: 1,
      rotationY: 0,
      filter: "blur(0px)",
      duration: 3.6,
      ease: "elastic.out(1, 2.2)"
    }, "-=1.2");
  } else {
    // Desktop animation
    glenTl.to(".glen-sunrise-container", {
      y: "-120vh",
      scale: 1.6,
      duration: 3,
      ease: "none"
    })
    .to(".glen-logo-container", {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationY: 0,
      filter: "blur(0px)",
      duration: 4,
      ease: "elastic.out(1, 2.15)"
    }, "-=1.5");
  }

  // Slide out preloader from bottom to top
  glenTl.to("#glen-preloader", {
    y: "-100%",
    duration: 1.2,
    ease: "power2.inOut"
  }, "-=2.5")
  .set("#glen-preloader", { display: "none" });

  // Trigger hero text animation when preloader finishes
  setTimeout(() => {
    animateHeroScriptText();
  }, 2500); // Adjust this value: lower = earlier, higher = later

  // Optional: Click to skip preloader
  document.addEventListener('click', () => {
    if (glenTl.progress() < 0.8) {
      glenTl.progress(1);
      document.body.style.overflow = '';
    }
  });
}

function animateHeroScriptText() {
  const scriptTextElement = document.getElementById("hero-script-text");
  if (!scriptTextElement) return;

  // Store original dimensions to prevent layout shift
  const originalWidth = scriptTextElement.offsetWidth;
  const originalHeight = scriptTextElement.offsetHeight;
  
  const originalText = scriptTextElement.textContent;
  
  // Set fixed dimensions before manipulating content
  scriptTextElement.style.display = "inline-block";
  scriptTextElement.style.width = originalWidth + "px";
  scriptTextElement.style.height = originalHeight + "px";
  scriptTextElement.style.verticalAlign = "baseline";
  
  scriptTextElement.innerHTML = ""; // Clear original text
  scriptTextElement.style.opacity = "1"; // Make visible now
  
  // Split text into characters (preserving spaces)
  const chars = originalText.split("");
  
  // Create span for each character
  const spans = chars.map((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.display = "inline";
    scriptTextElement.appendChild(span);
    return span;
  });

  // Set initial state (hidden)
  gsap.set(spans, {
    opacity: 0,
    filter: 'blur(10px)'
  });

  // Animate in after preloader completes (only opacity and blur, no movement)
  gsap.to(spans, {
    opacity: 1,
    filter: 'blur(0px)',
    stagger: 0.04,
    duration: 0.5,
    ease: "power2.out",
    delay: 0,
    onUpdate: function() {
      // Trigger bold text when script text is 85% complete
      if (this.progress() >= 0.85 && !this.boldTextTriggered) {
        this.boldTextTriggered = true;
        animateHeroBoldText();
      }
    }
  });
}

function animateHeroBoldText() {
  const boldElements = document.querySelectorAll(".hero__bold-text");
  if (!boldElements.length) return;

  // Animate bold text sliding up from bottom with smooth easing
  gsap.to(boldElements, {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: "power4.out",
    stagger: 0.1
  });
}

// ==========================================================================
// PRELOADER AND HERO TEXT ANIMATIONS - END
// ==========================================================================

document.addEventListener('DOMContentLoaded', initAnimations);


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}
