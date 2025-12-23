// ========== DOM ELEMENTS ==========
const menuBtn = document.querySelector('.menu-button');
const modal = document.getElementById('episodeModal');
const closeBtn = document.getElementById('closeModal');
const overlay = document.querySelector('.modal-overlay');
const watchBtn = document.querySelector('.watch-button');
const episodeCards = document.querySelectorAll('.episode-card');

// ========== MODAL FUNCTIONS ==========

// Open Modal
function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close Modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Enable scrolling again
}

// ========== EVENT LISTENERS ==========

// Menu Button - Open Episode List
menuBtn.addEventListener('click', openModal);

// Close Button
closeBtn.addEventListener('click', closeModal);

// Click on Overlay to Close
overlay.addEventListener('click', closeModal);

// Watch Button - Play First Episode
watchBtn.addEventListener('click', function() {
    // Redirect ke episode 1
    // window.location.href = 'episode1.html';
    
    // Sementara pakai alert
    alert('Memulai Episode 1...');
    console.log('Redirecting to episode1.html');
});

// Episode Cards Click Event
episodeCards.forEach(card => {
    card.addEventListener('click', function() {
        const episode = this.getAttribute('data-episode');
        
        // Redirect ke halaman episode
        // window.location.href = `episode${episode}.html`;
        
        // Sementara pakai alert
        alert(`Memulai Episode ${episode}...`);
        console.log(`Redirecting to episode${episode}.html`);
    });
});

// Close Modal with ESC Key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// ========== HOVER EFFECTS ==========

// Add hover effect for episode cards
episodeCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// ========== SCROLL ANIMATION (OPTIONAL) ==========

// Smooth scroll for modal content
const modalContent = document.querySelector('.modal-content');
if (modalContent) {
    modalContent.style.scrollBehavior = 'smooth';
}

// ========== CONSOLE LOG (FOR DEBUGGING) ==========
console.log('🎬 Script loaded successfully!');
console.log('Total episodes:', episodeCards.length);

// ========== ADDITIONAL FEATURES ==========

// Prevent modal close when clicking inside modal content
const modalContentElement = document.querySelector('.modal-content');
modalContentElement.addEventListener('click', function(e) {
    e.stopPropagation();
});

// Add loading animation (optional)
function showLoading() {
    console.log('Loading...');
    // Anda bisa tambahkan spinner atau loading animation di sini
}

// Track which episode was clicked (for analytics)
function trackEpisodeClick(episodeNumber) {
    console.log(`Episode ${episodeNumber} clicked at ${new Date().toLocaleTimeString()}`);
    // Anda bisa tambahkan Google Analytics atau tracking lainnya di sini
}

// Update episode cards click to include tracking
episodeCards.forEach(card => {
    card.addEventListener('click', function() {
        const episode = this.getAttribute('data-episode');
        trackEpisodeClick(episode);
    });
});

// ========== RESPONSIVE MENU ANIMATION ==========

// Animate menu button on click
menuBtn.addEventListener('click', function() {
    const spans = this.querySelectorAll('span');
    spans.forEach((span, index) => {
        setTimeout(() => {
            span.style.transform = 'scaleX(0.8)';
            setTimeout(() => {
                span.style.transform = 'scaleX(1)';
            }, 100);
        }, index * 50);
    });
});

// ========== UTILITY FUNCTIONS ==========

// Check if mobile device
function isMobile() {
    return window.innerWidth <= 768;
}

// Adjust layout for mobile
function adjustForMobile() {
    if (isMobile()) {
        console.log('Mobile device detected');
        // Add mobile-specific adjustments here
    }
}

// Run on page load
window.addEventListener('load', function() {
    adjustForMobile();
    console.log('Page fully loaded!');
});

// Run on window resize
window.addEventListener('resize', function() {
    adjustForMobile();
});

// ========== FUTURE ENHANCEMENTS ==========

// TODO: Add video player integration
// TODO: Add progress tracking for episodes
// TODO: Add favorites/watchlist feature
// TODO: Add episode download functionality
// TODO: Add sharing functionality