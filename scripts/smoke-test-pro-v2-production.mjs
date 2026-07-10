#!/usr/bin/env node
// SectorCalc — PRO V2 Production Smoke Test
// Fails unless the production URL contains expected content markers.
// Usage: node scripts/smoke-test-pro-v2-production.mjs

const BASE = "https://sectorcalc.com";

const REQUESTS = [
  {
    name: "Machine Hourly Rate Proof Report",
    url: `${BASE}/tools/pro/machine-hourly-rate-proof-report`,
    requiredMarkers: [
      "Machine Hourly Rate Proof Report",
      "Planned Operating Hours",
      "Machine Purchase Price",
      "Current Shop Rate",
      "Target Revenue Margin",
      "Calculate",
    ],
    forbiddenMarkers: [
      "PRO_V2_REGISTRY_CONTRACT_MISSING",
      "This tool is temporarily unavailable",
    ],
  },
  {
    name: "Weld Procedure Cost (regression check)",
    url: `${BASE}/tools/pro/weld-procedure-cost-consumable-estimation-suite`,
    requiredMarkers: [
      "Weld Procedure Cost",
      "Weld Length",
      "Calculate",
    ],
    forbiddenMarkers: [
      "PRO_V2_REGISTRY_CONTRACT_MISSING",
    ],
  },
];

async function fetchText(url) {
  const resp = await fetch(url);
  const text = await resp.text();
  return { status: resp.status, text };
}

let allPass = true;

for (const req of REQUESTS) {
  console.log(`\n--- ${req.name} ---`);
  try {
    const { status, text } = await fetchText(req.url);
    console.log(`  HTTP ${status}`);

    if (status !== 200) {
      console.error(`  FAIL: Expected HTTP 200, got ${status}`);
      allPass = false;
      continue;
    }

    for (const marker of req.requiredMarkers) {
      if (text.includes(marker)) {
        console.log(`  PASS: Contains "${marker}"`);
      } else {
        console.error(`  FAIL: Missing "${marker}"`);
        allPass = false;
      }
    }

    for (const marker of req.forbiddenMarkers) {
      if (text.includes(marker)) {
        console.error(`  FAIL: Contains forbidden "${marker}"`);
        allPass = false;
      } else {
        console.log(`  PASS: No forbidden "${marker}"`);
      }
    }
  } catch (err) {
    console.error(`  FAIL: Request failed — ${err.message}`);
    allPass = false;
  }
}

console.log(`\n========================================`);
if (allPass) {
  console.log("SMOKE TEST RESULT = PASS");
} else {
  console.error("SMOKE TEST RESULT = FAIL");
  process.exit(1);
}
