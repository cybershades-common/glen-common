// Swiper Initialization
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // FEATURED CARDS SWIPER
    // ==========================================================================
    
    // Dynamic scaling effect variables
    let lastTime = performance.now();
    let lastTranslate = 0;
    let velocity = 0;
    let rafId = null;

    const featuresSlider = document.querySelector('.features-cards-carousel');
    if (featuresSlider) {
        // Check if cards have scaling effect elements
        const hasFeatureCards = !!featuresSlider.querySelectorAll('.swiper-slide .feature-card').length > 0;
        
        const featuredCardsSwiper = new Swiper('.features-cards-carousel', {
            // Core swiper configuration
            speed: 900,
            spaceBetween: 30,
            resistance: false,
            slidesPerView: 3, 
            grabCursor: false, 
            
            breakpoints: {
                // Mobile
                320: {
                    slidesPerView: 1.25,
                    spaceBetween: 10,
                },
                // Tablet
                768: {
                    slidesPerView: 2.5,
                    spaceBetween: 25,
                },
                // Desktop 
                1024: {
                    slidesPerView: 3.5,
                    
                }
            },
            
            // Navigation
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            
            // Dynamic scaling effect on drag
            on: {
                setTranslate(swiper, translate) {
                    if(hasFeatureCards) {
                        trackDragVelocity(swiper);
                    }
                },
                touchEnd(swiper) {
                    if(hasFeatureCards) {
                        continueDragTracking(swiper);
                    }
                },
                transitionStart(swiper) {
                    if(hasFeatureCards) {
                        simulateTransitionEffect(swiper);
                    }
                },
                transitionEnd(swiper) {
                    if(hasFeatureCards) {
                        stopDragEffect();
                    }
                }
            }
        });
    }

    // Dynamic scaling effect functions
    function trackDragVelocity(swiper) {
        const currentTime = performance.now();
        const currentTranslate = swiper.translate;
        const deltaTime = currentTime - lastTime;
        const deltaTranslate = currentTranslate - lastTranslate;
        velocity = Math.abs(deltaTranslate / deltaTime);
        applyCardScaling(velocity, swiper);
        lastTranslate = currentTranslate;
        lastTime = currentTime;
    }

    function continueDragTracking(swiper) {
        cancelAnimationFrame(rafId);
        const track = () => {
            trackDragVelocity(swiper);
            if (velocity > 0.01) {
                rafId = requestAnimationFrame(track);
            } else {
                stopDragEffect();
            }
        };
        rafId = requestAnimationFrame(track);
    }

    function simulateTransitionEffect(swiper) {
        cancelAnimationFrame(rafId);
        velocity = 2.5;
        const friction = 0.92;
        const animate = () => {
            applyCardScaling(velocity, swiper);
            velocity *= friction;
            if (velocity > 0.01) {
                rafId = requestAnimationFrame(animate);
            } else {
                stopDragEffect();
            }
        };
        rafId = requestAnimationFrame(animate);
    }

    function stopDragEffect() {
        cancelAnimationFrame(rafId);
        velocity = 0;
    }

    function applyCardScaling(velocity, swiper) {
        const maxVelocity = 3.0;
        const minVelocity = 0.01;
        const maxScale = 1;
        const minScale = 0.7; // 30% zoom out effect
        const normalized = 1 - Math.min(Math.max((velocity - minVelocity) / (maxVelocity - minVelocity), 0), 1);
        const scaleValue = minScale + (maxScale - minScale) * normalized;
        
        // Apply dynamic scaling to feature cards
        swiper.el.querySelectorAll('.swiper-slide .feature-card').forEach((card) => {
            card.style.transform = `scale(${scaleValue.toFixed(3)})`;
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
