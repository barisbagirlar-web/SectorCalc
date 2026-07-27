#!/usr/bin/env node
/** Enterprise SEO master gate — registry + discovery + language + links + core verify-seo. */
import { spawnSync } from 'node:child_process';

const steps = [
  ['node', ['scripts/export-seo-registry.mjs']],
  ['node', ['scripts/generate-sitemap.mjs']],
  ['node', ['scripts/generate-llm-discovery.mjs']],
  ['node', ['scripts/normalize-root-assets.mjs', '--check']],
  ['node', ['scripts/verify-seo.mjs']],
  ['node', ['scripts/verify-schema.mjs']],
  ['node', ['scripts/verify-tool-content-identity.mjs']],
  ['node', ['scripts/verify-language-integrity.mjs']],
  ['node', ['scripts/verify-internal-link-graph.mjs']],
  ['node', ['scripts/verify-hero-sacred.mjs']],
  ['node', ['scripts/verify-home-credit-packs.mjs']],
  ['node', ['scripts/verify-honest-credits.mjs']],
  ['node', ['scripts/verify-tools-catalog-dna.mjs']],
  ['node', ['scripts/verify-seo-money.mjs']],
];

for (const [cmd, args] of steps) {
  console.log(`\n$ ${cmd} ${args.join(' ')}`);
  const res = spawnSync(cmd, args, { stdio: 'inherit' });
  if (res.status !== 0) {
    console.error(`[FAIL] verify:seo:enterprise stopped at ${args.join(' ')}`);
    process.exit(res.status || 1);
  }
}
console.log('\n[PASS] verify:seo:enterprise');
