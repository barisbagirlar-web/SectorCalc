#!/usr/bin/env node
/**
 * Legacy surface seal.
 *
 * Modes:
 *   LEGACY_SURFACE_MODE=local  (default) — inventory + dist/firebase/llms invariants
 *   LEGACY_SURFACE_MODE=live             — HTTP status/disposition against production
 *   LEGACY_SURFACE_MODE=all              — local then live
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const MODE = process.env.LEGACY_SURFACE_MODE || 'local';
const APEX = (process.env.LEGACY_SURFACE_HOST || 'https://sectorcalc.com').replace(/\/$/, '');
const WWW = (process.env.LEGACY_SURFACE_WWW || 'https://www.sectorcalc.com').replace(/\/$/, '');
const inventory = JSON.parse(readFileSync(join(ROOT, 'seo/legacy-surface.json'), 'utf8'));
const hostingSsot = existsSync(join(ROOT, 'seo/hosting-ssot.json'))
  ? JSON.parse(readFileSync(join(ROOT, 'seo/hosting-ssot.json'), 'utf8'))
  : { discoverySsot: { liveTools: 25, sitemapHtmlUrls: 89 } };

const errors = [];
const fail = (m) => errors.push(m);

function walkFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkFiles(p, out);
    else out.push(p);
  }
  return out;
}

function scanForbidden(label, text) {
  for (const phrase of inventory.forbiddenPublicPhrases || []) {
    if (text.includes(phrase)) fail(`${label} contains forbidden phrase: ${phrase}`);
  }
  for (const pattern of inventory.forbiddenPublicPhrasePatterns || []) {
    const re = new RegExp(pattern, 'i');
    if (re.test(text)) fail(`${label} matches forbidden phrase pattern: ${pattern}`);
  }
}

function verifyLocal() {
  const firebase = JSON.parse(readFileSync(join(ROOT, 'firebase.json'), 'utf8'));
  const redirects = firebase.hosting?.redirects || [];
  const toolsRedirect = redirects.find((r) => r.source === '/tools');
  if (!toolsRedirect) fail('firebase.json missing /tools → /tools.html 301 redirect');
  else {
    if (toolsRedirect.destination !== '/tools.html') fail(`firebase /tools destination=${toolsRedirect.destination}`);
    if (Number(toolsRedirect.type) !== 301 && Number(toolsRedirect.type) !== 308) {
      fail(`firebase /tools type=${toolsRedirect.type}; expected 301/308`);
    }
  }

  // Dist must not materialize retired legacy HTML trees.
  const dist = join(ROOT, 'dist');
  if (!existsSync(dist)) fail('dist/ missing — run production build before local legacy-surface');
  else {
    const bannedRel = [
      'tr/about.html',
      'tr/about/index.html',
      'categories.html',
      'categories/index.html',
      'developer-showcase.html',
      'developer-showcase/index.html',
      'en/index.html',
      'es/index.html',
    ];
    for (const rel of bannedRel) {
      if (existsSync(join(dist, rel))) fail(`dist contains retired legacy artifact ${rel}`);
    }

    const llmsPath = join(dist, 'llms.txt');
    if (!existsSync(llmsPath)) fail('dist/llms.txt missing');
    else {
      const llms = readFileSync(llmsPath, 'utf8');
      scanForbidden('dist/llms.txt', llms);
      const expectedTools = hostingSsot.discoverySsot?.liveTools ?? 25;
      if (!llms.includes(`## Live tools — ${expectedTools}`)) {
        fail(`dist/llms.txt missing "## Live tools — ${expectedTools}"`);
      }
      if (/\b1005\b/.test(llms)) fail('dist/llms.txt still references 1005');
      const legacyPro = [...llms.matchAll(/https:\/\/sectorcalc\.com\/[a-z0-9-]+-pro\.html/gi)];
      if (legacyPro.length) fail(`dist/llms.txt has ${legacyPro.length} legacy *-pro.html primary URL(s)`);
    }

    const sitemapPath = join(dist, 'sitemap.xml');
    if (!existsSync(sitemapPath)) fail('dist/sitemap.xml missing');
    else {
      const sitemap = readFileSync(sitemapPath, 'utf8');
      const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      const expected = hostingSsot.discoverySsot?.sitemapHtmlUrls ?? 89;
      if (locs.length !== expected) fail(`dist/sitemap.xml expected ${expected} locs, got ${locs.length}`);
      if (sitemap.includes('https://www.sectorcalc.com')) fail('dist/sitemap.xml contains www URLs');
      for (const banned of ['/tr/', '/categories', '/developer-showcase', '/en/', '/es/']) {
        if (locs.some((u) => u.includes(banned))) fail(`dist/sitemap.xml lists banned surface ${banned}`);
      }
    }

    // Public HTML/text scan for forbidden academic-advisory / 1005 claims.
    const scanRoots = [dist, join(ROOT, 'public')];
    for (const root of scanRoots) {
      for (const file of walkFiles(root)) {
        if (!/\.(html|txt|xml|md)$/i.test(file)) continue;
        if (file.includes(`${join('public', 'vendor')}`) || file.includes(`${join('dist', 'vendor')}`)) continue;
        const text = readFileSync(file, 'utf8');
        scanForbidden(relative(ROOT, file), text);
      }
    }
  }

  // Evidence gate must keep named Academic Oversight claims off unless fully verified.
  const evidencePath = join(ROOT, 'seo/evidence/expert-relationships.json');
  if (existsSync(evidencePath)) {
    const evidence = JSON.parse(readFileSync(evidencePath, 'utf8'));
    for (const rel of evidence.relationships || []) {
      const open = rel.publicClaimAllowed === true && rel.relationshipVerified === true && rel.scopeVerified === true;
      if (!open && (rel.forbiddenPublicPhrases || []).length === 0) {
        fail(`evidence ${rel.id} missing forbiddenPublicPhrases while public claim disabled`);
      }
    }
  }

  console.log('[PASS] verify:legacy-surface local inventory + dist/firebase/llms invariants');
}

async function fetchManual(url) {
  const res = await fetch(url, {
    redirect: 'manual',
    headers: { 'User-Agent': 'SectorCalcLegacySurface/1.0' },
    signal: AbortSignal.timeout(20000),
  });
  const text = await res.text();
  return { status: res.status, location: res.headers.get('location'), text, robots: res.headers.get('x-robots-tag') || '' };
}

async function verifyLive() {
  const cert = {
    LIVE_LLMS_TOOL_COUNT: 0,
    LIVE_LLMS_LEGACY_TOOL_COUNT: 0,
    LIVE_LLMS_1005_CLAIM_COUNT: 0,
    LEGACY_TR_ABOUT_STATUS: '',
    LEGACY_CATEGORIES_STATUS: '',
    LEGACY_DEVELOPER_SHOWCASE_STATUS: '',
    PUBLIC_ACADEMIC_ADVISORY_CLAIM_COUNT: 0,
    GLOBAL_LIVE_SSOT: 'FAIL',
  };

  for (const route of inventory.routes) {
    const apex = await fetchManual(`${APEX}${route.path}`);
    const www = await fetchManual(`${WWW}${route.path}`);

    if (![301, 308].includes(www.status)) {
      fail(`live www ${route.path} HTTP ${www.status}; expected 301/308 to apex`);
    } else {
      const loc = www.location || '';
      if (!loc.startsWith(APEX)) fail(`live www ${route.path} Location not apex: ${loc || 'missing'}`);
    }

    if (route.decision === 'redirect') {
      const okStatus = (route.status || [301, 308]).includes(apex.status);
      if (!okStatus) fail(`live ${route.path} HTTP ${apex.status}; expected redirect ${route.status}`);
      const loc = (apex.location || '').split('?')[0];
      if (loc !== route.destination && loc !== `${APEX}${route.destination}`) {
        fail(`live ${route.path} Location=${loc || 'missing'}; expected ${route.destination}`);
      }
    } else if (route.decision === 'gone') {
      const allowed = route.preferredStatus || [404, 410];
      if (!allowed.includes(apex.status)) {
        fail(`live ${route.path} HTTP ${apex.status}; expected one of ${allowed.join('/')}`);
      }
      if (apex.status === 200) fail(`live ${route.path} must not be 200 indexable legacy content`);
      // Firebase 404.html includes meta robots noindex — enforce when HTML.
      if (
        apex.status === 404 &&
        /<!doctype html/i.test(apex.text) &&
        !/noindex/i.test(apex.text) &&
        !/noindex/i.test(apex.robots)
      ) {
        fail(`live ${route.path} 404 HTML missing noindex`);
      }
    }

    scanForbidden(`live ${route.path}`, apex.text);
    cert.PUBLIC_ACADEMIC_ADVISORY_CLAIM_COUNT += (
      apex.text.match(/academic advisory|advisory board|akademik\s+dan[i\u0131][s\u015f]man/gi) || []
    ).length;

    if (route.path === '/tr/about') cert.LEGACY_TR_ABOUT_STATUS = String(apex.status);
    if (route.path === '/categories') cert.LEGACY_CATEGORIES_STATUS = String(apex.status);
    if (route.path === '/developer-showcase') cert.LEGACY_DEVELOPER_SHOWCASE_STATUS = String(apex.status);

    console.log(`  ${route.path.padEnd(40)} apex=${apex.status} www=${www.status} decision=${route.decision}`);
  }

  const llms = await fetchManual(`${APEX}/llms.txt`);
  if (llms.status !== 200) fail(`live /llms.txt HTTP ${llms.status}`);
  scanForbidden('live /llms.txt', llms.text);
  const m = llms.text.match(/Live tools — (\d+)/);
  cert.LIVE_LLMS_TOOL_COUNT = m ? Number(m[1]) : 0;
  cert.LIVE_LLMS_LEGACY_TOOL_COUNT = (llms.text.match(/[a-z0-9-]+-pro\.html/gi) || []).length;
  cert.LIVE_LLMS_1005_CLAIM_COUNT = (llms.text.match(/\b1005\b/g) || []).length;
  const expectedTools = hostingSsot.discoverySsot?.liveTools ?? 25;
  if (cert.LIVE_LLMS_TOOL_COUNT !== expectedTools) {
    fail(`LIVE_LLMS_TOOL_COUNT=${cert.LIVE_LLMS_TOOL_COUNT}; expected ${expectedTools}`);
  }
  if (cert.LIVE_LLMS_LEGACY_TOOL_COUNT !== 0) fail(`LIVE_LLMS_LEGACY_TOOL_COUNT=${cert.LIVE_LLMS_LEGACY_TOOL_COUNT}`);
  if (cert.LIVE_LLMS_1005_CLAIM_COUNT !== 0) fail(`LIVE_LLMS_1005_CLAIM_COUNT=${cert.LIVE_LLMS_1005_CLAIM_COUNT}`);
  if (cert.PUBLIC_ACADEMIC_ADVISORY_CLAIM_COUNT !== 0) {
    fail(`PUBLIC_ACADEMIC_ADVISORY_CLAIM_COUNT=${cert.PUBLIC_ACADEMIC_ADVISORY_CLAIM_COUNT}`);
  }

  cert.GLOBAL_LIVE_SSOT =
    errors.length === 0 &&
    ['404', '410'].includes(cert.LEGACY_TR_ABOUT_STATUS) &&
    ['404', '410'].includes(cert.LEGACY_CATEGORIES_STATUS) &&
    ['404', '410'].includes(cert.LEGACY_DEVELOPER_SHOWCASE_STATUS)
      ? 'PASS'
      : 'FAIL';

  console.log('');
  console.log(`LIVE_LLMS_TOOL_COUNT=${cert.LIVE_LLMS_TOOL_COUNT}`);
  console.log(`LIVE_LLMS_LEGACY_TOOL_COUNT=${cert.LIVE_LLMS_LEGACY_TOOL_COUNT}`);
  console.log(`LIVE_LLMS_1005_CLAIM_COUNT=${cert.LIVE_LLMS_1005_CLAIM_COUNT}`);
  console.log(`LEGACY_TR_ABOUT_STATUS=${cert.LEGACY_TR_ABOUT_STATUS}`);
  console.log(`LEGACY_CATEGORIES_STATUS=${cert.LEGACY_CATEGORIES_STATUS}`);
  console.log(`LEGACY_DEVELOPER_SHOWCASE_STATUS=${cert.LEGACY_DEVELOPER_SHOWCASE_STATUS}`);
  console.log(`PUBLIC_ACADEMIC_ADVISORY_CLAIM_COUNT=${cert.PUBLIC_ACADEMIC_ADVISORY_CLAIM_COUNT}`);
  console.log(`GLOBAL_LIVE_SSOT=${cert.GLOBAL_LIVE_SSOT}`);

  if (cert.GLOBAL_LIVE_SSOT !== 'PASS') fail('GLOBAL_LIVE_SSOT=FAIL');
  if (!errors.length) console.log('[PASS] verify:legacy-surface live disposition + discovery SSOT');
}

if (!['local', 'live', 'all'].includes(MODE)) {
  console.error(`[FAIL] Unsupported LEGACY_SURFACE_MODE: ${MODE}`);
  process.exit(1);
}

if (MODE === 'local' || MODE === 'all') verifyLocal();
if (MODE === 'live' || MODE === 'all') await verifyLive();

if (errors.length) {
  console.error(`[FAIL] verify:legacy-surface (${MODE})\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
