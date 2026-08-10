#!/usr/bin/env node
/**
 * Generate deterministic sitemap artifacts from the SEO registry.
 * SET(SITEMAP) === SET(REGISTRY indexable && sitemapEligible && robots-allowed).
 * DO NOT EDIT generated sitemap files directly.
 */
import { readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sitemapPages, CURRENT_INDEXABLE_BASELINE, validateRegistryInvariants, HOST } from '../seo/registry.mjs';
import { isRobotsAllowed } from '../seo/robots-policy.mjs';
import { buildSitemapArtifacts, canonicalEntry, DEFAULT_SITEMAP_LIMITS } from '../seo/sitemap-engine.mjs';
import { SITEMAP_POLICY, SITEMAP_RETAINED_FRACTION } from '../seo/sitemap-policy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');

const errors = validateRegistryInvariants();
if (errors.length) {
  console.error('[FAIL] registry:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

const robots = readFileSync(join(PUBLIC, 'robots.txt'), 'utf8');
const pages = sitemapPages();
if (pages.length === 0) {
  console.error('[FAIL] EMPTY_SITEMAP: refusing to publish an empty crawl surface');
  process.exit(1);
}

const shrinkFloor = Math.ceil(CURRENT_INDEXABLE_BASELINE * SITEMAP_RETAINED_FRACTION);
if (pages.length < shrinkFloor) {
  console.error(`[FAIL] UNEXPECTED_SITEMAP_SHRINK: ${pages.length} < retained floor ${shrinkFloor} (baseline=${CURRENT_INDEXABLE_BASELINE}, maxShrinkPct=${SITEMAP_POLICY.maxShrinkPct})`);
  process.exit(1);
}

const entries = [];
const seen = new Set();
for (const page of pages) {
  if (!isRobotsAllowed(robots, 'Googlebot', page.canonicalPath)) {
    console.error(`[FAIL] ROBOTS_SITEMAP_CONFLICT: ${page.canonicalPath}`);
    process.exit(1);
  }
  const entry = canonicalEntry(page, HOST, new Date());
  if (seen.has(entry.loc)) {
    console.error(`[FAIL] DUPLICATE_SITEMAP_URL: ${entry.loc}`);
    process.exit(1);
  }
  seen.add(entry.loc);
  entries.push(entry);
}

if (!entries.some((e) => e.loc === `${HOST}/`)) {
  console.error('[FAIL] sitemap must include the homepage');
  process.exit(1);
}

const artifacts = buildSitemapArtifacts(entries, HOST, DEFAULT_SITEMAP_LIMITS);

for (const file of readdirSync(PUBLIC)) {
  if (/^sitemap-pages-\d{3}\.xml$/.test(file) && !artifacts.files.some((x) => x.name === file)) {
    unlinkSync(join(PUBLIC, file));
  }
}
for (const file of artifacts.files) writeFileSync(join(PUBLIC, file.name), file.xml);
if (artifacts.index) writeFileSync(join(PUBLIC, artifacts.index.name), artifacts.index.xml);

const outputCount = artifacts.files.reduce((sum, file) => sum + file.count, 0);
console.log(`[OK] sitemap artifacts written: urls=${outputCount} chunks=${artifacts.files.length} index=${Boolean(artifacts.index)}`);
console.log(`[OK] policy config: maxShrinkPct=${SITEMAP_POLICY.maxShrinkPct} maxUrls=${SITEMAP_POLICY.maxUrls} maxBytes=${SITEMAP_POLICY.maxBytes}`);
console.log('[OK] priority/changefreq omitted; unreliable URL lastmod omitted');
