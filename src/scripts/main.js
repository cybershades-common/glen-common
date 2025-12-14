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

    // Open Menu
    function openMenu() {
      megaMenu.classList.add('is-active');
      megaMenuOverlay.classList.add('is-active');
      body.classList.add('mega-menu-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      
      // Focus trap: focus first focusable element in menu
      const firstFocusable = megaMenu.querySelector('a, button, select');
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
    }

    // Close Menu
    function closeMenu() {
      megaMenu.classList.remove('is-active');
      megaMenuOverlay.classList.remove('is-active');
      body.classList.remove('mega-menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      
      // Reset hamburger icon
      const hamburgerIcon = document.getElementById('hamburgerIcon');
      if (hamburgerIcon) {
        hamburgerIcon.classList.remove('is-active');
      }
      
      // Return focus to menu toggle
      menuToggle.focus();
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
        });
        
        // Show the corresponding submenu (always layer 1)
        const targetSubmenu = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${submenuId}"][data-layer="1"]`);
        if (targetSubmenu) {
          targetSubmenu.classList.add('is-active');
        } else {
          // Fallback for submenus without layers
          const fallbackSubmenu = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${submenuId}"]:not([data-layer])`);
          if (fallbackSubmenu) {
            fallbackSubmenu.classList.add('is-active');
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
            }
            
            // Show next layer
            const targetLayer = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${nextLayer}"]`);
            if (targetLayer) {
              targetLayer.classList.add('is-active');
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
            }
            
            // Show target layer
            const targetLayer = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${backTo}"]`);
            if (targetLayer) {
              targetLayer.classList.add('is-active');
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

})();

