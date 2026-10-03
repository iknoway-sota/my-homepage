/**
 * shared/projects.js
 * Injects the projects/works section separately from Contact.
 */
(function () {
  'use strict';

  var data = window.__data;
  if (!data || !Array.isArray(data.projects) || data.projects.length === 0) return;
  var escapeHtml = window.__utils.escapeHtml;
  var safeUrl = window.__utils.safeUrl;

  var contact = document.getElementById('contact');
  if (!contact || document.getElementById('projects')) return;

  function labelForTheme() {
    var firstNav = document.querySelector('.nav-links a');
    var text = firstNav ? firstNav.textContent.trim() : '';
    if (text.indexOf('./') === 0) return './projects';
    if (/連絡|作品|映画/.test(document.body.textContent)) return '制作';
    if (text === text.toUpperCase() && /[A-Z]/.test(text)) return 'PROJECTS';
    return 'Projects';
  }

  function titleForTheme() {
    var firstNav = document.querySelector('.nav-links a');
    var text = firstNav ? firstNav.textContent.trim() : '';
    if (text.indexOf('./') === 0) return '$ ls ~/projects';
    if (/連絡|作品|映画/.test(document.body.textContent)) return '制作物';
    if (text === text.toUpperCase() && /[A-Z]/.test(text)) return 'PROJECTS';
    return 'Projects';
  }

  function subtitleForTheme() {
    var firstNav = document.querySelector('.nav-links a');
    var text = firstNav ? firstNav.textContent.trim() : '';
    if (text.indexOf('./') === 0) return '// ── projects ──';
    if (/連絡|作品|映画/.test(document.body.textContent)) return 'これまで作ったサイト';
    if (text === text.toUpperCase() && /[A-Z]/.test(text)) return 'BUILT SITES';
    return 'Built sites';
  }

  function projectCard(project, index) {
    var tags = Array.isArray(project.tags) ? project.tags : [];
    return '<article class="project-card reveal">' +
      '<p class="project-index">' + String(index + 1).padStart(2, '0') + '</p>' +
      '<h3><a href="' + escapeHtml(safeUrl(project.url)) + '" target="_blank" rel="noopener">' +
      escapeHtml(project.name) + '</a></h3>' +
      '<p>' + escapeHtml(project.description || project.url) + '</p>' +
      '<div class="project-tags">' + tags.map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('') + '</div>' +
    '</article>';
  }

  var navLinks = document.querySelector('.nav-links');
  if (navLinks && !navLinks.querySelector('a[href="#projects"]')) {
    var item = document.createElement('li');
    item.innerHTML = '<a href="#projects">' + escapeHtml(labelForTheme()) + '</a>';
    var contactLink = navLinks.querySelector('a[href="#contact"]');
    if (contactLink && contactLink.parentElement) {
      navLinks.insertBefore(item, contactLink.parentElement);
    } else {
      navLinks.appendChild(item);
    }
  }

  var section = document.createElement('section');
  section.className = 'section project-section';
  section.id = 'projects';
  section.innerHTML =
    '<div class="container project-container">' +
      '<p class="project-kicker reveal">' + escapeHtml(subtitleForTheme()) + '</p>' +
      '<h2 class="project-title reveal">' + escapeHtml(titleForTheme()) + '</h2>' +
      '<div class="project-grid">' + data.projects.map(projectCard).join('') + '</div>' +
    '</div>';

  contact.parentNode.insertBefore(section, contact);
})();
