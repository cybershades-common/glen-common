/**
 * Mega Menu Animations
 * ====================
 * Simple GSAP stagger animation for mega menu items.
 * Menu items slide up from below with stagger effect.
 */

(function () {
  'use strict';

  /**
   * Initialize mega menu animations
   * @param {HTMLElement} megaMenu - The mega menu container element
   * @param {HTMLElement} megaMenuOverlay - The overlay element
   * @param {HTMLElement} menuToggle - The toggle button element
   * @param {HTMLElement} body - The body element
   */
  function initMegaMenuAnimations(megaMenu, megaMenuOverlay, menuToggle, body) {
    if (!megaMenu || !megaMenuOverlay) return null;

    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded - menu animations disabled');
      return null;
    }

    // Create timeline (paused initially)
    let menuTimeline = gsap.timeline({ paused: true });

    // Get menu items, circle image, footer links, and mobile elements
    const navItems = megaMenu.querySelectorAll('.mega-menu__nav-item');
    const circleImage = megaMenu.querySelector('.mega-menu__circle-image');
    const footerLinks = megaMenu.querySelectorAll('.mega-menu__footer-links a, .mega-menu__social a');
    
    // Mobile-only elements
    const mobileQuickLinksBtn = megaMenu.querySelector('#mobileQuickLinksToggle');
    const mobileSearchInput = megaMenu.querySelector('.mega-menu__footer .input-group');

    // Build animation timeline
    // Show menu and animate menu items from below
    menuTimeline
      .to(megaMenu, {
        autoAlpha: 1,
        duration: 0.3
      })
      .staggerFromTo(
        navItems,
        0.5,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1 },
        0.1
      );

    // Add footer links animation (same as menu items, starts after nav items)
    if (footerLinks && footerLinks.length > 0) {
      menuTimeline.staggerFromTo(
        footerLinks,
        0.5,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1 },
        0.1,
        0.3 // Start after menu items begin animating
      );
    }

    // Add mobile quick links button and search input animation (mobile only)
    const mobileElements = [];
    if (mobileQuickLinksBtn) mobileElements.push(mobileQuickLinksBtn);
    if (mobileSearchInput) mobileElements.push(mobileSearchInput);
    
    if (mobileElements.length > 0) {
      menuTimeline.staggerFromTo(
        mobileElements,
        0.5,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1 },
        0.1,
        0.4 // Start slightly after buttons
      );
    }

    // Add circle image zoom animation (runs simultaneously with menu items)
    if (circleImage) {
      menuTimeline.fromTo(
        circleImage,
        {
          scale: 0,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          transformOrigin: 'center center'
        },
        0.3 // Start slightly after menu appears
      );
    }

    /**
     * Open menu - play timeline forward
     */
    function openMenu() {
      // Reset timeline to start
      menuTimeline.progress(0);
      
      // Set initial state for menu items BEFORE menu becomes visible
      gsap.set(navItems, {
        y: 100,
        opacity: 0
      });
      
      // Set initial state for circle image (zoomed out from center)
      if (circleImage) {
        gsap.set(circleImage, {
          scale: 0,
          opacity: 0,
          transformOrigin: 'center center'
        });
      }
      
      // Set initial state for footer links (hidden below)
      if (footerLinks && footerLinks.length > 0) {
        gsap.set(footerLinks, {
          y: 100,
          opacity: 0
        });
      }
      
      // Set initial state for all submenu items
      setInitialSubmenuState();
      
      // Set initial state for mobile elements (mobile only)
      if (mobileQuickLinksBtn) {
        gsap.set(mobileQuickLinksBtn, {
          y: 100,
          opacity: 0
        });
      }
      
      if (mobileSearchInput) {
        gsap.set(mobileSearchInput, {
          y: 100,
          opacity: 0
        });
      }
      
      // Set menu active states
      megaMenu.classList.add('is-active');
      megaMenuOverlay.classList.add('is-active');
      body.classList.add('mega-menu-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      
      // Play animation from start
      menuTimeline.play(0);
      
      // Focus trap: focus first focusable element in menu
      const firstFocusable = megaMenu.querySelector('a, button, select');
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
    }

    /**
     * Close menu - reverse timeline
     */
    function closeMenu() {
      // Reverse animation
      menuTimeline.reverse(0);
      
      // Set reverse complete callback
      menuTimeline.eventCallback('onReverseComplete', () => {
        megaMenu.classList.remove('is-active');
        megaMenuOverlay.classList.remove('is-active');
        body.classList.remove('mega-menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        
        // Reset hamburger icon
        const hamburgerIcon = document.getElementById('hamburgerIcon');
        if (hamburgerIcon) {
          hamburgerIcon.classList.remove('is-active');
        }
        
        // Reset menu items to initial state (hidden below)
        gsap.set(navItems, {
          y: 100,
          opacity: 0
        });
        
        // Reset circle image to initial state (zoomed out)
        if (circleImage) {
          gsap.set(circleImage, {
            scale: 0,
            opacity: 0,
            transformOrigin: 'center center'
          });
        }
        
        // Reset footer links to initial state (hidden below)
        if (footerLinks && footerLinks.length > 0) {
          gsap.set(footerLinks, {
            y: 100,
            opacity: 0
          });
        }
        
        // Reset all submenu items
        resetAllSubmenuItems();
        
        // Reset mobile elements to initial state
        if (mobileQuickLinksBtn) {
          gsap.set(mobileQuickLinksBtn, {
            y: 100,
            opacity: 0
          });
        }
        
        if (mobileSearchInput) {
          gsap.set(mobileSearchInput, {
            y: 100,
            opacity: 0
          });
        }
        
        // Return focus to menu toggle
        menuToggle.focus();
      });
    }

    /**
     * Animate submenu items when submenu becomes active
     * @param {HTMLElement} submenu - The submenu element that became active
     * @param {string} direction - The direction: 'right' (forward), 'left' (backward), or 'bottom' (default)
     */
    function animateSubmenuItems(submenu, direction = 'bottom') {
      if (!submenu || typeof gsap === 'undefined') return;
      
      const submenuItems = submenu.querySelectorAll('.mega-menu__subnav-item, .mobile-only');
      
      if (submenuItems && submenuItems.length > 0) {
        let initialX = 0;
        let staggerDirection = 1;
        
        // Set initial position and stagger direction based on navigation direction
        if (direction === 'right') {
          initialX = 100; // Come from right
          staggerDirection = 1; // Stagger from left to right (first item animates first)
        } else if (direction === 'left') {
          initialX = -100; // Come from left  
          staggerDirection = 1; // Stagger from left to right (first item animates first) - same as forward
        } else {
          // Default bottom direction (existing behavior)
          initialX = 0;
          staggerDirection = 1;
        }
        
        // Set initial state
        gsap.set(submenuItems, {
          x: initialX,
          y: direction === 'bottom' ? 100 : 0,
          opacity: 0
        });
        
        // Animate with directional stagger and wave effect
        gsap.to(submenuItems, {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: {
            amount: 0.4, // Total time to stagger all items
            from: staggerDirection === 1 ? 'start' : 'end',
            ease: 'power2.inOut' // Wave-like easing for stagger
          },
          ease: 'back.out(1.4)' // Bouncy wave-like ease for individual items
        });
      }
    }

    /**
     * Reset submenu items animation
     * @param {HTMLElement} submenu - The submenu element
     */
    function resetSubmenuItems(submenu) {
      if (!submenu || typeof gsap === 'undefined') return;
      
      const submenuItems = submenu.querySelectorAll('.mega-menu__subnav-item, .mobile-only');
      
      if (submenuItems && submenuItems.length > 0) {
        gsap.set(submenuItems, {
          x: 0,
          y: 100,
          opacity: 0
        });
      }
    }

    // Set initial state for all submenu items when menu opens
    function setInitialSubmenuState() {
      const allSubmenus = megaMenu.querySelectorAll('.mega-menu__subnav');
      allSubmenus.forEach(submenu => {
        const submenuItems = submenu.querySelectorAll('.mega-menu__subnav-item, .mobile-only');
        if (submenuItems && submenuItems.length > 0) {
          gsap.set(submenuItems, {
            x: 0,
            y: 100,
            opacity: 0
          });
        }
      });
    }

    // Reset all submenu items on close
    function resetAllSubmenuItems() {
      const allSubmenus = megaMenu.querySelectorAll('.mega-menu__subnav');
      allSubmenus.forEach(submenu => {
        resetSubmenuItems(submenu);
      });
    }

    // Return control functions
    return {
      openMenu: openMenu,
      closeMenu: closeMenu,
      timeline: menuTimeline,
      animateSubmenuItems: animateSubmenuItems,
      resetSubmenuItems: resetSubmenuItems,
      setInitialSubmenuState: setInitialSubmenuState
    };
  }

  // Export function to global scope for use in main.js
  window.initMegaMenuAnimations = initMegaMenuAnimations;

})();
