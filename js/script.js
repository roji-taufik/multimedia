// ========== DOM ELEMENTS ==========
const menuBtn = document.querySelector('.menu-button');
const modal = document.getElementById('episodeModal');
const closeBtn = document.getElementById('closeModal');
const overlay = document.querySelector('.modal-overlay');
const watchBtn = document.querySelector('.watch-button');
const episodeCards = document.querySelectorAll('.episode-card');
const slidesContainer = document.querySelector('.slides-container');
const slides = document.querySelectorAll('.slide');
const scrollIndicator = document.querySelector('.scroll-indicator');

// ========== SLIDE VARIABLES ==========
let currentSlide = 0;
let isScrolling = false;
const slideDelay = 800; // milliseconds

// ================= STORY MAP =================
const story = {
    intro: {
        video: "1149338456",
        title: "Apakah Roji ikut?",
        choices: [
            { text: "Ikut", next: "taman" },
            { text: "Tidak", next: "kosan" }
        ]
    },

    taman: {
        video: "1149323639",
        title: "Bawa jamur atau tidak?",
        choices: [
            { text: "Bawa", next: "taman2" },
            { text: "Tidak", next: "akhir3" }
        ]
    },

    taman2: {
        video: "1149323669",
        title: "Diam atau menyusul?",
        choices: [
            { text: "Diam", next: "akhir4" },
            { text: "Menyusul", next: "warung" }
        ]
    },

    warung: {
        video: "1149323899",
        title: "Masuk kamar atau pergi?",
        choices: [
            { text: "Masuk", next: "ketemu1" },
            { text: "Pergi", next: "ketemu2" }
        ]
    },
    ketemu1: {
        video: "1149324444",
        title: "Menyusul kosan atau pulang?",
        choices: [
            { text: "Kosan", next: "akhir6" },
            { text: "Pulang", next: "akhir5" }
        ]
    },
    ketemu2: {
        video: "1149324031",
        title: "Menyusul kosan atau pulang?",
        choices: [
            { text: "Kosan", next: "akhir6" },
            { text: "Pulang", next: "akhir5" }
        ]
    },

    kosan: {
        video: "1149323608",
        title: "Ambil Jamur?",
        choices: [
            { text: "Ambil", next: "kosan2" },
            { text: "Tidak", next: "akhir1" }
        ]
    },

    kosan2: {
        video: "1149323482",
        title: "Makan atau tidur?",
        choices: [
            { text: "Makan", next: "makan" },
            { text: "Tidur", next: "akhir2" }
        ]
    },
    
    makan: {
        video: "1149323511",
        title: "Menyusul kosan atau pulang?",
        choices: [
            { text: "Kosan", next: "akhir6" },
            { text: "Pulang", next: "akhir5" }
        ]
    },

    akhir1: { 
        video: "1149323548",
        title: "Jangan mengambil barang asing!"
    },
    akhir2: { 
        video: "1149323575",
        title: "Air Jahat!"
    },
    akhir3: { 
        video: "1149323812",
        title: "Hilangkan Rasa Penasaran!"
    },
    akhir4: { 
        video: "1149323854",
        title: "Pikiran Membunuhmu!"
    },
    akhir5: { 
        video: "1149324591",
        title: "Jamur Beracun!"
    },
    akhir6: { 
        video: "1149324647",
        title: "Semua hal hanyalah fiksi!"
    }
};

const videoModal = document.getElementById('videoModal');
let iframe = document.getElementById('vimeoPlayer');
const choicePanel = document.getElementById('choicePanel');
const closeVideo = document.getElementById('closeVideo');

let player;
let currentScene = "intro";
let isPlaying = false;

// ========== SLIDE TRANSITION FUNCTIONS ==========

function goToSlide(slideIndex) {
    if (isScrolling || slideIndex < 0 || slideIndex >= slides.length) return;
    
    isScrolling = true;
    
    // Remove active dari semua slide
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Add active ke slide baru
    slides[slideIndex].classList.add('active');
    currentSlide = slideIndex;
    
    // Hide scroll indicator pada slide terakhir
    if (scrollIndicator) {
        scrollIndicator.style.display = slideIndex === slides.length - 1 ? 'none' : 'flex';
    }
    
    setTimeout(() => {
        isScrolling = false;
    }, slideDelay);
}

// Initialize first slide
window.addEventListener('load', () => {
    slides[0].classList.add('active');
});

