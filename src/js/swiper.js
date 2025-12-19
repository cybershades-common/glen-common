// Swiper Initialization
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // FEATURED CARDS SWIPER (exact same as design inspiration)
    // ==========================================================================
    
    // Dramatic effect variables (exact same as design inspiration)
    let lastTime = performance.now();
    let lastTranslate = 0;
    let velocity = 0;
    let rafId = null;

    const featuresSlider = document.querySelector('.features-cards-carousel');
    if (featuresSlider) {
        // Check if cards have dramatic effect elements
        const hasFeatureCards = !!featuresSlider.querySelectorAll('.swiper-slide .feature-card').length > 0;
        
        const featuredCardsSwiper = new Swiper('.features-cards-carousel', {
            // Exact same configuration as design inspiration
            speed: 900,
            spaceBetween: 30,
            resistance: false,
            slidesPerView: 3, // Shows 2 full cards + 2 half cards (= 4 slides total)
            
            // Responsive breakpoints
            breakpoints: {
                // Mobile
                320: {
                    slidesPerView: 1.2,
                    spaceBetween: 20,
                },
                // Tablet
                768: {
                    slidesPerView: 2.5,
                    spaceBetween: 25,
                },
                // Desktop - 4 slides per screen (2 full + 2 half)
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                }
            },
            
            // Navigation (if you want to add arrows later)
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            
            // Dramatic zoom-out effect on drag (exact same as design inspiration)
            on: {
                setTranslate(swiper, translate) {
                    if(hasFeatureCards) {
                        trackVelocity(swiper);
                    }
                },
                touchEnd(swiper) {
                    if(hasFeatureCards) {
                        continueTracking(swiper);
                    }
                },
                transitionStart(swiper) {
                    if(hasFeatureCards) {
                        simulateDragTracking(swiper);
                    }
                },
                transitionEnd(swiper) {
                    if(hasFeatureCards) {
                        stopTracking();
                    }
                }
            }
        });
    }

    // Velocity tracking functions (exact same as design inspiration)
    function trackVelocity(swiper) {
        const currentTime = performance.now();
        const currentTranslate = swiper.translate;
        const deltaTime = currentTime - lastTime;
        const deltaTranslate = currentTranslate - lastTranslate;
        velocity = Math.abs(deltaTranslate / deltaTime);
        applyScaleEffect(velocity, swiper);
        lastTranslate = currentTranslate;
        lastTime = currentTime;
    }

    function continueTracking(swiper) {
        cancelAnimationFrame(rafId);
        const track = () => {
            trackVelocity(swiper);
            if (velocity > 0.01) {
                rafId = requestAnimationFrame(track);
            } else {
                stopTracking();
            }
        };
        rafId = requestAnimationFrame(track);
    }

    function simulateDragTracking(swiper) {
        cancelAnimationFrame(rafId);
        velocity = 2.5;
        const friction = 0.92;
        const fakeTrack = () => {
            applyScaleEffect(velocity, swiper);
            velocity *= friction;
            if (velocity > 0.01) {
                rafId = requestAnimationFrame(fakeTrack);
            } else {
                stopTracking();
            }
        };
        rafId = requestAnimationFrame(fakeTrack);
    }

    function stopTracking() {
        cancelAnimationFrame(rafId);
        velocity = 0;
    }

    function applyScaleEffect(velocity, swiper) {
        const maxV = 3.0;
        const minV = 0.01;
        const maxScale = 1;
        const minScale = 0.7; // 30% zoom out effect
        const norm = 1 - Math.min(Math.max((velocity - minV) / (maxV - minV), 0), 1);
        const scaleX = minScale + (maxScale - minScale) * norm;
        
        // Apply scale to feature cards (same selector as design inspiration)
        swiper.el.querySelectorAll('.swiper-slide .feature-card').forEach((card) => {
            card.style.transform = `scale(${scaleX.toFixed(3)})`;
        });
    }
    
    // ==========================================================================
    // TESTIMONIAL AUDIO SWIPER
    // ==========================================================================
    
    // Initialize the testimonial audio swiper
    const sliderEl = document.querySelector('.testimonial-audio-slider');
    const slideCount = sliderEl ? sliderEl.querySelectorAll('.swiper-slide').length : 0;
    const testimonialAudioSwiper = new Swiper('.testimonial-audio-slider', {
        // Basic configuration
        slidesPerView: 1,
        spaceBetween: 0,
        loop: slideCount >= 3,
        speed: 600,
        
        // Navigation
        navigation: {
            nextEl: '.testimonial-audio-navigation .arrow-navigation__arrow--right',
            prevEl: '.testimonial-audio-navigation .arrow-navigation__arrow--left',
        },
        
        // Pagination (optional - can be added if needed)
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        
        // Autoplay (optional - can be enabled if needed)
        autoplay: {
            delay: 5000,
            disableOnInteraction: true,
        },
        
        // Effect
        effect: 'slide',
        
        // Responsive breakpoints
        breakpoints: {
            // When window width is >= 768px
            768: {
                slidesPerView: 1,
                spaceBetween: 0,
            },
            // When window width is >= 1024px
            1024: {
                slidesPerView: 1,
                spaceBetween: 0,
            }
        },
        
        // Events
        on: {
            init: function() {},
            slideChange: function() {}
        }
    });
    
    // Audio player functionality (basic implementation)
    const audioPlayers = document.querySelectorAll('.testimonial-audio-player');
    
    audioPlayers.forEach(player => {
        const waveform = player.querySelector('.testimonial-audio-waveform');
        const duration = player.querySelector('.testimonial-audio-duration');
        
        // Add click event for play/pause functionality
        waveform.addEventListener('click', function() {
            // Toggle play/pause state
            this.classList.toggle('playing');
            
            // Update progress bar (simulation)
            const progressBar = this.querySelector('.testimonial-audio-waveform-progress');
            if (this.classList.contains('playing')) {
                // Simulate progress
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 2;
                    progressBar.style.width = progress + '%';
                    
                    if (progress >= 100) {
                        clearInterval(interval);
                        this.classList.remove('playing');
                        progressBar.style.width = '0%';
                    }
                }, 100);
            } else {
                // Reset progress when paused
                progressBar.style.width = '0%';
            }
        });
    });
});
