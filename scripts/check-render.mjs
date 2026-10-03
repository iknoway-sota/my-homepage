#!/usr/bin/env node
/**
 * Compare each theme's data-rendered text and element count with HEAD.
 * This intentionally uses a small DOM recorder rather than a dependency: the
 * site has no package manager or build step.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const themesDir = join(root, 'docs/themes');
const themeNames = readdirSync(themesDir).filter((name) => {
  try { return readFileSync(join(themesDir, name, 'script.js')); } catch { return false; }
});

function fromHead(file) {
  return execFileSync('git', ['show', `HEAD:${file}`], { cwd: root, encoding: 'utf8' });
}

function decodeHtml(value) {
  return value.replace(/&#(\d+);|&#x([\da-f]+);|&(amp|lt|gt|quot|#39);/gi, (_, decimal, hex, named) => {
    if (decimal) return String.fromCodePoint(Number(decimal));
    if (hex) return String.fromCodePoint(Number.parseInt(hex, 16));
    return { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" }[named.toLowerCase()];
  });
}

function htmlSummary(html) {
  return {
    elements: (html.match(/<[a-z][\w:-]*(?=\s|\/?>)/gi) || []).length,
    text: decodeHtml(html.replace(/<[^>]*>/g, '')),
  };
}

function createRecorder(html) {
  const nodes = [];
  class Element {
    constructor(id = '') {
      this.id = id;
      this.dataset = {};
      this.style = {};
      this.classList = { add() {}, remove() {}, toggle() {}, contains() { return false; } };
      this.parentNode = { insertBefore() {} };
      this.parentElement = { querySelector() { return null; } };
      this.children = [];
      nodes.push(this);
    }
    set innerHTML(value) { this._innerHTML = String(value); }
    get innerHTML() { return this._innerHTML || ''; }
    set textContent(value) { this._textContent = String(value); }
    get textContent() { return this._textContent || htmlSummary(this.innerHTML).text; }
    setAttribute() {}
    getAttribute() { return null; }
    appendChild(child) { this.children.push(child); return child; }
    append() {}
    insertAdjacentElement() {}
    insertAdjacentHTML(_, value) { this.innerHTML += String(value); }
    addEventListener() {}
    querySelector() { return null; }
    querySelectorAll() { return []; }
    closest() { return null; }
  }

  const byId = new Map();
  for (const match of html.matchAll(/\bid=["']([^"']+)["']/g)) byId.set(match[1], new Element(match[1]));
  const document = {
    readyState: 'complete',
    body: new Element('body'),
    getElementById(id) { return byId.get(id) || null; },
    createElement() { return new Element(); },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    addEventListener() {},
  };
  return { document, nodes };
}

async function render(theme, script) {
  const html = readFileSync(join(themesDir, theme, 'index.html'), 'utf8');
  const recorder = createRecorder(html);
  const window = {
    document: recorder.document,
    location: { pathname: `/themes/${theme}/`, hash: '' },
    __utils: {},
    addEventListener() {},
    setTimeout() { return 0; },
    matchMedia() { return { matches: true }; },
  };
  const context = vm.createContext({
    window, document: recorder.document, console: { log() {}, warn() {}, error() {} },
    performance: { getEntriesByType() { return []; }, now() { return 0; } },
    localStorage: { getItem() { return null; }, setItem() {} }, navigator: { clipboard: {} },
    requestAnimationFrame() {}, setTimeout() { return 0; }, clearTimeout() {},
    IntersectionObserver: class { observe() {} unobserve() {} }, CSS: { supports() { return true; } },
    fetch() { return Promise.reject(new Error('not needed for snapshot')); },
    history: { replaceState() {} }, Array, String, Number, Math, Date, Set,
  });
  vm.runInContext(readFileSync(join(root, 'docs/shared/data.js'), 'utf8'), context);
  vm.runInContext(readFileSync(join(root, 'docs/shared/utils.js'), 'utf8'), context);
  try { vm.runInContext(script, context); } catch { /* Browser-only interaction after render. */ }
  await Promise.resolve();
  return recorder.nodes.map((node) => ({ ...htmlSummary(node.innerHTML), text: node.textContent }));
}

function unusualDataValues(value, path = 'window.__data', found = []) {
  if (typeof value === 'string') {
    if (/[<&]/.test(value)) found.push(path);
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => unusualDataValues(item, `${path}[${index}]`, found));
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => unusualDataValues(item, `${path}.${key}`, found));
  }
  return found;
}

let failed = false;
for (const theme of themeNames) {
  const file = `docs/themes/${theme}/script.js`;
  const [before, after] = await Promise.all([
    render(theme, fromHead(file)),
    render(theme, readFileSync(join(root, file), 'utf8')),
  ]);
  const same = JSON.stringify(before) === JSON.stringify(after);
  console.log(`${same ? 'OK' : 'DIFF'} ${theme}`);
  failed ||= !same;
}

const dataContext = vm.createContext({ window: {} });
vm.runInContext(readFileSync(join(root, 'docs/shared/data.js'), 'utf8'), dataContext);
const unusual = unusualDataValues(dataContext.window.__data);
console.log(`HTML-or-ampersand data values: ${unusual.length ? unusual.join(', ') : 'none'}`);

const utilsWindow = { matchMedia() { return { matches: true }; } };
const utilsContext = vm.createContext({
  window: utilsWindow,
  document: { readyState: 'loading', addEventListener() {} },
  localStorage: { getItem() { return null; }, setItem() {} },
  navigator: { clipboard: {} }, performance: { getEntriesByType() { return []; } },
});
vm.runInContext(readFileSync(join(root, 'docs/shared/utils.js'), 'utf8'), utilsContext);
const safeUrlCases = [
  ['https://example.com', 'https://example.com'],
  ['mailto:hello@example.com', 'mailto:hello@example.com'],
  ['../themes/anime/', '../themes/anime/'],
  ['javascript:alert(1)', '#'],
  ['data:text/html,test', '#'],
  ['//example.com', '#'],
];
for (const [input, expected] of safeUrlCases) {
  const actual = utilsWindow.__utils.safeUrl(input);
  const ok = actual === expected;
  console.log(`${ok ? 'OK' : 'DIFF'} safeUrl ${input}`);
  failed ||= !ok;
}
process.exitCode = failed ? 1 : 0;
