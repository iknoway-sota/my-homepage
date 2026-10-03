(function () {
  'use strict';
  var data = window.__data;
  if (!data) return;
  var escapeHtml = window.__utils.escapeHtml;
  var safeUrl = window.__utils.safeUrl;

  document.getElementById('hero-name').textContent = data.profile.name;
  document.getElementById('hero-role').textContent = data.profile.role;
  document.getElementById('hero-tagline').innerHTML = escapeHtml(data.profile.tagline).replace(/\n/g, '<br>');
  document.getElementById('pull-quote').textContent = data.profile.tagline.split('\n')[0];
  document.getElementById('about-content').innerHTML = data.profile.about.map(function (text) {
    return '<p>' + escapeHtml(text) + '</p>';
  }).join('');
  document.getElementById('about-facts').innerHTML = data.profile.facts.map(function (fact) {
    return '<div><dt>' + escapeHtml(fact.label) + '</dt><dd>' + escapeHtml(fact.value) + '</dd></div>';
  }).join('');

  function renderIndex(id, items) {
    document.getElementById(id).innerHTML = items.map(function (item, index) {
      var feature = index === 0 ? ' feature' : '';
      return '<article class="editorial-item' + feature + '"><p class="item-no">' + String(index + 1).padStart(2, '0') + '</p>' +
        '<div><h3>' + escapeHtml(item.title) + '</h3><p class="item-copy">' + escapeHtml(item.comment) + '</p></div>' +
        '<p class="item-tags">' + item.tags.map(escapeHtml).join(' / ') + '</p></article>';
    }).join('');
  }

  renderIndex('anime-list', data.anime);
  renderIndex('movies-list', data.movies);
  document.getElementById('contact-message').textContent = data.contact.message;
  document.getElementById('contact-social').innerHTML = data.social.map(function (social) {
    return '<a href="' + escapeHtml(safeUrl(social.url)) + '" target="_blank" rel="noopener">' + escapeHtml(social.name) + '</a>';
  }).join('');
}());
