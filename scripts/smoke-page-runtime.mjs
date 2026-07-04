// SectorCalc Page Runtime Smoke Test
// Tests live pages for correct rendering.
// Usage: BASE_URL=http://localhost:3000 node scripts/smoke-page-runtime.mjs

import { request as httpRequest } from "http";
import { request as httpsRequest } from "https";

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  console.error("BASE_URL environment variable is required");
  console.error("Usage: BASE_URL=http://localhost:3000 node scripts/smoke-page-runtime.mjs");
  process.exit(1);
}

const TEST_PAGES = [
  { url: "/tools/generated/welding-amperage-thickness-chart", tier: "FREE" },
  { url: "/tools/generated/paint-coverage-calculator-primer", tier: "FREE" },
  { url: "/tools/generated/concrete-volume-bags-m3", tier: "FREE" },
  { url: "/tools/pro/sc-001-data-center-power-and-cooling-capacity-margin-with-occupancy-ramp-calculator", tier: "PRO" },
  { url: "/tools/pro/sc-020-cnc-spindle-power-and-tool-amortization-break-even-analysis-calculator", tier: "PRO" },
  { url: "/en", tier: "404" },
  { url: "/tr", tier: "404" },
];

function fetchPage(urlPath) {
  return new Promise((resolve, reject) => {
    const fullUrl = `${BASE_URL}${urlPath}`;
    const parsed = new URL(fullUrl);

    const requestFn = parsed.protocol === "https:" ? httpsRequest : httpRequest;

    const req = requestFn(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname,
        method: "GET",
        timeout: 15000,
        headers: {
          "User-Agent": "SectorCalc-SmokeTest/1.0",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({ statusCode: res.statusCode, body: data, headers: res.headers });
        });
      },
    );

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
    req.end();
  });
}

async function run() {
  let exitCode = 0;
  const results = [];

  console.log("=== PAGE RUNTIME SMOKE TEST ===");
  console.log(`Base URL: ${BASE_URL}`);
  console.log("");

  for (const test of TEST_PAGES) {
    try {
      console.log(`  Testing: ${test.url} (expected: ${test.tier})`);
      const { statusCode, body, headers } = await fetchPage(test.url);

      if (test.tier === "404") {
        if (statusCode === 404) {
          console.log(`    ✅ Status: ${statusCode} (expected 404)`);
          results.push({ url: test.url, passed: true, status: statusCode });
        } else {
          console.error(`    ❌ Status: ${statusCode} (expected 404)`);
          results.push({ url: test.url, passed: false, status: statusCode, error: "Expected 404" });
          exitCode = 1;
        }
        continue;
      }

      // Check status code (200 or 304)
      const validStatus = statusCode === 200 || statusCode === 304;
      if (!validStatus) {
        console.error(`    ❌ Status: ${statusCode} (expected 200)`);
        results.push({ url: test.url, passed: false, status: statusCode, error: `Unexpected status ${statusCode}` });
        exitCode = 1;
        continue;
      }

      // Check for RSC error (specific patterns, not generic "error" which appears in bundles)
      const errorPatterns = ["Error: Application error", "notFound()", "Application error"];
      const hasRealError = errorPatterns.some((p) => body.includes(p));
      if (hasRealError) {
        console.error(`    ❌ Page contains error markers`);
        results.push({ url: test.url, passed: false, status: statusCode, error: "Page contains error" });
        exitCode = 1;
        continue;
      }

      // Check for UniversalIndustrialDecisionForm render (presence of sc-v531-shell class)
      if (!body.includes("sc-v531-shell") && !body.includes("UniversalIndustrialDecisionForm")) {
        console.warn(`    ⚠️  No V5.3.1 form marker found (might be server-rendered)`);
      }

      // Check for raw slug H1
      if (body.match(/<h1[^>]*>[a-z][a-z0-9-]+<\/h1>/i)) {
        console.warn(`    ⚠️  Possible raw slug in H1`);
      }

      // Success
      console.log(`    ✅ Status: ${statusCode} - Page loads successfully`);
      results.push({ url: test.url, passed: true, status: statusCode });
    } catch (err) {
      console.error(`    ❌ Error: ${err.message}`);
      results.push({ url: test.url, passed: false, status: 0, error: err.message });
      exitCode = 1;
    }
  }

  // Summary
  console.log("");
  console.log("=== SUMMARY ===");
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`  Passed: ${passed}/${results.length}`);
  console.log(`  Failed: ${failed}/${results.length}`);

  if (exitCode === 0) {
    console.log("✅ PAGE RUNTIME SMOKE TEST PASSED");
  } else {
    console.error("❌ PAGE RUNTIME SMOKE TEST FAILED");
  }

  process.exit(exitCode);
}

run();
