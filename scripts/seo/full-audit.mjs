#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const STEPS = [
  ['registry', ['node', '-e', "import('./seo/registry.mjs').then(m=>{const e=m.validateRegistryInvariants(); if(e.length){console.error(e.join('\\n')); process.exit(1)} console.log('registry ok', m.PAGES.length)})"]],
  ['robots-generate', ['node', 'scripts/generate-robots.mjs']],
  ['robots-policy', ['node', 'scripts/verify-robots-policy.mjs']],
  ['legacy-routes', ['node', 'scripts/seo/validate-legacy-routes.mjs']],
  ['language', ['node', 'scripts/seo/validate-public-language.mjs']],
  ['operator-jargon', ['node', 'scripts/seo/audit-public-operator-jargon.mjs']],
  ['public-leaks', ['node', 'scripts/seo/audit-public-leaks.mjs']],
  ['verify-seo', ['node', 'scripts/verify-seo.mjs']],
  ['verify-links', ['node', 'scripts/verify-internal-link-graph.mjs']],
  ['verify-schema', ['node', 'scripts/verify-schema.mjs']],
  ['typecheck', ['npx', 'tsc', '--noEmit']],
];

let failed = 0;
for (const [name, cmd] of STEPS) {
  const r = spawnSync(cmd[0], cmd.slice(1), { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) {
    failed += 1;
    console.error(`[FAIL] ${name}\n${r.stdout || ''}${r.stderr || ''}`);
  } else {
    console.log(`[PASS] ${name}`);
    if (r.stdout) process.stdout.write(r.stdout.endsWith('\n') ? r.stdout : `${r.stdout}\n`);
  }
}
if (failed) {
  console.error(`[FAIL] seo:full-audit ${failed} step(s)`);
  process.exit(1);
}
console.log('[PASS] seo:full-audit');