// PLAY VIDEO - FULLSCREEN
function playScene(sceneKey) {
    const scene = story[sceneKey];
    
    if (!scene) {
        console.error('Scene not found:', sceneKey);
        return;
    }

    currentScene = sceneKey;
    isPlaying = true;

    console.log('Playing scene:', sceneKey, 'Video ID:', scene.video);

    // Destroy player lama
    if (player) {
        try {
            console.log('Destroying old player');
            player.off('ended');
            player.off('error');
            player.off('ready');
            player.off('play');
            player.off('pause');
            player.off('loadstart');
            player.pause();
            player.destroy();
        } catch (error) {
            console.error('Error destroying old player:', error);
        }
        player = null;
    }

    // Tampilkan modal dengan transisi fade-in
    videoModal.classList.add('active');
    choicePanel.style.display = 'none';
    document.body.style.overflow = 'hidden';

    // PENTING: Buang iframe lama dan buat yang baru
    console.log('Creating new iframe');
    
    // Hapus iframe lama jika ada
    if (iframe && iframe.parentElement) {
        try {
            iframe.parentElement.removeChild(iframe);
            console.log('Old iframe removed');
        } catch (error) {
            console.error('Error removing old iframe:', error);
        }
    }
    
    // Buat iframe baru
    const newIframe = document.createElement('iframe');
    newIframe.id = 'vimeoPlayer';
    newIframe.frameborder = '0';
    newIframe.allow = 'autoplay; fullscreen; picture-in-picture';
    newIframe.allowFullscreen = '';
    newIframe.style.width = '100%';
    newIframe.style.height = '100%';
    
    // Tambahkan ke wrapper
    const videoWrapper = document.querySelector('.video-wrapper');
    if (!videoWrapper) {
        console.error('video-wrapper not found in DOM');
        return;
    }
    videoWrapper.insertBefore(newIframe, videoWrapper.firstChild);
    
    // Update reference iframe GLOBAL
    iframe = newIframe;
    
    console.log('Setting new video source:', scene.video);
    // Set src pada iframe baru
    newIframe.src = `https://player.vimeo.com/video/${scene.video}?title=0&byline=0&portrait=0`;
    
    // Tunggu iframe load event
    console.log('Waiting for iframe load event...');
    
    const onIframeLoad = () => {
        console.log('✓ Iframe load event fired!');
        newIframe.removeEventListener('load', onIframeLoad);
        
        if (!isPlaying) {
            console.log('Playback was cancelled after load');
            return;
        }

        try {
            console.log('Creating new Vimeo player');
            
            // Buat player baru SETELAH iframe load
            player = new Vimeo.Player(newIframe);
            
            console.log('Player created, calling ready()...');
            
            // Setup ready listener - tunggu player siap sebelum play
            player.ready().then(() => {
                console.log('✓✓✓ Player ready PROMISE RESOLVED! ✓✓✓');
                if (isPlaying && player) {
                    console.log('Attempting to play video');
                    return player.play();
                } else {
                    console.log('isPlaying is false or player is null, not playing');
                    return Promise.reject('Play cancelled');
                }
            }).then(() => {
                console.log('✓ Play command successful');
            }).catch((error) => {
                console.error('Ready/Play error:', error.name, '-', error.message);
            });
            
            // Setup ended listener
            player.on('ended', function onVideoEnded() {
                console.log('Video ended, showing choices for:', sceneKey);
                if (isPlaying) {
                    showChoices(scene.choices, scene.title);
                }
            });

            // Setup error listener
            player.on('error', function onPlayerError(error) {
                console.error('Vimeo Player Error:', error);
            });

            // Setup play listener untuk debugging
            player.on('play', function onPlay() {
                console.log('✓ Video started playing');
            });
            
            // Setup pause listener
            player.on('pause', function onPause() {
                console.log('Video paused');
            });
            
            // Setup loadstart listener
            player.on('loadstart', function onLoadStart() {
                console.log('Video loadstart');
            });

        } catch (error) {
            console.error('Player initialization error:', error.message);
        }
    };
    
    // Add load event listener
    newIframe.addEventListener('load', onIframeLoad, { once: true });
    
    // Fallback timeout jika load event tidak fire
    setTimeout(() => {
        if (isPlaying && !player) {
            console.log('Load event timeout, creating player anyway');
            onIframeLoad();
        }
    }, 1500);
}

// TAMPILKAN PILIHAN DENGAN TRANSISI
function showChoices(choices, sceneTitle) {
    if (!choices || choices.length === 0) {
        // Jika tidak ada pilihan, tutup video setelah 2 detik
        setTimeout(() => {
            closeVideoPlayer();
        }, 2000);
        return;
    }

    // Buat konten pilihan dengan title dari scene
    choicePanel.innerHTML = `
        <div class="choice-header">
            <h3>PILIH JALAN CERITA</h3>
            <p class="scene-title">${sceneTitle || ''}</p>
        </div>
        <div class="choice-buttons-container"></div>
    `;

    const buttonsContainer = choicePanel.querySelector('.choice-buttons-container');

    choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.textContent = choice.text;
        btn.style.animationDelay = `${index * 0.1}s`;
        btn.classList.add('choice-btn');
        
        btn.onclick = () => {
            console.log('Choice selected:', choice.text, '-> Next scene:', choice.next);
            // Tambah efek klik
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                playScene(choice.next);
            }, 200);
        };
        
        buttonsContainer.appendChild(btn);
    });

    // Tampilkan pilihan dengan fade-in
    choicePanel.style.display = 'flex';
    choicePanel.style.animation = 'fadeIn 0.5s ease-in';
}

