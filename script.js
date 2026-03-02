document.addEventListener('DOMContentLoaded', () => {

    // 1. PARTICLE SYSTEM (DIGITAL GULAAL)
    const canvas = document.getElementById('canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const colors = ['#ff007f', '#00f2ff', '#39ff14', '#fdfd96'];

        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize); resize();

        class Particle {
            constructor(x, y) {
                this.x = x; this.y = y;
                this.size = Math.random() * 12 + 4;
                this.speedX = Math.random() * 4 - 2;
                this.speedY = Math.random() * 4 - 2;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.life = 1;
            }
            update() { this.x += this.speedX; this.y += this.speedY; this.life -= 0.02; }
            draw() {
                ctx.fillStyle = this.color; ctx.globalAlpha = this.life;
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
            }
        }

        const handleMove = (e) => {
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            const y = e.touches ? e.touches[0].clientY : e.clientY;
            for(let i=0; i<2; i++) particles.push(new Particle(x, y));
        };
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => { p.update(); p.draw(); if(p.life <= 0) particles.splice(i,1); });
            requestAnimationFrame(animate);
        };
        animate();
    }

    // 2. LIVE NAME ENTRY & CARD LOGIC
    document.addEventListener('input', (e) => {
        if (e.target.id === 'input-from') {
            const display = document.getElementById('card-from');
            if (display) {
                const name = e.target.value.trim();
                display.innerText = name ? `— FROM ${name.toUpperCase()}` : "— FROM [YOUR NAME]";
            }
        }
        if (e.target.id === 'input-message') {
            const msgDisplay = document.getElementById('card-message');
            if (msgDisplay) msgDisplay.innerText = e.target.value;
        }
    });

    // 3. DOWNLOAD SYSTEM
    const downBtn = document.getElementById('download-btn');
    if (downBtn) {
        downBtn.addEventListener('click', async () => {
            const card = document.getElementById('card-preview');
            downBtn.innerText = "CAPTURING...";
            try {
                const canvasImg = await html2canvas(card, { scale: 2, backgroundColor: "#050505", useCORS: true });
                const link = document.createElement('a');
                link.download = `Holi_Story_2026.png`;
                link.href = canvasImg.toDataURL("image/png");
                link.click();
                downBtn.innerText = "DONE!";
            } catch (err) { alert("Error! Please take a screenshot."); }
            setTimeout(() => downBtn.innerText = "DOWNLOAD FOR INSTA STORY", 3000);
        });
    }
});
