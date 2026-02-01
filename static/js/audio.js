class SoundManager {
    constructor() {
        this.muted = localStorage.getItem('valentiflix_muted') === 'true';
        this.sounds = {};
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('valentiflix_muted', this.muted);
        this.updateUI();
        return this.muted;
    }

    play(soundId, path) {
        if (this.muted) return;

        let audio = this.sounds[soundId];
        if (!audio) {
            audio = new Audio(path);
            this.sounds[soundId] = audio;
        }

        audio.currentTime = 0;
        audio.play().catch(e => console.log("Audio play failed (autoplay policy?):", e));
    }

    preload(soundId, path) {
        if (!this.sounds[soundId]) {
            this.sounds[soundId] = new Audio(path);
        }
    }

    stop(soundId) {
        let audio = this.sounds[soundId];
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    updateUI() {
        const btn = document.getElementById('soundToggle');
        if (btn) {
            const icon = btn.querySelector('i');
            if (this.muted) {
                icon.setAttribute('data-lucide', 'volume-x');
                btn.classList.add('text-gray-500');
                btn.classList.remove('text-white');
            } else {
                icon.setAttribute('data-lucide', 'volume-2');
                btn.classList.add('text-white');
                btn.classList.remove('text-gray-500');
            }
            lucide.createIcons();
        }
    }
}

window.soundManager = new SoundManager();

document.addEventListener('DOMContentLoaded', () => {
    window.soundManager.updateUI();
    const toggle = document.getElementById('soundToggle');
    if (toggle) {
        toggle.addEventListener('click', () => window.soundManager.toggleMute());
    }
});
