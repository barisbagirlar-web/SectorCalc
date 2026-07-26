#!/usr/bin/env node
/**
 * SectorCalc remote SEO release guard.
 *
 * Preview mode validates Firebase preview content while requiring production
 * canonical URLs. Live mode validates the custom-domain deployment after
 * atomic promotion.
 */
const CANONICAL_HOST = 'https://sectorcalc.com';
const FETCH_HOST = (process.env.SEO_GUARD_HOST || CANONICAL_HOST).replace(/\/$/, '');
const MODE = process.env.SEO_GUARD_MODE || (FETCH_HOST === CANONICAL_HOST ? 'live' : 'preview');
const errors = [];
const fail = (m) => errors.push(m);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const nonce = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

if (!['preview', 'live'].includes(MODE)) throw new Error(`Unsupported SEO_GUARD_MODE: ${MODE}`);
if (!/^https:\/\//.test(FETCH_HOST)) throw new Error(`SEO_GUARD_HOST must be an https origin: ${FETCH_HOST}`);

function shouldRetry(res, text) {
  if (res.status >= 500) return true;
  // Firebase / CDN edge can briefly 404 with an HTML shell right after channel deploy.
  if (res.status === 404 && /text\/html/i.test(res.headers.get('content-type') || '')) return true;
  if (res.status === 404 && /<!doctype html/i.test(text || '')) return true;
  return false;
}

async function get(url, options = {}) {
  let lastError;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const res = await fetch(url, {
        redirect: options.redirect || 'follow',
        headers: options.headers || {},
        signal: AbortSignal.timeout(15000),
      });
      const text = await res.text();
      if (!shouldRetry(res, text) || attempt === 6) return { res, text };
      lastError = new Error(`HTTP ${res.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === 6) throw error;
    }
    await sleep(attempt * 2500);
  }
  throw lastError;
}

function remote(path) {
  const sep = path.includes('?') ? '&' : '?';
  return `${FETCH_HOST}${path}${sep}release_guard=${nonce()}`;
}

function canonicalOf(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1]
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1]
    || null;
}

const robots = await get(remote('/robots.txt'));
if (robots.res.status !== 200) fail(`robots.txt HTTP ${robots.res.status}`);
if (!/text\/plain/i.test(robots.res.headers.get('content-type') || '')) fail(`robots.txt content-type ${robots.res.headers.get('content-type') || 'missing'}`);
for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'PerplexityBot']) {
  const block = new RegExp(`User-agent:\\s*${bot.replace('-', '\\-')}[\\s\\S]*?(?=\\nUser-agent:|\\nSitemap:|$)`, 'i').exec(robots.text)?.[0] || '';
  if (!block || !/Allow:\s*\//i.test(block) || /Disallow:\s*\/\s*$/im.test(block)) fail(`robots policy invalid for ${bot}`);
}
if (!robots.text.includes(`Sitemap: ${CANONICAL_HOST}/sitemap.xml`)) fail('robots canonical sitemap declaration missing');
if (/Sitemap:\s*https:\/\/www\.sectorcalc\.com/i.test(robots.text)) fail('robots advertises www sitemap');

const sitemap = await get(remote('/sitemap.xml'));
if (sitemap.res.status !== 200) fail(`sitemap.xml HTTP ${sitemap.res.status}`);
if (!/(application|text)\/xml/i.test(sitemap.res.headers.get('content-type') || '')) fail(`sitemap.xml content-type ${sitemap.res.headers.get('content-type') || 'missing'}`);
if (!/<urlset\b[^>]*xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/i.test(sitemap.text)) fail('sitemap missing valid urlset namespace');
if (/<priority>|<changefreq>|<lastmod>/i.test(sitemap.text)) fail('sitemap contains priority/changefreq/lastmod');
if (/https:\/\/www\.sectorcalc\.com/i.test(sitemap.text)) fail('sitemap contains www URL');
for (const lang of ['de', 'ja', 'zh']) {
  if (sitemap.text.includes(`<loc>${CANONICAL_HOST}/${lang}/</loc>`) || sitemap.text.includes(`<loc>${CANONICAL_HOST}/${lang}</loc>`)) {
    fail(`sitemap contains quarantined locale ${lang}`);
  }
}

const locs = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length !== 78) fail(`sitemap expected 78 canonical HTML URLs, got ${locs.length}`);
if (new Set(locs).size !== locs.length) fail('sitemap has duplicate locs');
for (const url of locs) {
  if (!url.startsWith(`${CANONICAL_HOST}/`)) fail(`sitemap URL is off canonical host: ${url}`);
  if (/[?#]/.test(url)) fail(`sitemap URL contains query/fragment: ${url}`);
}

for (const canonicalUrl of locs) {
  const parsed = new URL(canonicalUrl);
  const { res, text } = await get(remote(`${parsed.pathname}${parsed.search}`), { redirect: 'manual' });
  if (res.status !== 200) { fail(`${canonicalUrl} HTTP ${res.status}; sitemap URLs must not redirect`); continue; }
  if (!/text\/html/i.test(res.headers.get('content-type') || '')) fail(`${canonicalUrl} non-HTML content-type ${res.headers.get('content-type') || 'missing'}`);
  // Firebase preview channels always inject X-Robots-Tag: noindex — only enforce on live.
  if (MODE === 'live' && /noindex/i.test(res.headers.get('x-robots-tag') || '')) fail(`${canonicalUrl} X-Robots-Tag contains noindex`);
  if (/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(text)) fail(`${canonicalUrl} meta robots contains noindex`);
  const canonical = canonicalOf(text);
  if (canonical !== canonicalUrl) fail(`${canonicalUrl} canonical mismatch: ${canonical || 'missing'}`);
  if (!/<h1[\s>]/i.test(text)) fail(`${canonicalUrl} missing raw HTML H1`);
}

const imageSitemap = await get(remote('/sitemap-images.xml'));
if (imageSitemap.res.status !== 200) fail(`sitemap-images.xml HTTP ${imageSitemap.res.status}`);
if (!/(application|text)\/xml/i.test(imageSitemap.res.headers.get('content-type') || '')) fail(`sitemap-images.xml content-type ${imageSitemap.res.headers.get('content-type') || 'missing'}`);
const imageParents = [...imageSitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const parent of imageParents) if (!locs.includes(parent)) fail(`image sitemap parent is not canonical/indexable: ${parent}`);

// trailingSlash:false → use /de not /de/ (slash form 301s).
for (const path of ['/de', '/ja', '/zh']) {
  const { res, text } = await get(remote(path), { redirect: 'manual' });
  if (res.status !== 200) fail(`${path} locale preview HTTP ${res.status}`);
  if (!/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex[^"']*follow/i.test(text)) fail(`${path} locale preview missing noindex,follow`);
  if (/hreflang=/i.test(text)) fail(`${path} locale preview publishes hreflang before full localization`);
  if (sitemap.text.includes(`<loc>${CANONICAL_HOST}${path}/</loc>`) || sitemap.text.includes(`<loc>${CANONICAL_HOST}${path}</loc>`)) {
    fail(`${path} noindex locale leaked into sitemap`);
  }
}

for (const legacy of ['/categories', '/developer-showcase', '/seo/construction-cost-calculators', '/guides/how-to-calculate-manufacturing-cost']) {
  const { res } = await get(remote(legacy), { redirect: 'manual' });
  if (![301, 308, 404, 410].includes(res.status)) fail(`legacy ${legacy} returns ${res.status}; expected exact redirect or 404/410`);
}

// Legacy calculator URLs and content .html twins must 301 to clean canonicals (no duplicate 200).
const mustRedirect = [
  ['/sc008-pro.html', '/calculator/tolerance-stack-up'],
  ['/machining-pro.html', '/calculator/cnc-feeds-speeds'],
  ['/glossary/tolerance-stack-up.html', '/glossary/tolerance-stack-up'],
  ['/guides/tolerance-stack-up-complete.html', '/guides/tolerance-stack-up-complete'],
  ['/compare/sectorcalc-vs-excel-tolerance.html', '/compare/sectorcalc-vs-excel-tolerance'],
  ['/resources/iso-286-quick-reference.html', '/resources/iso-286-quick-reference'],
  ['/about/index.html', '/about'],
  ['/blog/index.html', '/blog'],
];
for (const [from, to] of mustRedirect) {
  const { res } = await get(remote(from), { redirect: 'manual' });
  if (![301, 308].includes(res.status)) {
    fail(`${from} returns ${res.status}; expected 301/308 to ${to}`);
    continue;
  }
  const location = (res.headers.get('location') || '').split('?')[0];
  if (location !== to && location !== `${CANONICAL_HOST}${to}`) {
    fail(`${from} Location=${location || 'missing'}; expected ${to}`);
  }
}

const llm = await get(remote('/llm.txt'));
const llms = await get(remote('/llms.txt'));
if (llm.res.status !== 200 || llms.res.status !== 200) fail('LLM discovery files not HTTP 200');
if (!/text\/plain/i.test(llm.res.headers.get('content-type') || '')) fail('llm.txt is not text/plain');
if (!/text\/plain/i.test(llms.res.headers.get('content-type') || '')) fail('llms.txt is not text/plain');
if (llm.text !== llms.text) fail('llm.txt and llms.txt drift');
for (const lang of ['de', 'ja', 'zh']) if (llms.text.includes(`${CANONICAL_HOST}/${lang}/`)) fail(`llms advertises noindex locale ${lang}`);

for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'PerplexityBot']) {
  const { res } = await get(remote('/tools.html'), {
    headers: { 'User-Agent': `${bot}/1.0 SectorCalcReleaseGuard` },
    redirect: 'manual',
  });
  if (res.status !== 200) fail(`${bot} edge probe HTTP ${res.status}`);
}

if (MODE === 'live') {
  const www = await fetch('https://www.sectorcalc.com/', { redirect: 'manual', signal: AbortSignal.timeout(15000) });
  if (![301, 308].includes(www.status)) fail(`www host redirect HTTP ${www.status}`);
  const location = www.headers.get('location') || '';
  if (!location.startsWith(CANONICAL_HOST)) fail(`www redirect target is not apex: ${location || 'missing'}`);
}


// LLM discovery must not advertise legacy *-pro.html primary URLs or stale sitemap counts.
const llmLive = await get(remote('/llms.txt'));
if (llmLive.res.status !== 200) fail(`llms.txt HTTP ${llmLive.res.status}`);
const llmTxt = llmLive.text;
const legacyLlm = [...llmTxt.matchAll(/https:\/\/sectorcalc\.com\/[a-z0-9-]+-pro\.html/gi)];
if (legacyLlm.length) fail(`llms.txt contains ${legacyLlm.length} legacy *-pro.html URL(s)`);
if (/\*\*32\*\*/.test(llmTxt)) fail('llms.txt still claims stale 32 sitemap URLs');
if (!llmTxt.includes(`## Live tools — ${[...sitemap.text.matchAll(/<loc>[^<]*\/calculator\//g)].length}`) && !llmTxt.includes('## Live tools — 25')) {
  fail('llms.txt live tools count missing/unexpected');
}

if (errors.length) {
  console.error(`[FAIL] ${MODE} SEO guard for ${FETCH_HOST}:\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`[PASS] ${MODE} SEO guard: ${locs.length} canonical URLs, image sitemap parents, HTTP/indexability/canonical invariants, bot edge access, locale quarantine, legacy routing and LLM parity verified at ${FETCH_HOST}`);
