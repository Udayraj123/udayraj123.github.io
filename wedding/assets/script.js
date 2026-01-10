// Countdown Timer Script
const weddingDate = new Date("February 10, 2026 13:00:00").getTime();

const countdown = setInterval(function() {
  const now = new Date().getTime();
  const distance = weddingDate - now;
  
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  document.getElementById("video-days").innerHTML = days.toString().padStart(2, "0");
  document.getElementById("video-hours").innerHTML = hours.toString().padStart(2, "0");
  document.getElementById("video-minutes").innerHTML = minutes.toString().padStart(2, "0");
  document.getElementById("video-seconds").innerHTML = seconds.toString().padStart(2, "0");
  
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
document.querySelector('.scroll-arrow')?.addEventListener('click', function() {
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




document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('backgroundAudio');
    const toggle = document.getElementById('audioToggle');
    const slider = document.getElementById('volumeSlider');
    const audioPrompt = document.getElementById('audioPrompt');
  
    let started = false;
  
    audio.volume = 0.5;
  
    function startAudio() {
      if (started) return;
  
      // Hide the audio prompt
      if (audioPrompt) {
        audioPrompt.classList.add('hidden');
        setTimeout(() => {
          audioPrompt.style.display = 'none';
        }, 500);
      }

      // If audio is already playing (muted autoplay), just unmute it
      if (!audio.paused) {
        audio.muted = false;
        started = true;
        toggle.classList.remove('muted');
        cleanup();
      } else {
        // Otherwise, unmute and start playing
        audio.muted = false;
        audio.play()
          .then(() => {
            started = true;
            toggle.classList.remove('muted');
            cleanup();
          })
          .catch(() => {});
      }
    }
  
    // 🎯 Start on first interaction
    ['click', 'scroll', 'touchstart', 'keydown'].forEach(evt => {
      window.addEventListener(evt, startAudio, { once: true, passive: true });
    });
  
    // ⏱️ Try after 5 seconds (will only work if muted autoplay succeeded)
    setTimeout(startAudio, 10000);
  
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


// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Cat Meow Preview - Play single upcoming meow (triggered by neko clicks)
document.addEventListener('DOMContentLoaded', () => {
  const catMeowAudio = document.getElementById('catMeowAudio');
  const backgroundAudio = document.getElementById('backgroundAudio');
  const volumeSlider = document.getElementById('volumeSlider');
  
  let isPlaying = false;

  // Set meow volume to match main audio
  catMeowAudio.volume = 1.5 * backgroundAudio.volume;

  // Sync meow volume with slider
  volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    catMeowAudio.volume = 1.5 * volume;
  });

  function resetAfterMeow() {
    // console.log('Debounce timeout, stopping meow...');
    catMeowAudio.pause();
    isPlaying = false;
  }

  // Debounced reset function - stops audio after user stops clicking
  const debouncedReset = debounce(resetAfterMeow, 1500 + Math.round(Math.random() * 2000));

  // Expose play function globally for oneko.js to call
  window.playRomeoMeow = function() {
    // console.log('playRomeoMeow called, isPlaying:', isPlaying);
    
    // If not already playing, start the audio
    if (!isPlaying) {
      isPlaying = true;
    //   console.log('Starting meow playback...');

      // Sync to current position in the song
      const currentTime = backgroundAudio.currentTime;
    //   console.log('Current song time:', currentTime);
      catMeowAudio.currentTime = currentTime;
      
      // Play meow OVER the original (no dimming - both play together!)
      catMeowAudio.play().then(() => {
        // console.log('Meow playing successfully');
      }).catch((error) => {
        // console.log('Meow playback prevented:', error);
        isPlaying = false;
      });
    }
    
    // Each click resets the debounce timer
    // Audio will stop after 1.5s of no clicks
    debouncedReset();
  };

  // If meow audio ends naturally, reset
  catMeowAudio.addEventListener('pause', () => {
    if (isPlaying) {
      setTimeout(() => {
        isPlaying = false;
      }, 100);
    }
  });

  // If background audio pauses, stop any meow playback
  backgroundAudio.addEventListener('pause', () => {
    if (isPlaying) {
      catMeowAudio.pause();
      isPlaying = false;
    }
  });
});
  