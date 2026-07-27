#!/usr/bin/env node
/**
 * Rewrite relative asset URLs to root-absolute.
 * Required because Firebase Hosting serves *-pro.html at /calculator/<slug>;
 * browser-relative ./assets/* then resolves to /calculator/assets/* (404).
 *
 * Usage:
 *   node scripts/normalize-root-assets.mjs            # mutate source HTML
 *   node scripts/normalize-root-assets.mjs --dist      # mutate dist/*.html only
 *   node scripts/normalize-root-assets.mjs --check     # fail if relative assets remain
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const wantDist = process.argv.includes('--dist');
const wantCheck = process.argv.includes('--check');
const mode = wantCheck ? 'check' : wantDist ? 'dist' : 'source';

const REL_ATTR =
  /\b(src|href|poster)=(["'])\.\/([^"']+)\2/gi;
const REL_SRCSET_ITEM = /(^|[, ])\.\/([^\s,]+)/g;

function normalizeHtml(html) {
  let out = html.replace(REL_ATTR, (_m, attr, q, path) => `${attr}=${q}/${path}${q}`);
  out = out.replace(/\bsrcset=(["'])([^"']+)\1/gi, (_m, q, value) => {
    const next = value.replace(REL_SRCSET_ITEM, (_mm, sep, path) => `${sep}/${path}`);
    return `srcset=${q}${next}${q}`;
  });
  // Bare relative favicon-style paths without ./ that still break under /calculator/*
  // Only rewrite when attribute value starts with a known root asset name (no slash, no http).
  out = out.replace(
    /\b(src|href)=(["'])(?!\/|https?:|data:|#|mailto:|tel:)((?:assets\/|sectorcalc-|favicon|icon-|apple-touch|site\.webmanifest|sc-[a-z0-9.-]+\.(?:css|js))[^"']*)\2/gi,
    (_m, attr, q, path) => `${attr}=${q}/${path}${q}`
  );
  return out;
}

function listHtmlFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => join(dir, f));
}

function walkPublicHtml(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) walkPublicHtml(p, acc);
    else if (name.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function collectTargets() {
  if (wantDist || (wantCheck && wantDist)) return listHtmlFiles(join(ROOT, 'dist'));
  if (wantCheck && !wantDist) {
    // Default check scans dist if present, else source tool pages
    const dist = listHtmlFiles(join(ROOT, 'dist'));
    if (dist.length) return dist;
  }
  const files = [
    ...listHtmlFiles(ROOT),
    ...walkPublicHtml(join(ROOT, 'public')),
    ...walkPublicHtml(join(ROOT, 'content')),
  ];
  return files;
}

function hasRelativeAsset(html) {
  return (
    /\b(?:src|href|poster)=["']\.\//i.test(html) ||
    /\bsrcset=["'][^"']*\.\//i.test(html) ||
    /\b(?:src|href)=["'](?:assets\/|sc-[a-z0-9.-]+\.(?:css|js))/i.test(html)
  );
}

let changed = 0;
let checked = 0;
const offenders = [];

for (const file of collectTargets()) {
  const raw = readFileSync(file, 'utf8');
  checked += 1;
  if (mode === 'check') {
    if (hasRelativeAsset(raw)) offenders.push(file.replace(ROOT + '/', ''));
    continue;
  }
  const next = normalizeHtml(raw);
  if (next !== raw) {
    writeFileSync(file, next);
    changed += 1;
    console.log(`[OK] normalized ${file.replace(ROOT + '/', '')}`);
  }
}

if (mode === 'check') {
  if (offenders.length) {
    console.error('[FAIL] relative asset URLs remain (break /calculator/* rewrites):');
    for (const f of offenders.slice(0, 40)) console.error(`  - ${f}`);
    if (offenders.length > 40) console.error(`  … +${offenders.length - 40} more`);
    process.exit(1);
  }
  console.log(`[PASS] root-absolute assets: ${checked} HTML files clean`);
  process.exit(0);
}

console.log(`[OK] normalize-root-assets (${mode}): ${changed} updated / ${checked} scanned`);
