#!/usr/bin/env node

/**
 * smoke-sitemap-root.mjs
 *
 * Verifies that the live root sitemap and robots.txt are accessible.
 * Also verifies locale routes return 404.
 *
 * Usage: BASE_URL=http://localhost:3000 node scripts/smoke-sitemap-root.mjs
 */

import { request as httpRequest } from "http";
import { request as httpsRequest } from "https";

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  console.error("BASE_URL environment variable is required");
  console.error("Usage: BASE_URL=http://localhost:3000 node scripts/smoke-sitemap-root.mjs");
  process.exit(1);
}

const TEST_PAGES = [
  { url: "/sitemap.xml", expected: 200, label: "root sitemap" },
  { url: "/robots.txt", expected: 200, label: "robots.txt" },
  { url: "/en", expected: 404, label: "locale /en" },
  { url: "/tr", expected: 404, label: "locale /tr" },
];

// Check if sitemap-tools.xml should also be tested
const SITEMAP_TOOLS_PATH = "/sitemap-tools.xml";

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

  console.log("\n=== SITEMAP ROOT SMOKE TEST ===");
  console.log(`Base URL: ${BASE_URL}\n`);

  // Test defined pages
  for (const test of TEST_PAGES) {
    try {
      console.log(`  Testing: ${test.url} (expected: ${test.expected})`);
      const { statusCode, body } = await fetchPage(test.url);

      if (statusCode === test.expected) {
        console.log(`    \u2705 Status: ${statusCode} - ${test.label}`);

        // Additional checks
        if (test.url === "/sitemap.xml") {
          if (body.includes("<?xml") || body.includes("<urlset") || body.includes("<sitemapindex")) {
            console.log(`    \u2705 Valid XML content`);
          } else {
            console.error(`    \u274C Not valid XML`);
            results.push({ url: test.url, passed: false, status: statusCode });
            exitCode = 1;
            continue;
          }
        }

        if (test.url === "/robots.txt") {
          if (body.includes("sitemap.xml") || body.includes("Sitemap:")) {
            console.log(`    \u2705 References sitemap.xml`);
          } else {
            console.warn(`    \u26A0\uFE0F No sitemap.xml reference found`);
          }
        }

        results.push({ url: test.url, passed: true, status: statusCode });
      } else {
        console.error(`    \u274C Status: ${statusCode} (expected ${test.expected})`);
        results.push({ url: test.url, passed: false, status: statusCode });
        exitCode = 1;
      }
    } catch (err) {
      console.error(`    \u274C Error: ${err.message}`);
      results.push({ url: test.url, passed: false, status: 0 });
      exitCode = 1;
    }
  }

  // Optional: test /sitemap-tools.xml (non-fatal if 404)
  try {
    console.log(`\n  Testing: ${SITEMAP_TOOLS_PATH} (optional)`);
    const { statusCode } = await fetchPage(SITEMAP_TOOLS_PATH);
    if (statusCode === 200) {
      console.log(`    \u2705 Status: ${statusCode} - sitemap-tools.xml exists`);
    } else {
      console.log(`    \u2139\uFE0F Status: ${statusCode} (not used)`);
    }
  } catch {
    console.log(`    \u2139\uFE0F Not reachable`);
  }

  // Summary
  console.log("\n=== SUMMARY ===");
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`  Passed: ${passed}/${results.length}`);
  console.log(`  Failed: ${failed}/${results.length}`);

  if (exitCode === 0) {
    console.log("\n\u2705 SITEMAP ROOT SMOKE TEST PASSED");
  } else {
    console.error("\n\u274C SITEMAP ROOT SMOKE TEST FAILED");
  }

  process.exit(exitCode);
}

run();
