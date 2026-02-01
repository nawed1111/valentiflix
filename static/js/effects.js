document.addEventListener('DOMContentLoaded', () => {
    const type = document.getElementById('effectType').value;
    const container = document.getElementById('effectsLayer');

    if (Effects[type]) {
        Effects[type](container);
    }
});

const Effects = {
    floating_roses: (container) => {
        startParticleSystem(container, '🌹', 1000);
    },
    cinematic_glow: (container) => {
        container.classList.add('effect-overlay-pulse');
        startParticleSystem(container, '✨', 2000);
    },
    sparkles: (container) => {
        startParticleSystem(container, '✨', 300);
    },
    soft_glow: (container) => {
        container.style.boxShadow = 'inset 0 0 150px rgba(255, 200, 200, 0.3)';
        startParticleSystem(container, '❤️', 3000);
    },
    particles: (container) => {
         startParticleSystem(container, '❄️', 1000);
    },
    warm_glow: (container) => {
        container.classList.add('effect-overlay-warm');
        startParticleSystem(container, '🍂', 2000);
    },
    heart_burst: (container) => {
        startParticleSystem(container, '❤️', 500);
        startParticleSystem(container, '💖', 500);
    },
    pulse_beat: (container) => {
        container.style.animation = 'pulse-glow 1s infinite';
        startParticleSystem(container, '💓', 1000);
    }
};

function startParticleSystem(container, char, interval) {
    // Continuous emission
    setInterval(() => {
        createParticle(container, char);
    }, interval);

    // Initial burst
    for(let i=0; i<15; i++) {
        createParticle(container, char, true);
    }
}

function createParticle(container, char, randomY = false) {
    const el = document.createElement('div');
    el.innerText = char;
    el.className = 'floating-particle';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (Math.random() * 20 + 10) + 'px';
    el.style.animationDuration = (Math.random() * 10 + 5) + 's';
    el.style.opacity = Math.random() * 0.7 + 0.3;

    if (randomY) {
        el.style.bottom = Math.random() * 100 + 'vh';
        el.style.animationDelay = '-' + (Math.random() * 5) + 's';
    }

    container.appendChild(el);

    setTimeout(() => el.remove(), 15000);
}
