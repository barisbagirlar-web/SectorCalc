#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const HSTS_VALUE = 'max-age=31536000; includeSubDomains';
export const DISCOVERY_CACHE_VALUE = 'public, max-age=300, must-revalidate';
export const DISCOVERY_SOURCE = '**/*.@(txt|xml)';

function upsertHeader(headers, key, value) {
  const existing = headers.find((entry) => String(entry?.key || '').toLowerCase() === key.toLowerCase());
  if (existing) existing.value = value;
  else headers.push({ key, value });
}

export function hardenFirebaseConfig(input) {
  const config = structuredClone(input);
  const hosting = config?.hosting;
  if (!hosting || typeof hosting !== 'object') throw new Error('firebase hosting config missing');
  if (!Array.isArray(hosting.headers)) hosting.headers = [];

  let globalRule = hosting.headers.find((rule) => rule?.source === '**');
  if (!globalRule) {
    globalRule = { source: '**', headers: [] };
    hosting.headers.unshift(globalRule);
  }
  if (!Array.isArray(globalRule.headers)) globalRule.headers = [];
  upsertHeader(globalRule.headers, 'Strict-Transport-Security', HSTS_VALUE);

  let discoveryRule = hosting.headers.find((rule) => rule?.source === DISCOVERY_SOURCE);
  if (!discoveryRule) {
    discoveryRule = { source: DISCOVERY_SOURCE, headers: [] };
    hosting.headers.push(discoveryRule);
  }
  if (!Array.isArray(discoveryRule.headers)) discoveryRule.headers = [];
  upsertHeader(discoveryRule.headers, 'Cache-Control', DISCOVERY_CACHE_VALUE);

  return config;
}

export function validateHardenedFirebaseConfig(config) {
  const errors = [];
  const rules = config?.hosting?.headers;
  if (!Array.isArray(rules)) return ['hosting.headers missing'];

  const globalRule = rules.find((rule) => rule?.source === '**');
  const hsts = globalRule?.headers?.find((entry) => String(entry?.key || '').toLowerCase() === 'strict-transport-security')?.value;
  if (hsts !== HSTS_VALUE) errors.push(`HSTS mismatch: ${hsts || 'missing'}`);
  if (/\bpreload\b/i.test(hsts || '')) errors.push('HSTS preload must not be enabled by this automation');

  const discoveryRule = rules.find((rule) => rule?.source === DISCOVERY_SOURCE);
  const cache = discoveryRule?.headers?.find((entry) => String(entry?.key || '').toLowerCase() === 'cache-control')?.value;
  if (cache !== DISCOVERY_CACHE_VALUE) errors.push(`discovery Cache-Control mismatch: ${cache || 'missing'}`);

  return errors;
}

function isMain() {
  return process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

if (isMain()) {
  const sourcePath = resolve(process.argv[2] || 'firebase.json');
  const outputPath = resolve(process.argv[3] || 'firebase.production.json');
  const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
  const hardened = hardenFirebaseConfig(source);
  const errors = validateHardenedFirebaseConfig(hardened);
  if (errors.length) {
    console.error(`[FAIL] production Firebase config: ${errors.join('; ')}`);
    process.exit(1);
  }
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(hardened, null, 2)}\n`, 'utf8');
  console.log(`[PASS] production Firebase config: HSTS=${HSTS_VALUE}; discovery-cache=${DISCOVERY_CACHE_VALUE}; output=${outputPath}`);
}
