#!/usr/bin/env node
/**
 * Enterprise eng-paper coverage gate.
 * Every registry sourceFile must load hashed sc-calc-sheet.<hash>.css and body.sc-eng-paper.
 * Fixed DWG titleblock stamp must not appear on any surface (including homepage).
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = join(ROOT, 'seo/asset-manifest.json');
const errors = [];
const fail = (m) => errors.push(m);

let CSS_PIN = '';
if (!existsSync(manifestPath)) {
  fail('seo/asset-manifest.json missing — run hash-head-assets first');
} else {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  CSS_PIN = (manifest.files?.['sc-calc-sheet.css']?.href || '').replace(/^\//, '');
  if (!CSS_PIN) fail('asset-manifest missing sc-calc-sheet.css');
}

const regPath = join(ROOT, 'seo/registry.generated.json');
if (!existsSync(regPath)) {
  fail('seo/registry.generated.json missing — run export-seo-registry first');
}

const pages = [];
if (!errors.length) {
  try {
    const reg = JSON.parse(readFileSync(regPath, 'utf8'));
    const list = Array.isArray(reg.pages) ? reg.pages : [];
    for (const p of list) {
      if (p && p.sourceFile) pages.push(p);
    }
    if (pages.length === 0) fail('registry.pages empty');
  } catch (e) {
    fail(`registry parse failed: ${e.message}`);
  }
}

const seen = new Set();
for (const p of pages) {
  const file = p.sourceFile;
  if (!file || seen.has(file)) continue;
  seen.add(file);
  const abs = join(ROOT, file);
  if (!existsSync(abs)) {
    fail(`registry sourceFile missing on disk: ${file}`);
    continue;
  }
  const html = readFileSync(abs, 'utf8');
  if (!/\bsc-eng-paper\b/.test(html)) {
    fail(`${file}: missing body.sc-eng-paper`);
  }
  if (!html.includes(CSS_PIN)) {
    fail(`${file}: missing <link> ${CSS_PIN}`);
  }
  if (html.includes('sc-calc-sheet-titleblock') || html.includes('<!--SC-CALC-SHEET-TB-START-->')) {
    fail(`${file}: retired titleblock stamp must be removed`);
  }
}

const indexPath = join(ROOT, 'index.html');
if (existsSync(indexPath)) {
  const index = readFileSync(indexPath, 'utf8');
  if (index.includes('theme-calc-sheet') || index.includes('theme-blueprint')) {
    fail('index.html must not use theme-calc-sheet / theme-blueprint');
  }
  if (index.includes('sc-calc-sheet-titleblock')) {
    fail('index.html must not carry calc-sheet titleblock');
  }
  if (!/\bsc-eng-paper\b/.test(index) || !index.includes(CSS_PIN)) {
    fail('index.html must carry sc-eng-paper + hashed sc-calc-sheet CSS');
  }
}

if (errors.length) {
  console.error('[FAIL] Eng-paper coverage gate:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(
  `[PASS] Eng-paper coverage: ${seen.size} registry surfaces + homepage share ${CSS_PIN} / sc-eng-paper`,
);
