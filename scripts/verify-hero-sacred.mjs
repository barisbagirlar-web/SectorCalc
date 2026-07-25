#!/usr/bin/env node
/**
 * Sacred Live-Cell hero guard.
 * Fails the build if SEO/theme/inject work regresses the homepage 3D cell.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const HERO = 'sc-hero-cell-v24.js';
const BUILD = 'v24';
const errors = [];
const fail = (m) => errors.push(m);

const indexPath = join(ROOT, 'index.html');
const distIndex = join(ROOT, 'dist/index.html');
const heroSrc = join(ROOT, 'public', HERO);

if (!existsSync(indexPath)) fail('index.html missing');
if (!existsSync(heroSrc)) fail(`public/${HERO} missing (immutable hero SSOT)`);

const index = readFileSync(indexPath, 'utf8');
const hero = readFileSync(heroSrc, 'utf8');

if (!index.includes(HERO)) fail(`index.html must load /${HERO} (immutable cache-bust name)`);
if (/sc-hero-cell\.js\?v=1[0-8]/.test(index)) fail('index.html still references obsolete sc-hero-cell.js?v=1x');
if (/sc-hero-cell-v2[23]\.js/.test(index)) fail('index.html still references obsolete sc-hero-cell-v22/v23.js — bump to v24');
if (index.includes('theme-calc-sheet') || index.includes('theme-blueprint') || index.includes('sc-calc-sheet.css')) {
  fail('index.html contaminated with calc-sheet/blueprint theme');
}
if (!index.includes('id="stage"') || !index.includes('class="sc-hero"')) fail('index.html missing live-cell stage markup');
if (!index.includes('hero-cell-poster.png')) fail('index.html missing premium poster fallback image');
if (/<svg class="stage-poster"/.test(index)) fail('index.html must not use the flat SVG poster (use hero-cell-poster.png)');

if (!hero.includes(`__SC_HERO_BUILD__ = '${BUILD}'`)) fail(`hero JS missing __SC_HERO_BUILD__ = ${BUILD} marker`);
if (!hero.includes('frameToFit')) fail('hero JS missing frameToFit (auto-framing required)');
if (!hero.includes('orbit.azim')) fail('hero JS missing 360° orbit');
if (!hero.includes('AdditiveBlending') || !hero.includes('makeSparkMaterial')) {
  fail('hero JS missing cinematic spark shader (AdditiveBlending + makeSparkMaterial)');
}
if (hero.includes('CircleGeometry(5.') || hero.includes("name = 'ground'") || /name:\s*'bay'|Industrial bay/.test(hero)) {
  fail('hero JS must not include oval ground disc or rear metal bay (blocks 360° view)');
}
if (/if\s*\(\s*reducedMotion\s*\(\s*\)\s*\)\s*return/.test(hero)) {
  fail('hero JS must not skip WebGL under prefers-reduced-motion');
}
if (!hero.includes('3D env map skipped')) fail('hero JS must keep RoomEnvironment optional');

// dist parity after build
if (existsSync(distIndex)) {
  const d = readFileSync(distIndex, 'utf8');
  if (!d.includes(HERO)) fail(`dist/index.html missing ${HERO} — copy public hero into dist`);
  if (!existsSync(join(ROOT, 'dist', HERO))) fail(`dist/${HERO} missing`);
  if (!existsSync(join(ROOT, 'dist/assets/images/hero-cell-poster.png'))) fail('dist poster image missing');
}

if (errors.length) {
  console.error('[FAIL] Sacred live-cell hero guard:\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`[PASS] Sacred live-cell hero guard: ${BUILD} immutable asset, clear 360° orbit, spark trails, premium poster, no theme contamination`);
