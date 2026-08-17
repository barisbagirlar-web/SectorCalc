#!/usr/bin/env node
/**
 * Generate deterministic sitemap artifacts from the SEO registry.
 * SET(SITEMAP) === SET(REGISTRY indexable && sitemapEligible && robots-allowed).
 * DO NOT EDIT generated sitemap files directly.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sitemapPages, CURRENT_INDEXABLE_BASELINE, validateRegistryInvariants, HOST } from '../seo/registry.mjs';
import { isRobotsAllowed } from '../seo/robots-policy.mjs';
import { buildRoleSitemapArtifacts, canonicalEntry, renderImageUrlset } from '../seo/sitemap-engine.mjs';
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
const lastmodMap = JSON.parse(readFileSync(join(ROOT, 'seo/lastmod-map.json'), 'utf8'));
for (const page of pages) {
  if (!isRobotsAllowed(robots, 'Googlebot', page.canonicalPath)) {
    console.error(`[FAIL] ROBOTS_SITEMAP_CONFLICT: ${page.canonicalPath}`);
    process.exit(1);
  }
  // Deterministic lastmod from the committed git-history map: same sitemap on
  // every runner (deploy checks out with shallow history, so git log cannot be
  // re-derived in CI). Pages without an entry get no lastmod.
  if (page.sourceFile && lastmodMap[page.sourceFile]) {
    page.lastSignificantChangeAt = lastmodMap[page.sourceFile];
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

const artifacts = buildRoleSitemapArtifacts(pages, HOST, new Date());

mkdirSync(join(PUBLIC, 'sitemaps'), { recursive: true });
for (const file of readdirSync(join(PUBLIC, 'sitemaps'))) {
  if (file.endsWith('.xml') && !artifacts.files.some((x) => x.name === `sitemaps/${file}`)) {
    unlinkSync(join(PUBLIC, 'sitemaps', file));
  }
}
for (const file of artifacts.files) writeFileSync(join(PUBLIC, file.name), file.xml);
writeFileSync(join(PUBLIC, artifacts.index.name), artifacts.index.xml);

const outputCount = artifacts.files.reduce((sum, file) => sum + file.count, 0);
console.log(`[OK] sitemap artifacts written: urls=${outputCount} groups=${artifacts.files.length} index=true`);
console.log(`[OK] policy config: maxShrinkPct=${SITEMAP_POLICY.maxShrinkPct} maxUrls=${SITEMAP_POLICY.maxUrls} maxBytes=${SITEMAP_POLICY.maxBytes}`);
console.log('[OK] priority/changefreq omitted; lastmod from committed git-history map');

function publicFileForAbsUrl(absUrl) {
  const path = absUrl.replace(HOST, '').replace(/^\//, '');
  const candidates = [join(PUBLIC, path), join(ROOT, path)];
  return candidates.find((p) => existsSync(p)) || null;
}

function extractOgImageUrls(sourceFile) {
  const abs = join(ROOT, sourceFile);
  if (!existsSync(abs)) return [];
  const html = readFileSync(abs, 'utf8');
  const urls = [];
  const re = /<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>|<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/gi;
  let match;
  while ((match = re.exec(html))) {
    const url = match[1] || match[2];
    if (url) urls.push(url.trim());
  }
  return urls;
}

const extraImages = {
  '/': [
    { loc: `${HOST}/assets/images/sectorcalc-og-1200x630.jpg`, title: 'OG cover' },
    { loc: `${HOST}/assets/images/sectorcalc-logo-512x512.png`, title: 'App icon 512' },
    { loc: `${HOST}/assets/images/og-home-1200x630.jpg`, title: 'Home OG' },
    { loc: `${HOST}/sectorcalc-logo.png`, title: 'Logo light' },
    { loc: `${HOST}/icon-512.png`, title: 'PWA icon' },
    { loc: `${HOST}/assets/images/hero-cell-poster.png`, title: 'Live Cell hero poster — CNC turning + inspect' },
  ],
  '/tools': [
    { loc: `${HOST}/assets/images/neela-nataraj.jpg`, title: 'Prof. Dr. Neela Nataraj — Academic Oversight' },
  ],
};

const imagePages = [];
for (const page of pages) {
  const loc = page.canonicalPath === '/' ? `${HOST}/` : `${HOST}${page.canonicalPath}`;
  const seenImg = new Set();
  const images = [];
  const candidates = [
    ...extractOgImageUrls(page.sourceFile).map((url) => ({ loc: url, title: `${page.h1 || page.title || page.canonicalPath} OG` })),
    ...(extraImages[page.canonicalPath] || []),
  ];
  for (const img of candidates) {
    if (!img.loc || seenImg.has(img.loc)) continue;
    if (!publicFileForAbsUrl(img.loc)) continue;
    seenImg.add(img.loc);
    images.push(img);
  }
  if (images.length) imagePages.push({ loc, images });
}

if (!imagePages.some((p) => p.loc === `${HOST}/tools`)) {
  console.error('[FAIL] image sitemap missing /tools (required parent)');
  process.exit(1);
}

const imageXml = renderImageUrlset(imagePages);
writeFileSync(join(PUBLIC, 'sitemap-images.xml'), imageXml);
console.log(`[OK] sitemap-images.xml written: pages=${imagePages.length} images=${imagePages.reduce((n, p) => n + p.images.length, 0)}`);
