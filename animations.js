/**
 * Animations.js - Collection of smooth animations for the website
 * ================================================================
 */

/**
 * Marquee Text Animation
 * =====================
 * Creates a smooth horizontal scrolling text effect that responds to scroll direction
 * Based on GSAP animation with scroll-responsive speed control
 */

// Variables for scroll tracking
let currentScroll = 0;
let isScrollingDown = true;

/**
 * Initialize Marquee Animation
 * Creates infinite horizontal scrolling text with smooth transitions
 * The animation reverses direction based on scroll direction for enhanced UX
 */
function initMarqueeAnimation() {
  // Create the main marquee animation
  // xPercent: -100 moves each part completely to the left
  // repeat: -1 creates infinite loop
  // duration: 10 controls the speed (higher = slower)
  // ease: "linear" ensures constant speed without acceleration/deceleration
  let tween = gsap.to(".marquee__part", {
    xPercent: -100,
    repeat: -1,
    duration: 10,
    ease: "linear"
  }).totalProgress(0.5); // Start at 50% to prevent initial jump

  // Center the marquee container
  // xPercent: -50 centers the infinite scroll container
  gsap.set(".marquee__inner", { xPercent: -50 });

  // Add scroll event listener for direction-responsive animation
  window.addEventListener("scroll", function() {
    // Determine scroll direction
    if (window.pageYOffset > currentScroll) {
      isScrollingDown = true;
    } else {
      isScrollingDown = false;
    }

    // Animate timeScale for smooth direction changes
    // timeScale: 1 = normal forward speed
    // timeScale: -1 = reverse direction
    // This creates the effect where text scrolls backward when scrolling up
    gsap.to(tween, {
      timeScale: isScrollingDown ? 1 : -1,
      duration: 0.3, // Smooth transition between directions
      ease: "power2.out"
    });

    // Update current scroll position
    currentScroll = window.pageYOffset;
  });
}

/**
 * Initialize all animations when DOM is loaded
 * Call this function when the page is ready
 */
function initAnimations() {
  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.error('GSAP is required for animations. Please include GSAP library.');
    return;
  }

  // Initialize marquee animation
  initMarqueeAnimation();
  
  console.log('Animations initialized successfully');
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initAnimations);

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}