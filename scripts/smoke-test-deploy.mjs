#!/usr/bin/env node
/**
 * Post-deploy smoke test: curls all locale routes and asserts HTTP 200.
 *
 * Usage:
 *   node scripts/smoke-test-deploy.mjs [url]
 *
 * Default: https://sectorcalc-bf412.web.app
 * Example: node scripts/smoke-test-deploy.mjs https://www.sectorcalc.com
 */
const BASE_URL = process.argv[2] || "https://sectorcalc-bf412.web.app";
const LOCALES = [
  { path: "/", label: "EN root" },
  { path: "/en", label: "EN explicit" },
  { path: "/tr", label: "Turkish" },
  { path: "/de", label: "German" },
  { path: "/fr", label: "French" },
  { path: "/es", label: "Spanish" },
  { path: "/ar", label: "Arabic" },
];

let passed = 0;
let failed = 0;

async function testLocale({ path, label }) {
  const url = `${BASE_URL}${path}`;
  try {
    const start = Date.now();
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(60000) });
    const ms = Date.now() - start;
    const ok = res.status === 200;
    const prefix = ok ? "✅" : "❌";
    console.log(`  ${prefix} ${label.padEnd(14)} ${url.padEnd(55)} HTTP ${res.status} (${ms}ms)`);
    if (ok) passed++;
    else failed++;
  } catch (err) {
    console.log(`  ❌ ${label.padEnd(14)} ${url.padEnd(55)} ERROR: ${err.message}`);
    failed++;
  }
}

console.log(`\n🔍 Smoke test: ${BASE_URL}`);
console.log(`   ${new Date().toISOString()}\n`);

const results = await Promise.all(LOCALES.map(testLocale));

console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${LOCALES.length} total\n`);
process.exit(failed > 0 ? 1 : 0);
