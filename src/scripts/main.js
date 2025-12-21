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
    if (window.initMegaMenu) {
      window.initMegaMenu();
    }
    initStickyHeader();
    initSmoothScroll();
    // initHeroSlider();
    initVideoTestimonials();
    initCoCurricularCarousel();
    // initFeaturesCardsSlider();
   
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
  // STICKY HEADER
  // ==========================================================================

  function initStickyHeader() {

  let isOffsetTop = false;

  let lastScrollTop = 0;

  let lastMobileTriggerScroll = 0;
 
  function scroll_offset(scroll) {

    if (scroll > 0) {

      if (!isOffsetTop) {

        document.body.classList.add('is-offset-top');

        isOffsetTop = true;

      }

    } else {

      if (isOffsetTop) {

        document.body.classList.remove('is-offset-top');

        isOffsetTop = false;

      }

    }

  }
 
  function handleScroll() {

    const currentScrollY =

      window.pageYOffset || document.documentElement.scrollTop;
 
    scroll_offset(currentScrollY);
 
    const isMobile = window.innerWidth <68;
 
    if (isMobile) {

      // 📱 MOBILE LOGIC (100px gap before showing)

      if (currentScrollY > lastScrollTop) {

        // scrolling down

        document.body.classList.add('scroll-down');

        lastMobileTriggerScroll = currentScrollY;

      } else {

        // scrolling up

        if (lastMobileTriggerScroll - currentScrollY >= 0) {

          document.body.classList.remove('scroll-down');

        }

      }
 
      const header = document.querySelector('.site-header');

      if (header) {

        header.classList.toggle('is-scrolled-mobile', currentScrollY > 0);

      }

    } else {

      // 🖥 DESKTOP LOGIC (instant show on scroll up)

      if (currentScrollY > lastScrollTop && currentScrollY > 80) {

        document.body.classList.add('scroll-down');

      } else {

        document.body.classList.remove('scroll-down');

      }

    }
 
    lastScrollTop = currentScrollY <= 0 ? 0 : currentScrollY;

  }
 
  // Initial check

  scroll_offset(window.scrollY);
 
  window.addEventListener('scroll', handleScroll, { passive: true });

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

  // function initHeroSlider() {
  //   // Check if Swiper is loaded
  //   if (typeof Swiper === 'undefined') {
  //     console.warn('Swiper not loaded');
  //     return;
  //   }

  //   const heroSlider = document.querySelector('.hero__slider');
  //   if (!heroSlider) return;

  //   // Initialize Swiper
  //   const swiper = new Swiper('.hero__slider', {
  //     // Slider settings
  //     loop: true,
  //     speed: 1200,
  //     effect: 'slide',
  //     slidesPerView: 1,
  //     spaceBetween: 0,
      
  //     // Smooth sliding with easing
  //     resistanceRatio: 0,
  //     touchRatio: 1,
  //     threshold: 5,
      
  //     autoplay: {
  //       delay: 5000,
  //       disableOnInteraction: false,
  //       pauseOnMouseEnter: true
  //     },
      
  //     // Pagination
  //     pagination: {
  //       el: '.swiper-pagination',
  //       clickable: true,
  //       dynamicBullets: false
  //     },

  //     // Accessibility
  //     a11y: {
  //       prevSlideMessage: 'Previous slide',
  //       nextSlideMessage: 'Next slide',
  //       paginationBulletMessage: 'Go to slide {{index}}'
  //     },

  //     // Keyboard control
  //     keyboard: {
  //       enabled: true,
  //       onlyInViewport: true
  //     }
  //   });

  //   // Connect arrow navigation buttons to Swiper
  //   const prevArrow = document.querySelector('.arrow-navigation__arrow--left');
  //   const nextArrow = document.querySelector('.arrow-navigation__arrow--right');

  //   if (prevArrow) {
  //     prevArrow.addEventListener('click', function() {
  //       swiper.slidePrev();
  //     });
  //   }

  //   if (nextArrow) {
  //     nextArrow.addEventListener('click', function() {
  //       swiper.slideNext();
  //     });
  //   }

  //   // Pause autoplay when play button is clicked
  //   const playButton = document.querySelector('.play-button');
  //   if (playButton) {
  //     playButton.addEventListener('click', function() {
  //       swiper.autoplay.stop();
  //     });
  //   }

  //   // Handle video slides
  //   swiper.on('slideChange', function () {
  //     // Pause all videos
  //     const videos = document.querySelectorAll('.hero__slide-video');
  //     videos.forEach(video => {
  //       video.pause();
  //     });

  //     // Play video in active slide if it exists
  //     const activeSlide = swiper.slides[swiper.activeIndex];
  //     const activeVideo = activeSlide?.querySelector('.hero__slide-video');
  //     if (activeVideo) {
  //       activeVideo.play().catch(err => {
  //         console.log('Video autoplay prevented:', err);
  //       });
  //     }
  //   });
  // }

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
      const slideCount = videoTestimonialsSwiperContainer.querySelectorAll('.swiper-slide').length;
      mobileSwiper = new Swiper(videoTestimonialsSwiperContainer, {
        slidesPerView: 1.25,
        spaceBetween: 20,
        loop: slideCount >= 3,
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
  // FEATURES CARDS SWIPER SLIDER
  // ==========================================================================

  // function initFeaturesCardsSlider() {
  //   if (typeof Swiper === 'undefined') {
  //     console.warn('Swiper is required for the features cards slider');
  //     return;
  //   }

  //   const sliders = document.querySelectorAll('.what-we-do-section .features-cards-carousel');
  //   if (!sliders.length) return;

  //   sliders.forEach(slider => {
  //     if (slider.swiper) return;

  //     const paginationEl = slider.querySelector('.features-cards-pagination');
  //     const slideCount = slider.querySelectorAll('.swiper-slide').length;

  //     const swiperConfig = {
  //       speed: 600,
  //       loop: slideCount >= 3,
  //       centeredSlides: false,
  //       spaceBetween: 12,
  //       slidesPerView: 1.25,
  //       breakpoints: {
  //         576: {
  //           slidesPerView: 1.35
  //         },
  //         768: {
  //           slidesPerView: 1.6,
  //           centeredSlides: true,
  //           spaceBetween: 20
  //         },
  //         1024: {
  //           slidesPerView: 3,
  //           centeredSlides: true,
  //           spaceBetween: 10
  //         },
  //         1400: {
  //           slidesPerView: 4,
  //           centeredSlides: true,
  //           spaceBetween: 8
  //         }
  //       }
  //     };

  //     if (paginationEl) {
  //       swiperConfig.pagination = {
  //         el: paginationEl,
  //         clickable: true
  //       };
  //     }

  //     new Swiper(slider, swiperConfig);
  //   });
  // }

 
  

})();
