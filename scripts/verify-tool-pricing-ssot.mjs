#!/usr/bin/env node
/**
 * Fail-closed: billing packages.ts (client + Functions) must match seo/tool-pricing.mjs.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOOL_PRICING, TIER_CREDITS } from '../seo/tool-pricing.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (m) => errors.push(m);

function parseToolPricing(rel) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) {
    fail(`missing ${rel}`);
    return null;
  }
  const text = readFileSync(p, 'utf8');
  const map = {};
  const re = /'(SC-\d{3})'\s*:\s*\{\s*tier:\s*'([A-Z]+)'\s*,\s*monetizationEnabled:\s*(true|false)/g;
  let m;
  while ((m = re.exec(text))) {
    map[m[1]] = { tier: m[2], monetizationEnabled: m[3] === 'true' };
  }
  if (!Object.keys(map).length) fail(`${rel}: could not parse TOOL_PRICING`);
  return map;
}

function parseTier(rel) {
  const text = readFileSync(join(ROOT, rel), 'utf8');
  const out = {};
  const re = /(FREE|CORE|PRO|ADVANCED|DECISION)\s*:\s*(\d+)/g;
  let m;
  while ((m = re.exec(text))) out[m[1]] = Number(m[2]);
  return out;
}

const seo = TOOL_PRICING;
for (const rel of ['src/billing/domain/packages.ts', 'functions/src/domain/packages.ts']) {
  const map = parseToolPricing(rel);
  if (!map) continue;
  const seoIds = Object.keys(seo).sort();
  const fileIds = Object.keys(map).sort();
  if (seoIds.join(',') !== fileIds.join(',')) {
    fail(`${rel} tool id set ≠ seo/tool-pricing.mjs`);
  }
  for (const id of seoIds) {
    const a = seo[id];
    const b = map[id];
    if (!b) {
      fail(`${rel} missing ${id}`);
      continue;
    }
    if (a.tier !== b.tier || a.monetizationEnabled !== b.monetizationEnabled) {
      fail(`${rel} ${id}: file=${JSON.stringify(b)} seo=${JSON.stringify(a)}`);
    }
  }
  const tiers = parseTier(rel);
  for (const [k, v] of Object.entries(TIER_CREDITS)) {
    if (tiers[k] !== v) fail(`${rel} TIER_CREDITS.${k}=${tiers[k]} expected ${v}`);
  }
}

// Rubric locks from the rebalance (must not silently regress)
const expect = {
  'SC-012': { tier: 'PRO', credit: 7 },
  'SC-023': { tier: 'CORE', credit: 3 },
  'SC-024': { tier: 'CORE', credit: 3 },
  'SC-026': { tier: 'ADVANCED', credit: 15 },
  'SC-031': { tier: 'ADVANCED', credit: 15 },
  'SC-032': { tier: 'ADVANCED', credit: 15 },
  'SC-008': { tier: 'ADVANCED', credit: 15 },
  'SC-010': { tier: 'CORE', credit: 3 },
};
for (const [id, exp] of Object.entries(expect)) {
  const row = seo[id];
  if (!row || row.tier !== exp.tier || TIER_CREDITS[row.tier] !== exp.credit) {
    fail(`rubric lock ${id}: got ${JSON.stringify(row)} expected ${JSON.stringify(exp)}`);
  }
}

if (errors.length) {
  console.error('verify-tool-pricing-ssot FAILED:');
  for (const e of errors) console.error(' -', e);
  process.exit(1);
}
console.log(
  `verify-tool-pricing-ssot OK (${Object.keys(seo).length} tools · CORE ${TIER_CREDITS.CORE} / PRO ${TIER_CREDITS.PRO} / ADVANCED ${TIER_CREDITS.ADVANCED})`,
);
