#!/usr/bin/env node
/**
 * Export regression catalog SSOT for Playwright suites.
 * Source: seo/registry.mjs + seo/free-tools.mjs + billing free-set alignment.
 *
 * Usage:
 *   node scripts/export-regression-catalog.mjs           # write fixtures
 *   node scripts/export-regression-catalog.mjs --check   # fail if stale
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  calculators,
  CURRENT_CALCULATOR_COUNT,
  CURRENT_INDEXABLE_BASELINE,
  sitemapLocs,
  validateRegistryInvariants
} from '../seo/registry.mjs';
import { FREE_TOOLS, FREE_TOOL_IDS } from '../seo/free-tools.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'tests/e2e/fixtures/catalog.json');

const errors = validateRegistryInvariants();
if (errors.length) {
  console.error('[FAIL] registry:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

const calcs = calculators()
  .slice()
  .sort((a, b) => a.id.localeCompare(b.id))
  .map((c) => ({
    id: c.id,
    name: c.name || c.h1,
    canonicalPath: c.canonicalPath,
    sourceFile: c.sourceFile,
    legacyPaths: c.legacyPaths || [],
    revenueTier: c.revenueTier || null,
    free: FREE_TOOL_IDS.has(c.id),
    title: c.title,
    description: c.description,
    h1: c.h1
  }));

if (calcs.length !== CURRENT_CALCULATOR_COUNT) {
  console.error(`[FAIL] calculator count ${calcs.length} != baseline ${CURRENT_CALCULATOR_COUNT}`);
  process.exit(1);
}

const freeMissing = FREE_TOOLS.filter((t) => !calcs.some((c) => c.id === t.toolId));
if (freeMissing.length) {
  console.error('[FAIL] free tools missing from registry:', freeMissing.map((t) => t.toolId));
  process.exit(1);
}

const catalog = {
  generatedAt: new Date().toISOString(),
  host: 'https://sectorcalc.com',
  calculatorCount: CURRENT_CALCULATOR_COUNT,
  indexableBaseline: CURRENT_INDEXABLE_BASELINE,
  sitemapCount: sitemapLocs().length,
  freeToolIds: FREE_TOOLS.map((t) => t.toolId),
  freeTools: FREE_TOOLS.map((t) => ({
    toolId: t.toolId,
    canonicalPath: t.canonicalPath,
    name: t.name,
    sourceSlug: t.sourceSlug,
    upsellHref: t.upsell.href
  })),
  paidTools: calcs.filter((c) => !c.free),
  calculators: calcs,
  hubs: [
    { path: '/', name: 'Home' },
    { path: '/tools', name: 'Tools' },
    { path: '/pricing', name: 'Pricing' },
    { path: '/login', name: 'Login' },
    { path: '/account', name: 'Account' }
  ]
};

const json = `${JSON.stringify(catalog, null, 2)}\n`;

if (process.argv.includes('--check')) {
  if (!existsSync(OUT)) {
    console.error('[FAIL] missing catalog fixture — run export without --check');
    process.exit(1);
  }
  const prev = JSON.parse(readFileSync(OUT, 'utf8'));
  const strip = (o) => {
    const { generatedAt, ...rest } = o;
    return rest;
  };
  if (JSON.stringify(strip(prev)) !== JSON.stringify(strip(JSON.parse(json)))) {
    console.error('[FAIL] tests/e2e/fixtures/catalog.json is stale — run: node scripts/export-regression-catalog.mjs');
    process.exit(1);
  }
  console.log(`[OK] regression catalog fresh: ${catalog.calculatorCount} tools, ${catalog.sitemapCount} sitemap URLs`);
  process.exit(0);
}

writeFileSync(OUT, json);
console.log(`[OK] wrote ${OUT} (${catalog.calculatorCount} tools, free=${catalog.freeToolIds.length}, paid=${catalog.paidTools.length})`);
