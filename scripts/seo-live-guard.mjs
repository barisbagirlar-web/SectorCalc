#!/usr/bin/env node
/** Post-deploy production SEO guard. Requires network access. */
const HOST = 'https://sectorcalc.com';
const errors = [];
const fail = (m) => errors.push(m);

async function get(url, options = {}) {
  const res = await fetch(url, { redirect: options.redirect || 'follow', headers: options.headers || {}, signal: AbortSignal.timeout(15000) });
  const text = await res.text();
  return { res, text };
}

function canonicalOf(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1]
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1]
    || null;
}

const robots = await get(`${HOST}/robots.txt`);
if (robots.res.status !== 200) fail(`robots.txt HTTP ${robots.res.status}`);
for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'PerplexityBot']) {
  const block = new RegExp(`User-agent:\\s*${bot.replace('-', '\\-')}[\\s\\S]*?(?=\\nUser-agent:|\\nSitemap:|$)`, 'i').exec(robots.text)?.[0] || '';
  if (!block || !/Allow:\s*\//i.test(block) || /Disallow:\s*\/\s*$/im.test(block)) fail(`robots live policy invalid for ${bot}`);
}
if (!robots.text.includes(`Sitemap: ${HOST}/sitemap.xml`)) fail('robots live sitemap declaration missing');

const sitemap = await get(`${HOST}/sitemap.xml?release_guard=${Date.now()}`);
if (sitemap.res.status !== 200) fail(`sitemap.xml HTTP ${sitemap.res.status}`);
if (/<priority>|<changefreq>|<lastmod>/i.test(sitemap.text)) fail('live sitemap contains priority/changefreq/lastmod');
if (/https:\/\/www\.sectorcalc\.com/i.test(sitemap.text)) fail('live sitemap contains www URL');
for (const lang of ['de', 'ja', 'zh']) if (sitemap.text.includes(`<loc>${HOST}/${lang}/</loc>`)) fail(`live sitemap contains quarantined locale ${lang}`);
const locs = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length !== 32) fail(`live sitemap expected 32 canonical HTML URLs, got ${locs.length}`);
if (new Set(locs).size !== locs.length) fail('live sitemap has duplicate locs');

for (const url of locs) {
  const { res, text } = await get(`${url}${url.includes('?') ? '&' : '?'}release_guard=${Date.now()}`);
  if (res.status !== 200) { fail(`${url} HTTP ${res.status}`); continue; }
  if (/noindex/i.test(text)) fail(`${url} contains noindex`);
  const canonical = canonicalOf(text);
  if (canonical !== url) fail(`${url} canonical mismatch: ${canonical || 'missing'}`);
  if (!/<h1[\s>]/i.test(text)) fail(`${url} missing raw HTML H1`);
}

for (const [path, expected] of [['/de/', 'noindex'], ['/ja/', 'noindex'], ['/zh/', 'noindex']]) {
  const { res, text } = await get(`${HOST}${path}?release_guard=${Date.now()}`);
  if (res.status !== 200) fail(`${path} preview HTTP ${res.status}`);
  if (!new RegExp(`<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*${expected}`, 'i').test(text)) fail(`${path} preview missing noindex`);
  if (/hreflang=/i.test(text)) fail(`${path} preview publishes hreflang before full localization`);
}

for (const legacy of ['/categories', '/developer-showcase', '/seo/construction-cost-calculators', '/guides/how-to-calculate-manufacturing-cost']) {
  const { res } = await get(`${HOST}${legacy}?release_guard=${Date.now()}`, { redirect: 'manual' });
  if (![301, 308, 404, 410].includes(res.status)) fail(`legacy ${legacy} returns ${res.status}; expected exact redirect or 404/410`);
}

const llm = await get(`${HOST}/llm.txt?release_guard=${Date.now()}`);
const llms = await get(`${HOST}/llms.txt?release_guard=${Date.now()}`);
if (llm.res.status !== 200 || llms.res.status !== 200) fail('LLM discovery files not HTTP 200');
if (llm.text !== llms.text) fail('live llm.txt and llms.txt drift');
for (const lang of ['de', 'ja', 'zh']) if (llms.text.includes(`${HOST}/${lang}/`)) fail(`live llms advertises noindex locale ${lang}`);

for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'PerplexityBot']) {
  const { res } = await get(`${HOST}/tools.html?bot_probe=${Date.now()}`, { headers: { 'User-Agent': `${bot}/1.0 SectorCalcReleaseGuard` } });
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
console.log(`[PASS] Production SEO live guard: ${locs.length} canonical URLs, bot edge access, locale quarantine, legacy routing and LLM parity verified`);
