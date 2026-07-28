#!/usr/bin/env node
/**
 * Fail if tools.html (source or dist) does not ship prerendered tool cards.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const requireDist = process.argv.includes('--dist') || process.env.CI === 'true';
const srcPath = join(ROOT, 'tools.html');
const distPath = join(ROOT, 'dist/tools.html');
const sources = [];
if (existsSync(srcPath)) sources.push({ path: srcPath, label: 'src', required: true });
if (existsSync(distPath)) sources.push({ path: distPath, label: 'dist', required: requireDist });
if (!sources.length) {
  console.error('FAIL: tools.html missing');
  process.exit(1);
}

let failed = false;
for (const { path, label, required } of sources) {
  const html = readFileSync(path, 'utf8');
  const cards = (html.match(/class="tool-card"/g) || []).length;
  const links = new Set(html.match(/href="\/calculator\/[a-z0-9-]+"/g) || []);
  const problems = [];
  if (cards < 25) problems.push(`only ${cards} prerendered tool cards`);
  if (links.size < 25) problems.push(`only ${links.size} unique calculator links`);
  if (/id="stLive"[^>]*>0</.test(html)) problems.push('stLive still 0');
  if (/catalog\.innerHTML\s*=/.test(html)) problems.push('catalog.innerHTML assignment still present');
  if (!html.includes('SC-TOOLS-CATALOG-START')) problems.push('missing SC-TOOLS-CATALOG markers');
  if (problems.length) {
    console.error(`FAIL [${label}]: ${problems.join('; ')} (cards=${cards}, links=${links.size})`);
    if (required) failed = true;
    else console.error(`  (non-blocking stale dist — rebuild or pass --dist in CI)`);
  } else {
    console.log(`guard:tools-prerender PASS (${cards} cards, ${links.size} links) [${label}]`);
  }
}
if (failed) process.exit(1);
