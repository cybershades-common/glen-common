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


function initAnimations() {
  
  if (typeof gsap === 'undefined') {
    console.error('GSAP is required for animations. Please include GSAP library.');
    return;
  }

 
  initMarqueeAnimation();
  
  console.log('Animations initialized successfully');
}


document.addEventListener('DOMContentLoaded', initAnimations);


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}