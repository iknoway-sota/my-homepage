/* WINDOWS XP — data rendering and taskbar state */
(function () {
  'use strict';
  var d = window.__data;
  if (!d) return;
  var escapeHtml = window.__utils.escapeHtml;
  var safeUrl = window.__utils.safeUrl;
  document.getElementById('hero-name').textContent = d.profile.name;
  document.getElementById('hero-role').textContent = d.profile.role;
  document.getElementById('hero-tagline').innerHTML = escapeHtml(d.profile.tagline).replace(/\n/g, '<br>');
  document.getElementById('about-paragraphs').innerHTML = d.profile.about.map(function (t) { return '<p>' + escapeHtml(t) + '</p>'; }).join('');
  document.getElementById('about-facts').innerHTML = d.profile.facts.map(function (f) { return '<tr><th>' + escapeHtml(f.label) + '</th><td>' + escapeHtml(f.value) + '</td></tr>'; }).join('');
  var traits = document.getElementById('about-traits');
  if (traits && d.profile.traits) traits.innerHTML = d.profile.traits.map(function (t) { return '<span>' + escapeHtml(t) + '</span>'; }).join('');
  function renderList(id, items) {
    document.getElementById(id).innerHTML = items.map(function (item, i) {
      return '<article class="file-row reveal"><h3><b>' + String(i + 1).padStart(2, '0') + '</b>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.comment) + '</p><div class="file-tags">' + item.tags.map(function (tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join('') + '</div></article>';
    }).join('');
  }
  renderList('anime-grid', d.anime); renderList('movies-grid', d.movies);
  document.getElementById('contact-message').textContent = d.contact.message;
  document.getElementById('contact-social').innerHTML = d.social.map(function (s) { return '<a href="' + escapeHtml(safeUrl(s.url)) + '" target="_blank" rel="noopener">' + escapeHtml(s.name) + '</a>'; }).join('');

  var clock = document.createElement('span'); clock.className = 'xp-clock'; document.querySelector('.nav-inner').appendChild(clock);
  function tick() { var now = new Date(); clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
  tick(); setInterval(tick, 30000);
  document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  var links = document.querySelectorAll('.nav-links a');
  var observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id); }); }); }, { threshold: .35 });
  document.querySelectorAll('section[id]').forEach(function (section) { observer.observe(section); });
}());
