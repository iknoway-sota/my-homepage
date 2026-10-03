/* ============================================================
   ANIME THEME — script.js
   Sparkles · Scroll reveal · Data rendering
   ============================================================ */

'use strict';

// ── Render shared data ───────────────────────────────────
(function renderData() {
  var d = window.__data;
  if (!d) return;
  var escapeHtml = window.__utils.escapeHtml;
  var safeUrl = window.__utils.safeUrl;

  // Hero
  var heroName = document.getElementById('hero-name');
  var heroRole = document.getElementById('hero-role');
  var heroTagline = document.getElementById('hero-tagline');
  if (heroName) heroName.textContent = d.profile.name;
  if (heroRole) heroRole.textContent = d.profile.role;
  if (heroTagline) heroTagline.innerHTML = escapeHtml(d.profile.tagline).replace(/\n/g, '<br>');

  // GSAP SplitText — hero name
  requestAnimationFrame(function () {
    if (!window.__utils.prefersReducedMotion() && window.gsap && window.SplitText && heroName) {
      var split = new SplitText(heroName, { type: 'chars' });
      gsap.from(split.chars, {
        opacity: 0, y: 30, duration: 0.6, stagger: 0.03, ease: 'power3.out',
      });
    }
  });

  // Hero stats
  var heroStats = document.getElementById('hero-stats');
  if (heroStats) {
    heroStats.innerHTML = d.heroStats.map(function (s, i) {
      return (i > 0 ? '<div class="stat-divider"></div>' : '') +
        '<div class="stat">' +
          '<span class="stat-num" data-count="' + escapeHtml(s.count) + '">0</span>' +
          '<span class="stat-unit">' + escapeHtml(s.unit) + '</span>' +
          '<span class="stat-label">' + escapeHtml(s.label) + '</span>' +
        '</div>';
    }).join('');
  }

  // About paragraphs
  var aboutP = document.getElementById('about-paragraphs');
  if (aboutP) {
    aboutP.innerHTML = d.profile.about.map(function (t) { return '<p>' + escapeHtml(t) + '</p>'; }).join('');
  }

  // About facts
  var factsUl = document.getElementById('about-facts');
  if (factsUl) {
    factsUl.innerHTML = d.profile.facts.map(function (f) {
      return '<li><span>' + escapeHtml(f.label) + '</span>' + escapeHtml(f.value) + '</li>';
    }).join('');
  }

  // Trait grid
  var traitGrid = document.getElementById('trait-grid');
  if (traitGrid) {
    traitGrid.innerHTML = d.profile.traits.map(function (t) {
      return '<div class="trait-chip">' + escapeHtml(t) + '</div>';
    }).join('');
  }

  // Anime grid
  var animeGrid = document.getElementById('anime-grid');
  if (animeGrid) {
    animeGrid.innerHTML = d.anime.map(function (a, i) {
      return '<article class="anime-card reveal">' +
        '<div class="card-num">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<h3>' + escapeHtml(a.title) + '</h3>' +
        '<p>' + escapeHtml(a.comment) + '</p>' +
        '<div class="card-tags">' + a.tags.map(function (t) { return '<span>' + escapeHtml(t) + '</span>'; }).join('') + '</div>' +
      '</article>';
    }).join('');
  }

  // Movies grid
  var moviesGrid = document.getElementById('movies-grid');
  if (moviesGrid) {
    moviesGrid.innerHTML = d.movies.map(function (m, i) {
      return '<article class="anime-card reveal">' +
        '<div class="card-num">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<h3>' + escapeHtml(m.title) + '</h3>' +
        '<p>' + escapeHtml(m.comment) + '</p>' +
        '<div class="card-tags">' + m.tags.map(function (t) { return '<span>' + escapeHtml(t) + '</span>'; }).join('') + '</div>' +
      '</article>';
    }).join('');
  }

  // Contact
  var contactMsg = document.getElementById('contact-message');
  var contactSocial = document.getElementById('contact-social');
  if (contactMsg) contactMsg.textContent = d.contact.message;
  if (contactSocial) {
    contactSocial.innerHTML = d.social.map(function (s) {
      return '<a href="' + escapeHtml(safeUrl(s.url)) + '" target="_blank" rel="noopener" aria-label="' + escapeHtml(s.name) + '">' +
        '<span>' + escapeHtml(s.name) + '</span></a>';
    }).join('');
  }
})();

