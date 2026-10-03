/* ============================================================
   FANTASY BOOK THEME - script.js
   ============================================================ */

(function () {
  'use strict';

  var data = window.__data;
  var book = document.getElementById('book');
  var indicator = document.getElementById('page-indicator');
  var nextSheet = document.getElementById('turn-next');
  var prevSheet = document.getElementById('turn-prev');
  var navButtons = Array.from(document.querySelectorAll('[data-page]'));
  var current = 0;
  var isTurning = false;
  var wheelDebt = 0;
  var wheelTimer = null;

  if (!data || !book) return;
  var escapeHtml = window.__utils.escapeHtml;
  var safeUrl = window.__utils.safeUrl;

  function tagList(tags) {
    return '<div class="rune-tags">' + tags.map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('') + '</div>';
  }

  function workEntry(item, index) {
    return '<article class="entry">' +
      '<p class="entry-index">No. ' + String(index + 1).padStart(2, '0') + '</p>' +
      '<h3>' + escapeHtml(item.title) + '</h3>' +
      '<p>' + escapeHtml(item.comment) + '</p>' +
      tagList(item.tags) +
    '</article>';
  }

  function gameEntry(item, index) {
    return '<article class="entry">' +
      '<p class="entry-index">' + escapeHtml(item.status || 'Now Playing') + ' ' + String(index + 1).padStart(2, '0') + '</p>' +
      '<h3>' + escapeHtml(item.title) + '</h3>' +
      '<p>' + escapeHtml(item.comment) + '</p>' +
      tagList(item.tags || []) +
    '</article>';
  }

  function projectEntry(item, index) {
    return '<article class="entry">' +
      '<p class="entry-index">Artifact ' + String(index + 1).padStart(2, '0') + '</p>' +
      '<h3><a href="' + escapeHtml(safeUrl(item.url)) + '" target="_blank" rel="noopener">' +
      escapeHtml(item.name) + '</a></h3>' +
      '<p>' + escapeHtml(item.description || item.url) + '</p>' +
      tagList(item.tags || []) +
    '</article>';
  }

  function statEntry(item) {
    return '<div><strong>' + escapeHtml(item.count) + escapeHtml(item.unit) + '</strong><span>' +
      escapeHtml(item.label) + '</span></div>';
  }

  function profileFacts() {
    return data.profile.facts.map(function (fact) {
      return '<div class="fact-stone"><span>' + escapeHtml(fact.label) + '</span><strong>' +
        escapeHtml(fact.value) + '</strong></div>';
    }).join('');
  }

  function traitRunes() {
    return '<div class="trait-runes">' + data.profile.traits.map(function (trait) {
      return '<span>' + escapeHtml(trait) + '</span>';
    }).join('') + '</div>';
  }

  function socialLinks() {
    return data.social.map(function (social) {
      return '<a href="' + escapeHtml(safeUrl(social.url)) + '" target="_blank" rel="noopener" aria-label="' +
        escapeHtml(social.name) + '">' +
        '<span>' + escapeHtml(social.name) + '</span></a>';
    }).join('');
  }

  function spread(id, chapter, left, right) {
    return '<section class="spread" id="' + id + '" data-chapter="' + escapeHtml(chapter) + '">' +
      '<article class="page page-left">' + left + '</article>' +
      '<article class="page page-right">' + right + '</article>' +
    '</section>';
  }

  function render() {
    document.getElementById('hero-name').textContent = data.profile.name;
    document.getElementById('hero-role').textContent = data.profile.role;
    document.getElementById('hero-tagline').innerHTML = escapeHtml(data.profile.tagline).replace(/\n/g, '<br>');
    document.getElementById('hero-stats').innerHTML = data.heroStats.map(statEntry).join('');

    var animeOne = data.anime.slice(0, 4);
    var animeTwo = data.anime.slice(4);
    var moviesOne = data.movies.slice(0, 3);
    var moviesTwo = data.movies.slice(3);

    var pages = [
      spread(
        'profile',
        'Profile',
        '<p class="chapter-kicker">Chapter I</p>' +
          data.profile.about.map(function (text) {
            return '<p class="body-copy">' + escapeHtml(text) + '</p>';
          }).join('') +
          '<blockquote>' + escapeHtml(data.profile.tagline.split('\n')[0]) + '</blockquote>',
        '<p class="chapter-kicker">Known Traits</p>' +
          '<div class="facts-grid">' + profileFacts() + '</div>' + traitRunes()
      ),
      spread(
        'games',
        'Games',
        '<p class="chapter-kicker">Chapter II</p>' +
          (data.games || []).slice(0, 1).map(gameEntry).join(''),
        '<p class="chapter-kicker">Party Log</p>' +
          (data.games || []).slice(1).map(function (item, index) { return gameEntry(item, index + 1); }).join('')
      ),
      spread(
        'anime-a',
        'Anime I',
        '<p class="chapter-kicker">Chapter III</p>' +
          animeOne.slice(0, 2).map(workEntry).join(''),
        '<p class="chapter-kicker">Continued</p>' +
          animeOne.slice(2).map(function (item, index) { return workEntry(item, index + 2); }).join('')
      ),
      spread(
        'anime-b',
        'Anime II',
        '<p class="chapter-kicker">Chapter IV</p>' +
          animeTwo.slice(0, 2).map(function (item, index) { return workEntry(item, index + 4); }).join(''),
        '<p class="chapter-kicker">Appendix</p>' +
          animeTwo.slice(2, 3).map(function (item, index) { return workEntry(item, index + 6); }).join('')
      ),
      spread(
        'anime-c',
        'Anime III',
        '<p class="chapter-kicker">Chapter V</p>' +
          animeTwo.slice(3, 4).map(function (item, index) { return workEntry(item, index + 7); }).join(''),
        '<p class="chapter-kicker">Codex Close</p>' +
          animeTwo.slice(4).map(function (item, index) { return workEntry(item, index + 8); }).join('')
      ),
      spread(
        'movies-a',
        'Movies I',
        '<p class="chapter-kicker">Chapter VI</p>' +
          moviesOne.slice(0, 2).map(workEntry).join(''),
        '<p class="chapter-kicker">Silver Screen</p>' +
          moviesOne.slice(2).map(function (item, index) { return workEntry(item, index + 2); }).join('')
      ),
      spread(
        'movies-b',
        'Movies II',
        '<p class="chapter-kicker">Chapter VII</p>' +
          moviesTwo.slice(0, 2).map(function (item, index) { return workEntry(item, index + 3); }).join(''),
        '<p class="chapter-kicker">Final Reel</p>' +
          moviesTwo.slice(2).map(function (item, index) { return workEntry(item, index + 5); }).join('')
      ),
      spread(
        'projects',
        'Projects',
        '<p class="chapter-kicker">Chapter VIII</p>' +
          (data.projects || []).map(projectEntry).join(''),
        ''
      ),
      spread(
        'contact',
        'Contact',
        '<p class="chapter-kicker">Chapter IX</p>' +
          '<p class="body-copy body-copy-large">' + escapeHtml(data.contact.message) + '</p>' +
          '<a class="email-link" href="' + escapeHtml(safeUrl('mailto:' + data.contact.email)) + '">' +
          escapeHtml(data.contact.email) + '</a>',
        '<p class="chapter-kicker">Gateways</p>' +
          '<div class="social-links">' + socialLinks() + '</div>' +
          '<a href="../../index.html?switch=1" class="closing-switch">Draw Another Theme</a>'
      )
    ];

    book.insertAdjacentHTML('beforeend', pages.join(''));
  }

  function spreads() {
    return Array.from(document.querySelectorAll('.spread'));
  }

  function setActive(index) {
    var all = spreads();
    var max = all.length - 1;
    current = Math.max(0, Math.min(index, max));

    all.forEach(function (node, i) {
      node.classList.toggle('is-active', i === current);
      node.classList.toggle('is-before', i < current);
      node.classList.toggle('is-after', i > current);
    });

    navButtons.forEach(function (button) {
      button.classList.toggle('is-current', Number(button.dataset.page) === current);
    });

    document.querySelectorAll('[data-action="prev"]').forEach(function (button) {
      button.disabled = current === 0;
    });
    document.querySelectorAll('[data-action="next"]').forEach(function (button) {
      button.disabled = current === max;
    });
    indicator.textContent = 'Page ' + (current + 1) + ' / ' + (max + 1) + ' - ' + all[current].dataset.chapter;
    history.replaceState(null, '', '#' + all[current].id);
  }

  function turnTo(index, direction) {
    var all = spreads();
    var max = all.length - 1;
    var target = Math.max(0, Math.min(index, max));
    if (target === current || isTurning) return;

    isTurning = true;
    var sheet = direction === 'prev' ? prevSheet : nextSheet;
    if (sheet) {
      sheet.classList.remove('is-turning');
      sheet.offsetWidth;
      sheet.classList.add('is-turning');
    }

    document.body.classList.toggle('turning-prev', direction === 'prev');
    document.body.classList.toggle('turning-next', direction !== 'prev');

    window.setTimeout(function () {
      setActive(target);
    }, 260);

    window.setTimeout(function () {
      if (sheet) sheet.classList.remove('is-turning');
      document.body.classList.remove('turning-prev', 'turning-next');
      isTurning = false;
    }, 760);
  }

  function next() {
    turnTo(current + 1, 'next');
  }

  function prev() {
    turnTo(current - 1, 'prev');
  }

  function handleWheel(event) {
    event.preventDefault();
    if (isTurning) return;
    wheelDebt += event.deltaY || event.deltaX;
    clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(function () { wheelDebt = 0; }, 120);

    if (Math.abs(wheelDebt) < 70) return;
    if (wheelDebt > 0) next();
    if (wheelDebt < 0) prev();
    wheelDebt = 0;
  }

  function bind() {
    document.addEventListener('click', function (event) {
      var actionTarget = event.target.closest('[data-action]');
      if (actionTarget && !actionTarget.disabled) {
        event.preventDefault();
        if (actionTarget.dataset.action === 'next') next();
        if (actionTarget.dataset.action === 'prev') prev();
        return;
      }

      var pageTarget = event.target.closest('.page-left, .page-right');
      if (!pageTarget || !pageTarget.closest('.spread.is-active')) return;
      if (event.target.closest('a, button')) return;
      if (pageTarget.classList.contains('page-left')) prev();
      if (pageTarget.classList.contains('page-right')) next();
    });

    navButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var target = Number(button.dataset.page);
        turnTo(target, target < current ? 'prev' : 'next');
      });
    });

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', function (event) {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (['PageDown', 'ArrowRight', ' '].includes(event.key)) {
        event.preventDefault();
        next();
      }
      if (['PageUp', 'ArrowLeft', 'Backspace'].includes(event.key)) {
        event.preventDefault();
        prev();
      }
      if (event.key === 'Home') {
        event.preventDefault();
        turnTo(0, 'prev');
      }
      if (event.key === 'End') {
        event.preventDefault();
        turnTo(spreads().length - 1, 'next');
      }
    });
  }

  render();
  bind();

  var hashIndex = spreads().findIndex(function (node) {
    return '#' + node.id === window.location.hash;
  });
  setActive(hashIndex >= 0 ? hashIndex : 0);
})();
