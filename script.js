document.addEventListener('DOMContentLoaded', () => {
    const background = document.getElementById('background');
    const backgroundMusic = document.getElementById('background-music');
    const campfireSound = document.getElementById('campfire-sound');
    const musicToggle = document.getElementById('music-toggle');
    const campfireToggle = document.getElementById('campfire-toggle');

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

    setBackgroundImage();
    setInterval(setBackgroundImage, 60000);

    backgroundMusic.src = musicTracks[0];
    backgroundMusic.addEventListener('ended', playNextTrack);

    backgroundMusic.pause();
    campfireSound.pause();

    musicToggle.addEventListener('click', toggleMusic);
    campfireToggle.addEventListener('click', toggleCampfire);
});