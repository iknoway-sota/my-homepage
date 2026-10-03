(function () {
  'use strict';
  var d = window.__data;
  if (!d) return;
  var escapeHtml = window.__utils.escapeHtml;
  var safeUrl = window.__utils.safeUrl;
  document.getElementById('hero-name').textContent = d.profile.name;
  document.getElementById('hero-role').textContent = d.profile.roleJp;
  document.getElementById('hero-tagline').innerHTML = escapeHtml(d.profile.tagline).replace(/\n/g, '<br>');
  document.getElementById('about-paragraphs').innerHTML = d.profile.about.map(function (t) { return '<p>' + escapeHtml(t) + '</p>'; }).join('');
  document.getElementById('about-facts').innerHTML = d.profile.facts.map(function (f) { return '<li><b>' + escapeHtml(f.label) + '</b><span>' + escapeHtml(f.value) + '</span></li>'; }).join('');
  function list(id, items) { document.getElementById(id).innerHTML = items.map(function (x, i) { return '<article class="print-entry reveal"><span class="number">' + String(i + 1).padStart(2, '0') + '</span><h3>' + escapeHtml(x.title) + '</h3><p>' + escapeHtml(x.comment) + '</p><div class="tags">' + x.tags.map(function (t) { return '<span>' + escapeHtml(t) + '</span>'; }).join('') + '</div></article>'; }).join(''); }
  list('anime-grid', d.anime); list('movies-grid', d.movies);
  document.getElementById('contact-message').textContent = d.contact.message;
  document.getElementById('contact-social').innerHTML = d.social.map(function (s) { return '<a href="' + escapeHtml(safeUrl(s.url)) + '" target="_blank" rel="noopener">' + escapeHtml(s.name) + '</a>'; }).join('');
}());
