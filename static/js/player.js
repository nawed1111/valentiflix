// Video Player Logic
document.addEventListener('DOMContentLoaded', () => {
    // Play ambient sound on load
    const soundSrc = document.getElementById('soundSrc');
    if (soundSrc && soundSrc.value && window.soundManager) {
        const id = soundSrc.value.split('/').pop();
        window.soundManager.play(id, soundSrc.value);
    }
});

function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

window.openVideo = function() {
    const overlay = document.getElementById('videoOverlay');
    const video = document.getElementById('episodeVideo');
    const frame = document.getElementById('episodeFrame');
    const src = document.getElementById('videoSrc').value;

    // Stop ambient sound
    const soundSrc = document.getElementById('soundSrc');
    if (soundSrc && soundSrc.value && window.soundManager) {
        const id = soundSrc.value.split('/').pop();
        window.soundManager.stop(id);
    }

    if (overlay) {
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');

        const ytId = getYouTubeId(src);

        if (ytId && frame) {
            // YouTube Mode
            video.classList.add('hidden');
            video.pause();

            frame.classList.remove('hidden');
            frame.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
        } else if (video) {
            // Native Video Mode
            frame.classList.add('hidden');
            frame.src = ""; // Stop iframe playback

            video.classList.remove('hidden');
            // Only set src if not already set or different
            if (!video.getAttribute('src') || video.src !== src && video.src !== window.location.origin + src) {
                video.src = src;
            }
            video.play().catch(e => console.error(e));
        }
    }
}

window.closeVideo = function() {
    const overlay = document.getElementById('videoOverlay');
    const video = document.getElementById('episodeVideo');
    const frame = document.getElementById('episodeFrame');

    if (overlay) {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');

        if (video) video.pause();
        if (frame) frame.src = "";
    }
}

// Trivia Logic
let currentScore = 0;
let currentQuestionIndex = 0;

window.openTrivia = function() {
    const overlay = document.getElementById('triviaOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
        startTrivia();
    }
}

window.closeTrivia = function() {
    const overlay = document.getElementById('triviaOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
    }
}

function startTrivia() {
    currentScore = 0;
    currentQuestionIndex = 0;
    const questions = window.triviaData;
    const container = document.getElementById('quizContainer');
    const result = document.getElementById('quizResult');

    if (!questions || questions.length === 0) {
        container.innerHTML = "<p class='text-center text-xl mt-8'>No trivia for today!</p>";
        result.classList.add('hidden');
        container.classList.remove('hidden');
        return;
    }

    container.classList.remove('hidden');
    result.classList.add('hidden');
    showQuestion();
}

function showQuestion() {
    const questions = window.triviaData;
    const container = document.getElementById('quizContainer');

    if (currentQuestionIndex >= questions.length) {
        showResult();
        return;
    }

    const q = questions[currentQuestionIndex];

    let html = `
        <div class="animate-fade-in">
            <h3 class="text-xl font-bold mb-6 text-gray-200">${currentQuestionIndex + 1}. ${q.q}</h3>
            <div class="space-y-3">
    `;

    q.options.forEach((opt, idx) => {
        html += `
            <button onclick="checkAnswer(${idx})" class="w-full text-left p-4 rounded bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-all font-medium">
                ${opt}
            </button>
        `;
    });

    html += `</div></div>`;

    container.innerHTML = html;
}

window.checkAnswer = function(selectedIndex) {
    const questions = window.triviaData;
    const q = questions[currentQuestionIndex];
    const container = document.getElementById('quizContainer');
    const buttons = container.querySelectorAll('button');

    // Disable all buttons
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.classList.remove('hover:bg-gray-700');
    });

    if (selectedIndex === q.correct) {
        currentScore++;
        buttons[selectedIndex].classList.remove('bg-gray-800', 'border-gray-600');
        buttons[selectedIndex].classList.add('bg-green-600', 'border-green-500', 'text-white');
    } else {
        buttons[selectedIndex].classList.remove('bg-gray-800', 'border-gray-600');
        buttons[selectedIndex].classList.add('bg-red-600', 'border-red-500', 'text-white');

        buttons[q.correct].classList.remove('bg-gray-800', 'border-gray-600');
        buttons[q.correct].classList.add('bg-green-600', 'border-green-500', 'text-white');
    }

    currentQuestionIndex++;
    setTimeout(showQuestion, 1500);
}

function showResult() {
    const container = document.getElementById('quizContainer');
    const result = document.getElementById('quizResult');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const bonusMessage = document.getElementById('bonusMessage');

    container.classList.add('hidden');
    result.classList.remove('hidden');
    result.classList.add('flex', 'flex-col', 'items-center');

    const total = window.triviaData.length;
    scoreDisplay.innerText = `Score: ${currentScore} / ${total}`;

    if (currentScore === total) {
        bonusMessage.innerText = "Perfect! You're a true romantic! ❤️";
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    } else if (currentScore > total / 2) {
        bonusMessage.innerText = "Not bad! Love is a journey.";
    } else {
        bonusMessage.innerText = "Keep loving and learning! 💖";
    }
}
