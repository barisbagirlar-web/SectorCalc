#!/usr/bin/env node
/**
 * After vite build, confirm the production bundle embeds auth + paddle client config.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const assets = join(dist, 'assets');

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(js|mjs|css|html)$/.test(name)) acc.push(p);
  }
  return acc;
}

const files = walk(dist);
const blob = files.map((f) => readFileSync(f, 'utf8')).join('\n');

const checks = [
  ['Firebase API key', /AIzaSyD5ReQtc1P_25V4Dbdwc1DPsy72-ApcdEY/],
  ['Firebase project', /sectorcalc-prod/],
  ['Firestore DB', /sectorcalc-2/],
  ['Paddle client token', /test_6380be7c84b551e3fcd08d55d7e|live_/],
  ['Ops gate hash', /2d0dad38ec6b68bb25fbb34817eeb1df2fff0ecbcf7d7794e7a2c630b4028dba/],
  ['Login page', /Sign in — SectorCalc|Create account/],
  ['Account page', /Engineer account|engineer workspace|Identity plate/],
  ['Ops page', /Administration|Ops gate|Users & credits|Audit log/]
];

let failed = 0;
for (const [label, re] of checks) {
  if (!re.test(blob)) {
    console.error(`FAIL: production bundle missing ${label}`);
    failed += 1;
  } else {
    console.log(`OK: ${label}`);
  }
}

// Ensure HTML entry points exist
for (const page of ['login.html', 'account.html', 'sc-ops.html', 'pricing.html']) {
  const p = join(dist, page);
  try {
    statSync(p);
    console.log(`OK: dist/${page}`);
  } catch {
    console.error(`FAIL: dist/${page} missing`);
    failed += 1;
  }
}

if (!readdirSync(assets).some((n) => n.endsWith('.js'))) {
  console.error('FAIL: no JS assets in dist/assets');
  failed += 1;
}

if (failed) {
  console.error(`\nProduction bundle verification failed (${failed})`);
  process.exit(1);
}
console.log('\nProduction bundle verification PASSED');
