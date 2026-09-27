/**
 * shared/utils.js
 * Utility functions available to all themes.
 */

/* ── DOM helpers ──────────────────────────────────────────── */

/**
 * Shorthand querySelector.
 * @param {string} sel
 * @param {Element} [ctx=document]
 */
const $ = (sel, ctx = document) => ctx.querySelector(sel);

/**
 * Shorthand querySelectorAll → Array.
 * @param {string} sel
 * @param {Element} [ctx=document]
 */
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── Math helpers ─────────────────────────────────────────── */

/** Linear interpolation */
const lerp = (a, b, t) => a + (b - a) * t;

/** Clamp a value between min and max */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/** Map a value from one range to another */
const mapRange = (val, inMin, inMax, outMin, outMax) =>
  ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;

/* ── Throttle ─────────────────────────────────────────────── */
/**
 * Returns a throttled version of fn that fires at most once per `ms`.
 * @param {Function} fn
 * @param {number} ms
 */
function throttle(fn, ms) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/* ── Debounce ─────────────────────────────────────────────── */
/**
 * Returns a debounced version of fn that fires after `ms` of silence.
 * @param {Function} fn
 * @param {number} ms
 */
function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

/* ── Storage helpers ─────────────────────────────────────── */

/** Safe localStorage get (returns null on error / SSR) */
const getLocal = (key) => {
  try { return localStorage.getItem(key); } catch { return null; }
};

/** Safe localStorage set */
const setLocal = (key, val) => {
  try { localStorage.setItem(key, val); } catch {}
};

/* ── Accessibility ────────────────────────────────────────── */

/** Trap focus inside `container` (for modals/dialogs). */
function trapFocus(container) {
  const focusable = container.querySelectorAll(
    'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

/* ── Misc ─────────────────────────────────────────────────── */

/** Copy text to clipboard. Returns a Promise<boolean>. */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Detect if the user prefers reduced motion. */
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Shared site chrome ─────────────────────────────────── */

function currentThemeId() {
  var match = window.location.pathname.match(/\/themes\/([^/]+)\//);
  return match ? match[1] : '';
}

function isAutoGachaEnabled() {
  return getLocal('randomThemeOnReload') === 'true';
}

function setAutoGachaEnabled(enabled) {
  setLocal('randomThemeOnReload', enabled ? 'true' : 'false');
}

function wasReloaded() {
  var entries = performance.getEntriesByType && performance.getEntriesByType('navigation');
  if (entries && entries[0]) return entries[0].type === 'reload';
  return performance.navigation && performance.navigation.type === performance.navigation.TYPE_RELOAD;
}

function addAutoGachaToggle() {
  var switchControl = document.querySelector('.nav-switch, .theme-switch');
  if (!switchControl || switchControl.parentElement.querySelector('.theme-auto-toggle')) return;

  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'theme-auto-toggle';

  function renderToggle() {
    var enabled = isAutoGachaEnabled();
    toggle.textContent = '自動 ' + (enabled ? 'ON' : 'OFF');
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.setAttribute('aria-label', enabled
      ? '自動テーマガチャをオフにする'
      : '再読み込み時にテーマを引き直す自動テーマガチャをオンにする');
    toggle.title = enabled
      ? '自動テーマガチャ: オン（再読み込み時に別のテーマを引きます）'
      : '自動テーマガチャ: オフ';
  }

  toggle.addEventListener('click', function () {
    setAutoGachaEnabled(!isAutoGachaEnabled());
    renderToggle();
  });

  renderToggle();
  switchControl.insertAdjacentElement('afterend', toggle);

  if (isAutoGachaEnabled() && wasReloaded()) {
    window.location.replace('../../index.html');
  }
}

function polishSharedChrome() {
  var themeId = currentThemeId();
  document.querySelectorAll('a[href*="switch=1"]').forEach(function (link) {
    var label = themeId
      ? 'テーマを切り替える（現在: ' + themeId + '／選択は次回も保存）'
      : 'テーマを切り替える（選択は次回も保存）';
    link.setAttribute('aria-label', label);
    link.setAttribute('title', label);
    link.textContent = 'テーマ変更';
  });

  var footer = document.querySelector('footer');
  var updatedAt = window.__data && window.__data.site && window.__data.site.updatedAt;
  if (footer && updatedAt && !footer.querySelector('.site-updated')) {
    var updated = document.createElement('small');
    updated.className = 'site-updated';
    updated.textContent = '最終更新 ' + updatedAt;
    footer.appendChild(updated);
  }

  var hero = document.querySelector('.hero');
  if (hero && !document.querySelector('.site-map-strip')) {
    var destinations = [
      { id: 'about', label: '自己紹介' },
      { id: 'games', label: 'ゲーム' },
      { id: 'anime', label: 'アニメ' },
      { id: 'movies', label: '映画' },
      { id: 'projects', label: '制作' },
      { id: 'contact', label: '連絡' },
    ].filter(function (item) {
      return document.getElementById(item.id);
    });

    if (destinations.length) {
      var siteMap = document.createElement('nav');
      siteMap.className = 'site-map-strip';
      siteMap.setAttribute('aria-label', 'このサイトにあるもの');
      siteMap.innerHTML = '<span class="site-map-label">このサイトにあるもの</span><ul>' +
        destinations.map(function (item) {
          return '<li><a href="#' + item.id + '">' + item.label + '</a></li>';
        }).join('') +
        '</ul>';
      hero.insertAdjacentElement('afterend', siteMap);
    }
  }

  addAutoGachaToggle();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', polishSharedChrome, { once: true });
} else {
  polishSharedChrome();
}

// Export as globals for use by theme scripts (no bundler required)
window.__utils = {
  $, $$,
  lerp, clamp, mapRange,
  throttle, debounce,
  getLocal, setLocal,
  trapFocus, copyToClipboard, prefersReducedMotion,
};
