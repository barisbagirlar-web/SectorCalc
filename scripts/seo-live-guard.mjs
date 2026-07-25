#!/usr/bin/env node
/** Post-deploy production SEO guard. Requires network access. */
const HOST = 'https://sectorcalc.com';
const errors = [];
const fail = (m) => errors.push(m);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, options = {}) {
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const res = await fetch(url, {
        redirect: options.redirect || 'follow',
        headers: options.headers || {},
        signal: AbortSignal.timeout(15000),
      });
      const text = await res.text();
      if (res.status < 500 || attempt === 4) return { res, text };
      lastError = new Error(`HTTP ${res.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === 4) throw error;
    }
    await sleep(attempt * 2500);
  }
  throw lastError;
}

function canonicalOf(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1]
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1]
    || null;
}

const robots = await get(`${HOST}/robots.txt?release_guard=${Date.now()}`);
if (robots.res.status !== 200) fail(`robots.txt HTTP ${robots.res.status}`);
if (!/text\/plain/i.test(robots.res.headers.get('content-type') || '')) fail(`robots.txt content-type ${robots.res.headers.get('content-type') || 'missing'}`);
for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'PerplexityBot']) {
  const block = new RegExp(`User-agent:\\s*${bot.replace('-', '\\-')}[\\s\\S]*?(?=\\nUser-agent:|\\nSitemap:|$)`, 'i').exec(robots.text)?.[0] || '';
  if (!block || !/Allow:\s*\//i.test(block) || /Disallow:\s*\/\s*$/im.test(block)) fail(`robots live policy invalid for ${bot}`);
}
if (!robots.text.includes(`Sitemap: ${HOST}/sitemap.xml`)) fail('robots live sitemap declaration missing');
if (/Sitemap:\s*https:\/\/www\.sectorcalc\.com/i.test(robots.text)) fail('robots advertises www sitemap');

const sitemap = await get(`${HOST}/sitemap.xml?release_guard=${Date.now()}`);
if (sitemap.res.status !== 200) fail(`sitemap.xml HTTP ${sitemap.res.status}`);
if (!/(application|text)\/xml/i.test(sitemap.res.headers.get('content-type') || '')) fail(`sitemap.xml content-type ${sitemap.res.headers.get('content-type') || 'missing'}`);
if (!/<urlset\b[^>]*xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/i.test(sitemap.text)) fail('live sitemap missing valid urlset namespace');
if (/<priority>|<changefreq>|<lastmod>/i.test(sitemap.text)) fail('live sitemap contains priority/changefreq/lastmod');
if (/https:\/\/www\.sectorcalc\.com/i.test(sitemap.text)) fail('live sitemap contains www URL');
for (const lang of ['de', 'ja', 'zh']) if (sitemap.text.includes(`<loc>${HOST}/${lang}/</loc>`)) fail(`live sitemap contains quarantined locale ${lang}`);
const locs = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length !== 32) fail(`live sitemap expected 32 canonical HTML URLs, got ${locs.length}`);
if (new Set(locs).size !== locs.length) fail('live sitemap has duplicate locs');
for (const url of locs) {
  if (!url.startsWith(`${HOST}/`)) fail(`sitemap URL is off-host: ${url}`);
  if (/[?#]/.test(url)) fail(`sitemap URL contains query/fragment: ${url}`);
}

for (const url of locs) {
  const probe = `${url}${url.includes('?') ? '&' : '?'}release_guard=${Date.now()}`;
  const { res, text } = await get(probe, { redirect: 'manual' });
  if (res.status !== 200) { fail(`${url} HTTP ${res.status}; sitemap URLs must not redirect`); continue; }
  if (!/text\/html/i.test(res.headers.get('content-type') || '')) fail(`${url} non-HTML content-type ${res.headers.get('content-type') || 'missing'}`);
  if (/noindex/i.test(res.headers.get('x-robots-tag') || '')) fail(`${url} X-Robots-Tag contains noindex`);
  if (/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(text)) fail(`${url} meta robots contains noindex`);
  const canonical = canonicalOf(text);
  if (canonical !== url) fail(`${url} canonical mismatch: ${canonical || 'missing'}`);
  if (!/<h1[\s>]/i.test(text)) fail(`${url} missing raw HTML H1`);
}

const imageSitemap = await get(`${HOST}/sitemap-images.xml?release_guard=${Date.now()}`);
if (imageSitemap.res.status !== 200) fail(`sitemap-images.xml HTTP ${imageSitemap.res.status}`);
if (!/(application|text)\/xml/i.test(imageSitemap.res.headers.get('content-type') || '')) fail(`sitemap-images.xml content-type ${imageSitemap.res.headers.get('content-type') || 'missing'}`);
const imageParents = [...imageSitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const parent of imageParents) if (!locs.includes(parent)) fail(`image sitemap parent is not canonical/indexable: ${parent}`);

for (const path of ['/de/', '/ja/', '/zh/']) {
  const { res, text } = await get(`${HOST}${path}?release_guard=${Date.now()}`, { redirect: 'manual' });
  if (res.status !== 200) fail(`${path} preview HTTP ${res.status}`);
  if (!/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex[^"']*follow/i.test(text)) fail(`${path} preview missing noindex,follow`);
  if (/hreflang=/i.test(text)) fail(`${path} preview publishes hreflang before full localization`);
  if (sitemap.text.includes(`<loc>${HOST}${path}</loc>`)) fail(`${path} noindex preview leaked into sitemap`);
}

for (const legacy of ['/categories', '/developer-showcase', '/seo/construction-cost-calculators', '/guides/how-to-calculate-manufacturing-cost']) {
  const { res } = await get(`${HOST}${legacy}?release_guard=${Date.now()}`, { redirect: 'manual' });
  if (![301, 308, 404, 410].includes(res.status)) fail(`legacy ${legacy} returns ${res.status}; expected exact redirect or 404/410`);
}

const llm = await get(`${HOST}/llm.txt?release_guard=${Date.now()}`);
const llms = await get(`${HOST}/llms.txt?release_guard=${Date.now()}`);
if (llm.res.status !== 200 || llms.res.status !== 200) fail('LLM discovery files not HTTP 200');
if (!/text\/plain/i.test(llm.res.headers.get('content-type') || '')) fail('llm.txt is not text/plain');
if (!/text\/plain/i.test(llms.res.headers.get('content-type') || '')) fail('llms.txt is not text/plain');
if (llm.text !== llms.text) fail('live llm.txt and llms.txt drift');
for (const lang of ['de', 'ja', 'zh']) if (llms.text.includes(`${HOST}/${lang}/`)) fail(`live llms advertises noindex locale ${lang}`);

for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'PerplexityBot']) {
  const { res } = await get(`${HOST}/tools.html?bot_probe=${Date.now()}`, { headers: { 'User-Agent': `${bot}/1.0 SectorCalcReleaseGuard` }, redirect: 'manual' });
  if (res.status !== 200) fail(`${bot} edge probe HTTP ${res.status}`);
}

const www = await fetch('https://www.sectorcalc.com/', { redirect: 'manual', signal: AbortSignal.timeout(15000) });
if (![301, 308].includes(www.status)) fail(`www host redirect HTTP ${www.status}`);
const location = www.headers.get('location') || '';
if (!location.startsWith(HOST)) fail(`www redirect target is not apex: ${location || 'missing'}`);

if (errors.length) {
  console.error('[FAIL] Production SEO live guard:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`[PASS] Production SEO live guard: ${locs.length} canonical URLs, image sitemap parents, HTTP/indexability/canonical invariants, bot edge access, locale quarantine, legacy routing and LLM parity verified`);
