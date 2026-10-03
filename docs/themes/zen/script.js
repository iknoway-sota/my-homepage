/* ============================================================
   ZEN THEME — script.js
   ============================================================ */

(function renderData() {
  var d = window.__data;
  if (!d) return;
  var escapeHtml = window.__utils.escapeHtml;
  var safeUrl = window.__utils.safeUrl;

  var heroName = document.getElementById('hero-name');
  var heroRole = document.getElementById('hero-role');
  var heroTagline = document.getElementById('hero-tagline');
  if (heroName) heroName.textContent = d.profile.name;
  if (heroRole) heroRole.textContent = d.profile.role;
  if (heroTagline) heroTagline.innerHTML = escapeHtml(d.profile.tagline).replace(/\n/g, '<br>');

  var aboutP = document.getElementById('about-paragraphs');
  if (aboutP) {
    aboutP.innerHTML = d.profile.about.map(function (t) { return '<p>' + escapeHtml(t) + '</p>'; }).join('');
  }

  var facts = document.getElementById('about-facts');
  if (facts) {
    facts.innerHTML = d.profile.facts.map(function (f) {
      return '<li><span class="fact-key">' + escapeHtml(f.label) + '</span><span class="fact-val">' + escapeHtml(f.value) + '</span></li>';
    }).join('');
  }

  function renderList(gridId, items) {
    var grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = items.map(function (item, i) {
      return '<div class="work-entry reveal">' +
        '<div class="work-num">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<h3>' + escapeHtml(item.title) + '</h3>' +
        '<p>' + escapeHtml(item.comment) + '</p>' +
        '<div class="work-tags">' + item.tags.map(function (t) { return '<span>' + escapeHtml(t) + '</span>'; }).join('') + '</div>' +
      '</div>';
    }).join('');
  }

  renderList('anime-grid', d.anime);
  renderList('movies-grid', d.movies);

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

var header = document.getElementById('site-header');
window.addEventListener('scroll', function () {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('.nav-links a');
var navObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      navLinks.forEach(function (a) {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id ? 'var(--shu)' : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(function (s) { navObs.observe(s); });
