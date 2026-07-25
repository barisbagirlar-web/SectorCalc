#!/usr/bin/env node
/**
 * Sacred Live-Cell hero guard.
 * Fails the build if SEO/theme/inject work regresses the homepage 3D cell.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const errors = [];
const fail = (m) => errors.push(m);

const indexPath = join(ROOT, 'index.html');
const distIndex = join(ROOT, 'dist/index.html');
const heroSrc = join(ROOT, 'public/sc-hero-cell-v22.js');

if (!existsSync(indexPath)) fail('index.html missing');
if (!existsSync(heroSrc)) fail('public/sc-hero-cell-v22.js missing (immutable hero SSOT)');

const index = readFileSync(indexPath, 'utf8');
const hero = readFileSync(heroSrc, 'utf8');

if (!index.includes('sc-hero-cell-v22.js')) fail('index.html must load /sc-hero-cell-v22.js (immutable cache-bust name)');
if (/sc-hero-cell\.js\?v=1[0-8]/.test(index)) fail('index.html still references obsolete sc-hero-cell.js?v=1x');
if (index.includes('theme-calc-sheet') || index.includes('theme-blueprint') || index.includes('sc-calc-sheet.css')) {
  fail('index.html contaminated with calc-sheet/blueprint theme');
}
if (!index.includes('id="stage"') || !index.includes('class="sc-hero"')) fail('index.html missing live-cell stage markup');
if (!index.includes('hero-cell-poster.png')) fail('index.html missing premium poster fallback image');
if (/<svg class="stage-poster"/.test(index)) fail('index.html must not use the flat SVG poster (use hero-cell-poster.png)');

if (!hero.includes("__SC_HERO_BUILD__ = 'v22'")) fail('hero JS missing __SC_HERO_BUILD__ = v22 marker');
if (!hero.includes('frameToFit')) fail('hero JS missing frameToFit (auto-framing required)');
if (!hero.includes('orbit.azim')) fail('hero JS missing 360° orbit');
if (/if\s*\(\s*reducedMotion\s*\(\s*\)\s*\)\s*return/.test(hero)) {
  fail('hero JS must not skip WebGL under prefers-reduced-motion');
}
if (!hero.includes('3D env map skipped')) fail('hero JS must keep RoomEnvironment optional');

// dist parity after build
if (existsSync(distIndex)) {
  const d = readFileSync(distIndex, 'utf8');
  if (!d.includes('sc-hero-cell-v22.js')) fail('dist/index.html missing sc-hero-cell-v22.js — copy public hero into dist');
  if (!existsSync(join(ROOT, 'dist/sc-hero-cell-v22.js'))) fail('dist/sc-hero-cell-v22.js missing');
  if (!existsSync(join(ROOT, 'dist/assets/images/hero-cell-poster.png'))) fail('dist poster image missing');
}

if (errors.length) {
  console.error('[FAIL] Sacred live-cell hero guard:\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log('[PASS] Sacred live-cell hero guard: v22 immutable asset, orbit+frameToFit, premium poster, no theme contamination');
