#!/usr/bin/env node
/**
 * Fail-closed guard: Tier-A demo lock APIs must exist.
 * Prevents shipping a gate that wraps window.calculate but leaves
 * input→local calculate + Reset→custom values as a free bypass.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (m) => errors.push(m);

function mustContain(rel, needles) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) {
    fail(`missing ${rel}`);
    return;
  }
  const text = readFileSync(p, 'utf8');
  for (const n of needles) {
    if (!text.includes(n)) fail(`${rel} missing required lock contract: ${n}`);
  }
}

mustContain('src/billing/boot-tool-gate.ts', [
  'applyLockedDemoState',
  'applyUnlockedState',
  'installFieldEditGuard',
  'installResetGuard',
  '__scDemoCalcPass',
  'data-sc-gate-lock',
  'setAccessMode'
]);

mustContain('public/sc-study.js', [
  'setAccessMode',
  'restoreDemoSnapshot',
  "accessMode === 'locked'",
  '__scDemoCalcPass',
  'data-sc-study="blank"'
]);

mustContain('public/sc-study.css', ['sc-study-btn.is-locked', 'sc-demo-locked']);

const inject = readFileSync(join(ROOT, 'scripts/inject-site-nav.mjs'), 'utf8');
const ver = inject.match(/STUDY_VERSION\s*=\s*(\d+)/);
if (!ver || Number(ver[1]) < 5) {
  fail('scripts/inject-site-nav.mjs STUDY_VERSION must be >= 5 (cache-bust sc-study lock UI)');
}
if (!inject.includes('|\\/)?sc-study') && !inject.includes('|\/)?sc-study')) {
  fail('inject-site-nav must rewrite absolute /sc-study.js?v=N cache-bust URLs');
}

// Must NOT regress to wipe-to-"Locked" as the primary locked UX (kills demo teaser).
const gate = readFileSync(join(ROOT, 'src/billing/boot-tool-gate.ts'), 'utf8');
if (/function wipeUnlockedOutputs/.test(gate) && !/applyLockedDemoState/.test(gate)) {
  fail('boot-tool-gate still uses wipeUnlockedOutputs without applyLockedDemoState');
}
if (/n\.textContent = 'Locked'/.test(gate)) {
  fail('boot-tool-gate must not wipe liveResult to "Locked" (destroys demo teaser)');
}

if (errors.length) {
  console.error('verify-demo-lock FAILED:');
  for (const e of errors) console.error(' -', e);
  process.exit(1);
}
console.log('verify-demo-lock OK');
