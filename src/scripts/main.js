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
    const menuToggle = document.getElementById('menuToggle');
    const hamburgerIcon = document.getElementById('hamburgerIcon');

    if (!menuToggle || !hamburgerIcon) return;

    menuToggle.addEventListener('click', function () {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      
      // Toggle state
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      hamburgerIcon.classList.toggle('is-active');
      
      // Toggle body scroll lock when menu is open (for future offcanvas/mega menu)
      document.body.classList.toggle('menu-open');

      // Dispatch custom event for other components to listen to
      const event = new CustomEvent('menuToggle', { 
        detail: { isOpen: !isExpanded } 
      });
      document.dispatchEvent(event);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        menuToggle.setAttribute('aria-expanded', 'false');
        hamburgerIcon.classList.remove('is-active');
        document.body.classList.remove('menu-open');
      }
    });
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
      
      // Return focus to menu toggle
      menuToggle.focus();
    }

    // Toggle on hamburger click
    menuToggle.addEventListener('click', function (e) {
      e.preventDefault();
      const isOpen = megaMenu.classList.contains('is-active');
      
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
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

    // Close menu when clicking any navigation link
    const menuLinks = megaMenu.querySelectorAll('.mega-menu__nav a, .mega-menu__subnav a');
    menuLinks.forEach(link => {
      link.addEventListener('click', function () {
        // Small delay for smooth transition before closing
        setTimeout(closeMenu, 200);
      });
    });

    // Hide all submenus initially
    const allSubmenus = megaMenu.querySelectorAll('.mega-menu__subnav[data-submenu-content]');
    allSubmenus.forEach(submenu => {
      submenu.classList.remove('is-active');
    });

    // Submenu switching on hover
    const mainNavItems = megaMenu.querySelectorAll('.mega-menu__nav-item a[data-submenu]');

    mainNavItems.forEach(navLink => {
      navLink.addEventListener('mouseenter', function () {
        const submenuId = this.getAttribute('data-submenu');
        
        // Hide all submenus
        allSubmenus.forEach(submenu => {
          submenu.classList.remove('is-active');
        });
        
        // Show the corresponding submenu
        const targetSubmenu = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${submenuId}"]`);
        if (targetSubmenu) {
          targetSubmenu.classList.add('is-active');
        }
      });
    });

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

