#!/usr/bin/env node
/**
 * Smoke: sandbox Paddle config required for local test payments.
 * Usage: node scripts/smoke-paddle-sandbox.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env.local');
const packagesPath = resolve(root, 'src/lib/pricing-packages.ts');
const firebasePath = resolve(root, 'firebase.json');

const EXPECTED = [
  ['1', 'pri_01kvv1wpnq508nkg37f9vy0aqy'],
  ['5', 'pri_01kvv20wppf64fht2tn82wq8wc'],
  ['15', 'pri_01kvv24222vst09fyh7rxv3ck8'],
  ['30', 'pri_01kvv27axkgbd5ddmd9c6gaaj9'],
  ['100', 'pri_01kvv28x31xas1q8pdrqqa4hr7']
];

function fail(msg) {
  console.error('FAIL:', msg);
  process.exitCode = 1;
}

function ok(msg) {
  console.log('OK:', msg);
}

if (!existsSync(envPath)) {
  fail('.env.local missing — copy .env.example and fill sandbox values');
} else {
  const env = readFileSync(envPath, 'utf8');
  if (!/VITE_PADDLE_ENV=sandbox/.test(env)) fail('VITE_PADDLE_ENV must be sandbox');
  else ok('VITE_PADDLE_ENV=sandbox');
  if (!/VITE_PADDLE_CLIENT_TOKEN=test_/.test(env)) fail('VITE_PADDLE_CLIENT_TOKEN must be a test_ token');
  else ok('VITE_PADDLE_CLIENT_TOKEN present');
  if (!/PADDLE_API_KEY=pdl_sdbx_/.test(env)) fail('PADDLE_API_KEY must be pdl_sdbx_…');
  else ok('PADDLE_API_KEY sandbox present');
}

const pkgSrc = readFileSync(packagesPath, 'utf8');
for (const [credits, priceId] of EXPECTED) {
  if (!pkgSrc.includes(priceId)) fail(`pricing-packages missing ${priceId} (${credits} credits)`);
  else ok(`catalog has ${credits} → ${priceId}`);
}

const firebase = readFileSync(firebasePath, 'utf8');
for (const needle of ['cdn.paddle.com', '*.paddle.com', 'frame-src']) {
  if (!firebase.includes(needle)) fail(`firebase.json CSP missing ${needle}`);
  else ok(`firebase CSP includes ${needle}`);
}

if (process.exitCode) {
  console.error('\nPaddle sandbox smoke FAILED');
  process.exit(1);
}
console.log('\nPaddle sandbox smoke PASSED');
console.log('Manual: npm run dev → http://localhost:5173/pricing.html → Buy');
console.log('Card: 4242 4242 4242 4242 | any future expiry | any CVC');
