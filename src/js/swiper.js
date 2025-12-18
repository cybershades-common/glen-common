// Testimonial Audio Swiper Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the testimonial audio swiper
    const testimonialAudioSwiper = new Swiper('.testimonial-audio-slider', {
        // Basic configuration
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
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
            init: function() {
                console.log('Testimonial Audio Swiper initialized');
            },
            slideChange: function() {
                console.log('Slide changed to:', this.activeIndex);
            }
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
