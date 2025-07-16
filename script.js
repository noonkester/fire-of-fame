document.addEventListener('DOMContentLoaded', () => {
    const background = document.getElementById('background');
    const backgroundMusic = document.getElementById('background-music');
    const campfireSound = document.getElementById('campfire-sound');
    const musicToggle = document.getElementById('music-toggle');
    const campfireToggle = document.getElementById('campfire-toggle');
    const hintElement = document.getElementById('hint');

    const explosionSounds = [
        new Audio('audio/explosion.mp3'),
        new Audio('audio/explosion.mp3'),
        new Audio('audio/explosion.mp3')
    ];
    explosionSounds.forEach(sound => {
        sound.preload = 'auto';
        sound.load();
    });

    let currentBackground = document.getElementById('background');
    let nextBackground = document.getElementById('background-next');
    let isFirstLoad = true;

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
    let skeletonVisible = false;
    let skeletonHintActive = false;
    let clickCount = 0;
    const clicksRequired = 5;
    let explosionTriggered = false;

    const title = document.querySelector('header h1');
    const skeletonMage = document.createElement('div');
    skeletonMage.className = 'skeleton-mage';
    document.body.appendChild(skeletonMage);

    const hints = [
        "Слава ждёт тех, кто не боится трудностей.",
        "Помни: даже великие начинали с первого шага.",
        "Судьба благоволит тем, кто идет своей дорогой.",
        "Истинный герой не ищет славы, она следует за ним.",
        "Нажми кнопки внизу для музыки и костра.",
        "Фон меняется днём и ночью автоматически.",
        "Поэкспериментируй с заголовком...",
        "Кликай на ники — они ведут в профили!",
        "За каждым великим делом стоит тысяча мелких жертв.",
        "Нажми на скелета, если увидишь его!",
    ];

    function getTimeBasedBackground() {
        const hour = new Date().getHours();
        return (hour >= 6 && hour < 18) ? dayGif : nightGif;
    }

    function setBackgroundImage() {
        const newSrc = getTimeBasedBackground();

        if (newSrc === currentBackground.src && !isFirstLoad) return;

        if (isFirstLoad) {
            currentBackground.src = newSrc;
            currentBackground.style.opacity = '1';
            isFirstLoad = false;
        } else {
            nextBackground.src = newSrc;
            nextBackground.style.opacity = '0';

            setTimeout(() => {
                nextBackground.style.opacity = '1';

                setTimeout(() => {
                    currentBackground.style.opacity = '0';

                    const temp = currentBackground;
                    currentBackground = nextBackground;
                    nextBackground = temp;

                    nextBackground.style.opacity = '0';
                }, 2000);
            }, 50);
        }
    }

    function playNextTrack() {
        backgroundMusic.src = musicTracks[currentTrackIndex];
        backgroundMusic.load();
        if (musicEnabled) {
            backgroundMusic.play().catch(error => {});
        }
        currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
    }

    function toggleMusic() {
        musicEnabled = !musicEnabled;
        if (musicEnabled) {
            backgroundMusic.play().catch(error => {});
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
            campfireSound.play().catch(error => {});
            campfireToggle.textContent = 'Костёр: ВКЛ';
        } else {
            campfireSound.pause();
            campfireToggle.textContent = 'Костёр: ВЫКЛ';
        }
    }

    function showRandomHint() {
        if (!hintElement || skeletonHintActive) return;

        if (hintElement.dataset.initialized) {
            hintElement.classList.add('fade-out');
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * hints.length);
                hintElement.textContent = hints[randomIndex];
                hintElement.classList.remove('fade-out');
            }, 500);
        } else {
            const randomIndex = Math.floor(Math.random() * hints.length);
            hintElement.textContent = hints[randomIndex];
            hintElement.dataset.initialized = true;
        }
    }

    function getRandomPosition() {
        const skeletonWidth = 80;
        const skeletonHeight = 100;
        const padding = 20;

        const maxX = window.innerWidth - skeletonWidth - padding;
        const maxY = window.innerHeight - skeletonHeight - padding;

        const randomX = padding + Math.random() * maxX;
        const randomY = padding + Math.random() * maxY;

        return { x: randomX, y: randomY };
    }

    function showSkeletonMage() {
        const position = getRandomPosition();

        skeletonMage.style.left = `${position.x}px`;
        skeletonMage.style.top = `${position.y}px`;
        skeletonMage.style.display = 'block';
        skeletonMage.style.zIndex = '10';
        skeletonHintActive = true;
        hintElement.textContent = "Нажми на скелета, чтобы увидеть магию!";

        skeletonMage.classList.add('jump');

        setTimeout(() => {
            skeletonMage.classList.remove('jump');
            setTimeout(() => {
                if (skeletonMage.style.display === 'block') {
                    hideSkeletonMage();
                }
            }, 10000);
        }, 500);
    }

    function hideSkeletonMage() {
        skeletonMage.style.opacity = '1';
        const fadeOut = setInterval(() => {
            const opacity = parseFloat(skeletonMage.style.opacity);
            if (opacity > 0) {
                skeletonMage.style.opacity = (opacity - 0.05).toString();
            } else {
                clearInterval(fadeOut);
                skeletonMage.style.display = 'none';
                skeletonMage.style.opacity = '1';
                skeletonHintActive = false;
                skeletonVisible = false;
                showRandomHint();
            }
        }, 50);
    }

    function triggerExplosion(x, y) {
        const availableSound = explosionSounds.find(sound => sound.paused || sound.ended);
        if (availableSound) {
            availableSound.currentTime = 0;
            availableSound.volume = 0.2;
            availableSound.play().catch(e => {});
        }

        document.documentElement.classList.add('screen-shake');

        const particlesCount = 30;
        for (let i = 0; i < particlesCount; i++) {
            createExplosionParticle(x, y);
        }

        setTimeout(() => {
            document.documentElement.classList.remove('screen-shake');
        }, 300);
    }

    function createExplosionParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'pixel-explosion';
        document.body.appendChild(particle);

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.display = 'block';

        const angle = Math.random() * Math.PI * 2;
        const explosionDistance = 20 + Math.random() * 60;
        const endX = x + Math.cos(angle) * explosionDistance;
        const endY = y + Math.sin(angle) * explosionDistance;

        const size = 3 + Math.random() * 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        const hue = 280 + Math.random() * 40 - 20;
        particle.style.backgroundColor = `hsl(${hue}, 100%, 60%)`;

        const startTime = performance.now();
        const duration = 500 + Math.random() * 500;

        function animateParticle(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentX = x + (endX - x) * progress;
            const currentY = y + (endY - y) * progress;
            const currentScale = 1 + progress * 2;
            const currentOpacity = 1 - progress;

            particle.style.left = `${currentX}px`;
            particle.style.top = `${currentY}px`;
            particle.style.transform = `scale(${currentScale})`;
            particle.style.opacity = currentOpacity;

            if (progress < 1) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        }

        requestAnimationFrame(animateParticle);
    }

    function castMagicMissile() {
        skeletonMage.classList.add('jump');
        explosionTriggered = false;

        setTimeout(() => {
            const missile = document.createElement('div');
            missile.className = 'pixel-missile';
            document.body.appendChild(missile);

            const skeletonRect = skeletonMage.getBoundingClientRect();
            const startX = skeletonRect.left + skeletonRect.width / 2;
            const startY = skeletonRect.top;

            missile.style.left = `${startX}px`;
            missile.style.top = `${startY}px`;
            missile.style.display = 'block';

            const missileSize = 8;
            const padding = 20;
            const maxX = window.innerWidth - missileSize - padding;
            const maxY = window.innerHeight - missileSize - padding;

            const endX = padding + Math.random() * maxX;
            const endY = padding + Math.random() * maxY;

            const startTime = performance.now();
            const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            const duration = Math.max(500, distance / 0.5);

            function animateMissile(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const currentX = startX + (endX - startX) * progress;
                const currentY = startY + (endY - startY) * progress;

                missile.style.left = `${currentX}px`;
                missile.style.top = `${currentY}px`;

                const timeToCollision = duration * (1 - progress) * 1000;
                if (timeToCollision <= 50 && !explosionTriggered) {
                    triggerExplosion(currentX, currentY);
                    explosionTriggered = true;
                }

                if (progress >= 1) {
                    missile.remove();
                    hideSkeletonMage();
                    return;
                }

                requestAnimationFrame(animateMissile);
            }

            requestAnimationFrame(animateMissile);
        }, 300);
    }

    title.addEventListener('click', () => {
        if (!skeletonVisible) {
            clickCount++;
            if (clickCount >= clicksRequired) {
                showSkeletonMage();
                clickCount = 0;
                skeletonVisible = true;
            }
        }
    });

    skeletonMage.addEventListener('click', () => {
        if (!skeletonMage.classList.contains('jump')) {
            castMagicMissile();
        }
    });

    setBackgroundImage();
    showRandomHint();
    setInterval(setBackgroundImage, 60000);
    setInterval(showRandomHint, 15 * 60 * 1000);

    backgroundMusic.src = musicTracks[0];
    backgroundMusic.addEventListener('ended', playNextTrack);

    backgroundMusic.pause();
    campfireSound.pause();

    musicToggle.addEventListener('click', toggleMusic);
    campfireToggle.addEventListener('click', toggleCampfire);
});