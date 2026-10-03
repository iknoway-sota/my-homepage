/* ============================================================
   APPLE THEME — script.js
   Cinematic scroll reveals, animated stat counters,
   staggered card entrance
   ============================================================ */

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

  // Stats
  var statsGrid = document.getElementById('stats-grid');
  if (statsGrid && d.heroStats) {
    statsGrid.innerHTML = d.heroStats.map(function (s) {
      return '<div class="stat-item reveal">' +
        '<div class="stat-number">' +
          '<span class="count-up" data-target="' + escapeHtml(s.count) + '">0</span>' +
          '<span class="stat-unit">' + escapeHtml(s.unit) + '</span>' +
        '</div>' +
        '<div class="stat-label">' + escapeHtml(s.label) + '</div>' +
      '</div>';
    }).join('');
  }

  // About
  var aboutP = document.getElementById('about-paragraphs');
  if (aboutP) {
    aboutP.innerHTML = d.profile.about.map(function (t) {
      return '<p>' + escapeHtml(t) + '</p>';
    }).join('');
  }

  // Facts tiles
  var factsTiles = document.getElementById('about-facts');
  if (factsTiles) {
    factsTiles.innerHTML = d.profile.facts.map(function (f) {
      return '<div class="fact-tile reveal">' +
        '<div class="fact-tile-label">' + escapeHtml(f.label) + '</div>' +
        '<div class="fact-tile-value">' + escapeHtml(f.value) + '</div>' +
      '</div>';
    }).join('');
  }

  // Traits
  var traitsWrap = document.getElementById('about-traits');
  if (traitsWrap && d.profile.traits) {
    traitsWrap.innerHTML = d.profile.traits.map(function (t) {
      return '<span class="trait-chip">' + escapeHtml(t) + '</span>';
    }).join('');
  }

  // Cards helper
  function renderCards(gridId, items) {
    var grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = items.map(function (item, i) {
      return '<article class="work-card reveal">' +
        '<div class="work-number">0' + (i + 1) + '</div>' +
        '<h3>' + escapeHtml(item.title) + '</h3>' +
        '<p>' + escapeHtml(item.comment) + '</p>' +
        '<div class="work-tags">' +
          item.tags.map(function (t) { return '<span>' + escapeHtml(t) + '</span>'; }).join('') +
        '</div>' +
      '</article>';
    }).join('');
  }

  renderCards('anime-grid', d.anime);
  renderCards('movies-grid', d.movies);

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

// ── Count-up animation for stats ─────────────────────────
function animateCountUp(el) {
  var target = parseInt(el.getAttribute('data-target'), 10);
  var duration = 1800;
  var start = performance.now();

  function step(now) {
    var elapsed = now - start;
    var progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// ── Reveal on scroll ─────────────────────────────────────
if (!CSS.supports('animation-timeline', 'view()')) {
  var revealEls = document.querySelectorAll('.reveal');
  var countUpDone = new Set();

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');
        observer.unobserve(entry.target);

        // Trigger count-up if this is a stat
        var countEl = entry.target.querySelector('.count-up');
        if (countEl && !countUpDone.has(countEl)) {
          countUpDone.add(countEl);
          animateCountUp(countEl);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(function (el) { observer.observe(el); });
} else {
  // For browsers with scroll-driven animations, still do count-up
  var countEls = document.querySelectorAll('.count-up');
  var countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCountUp(entry.target);
        countObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  countEls.forEach(function (el) { countObs.observe(el); });
}

// ── Active nav highlight ─────────────────────────────────
var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('.nav-links a');

var navObs = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (a) {
          a.style.color = a.getAttribute('href') === '#' + entry.target.id
            ? 'var(--text-on-dark)'
            : '';
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(function (s) { navObs.observe(s); });
