#!/usr/bin/env node
/** SectorCalc release SEO guard — fail closed on crawl/index/discovery/release regressions.
 * Canonical maps come from seo/registry.mjs (SSOT). No parallel TOOL_CANONICAL.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  HOST,
  toolCanonicalBySourceFile,
  sitemapLocs,
  publishedCalculators,
  llmEligibleCalculators,
  validateRegistryInvariants,
  absoluteUrl,
} from '../seo/registry.mjs';


const ROOT = process.cwd();
const errors = [];
const fail = (msg) => errors.push(msg);
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

const TOOL_CANONICAL = toolCanonicalBySourceFile();
const toolPages = readdirSync(ROOT).filter((f) => f.endsWith('-pro.html')).sort();
const pages = ['index.html', 'tools.html', 'pro.html', 'pricing.html', ...toolPages];

const contentRoutes = [
  ['/blog', 'public/blog/index.html'],
  ['/blog/tolerance-stack-up-rss-vs-monte-carlo.html', 'public/blog/tolerance-stack-up-rss-vs-monte-carlo.html'],
];
const noindexAllowedRoutes = new Set(['/case-studies']);
// Case studies hub is intentionally noindex until verified studies ship.
contentRoutes.push(['/case-studies', 'public/case-studies/index.html']);
for (const folder of ['glossary', 'compare', 'guides', 'about', 'contact', 'privacy', 'terms', 'resources', 'topics']) {
  const dir = join(ROOT, 'public', folder);
  if (!existsSync(dir)) continue;
  contentRoutes.push([`/${folder}`, `public/${folder}/index.html`]);
  for (const name of readdirSync(dir).filter((f) => f.endsWith('.html') && f !== 'index.html').sort()) {
    const slug = name.replace(/\.html$/, '');
    const route = folder === 'blog' ? `/${folder}/${name}` : `/${folder}/${slug}`;
    contentRoutes.push([route, `public/${folder}/${name}`]);
  }
}
const localePreviews = ['de', 'ja', 'zh'];

for (const e of validateRegistryInvariants()) fail(e);

for (const f of [
  'public/robots.txt', 'public/ai-robots.txt', 'public/sitemap.xml',
  'public/sitemap-images.xml', 'public/llm.txt', 'public/llms.txt', 'public/404.html',
  'public/assets/js/cvw-monitor.js', 'public/assets/js/sc-ga4-id.js', 'public/assets/js/sc-funnel-analytics.js',
  'public/assets/images/sectorcalc-og-1200x630.jpg',
  'scripts/seo-live-guard.mjs', '.github/workflows/deploy.yml',
  'seo/registry.mjs', 'seo/registry-data.mjs',
]) if (!existsSync(join(ROOT, f))) fail(`missing ${f}`);

for (const [, file] of contentRoutes) if (!existsSync(join(ROOT, file))) fail(`missing ${file}`);
for (const lang of localePreviews) if (!existsSync(join(ROOT, `public/${lang}/index.html`))) fail(`missing locale preview public/${lang}/index.html`);

for (const page of toolPages) {
  if (!TOOL_CANONICAL[page]) fail(`registry missing calculator canonical for ${page}`);
}

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

const requiredUnique = [...new Set(sitemapLocs())];
for (const loc of requiredUnique) if (!sm.includes(`<loc>${loc}</loc>`)) fail(`sitemap missing ${loc}`);
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (new Set(locs).size !== locs.length) fail('sitemap contains duplicate loc entries');
if (locs.length !== requiredUnique.length) fail(`sitemap URL count drift: expected ${requiredUnique.length}, got ${locs.length}`);
for (const loc of locs) {
  if (!requiredUnique.includes(loc)) fail(`sitemap contains unregistered URL ${loc}`);
  if (!loc.startsWith(`${HOST}/`)) fail(`sitemap contains off-host URL ${loc}`);
  if (/[?#]/.test(loc)) fail(`sitemap URL contains query or fragment ${loc}`);
  if (/\/[a-z0-9-]+-pro\.html$/i.test(loc)) fail(`sitemap must not list legacy calculator file URL ${loc}`);
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

// P0: LLM content must track registry — not merely be byte-identical to each other while both stale.
const llmCalcs = llmEligibleCalculators();
const llmToolCount = llmCalcs.length;
if (!llms.includes(`## Live tools — ${llmToolCount}`)) fail(`llms.txt tool count must be ${llmToolCount} (llmEligibleCalculators)`);
if (/\*\*32\*\*\s+canonical indexable HTML URLs/i.test(llms)) fail('llms.txt still claims stale 32 sitemap URLs');
if (!llms.includes(`**${requiredUnique.length}**`)) fail(`llms.txt must declare registry sitemap count ${requiredUnique.length}`);
for (const page of toolPages) {
  const legacyAbs = `${HOST}/${page}`;
  if (llms.includes(`](${legacyAbs})`) || llms.includes(`](${legacyAbs.replace('https://', 'http://')})`)) {
    fail(`llms.txt primary link uses legacy URL ${legacyAbs}`);
  }
}
for (const calc of llmCalcs) {
  if (!llms.includes(absoluteUrl(calc.canonicalPath))) fail(`llms.txt missing llm-eligible canonical ${calc.canonicalPath}`);
}
// Unpublished / non-llmEligible calculators must not be required in llms
for (const calc of publishedCalculators()) {
  if (calc.llmEligible === false && llms.includes(absoluteUrl(calc.canonicalPath))) {
    fail(`llms.txt includes llmEligible=false calculator ${calc.canonicalPath}`);
  }
}
const legacyPrimary = [...llms.matchAll(/https:\/\/sectorcalc\.com\/[a-z0-9-]+-pro\.html/gi)];
if (legacyPrimary.length) fail(`llms.txt contains ${legacyPrimary.length} legacy *-pro.html URL(s)`);

const simg = read('public/sitemap-images.xml');
const imageParents = [...simg.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!imageParents.includes(`${HOST}/tools.html`)) fail('image sitemap missing tools.html entry');
for (const parent of imageParents) if (!requiredUnique.includes(parent)) fail(`image sitemap parent is not canonical/indexable: ${parent}`);

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
  // Meta CSP intersects with header CSP — Auth fails if meta omits securetoken.
  const cspMeta = t.match(/http-equiv=["']Content-Security-Policy["'][^>]*\scontent="([^"]+)"/i)
    || t.match(/\scontent="([^"]+)"[^>]*http-equiv=["']Content-Security-Policy["']/i)
    || t.match(/http-equiv=["']Content-Security-Policy["'][^>]*\scontent='([^']+)'/i);
  if (!cspMeta) fail(`${page} missing CSP meta`);
  const csp = cspMeta[1];
  for (const host of [
    'https://securetoken.googleapis.com',
    'https://identitytoolkit.googleapis.com',
    'https://firestore.googleapis.com',
    'https://*.cloudfunctions.net',
    'https://apis.google.com',
  ]) {
    if (!csp.includes(host)) fail(`${page} CSP meta missing required host ${host}`);
  }
  if (/frame-ancestors/i.test(csp)) {
    fail(`${page} CSP meta must not include frame-ancestors (header-only directive)`);
  }
  if (page.endsWith('-pro.html')) {
    const slug = page.replace('.html', '');
    if (!t.includes(`sc-schema-tool-${slug}`)) fail(`${page} missing tool schema`);
    if (!t.includes('sc-breadcrumb')) fail(`${page} missing breadcrumb nav`);
    const pretty = TOOL_CANONICAL[page];
    if (pretty && !t.includes(`rel="canonical" href="${HOST}${pretty}"`)) {
      fail(`${page} canonical must point to pretty URL ${pretty}`);
    }
  }
}

for (const [route, file] of contentRoutes) {
  const t = read(file);
  if (/noindex/i.test(t) && !noindexAllowedRoutes.has(route)) fail(`${file} has noindex`);
  if (noindexAllowedRoutes.has(route) && !/noindex/i.test(t)) fail(`${file} must stay noindex until verified case studies ship`);
  const canonical = `${HOST}${route}`;
  if (!t.includes(`rel="canonical" href="${canonical}"`)) fail(`${file} canonical mismatch; expected ${canonical}`);
  if (!/name=["']description["']/.test(t)) fail(`${file} missing meta description`);
  if (!/<h1[\s>]/i.test(t)) fail(`${file} missing h1`);
}

// tools.html Engineering Resources must sit inside .wrap before footer (never orphan body child).
{
  const tools = read('tools.html');
  const start = '<!--SC-SEO-SPRINT-LINKS-START-->';
  const wrapIdx = tools.indexOf('class="wrap"');
  const blockIdx = tools.indexOf(start);
  const footerIdx = tools.indexOf('<footer>');
  if (blockIdx < 0) fail('tools.html missing Engineering Resources (SC-SEO-SPRINT-LINKS) block');
  if (wrapIdx < 0 || footerIdx < 0) fail('tools.html missing wrap/footer anchors for resources placement');
  if (!(wrapIdx < blockIdx && blockIdx < footerIdx)) {
    fail('tools.html Engineering Resources must be inside .wrap before <footer> (orphan body child breaks layout)');
  }
  if (!tools.includes('sc-seo-sprint-links')) fail('tools.html missing sc-seo-sprint-links class');
  if (!/sc-calc-sheet\.css\?v=2/.test(tools) && !tools.includes('/sc-calc-sheet.css?v=2')) {
    fail('tools.html must load sc-calc-sheet.css?v=2 (Engineering Resources styles)');
  }
  const distTools = join(ROOT, 'dist/tools.html');
  if (existsSync(distTools)) {
    const dt = readFileSync(distTools, 'utf8');
    const dBlock = dt.indexOf(start);
    const dWrap = dt.indexOf('class="wrap"');
    const dFoot = dt.indexOf('<footer>');
    if (!(dWrap < dBlock && dBlock < dFoot)) fail('dist/tools.html Engineering Resources placement drifted outside .wrap');
  }
}

// pricing.html is commerce BOM — AEO problem-map chrome is forbidden (kills page soul).
// tools.html catalog DNA is sacred — problem map lives on / and /topics only.
{
  for (const page of ['pricing.html', 'tools.html']) {
    const html = read(page);
    if (/sc-aeo-hub|problems-we-solve|SC-AEO-HUB|Answer engine · problem first/i.test(html)) {
      fail(`${page} must not include AEO problem-map hub`);
    }
    const distPage = join(ROOT, 'dist', page);
    if (existsSync(distPage)) {
      const dp = readFileSync(distPage, 'utf8');
      if (/sc-aeo-hub|problems-we-solve|SC-AEO-HUB/i.test(dp)) {
        fail(`dist/${page} still contains AEO problem-map hub`);
      }
    }
  }
}

const fj = JSON.parse(read('firebase.json'));
if ((fj.hosting?.rewrites || []).some((r) => r.destination === '/index.html')) fail('firebase SPA catch-all would create soft 404s');
for (const [oldFile, pretty] of Object.entries(TOOL_CANONICAL)) {
  const hasRewrite = (fj.hosting?.rewrites || []).some((r) => r.source === pretty && r.destination === `/${oldFile}`);
  if (!hasRewrite) fail(`firebase missing rewrite ${pretty} -> /${oldFile}`);
  const hasRedirect = (fj.hosting?.redirects || []).some((r) => r.source === `/${oldFile}` && r.destination === pretty && Number(r.type) === 301);
  if (!hasRedirect) fail(`firebase missing 301 ${oldFile} -> ${pretty}`);
}

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
console.log(`[PASS] SEO release guard: ${requiredUnique.length} canonical URLs, ${toolPages.length} tools, registry SSOT, llms/sitemap parity, locale previews quarantined, preview-before-live promotion enforced`);
