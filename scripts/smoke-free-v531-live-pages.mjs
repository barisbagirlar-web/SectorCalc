#!/usr/bin/env node
/**
 * scripts/smoke-free-v531-live-pages.mjs
 *
 * Accepts BASE_URL env var (default http://localhost:3000).
 * Tests Free V5.3.1 detail pages.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const SCHEMAS_DIR = path.join(ROOT, "src/sectorcalc/schemas/free-v531");
const schemaFiles = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith(".schema.json"));
const toolKeys = schemaFiles.map((f) => JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, f), "utf8")).tool_key);
const toolNames = new Map(schemaFiles.map((f) => {
  const s = JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, f), "utf8"));
  return [s.tool_key, s.tool_name];
}));

let passed = 0;
let failed = 0;
const failures = [];

function check(label, ok, detail) {
  if (ok) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ ${label}: ${detail || "FAIL"}`);
    failed++;
    failures.push({ label, detail });
  }
}

async function fetchUrl(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const text = await res.text();
    return { status: res.status, text };
  } catch (err) {
    return { status: 0, text: "", error: err.message };
  }
}

console.log(`\n🧪 Free V5.3.1 Live Page Smoke Test`);
console.log(`   BASE_URL: ${BASE_URL}\n`);

// 1. /free-tools returns 200
const ft = await fetchUrl(`${BASE_URL}/free-tools`);
check("/free-tools returns 200", ft.status === 200, `Status: ${ft.status}`);

// 2. All 51 Free V5.3.1 detail pages
let allDetailOk = 0;
let turkishFound = 0;
let formulaLeak = 0;
let appErrFound = 0;

for (const toolKey of toolKeys) {
  const url = `${BASE_URL}/tools/generated/${toolKey}`;
  const res = await fetchUrl(url);
  
  if (res.status === 200) allDetailOk++;
  else failures.push({ label: `${toolKey} status`, detail: `${res.status}` });

  if (res.status === 200) {
    // Turkish chars anywhere
    if (/[ğüşıöçĞÜŞİÖÇ]/.test(res.text)) turkishFound++;

    // Formula leak: actual function calculate( in raw HTML is dangerous
    if (/function\s+calculate\s*\(/.test(res.text)) formulaLeak++;

    // App error (actual server error, not RSC payload containing "error")
    if (/Application error/i.test(res.text) || /Internal Server Error/i.test(res.text)) appErrFound++;
  }
}

check("All 51 Free V5.3.1 pages return 200", allDetailOk === 51, `${allDetailOk}/51`);
check("No Turkish characters", turkishFound === 0, `${turkishFound} found`);
check("No formula leak (calculate function)", formulaLeak === 0, `${formulaLeak} found`);
check("No application error", appErrFound === 0, `${appErrFound} found`);

// 3. /en and /tr return 404
const enRes = await fetchUrl(`${BASE_URL}/en`);
check("/en returns 404", enRes.status === 404, `Status: ${enRes.status}`);

const trRes = await fetchUrl(`${BASE_URL}/tr`);
check("/tr returns 404", trRes.status === 404, `Status: ${trRes.status}`);

// Summary
console.log(`\n═══════════════════════════════════`);
console.log(`  RESULTS`);
console.log(`═══════════════════════════════════`);
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);

if (failures.length > 0) {
  console.log(`\n  Failures:`);
  for (const f of failures) {
    console.log(`    - ${f.label}: ${f.detail}`);
  }
}

process.exit(failed > 0 ? 1 : 0);
