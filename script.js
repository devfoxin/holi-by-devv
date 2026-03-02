/**
 * HOLI '26 - ALL-IN-ONE SCRIPT
 * Handles: Particles, Card Customization, and Image Export
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THE PARTICLE ENGINE (DIGITAL GULAAL) ---
    const canvas = document.getElementById('canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const colors = ['#ff007f', '#00f2ff', '#39ff14', '#fdfd96', '#bc13fe'];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor(x, y) {
                this.x = x; this.y = y;
                this.size = Math.random() * 14 + 4;
                this.speedX = Math.random() * 4 - 2;
                this.speedY = Math.random() * 4 - 2;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.life = 1;
                this.decay = Math.random() * 0.02 + 0.01;
            }
            update() {
                this.x += this.speedX; this.y += this.speedY;
                this.life -= this.decay;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.life;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const triggerParticles = (e) => {
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            const y = e.touches ? e.touches[0].clientY : e.clientY;
            for (let i = 0; i < 2; i++) particles.push(new Particle(x, y));
        };

        window.addEventListener('mousemove', triggerParticles);
        window.addEventListener('touchmove', triggerParticles, { passive: true });

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.update(); p.draw();
                if (p.life <= 0) particles.splice(i, 1);
            });
            requestAnimationFrame(animate);
        };
        animate();
    }

    // --- 2. THE CARD ENGINE (FOR CARD.HTML) ---
    const cardPreview = document.getElementById('card-preview');
    if (cardPreview) {
        const inputName = document.getElementById('input-from');
        const inputMsg = document.getElementById('input-message');
        const displayFrom = document.getElementById('card-from');
        const displayMsg = document.getElementById('card-message');
        const splatterBox = document.getElementById('splatter-container');
        const downloadBtn = document.getElementById('download-btn');

        // Random Splatters (Fixed for html2canvas compatibility)
        const updateSplatters = () => {
            splatterBox.innerHTML = '';
            const cardColors = ['#ff007f', '#00f2ff', '#39ff14', '#fdfd96'];
            for (let i = 0; i < 6; i++) {
                const s = document.createElement('div');
                const size = Math.random() * 180 + 100 + 'px';
                Object.assign(s.style, {
                    position: 'absolute', width: size, height: size,
                    background: cardColors[i % cardColors.length], borderRadius: '50%',
                    top: Math.random() * 90 - 10 + '%', left: Math.random() * 90 - 10 + '%',
                    opacity: '0.4', filter: 'blur(30px)', pointerEvents: 'none'
                });
                splatterBox.appendChild(s);
            }
        };
        updateSplatters();

        // Live Name Update
        inputName?.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            displayFrom.innerText = val !== "" ? `— FROM ${val.toUpperCase()}` : "— FROM [YOUR NAME]";
        });

        // Live Message Update
        inputMsg?.addEventListener('change', (e) => {
            displayMsg.innerText = e.target.value;
            updateSplatters(); // New splatters for new message
        });

        // Image Export Logic
        downloadBtn?.addEventListener('click', async () => {
            downloadBtn.innerText = "🎨 SAVING...";
            downloadBtn.style.pointerEvents = "none";

            try {
                const canvasImg = await html2canvas(cardPreview, {
                    scale: 2, backgroundColor: "#050505", useCORS: true
                });
                const link = document.createElement('a');
                link.download = `Holi_2026_${Date.now()}.png`;
                link.href = canvasImg.toDataURL("image/png");
                link.click();
                downloadBtn.innerText = "✅ DOWNLOADED";
            } catch (err) {
                console.error(err);
                alert("Capture failed. Please try a screenshot!");
                downloadBtn.innerText = "FAILED";
            }
            setTimeout(() => {
                downloadBtn.innerText = "DOWNLOAD FOR INSTA STORY";
                downloadBtn.style.pointerEvents = "auto";
            }, 3000);
        });
    }
});
