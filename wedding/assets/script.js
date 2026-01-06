// Toggle Navigation Drawer
const menuToggle = document.getElementById('menuToggle');
const navDrawer = document.getElementById('navDrawer');

// menuToggle.addEventListener('click', (e) => {
//     e.stopPropagation();
//     navDrawer.classList.toggle('open');
// });

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const sliderContainer = document.querySelector('.slider-container');
    let currentIndex = 2; // Start with the third slide as active
    let isTransitioning = false; // Prevent multiple transitions at the same time

    // Clone the first and last slides for seamless looping
    const firstSlide = slides[0].cloneNode(true);
    const lastSlide = slides[slides.length - 1].cloneNode(true);
    sliderContainer.appendChild(firstSlide);
    sliderContainer.insertBefore(lastSlide, slides[0]);

    // Update slides after cloning
    const updatedSlides = document.querySelectorAll('.slide');

    // Function to update the active slide
    function updateSlides() {
        if (isTransitioning) return; // Prevent overlapping transitions
        isTransitioning = true;

        updatedSlides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentIndex) {
                slide.classList.add('active');
            }
        });

        // Adjust the transform to center the active slide
        const offset = currentIndex * 20; // Each slide takes up 20% of the width
        sliderContainer.style.transition = 'transform 0.5s ease-in-out';
        sliderContainer.style.transform = `translateX(-${offset}%)`;

        // Handle infinite loop effect
        sliderContainer.addEventListener('transitionend', () => {
            if (currentIndex === 0) {
                currentIndex = updatedSlides.length - 2; // Jump to the last real slide
                sliderContainer.style.transition = 'none';
                sliderContainer.style.transform = `translateX(-${currentIndex * 20}%)`;
            } else if (currentIndex === updatedSlides.length - 1) {
                currentIndex = 1; // Jump to the first real slide
                sliderContainer.style.transition = 'none';
                sliderContainer.style.transform = `translateX(-${currentIndex * 20}%)`;
            }
            isTransitioning = false;
        });
    }

    // Auto-slide functionality
    function autoSlide() {
        currentIndex = (currentIndex + 1) % updatedSlides.length; // Move to the next slide
        updateSlides();
    }

    // Click event for slides
    updatedSlides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            if (isTransitioning) return; // Prevent clicks during transitions
            currentIndex = index; // Set the clicked slide as active
            updateSlides();
        });
    });

    // Start auto-slide
    setInterval(autoSlide, 3000); // Slide every 3 seconds

    // Initialize the first active slide
    updateSlides();
});



// Countdown Timer Script
const weddingDate = new Date("February 10, 2026 13:00:00").getTime();

const countdown = setInterval(function() {
  const now = new Date().getTime();
  const distance = weddingDate - now;
  
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  document.getElementById("days").innerHTML = days.toString().padStart(2, "0");
  document.getElementById("hours").innerHTML = hours.toString().padStart(2, "0");
  document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, "0");
  document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, "0");
  
  if (distance < 0) {
    clearInterval(countdown);
    document.querySelector(".countdown-timer").innerHTML = "<div class='countdown-ended'>We're married!</div>";
  }
}, 1000);



// Video Banner Countdown Timer
function updateVideoCountdown() {
    const weddingDate = new Date('February 10, 2026 17:30:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update video countdown
    updateVideoCircleValue('video-days', days, 365);
    updateVideoCircleValue('video-hours', hours, 24);
    updateVideoCircleValue('video-minutes', minutes, 60);
    updateVideoCircleValue('video-seconds', seconds, 60);
}

function updateVideoCircleValue(elementId, value, max) {
    const element = document.getElementById(elementId);
    const previousValue = parseInt(element.textContent);
    
    // Add animation class if value changed
    if (previousValue !== value) {
        element.classList.add('changing');
        setTimeout(() => {
            element.classList.remove('changing');
        }, 300);
    }
    
    // Update the number
    element.textContent = value.toString().padStart(2, '0');
    
    // Update progress circle
    const progressElement = element.closest('.circle-progress-video');
    const circle = progressElement.querySelector('.progress-ring-circle-video');
    const radius = 40; // Match the r attribute in SVG
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / max) * circumference;
    
    circle.style.strokeDashoffset = offset;
}

// Initialize progress circles
function initializeVideoProgressCircles() {
    const circles = document.querySelectorAll('.progress-ring-circle-video');
    circles.forEach(circle => {
        const radius = parseInt(circle.getAttribute('r'));
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
    });
}

// Scroll indicator functionality
document.querySelector('.scroll-arrow').addEventListener('click', function() {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
});

// Update countdown every second
setInterval(updateVideoCountdown, 1000);

// Initialize when page loads
window.addEventListener('load', () => {
    initializeVideoProgressCircles();
    updateVideoCountdown();
    
    // Add loaded class for animations
    setTimeout(() => {
        document.querySelector('.wedding-text').classList.add('loaded');
    }, 500);
});




