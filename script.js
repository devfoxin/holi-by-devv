/**
 * HOLI '26 MASTER SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- PART 1: DIGITAL GULAAL (ALL PAGES) ---
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
                this.size = Math.random() * 15 + 5;
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

        const addParticles = (e) => {
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            const y = e.touches ? e.touches[0].clientY : e.clientY;
            for (let i = 0; i < 2; i++) particles.push(new Particle(x, y));
        };

        window.addEventListener('mousemove', addParticles);
        window.addEventListener('touchmove', addParticles, { passive: true });

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

    // --- PART 2: GREETING CARD ENGINE (CARD PAGE ONLY) ---
    const cardPreview = document.getElementById('card-preview');
    if (cardPreview) {
        const inputFrom = document.getElementById('input-from');
        const inputMsg = document.getElementById('input-message');
        const cardFrom = document.getElementById('card-from');
        const cardMsg = document.getElementById('card-message');
        const splatterContainer = document.getElementById('splatter-container');
        const downloadBtn = document.getElementById('download-btn');

        const generateSplatters = () => {
            splatterContainer.innerHTML = '';
            const colors = ['#ff007f', '#00f2ff', '#39ff14', '#fdfd96'];
            for (let i = 0; i < 5; i++) {
                const s = document.createElement('div');
                const size = Math.random() * 150 + 100 + 'px';
                Object.assign(s.style, {
                    position: 'absolute', width: size, height: size,
                    background: colors[i % colors.length], borderRadius: '50%',
                    top: Math.random() * 80 + '%', left: Math.random() * 80 - 10 + '%',
                    opacity: '0.4', pointerEvents: 'none', z-index: '1'
                });
                splatterContainer.appendChild(s);
            }
        };
        generateSplatters();

        inputFrom?.addEventListener('input', (e) => cardFrom.innerText = e.target.value ? `— From ${e.target.value}` : `— From [Your Name]`);
        inputMsg?.addEventListener('change', (e) => {
            cardMsg.innerText = e.target.value;
            generateSplatters();
        });

        downloadBtn?.addEventListener('click', async () => {
            downloadBtn.innerText = "🎨 Creating...";
            // Use html2canvas library
            try {
                const canvasImg = await html2canvas(cardPreview, { 
                    scale: 2, backgroundColor: "#050505", useCORS: true 
                });
                const link = document.createElement('a');
                link.download = `Holi_2026_Card.png`;
                link.href = canvasImg.toDataURL("image/png");
                link.click();
                downloadBtn.innerText = "✅ Downloaded";
            } catch (err) {
                alert("Error generating card. Try a screenshot!");
                downloadBtn.innerText = "Download Failed";
            }
            setTimeout(() => downloadBtn.innerText = "Download for Insta Story", 3000);
        });
    }
});
