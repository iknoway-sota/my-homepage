/* Y2K — data rendering for a hand-made personal homepage */
(function () {
  'use strict';
  var d = window.__data; if (!d) return;
  var escapeHtml = window.__utils.escapeHtml;
  var safeUrl = window.__utils.safeUrl;
  document.getElementById('hero-name').textContent = d.profile.name;
  document.getElementById('hero-role').textContent = d.profile.role;
  document.getElementById('hero-tagline').innerHTML = escapeHtml(d.profile.tagline).replace(/\n/g, '<br>');
  document.getElementById('about-paragraphs').innerHTML = d.profile.about.map(function (t) { return '<p>' + escapeHtml(t) + '</p>'; }).join('');
  document.getElementById('about-facts').innerHTML = d.profile.facts.map(function (f) { return '<tr><th>' + escapeHtml(f.label) + '</th><td>' + escapeHtml(f.value) + '</td></tr>'; }).join('');
  var traits = document.getElementById('about-traits'); if (traits && d.profile.traits) traits.innerHTML = d.profile.traits.map(function (t) { return '<span>[' + escapeHtml(t) + ']</span>'; }).join('');
  function renderBookmarks(id, items) { document.getElementById(id).innerHTML = items.map(function (item, i) { return '<article class="bookmark-row reveal"><span class="bookmark-num">' + String(i + 1).padStart(2, '0') + '.</span><div><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.comment) + '</p><p class="bookmark-tags">' + item.tags.map(escapeHtml).join(' / ') + '</p></div></article>'; }).join(''); }
  renderBookmarks('anime-grid', d.anime); renderBookmarks('movies-grid', d.movies);
  document.getElementById('contact-message').textContent = d.contact.message;
  document.getElementById('contact-social').innerHTML = d.social.map(function (s) { return '<a href="' + escapeHtml(safeUrl(s.url)) + '" target="_blank" rel="noopener">[' + escapeHtml(s.name) + ']</a>'; }).join('');
  document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
}());
