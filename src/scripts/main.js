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
      
      // Auto-activate learning submenu after menu opens (desktop/tablet only)
      setTimeout(() => {
        const isMobile = window.innerWidth < 768;
        if (!isMobile) {
          const learningSubmenu = megaMenu.querySelector('.mega-menu__subnav[data-submenu-content="learning"]');
          const learningNavLink = megaMenu.querySelector('a[data-submenu="learning"]');
          
          if (learningSubmenu && learningNavLink) {
            // Hide all other submenus first
            const allSubmenus = megaMenu.querySelectorAll('.mega-menu__subnav[data-submenu-content]');
            allSubmenus.forEach(submenu => {
              submenu.classList.remove('is-active');
            });
            
            // Remove active state from all nav links
            const allNavLinks = megaMenu.querySelectorAll('.mega-menu__nav a[data-submenu]');
            allNavLinks.forEach(link => {
              link.classList.remove('is-active');
            });
            
            // Activate learning submenu and nav link
            slideInSubmenu(learningSubmenu, 'right');
            learningNavLink.classList.add('is-active');
          }
        }
      }, 300); // Small delay to let menu animation complete
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

    // Mobile sliding animation functions
    function slideInSubmenu(submenu, direction = 'right') {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        // Desktop behavior - no sliding
        submenu.classList.add('is-active');
        if (menuAnimations && menuAnimations.animateSubmenuItems) {
          menuAnimations.animateSubmenuItems(submenu, 'bottom');
        }
        return;
      }
      
      // Remove any existing animation classes
      submenu.classList.remove('slide-in-right', 'slide-in-left', 'slide-out-right', 'slide-out-left');
      
      // Set initial position based on direction
      if (direction === 'right') {
        submenu.classList.add('slide-in-right');
      } else {
        submenu.classList.add('slide-in-left');
      }
      
      // Force a reflow to ensure the initial position is applied
      submenu.offsetHeight;
      
      // Add is-active class to trigger the slide-in animation
      submenu.classList.add('is-active');
      
      // Animate submenu items after slide animation
      if (menuAnimations && menuAnimations.animateSubmenuItems) {
        setTimeout(() => {
          menuAnimations.animateSubmenuItems(submenu, direction);
        }, 150);
      }
    }
    
    function slideOutSubmenu(submenu, direction = 'right') {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        // Desktop behavior - no sliding
        submenu.classList.remove('is-active');
        if (menuAnimations && menuAnimations.resetSubmenuItems) {
          menuAnimations.resetSubmenuItems(submenu);
        }
        return;
      }
      
      // Check if this is a first-level submenu (no data-layer or data-layer="1")
      const isFirstLevel = !submenu.hasAttribute('data-layer') || submenu.getAttribute('data-layer') === '1';
      
      if (isFirstLevel && typeof gsap !== 'undefined') {
        // First level: Animate submenu items out with stagger, then fade overlay
        const submenuItems = submenu.querySelectorAll('.mega-menu__subnav-item, .mobile-only');
        
        // Animate items out with stagger
        gsap.to(submenuItems, {
          x: direction === 'right' ? 100 : -100,
          opacity: 0,
          duration: 0.3,
          stagger: {
            amount: 0.2,
            from: 'start'
          },
          ease: 'power2.in',
          onComplete: () => {
            // After items animate out, fade the overlay
            gsap.to(submenu, {
              opacity: 0,
              duration: 0.2,
              onComplete: () => {
                // Remove active state and clean up
                submenu.classList.remove('is-active');
                submenu.classList.remove('slide-out-right', 'slide-out-left', 'slide-in-right', 'slide-in-left');
                
                // Reset all transforms
                gsap.set(submenu, { opacity: 1 });
                gsap.set(submenuItems, { x: 0, y: 100, opacity: 0 });
              }
            });
          }
        });
      } else {
        // Deeper levels: Regular slide-out behavior
        if (direction === 'right') {
          submenu.classList.add('slide-out-right');
        } else {
          submenu.classList.add('slide-out-left');
        }
        
        // Remove is-active class after animation completes (400ms as per CSS transition)
        setTimeout(() => {
          submenu.classList.remove('is-active');
          submenu.classList.remove('slide-out-right', 'slide-out-left', 'slide-in-right', 'slide-in-left');
          
          // Reset submenu items animation after slide-out completes
          if (menuAnimations && menuAnimations.resetSubmenuItems) {
            menuAnimations.resetSubmenuItems(submenu);
          }
        }, 400);
      }
    }

    // ========================================================================
    // MAIN MENU NAVIGATION - Handle clicks on main menu items to open submenus
    // ========================================================================
    const menuLinks = megaMenu.querySelectorAll('.mega-menu__nav a[data-submenu]');
    menuLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        const submenuId = this.getAttribute('data-submenu');
        const isMobile = window.innerWidth < 768;
        
        // Find target submenu (prefer layer 1)
        let targetSubmenu = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${submenuId}"][data-layer="1"]`) ||
                           megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${submenuId}"][data-layer]`) ||
                           megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${submenuId}"]`);
        
        if (targetSubmenu) {
          if (isMobile) {
            // Mobile: Show new submenu immediately, others will slide out after delay
            slideInSubmenu(targetSubmenu, 'right');
            allSubmenus.forEach(submenu => {
              if (submenu !== targetSubmenu && submenu.classList.contains('is-active')) {
                slideOutSubmenu(submenu, 'left');
              }
            });
          } else {
            // Desktop: Traditional behavior
            allSubmenus.forEach(submenu => {
              submenu.classList.remove('is-active');
              if (menuAnimations && menuAnimations.resetSubmenuItems) {
                menuAnimations.resetSubmenuItems(submenu);
              }
            });
            slideInSubmenu(targetSubmenu, 'right');
          }
        }
      });
    });
    // ========================================================================

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
        const isMobile = window.innerWidth < 768;
        
        // On mobile, don't handle hover events - only click events
        if (isMobile) return;
        
        // Remove active state from all nav links first
        const allNavLinks = megaMenu.querySelectorAll('.mega-menu__nav a[data-submenu]');
        allNavLinks.forEach(link => {
          link.classList.remove('is-active');
        });
        
        // Hide all submenus (desktop only - no sliding animations on hover)
        allSubmenus.forEach(submenu => {
          submenu.classList.remove('is-active');
          // Reset submenu items animation
          if (menuAnimations && menuAnimations.resetSubmenuItems) {
            menuAnimations.resetSubmenuItems(submenu);
          }
        });
        
        // Add active state to current nav link
        this.classList.add('is-active');
        
        // Show the corresponding submenu (always layer 1)
        const targetSubmenu = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${submenuId}"][data-layer="1"]`);
        if (targetSubmenu) {
          targetSubmenu.classList.add('is-active');
          // Animate submenu items
          if (menuAnimations && menuAnimations.animateSubmenuItems) {
            menuAnimations.animateSubmenuItems(targetSubmenu, 'bottom');
          }
        } else {
          // Fallback for submenus without layers
          const fallbackSubmenu = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${submenuId}"]:not([data-layer])`);
          if (fallbackSubmenu) {
            fallbackSubmenu.classList.add('is-active');
            // Animate submenu items
            if (menuAnimations && menuAnimations.animateSubmenuItems) {
              menuAnimations.animateSubmenuItems(fallbackSubmenu, 'bottom');
            }
          }
        }
      });
    });

    // ========================================================================
    // SUBMENU LAYER NAVIGATION - Handle clicks to go to deeper submenu levels
    // ========================================================================
    function handleLayerNavigation() {
      const clickableItems = megaMenu.querySelectorAll('.mega-menu__subnav-item--clickable');
      
      clickableItems.forEach(item => {
        // Handle both item and link clicks with same logic
        [item, item.querySelector('a')].filter(Boolean).forEach(element => {
          element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const nextLayer = item.getAttribute('data-next-layer');
            const isMobile = window.innerWidth < 768;
            
            if (nextLayer) {
              // Find target layer
              let targetLayer = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${nextLayer}"][data-layer]`) ||
                               megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${nextLayer}"]`);
              
              if (targetLayer) {
                const currentSubmenu = item.closest('.mega-menu__subnav');
                
                if (isMobile) {
                  // Mobile: Show new layer immediately, hide current after
                  slideInSubmenu(targetLayer, 'right');
                  if (currentSubmenu) slideOutSubmenu(currentSubmenu, 'left');
                } else {
                  // Desktop: Traditional behavior
                  allSubmenus.forEach(submenu => {
                    submenu.classList.remove('is-active');
                    if (menuAnimations && menuAnimations.resetSubmenuItems) {
                      menuAnimations.resetSubmenuItems(submenu);
                    }
                  });
                  targetLayer.classList.add('is-active');
                  if (menuAnimations && menuAnimations.animateSubmenuItems) {
                    menuAnimations.animateSubmenuItems(targetLayer, 'right');
                  }
                }
              }
            }
          });
        });
      });

      // ====================================================================
      // BACK BUTTON NAVIGATION - Handle clicks to go back to previous level
      // ====================================================================
      const backButtons = megaMenu.querySelectorAll('.mega-menu__subnav-item--back a');
      
      backButtons.forEach(backLink => {
        backLink.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          const backButton = backLink.closest('.mega-menu__subnav-item--back');
          const backTo = backButton.getAttribute('data-back-to');
          const currentSubmenu = backButton.closest('.mega-menu__subnav');
          const isMobile = window.innerWidth < 768;
          
          if (!currentSubmenu) return;
          
          // Going back to main menu (close current submenu)
          if (!backTo || currentSubmenu.getAttribute('data-submenu-content') === backTo) {
            if (isMobile) {
              slideOutSubmenu(currentSubmenu, 'right');
            } else {
              currentSubmenu.classList.remove('is-active');
              if (menuAnimations && menuAnimations.resetSubmenuItems) {
                menuAnimations.resetSubmenuItems(currentSubmenu);
              }
            }
          }
          // Going back to previous layer
          else {
            const targetLayer = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${backTo}"]`);
            
            if (targetLayer) {
              if (isMobile) {
                // Set higher z-index for target layer to appear over current
                targetLayer.style.zIndex = '1005';
                slideInSubmenu(targetLayer, 'left');
                
                // Delay slide out to let the previous menu appear first
                setTimeout(() => {
                  slideOutSubmenu(currentSubmenu, 'right');
                  // Reset z-index after animation completes
                  setTimeout(() => {
                    targetLayer.style.zIndex = '';
                  }, 400);
                }, 200);
              } else {
                currentSubmenu.classList.remove('is-active');
                if (menuAnimations && menuAnimations.resetSubmenuItems) {
                  menuAnimations.resetSubmenuItems(currentSubmenu);
                }
                targetLayer.classList.add('is-active');
                if (menuAnimations && menuAnimations.animateSubmenuItems) {
                  menuAnimations.animateSubmenuItems(targetLayer, 'left');
                }
              }
            }
          }
        });
      });
    }
    // ========================================================================

    // Initialize layer navigation
    handleLayerNavigation();
    
    // Initialize circle image layer switching
    initCircleImageLayerSwitching();

    // Quick Links Accordion - Desktop version
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

    // Quick Links Accordion - Mobile version
    const mobileQuickLinksToggle = document.getElementById('mobileQuickLinksToggle');
    const mobileQuickLinksDropdown = document.getElementById('mobileQuickLinksDropdown');

    if (mobileQuickLinksToggle && mobileQuickLinksDropdown) {
      mobileQuickLinksToggle.addEventListener('click', function () {
        const isOpen = mobileQuickLinksDropdown.classList.contains('is-open');
        
        if (isOpen) {
          mobileQuickLinksDropdown.classList.remove('is-open');
          mobileQuickLinksToggle.classList.remove('is-open');
          mobileQuickLinksToggle.setAttribute('aria-expanded', 'false');
        } else {
          mobileQuickLinksDropdown.classList.add('is-open');
          mobileQuickLinksToggle.classList.add('is-open');
          mobileQuickLinksToggle.setAttribute('aria-expanded', 'true');
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
    const section = document.querySelector('.video-testimonials');
    if (!section) return;

    let cards = section.querySelectorAll('.card');
    if (!cards.length) return;

    // Initialize Swiper for Mobile
    const videoTestimonialsSwiperContainer = section.querySelector('.video-testimonials-swiper .swiper');
    let mobileSwiper = null;
    if (videoTestimonialsSwiperContainer && typeof Swiper !== 'undefined') {
      mobileSwiper = new Swiper(videoTestimonialsSwiperContainer, {
        slidesPerView: 1.25,
        spaceBetween: 20,
        loop: true,
        autoplay: false,
        breakpoints: {
          320: {
            slidesPerView: 1.25,
            spaceBetween: 16
          },
          768: {
            slidesPerView: 1.25,
            spaceBetween: 20
          }
        }
      });
      cards = section.querySelectorAll('.card');
    }

    const cardList = Array.from(cards);

    // ==========================================================================
    // VIDEO TESTIMONIAL INLINE CONTROLS - START
    // ==========================================================================
    const activeState = {
      video: null,
      button: null
    };

    cardList.forEach(card => {
      const video = card.querySelector('.testimonial-video');
      const controlButton = card.querySelector('.play-button');
      if (!video || !controlButton) return;

      const isDesktopCard = Boolean(card.closest('.desktop-only'));
      setupDefaultState(video, isDesktopCard);

      if (isDesktopCard) {
        card.addEventListener('mouseenter', () => handleDesktopHover(video, controlButton, true));
        card.addEventListener('mouseleave', () => handleDesktopHover(video, controlButton, false));
      }

      controlButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        const isActive = controlButton.classList.contains('is-active');
        if (isActive) {
          resetVideo(card, video, controlButton, isDesktopCard);
        } else {
          playWithAudio(card, video, controlButton);
        }
      });

      video.addEventListener('ended', () => {
        if (controlButton.classList.contains('is-active')) {
          resetVideo(card, video, controlButton, isDesktopCard);
        }
      });
    });

    if (mobileSwiper) {
      mobileSwiper.on('slideChangeTransitionEnd', () => {
        if (activeState.video && activeState.button) {
          const slide = activeState.video.closest('.swiper-slide');
          if (slide && !slide.classList.contains('swiper-slide-active')) {
            const activeCard = activeState.button.closest('.card');
            resetVideo(activeCard, activeState.video, activeState.button, false);
          }
        }

        const activeSlide = section.querySelector('.video-testimonials-swiper .swiper-slide-active');
        if (activeSlide) {
          const slideVideo = activeSlide.querySelector('.testimonial-video');
          const slideButton = activeSlide.querySelector('.play-button');
          if (slideVideo && slideButton && !slideButton.classList.contains('is-active')) {
            slideVideo.play().catch(() => {});
          }
        }
      });
    }

    function setupDefaultState(video, isDesktopCard) {
      video.muted = true;
      video.loop = true;

      if (isDesktopCard) {
        video.pause();
        video.currentTime = 0;
      } else {
        requestAnimationFrame(() => {
          video.play().catch(() => {});
        });
      }
    }

    function handleDesktopHover(video, button, isHovering) {
      if (button.classList.contains('is-active')) return;

      if (isHovering) {
        video.muted = true;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }

    function playWithAudio(card, video, button) {
      if (activeState.video && activeState.video !== video && activeState.button) {
        const activeCard = activeState.button.closest('.card');
        const isDesktopActive = Boolean(activeCard && activeCard.closest('.desktop-only'));
        resetVideo(activeCard, activeState.video, activeState.button, isDesktopActive);
      }

      activeState.video = video;
      activeState.button = button;

      button.classList.add('is-active');
      button.setAttribute('aria-pressed', 'true');
      button.setAttribute('aria-label', 'Close video with sound');
      video.loop = false;
      video.muted = false;
      video.currentTime = 0;
      video.play().catch(() => {});
    }

    function resetVideo(card, video, button, isDesktopCard) {
      if (!video || !button) return;

      button.classList.remove('is-active');
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', 'Play video with sound');
      video.muted = true;
      video.loop = true;
      video.pause();
      video.currentTime = 0;

      if (!isDesktopCard) {
        video.play().catch(() => {});
      }

      if (activeState.video === video) {
        activeState.video = null;
        activeState.button = null;
      }
    }
    // ==========================================================================
    // VIDEO TESTIMONIAL INLINE CONTROLS - END
    // ==========================================================================
  }

  // ==========================================================================
  // CO-CURRICULAR OPPORTUNITIES CAROUSEL
  // ==========================================================================

  function initCoCurricularCarousel() {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded');
      return;
    }

    const section = document.querySelector('.co-curricular-carousel');
    if (!section) return;

    const sliderEl = section.querySelector('.slider');
    const slideElements = Array.from(section.querySelectorAll('.swiper-slide'));
    if (!sliderEl || !slideElements.length) return;

    const paginationDots = Array.from(section.querySelectorAll('.pagination-dot'));
    const prevArrow = section.querySelector('.navigation .arrow-navigation__arrow--left');
    const nextArrow = section.querySelector('.navigation .arrow-navigation__arrow--right');
    const counterCurrent = section.querySelector('.counter-current');
    const counterTotal = section.querySelector('.counter-total');
    const totalSlides = slideElements.length;

    if (counterTotal) {
      counterTotal.textContent = totalSlides;
    }

    class CarouselSlide {
      constructor(el) {
        this.DOM = {
          el,
          media: el.querySelector('.video'),
          content: el.querySelector('.slide-content')
        };
        this.config = { duration: 1, ease: 'expo.inOut' };
        gsap.set(this.DOM.el, { opacity: 0, zIndex: 1, xPercent: 0 });
        this.setCurrent(false);
      }

      setCurrent(state = true) {
        this.DOM.el.classList.toggle('current', state);
      }

      play() {
        if (this.DOM.media) {
          this.DOM.media.play().catch(() => {});
        }
      }

      pause() {
        if (this.DOM.media) {
          this.DOM.media.pause();
          this.DOM.media.currentTime = 0;
        }
      }

      show(direction) {
        return this.toggle('show', direction);
      }

      hide(direction) {
        return this.toggle('hide', direction);
      }

      toggle(action, direction) {
        const offset = direction === 'right' ? 100 : -100;
        const contentOffset = direction === 'right' ? -80 : 80;
        const mediaOffset = direction === 'right' ? -60 : 60;

        return new Promise(resolve => {
          if (action === 'hide') {
            gsap.set(this.DOM.el, { opacity: 0, zIndex: 1, xPercent: 0 });
            this.setCurrent(false);
            resolve();
            return;
          }

          this.setCurrent(true);
          gsap.set(this.DOM.el, { opacity: 1, zIndex: 11, xPercent: offset });

          const timeline = gsap.timeline({
            defaults: { duration: this.config.duration, ease: this.config.ease },
            onComplete: () => {
              gsap.set(this.DOM.el, { zIndex: 9, xPercent: 0 });
              resolve();
            }
          });

          timeline.to(this.DOM.el, { xPercent: 0 }, 0);

          if (this.DOM.media) {
            timeline.fromTo(
              this.DOM.media,
              { xPercent: mediaOffset, scale: 1.05 },
              { xPercent: 0, scale: 1 },
              0
            );
          }
          if (this.DOM.content) {
            timeline.fromTo(
              this.DOM.content,
              { xPercent: contentOffset, filter: 'blur(30px)', opacity: 0.2 },
              { xPercent: 0, filter: 'blur(0px)', opacity: 1 },
              0
            );
          }
        });
      }
    }

    const slides = slideElements.map(el => new CarouselSlide(el));
    let currentIndex = 0;
    let isAnimating = false;

    const updatePagination = index => {
      paginationDots.forEach((dot, dotIndex) => {
        dot.classList.toggle('pagination-dot--active', dotIndex === index);
      });
    };

    const updateCounter = index => {
      if (counterCurrent) {
        counterCurrent.textContent = index + 1;
      }
    };

    const preloadVideos = () => {
      section.querySelectorAll('video').forEach(video => {
        video.setAttribute('preload', 'auto');
        try {
          if (video.readyState < 2) {
            video.load();
          }
        } catch (error) {
          console.warn('Unable to preload video', error);
        }
      });
    };
    preloadVideos();
    window.addEventListener('load', preloadVideos, { once: true });

    async function goTo(targetIndex, direction) {
      const normalizedIndex = (targetIndex + totalSlides) % totalSlides;
      if (isAnimating || normalizedIndex === currentIndex) return;

      const travelDirection = direction || (normalizedIndex > currentIndex ? 'right' : 'left');
      isAnimating = true;

      const outgoing = slides[currentIndex];
      const incoming = slides[normalizedIndex];

      incoming.play();
      await incoming.show(travelDirection);
      outgoing.pause();
      await outgoing.hide(travelDirection);
      outgoing.setCurrent(false);
      currentIndex = normalizedIndex;
      updatePagination(currentIndex);
      updateCounter(currentIndex);
      isAnimating = false;
    }

    // Events
    if (prevArrow) {
      prevArrow.addEventListener('click', () => goTo(currentIndex - 1, 'left'));
    }
    if (nextArrow) {
      nextArrow.addEventListener('click', () => goTo(currentIndex + 1, 'right'));
    }
    paginationDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const direction = index > currentIndex ? 'right' : 'left';
        goTo(index, direction);
      });
    });

    const handlePointer = () => {
      const initialSlide = slides[currentIndex];
      initialSlide.setCurrent(true);
      gsap.set(initialSlide.DOM.el, { opacity: 1, zIndex: 9, xPercent: 0 });
      initialSlide.play();
      updatePagination(currentIndex);
      updateCounter(currentIndex);
    };

    const getPoint = event => {
      if (event.touches && event.touches.length) {
        return { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }
      if (event.changedTouches && event.changedTouches.length) {
        return { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
      }
      return { x: event.clientX, y: event.clientY };
    };

    let swipeStart = null;
    let isPointerDown = false;

    const onPointerDown = event => {
      swipeStart = getPoint(event);
      isPointerDown = true;
    };

    const onPointerUp = event => {
      if (!isPointerDown || !swipeStart) return;
      const { x, y } = getPoint(event);
      const deltaX = x - swipeStart.x;
      const deltaY = y - swipeStart.y;
      isPointerDown = false;
      swipeStart = null;

      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        const direction = deltaX < 0 ? 'right' : 'left';
        goTo(currentIndex + (deltaX < 0 ? 1 : -1), direction);
      }
    };

    sliderEl.addEventListener('touchstart', onPointerDown, { passive: true });
    sliderEl.addEventListener('touchend', onPointerUp);
    sliderEl.addEventListener('mousedown', event => {
      event.preventDefault();
      onPointerDown(event);
    });
    window.addEventListener('mouseup', onPointerUp);

    handlePointer();
  }

  // ==========================================================================
  // FEATURES CARDS ELASTIC SLIDER
  // ==========================================================================

  function initFeaturesCardsSlider() {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP is required for the features slider');
      return;
    }

    const sliders = document.querySelectorAll('.what-we-do-section .features-cards-slider');
    if (!sliders.length) return;

    sliders.forEach(setupElasticSlider);
  }

  function setupElasticSlider(slider) {
    const track = slider.querySelector('.features-cards-track');
    const cards = track ? Array.from(track.querySelectorAll('.feature-card')) : [];
    if (!track || !cards.length) return;

    const body = document.body;
    const bodyDraggingClass = 'elastic-slider-dragging';

    const state = {
      current: 0,
      startX: 0,
      startPos: 0,
      isDown: false,
      velocity: 0,
      lastX: 0,
      lastTime: 0,
      min: 0,
      max: 0,
      momentum: null,
      pointerId: null,
      gap: parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '32') || 32
    };

    const clamp = gsap.utils.clamp;

    function applyCardSizing() {
      const sliderWidth = slider.clientWidth;
      const isCompact = sliderWidth < 768;
      const totalGap = state.gap * 3;
      const baseWidth = isCompact
        ? sliderWidth * 0.82
        : (sliderWidth - totalGap) / 3;
      const cardWidth = clamp(240, 540, baseWidth);
      const imageMultiplier = isCompact ? 0.82 : 1.08;

      cards.forEach(card => {
        card.style.flex = `0 0 ${cardWidth}px`;
        card.style.maxWidth = `${cardWidth}px`;
        const image = card.querySelector('.feature-card-image');
        if (image) {
          image.style.height = `${cardWidth * imageMultiplier}px`;
        }
      });
    }

    function recalcBounds() {
      applyCardSizing();
      const sliderWidth = slider.clientWidth;
      const trackWidth = track.scrollWidth;
      const overshoot = sliderWidth * 0.35;
      const overflow = Math.max(0, trackWidth - sliderWidth);
      state.min = -overflow - overshoot;
      state.max = overshoot;
      if (overflow <= 0) {
        state.min = state.max = 0;
      }
    }

    function updateDepth() {
      const sliderCenter = slider.clientWidth / 2;
      cards.forEach(card => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2 + state.current;
        const distance = Math.abs(sliderCenter - cardCenter);
        const ratio = Math.min(1, distance / sliderCenter);
        const scale = 1 - ratio * 0.2;
        const depthShift = ratio * 110 + (card.classList.contains('feature-card-bottom') ? 30 : 0);
        card.style.zIndex = String(120 - Math.round(ratio * 80));
        gsap.to(card, {
          y: depthShift,
          scale,
          duration: 0.55,
          ease: 'power3.out',
          overwrite: true,
          force3D: true
        });
      });
    }

    function setPosition(x) {
      state.current = x;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      updateDepth();
    }

    function stopMomentum() {
      if (state.momentum) {
        state.momentum.kill();
        state.momentum = null;
      }
    }

    function onPointerDown(event) {
      event.preventDefault();
      slider.classList.add('is-dragging');
      body.classList.add(bodyDraggingClass);
      if (slider.setPointerCapture) {
        slider.setPointerCapture(event.pointerId);
      }
      state.pointerId = event.pointerId;
      stopMomentum();
      state.isDown = true;
      state.startX = event.clientX;
      state.startPos = state.current;
      state.lastX = event.clientX;
      state.lastTime = performance.now();
    }

    function onPointerMove(event) {
      if (!state.isDown) return;
      event.preventDefault();
      const delta = event.clientX - state.startX;
      let next = state.startPos + delta;

      if (next > state.max) {
        next = state.max + (next - state.max) * 0.35;
      } else if (next < state.min) {
        next = state.min + (next - state.min) * 0.35;
      }

      const now = performance.now();
      const dt = now - state.lastTime || 1;
      state.velocity = (event.clientX - state.lastX) / dt;
      state.lastX = event.clientX;
      state.lastTime = now;

      setPosition(next);
    }

    function onPointerUp(event) {
      if (!state.isDown) return;
      slider.classList.remove('is-dragging');
      body.classList.remove(bodyDraggingClass);
      if (event && state.pointerId !== null && slider.releasePointerCapture) {
        try {
          slider.releasePointerCapture(state.pointerId);
        } catch (err) {
          // Ignore release errors when pointer is already gone
        }
      }
      state.pointerId = null;
      state.isDown = false;

      const projected = state.current + state.velocity * 1500;
      const target = clamp(state.min, state.max, projected);

      state.momentum = gsap.to({ value: state.current }, {
        value: target,
        duration: 1.6,
        ease: 'power4.out',
        onUpdate: function () {
          setPosition(this.targets()[0].value);
        },
        onComplete: () => {
          state.momentum = null;
        }
      });
    }

    function getPairCenter() {
      if (cards.length <= 1) {
        return cards[0].offsetLeft + cards[0].offsetWidth / 2;
      }
      const middleIndex = Math.max(1, Math.floor(cards.length / 2));
      const prev = cards[Math.max(0, middleIndex - 1)];
      const current = cards[Math.min(cards.length - 1, middleIndex)];
      return (prev.offsetLeft + prev.offsetWidth / 2 + current.offsetLeft + current.offsetWidth / 2) / 2;
    }

    function setInitialPosition() {
      const sliderCenter = slider.clientWidth / 2;
      const pairCenter = getPairCenter();
      const desired = sliderCenter - pairCenter;
      const padding = Math.min(slider.clientWidth * 0.08, 140);
      const initial = clamp(state.min + padding, state.max - padding, desired);
      setPosition(initial);
    }

    function onResize() {
      const prev = state.current;
      recalcBounds();
      const clamped = clamp(state.min, state.max, prev);
      setPosition(clamped);
    }

    recalcBounds();
    setInitialPosition();
    updateDepth();

    slider.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('resize', () => {
      clearTimeout(slider._resizeTimer);
      slider._resizeTimer = setTimeout(onResize, 120);
    });
  }

})();
