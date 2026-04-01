/* ============================================================
   CROWN SOFTWARE SYSTEMS — Main JS
   ============================================================ */

(function() {
  'use strict';

  /* ── Header scroll behavior ─────────────────────────────── */
  const header = document.querySelector('.header');
  if (header) {
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.classList.toggle('scrolled', y > 30);
      lastY = y;
    }, { passive: true });
  }

  /* ── Nav overlay (burger menu) ─────────────────────────── */
  const burger = document.querySelector('.burger');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-overlay__link');

  function openNav() {
    burger && burger.classList.add('open');
    navOverlay && navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // stagger link animations
    navLinks.forEach((link, i) => {
      link.style.transitionDelay = `${0.06 + i * 0.07}s`;
    });
  }
  function closeNav() {
    burger && burger.classList.remove('open');
    navOverlay && navOverlay.classList.remove('open');
    document.body.style.overflow = '';
    navLinks.forEach(link => link.style.transitionDelay = '0s');
  }

  if (burger) {
    burger.addEventListener('click', () => {
      burger.classList.contains('open') ? closeNav() : openNav();
    });
  }
  if (navOverlay) {
    navOverlay.addEventListener('click', e => {
      if (e.target === navOverlay) closeNav();
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeNav(); }
  });

  /* ── Mark active nav link ──────────────────────────────── */
  const currentPath = window.location.pathname;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace(/\.\.\//g, '').replace('./', ''))) {
      link.classList.add('active');
    }
  });
  // home
  const homeLinks = document.querySelectorAll('.nav-overlay__link[data-page="home"]');
  homeLinks.forEach(l => {
    if (currentPath === '/' || currentPath.endsWith('/index.html') && currentPath.split('/').filter(Boolean).length <= 1) {
      l.classList.add('active');
    }
  });

  /* ── Reveal on scroll (Intersection Observer) ──────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .glow-line');
  if (revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => obs.observe(el));
  }

  /* ── Animated counters ──────────────────────────────────── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target || el.textContent);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const step = 16;
    const steps = duration / step;
    let current = 0;
    const inc = target / steps;
    const isInt = Number.isInteger(target);

    const timer = setInterval(() => {
      current = Math.min(current + inc, target);
      el.textContent = prefix + (isInt ? Math.round(current) : current.toFixed(1)) + suffix;
      if (current >= target) clearInterval(timer);
    }, step);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length) {
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObs.observe(el));
  }

  /* ── Smooth hover parallax on hero ─────────────────────── */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', e => {
      const { left, top, width, height } = heroSection.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / width;
      const y = (e.clientY - top - height / 2) / height;
      const blobs = heroSection.querySelectorAll('.blob');
      blobs.forEach((blob, i) => {
        const factor = (i + 1) * 12;
        blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    });
    heroSection.addEventListener('mouseleave', () => {
      heroSection.querySelectorAll('.blob').forEach(b => b.style.transform = '');
    });
  }

  /* ── Cards tilt effect ──────────────────────────────────── */
  document.querySelectorAll('.card-tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── CTA modal triggers from nav/header ─────────────────── */
  document.querySelectorAll('[data-modal="request"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      closeNav();
      if (window.openModal) window.openModal();
    });
  });

})();
