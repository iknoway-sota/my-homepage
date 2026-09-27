/**
 * theme-router.js — Theme selection logic
 *
 * Normal visit:   picks a random theme, stores it in localStorage
 *                 so the preferred theme survives future visits.
 * Auto gacha:     when enabled, picks a different theme on every visit.
 * ?switch=1:      clears the stored theme, forces a DIFFERENT theme,
 *                 used by every "Switch / Gacha" button on the site.
 * ?theme=classy:  dev override – forces a specific theme.
 */

const THEMES = [
  { id: 'classy',     path: 'themes/classy/index.html',     weight: 1 },
  { id: 'cyber',      path: 'themes/cyber/index.html',      weight: 1 },
  { id: 'anime',      path: 'themes/anime/index.html',      weight: 1 },
  { id: 'y2k',        path: 'themes/y2k/index.html',        weight: 1 },
  { id: 'terminal',   path: 'themes/terminal/index.html',   weight: 1 },
  { id: 'magazine',   path: 'themes/magazine/index.html',   weight: 1 },
  { id: 'kawaii',     path: 'themes/kawaii/index.html',      weight: 1 },
  { id: 'brutalist',  path: 'themes/brutalist/index.html',  weight: 1 },
  { id: 'vaporwave',  path: 'themes/vaporwave/index.html',  weight: 1 },
  { id: 'zen',        path: 'themes/zen/index.html',        weight: 1 },
  { id: 'space',      path: 'themes/space/index.html',      weight: 1 },
  { id: 'newspaper',  path: 'themes/newspaper/index.html',  weight: 1 },
  { id: 'apple',      path: 'themes/apple/index.html',      weight: 1 },
  { id: 'fantasy-book', path: 'themes/fantasy-book/index.html', weight: 1 },
  { id: 'winxp',      path: 'themes/winxp/index.html',      weight: 1 },
  { id: 'data-js',    path: 'themes/data-js/index.html',    weight: 1 },
  { id: 'ukiyo-e',    path: 'themes/ukiyo-e/index.html',    weight: 1 },
  { id: 'gothic',     path: 'themes/gothic/index.html',     weight: 1 },
  { id: 'handheld',   path: 'themes/handheld/index.html',   weight: 1 },
];

/** Weighted random selection from a list of themes. */
function pickTheme(themes) {
  const total = themes.reduce((s, t) => s + t.weight, 0);
  let rand = Math.random() * total;
  for (const t of themes) {
    rand -= t.weight;
    if (rand <= 0) return t;
  }
  return themes[themes.length - 1];
}

/**
 * Resolve which theme to show.
 *
 * Priority order:
 *  1. ?switch=1   → force-pick a DIFFERENT theme, persist it
 *  2. ?theme=xxx  → explicit theme choice, persist it
 *  3. auto gacha enabled → pick a DIFFERENT theme, persist it
 *  4. localStorage hit → return the saved theme
 *  5. random pick
 */
function resolveTheme() {
  const params = new URLSearchParams(window.location.search);

  function getSavedTheme() {
    try { return localStorage.getItem('selectedTheme'); } catch { return null; }
  }

  function saveTheme(id) {
    try { localStorage.setItem('selectedTheme', id); } catch {}
  }

  function isAutoGachaEnabled() {
    try { return localStorage.getItem('randomThemeOnReload') === 'true'; } catch { return false; }
  }

  function pickDifferentTheme(current) {
    const pool = current ? THEMES.filter(t => t.id !== current) : THEMES;
    return pickTheme(pool.length ? pool : THEMES);
  }

  // ── Switch (Gacha) button was clicked ──────────────────
  if (params.get('switch') === '1') {
    // Strip param from URL so back/refresh doesn't keep re-rolling
    params.delete('switch');
    const clean = location.pathname + (params.toString() ? '?' + params.toString() : '');
    history.replaceState(null, '', clean);

    const current = getSavedTheme();

    // Pick a theme that is DIFFERENT from the current one
    const chosen = pickDifferentTheme(current);
    saveTheme(chosen.id);
    return chosen;
  }

  // ── Explicit choice (?theme=classy etc.) ───────────────
  const override = params.get('theme');
  if (override) {
    const found = THEMES.find(t => t.id === override);
    if (found) {
      saveTheme(found.id);
      return found;
    }
  }

  // ── Auto gacha: pick a different theme on each visit ────
  if (isAutoGachaEnabled()) {
    const chosen = pickDifferentTheme(getSavedTheme());
    saveTheme(chosen.id);
    return chosen;
  }

  // ── Saved preference: return the already-chosen theme ──
  const stored = getSavedTheme();
  if (stored) {
    const found = THEMES.find(t => t.id === stored);
    if (found) return found;
  }

  // ── Fresh random pick ──────────────────────────────────
  const chosen = pickTheme(THEMES);
  saveTheme(chosen.id);
  return chosen;
}

// ── Entry point ──────────────────────────────────────────
(function () {
  const theme = resolveTheme();
  setTimeout(() => window.location.replace(theme.path), 300);
})();
