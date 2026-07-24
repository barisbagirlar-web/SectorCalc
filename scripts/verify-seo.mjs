#!/usr/bin/env node
/**
 * SEO guard — fail build on indexing blockers / missing discovery / spam schema.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const HOST = 'https://sectorcalc.com';
const errors = [];
const warn = [];

function fail(msg) { errors.push(msg); }
function note(msg) { warn.push(msg); }

const pages = ['index.html', 'tools.html', 'pro.html', 'pricing.html',
  ...readdirSync(ROOT).filter((f) => f.endsWith('-pro.html'))];

for (const f of [
  'public/robots.txt',
  'public/ai-robots.txt',
  'public/sitemap.xml',
  'public/sitemap-images.xml',
  'public/sitemap-videos.xml',
  'public/llm.txt',
  'public/llms.txt',
  'public/404.html',
  'public/assets/js/cvw-monitor.js',
  'public/assets/js/sc-ga4-id.js',
  'public/assets/images/sectorcalc-og-1200x630.jpg',
]) {
  if (!existsSync(join(ROOT, f))) fail(`missing ${f}`);
}

const robots = readFileSync(join(ROOT, 'public/robots.txt'), 'utf8');
if (!/Sitemap:\s*https:\/\/sectorcalc\.com\/sitemap\.xml/.test(robots)) {
  fail('robots.txt missing apex sitemap declaration');
}
if (/User-agent:\s*Googlebot[\s\S]*?Disallow:\s*\/\s*$/m.test(robots.split('User-agent: GPTBot')[0])) {
  fail('Googlebot appears disallowed');
}

const sm = readFileSync(join(ROOT, 'public/sitemap.xml'), 'utf8');
for (const page of pages) {
  const loc = page === 'index.html' ? `${HOST}/` : `${HOST}/${page}`;
  if (!sm.includes(`<loc>${loc}</loc>`)) fail(`sitemap missing ${loc}`);
}
if (sm.includes('https://www.sectorcalc.com/') && !sm.includes('https://sectorcalc.com/')) {
  fail('sitemap still uses www without apex canonical host');
}
// HTML sitemap must not list discovery/binary endpoints (indexation noise)
for (const junk of ['llm.txt', 'llms.txt', 'site.webmanifest', 'robots.txt', 'ai-robots.txt']) {
  if (sm.includes(`<loc>${HOST}/${junk}</loc>`)) {
    fail(`sitemap must not list non-HTML URL: ${junk}`);
  }
}
if (/hreflang="(de|ja|zh)"/.test(sm)) {
  fail('sitemap claims hreflang locales without localized pages');
}

const sv = readFileSync(join(ROOT, 'public/sitemap-videos.xml'), 'utf8');
if (/view_count|content_loc/.test(sv)) fail('video sitemap contains invented entries');

for (const page of pages) {
  const t = readFileSync(join(ROOT, page), 'utf8');
  if (/noindex/i.test(t) && page !== '404.html') fail(`${page} has noindex`);
  if (!t.includes('rel="canonical"')) fail(`${page} missing canonical`);
  if (!t.includes('https://sectorcalc.com')) fail(`${page} canonical host not apex sectorcalc.com`);
  if (/location\.hostname===['"]sectorcalc\.com['"].*www\.sectorcalc\.com/.test(t)) {
    fail(`${page} still redirects apex→www (conflicts with Firebase www→apex)`);
  }
  if (!/name=["']description["']/.test(t)) fail(`${page} missing meta description`);
  if (!t.includes('og:image')) fail(`${page} missing og:image`);
  if (!t.includes('sc-schema-global')) fail(`${page} missing global schema`);
  if (/AggregateRating|"@type":\s*"Review"/.test(t)) fail(`${page} has Review/AggregateRating spam risk`);
  if (!t.includes('cvw-monitor.js')) fail(`${page} missing cvw-monitor`);
  if (!t.includes('SC-SEO-HOST')) fail(`${page} missing SC-SEO-HOST marker`);
  if (!/<h1[\s>]/i.test(t)) fail(`${page} missing h1`);
  if (page.endsWith('-pro.html')) {
    const slug = page.replace('.html', '');
    if (!t.includes(`sc-schema-tool-${slug}`)) fail(`${page} missing tool schema`);
    if (!t.includes(`sc-schema-dataset-${slug}`)) fail(`${page} missing Dataset schema`);
    if (!t.includes('sc-breadcrumb') && page !== 'index.html') fail(`${page} missing breadcrumb nav`);
    if (!t.includes('Prof. Dr. Neela Nataraj')) fail(`${page} missing visible E-E-A-T academic oversight`);
    if (!t.includes('sc-eeat.css')) fail(`${page} missing sc-eeat.css`);
    if (!t.includes('Academic Oversight')) fail(`${page} missing Academic Oversight label`);
    if (!/"reviewedBy"/.test(t)) fail(`${page} missing reviewedBy entity link`);
  }
  if (['tools.html', 'pricing.html', 'pro.html'].includes(page) && !t.includes('sc-breadcrumb')) {
    fail(`${page} missing breadcrumb nav`);
  }
  if (!t.includes('SC-SEO-SECURITY')) fail(`${page} missing security head block`);
}

const fj = JSON.parse(readFileSync(join(ROOT, 'firebase.json'), 'utf8'));
const rewrites = fj.hosting?.rewrites || [];
if (rewrites.some((r) => r.destination === '/index.html')) {
  fail('firebase SPA catch-all rewrite would soft-404 missing URLs');
}

if (errors.length) {
  console.error('[FAIL] SEO guard:\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`[PASS] SEO guard: ${pages.length} pages + discovery OK` + (warn.length ? ` (${warn.length} notes)` : ''));
