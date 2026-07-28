#!/usr/bin/env node
/**
 * Generate public/sitemap.xml from SEO registry.
 * SET(SITEMAP) === SET(REGISTRY indexable && sitemapEligible)
 *
 * DO NOT EDIT public/sitemap.xml DIRECTLY — regenerate from seo/registry.mjs
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  sitemapLocs,
  sitemapPages,
  CURRENT_INDEXABLE_BASELINE,
  validateRegistryInvariants,
} from '../seo/registry.mjs';
import { FREE_TOOLS } from '../seo/free-tools.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const errors = validateRegistryInvariants();
if (errors.length) {
  console.error('[FAIL] registry:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

const locs = sitemapLocs();
if (locs.length === 0) {
  console.error('[FAIL] UNEXPECTED_SITEMAP_SHRINK: refusing to write empty sitemap');
  process.exit(1);
}
if (locs.length < Math.floor(CURRENT_INDEXABLE_BASELINE * 0.5)) {
  console.error(`[FAIL] UNEXPECTED_SITEMAP_SHRINK: ${locs.length} < 50% of baseline ${CURRENT_INDEXABLE_BASELINE}`);
  process.exit(1);
}

// Stable order: hubs → topics → free open-bench calculators → other calculators → content.
const pages = sitemapPages();
const freePaths = new Set(FREE_TOOLS.map((t) => t.canonicalPath));
const rank = (p) => {
  if (p.canonicalPath === '/') return 0;
  if (['/tools.html', '/pro.html', '/pricing.html'].includes(p.canonicalPath)) return 1;
  if (p.canonicalPath === '/topics' || p.canonicalPath.startsWith('/topics/')) return 2;
  if (p.role === 'calculator' && freePaths.has(p.canonicalPath)) return 3;
  if (p.role === 'calculator') return 4;
  return 5;
};
pages.sort((a, b) => {
  const ra = rank(a);
  const rb = rank(b);
  if (ra !== rb) return ra - rb;
  return a.canonicalPath.localeCompare(b.canonicalPath);
});

const ordered = pages.map((p) =>
  p.canonicalPath === '/' ? 'https://sectorcalc.com/' : `https://sectorcalc.com${p.canonicalPath}`,
);

const body = ordered
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
  </url>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- DO NOT EDIT DIRECTLY. Generated from seo/registry.mjs via scripts/generate-sitemap.mjs -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

writeFileSync(join(ROOT, 'public/sitemap.xml'), xml);
console.log(
  `[OK] sitemap.xml written: ${ordered.length} URLs (${FREE_TOOLS.length} open-bench calculators prioritized)`,
);