// ── Sparkle canvas ───────────────────────────────────────
(function initSparkles() {
  var canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  var COLORS = ['#FF6B9D', '#7EC8E3', '#FFD700', '#FFB6C8', '#B8E4F0'];
  var COUNT = window.innerWidth < 600 ? 25 : 50;

  function Sparkle() { this.reset(true); }
  Sparkle.prototype.reset = function (init) {
    this.x = Math.random() * canvas.width;
    this.y = init ? Math.random() * canvas.height : -10;
    this.vy = 0.2 + Math.random() * 0.5;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.size = 1 + Math.random() * 3;
    this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = 0.3 + Math.random() * 0.5;
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.02 + Math.random() * 0.03;
  };
  Sparkle.prototype.update = function () {
    this.y += this.vy;
    this.x += this.vx;
    this.pulse += this.pulseSpeed;
    if (this.y > canvas.height + 10) this.reset(false);
  };
  Sparkle.prototype.draw = function () {
    var a = this.alpha * (0.5 + 0.5 * Math.sin(this.pulse));
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = this.col;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.col;

    // draw a 4-point star
    var s = this.size;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - s * 1.5);
    ctx.lineTo(this.x + s * 0.4, this.y - s * 0.4);
    ctx.lineTo(this.x + s * 1.5, this.y);
    ctx.lineTo(this.x + s * 0.4, this.y + s * 0.4);
    ctx.lineTo(this.x, this.y + s * 1.5);
    ctx.lineTo(this.x - s * 0.4, this.y + s * 0.4);
    ctx.lineTo(this.x - s * 1.5, this.y);
    ctx.lineTo(this.x - s * 0.4, this.y - s * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  var sparkles = [];
  for (var i = 0; i < COUNT; i++) sparkles.push(new Sparkle());

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var j = 0; j < sparkles.length; j++) {
      sparkles[j].update();
      sparkles[j].draw();
    }
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── Scroll reveal ────────────────────────────────────────
// Fallback for browsers without CSS Scroll-Driven Animations (e.g. Safari)
if (!CSS.supports('animation-timeline', 'view()')) {
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
          var delay = siblings.indexOf(entry.target) * 80;
          setTimeout(function () { entry.target.classList.add('visible'); }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );
  revealEls.forEach(function (el) { revealObserver.observe(el); });
}

// ── Scroll-triggered header ──────────────────────────────
var header = document.getElementById('site-header');
window.addEventListener('scroll', function () {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Counter animation ────────────────────────────────────
function animateCount(el, target, duration) {
  duration = duration || 1400;
  var start = performance.now();
  function step(now) {
    var t = Math.min((now - start) / duration, 1);
    var val = Math.round(t * t * (3 - 2 * t) * target);
    el.textContent = val;
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

var counterEls = document.querySelectorAll('.stat-num[data-count]');
var counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      animateCount(e.target, parseInt(e.target.dataset.count, 10));
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(function (el) { counterObserver.observe(el); });

// ── Click sparkle burst ──────────────────────────────────
var BURST_CHARS = ['+', '*', '.'];
var BURST_COLS = ['#FF6B9D', '#7EC8E3', '#FFD700', '#FFB6C8'];

document.addEventListener('click', function (e) {
  for (var i = 0; i < 6; i++) {
    var el = document.createElement('span');
    var char = BURST_CHARS[Math.floor(Math.random() * BURST_CHARS.length)];
    var col = BURST_COLS[Math.floor(Math.random() * BURST_COLS.length)];
    var angle = (Math.PI * 2 / 6) * i;
    var dist = 30 + Math.random() * 30;

    el.textContent = char;
    el.style.cssText =
      'position:fixed;left:' + e.clientX + 'px;top:' + e.clientY + 'px;' +
      'color:' + col + ';font-size:' + (14 + Math.random() * 8) + 'px;' +
      'font-weight:900;pointer-events:none;z-index:9999;' +
      'animation:sparkBurst 0.5s ease-out forwards;' +
      '--dx:' + (Math.cos(angle) * dist) + 'px;' +
      '--dy:' + (Math.sin(angle) * dist) + 'px;';
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 550);
  }
});

// inject burst keyframes
if (!document.getElementById('spark-kf')) {
  var s = document.createElement('style');
  s.id = 'spark-kf';
  s.textContent =
    '@keyframes sparkBurst {' +
    '0% { transform: translate(-50%,-50%) scale(1.3); opacity: 1; }' +
    '100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0); opacity: 0; }' +
    '}';
  document.head.appendChild(s);
}
