/* ============================================================
   CYBER THEME — script.js
   Canvas particles · Glitch · Counters · Neon effects
   ============================================================ */

'use strict';

// ── Render shared data ───────────────────────────────────
(function renderData() {
  const d = window.__data;
  if (!d) return;
  var escapeHtml = window.__utils.escapeHtml;
  var safeUrl = window.__utils.safeUrl;

  // Hero
  const heroRole = document.getElementById('hero-role-anime');
  const heroName = document.getElementById('hero-name-anime');
  const heroTagJp = document.getElementById('hero-tagline-jp');
  const heroTagEn = document.getElementById('hero-tagline-en');
  if (heroRole) heroRole.textContent = d.profile.role.toUpperCase();
  if (heroName) {
    heroName.textContent = d.profile.name;
    heroName.dataset.text = d.profile.name;
  }
  const lines = d.profile.tagline.split('\n');
  if (heroTagJp) heroTagJp.textContent = lines[0] || '';
  if (heroTagEn) heroTagEn.textContent = lines[1] || '';

  // GSAP — hero overline + sub (DO NOT SplitText glitch element)
  requestAnimationFrame(function () {
    if (!window.__utils.prefersReducedMotion() && window.gsap) {
      const overline = document.querySelector('.hero-overline');
      const heroSub  = document.querySelector('.hero-sub');
      if (overline) gsap.from(overline, { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' });
      if (heroSub)  gsap.from(heroSub,  { opacity: 0, y: 20, duration: 0.7, delay: 0.15, ease: 'power2.out' });
    }
  });

  // Hero stats
  const heroStats = document.getElementById('hero-stats');
  if (heroStats) {
    heroStats.innerHTML = d.heroStats.map((s, i) =>
      (i > 0 ? '<div class="stat-divider"></div>' : '') +
      '<div class="stat">' +
        '<span class="stat-num" data-count="' + escapeHtml(s.count) + '">0</span>' +
        '<span class="stat-unit">' + escapeHtml(s.unit) + '</span>' +
        '<span class="stat-label">' + escapeHtml(s.label) + '</span>' +
      '</div>'
    ).join('');
  }

  // Profile ID card
  const idData = document.getElementById('profile-id-data');
  if (idData) {
    idData.innerHTML =
      '<div class="id-row"><span>NAME</span><strong>' + escapeHtml(d.profile.name) + '</strong></div>' +
      '<div class="id-row"><span>CLASS</span><strong>Otaku S+</strong></div>' +
      '<div class="id-row"><span>BASE</span><strong>' + escapeHtml(d.profile.facts[0].value) + '</strong></div>' +
      '<div class="id-row"><span>EXP</span><strong>' + escapeHtml(d.profile.facts[1].value) + '</strong></div>';
  }

  // About paragraphs
  const aboutP = document.getElementById('about-paragraphs-anime');
  if (aboutP) {
    aboutP.innerHTML = d.profile.about.map(t => '<p>' + escapeHtml(t) + '</p>').join('');
  }

  // Trait grid
  const traitGrid = document.getElementById('trait-grid');
  if (traitGrid) {
    traitGrid.innerHTML = d.profile.traits.map(t =>
      '<div class="trait-chip">' + escapeHtml(t) + '</div>'
    ).join('');
  }

  // Anime grid
  const animeGrid = document.getElementById('anime-grid');
  if (animeGrid) {
    animeGrid.innerHTML = d.anime.map((a, i) =>
      '<article class="work-card reveal">' +
        '<div class="card-inner">' +
          '<div class="card-num">' + String(i + 1).padStart(2, '0') + '</div>' +
          '<h3>' + escapeHtml(a.title) + '</h3>' +
          '<p>' + escapeHtml(a.comment) + '</p>' +
          '<div class="card-tags">' + a.tags.map(t => '<span>' + escapeHtml(t) + '</span>').join('') + '</div>' +
        '</div>' +
      '</article>'
    ).join('');
  }

  // Movies grid
  const moviesGrid = document.getElementById('movies-grid');
  if (moviesGrid) {
    moviesGrid.innerHTML = d.movies.map((m, i) =>
      '<article class="work-card reveal">' +
        '<div class="card-inner">' +
          '<div class="card-num">' + String(i + 1).padStart(2, '0') + '</div>' +
          '<h3>' + escapeHtml(m.title) + '</h3>' +
          '<p>' + escapeHtml(m.comment) + '</p>' +
          '<div class="card-tags">' + m.tags.map(t => '<span>' + escapeHtml(t) + '</span>').join('') + '</div>' +
        '</div>' +
      '</article>'
    ).join('');
  }

  // Contact
  const contactMsg = document.getElementById('contact-message-anime');
  const contactEmail = document.getElementById('contact-email-anime');
  const contactSocial = document.getElementById('contact-social-anime');
  if (contactMsg) contactMsg.textContent = '> ' + d.contact.message;
  if (contactEmail) {
    contactEmail.href = safeUrl('mailto:' + d.contact.email);
  }
  if (contactSocial) {
    contactSocial.innerHTML = d.social.map(s =>
      '<a href="' + escapeHtml(safeUrl(s.url)) + '" target="_blank" rel="noopener" aria-label="' + escapeHtml(s.name) + '">' +
      '<span>' + escapeHtml(s.name) + '</span></a>'
    ).join('');
  }
})();

// ── Canvas particle field ─────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const NEONS = ['#00d4ff', '#ff0080', '#9b30ff', '#00ff88', '#ffe600'];
  const COUNT = window.innerWidth < 600 ? 60 : 130;

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * canvas.width;
      this.y  = init ? Math.random() * canvas.height : canvas.height + 10;
      this.vy = -(0.3 + Math.random() * 0.8);
      this.vx = (Math.random() - 0.5) * 0.3;
      this.r  = 0.5 + Math.random() * 1.5;
      this.col = NEONS[Math.floor(Math.random() * NEONS.length)];
      this.alpha = 0.2 + Math.random() * 0.5;
      this.life  = 1;
      this.decay = 0.0008 + Math.random() * 0.001;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      if (this.life <= 0 || this.y < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha * this.life;
      ctx.fillStyle   = this.col;
      ctx.shadowBlur  = 10;
      ctx.shadowColor = this.col;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const particles = Array.from({ length: COUNT }, () => new Particle());

  // Connection lines
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 6400) { // 80px
          const alpha = (1 - d2 / 6400) * 0.12;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = particles[i].col;
          ctx.lineWidth   = 0.5;
          ctx.shadowBlur  = 4;
          ctx.shadowColor = particles[i].col;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  // Mouse interaction
  let mouse = { x: -9999, y: -9999 };
  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  function applyMouseRepel() {
    particles.forEach(p => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 80 && d > 0) {
        const force = (80 - d) / 80 * 0.8;
        p.vx += (dx / d) * force;
        p.vy += (dy / d) * force;
        // Dampen
        p.vx *= 0.95;
        p.vy *= 0.95;
      }
    });
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    applyMouseRepel();
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── Scroll reveal ─────────────────────────────────────────
// Fallback for browsers without CSS Scroll-Driven Animations (e.g. Safari)
if (!CSS.supports('animation-timeline', 'view()')) {
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
          const delay = siblings.indexOf(entry.target) * 80;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );
  revealEls.forEach(el => revealObserver.observe(el));
}

// ── Counter animation (hero stats) ────────────────────────
function animateCount(el, target, duration = 1400) {
  const start = performance.now();
  function step(now) {
    const t   = Math.min((now - start) / duration, 1);
    const val = Math.round(t * t * (3 - 2 * t) * target); // smoothstep
    el.textContent = val;
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('.stat-num[data-count]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target, parseInt(e.target.dataset.count, 10));
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

// ── Click burst effect ────────────────────────────────────
const BURST_CHARS = ['⚡', '✦', '★', '▲', '◆', '×'];
const BURST_COLS  = ['#00d4ff', '#ff0080', '#9b30ff', '#00ff88', '#ffe600'];

document.addEventListener('click', e => {
  for (let i = 0; i < 8; i++) {
    const el    = document.createElement('span');
    const char  = BURST_CHARS[Math.floor(Math.random() * BURST_CHARS.length)];
    const col   = BURST_COLS [Math.floor(Math.random() * BURST_COLS.length)];
    const angle = (Math.PI * 2 / 8) * i;
    const dist  = 50 + Math.random() * 40;

    el.textContent = char;
    el.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top:  ${e.clientY}px;
      color: ${col};
      font-size: ${12 + Math.random() * 10}px;
      pointer-events: none;
      z-index: 9999;
      text-shadow: 0 0 8px ${col};
      animation: burstFly 0.6s ease-out forwards;
      --dx: ${Math.cos(angle) * dist}px;
      --dy: ${Math.sin(angle) * dist}px;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 650);
  }
});

// inject burst keyframes once
if (!document.getElementById('burst-kf')) {
  const s = document.createElement('style');
  s.id = 'burst-kf';
  s.textContent = `
    @keyframes burstFly {
      0%   { transform: translate(-50%,-50%) scale(1.2); opacity: 1; }
      100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.2); opacity: 0; }
    }
  `;
  document.head.appendChild(s);
}

// ── Neon flicker on title (random, subtle) ─────────────────
const heroTitle = document.querySelector('.glitch');
if (heroTitle) {
  setInterval(() => {
    if (Math.random() < 0.15) {
      heroTitle.style.opacity = '0.85';
      setTimeout(() => { heroTitle.style.opacity = ''; }, 60);
    }
  }, 800);
}

// ── CRT flicker (very subtle, rare) ──────────────────────
setInterval(() => {
  if (Math.random() < 0.04) {
    document.body.style.filter = 'brightness(0.94)';
    setTimeout(() => { document.body.style.filter = ''; }, 50);
    setTimeout(() => {
      document.body.style.filter = 'brightness(1.04)';
      setTimeout(() => { document.body.style.filter = ''; }, 30);
    }, 80);
  }
}, 3000);

// ── Typing effect re-trigger on visible ──────────────────
const typeEl = document.querySelector('.typing-effect');
if (typeEl) {
  const text = typeEl.textContent.replace('█', '');
  typeEl.textContent = '';
  const termObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      let i = 0;
      const tick = setInterval(() => {
        typeEl.textContent = text.slice(0, ++i);
        if (i >= text.length) clearInterval(tick);
      }, 55);
      termObserver.disconnect();
    }
  }, { threshold: 0.5 });
  termObserver.observe(typeEl);
}
