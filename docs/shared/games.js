/**
 * shared/games.js
 * Injects the currently-played games section before Anime.
 */
(function () {
  'use strict';

  var data = window.__data;
  if (!data || !Array.isArray(data.games) || data.games.length === 0) return;
  var escapeHtml = window.__utils.escapeHtml;

  var anime = document.getElementById('anime');
  if (!anime || document.getElementById('games')) return;

  function themeMode() {
    var firstNav = document.querySelector('.nav-links a');
    var text = firstNav ? firstNav.textContent.trim() : '';
    if (text.indexOf('./') === 0) return 'terminal';
    if (/連絡|作品|映画/.test(document.body.textContent)) return 'jp';
    if (text === text.toUpperCase() && /[A-Z]/.test(text)) return 'caps';
    return 'default';
  }

  function copy() {
    var mode = themeMode();
    if (mode === 'terminal') {
      return { nav: './games', kicker: 'Now Playing', title: '$ ls ~/games' };
    }
    if (mode === 'jp') {
      return { nav: 'ゲーム', kicker: 'Now Playing', title: 'Games' };
    }
    if (mode === 'caps') {
      return { nav: 'GAMES', kicker: 'Now Playing', title: 'GAMES' };
    }
    return { nav: 'Games', kicker: 'Now Playing', title: 'Games' };
  }

  function gameCard(game, index) {
    var tags = Array.isArray(game.tags) ? game.tags : [];
    return '<article class="game-card reveal">' +
      '<p class="game-index">' + String(index + 1).padStart(2, '0') + ' / ' + escapeHtml(game.status || 'Now Playing') + '</p>' +
      '<h3>' + escapeHtml(game.title) + '</h3>' +
      '<p>' + escapeHtml(game.comment) + '</p>' +
      '<div class="game-tags">' + tags.map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('') + '</div>' +
    '</article>';
  }

  var labels = copy();
  var navLinks = document.querySelector('.nav-links');
  if (navLinks && !navLinks.querySelector('a[href="#games"]')) {
    var item = document.createElement('li');
    item.innerHTML = '<a href="#games">' + escapeHtml(labels.nav) + '</a>';
    var animeLink = navLinks.querySelector('a[href="#anime"]');
    if (animeLink && animeLink.parentElement) {
      navLinks.insertBefore(item, animeLink.parentElement);
    } else {
      navLinks.appendChild(item);
    }
  }

  var section = document.createElement('section');
  section.className = 'section game-section';
  section.id = 'games';
  section.innerHTML =
    '<div class="container game-container">' +
      '<p class="game-kicker reveal">' + escapeHtml(labels.kicker) + '</p>' +
      '<h2 class="game-title reveal">' + escapeHtml(labels.title) + '</h2>' +
      '<div class="game-grid">' + data.games.map(gameCard).join('') + '</div>' +
    '</div>';

  anime.parentNode.insertBefore(section, anime);
})();
