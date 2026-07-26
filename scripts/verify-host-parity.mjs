#!/usr/bin/env node
/**
 * Live host parity seal: www must single-hop 301/308 to apex; followed body hash must match apex.
 *
 * Env:
 *   HOST_PARITY_MODE=live|skip  (default live)
 *   HOST_PARITY_APEX / HOST_PARITY_WWW optional overrides
 */
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const MODE = process.env.HOST_PARITY_MODE || 'live';
const SSOT_PATH = join(ROOT, 'seo/hosting-ssot.json');
const ssot = existsSync(SSOT_PATH)
  ? JSON.parse(readFileSync(SSOT_PATH, 'utf8'))
  : { canonicalHost: 'https://sectorcalc.com', wwwHost: 'https://www.sectorcalc.com' };

const APEX = (process.env.HOST_PARITY_APEX || ssot.canonicalHost || 'https://sectorcalc.com').replace(/\/$/, '');
const WWW = (process.env.HOST_PARITY_WWW || ssot.wwwHost || 'https://www.sectorcalc.com').replace(/\/$/, '');

const PATHS = [
  '/',
  '/llms.txt',
  '/robots.txt',
  '/sitemap.xml',
  '/calculator/tolerance-stack-up',
  '/calculator/machine-hour-rate',
  '/tr/about',
  '/categories',
  '/developer-showcase',
];

const errors = [];
const fail = (m) => errors.push(m);

if (MODE === 'skip') {
  console.log('[SKIP] verify:host-parity (HOST_PARITY_MODE=skip)');
  process.exit(0);
}
if (MODE !== 'live') {
  console.error(`[FAIL] Unsupported HOST_PARITY_MODE: ${MODE}`);
  process.exit(1);
}

async function fetchManual(url) {
  const res = await fetch(url, {
    redirect: 'manual',
    headers: { 'User-Agent': 'SectorCalcHostParity/1.0' },
    signal: AbortSignal.timeout(20000),
  });
  const buf = Buffer.from(await res.arrayBuffer());
  return {
    status: res.status,
    location: res.headers.get('location'),
    hash: createHash('sha256').update(buf).digest('hex'),
    text: buf.toString('utf8'),
  };
}

function resolveLocation(location, baseHost) {
  if (!location) return null;
  if (location.startsWith('http://') || location.startsWith('https://')) return location;
  if (location.startsWith('/')) return `${baseHost}${location}`;
  return new URL(location, `${baseHost}/`).href;
}

const cert = {
  APEX_HOME_HASH: '',
  WWW_FINAL_HOME_HASH: '',
  HOME_PARITY: 'FAIL',
  WWW_REDIRECT_SINGLE_HOP: 'PASS',
  PATH_PARITY_FAILS: 0,
};

console.log(`[host-parity] apex=${APEX} www=${WWW}`);

for (const path of PATHS) {
  const apex = await fetchManual(`${APEX}${path}`);
  const www = await fetchManual(`${WWW}${path}`);

  if (![301, 308].includes(www.status)) {
    fail(`${path}: www HTTP ${www.status}; expected single-hop 301/308`);
    cert.WWW_REDIRECT_SINGLE_HOP = 'FAIL';
    continue;
  }

  const loc = resolveLocation(www.location, WWW);
  if (!loc) {
    fail(`${path}: www redirect missing Location`);
    cert.WWW_REDIRECT_SINGLE_HOP = 'FAIL';
    continue;
  }
  if (!loc.startsWith(`${APEX}/`) && loc !== `${APEX}/` && loc !== APEX) {
    fail(`${path}: www Location not apex: ${loc}`);
    cert.WWW_REDIRECT_SINGLE_HOP = 'FAIL';
    continue;
  }

  const expected = `${APEX}${path === '/' ? '/' : path}`;
  const locPath = new URL(loc).pathname + (new URL(loc).search || '');
  const expectedPath = path === '/' ? '/' : path;
  if (locPath !== expectedPath && loc !== expected) {
    // Allow trailing-slash normalization only when both sides agree after Firebase policy.
    if (!(expectedPath === '/' && (locPath === '/' || locPath === ''))) {
      fail(`${path}: www Location path drift: ${loc} (expected ${expected})`);
    }
  }

  const final = await fetchManual(loc);
  if ([301, 302, 307, 308].includes(final.status)) {
    fail(`${path}: www redirect is multi-hop (second status ${final.status} → ${final.location || 'n/a'})`);
    cert.WWW_REDIRECT_SINGLE_HOP = 'FAIL';
    continue;
  }

  if (apex.status !== final.status || apex.hash !== final.hash) {
    fail(
      `${path}: content parity fail apex=${apex.status}/${apex.hash.slice(0, 12)} final=${final.status}/${final.hash.slice(0, 12)}`,
    );
    cert.PATH_PARITY_FAILS += 1;
  }

  if (path === '/') {
    cert.APEX_HOME_HASH = apex.hash;
    cert.WWW_FINAL_HOME_HASH = final.hash;
    cert.HOME_PARITY = apex.hash === final.hash && apex.status === final.status ? 'PASS' : 'FAIL';
  }

  console.log(
    `  ${path.padEnd(36)} www=${www.status} → ${loc.replace(APEX, '') || '/'} final=${final.status} parity=${apex.hash === final.hash && apex.status === final.status ? 'PASS' : 'FAIL'}`,
  );
}

if (cert.HOME_PARITY !== 'PASS') fail('HOME_PARITY=FAIL');
if (cert.WWW_REDIRECT_SINGLE_HOP !== 'PASS') fail('WWW_REDIRECT_SINGLE_HOP=FAIL');

console.log('');
console.log(`APEX_HOME_HASH=${cert.APEX_HOME_HASH}`);
console.log(`WWW_FINAL_HOME_HASH=${cert.WWW_FINAL_HOME_HASH}`);
console.log(`HOME_PARITY=${cert.HOME_PARITY}`);
console.log(`WWW_REDIRECT_SINGLE_HOP=${cert.WWW_REDIRECT_SINGLE_HOP}`);

if (errors.length) {
  console.error(`[FAIL] verify:host-parity\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('[PASS] verify:host-parity — www single-hop redirect + content hash parity for all probed paths');
