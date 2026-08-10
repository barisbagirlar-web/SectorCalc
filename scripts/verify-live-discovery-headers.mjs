#!/usr/bin/env node
import { DISCOVERY_CACHE_VALUE, HSTS_VALUE } from './prepare-firebase-production-config.mjs';

const HOST = (process.env.SEO_GUARD_HOST || 'https://sectorcalc.com').replace(/\/$/, '');
const MODE = process.env.SEO_GUARD_MODE || (HOST === 'https://sectorcalc.com' ? 'live' : 'preview');
const errors = [];
const discoveryPaths = ['/robots.txt', '/sitemap.xml', '/sitemap-images.xml', '/llm.txt', '/llms.txt'];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

if (!['preview', 'live'].includes(MODE)) throw new Error(`Unsupported SEO_GUARD_MODE: ${MODE}`);
if (!HOST.startsWith('https://')) throw new Error(`SEO_GUARD_HOST must use https: ${HOST}`);

function fail(message) {
  errors.push(message);
}

async function request(path) {
  const separator = path.includes('?') ? '&' : '?';
  return fetch(`${HOST}${path}${separator}header_guard=${Date.now()}-${Math.random().toString(36).slice(2)}`, {
    redirect: 'manual',
    signal: AbortSignal.timeout(15000),
    headers: { 'Cache-Control': 'no-cache' },
  });
}

async function eventually(label, validate) {
  let last = `${label} not checked`;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const result = await validate();
      if (result === null) return;
      last = result;
    } catch (error) {
      last = `${label} request failed: ${error instanceof Error ? error.message : String(error)}`;
    }
    if (attempt < 6) await sleep(attempt * 1500);
  }
  fail(last);
}

for (const path of discoveryPaths) {
  await eventually(path, async () => {
    const response = await request(path);
    if (response.status !== 200) return `${path} HTTP ${response.status}`;
    const cache = response.headers.get('cache-control') || '';
    if (!/(^|[,; ]+)max-age=300([,; ]+|$)/i.test(cache) || !/must-revalidate/i.test(cache)) {
      return `${path} Cache-Control=${cache || 'missing'}; expected ${DISCOVERY_CACHE_VALUE}`;
    }
    return null;
  });
}

if (MODE === 'live') {
  await eventually('HSTS', async () => {
    const root = await request('/');
    if (root.status !== 200) return `/ HTTP ${root.status}`;
    const hsts = root.headers.get('strict-transport-security') || '';
    const maxAge = Number(hsts.match(/max-age=(\d+)/i)?.[1] || 0);
    if (maxAge < 31536000) return `HSTS max-age too small: ${hsts || 'missing'}`;
    if (!/includeSubDomains/i.test(hsts)) return `HSTS includeSubDomains missing: ${hsts || 'missing'}`;
    if (/\bpreload\b/i.test(hsts)) return `HSTS preload unexpectedly enabled: ${hsts}`;
    return null;
  });
}

if (errors.length) {
  console.error(`[FAIL] ${MODE} hosting header guard for ${HOST}:\n${errors.map((error) => `  - ${error}`).join('\n')}`);
  process.exit(1);
}

console.log(`[PASS] ${MODE} hosting header guard: discovery cache=${DISCOVERY_CACHE_VALUE}${MODE === 'live' ? `; HSTS=${HSTS_VALUE}` : ''}`);