// Gallery Filtering Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.nav-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400);
                }
            });
        });
    });
    
    // View More Button Functionality
    const viewMoreBtn = document.querySelector('.view-more-btn');
    viewMoreBtn.addEventListener('click', function() {
        // Simulate loading more images
        this.innerHTML = '<span>Loading Memories...</span><i class="fas fa-spinner fa-spin"></i>';
        
        setTimeout(() => {
            this.innerHTML = '<span>No More Memories</span><i class="fas fa-heart"></i>';
            this.style.opacity = '0.6';
            this.style.cursor = 'not-allowed';
        }, 2000);
    });
    
    // Image loading animation
    const images = document.querySelectorAll('.image-wrapper img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.parentElement.parentElement.classList.remove('loading');
        });
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('attendanceForm');
    const submitBtn = form.querySelector('.submit-btn');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const confirmationDetails = document.getElementById('confirmationDetails');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('guestName');
        const email = formData.get('guestEmail');
        const guests = formData.get('guestCount');
        const message = formData.get('guestMessage');
        
        // Show loading state
        submitBtn.classList.add('loading');
        
        // Simulate form submission
        setTimeout(() => {
            // Show confirmation message
            confirmationDetails.textContent = `We've recorded ${guests} guest(s) from ${name}.`;
            confirmationMessage.classList.add('show');
            
            // Reset form
            form.reset();
            
            // Reset button
            setTimeout(() => {
                submitBtn.classList.remove('loading');
            }, 500);
            
            // Hide confirmation after 5 seconds
            setTimeout(() => {
                confirmationMessage.classList.remove('show');
            }, 5000);
            
            // Here you would typically send the data to your server
            console.log('RSVP Submission:', {
                name: name,
                email: email,
                guests: guests,
                message: message
            });
            
        }, 1500);
    });

    // Add focus effects to form elements
    const formElements = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    formElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        element.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
});



document.addEventListener('DOMContentLoaded', function() {
    // Copy buttons functionality
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const text = this.getAttribute('data-text');
            navigator.clipboard.writeText(text).then(() => {
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.style.background = '#4CAF50';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = '';
                }, 2000);
            });
        });
    });

    // Copy all bank details
    const copyAllBtn = document.querySelector('.copy-all-btn');
    if (copyAllBtn) {
        copyAllBtn.addEventListener('click', function() {
            const bankDetails = `
Account Holder: Manali & Udayraj
Amazon Wishlist: https://www.amazon.in/hz/wishlist/ls/9L9KF252DUJP
            `.trim();
            
            navigator.clipboard.writeText(bankDetails).then(() => {
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                this.style.background = '#4CAF50';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = '';
                }, 2000);
            });
        });
    }

    // Share functionality
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn && navigator.share) {
        shareBtn.addEventListener('click', function() {
            navigator.share({
                title: 'Wedding Gift Details - Manali & Udayraj',
                text: 'Gift details for Manali & Udayraj\'s wedding',
                url: window.location.href
            });
        });
    }

    // Email details
    const emailBtn = document.querySelector('.email-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', function() {
            const subject = 'Wedding Gift Details - Manali & Udayraj';
            const body = `
Hello!

Here are our wedding gift details:

Amazon Wishlist:
https://www.amazon.in/hz/wishlist/ls/9L9KF252DUJP

Thank you for your generosity!

With love,
Manali & Udayraj
            `.trim();
            
            window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('background-audio');
    const playButton = document.getElementById('play-audio-btn');

    playButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playButton.innerHTML = '<i class="fas fa-pause"></i> Pause Music';
        } else {
            audio.pause();
            playButton.innerHTML = '<i class="fas fa-play"></i> Play Music';
        }
    });
});






document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('backgroundAudio');
    const toggle = document.getElementById('audioToggle');
    const slider = document.getElementById('volumeSlider');
  
    let started = false;
  
    audio.volume = 0.5;
  
    function startAudio() {
      if (started) return;
  
      audio.muted = false;
      audio.play()
        .then(() => {
          started = true;
          toggle.classList.remove('muted');
          cleanup();
        })
        .catch(() => {});
    }
  
    // 🎯 Start on first interaction
    ['click', 'scroll', 'touchstart', 'keydown'].forEach(evt => {
      window.addEventListener(evt, startAudio, { once: true, passive: true });
    });
  
    // ⏱️ Try after 30 seconds
    setTimeout(startAudio, 30000);
  
    // 🎚️ Toggle button
    toggle.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        audio.muted = false;
        toggle.classList.remove('muted');
      } else {
        audio.pause();
        toggle.classList.add('muted');
      }
    });
  
    // 🔊 Volume control
    slider.addEventListener('input', e => {
      audio.volume = e.target.value / 100;
      audio.muted = audio.volume === 0;
      toggle.classList.toggle('muted', audio.muted);
    });
  
    function cleanup() {
      ['click', 'scroll', 'touchstart', 'keydown'].forEach(evt => {
        window.removeEventListener(evt, startAudio);
      });
    }
  
    // ▶️ Try muted autoplay immediately (allowed)
    audio.play().catch(() => {});
  });
  