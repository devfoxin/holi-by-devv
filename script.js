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
