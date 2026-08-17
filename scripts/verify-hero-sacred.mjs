#!/usr/bin/env node
/**
 * Homepage hero guard — slim mobile-first PREVIEW panel (mandate 2026-08-15).
 * Fails the build if SEO/theme/inject work regresses copy, CTAs, or audit signals.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const errors = [];
const fail = (m) => errors.push(m);

const indexPath = join(ROOT, 'index.html');
const distIndex = join(ROOT, 'dist/index.html');

if (!existsSync(indexPath)) fail('index.html missing');

const index = readFileSync(indexPath, 'utf8');
const hero = (index.match(/<section class="sc-hero"[\s\S]*?<\/section>/) || [''])[0];

if (!hero) fail('index.html missing <section class="sc-hero">');

if (index.includes('theme-calc-sheet') || index.includes('theme-blueprint')) {
  fail('index.html contaminated with theme-calc-sheet / theme-blueprint (hero chrome forbidden)');
}
if (index.includes('sc-calc-sheet-titleblock')) {
  fail('index.html must not carry calc-sheet titleblock');
}
if (!index.includes('sc-eng-paper')) {
  fail('index.html must use body.sc-eng-paper for unified graph-paper background');
}
if (!/sc-calc-sheet\.[a-f0-9]{8}\.css/.test(index)) {
  fail('index.html must load content-hashed /sc-calc-sheet.<hash>.css (shared eng-paper SSOT)');
}

if (!hero.includes('Deterministic Engines · Open Bench')) {
  fail('hero pill copy must be Deterministic Engines · Open Bench');
}
if (!hero.includes('The Machine Is Running.') || !hero.includes('The Math Is Yours.')) {
  fail('hero H1 copy missing');
}
if (!hero.includes('Five reference instruments run open')) {
  fail('hero lead must bold Five reference instruments run open');
}
if (!hero.includes('href="#free-calculators"')) {
  fail('CTA 1 must target #free-calculators');
}
if (!/href="\/pricing"[^>]*>Commission decision credits/.test(hero)) {
  fail('CTA 2 must target /pricing');
}
if (!hero.includes('href="/calculator/tolerance-stack-up"')) {
  fail('live-link must target /calculator/tolerance-stack-up');
}
if (!hero.includes('PREVIEW')) fail('static panel must keep PREVIEW label');
if (!hero.includes('✓ REPRODUCIBLE')) fail('hero must keep ✓ REPRODUCIBLE badge');
if (!hero.includes('ENGINE') || !hero.includes('v3.1.0')) fail('hero must keep ENGINE v3.1.0');
if (!hero.includes('0x7A3F1C9E')) fail('hero must keep SEED 0x7A3F1C9E');
if (!hero.includes('±0.0767 mm')) fail('hero must show Monte Carlo ±0.0767 mm');
if (hero.includes('id="inTol"')) fail('hero must not include SPACER TOLERANCE slider');
if (hero.includes('id="stage"')) fail('hero must not include live-cell #stage (machine visual removed)');
if (index.includes('sc-hero-cell-v24.js') || index.includes('sc-hero-engine.js')) {
  fail('index.html must not load live-cell scripts');
}
if (/href="#"/ .test(hero)) fail('hero must not ship placeholder href="#"');

if (existsSync(distIndex)) {
  const d = readFileSync(distIndex, 'utf8');
  const distHero = (d.match(/<section class="sc-hero"[\s\S]*?<\/section>/) || [''])[0];
  if (!distHero) fail('dist/index.html missing sc-hero');
  if (distHero.includes('Industrial decision math you can reproduce')) {
    if (distHero.includes('id="stage"')) fail('dist/index.html slim hero still contains #stage');
    if (!distHero.includes('✓ REPRODUCIBLE')) fail('dist/index.html missing REPRODUCIBLE badge');
    if (!distHero.includes('PREVIEW')) fail('dist/index.html missing PREVIEW label');
  }
}

if (errors.length) {
  console.error('[FAIL] Slim hero guard:\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log('[PASS] Slim hero guard: copy, CTAs, PREVIEW + ENGINE/SEED/REPRODUCIBLE, no live-cell stage');
