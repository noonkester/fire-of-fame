document.addEventListener('DOMContentLoaded', () => {
    const background = document.getElementById('background');
    const backgroundMusic = document.getElementById('background-music');
    const campfireSound = document.getElementById('campfire-sound');
    const musicToggle = document.getElementById('music-toggle');
    const campfireToggle = document.getElementById('campfire-toggle');
    const heroesContainer = document.querySelector('.heroes');

    const dayGif = 'src/day.gif';
    const nightGif = 'src/night.gif';

    const musicTracks = [
        'audio/skyrim1.mp3',
        'audio/skyrim2.mp3',
        'audio/skyrim3.mp3',
        'audio/skyrim4.mp3'
    ];

    let currentTrackIndex = 0;
    let musicEnabled = false;
    let campfireEnabled = false;

    function setBackgroundImage() {
        const hour = new Date().getHours();
        background.src = (hour >= 6 && hour < 18) ? dayGif : nightGif;
    }

    function playNextTrack() {
        backgroundMusic.src = musicTracks[currentTrackIndex];
        backgroundMusic.load();
        if (musicEnabled) {
            backgroundMusic.play().catch(error => {
                console.warn('Autoplay blocked. User interaction required.');
            });
        }
        currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
    }

    function toggleMusic() {
        musicEnabled = !musicEnabled;
        if (musicEnabled) {
            backgroundMusic.play().catch(error => {
                console.warn('Autoplay blocked. User interaction required.');
            });
            musicToggle.textContent = 'Музыка: ВКЛ';
        } else {
            backgroundMusic.pause();
            musicToggle.textContent = 'Музыка: ВЫКЛ';
        }
    }

    function toggleCampfire() {
        campfireEnabled = !campfireEnabled;
        if (campfireEnabled) {
            campfireSound.volume = 0.15;
            campfireSound.play().catch(error => {
                console.warn('Autoplay blocked. User interaction required.');
            });
            campfireToggle.textContent = 'Костёр: ВКЛ';
        } else {
            campfireSound.pause();
            campfireToggle.textContent = 'Костёр: ВЫКЛ';
        }
    }

    async function loadHeroes() {
        try {
            const response = await fetch('heroes.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const heroes = await response.json();
            return heroes;
        } catch (error) {
            console.error('Error loading heroes:', error);
            return [
                { name: "Герой 1", url: "#" },
                { name: "Герой 2", url: "#" },
                { name: "Герой 3", url: "#" },
                { name: "Герой 4", url: "#" }
            ];
        }
    }

    function renderHero(hero) {
        const link = document.createElement('a');
        link.href = hero.url;
        link.textContent = hero.name;

        link.style.display = 'block';
        link.style.fontSize = '0.9rem';
        link.style.margin = '15px 0';
        link.style.padding = '5px 0';
        link.style.textDecoration = 'none';
        link.style.color = '#e8e8e8';
        link.style.transition = 'all 0.3s ease';
        link.style.textShadow = '0 0 3px rgba(0, 0, 0, 0.7)';
        link.style.position = 'relative';

        const underline = document.createElement('span');
        underline.style.position = 'absolute';
        underline.style.bottom = '-2px';
        underline.style.left = '0';
        underline.style.width = '100%';
        underline.style.height = '1px';
        underline.style.background = 'linear-gradient(90deg, transparent, #b5a16b, transparent)';
        underline.style.transition = 'transform 0.3s ease';
        underline.style.transform = 'scaleX(0)';
        underline.style.transformOrigin = 'left center';

        link.addEventListener('mouseenter', () => {
            link.style.transform = 'scale(1.05)';
            underline.style.transform = 'scaleX(1)';
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = 'scale(1)';
            underline.style.transform = 'scaleX(0)';
        });

        link.appendChild(underline);
        return link;
    }

    async function initHeroes() {
        const heroes = await loadHeroes();
        heroesContainer.innerHTML = '';
        heroes.forEach(hero => {
            heroesContainer.appendChild(renderHero(hero));
        });
    }

    setBackgroundImage();
    setInterval(setBackgroundImage, 60000);

    backgroundMusic.src = musicTracks[0];
    backgroundMusic.addEventListener('ended', playNextTrack);

    backgroundMusic.pause();
    campfireSound.pause();

    musicToggle.addEventListener('click', toggleMusic);
    campfireToggle.addEventListener('click', toggleCampfire);

    initHeroes();
});