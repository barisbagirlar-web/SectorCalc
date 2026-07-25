#!/usr/bin/env node
/** SectorCalc release SEO guard — fail closed on crawl/index/discovery/release regressions. */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const HOST = 'https://sectorcalc.com';
const errors = [];
const fail = (msg) => errors.push(msg);
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

const toolPages = readdirSync(ROOT).filter((f) => f.endsWith('-pro.html')).sort();
const pages = ['index.html', 'tools.html', 'pro.html', 'pricing.html', ...toolPages];
const contentRoutes = [
  ['/blog/', 'public/blog/index.html'],
  ['/blog/tolerance-stack-up-rss-vs-monte-carlo.html', 'public/blog/tolerance-stack-up-rss-vs-monte-carlo.html'],
  ['/case-studies/', 'public/case-studies/index.html'],
];
const localePreviews = ['de', 'ja', 'zh'];

for (const f of [
  'public/robots.txt', 'public/ai-robots.txt', 'public/sitemap.xml',
  'public/sitemap-images.xml', 'public/llm.txt', 'public/llms.txt', 'public/404.html',
  'public/assets/js/cvw-monitor.js', 'public/assets/js/sc-ga4-id.js',
  'public/assets/images/sectorcalc-og-1200x630.jpg',
  'scripts/seo-live-guard.mjs', '.github/workflows/deploy.yml',
]) if (!existsSync(join(ROOT, f))) fail(`missing ${f}`);

for (const [, file] of contentRoutes) if (!existsSync(join(ROOT, file))) fail(`missing ${file}`);
for (const lang of localePreviews) if (!existsSync(join(ROOT, `public/${lang}/index.html`))) fail(`missing locale preview public/${lang}/index.html`);

