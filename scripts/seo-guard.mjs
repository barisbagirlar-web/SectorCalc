#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { INDEXABLE_PAGES, SITE_ORIGIN, TOOL_PAGES, canonicalUrls } from './seo-registry.mjs';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const issues = [];

function fail(message) {
  issues.push(message);
}

function read(path) {
  if (!existsSync(path)) {
    fail(`missing file: ${path.replace(ROOT + '/', '')}`);
    return '';
  }
  return readFileSync(path, 'utf8');
}

function matches(text, pattern) {
  return [...text.matchAll(pattern)].map((m) => m[1]);
}

const expectedUrls = canonicalUrls();
const expectedSet = new Set(expectedUrls);
if (expectedSet.size !== expectedUrls.length) fail('canonical registry contains duplicate URLs');
if (TOOL_PAGES.length !== 25) fail(`expected 25 live tools, found ${TOOL_PAGES.length}`);

const sitemap = read(join(ROOT, 'public', 'sitemap.xml'));
const sitemapUrls = matches(sitemap, /<loc>([^<]+)<\/loc>/g);
if (sitemap.includes('<priority>')) fail('sitemap must not contain <priority>');
if (sitemap.includes('<changefreq>')) fail('sitemap must not contain <changefreq>');
if (new Set(sitemapUrls).size !== sitemapUrls.length) fail('sitemap contains duplicate URLs');
for (const url of expectedUrls) if (!sitemapUrls.includes(url)) fail(`sitemap missing canonical: ${url}`);
for (const url of sitemapUrls) if (!expectedSet.has(url)) fail(`sitemap contains non-registry URL: ${url}`);

const forbiddenDiscovery = ['/categories', '/developer-showcase', '/pro-tools/', '/seo/', '/tr/', '/fr/', '/de/', '/guides/how-to-calculate-manufacturing-cost'];
for (const value of forbiddenDiscovery) {
  if (sitemap.includes(value)) fail(`sitemap contains retired route: ${value}`);
}

const robots = read(join(ROOT, 'public', 'robots.txt'));
for (const agent of ['Googlebot', 'Bingbot', 'OAI-SearchBot']) {
  if (!robots.includes(`User-agent: ${agent}`)) fail(`robots.txt missing explicit ${agent} policy`);
}
if (!robots.includes('Sitemap: https://www.sectorcalc.com/sitemap.xml')) fail('robots.txt missing canonical sitemap declaration');

const llms = read(join(ROOT, 'public', 'llms.txt'));
const llm = read(join(ROOT, 'public', 'llm.txt'));
if (llms !== llm) fail('llms.txt and llm.txt diverge');
for (const page of TOOL_PAGES) {
  const url = `${SITE_ORIGIN}${page.path}`;
  if (!llms.includes(url)) fail(`llms.txt missing live tool URL: ${url}`);
}
for (const value of forbiddenDiscovery) {
  if (llms.includes(value)) fail(`llms.txt contains retired route: ${value}`);
}

const firebaseRaw = read(join(ROOT, 'firebase.json'));
try {
  const firebase = JSON.parse(firebaseRaw);
  const rewrites = firebase?.hosting?.rewrites ?? [];
  if (rewrites.some((rule) => rule?.source === '**' && rule?.destination === '/index.html')) {
    fail('firebase catch-all homepage rewrite creates soft-404 risk');
  }
} catch (error) {
  fail(`firebase.json parse error: ${error instanceof Error ? error.message : String(error)}`);
}

const notFound = read(join(ROOT, 'public', '404.html'));
if (!/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(notFound)) fail('404.html must carry meta noindex');
if (!/Page Not Found/i.test(notFound)) fail('404.html must clearly identify the error');

if (!existsSync(DIST)) {
  fail('dist/ missing; run production build before seo:guard');
} else {
  const seenTitles = new Map();
  const seenCanonicals = new Set();

  for (const page of INDEXABLE_PAGES) {
    const html = read(join(DIST, page.file));
    if (!html) continue;
    const expectedCanonical = `${SITE_ORIGIN}${page.path}`;
    const canonicals = matches(html, /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/gi);
    if (canonicals.length !== 1) fail(`${page.file}: expected one canonical, found ${canonicals.length}`);
    else if (canonicals[0] !== expectedCanonical) fail(`${page.file}: canonical mismatch ${canonicals[0]} != ${expectedCanonical}`);
    if (seenCanonicals.has(expectedCanonical)) fail(`${page.file}: duplicate canonical identity ${expectedCanonical}`);
    seenCanonicals.add(expectedCanonical);

    const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]*>/g, '').trim() ?? '';
    if (!title) fail(`${page.file}: missing title`);
    else {
      const key = title.toLowerCase();
      if (seenTitles.has(key)) fail(`${page.file}: duplicate title with ${seenTitles.get(key)}`);
      else seenTitles.set(key, page.file);
    }

    if (!/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']{40,}["']/i.test(html)) fail(`${page.file}: missing/short meta description`);
    if (!/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*index[^"']*follow/i.test(html)) fail(`${page.file}: missing index/follow robots meta`);
    if (!/<h1\b/i.test(html)) fail(`${page.file}: missing server-visible H1`);
    if (!html.includes('id="sectorcalc-entity-schema"')) fail(`${page.file}: missing entity JSON-LD`);
    if (/AggregateRating|["']@type["']\s*:\s*["']Review["']/i.test(html)) fail(`${page.file}: unverified rating/review schema detected`);

    if (page.kind === 'tool') {
      if (!/SoftwareApplication/.test(html) || !/WebApplication/.test(html)) fail(`${page.file}: missing SoftwareApplication/WebApplication schema`);
      if (!/id=["']sc-guide["']/i.test(html)) fail(`${page.file}: missing visible engineering guide`);
      if (!/formula|equation/i.test(html)) fail(`${page.file}: no visible formula/equation content`);
      if (!/assumption|model boundary|limitation/i.test(html)) fail(`${page.file}: no visible assumptions/limitations content`);
    }
  }

  const distSitemap = read(join(DIST, 'sitemap.xml'));
  if (distSitemap !== sitemap) fail('dist sitemap differs from generated public sitemap');
  const distRobots = read(join(DIST, 'robots.txt'));
  if (distRobots !== robots) fail('dist robots differs from public robots');
  if (!existsSync(join(DIST, '404.html'))) fail('dist missing custom 404.html');
}

if (issues.length) {
  console.error('[FAIL] Enterprise SEO guard');
  for (const issue of issues) console.error(` - ${issue}`);
  process.exit(1);
}

console.log(`[PASS] Enterprise SEO guard: ${INDEXABLE_PAGES.length} canonical pages, ${TOOL_PAGES.length} live tools, zero known first-party index blockers`);
