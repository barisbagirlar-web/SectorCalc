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
  for (const lang of ['de', 'ja', 'zh']) {
    if (new RegExp(`hreflang="${lang}"`).test(sm) && !existsSync(join(ROOT, `public/${lang}/index.html`))) {
      fail(`sitemap claims hreflang=${lang} without public/${lang}/index.html`);
    }
  }
}

// Content hubs from sert-yenileme pack
for (const hub of [
  'public/blog/index.html',
  'public/blog/tolerance-stack-up-rss-vs-monte-carlo.html',
  'public/case-studies/index.html',
  'public/de/index.html',
  'public/ja/index.html',
  'public/zh/index.html'
]) {
  if (!existsSync(join(ROOT, hub))) fail(`missing hub ${hub}`);
}
for (const loc of [
  `${HOST}/blog/`,
  `${HOST}/blog/tolerance-stack-up-rss-vs-monte-carlo.html`,
  `${HOST}/case-studies/`,
  `${HOST}/de/`,
  `${HOST}/ja/`,
  `${HOST}/zh/`
]) {
  if (!sm.includes(`<loc>${loc}</loc>`)) fail(`sitemap missing hub ${loc}`);
}

const llm = readFileSync(join(ROOT, 'public/llm.txt'), 'utf8');
const llms = readFileSync(join(ROOT, 'public/llms.txt'), 'utf8');
if (!llm.includes('Academic Oversight') || !llm.includes('Prof. Dr. Neela Nataraj')) {
  fail('llm.txt missing Academic Oversight / Neela Nataraj section');
}
if (!llms.includes('Academic Oversight') || !llms.includes('Prof. Dr. Neela Nataraj')) {
  fail('llms.txt missing Academic Oversight / Neela Nataraj section');
}
if (!llm.includes('assets/images/neela-nataraj.jpg')) {
  fail('llm.txt missing Neela portrait asset URL');
}
const simg = readFileSync(join(ROOT, 'public/sitemap-images.xml'), 'utf8');
if (!simg.includes(`${HOST}/assets/images/neela-nataraj.jpg`)) {
  fail('sitemap-images.xml missing Neela portrait');
}
if (!simg.includes(`${HOST}/tools.html`)) {
  fail('sitemap-images.xml missing tools.html entry');
}
if (!existsSync(join(ROOT, 'public/assets/images/neela-nataraj.jpg'))) {
  fail('missing public/assets/images/neela-nataraj.jpg');
}
if (!existsSync(join(ROOT, 'public/sc-eeat.css'))) {
  fail('missing public/sc-eeat.css');
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
    if (!t.includes('assets/images/neela-nataraj.jpg')) fail(`${page} missing Neela portrait image`);
    if (!/"reviewedBy"/.test(t)) fail(`${page} missing reviewedBy entity link`);
    if (!t.includes('sc-calc-sheet.css')) fail(`${page} missing calculation-sheet CSS`);
    if (!t.includes('theme-calc-sheet')) fail(`${page} missing theme-calc-sheet body class`);
  }
  if (page === 'tools.html') {
    if (!t.includes('Prof. Dr. Neela Nataraj')) fail(`${page} missing visible E-E-A-T academic oversight`);
    if (!t.includes('sc-eeat.css')) fail(`${page} missing sc-eeat.css`);
    if (!t.includes('assets/images/neela-nataraj.jpg')) fail(`${page} missing Neela portrait image`);
    if (!t.includes('sc-calc-sheet.css')) fail(`${page} missing drawing-index CSS`);
    if (!t.includes('theme-drawing-index')) fail(`${page} missing theme-drawing-index`);
  }
  if (page === 'pricing.html') {
    if (!t.includes('sc-calc-sheet.css')) fail(`${page} missing BOM sheet CSS`);
    if (!t.includes('theme-bom')) fail(`${page} missing theme-bom`);
  }
  if (page === 'index.html') {
    if (t.includes('sc-calc-sheet.css') || t.includes('theme-calc-sheet') || t.includes('theme-blueprint')) {
      fail('index.html must not carry calc-sheet / blueprint theme (live-cell hero sacred)');
    }
    if (!t.includes('sc-hero-cell')) fail('index.html missing sc-hero-cell');
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
