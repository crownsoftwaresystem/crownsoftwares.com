/* ============================================================
   CROWN SOFTWARE SYSTEMS — Animations JS
   ============================================================ */

(function() {
  'use strict';

  /* ── Hero Canvas Particles ─────────────────────────────── */
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = 60;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function mkParticle() {
    const gold = Math.random() > 0.5;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.05,
      alpha: Math.random() * 0.5 + 0.1,
      gold
    };
  }

  particles = Array.from({ length: COUNT }, mkParticle);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(201,168,76,${p.alpha})`
        : `rgba(78,205,196,${p.alpha * 0.6})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10 || p.x < -10 || p.x > W + 10) {
        Object.assign(p, mkParticle(), { y: H + 10 });
      }
    });

    // Draw faint connection lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${0.06 * (1 - dist/120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();

})();