const robots = read('public/robots.txt');
if (!/Sitemap:\s*https:\/\/sectorcalc\.com\/sitemap\.xml/.test(robots)) fail('robots missing apex sitemap');
if (/Sitemap:\s*https:\/\/www\.sectorcalc\.com/i.test(robots)) fail('robots advertises www sitemap');
for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'PerplexityBot']) {
  const block = new RegExp(`User-agent:\\s*${bot.replace('-', '\\-')}[\\s\\S]*?(?=\\nUser-agent:|\\nSitemap:|$)`, 'i').exec(robots)?.[0] || '';
  if (!block) fail(`robots missing explicit ${bot} policy`);
  else if (!/Allow:\s*\//i.test(block) || /Disallow:\s*\/\s*$/im.test(block)) fail(`robots does not explicitly allow ${bot}`);
}

const sm = read('public/sitemap.xml');
if (!/<urlset\b[^>]*xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/i.test(sm)) fail('sitemap missing sitemaps.org urlset namespace');
if (/<priority>|<changefreq>|<lastmod>/i.test(sm)) fail('sitemap contains ignored or untrusted freshness hints');
if (/https:\/\/www\.sectorcalc\.com/i.test(sm)) fail('sitemap contains www URL');
for (const junk of ['llm.txt', 'llms.txt', 'robots.txt', 'ai-robots.txt', 'site.webmanifest', '404.html']) {
  if (sm.includes(`<loc>${HOST}/${junk}</loc>`)) fail(`sitemap contains non-indexable discovery URL ${junk}`);
}
for (const lang of localePreviews) if (sm.includes(`<loc>${HOST}/${lang}/</loc>`)) fail(`sitemap contains incomplete noindex locale ${lang}`);

const requiredLocs = [
  `${HOST}/`, `${HOST}/tools.html`, `${HOST}/pro.html`, `${HOST}/pricing.html`,
  ...toolPages.map((p) => `${HOST}/${p}`),
  ...contentRoutes.map(([route]) => `${HOST}${route}`),
];
for (const loc of requiredLocs) if (!sm.includes(`<loc>${loc}</loc>`)) fail(`sitemap missing ${loc}`);
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (new Set(locs).size !== locs.length) fail('sitemap contains duplicate loc entries');
if (locs.length !== requiredLocs.length) fail(`sitemap URL count drift: expected ${requiredLocs.length}, got ${locs.length}`);
for (const loc of locs) {
  if (!requiredLocs.includes(loc)) fail(`sitemap contains unregistered URL ${loc}`);
  if (!loc.startsWith(`${HOST}/`)) fail(`sitemap contains off-host URL ${loc}`);
  if (/[?#]/.test(loc)) fail(`sitemap URL contains query or fragment ${loc}`);
}

for (const lang of localePreviews) {
  const t = read(`public/${lang}/index.html`);
  if (!/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex[^"']*follow/i.test(t)) fail(`${lang} preview must be noindex,follow`);
  if (!t.includes(`rel="canonical" href="${HOST}/${lang}/"`)) fail(`${lang} preview missing self canonical`);
  if (/hreflang=/i.test(t)) fail(`${lang} preview must not publish hreflang until full locale release`);
}

const llm = read('public/llm.txt');
const llms = read('public/llms.txt');
if (llm !== llms) fail('llm.txt and llms.txt drift; they must be byte-identical');
for (const lang of localePreviews) if (llms.includes(`${HOST}/${lang}/`)) fail(`llms.txt advertises noindex locale ${lang}`);
for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'PerplexityBot']) if (!llms.includes(bot)) fail(`llms.txt missing crawler declaration ${bot}`);

const simg = read('public/sitemap-images.xml');
const imageParents = [...simg.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!imageParents.includes(`${HOST}/tools.html`)) fail('image sitemap missing tools.html entry');
for (const parent of imageParents) if (!requiredLocs.includes(parent)) fail(`image sitemap parent is not canonical/indexable: ${parent}`);

for (const page of pages) {
  const t = read(page);
  if (/noindex/i.test(t)) fail(`${page} has noindex`);
  if (!t.includes('rel="canonical"')) fail(`${page} missing canonical`);
  if (!t.includes(HOST)) fail(`${page} canonical host not apex`);
  if (!/name=["']description["']/.test(t)) fail(`${page} missing meta description`);
  if (!t.includes('og:image')) fail(`${page} missing og:image`);
  if (!t.includes('sc-schema-global')) fail(`${page} missing global schema`);
  if (/AggregateRating|"@type":\s*"Review"/.test(t)) fail(`${page} has review schema risk`);
  if (!/<h1[\s>]/i.test(t)) fail(`${page} missing h1`);
  if (!t.includes('SC-SEO-HOST')) fail(`${page} missing SEO host marker`);
  if (!t.includes('SC-SEO-SECURITY')) fail(`${page} missing security head block`);
  if (page.endsWith('-pro.html')) {
    const slug = page.replace('.html', '');
    if (!t.includes(`sc-schema-tool-${slug}`)) fail(`${page} missing tool schema`);
    if (!t.includes('sc-breadcrumb')) fail(`${page} missing breadcrumb nav`);
  }
}

for (const [route, file] of contentRoutes) {
  const t = read(file);
  const canonical = `${HOST}${route}`;
  if (/noindex/i.test(t)) fail(`${file} has noindex`);
  if (!t.includes(`rel="canonical" href="${canonical}"`)) fail(`${file} canonical mismatch; expected ${canonical}`);
  if (!/name=["']description["']/.test(t)) fail(`${file} missing meta description`);
  if (!/<h1[\s>]/i.test(t)) fail(`${file} missing h1`);
}

const fj = JSON.parse(read('firebase.json'));
if ((fj.hosting?.rewrites || []).some((r) => r.destination === '/index.html')) fail('firebase SPA catch-all would create soft 404s');

const deploy = read('.github/workflows/deploy.yml');
if (!/branches:\s*\[main\]/.test(deploy)) fail('production deploy must be main-only');
if (!deploy.includes('hosting:channel:deploy')) fail('production release must deploy a Firebase preview candidate first');
if (!deploy.includes('SEO_GUARD_MODE: preview')) fail('production release must validate preview candidate before promotion');
if (!deploy.includes('hosting:clone')) fail('production release must promote the exact validated Firebase version');
if (!deploy.includes('sectorcalc-prod:live')) fail('Firebase clone target must be the live channel');
if (!deploy.includes('SEO_GUARD_MODE: live')) fail('production release must verify custom-domain live state after promotion');
if (!deploy.includes('seo-live-guard.mjs')) fail('production release missing remote SEO guard');
if (/firebase-tools@14\s+deploy\s+--only\s+hosting/.test(deploy)) fail('direct unvalidated Firebase live deploy is forbidden; use preview + clone');
if (/cancel-in-progress:\s*true/.test(deploy)) fail('production promotion workflow must not be cancelled mid-release');

if (errors.length) {
  console.error('[FAIL] SEO release guard:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`[PASS] SEO release guard: ${requiredLocs.length} canonical URLs, ${toolPages.length} tools, locale previews quarantined, discovery synchronized, preview-before-live promotion enforced`);
