/**
 * HOLI '26 - CORE JAVASCRIPT
 * Includes: Particle System, Mobile Touch Support, and Greeting Card Engine
 */

// --- 1. THE PARTICLE SYSTEM (DIGITAL GULAAL) ---
const canvas = document.getElementById('canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const colors = ['#ff007f', '#00f2ff', '#39ff14', '#fdfd96', '#bc13fe'];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 12 + 4; // Larger aesthetic particles
            this.speedX = Math.random() * 4 - 2;
            this.speedY = Math.random() * 4 - 2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.015;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            if (this.size > 0.5) this.size -= 0.1;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function handleInput(e) {
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(x, y));
        }
    }

    window.addEventListener('mousemove', handleInput);
    window.addEventListener('touchmove', handleInput, { passive: true });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// --- 2. GREETING CARD ENGINE (Specific to card.html) ---
const cardPreview = document.getElementById('card-preview');
if (cardPreview) {
    const inputFrom = document.getElementById('input-from');
    const inputMessage = document.getElementById('input-message');
    const cardFrom = document.getElementById('card-from');
    const cardMessage = document.getElementById('card-message');
    const splatterContainer = document.getElementById('splatter-container');
    const downloadBtn = document.getElementById('download-btn');

    const palette = ['#ff007f', '#00f2ff', '#39ff14', '#fdfd96', '#bc13fe'];

    // Generate random background splatters
    function generateSplatter() {
        if (!splatterContainer) return;
        splatterContainer.innerHTML = ''; 
        for(let i = 0; i < 6; i++) {
            const splatter = document.createElement('div');
            splatter.className = 'paint-splatter';
            const size = Math.random() * 150 + 100 + 'px';
            splatter.style.width = size;
            splatter.style.height = size;
            splatter.style.background = palette[Math.floor(Math.random() * palette.length)];
            splatter.style.top = Math.random() * 90 - 10 + '%';
            splatter.style.left = Math.random() * 90 - 10 + '%';
            splatter.style.opacity = '0.4'; // Fixed: High opacity instead of blur for html2canvas bug
            splatter.style.position = 'absolute';
            splatter.style.borderRadius = '50%';
            splatterContainer.appendChild(splatter);
        }
    }
    generateSplatter();

    // Update text in real-time
    inputFrom?.addEventListener('input', (e) => {
        cardFrom.innerText = e.target.value ? `— From ${e.target.value}` : `— From [Your Name]`;
    });

    inputMessage?.addEventListener('change', (e) => {
        cardMessage.innerText = e.target.value;
        generateSplatter(); 
    });

    // BUG-FIXED: Capturing the image
    downloadBtn?.addEventListener('click', async () => {
        const originalText = downloadBtn.innerText;
        downloadBtn.innerText = "🎨 Processing...";
        downloadBtn.style.pointerEvents = "none";

        try {
            // Short delay to let the DOM settle
            await new Promise(r => setTimeout(r, 400));

            const canvasImg = await html2canvas(cardPreview, {
                scale: 2,               // 2x scale for high-quality PNG
                backgroundColor: "#050505",
                useCORS: true,          // Helps with loading fonts/external assets
                logging: false,
                width: 320,             // Enforce Instagram Story aspect ratio
                height: 568
            });

            const link = document.createElement('a');
            link.download = `Holi_Greeting_${Date.now()}.png`;
            link.href = canvasImg.toDataURL("image/png");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            downloadBtn.innerText = "✅ Saved!";
            setTimeout(() => {
                downloadBtn.innerText = originalText;
                downloadBtn.style.pointerEvents = "auto";
            }, 2000);

        } catch (err) {
            console.error("Capture Error:", err);
            alert("Please use a modern browser or take a manual screenshot for the best results!");
            downloadBtn.innerText = "Try Again";
            downloadBtn.style.pointerEvents = "auto";
        }
    });
}

// --- 3. MOBILE MENU TOGGLE ---
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Simple mobile menu reveal logic
    if(navLinks.classList.contains('active')) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '80px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(0,0,0,0.9)';
        navLinks.style.padding = '20px';
    } else {
        navLinks.style.display = 'none';
    }
});
