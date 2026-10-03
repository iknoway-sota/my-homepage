/* ============================================================
   CLASSY THEME — script.js
   ============================================================ */

// ── Render shared data ───────────────────────────────────
(function renderData() {
  const d = window.__data;
  if (!d) return;
  var escapeHtml = window.__utils.escapeHtml;
  var safeUrl = window.__utils.safeUrl;

  // Hero
  const heroName = document.getElementById('hero-name');
  const heroRole = document.getElementById('hero-role');
  const heroTagline = document.getElementById('hero-tagline');
  if (heroName) heroName.textContent = d.profile.name;
  if (heroRole) heroRole.textContent = d.profile.role;
  if (heroTagline) heroTagline.innerHTML = escapeHtml(d.profile.tagline).replace(/\n/g, '<br>');

  // About paragraphs
  const aboutP = document.getElementById('about-paragraphs');
  if (aboutP) {
    aboutP.innerHTML = d.profile.about.map(t => '<p>' + escapeHtml(t) + '</p>').join('');
  }

  // About facts
  const factsUl = document.getElementById('about-facts');
  if (factsUl) {
    factsUl.innerHTML = d.profile.facts.map(f =>
      '<li><span>' + escapeHtml(f.label) + '</span>' + escapeHtml(f.value) + '</li>'
    ).join('');
  }

  // Anime grid
  const animeGrid = document.getElementById('anime-grid');
  if (animeGrid) {
    animeGrid.innerHTML = d.anime.map((a, i) =>
      '<article class="work-card reveal">' +
        '<div class="work-number">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<h3>' + escapeHtml(a.title) + '</h3>' +
        '<p>' + escapeHtml(a.comment) + '</p>' +
        '<div class="work-tags">' + a.tags.map(t => '<span>' + escapeHtml(t) + '</span>').join('') + '</div>' +
      '</article>'
    ).join('');
  }

  // Movies grid
  const moviesGrid = document.getElementById('movies-grid');
  if (moviesGrid) {
    moviesGrid.innerHTML = d.movies.map((m, i) =>
      '<article class="work-card reveal">' +
        '<div class="work-number">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<h3>' + escapeHtml(m.title) + '</h3>' +
        '<p>' + escapeHtml(m.comment) + '</p>' +
        '<div class="work-tags">' + m.tags.map(t => '<span>' + escapeHtml(t) + '</span>').join('') + '</div>' +
      '</article>'
    ).join('');
  }

  // Contact
  const contactMsg = document.getElementById('contact-message');
  const contactSocial = document.getElementById('contact-social');
  if (contactMsg) contactMsg.textContent = d.contact.message;
  if (contactSocial) {
    contactSocial.innerHTML = d.social.map(s =>
      '<a href="' + escapeHtml(safeUrl(s.url)) + '" target="_blank" rel="noopener" aria-label="' + escapeHtml(s.name) + '">' +
      '<span>' + escapeHtml(s.name) + '</span></a>'
    ).join('');
  }
})();

// ── Scroll-triggered header ───────────────────────────────
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Reveal on scroll ──────────────────────────────────────
// Fallback for browsers without CSS Scroll-Driven Animations (e.g. Safari)
if (!CSS.supports('animation-timeline', 'view()')) {
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
          const delay = siblings.indexOf(entry.target) * 90;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
  );
  revealEls.forEach(el => observer.observe(el));
}

// ── Active nav highlight ───────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${entry.target.id}`
            ? 'var(--chalk)'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => navObserver.observe(s));
