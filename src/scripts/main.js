/**
 * Glenaeon Concordia Kit - Main JavaScript
 * =========================================
 * Minimal, scoped JS for header interactions and UI enhancements.
 */

(function () {
  'use strict';

  // ==========================================================================
  // DOM READY
  // ==========================================================================

  document.addEventListener('DOMContentLoaded', function () {
    initMenuToggle();
    initMegaMenu();
    initStickyHeader();
    initSmoothScroll();
    initHeroSlider();
    initVideoTestimonials();
    initCoCurricularCarousel();
    initFeaturesCardsSlider();
  });

  // ==========================================================================
  // MENU TOGGLE (Hamburger Animation)
  // ==========================================================================

  function initMenuToggle() {
    // This function is now handled by initMegaMenu()
    // Keeping empty to avoid breaking existing function calls
    return;
  }

  // ==========================================================================
  // MEGA MENU (Full Page Overlay)
  // ==========================================================================

  function initMegaMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const megaMenu = document.getElementById('megaMenu');
    const megaMenuOverlay = document.getElementById('megaMenuOverlay');
    const body = document.body;

    if (!menuToggle || !megaMenu || !megaMenuOverlay) return;

    // Initialize animations
    const menuAnimations = window.initMegaMenuAnimations 
      ? window.initMegaMenuAnimations(megaMenu, megaMenuOverlay, menuToggle, body) 
      : null;

    // Open Menu - use animation if available, otherwise fallback
    function openMenu() {
      if (menuAnimations && menuAnimations.openMenu) {
        menuAnimations.openMenu();
      } else {
        // Fallback to simple class toggle if animations not available
        megaMenu.classList.add('is-active');
        megaMenuOverlay.classList.add('is-active');
        body.classList.add('mega-menu-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        
        const hamburgerIcon = document.getElementById('hamburgerIcon');
        if (hamburgerIcon) {
          hamburgerIcon.classList.add('is-active');
        }
        
        // Focus trap: focus first focusable element in menu
        const firstFocusable = megaMenu.querySelector('a, button, select');
        if (firstFocusable) {
          setTimeout(() => firstFocusable.focus(), 100);
        }
      }
    }

    // Close Menu - use animation if available, otherwise fallback
    function closeMenu() {
      if (menuAnimations && menuAnimations.closeMenu) {
        menuAnimations.closeMenu();
      } else {
        // Fallback to simple class toggle if animations not available
        megaMenu.classList.remove('is-active');
        megaMenuOverlay.classList.remove('is-active');
        body.classList.remove('mega-menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        
        const hamburgerIcon = document.getElementById('hamburgerIcon');
        if (hamburgerIcon) {
          hamburgerIcon.classList.remove('is-active');
        }
        
        // Return focus to menu toggle
        menuToggle.focus();
      }
    }

    // Toggle on hamburger click
    menuToggle.addEventListener('click', function (e) {
      e.preventDefault();
      const isOpen = megaMenu.classList.contains('is-active');
      const hamburgerIcon = document.getElementById('hamburgerIcon');
      
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
        // Add active state to hamburger icon
        if (hamburgerIcon) {
          hamburgerIcon.classList.add('is-active');
        }
      }
    });

    // Note: menuClose button was removed, using the same menuToggle button

    // Close on overlay click
    megaMenuOverlay.addEventListener('click', function () {
      closeMenu();
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && megaMenu.classList.contains('is-active')) {
        closeMenu();
      }
    });

    // Close menu when clicking main navigation links only (exclude all submenu links)
    const menuLinks = megaMenu.querySelectorAll('.mega-menu__nav a');
    menuLinks.forEach(link => {
      link.addEventListener('click', function () {
        // Small delay for smooth transition before closing
        setTimeout(closeMenu, 200);
      });
    });

    // Hide all submenus initially and show only layer 1 for learning
    const allSubmenus = megaMenu.querySelectorAll('.mega-menu__subnav[data-submenu-content]');
    allSubmenus.forEach(submenu => {
      submenu.classList.remove('is-active');
    });

    // Submenu switching on hover for main navigation
    const mainNavItems = megaMenu.querySelectorAll('.mega-menu__nav-item a[data-submenu]');

    mainNavItems.forEach(navLink => {
      navLink.addEventListener('mouseenter', function () {
        const submenuId = this.getAttribute('data-submenu');
        
        // Hide all submenus
        allSubmenus.forEach(submenu => {
          submenu.classList.remove('is-active');
          // Reset submenu items animation
          if (menuAnimations && menuAnimations.resetSubmenuItems) {
            menuAnimations.resetSubmenuItems(submenu);
          }
        });
        
        // Show the corresponding submenu (always layer 1)
        const targetSubmenu = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${submenuId}"][data-layer="1"]`);
        if (targetSubmenu) {
          targetSubmenu.classList.add('is-active');
          // Animate submenu items
          if (menuAnimations && menuAnimations.animateSubmenuItems) {
            menuAnimations.animateSubmenuItems(targetSubmenu);
          }
        } else {
          // Fallback for submenus without layers
          const fallbackSubmenu = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${submenuId}"]:not([data-layer])`);
          if (fallbackSubmenu) {
            fallbackSubmenu.classList.add('is-active');
            // Animate submenu items
            if (menuAnimations && menuAnimations.animateSubmenuItems) {
              menuAnimations.animateSubmenuItems(fallbackSubmenu);
            }
          }
        }
      });
    });

    // Layer navigation - click handlers for navigating between layers
    function handleLayerNavigation() {
      // Handle clicking on items that navigate to next layer
      const clickableItems = megaMenu.querySelectorAll('.mega-menu__subnav-item--clickable');
      clickableItems.forEach(item => {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          const nextLayer = this.getAttribute('data-next-layer');
          
          if (nextLayer) {
            // Hide current layer
            const currentLayer = this.closest('.mega-menu__subnav');
            if (currentLayer) {
              currentLayer.classList.remove('is-active');
              // Reset submenu items animation
              if (menuAnimations && menuAnimations.resetSubmenuItems) {
                menuAnimations.resetSubmenuItems(currentLayer);
              }
            }
            
            // Show next layer
            const targetLayer = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${nextLayer}"]`);
            if (targetLayer) {
              targetLayer.classList.add('is-active');
              // Animate submenu items
              if (menuAnimations && menuAnimations.animateSubmenuItems) {
                menuAnimations.animateSubmenuItems(targetLayer);
              }
            }
          }
        });
      });

      // Handle back button clicks
      const backButtons = megaMenu.querySelectorAll('.mega-menu__subnav-item--back');
      backButtons.forEach(backButton => {
        backButton.addEventListener('click', function(e) {
          e.preventDefault();
          const backTo = this.getAttribute('data-back-to');
          
          if (backTo) {
            // Hide current layer
            const currentLayer = this.closest('.mega-menu__subnav');
            if (currentLayer) {
              currentLayer.classList.remove('is-active');
              // Reset submenu items animation
              if (menuAnimations && menuAnimations.resetSubmenuItems) {
                menuAnimations.resetSubmenuItems(currentLayer);
              }
            }
            
            // Show target layer
            const targetLayer = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${backTo}"]`);
            if (targetLayer) {
              targetLayer.classList.add('is-active');
              // Animate submenu items
              if (menuAnimations && menuAnimations.animateSubmenuItems) {
                menuAnimations.animateSubmenuItems(targetLayer);
              }
            }
          }
        });
      });
    }

    // Initialize layer navigation
    handleLayerNavigation();
    
    // Initialize circle image layer switching
    initCircleImageLayerSwitching();

    // Quick Links Accordion
    const quickLinksToggle = document.getElementById('quickLinksToggle');
    const quickLinksDropdown = document.getElementById('quickLinksDropdown');

    if (quickLinksToggle && quickLinksDropdown) {
      quickLinksToggle.addEventListener('click', function () {
        const isOpen = quickLinksDropdown.classList.contains('is-open');
        
        if (isOpen) {
          quickLinksDropdown.classList.remove('is-open');
          quickLinksToggle.classList.remove('is-open');
          quickLinksToggle.setAttribute('aria-expanded', 'false');
        } else {
          quickLinksDropdown.classList.add('is-open');
          quickLinksToggle.classList.add('is-open');
          quickLinksToggle.setAttribute('aria-expanded', 'true');
        }
      });
    }

    // Back button (closes menu)
    const backButton = document.getElementById('megaMenuBack');
    if (backButton) {
      backButton.addEventListener('click', function (e) {
        e.preventDefault();
        closeMenu();
      });
    }
  }

  // ==========================================================================
  // CIRCLE IMAGE LAYER SWITCHING
  // ==========================================================================
  
  function initCircleImageLayerSwitching() {
    const circleImageContainer = document.querySelector('.mega-menu__circle-image');
    if (!circleImageContainer) return;
    
    const circleImages = {
      layer1: circleImageContainer.querySelector('.circle-image-layer-1'),
      layer2: circleImageContainer.querySelector('.circle-image-layer-2'),
      layer3: circleImageContainer.querySelector('.circle-image-layer-3')
    };
    
    // Function to switch to specific layer image
    function switchToLayerImage(layerNumber) {
      // Remove active class from all images
      Object.values(circleImages).forEach(img => {
        if (img) img.classList.remove('active');
      });
      
      // Add active class to target layer image
      const targetImage = circleImages[`layer${layerNumber}`];
      if (targetImage) {
        targetImage.classList.add('active');
      }
      
      // Update container data attribute
      circleImageContainer.setAttribute('data-layer', layerNumber);
    }
    
    // Listen for submenu changes to switch circle images
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          
          if (target.classList.contains('mega-menu__subnav') && 
              target.classList.contains('is-active') && 
              target.hasAttribute('data-layer')) {
            
            const layerNumber = target.getAttribute('data-layer');
            switchToLayerImage(layerNumber);
          }
        }
      });
    });
    
    // Start observing all submenus for class changes
    const allSubmenus = document.querySelectorAll('.mega-menu__subnav[data-layer]');
    allSubmenus.forEach(submenu => {
      observer.observe(submenu, { attributes: true, attributeFilter: ['class'] });
    });
    
    // Also listen for main nav hover to reset to layer 1
    const mainNavItems = document.querySelectorAll('.mega-menu__nav-item a[data-submenu]');
    mainNavItems.forEach(navLink => {
      navLink.addEventListener('mouseenter', function() {
        // Reset to layer 1 image when hovering main nav items
        switchToLayerImage(1);
      });
    });
  }

  // ==========================================================================
  // STICKY HEADER
  // ==========================================================================

  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    
    if (!header) return;

    const scrollThreshold = 50;
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
      const currentScrollY = window.scrollY;

      if (currentScrollY > scrollThreshold) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateHeader();
  }

  // ==========================================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================================================

  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        // Skip if just "#"
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  // ==========================================================================
  // HERO SLIDER (Swiper)
  // ==========================================================================

  function initHeroSlider() {
    // Check if Swiper is loaded
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper not loaded');
      return;
    }

    const heroSlider = document.querySelector('.hero__slider');
    if (!heroSlider) return;

    // Initialize Swiper
    const swiper = new Swiper('.hero__slider', {
      // Slider settings
      loop: true,
      speed: 1200,
      effect: 'slide',
      slidesPerView: 1,
      spaceBetween: 0,
      
      // Smooth sliding with easing
      resistanceRatio: 0,
      touchRatio: 1,
      threshold: 5,
      
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      
      // Pagination
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: false
      },

      // Accessibility
      a11y: {
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
        paginationBulletMessage: 'Go to slide {{index}}'
      },

      // Keyboard control
      keyboard: {
        enabled: true,
        onlyInViewport: true
      }
    });

    // Connect arrow navigation buttons to Swiper
    const prevArrow = document.querySelector('.arrow-navigation__arrow--left');
    const nextArrow = document.querySelector('.arrow-navigation__arrow--right');

    if (prevArrow) {
      prevArrow.addEventListener('click', function() {
        swiper.slidePrev();
      });
    }

    if (nextArrow) {
      nextArrow.addEventListener('click', function() {
        swiper.slideNext();
      });
    }

    // Pause autoplay when play button is clicked
    const playButton = document.querySelector('.play-button');
    if (playButton) {
      playButton.addEventListener('click', function() {
        swiper.autoplay.stop();
      });
    }

    // Handle video slides
    swiper.on('slideChange', function () {
      // Pause all videos
      const videos = document.querySelectorAll('.hero__slide-video');
      videos.forEach(video => {
        video.pause();
      });

      // Play video in active slide if it exists
      const activeSlide = swiper.slides[swiper.activeIndex];
      const activeVideo = activeSlide?.querySelector('.hero__slide-video');
      if (activeVideo) {
        activeVideo.play().catch(err => {
          console.log('Video autoplay prevented:', err);
        });
      }
    });
  }

  // ==========================================================================
  // VIDEO TESTIMONIALS
  // ==========================================================================

  function initVideoTestimonials() {
    const cards = document.querySelectorAll('.video-testimonials__card');
    const modal = document.getElementById('videoTestimonialModal');
    const modalVideo = document.getElementById('videoTestimonialPlayer');
    const modalClose = document.querySelector('.video-testimonials__modal-close');
    const modalBackdrop = document.querySelector('.video-testimonials__modal-backdrop');

    if (!cards.length || !modal || !modalVideo) return;

    // Handle hover to play video muted
    cards.forEach(card => {
      const video = card.querySelector('.video-testimonials__video');
      const playButton = card.querySelector('.video-testimonials__play-button');

      if (!video) return;

      // Play on hover
      card.addEventListener('mouseenter', function() {
        if (video.paused) {
          video.play().catch(err => {
            console.log('Video autoplay prevented:', err);
          });
        }
      });

      // Pause on mouse leave
      card.addEventListener('mouseleave', function() {
        if (!video.paused) {
          video.pause();
          video.currentTime = 0; // Reset to start
        }
      });

      // Open modal on play button click
      if (playButton) {
        playButton.addEventListener('click', function(e) {
          e.stopPropagation();
          const videoSrc = playButton.getAttribute('data-video-src') || card.getAttribute('data-video-src');
          
          if (videoSrc) {
            // Set video source
            modalVideo.src = videoSrc;
            modalVideo.load();
            
            // Show modal
            modal.classList.add('is-active');
            document.body.style.overflow = 'hidden';
            
            // Play video
            modalVideo.play().catch(err => {
              console.log('Video play error:', err);
            });
          }
        });
      }
    });

    // Close modal function
    function closeModal() {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
      modalVideo.pause();
      modalVideo.currentTime = 0;
      modalVideo.src = ''; // Clear source to stop loading
    }

    // Close on close button click
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    // Close on backdrop click
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', closeModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });
  }

  // ==========================================================================
  // CO-CURRICULAR OPPORTUNITIES CAROUSEL
  // ==========================================================================

  function initCoCurricularCarousel() {
    // Check if Swiper is loaded
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper not loaded');
      return;
    }

    const carouselSlider = document.querySelector('.co-curricular-carousel .slider');
    if (!carouselSlider) return;

    const paginationDots = document.querySelectorAll('.co-curricular-carousel .pagination-dot');
    const prevArrow = document.querySelector('.co-curricular-carousel .navigation .arrow-navigation__arrow--left');
    const nextArrow = document.querySelector('.co-curricular-carousel .navigation .arrow-navigation__arrow--right');
    const counterCurrent = document.querySelector('.co-curricular-carousel .counter-current');
    const counterTotal = document.querySelector('.co-curricular-carousel .counter-total');

    // Initialize Swiper with smooth transitions
    const swiper = new Swiper('.co-curricular-carousel .slider', {
      loop: true,
      speed: 800,
      effect: 'slide',
      slidesPerView: 1,
      spaceBetween: 0,
      centeredSlides: true,
      
      // Smooth easing
      resistanceRatio: 0,
      touchRatio: 1,
      threshold: 5,
      followFinger: true,
      
      // Autoplay
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },

      // Keyboard control
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },

      // Accessibility
      a11y: {
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
        paginationBulletMessage: 'Go to slide {{index}}'
      }
    });

    // Update pagination dots
    function updatePagination(activeIndex) {
      paginationDots.forEach((dot, index) => {
        if (index === activeIndex) {
          dot.classList.add('pagination-dot--active');
        } else {
          dot.classList.remove('pagination-dot--active');
        }
      });
    }

    // Update counter
    function updateCounter(activeIndex, total) {
      if (counterCurrent) {
        counterCurrent.textContent = activeIndex + 1;
      }
      if (counterTotal) {
        counterTotal.textContent = total;
      }
    }

    // Connect navigation arrows
    if (prevArrow) {
      prevArrow.addEventListener('click', function() {
        swiper.slidePrev();
      });
    }

    if (nextArrow) {
      nextArrow.addEventListener('click', function() {
        swiper.slideNext();
      });
    }

    // Connect pagination dots
    paginationDots.forEach((dot, index) => {
      dot.addEventListener('click', function() {
        swiper.slideToLoop(index);
      });
    });

    // Handle video playback on slide change
    function handleVideoPlayback() {
      const slides = swiper.slides;
      slides.forEach((slide, index) => {
        const video = slide.querySelector('.co-curricular-carousel video');
        const slideElement = slide.querySelector('.co-curricular-carousel .slide');
        if (video && slideElement) {
          if (index === swiper.realIndex) {
            // Play video in active slide
            video.play().then(() => {
              video.classList.add('is-playing');
              slideElement.classList.add('video-playing');
            }).catch(err => {
              console.log('Video autoplay prevented:', err);
              // Keep fallback image visible if video fails
              slideElement.classList.remove('video-playing');
            });
          } else {
            // Pause videos in other slides
            video.pause();
            video.currentTime = 0;
            video.classList.remove('is-playing');
            slideElement.classList.remove('video-playing');
          }
        }
      });
    }

    // Update on slide change
    swiper.on('slideChange', function () {
      const realIndex = swiper.realIndex;
      updatePagination(realIndex);
      updateCounter(realIndex, swiper.slides.length);
      handleVideoPlayback();
    });

    // Initial update
    updatePagination(0);
    updateCounter(0, swiper.slides.length);
    handleVideoPlayback();
  }

  // ==========================================================================
  // FEATURES CARDS SLIDER (Swiper)
  // ==========================================================================

  function initFeaturesCardsSlider() {
    // Check if Swiper is loaded
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper not loaded');
      return;
    }

    const featuresSlider = document.querySelector('.features-cards-slider');
    if (!featuresSlider) return;

    // Initialize Swiper with smooth transitions
    const swiper = new Swiper('.features-cards-slider', {
      // Slider settings
      loop: false,
      speed: 600,
      effect: 'slide',
      slidesPerView: 1,
      spaceBetween: 20,
      centeredSlides: false, // Start from left, not centered
      initialSlide: 0, // Start from first slide
      
      // Responsive breakpoints
      breakpoints: {
        // When window width is >= 576px (sm)
        576: {
          slidesPerView: 1.5,
          spaceBetween: 20,
          centeredSlides: false,
        },
        // When window width is >= 768px (md)
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
          centeredSlides: false,
        },
        // When window width is >= 992px (lg)
        992: {
          slidesPerView: 2,
          spaceBetween: 20,
          centeredSlides: false,
        },
        // When window width is >= 1200px (xl)
        1200: {
          slidesPerView: 2,
          spaceBetween: 20,
          centeredSlides: false,
        },
      },
      
      // Smooth dragging with easing
      resistanceRatio: 0.85,
      touchRatio: 1,
      threshold: 5,
      followFinger: true,
      grabCursor: true,
      
      // Mouse wheel control (optional)
      mousewheel: {
        enabled: false,
      },
      
      // Keyboard control
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      
      // Accessibility
      a11y: {
        prevSlideMessage: 'Previous feature card',
        nextSlideMessage: 'Next feature card',
      },
    });
  }

})();

