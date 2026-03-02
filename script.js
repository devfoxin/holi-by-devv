// script.js - Color Splash Interaction (Shared)
const canvas = document.getElementById('canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    // Aesthetic Holi Palette
    const colors = ['#ff007f', '#00f2ff', '#39ff14', '#fdfd96', '#bc13fe'];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor(x, y) {
            this.x = x; this.y = y;
            // Slightly larger, softer particles for attractiveness
            this.size = Math.random() * 20 + 5; 
            this.speedX = Math.random() * 4 - 2;
            this.speedY = Math.random() * 4 - 2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.life = 1; // Alpha value
            this.decay = Math.random() * 0.02 + 0.01; // Random fade speed
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            if (this.size > 0.5) this.size -= 0.2; // Shrink
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
        // Handle both mouse and touch events
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        
        // Add fewer particles per move to prevent lag on mobile
        for (let i = 0; i < 2; i++) {
            particles.push(new Particle(x, y));
        }
    }

    window.addEventListener('mousemove', handleInput);
    window.addEventListener('touchmove', handleInput, {passive: true}); // Optimised for mobile

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
                i--; // Adjust index after removing
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}
// --- BUG-FIXED GREETING CARD ENGINE ---

const inputFrom = document.getElementById('input-from');
const inputMessage = document.getElementById('input-message');
const cardFrom = document.getElementById('card-from');
const cardMessage = document.getElementById('card-message');
const splatterContainer = document.getElementById('splatter-container');
const downloadBtn = document.getElementById('download-btn');
const cardPreview = document.getElementById('card-preview');

const palette = ['#ff007f', '#00f2ff', '#39ff14', '#fdfd96', '#bc13fe'];

// 1. Improved Splatter Generation (Uses Opacity instead of heavy blur for better rendering)
function generateSplatter() {
    splatterContainer.innerHTML = ''; 
    for(let i=0; i<6; i++) {
        const splatter = document.createElement('div');
        splatter.className = 'paint-splatter';
        const size = Math.random() * 150 + 100 + 'px';
        splatter.style.width = size;
        splatter.style.height = size;
        splatter.style.background = palette[Math.floor(Math.random()*palette.length)];
        splatter.style.top = Math.random() * 90 - 10 + '%';
        splatter.style.left = Math.random() * 90 - 10 + '%';
        splatter.style.opacity = '0.5'; // html2canvas handles opacity better than blur
        splatterContainer.appendChild(splatter);
    }
}
generateSplatter();

// 2. Real-time updates
inputFrom.addEventListener('input', (e) => {
    cardFrom.innerText = e.target.value ? `— From ${e.target.value}` : `— From [Your Name]`;
});

inputMessage.addEventListener('change', (e) => {
    cardMessage.innerText = e.target.value;
    generateSplatter(); 
});

// 3. Robust Download Function
downloadBtn.addEventListener('click', async () => {
    // Feedback for the user
    const originalText = downloadBtn.innerText;
    downloadBtn.innerText = "🎨 Processing...";
    downloadBtn.style.pointerEvents = "none";
    downloadBtn.style.opacity = "0.7";

    try {
        // We use a small timeout to ensure the DOM is settled
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = await html2canvas(cardPreview, {
            scale: 2,           // High quality
            useCORS: true,      // Fixes potential cross-origin issues
            allowTaint: true,
            backgroundColor: "#050505", // Forces background color if transparent
            logging: false
        });

        // Convert to Image
        const imageURL = canvas.toDataURL("image/png");
        
        // Create a download anchor
        const downloadLink = document.createElement("a");
        downloadLink.href = imageURL;
        downloadLink.download = `Holi_Greeting_2026_${Date.now()}.png`;
        
        // Append, Click, and Remove (Better for Mobile)
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        downloadBtn.innerText = "✅ Saved!";
        setTimeout(() => {
            downloadBtn.innerText = originalText;
            downloadBtn.style.pointerEvents = "auto";
            downloadBtn.style.opacity = "1";
        }, 2000);

    } catch (err) {
        console.error("Card generation failed:", err);
        alert("Oops! Something went wrong. If you are on a phone, try taking a screenshot instead!");
        downloadBtn.innerText = "Try Again";
        downloadBtn.style.pointerEvents = "auto";
        downloadBtn.style.opacity = "1";
    }
});
