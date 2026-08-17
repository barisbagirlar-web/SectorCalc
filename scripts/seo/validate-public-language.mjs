#!/usr/bin/env node
/**
 * Block Turkish / unintended non-English UI strings in public production HTML.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const errors = [];
const SKIP_DIR = new Set(['node_modules', 'dist', 'coverage', '.git', 'docs', 'functions']);

const TURKISH_UI = [
  /\bHesapla\b/,
  /\bKapat\b/,
  /\bGiriş\b/,
  /\bÇıkış\b/,
  /\bHesabım\b/,
  /\bFiyatlandırma\b/,
  /\bAraçlar\b/,
  /\bRehberler\b/,
  /\bSözlük\b/,
  /\bKaydet\b/,
  /\bYükle\b/,
  /\bLütfen\b/,
  /\bHata\b/,
  /\bUyarı\b/,
  /[çğıöşüÇĞİÖŞÜ]/,
];

const ALLOW = [
  /ISO|ASME|VDI|DIN|EN|ASTM|API|AWS/,
  /Ra\b|Rz\b|MPa\b|N·m|lbf/,
];

function walk(dir, acc) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIR.has(name)) continue;
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) walk(abs, acc);
    else if (name.endsWith('.html')) acc.push(abs);
  }
}

const files = [];
walk(join(ROOT), files);
const publicish = files.filter((f) => {
  const rel = relative(ROOT, f).replaceAll('\\', '/');
  return (
    /^(index|pricing|tools|pro|account|login|[a-z0-9-]+-pro)\.html$/.test(rel) ||
    rel.startsWith('public/')
  );
});

for (const file of publicish) {
  const rel = relative(ROOT, file).replaceAll('\\', '/');
  if (rel.startsWith('public/de/') || rel.startsWith('public/ja/') || rel.startsWith('public/zh/')) {
    errors.push(`${rel}: unpublished locale preview must not ship`);
    continue;
  }
  const html = readFileSync(file, 'utf8');
  if (!/<html[^>]*\slang=["']en["']/i.test(html) && rel !== 'calculator.html') {
    if (/<html[\s>]/i.test(html)) errors.push(`${rel}: missing html lang=en`);
  }
  for (const re of TURKISH_UI) {
    if (!re.test(html)) continue;
    if (ALLOW.some((ok) => ok.test(html) && re === TURKISH_UI[TURKISH_UI.length - 1] && /ISO|ASME/.test(html))) {
      /* diacritics in citations are inspected below per match */
    }
    const m = html.match(re);
    if (!m) continue;
    const snippet = m[0];
    if (/[çğıöşüÇĞİÖŞÜ]/.test(snippet) && /<(title|h1|button|label|a |nav)/i.test(html.slice(Math.max(0, html.indexOf(snippet) - 80), html.indexOf(snippet) + 80))) {
      errors.push(`${rel}: non-English UI string ${snippet}`);
    } else if (re !== TURKISH_UI[TURKISH_UI.length - 1]) {
      errors.push(`${rel}: Turkish UI string ${snippet}`);
    }
  }
}

if (errors.length) {
  console.error('[FAIL] public language:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`[PASS] public language: ${publicish.length} HTML files English-only`);
