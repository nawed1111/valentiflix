document.addEventListener('DOMContentLoaded', () => {
    const type = document.getElementById('surpriseType').value;
    const container = document.getElementById('surpriseLayer');

    if (Surprises[type]) {
        Surprises[type](container);
    }

    // Preload sound
    const soundSrc = document.getElementById('soundSrc').value;
    if (soundSrc && window.soundManager) {
        const id = soundSrc.split('/').pop();
        window.soundManager.preload(id, soundSrc);
    }
});

const Surprises = {
    rose_bouquet: (container) => {
        container.style.pointerEvents = 'auto';
        container.innerHTML = `
            <div class="cursor-pointer animate-bounce hover:scale-110 transition-transform" onclick="triggerRoseRain()">
                <span class="text-9xl filter drop-shadow-lg">💐</span>
                <div class="text-white text-center mt-4 bg-black/50 px-4 py-1 rounded-full border border-white/20">Click Me</div>
            </div>
        `;
        window.triggerRoseRain = () => {
             confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff0000', '#db0000', '#ff69b4'],
                shapes: ['circle']
             });
             playEffectSound();
        };
    },

    propose_card: (container) => {
        container.style.pointerEvents = 'auto';
        container.innerHTML = `
            <div class="bg-black/60 backdrop-blur-md p-8 rounded-xl border border-white/20 text-center max-w-md shadow-2xl">
                <h2 class="text-3xl font-bold mb-8">Will you be my Valentine?</h2>
                <div class="flex justify-center gap-8 relative h-16">
                    <button onclick="acceptProposal()" class="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-full font-bold shadow-lg transition-transform hover:scale-110">YES</button>
                    <button id="noBtn" onmouseover="dodgeNo()" class="bg-gray-600 text-white px-8 py-2 rounded-full font-bold absolute right-0 transition-all duration-100">NO</button>
                </div>
            </div>
        `;

        window.dodgeNo = () => {
            const btn = document.getElementById('noBtn');
            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 200;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        };

        window.acceptProposal = () => {
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
            playEffectSound();
            container.innerHTML = `<h2 class="text-5xl font-bold text-red-500 animate-pulse drop-shadow-lg">I KNEW IT! ❤️</h2>`;
        };
    },

    chocolate_box: (container) => {
        container.style.pointerEvents = 'auto';
        container.innerHTML = `
             <div class="grid grid-cols-3 gap-4 bg-[#4a2c2a] p-6 rounded-lg shadow-xl border-4 border-[#8b4513] rotate-3 hover:rotate-0 transition-transform">
                ${[1,2,3,4,5,6].map(i => `
                    <button onclick="pickChocolate(this)" class="w-16 h-16 bg-[#5d4037] rounded-full hover:bg-[#795548] border-2 border-[#8d6e63] shadow-inner flex items-center justify-center text-2xl transition-transform hover:scale-110">
                        🍫
                    </button>
                `).join('')}
             </div>
        `;

        window.pickChocolate = (btn) => {
            const msgs = ["Sweet!", "Tasty!", "Yum!", "Love!", "Delicious!", "Mwah!"];
            const msg = msgs[Math.floor(Math.random() * msgs.length)];
            btn.innerHTML = `<span class="text-xs text-white font-bold animate-fade-in">${msg}</span>`;
            btn.classList.add('bg-[#8d6e63]');
            playEffectSound();
        }
    },

    teddy_hug: (container) => {
         container.style.pointerEvents = 'auto';
         container.innerHTML = `
            <div class="text-center group cursor-pointer" onclick="hugTeddy()">
                <div class="text-9xl transition-transform duration-300 group-hover:scale-110 drop-shadow-2xl" id="teddyIcon">🧸</div>
                <div class="w-64 h-4 bg-gray-700 rounded-full mt-8 overflow-hidden border border-white/20 mx-auto">
                    <div id="hugMeter" class="h-full bg-pink-500 w-0 transition-all duration-300"></div>
                </div>
                <p class="text-sm mt-2 text-gray-300">Click fast to Hug!</p>
            </div>
         `;

         let hugs = 0;
         window.hugTeddy = () => {
             hugs += 20;
             if (hugs > 100) hugs = 100;
             document.getElementById('hugMeter').style.width = hugs + '%';
             document.getElementById('teddyIcon').style.transform = `scale(${1 + hugs/200})`;
             playEffectSound();
             if (hugs >= 100) {
                 container.innerHTML = `<h2 class="text-4xl font-bold text-pink-500 animate-bounce drop-shadow-lg">BEAR HUG! 🤗</h2>`;
                 confetti();
             }
         }
    },

    promise_contract: (container) => {
        container.style.pointerEvents = 'auto';
        container.innerHTML = `
            <div class="bg-white text-black p-8 max-w-lg rounded shadow-2xl font-serif relative rotate-1">
                <h2 class="text-2xl font-bold mb-4 text-center border-b-2 border-black pb-2">Love Contract</h2>
                <p class="mb-4 italic">I hereby promise to love, cherish, and debug you forever. No more syntax errors in our relationship.</p>
                <input type="text" id="signerName" placeholder="Sign here..." class="w-full border-b border-black outline-none font-script text-xl py-2 mb-4 bg-transparent focus:border-red-500 transition-colors">
                <button onclick="signContract()" class="bg-red-600 text-white w-full py-2 rounded font-sans font-bold hover:bg-red-700 transition-colors">Seal with Love</button>
            </div>
        `;

        window.signContract = () => {
            const name = document.getElementById('signerName').value;
            if(name) {
                playEffectSound();
                confetti();
                container.innerHTML = `
                    <div class="bg-white text-black p-8 max-w-lg rounded shadow-2xl font-serif text-center rotate-2">
                        <h2 class="text-3xl font-bold text-red-600 mb-2">SIGNED & SEALED</h2>
                        <p class="text-xl">Promised to ${name}</p>
                        <div class="text-6xl mt-4 animate-bounce">✍️❤️</div>
                    </div>
                `;
            }
        }
    },

    hug_interaction: (container) => {
         container.style.pointerEvents = 'auto';
         container.innerHTML = `
            <div class="w-40 h-40 rounded-full border-4 border-pink-500 flex items-center justify-center cursor-pointer hover:bg-pink-500/20 transition-all shadow-[0_0_30px_rgba(236,72,153,0.5)] animate-pulse" onclick="giveHug()">
                <span class="text-5xl">🤗</span>
            </div>
            <p class="absolute mt-48 text-gray-400">Tap to Embrace</p>
         `;
         window.giveHug = () => {
             playEffectSound();
             container.innerHTML = `<h2 class="text-6xl animate-ping">❤️</h2>`;
             setTimeout(() => {
                 Surprises.hug_interaction(container); // Reset
             }, 1500);
         }
    },

    kiss_mark: (container) => {
        container.style.pointerEvents = 'auto';
        // Transparent overlay
        container.innerHTML = `<div class="w-full h-full cursor-[url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewport=\'0 0 100 100\' style=\'fill:red;font-size:24px;\'><text y=\'50%\'>💋</text></svg>'),_auto]" onclick="plantKiss(event)"></div>`;

        const helpText = document.createElement('div');
        helpText.className = 'absolute bottom-10 text-gray-400 pointer-events-none bg-black/50 px-3 py-1 rounded';
        helpText.innerText = 'Tap anywhere to kiss';
        container.appendChild(helpText);

        window.plantKiss = (e) => {
            const kiss = document.createElement('div');
            kiss.innerText = '💋';
            kiss.style.position = 'absolute';
            kiss.style.left = (e.clientX - 20) + 'px';
            kiss.style.top = (e.clientY - 20) + 'px';
            kiss.style.fontSize = '3rem';
            kiss.style.transform = 'rotate(' + (Math.random() * 40 - 20) + 'deg)';
            kiss.style.pointerEvents = 'none';
            kiss.style.filter = 'drop-shadow(0 0 5px rgba(255,0,0,0.5))';
            document.body.appendChild(kiss);
            playEffectSound();

            // Fade out
            setTimeout(() => {
                kiss.style.transition = 'opacity 1s, transform 1s';
                kiss.style.opacity = '0';
                kiss.style.transform += ' scale(1.5)';
                setTimeout(() => kiss.remove(), 1000);
            }, 500);
        }
    },

    finale: (container) => {
        // Just linking to the existing function or defining it if needed
        // The button is in the HTML, so this might not be needed unless we want auto-start
        // We'll leave it empty as the button triggers launchFinale
    }
};

function playEffectSound() {
    const src = document.getElementById('soundSrc').value;
    const filename = src.split('/').pop();
    if(window.soundManager) {
        window.soundManager.play(filename, src);
    }
}
