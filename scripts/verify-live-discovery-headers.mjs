#!/usr/bin/env node
import { DISCOVERY_CACHE_VALUE, HSTS_VALUE } from './prepare-firebase-production-config.mjs';

const HOST = (process.env.SEO_GUARD_HOST || 'https://sectorcalc.com').replace(/\/$/, '');
const MODE = process.env.SEO_GUARD_MODE || (HOST === 'https://sectorcalc.com' ? 'live' : 'preview');
const errors = [];
const discoveryPaths = ['/robots.txt', '/sitemap.xml', '/sitemap-images.xml', '/llm.txt', '/llms.txt'];

if (!['preview', 'live'].includes(MODE)) throw new Error(`Unsupported SEO_GUARD_MODE: ${MODE}`);
if (!HOST.startsWith('https://')) throw new Error(`SEO_GUARD_HOST must use https: ${HOST}`);

function fail(message) {
  errors.push(message);
}

async function request(path) {
  const separator = path.includes('?') ? '&' : '?';
  return fetch(`${HOST}${path}${separator}header_guard=${Date.now()}`, {
    redirect: 'manual',
    signal: AbortSignal.timeout(15000),
    headers: { 'Cache-Control': 'no-cache' },
  });
}

for (const path of discoveryPaths) {
  const response = await request(path);
  if (response.status !== 200) {
    fail(`${path} HTTP ${response.status}`);
    continue;
  }
  const cache = response.headers.get('cache-control') || '';
  if (!/(^|[,; ]+)max-age=300([,; ]+|$)/i.test(cache) || !/must-revalidate/i.test(cache)) {
    fail(`${path} Cache-Control=${cache || 'missing'}; expected ${DISCOVERY_CACHE_VALUE}`);
  }
}

if (MODE === 'live') {
  const root = await request('/');
  if (root.status !== 200) fail(`/ HTTP ${root.status}`);
  const hsts = root.headers.get('strict-transport-security') || '';
  const maxAge = Number(hsts.match(/max-age=(\d+)/i)?.[1] || 0);
  if (maxAge < 31536000) fail(`HSTS max-age too small: ${hsts || 'missing'}`);
  if (!/includeSubDomains/i.test(hsts)) fail(`HSTS includeSubDomains missing: ${hsts || 'missing'}`);
  if (/\bpreload\b/i.test(hsts)) fail(`HSTS preload unexpectedly enabled: ${hsts}`);
}

if (errors.length) {
  console.error(`[FAIL] ${MODE} hosting header guard for ${HOST}:\n${errors.map((error) => `  - ${error}`).join('\n')}`);
  process.exit(1);
}

console.log(`[PASS] ${MODE} hosting header guard: discovery cache=${DISCOVERY_CACHE_VALUE}${MODE === 'live' ? `; HSTS=${HSTS_VALUE}` : ''}`);