// TUTUP VIDEO PLAYER
function closeVideoPlayer() {
    console.log('Closing video player, current isPlaying:', isPlaying);
    
    // Nonaktifkan flag terlebih dahulu
    isPlaying = false;

    // Destroy player
    if (player) {
        try {
            console.log('Destroying player on close');
            player.off('ended');
            player.off('error');
            player.off('ready');
            player.off('play');
            player.off('pause');
            player.off('loadstart');
            player.pause();
            player.destroy();
        } catch (error) {
            console.error('Error destroying player on close:', error);
        }
        player = null;
    }

    // Hapus iframe dan recreate dengan empty src
    try {
        if (iframe && iframe.parentElement) {
            iframe.parentElement.removeChild(iframe);
            console.log('Old iframe removed on close');
        }
        
        // Buat iframe baru kosong
        const newIframe = document.createElement('iframe');
        newIframe.id = 'vimeoPlayer';
        newIframe.frameborder = '0';
        newIframe.allow = 'autoplay; fullscreen; picture-in-picture';
        newIframe.allowFullscreen = '';
        newIframe.style.width = '100%';
        newIframe.style.height = '100%';
        
        const videoWrapper = document.querySelector('.video-wrapper');
        if (videoWrapper) {
            videoWrapper.insertBefore(newIframe, videoWrapper.firstChild);
        }
        
        // Update global reference
        iframe = newIframe;
    } catch (error) {
        console.error('Error resetting iframe:', error);
    }
    
    // Hide modal
    videoModal.classList.remove('active');
    choicePanel.style.display = 'none';
    choicePanel.innerHTML = '';
    document.body.style.overflow = 'auto';

    console.log('Video player closed successfully');
}

// CLOSE VIDEO EVENT
closeVideo.addEventListener('click', closeVideoPlayer);


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
watchBtn.addEventListener('click', () => {
    playScene('intro');
});

// Episode Cards Click Event
episodeCards.forEach(card => {
    card.addEventListener('click', function() {
        const episode = this.getAttribute('data-episode');
        closeModal(); // tutup menu episode

        // Map episode number ke scene
        const sceneMap = {
            "1": "intro",
            "2": "taman",
            "3": "taman2",
            "4": "warung",
            "5": "ketemu1",
            "6": "ketemu2",
            "7": "kosan",
            "8": "kosan2",
            "9": "makan"
        };

        const sceneKey = sceneMap[episode];
        if (sceneKey) {
            playScene(sceneKey);
        }
    });
});

// Close Modal with ESC Key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (isPlaying) {
            closeVideoPlayer();
        } else if (modal.classList.contains('active')) {
            closeModal();
        }
    }
});

// ========== MOUSE WHEEL & SCROLL TRANSITION ==========

let wheelTimeout;

document.addEventListener('wheel', (e) => {
    // Jangan scroll jika modal atau video sedang aktif
    if (modal.classList.contains('active') || isPlaying) return;
    
    e.preventDefault();
    
    clearTimeout(wheelTimeout);
    
    if (isScrolling) return;
    
    const direction = e.deltaY > 0 ? 1 : -1; // 1 = down, -1 = up
    const nextSlide = currentSlide + direction;
    
    goToSlide(nextSlide);
    
    wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
    }, slideDelay);
}, { passive: false });

// Scroll Indicator Click Handler
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
    });
}

// ========== HOVER EFFECTS ==========

// Add hover effect for episode cards
episodeCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Prevent modal close when clicking inside modal content
const modalContentElement = document.querySelector('.modal-content');
if (modalContentElement) {
    modalContentElement.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// ========== MOBILE DETECTION & RESPONSIVENESS ==========

// Check if mobile device
function isMobile() {
    return window.innerWidth <= 768;
}

// Adjust layout for mobile
function adjustForMobile() {
    if (isMobile()) {
        console.log('Mobile device detected');
    }
}

// Run on page load
window.addEventListener('load', function() {
    adjustForMobile();
    console.log('🎬 Interactive Video System initialized successfully!');
    console.log('Total episodes:', episodeCards.length);
});

// Run on window resize
window.addEventListener('resize', function() {
    adjustForMobile();
});

// ========== CONSOLE LOGGING ==========
console.log('🎬 Slide-based Interactive Video System initialized!');