/* ============================================================
   DATA.JS THEME - source loader
   ============================================================ */

(function () {
  'use strict';

  var target = document.getElementById('data-source');
  if (!target) return;
  var escapeHtml = window.__utils.escapeHtml;

  function renderSource(source) {
    target.innerHTML = source.split('\n').map(function (line) {
      return '<span class="code-line"><span>' + escapeHtml(line) + '</span></span>';
    }).join('');
  }

  fetch('../../shared/data.js', { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('Failed to load data.js');
      return response.text();
    })
    .then(renderSource)
    .catch(function () {
      renderSource('Unable to load ../../shared/data.js\\nRun through a local server instead of opening this file directly.');
    });

  var header = document.getElementById('site-header');
  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
})();
