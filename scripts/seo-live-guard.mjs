#!/usr/bin/env node
import { SITE_ORIGIN, TOOL_PAGES, canonicalUrls } from './seo-registry.mjs';

const REQUIRED_AGENTS = ['Googlebot', 'Bingbot', 'OAI-SearchBot'];
const LEGACY_PATHS = [
  '/categories',
  '/developer-showcase',
  '/guides/how-to-calculate-manufacturing-cost',
  '/pro-tools/finance-sales-working-capital',
  '/seo/construction-cost-calculators',
  '/tr/about',
  `/__sectorcalc_missing_${Date.now()}`
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchFresh(path, init = {}) {
  const separator = path.includes('?') ? '&' : '?';
  const url = `${SITE_ORIGIN}${path}${separator}seo_guard=${Date.now()}`;
  return fetch(url, {
    redirect: 'manual',
    cache: 'no-store',
    headers: {
      'cache-control': 'no-cache, no-store, max-age=0',
      pragma: 'no-cache',
      ...init.headers
    },
    ...init
  });
}

function canonicalFrom(html) {
  return html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] ?? null;
}

async function runOnce() {
  const issues = [];
  const home = await fetchFresh('/');
  const homeBody = await home.text();
  if (home.status !== 200) issues.push(`home status ${home.status}`);
  if (!homeBody.includes('Turn industrial inputs into defensible decisions.')) issues.push('home body does not match current production architecture');
  if (canonicalFrom(homeBody) !== `${SITE_ORIGIN}/`) issues.push('home canonical mismatch');

  const robotsRes = await fetchFresh('/robots.txt');
  const robots = await robotsRes.text();
  if (robotsRes.status !== 200) issues.push(`robots status ${robotsRes.status}`);
  for (const agent of REQUIRED_AGENTS) if (!robots.includes(`User-agent: ${agent}`)) issues.push(`robots missing ${agent}`);
  if (!robots.includes(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`)) issues.push('robots sitemap declaration mismatch');

  const sitemapRes = await fetchFresh('/sitemap.xml');
  const sitemap = await sitemapRes.text();
  if (sitemapRes.status !== 200) issues.push(`sitemap status ${sitemapRes.status}`);
  if (sitemap.includes('<priority>') || sitemap.includes('<changefreq>')) issues.push('sitemap contains ignored priority/changefreq signals');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const expected = canonicalUrls();
  if (locs.length !== expected.length) issues.push(`sitemap URL count ${locs.length} != ${expected.length}`);
  for (const url of expected) if (!locs.includes(url)) issues.push(`sitemap missing ${url}`);

  const llmsRes = await fetchFresh('/llms.txt');
  const llms = await llmsRes.text();
  if (llmsRes.status !== 200) issues.push(`llms status ${llmsRes.status}`);
  for (const page of TOOL_PAGES) {
    const url = `${SITE_ORIGIN}${page.path}`;
    if (!llms.includes(url)) issues.push(`llms missing ${url}`);
  }

  for (const page of TOOL_PAGES.slice(0, 5)) {
    const response = await fetchFresh(page.path);
    const html = await response.text();
    if (response.status !== 200) issues.push(`${page.path} status ${response.status}`);
    if (canonicalFrom(html) !== `${SITE_ORIGIN}${page.path}`) issues.push(`${page.path} canonical mismatch`);
    if (!html.includes('SoftwareApplication') || !html.includes('WebApplication')) issues.push(`${page.path} missing application schema`);
    if (!/id=["']sc-guide["']/i.test(html)) issues.push(`${page.path} missing visible guide`);
  }

  for (const path of LEGACY_PATHS) {
    const response = await fetchFresh(path);
    const body = await response.text();
    if (response.status !== 404 && response.status !== 410) {
      issues.push(`${path} must be 404/410, got ${response.status}`);
    }
    if (response.status === 200 && body.includes('Turn industrial inputs into defensible decisions.')) {
      issues.push(`${path} is a homepage soft-404`);
    }
  }

  return issues;
}

let lastIssues = [];
for (let attempt = 1; attempt <= 6; attempt += 1) {
  try {
    lastIssues = await runOnce();
    if (lastIssues.length === 0) {
      console.log('[PASS] Live SEO guard: production crawl, sitemap, robots, canonicals, schemas and retired-route status are clean');
      process.exit(0);
    }
  } catch (error) {
    lastIssues = [error instanceof Error ? error.message : String(error)];
  }
  console.error(`[WARN] live SEO guard attempt ${attempt}/6 failed`);
  for (const issue of lastIssues) console.error(` - ${issue}`);
  if (attempt < 6) await sleep(10000);
}

console.error('[FAIL] Live SEO guard after deployment');
for (const issue of lastIssues) console.error(` - ${issue}`);
process.exit(1);
