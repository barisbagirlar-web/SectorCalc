#!/usr/bin/env node
/**
 * FAIL the build if any page hand-writes a core asset link outside the SSOT markers,
 * or if a public HTML page is missing the hashed head-assets block from the manifest.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const START = '<!--SC-HEAD-ASSETS-START-->';
const END = '<!--SC-HEAD-ASSETS-END-->';
const MANIFEST = join(ROOT, 'seo/asset-manifest.json');

const SKIP_DIR = new Set([
  'node_modules',
  'dist',
  '.git',
  'functions',
  'coverage',
  'audit',
  'content',
  'seo',
  'tests',
  'src',
]);

const SKIP_FILE = new Set([
  'calculator.html',
  'calculator2.html',
  'calculator3.html',
  'calculator4.html',
]);

const BANNED = [
  /<link[^>]+href=["'][^"']*sc-theme(?:\.[a-f0-9]{8})?\.css/,
  /<link[^>]+href=["'][^"']*sc-site-nav(?:\.[a-f0-9]{8})?\.css/,
  /<link[^>]+href=["'][^"']*sc-calc-sheet(?:\.[a-f0-9]{8})?\.css/,
  /<link[^>]+href=["'][^"']*seo-content(?:\.[a-f0-9]{8})?\.css/,
  /<script[^>]+src=["'][^"']*sc-theme(?:\.[a-f0-9]{8})?\.js/,
  /<script[^>]+src=["'][^"']*sc-site-nav(?:\.[a-f0-9]{8})?\.js/,
];

function walkHtml(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (SKIP_DIR.has(name)) continue;
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) {
      walkHtml(abs, out);
      continue;
    }
    if (!name.endsWith('.html')) continue;
    if (SKIP_FILE.has(name) && dir === ROOT) continue;
    out.push(abs);
  }
  return out;
}

function outsideMarkers(html) {
  return html.replace(new RegExp(`${START}[\\s\\S]*?${END}`, 'g'), '');
}

if (!existsSync(MANIFEST)) {
  console.error('HEAD SSOT VIOLATION: missing seo/asset-manifest.json — run hash-head-assets first');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const REQUIRED = Object.values(manifest.files).map((f) => f.href.replace(/^\//, ''));

const pages = [
  ...walkHtml(ROOT).filter((f) => relative(ROOT, f).split(/[\\/]/).length === 1),
  ...walkHtml(join(ROOT, 'public')),
].filter((f) => /<head[\s>]/i.test(readFileSync(f, 'utf8')));

const bad = [];
for (const f of pages) {
  const rel = relative(ROOT, f);
  const s = readFileSync(f, 'utf8');
  if (!s.includes(START) || !s.includes(END)) {
    bad.push(`${rel} :: missing SC-HEAD-ASSETS markers`);
    continue;
  }
  const block = s.slice(s.indexOf(START), s.indexOf(END) + END.length);
  if (/\?v=\d+/.test(block)) {
    bad.push(`${rel} :: head-assets still uses manual ?v= pins (content-hash required)`);
  }
  for (const need of REQUIRED) {
    if (!block.includes(need)) bad.push(`${rel} :: head-assets missing ${need}`);
  }
  const rest = outsideMarkers(s);
  for (const re of BANNED) {
    if (re.test(rest)) bad.push(`${rel} :: hand-written core asset outside SSOT :: ${re}`);
  }
}

if (bad.length) {
  console.error('HEAD SSOT VIOLATION:\n' + bad.join('\n'));
  process.exit(1);
}
console.log(`guard:head-ssot PASS (${pages.length} pages, hashed SSOT)`);
