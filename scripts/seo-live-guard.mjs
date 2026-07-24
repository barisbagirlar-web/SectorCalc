#!/usr/bin/env node
import { LEGACY_WWW_ORIGIN, SITE_ORIGIN, TOOL_PAGES, canonicalUrls } from './seo-registry.mjs';

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
const VALID_SCOPES = new Set(['all', 'host', 'www', 'home', 'discovery', 'tools', 'legacy']);
const rawScope = process.argv.find((arg) => arg.startsWith('--scope='))?.split('=')[1] ?? 'all';
if (!VALID_SCOPES.has(rawScope)) {
  console.error(`[FAIL] unknown live SEO scope: ${rawScope}`);
  process.exit(2);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchAbsoluteFresh(url, init = {}) {
  const separator = url.includes('?') ? '&' : '?';
  return fetch(`${url}${separator}seo_guard=${Date.now()}`, {
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

async function fetchFresh(path, init = {}) {
  return fetchAbsoluteFresh(`${SITE_ORIGIN}${path}`, init);
}

function canonicalFrom(html) {
  return html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] ?? null;
}

function includeScope(scope) {
  if (rawScope === 'all') return true;
  if (rawScope === 'host') return scope === 'www' || scope === 'home';
  return rawScope === scope;
}

async function checkWww(issues) {
  const legacyHost = await fetchAbsoluteFresh(`${LEGACY_WWW_ORIGIN}/`);
  const legacyLocation = legacyHost.headers.get('location') ?? '';
  if (![301, 308].includes(legacyHost.status)) issues.push(`www host must permanently redirect, got ${legacyHost.status}`);
  if (!legacyLocation.startsWith(`${SITE_ORIGIN}/`)) issues.push(`www host redirects outside canonical apex: ${legacyLocation || 'missing Location'}`);
}

async function checkHome(issues) {
  const home = await fetchFresh('/');
  const homeBody = await home.text();
  if (home.status !== 200) issues.push(`home status ${home.status}`);
  if (!homeBody.includes('Turn industrial inputs into defensible decisions.')) issues.push('home body does not match current production architecture');
  const homeCanonical = canonicalFrom(homeBody);
  if (homeCanonical !== `${SITE_ORIGIN}/`) issues.push(`home canonical mismatch: ${homeCanonical ?? 'missing'}`);
}

async function checkDiscovery(issues) {
  const robotsRes = await fetchFresh('/robots.txt');
  const robots = await robotsRes.text();
  if (robotsRes.status !== 200) issues.push(`robots status ${robotsRes.status}`);
  for (const agent of REQUIRED_AGENTS) if (!robots.includes(`User-agent: ${agent}`)) issues.push(`robots missing ${agent}`);
  if (!robots.includes(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`)) issues.push('robots sitemap declaration mismatch');
  if (robots.includes(LEGACY_WWW_ORIGIN)) issues.push('robots still exposes www discovery URLs');

  const sitemapRes = await fetchFresh('/sitemap.xml');
  const sitemap = await sitemapRes.text();
  if (sitemapRes.status !== 200) issues.push(`sitemap status ${sitemapRes.status}`);
  if (sitemap.includes('<priority>') || sitemap.includes('<changefreq>')) issues.push('sitemap contains ignored priority/changefreq signals');
  if (sitemap.includes(LEGACY_WWW_ORIGIN)) issues.push('sitemap still contains www canonical URLs');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const expected = canonicalUrls();
  if (locs.length !== expected.length) issues.push(`sitemap URL count ${locs.length} != ${expected.length}`);
  if (new Set(locs).size !== locs.length) issues.push('sitemap contains duplicate URLs');
  for (const url of expected) if (!locs.includes(url)) issues.push(`sitemap missing ${url}`);

  const llmsRes = await fetchFresh('/llms.txt');
  const llms = await llmsRes.text();
  if (llmsRes.status !== 200) issues.push(`llms status ${llmsRes.status}`);
  if (llms.includes(LEGACY_WWW_ORIGIN)) issues.push('llms still contains www canonical URLs');
  for (const page of TOOL_PAGES) {
    const url = `${SITE_ORIGIN}${page.path}`;
    if (!llms.includes(url)) issues.push(`llms missing ${url}`);
  }

  const llmRes = await fetchFresh('/llm.txt');
  const llm = await llmRes.text();
  if (llmRes.status !== 200) issues.push(`llm status ${llmRes.status}`);
  if (llm !== llms) issues.push('llm.txt diverges from llms.txt');
}

async function checkTools(issues) {
  for (const page of TOOL_PAGES) {
    const response = await fetchFresh(page.path);
    const html = await response.text();
    if (response.status !== 200) issues.push(`${page.path} status ${response.status}`);
    if (canonicalFrom(html) !== `${SITE_ORIGIN}${page.path}`) issues.push(`${page.path} canonical mismatch`);
    if (!html.includes('SoftwareApplication') || !html.includes('WebApplication')) issues.push(`${page.path} missing application schema`);
    if (!/id=["']sc-guide["']/i.test(html)) issues.push(`${page.path} missing visible guide`);
    if (!/<h1\b/i.test(html)) issues.push(`${page.path} missing raw HTML H1`);
  }
}

async function checkLegacy(issues) {
  for (const path of LEGACY_PATHS) {
    const response = await fetchFresh(path);
    const body = await response.text();
    if (response.status !== 404 && response.status !== 410) issues.push(`${path} must be 404/410, got ${response.status}`);
    if (response.status === 200 && body.includes('Turn industrial inputs into defensible decisions.')) issues.push(`${path} is a homepage soft-404`);
  }
}

async function runOnce() {
  const issues = [];
  if (includeScope('www')) await checkWww(issues);
  if (includeScope('home')) await checkHome(issues);
  if (includeScope('discovery')) await checkDiscovery(issues);
  if (includeScope('tools')) await checkTools(issues);
  if (includeScope('legacy')) await checkLegacy(issues);
  return issues;
}

let lastIssues = [];
for (let attempt = 1; attempt <= 6; attempt += 1) {
  try {
    lastIssues = await runOnce();
    if (lastIssues.length === 0) {
      console.log(`[PASS] Live SEO guard scope=${rawScope}`);
      process.exit(0);
    }
  } catch (error) {
    lastIssues = [error instanceof Error ? error.message : String(error)];
  }
  console.error(`[WARN] live SEO guard scope=${rawScope} attempt ${attempt}/6 failed`);
  for (const issue of lastIssues) console.error(` - ${issue}`);
  if (attempt < 6) await sleep(10000);
}

console.error(`[FAIL] Live SEO guard scope=${rawScope}`);
for (const issue of lastIssues) console.error(` - ${issue}`);
process.exit(1);
