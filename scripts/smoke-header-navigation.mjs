#!/usr/bin/env node

/**
 * smoke-header-navigation.mjs
 *
 * Verifies that critical header navigation routes return expected status codes.
 * Tests live/local routes.
 *
 * Usage: BASE_URL=http://localhost:3000 node scripts/smoke-header-navigation.mjs
 */

import { request as httpRequest } from "http";
import { request as httpsRequest } from "https";

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  console.error("BASE_URL environment variable is required");
  console.error("Usage: BASE_URL=http://localhost:3000 node scripts/smoke-header-navigation.mjs");
  process.exit(1);
}

const TEST_PAGES = [
  { url: "/", expected: 200 },
  { url: "/pro-tools", expected: 200 },
  { url: "/free-tools", expected: 200 },
  { url: "/pricing", expected: 200 },
  { url: "/en", expected: 404 },
  { url: "/tr", expected: 404 },
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
          resolve({ statusCode: res.statusCode, body: data });
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

  console.log("\n=== HEADER NAVIGATION SMOKE TEST ===");
  console.log(`Base URL: ${BASE_URL}\n`);

  for (const test of TEST_PAGES) {
    try {
      console.log(`  Testing: ${test.url} (expected: ${test.expected})`);
      const { statusCode, body } = await fetchPage(test.url);

      if (statusCode === test.expected) {
        console.log(`    ✅ Status: ${statusCode}`);
        results.push({ url: test.url, passed: true, status: statusCode });
      } else {
        console.error(`    ❌ Status: ${statusCode} (expected ${test.expected})`);
        results.push({ url: test.url, passed: false, status: statusCode });
        exitCode = 1;
      }

      // For successful pages, check for "Node cannot be found"
      if (statusCode === 200 && body.includes("Node cannot be found")) {
        console.error(`    ❌ Page contains "Node cannot be found" error`);
        results.push({ url: test.url, passed: false, status: statusCode });
        exitCode = 1;
      }
    } catch (err) {
      console.error(`    ❌ Error: ${err.message}`);
      results.push({ url: test.url, passed: false, status: 0 });
      exitCode = 1;
    }
  }

  console.log("\n=== SUMMARY ===");
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`  Passed: ${passed}/${results.length}`);
  console.log(`  Failed: ${failed}/${results.length}`);

  if (exitCode === 0) {
    console.log("\n✅ HEADER NAVIGATION SMOKE TEST PASSED");
  } else {
    console.error("\n❌ HEADER NAVIGATION SMOKE TEST FAILED");
  }

  process.exit(exitCode);
}

run();
