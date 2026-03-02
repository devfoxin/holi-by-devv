document.addEventListener('DOMContentLoaded', () => {

    // --- PART 1: DIGITAL GULAAL (Particles) ---
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
                this.size = Math.random() * 12 + 4;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
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

    // --- PART 2: NAME ENTERING LOGIC (The Fix) ---
    // We listen to the whole document so it works even if elements load late
    document.addEventListener('input', (event) => {
        if (event.target && event.target.id === 'input-from') {
            const displayFrom = document.getElementById('card-from');
            const enteredName = event.target.value.trim();
            
            if (displayFrom) {
                if (enteredName !== "") {
                    displayFrom.innerText = `— FROM ${enteredName.toUpperCase()}`;
                    console.log("Name Updated to:", enteredName); // Check F12 console
                } else {
                    displayFrom.innerText = "— FROM [YOUR NAME]";
                }
            }
        }
        
        // Handle Message Change
        if (event.target && event.target.id === 'input-message') {
            const displayMsg = document.getElementById('card-message');
            if (displayMsg) {
                displayMsg.innerText = event.target.value;
            }
        }
    });

    // --- PART 3: DOWNLOAD LOGIC ---
    const downloadBtn = document.getElementById('download-btn');
    const cardPreview = document.getElementById('card-preview');

    if (downloadBtn && cardPreview) {
        downloadBtn.addEventListener('click', async () => {
            downloadBtn.innerText = "CREATING...";
            try {
                const canvasImg = await html2canvas(cardPreview, {
                    scale: 2,
                    backgroundColor: "#050505",
                    useCORS: true
                });
                const link = document.createElement('a');
                link.download = `Holi_Greeting.png`;
                link.href = canvasImg.toDataURL("image/png");
                link.click();
                downloadBtn.innerText = "DOWNLOADED!";
            } catch (err) {
                console.error("Download Error:", err);
                alert("Please try a manual screenshot!");
            }
            setTimeout(() => downloadBtn.innerText = "DOWNLOAD FOR INSTA STORY", 3000);
        });
    }
});
