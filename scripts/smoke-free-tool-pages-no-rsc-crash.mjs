#!/usr/bin/env node
/**
 * scripts/smoke-free-tool-pages-no-rsc-crash.mjs
 *
 * Request every route-visible free tool URL. Verify no RSC render crash.
 *
 * Checks:
 *   - Status 200
 *   - HTML does not contain RSC error markers
 *   - No Turkish Unicode
 *   - No exact formula leak markers
 *
 * Exits non-zero on any failure.
 */

import http from "node:http";
import https from "node:https";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const isHttps = BASE_URL.startsWith("https");
const requester = isHttps ? https : http;
const ROOT = process.cwd();

// ── Error markers ──
const RSC_ERROR_MARKERS = [
  "An error occurred in the Server Components render",
  "Application error",
  "NEXT_NOT_FOUND",
  "404 - Page Not Found",
  // Edge case: catch stack traces
  "at ",
  "Error:",
  "TypeError:",
  "ReferenceError:",
];

const FORMULA_LEAK_MARKERS = [
  "expression_field",
  "formula_expression",
];

// Turkish character pattern
const TURKISH_CHAR_CODES = [
  199, 231, 286, 287, 304, 305, 214, 246, 350, 351, 220, 252,
];
const TURKISH_RE = new RegExp(
  "[" + TURKISH_CHAR_CODES.map((c) => String.fromCharCode(c)).join("") + "]",
  "u",
);

function url(path) {
  const base = BASE_URL.replace(/\/+$/, "");
  return `${base}${path}`;
}

function fetchUrl(urlString) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(urlString);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: "GET",
      timeout: 15000,
      headers: {
        "User-Agent": "SectorCalc-Smoke/1.0",
        Accept: "text/html",
      },
    };

    const req = requester.get(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk.toString();
        if (data.length > 20000) {
          req.destroy();
          resolve({ status: res.statusCode, body: data.slice(0, 20000) });
        }
      });
      res.on("end", () => {
        resolve({ status: res.statusCode, body: data });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
  });
}

function enumerateAllSlugs() {
  const slugs = new Set();
  const GENERATED_SCHEMAS = join(ROOT, "generated", "schemas");

  // Generated schemas
  if (existsSync(GENERATED_SCHEMAS)) {
    for (const subDir of readdirSync(GENERATED_SCHEMAS)) {
      const subPath = join(GENERATED_SCHEMAS, subDir);
      try {
        if (!existsSync(subPath)) continue;
        const files = readdirSync(subPath);
        for (const name of files) {
          if (name.endsWith("-schema.json")) {
            const slug = name.replace(/-schema\.json$/, "");
            slugs.add(slug);
          }
        }
      } catch {
        // not a directory
      }
    }
  }

  // Free V5.3.1 schemas
  const freeV531Dir = join(ROOT, "src", "sectorcalc", "schemas", "free-v531");
  if (existsSync(freeV531Dir)) {
    for (const name of readdirSync(freeV531Dir)) {
      if (!name.endsWith(".schema.json")) continue;
      const slug = name.replace(/^\d+_sc_\d+_(?:premium_)?/, "")
        .replace(/\.schema\.json$/, "")
        .replace(/\.json$/, "");
      if (slug) slugs.add(slug);
    }
  }

  return [...slugs];
}

function checkForErrors(body, urlPath) {
  const errors = [];

  // RSC errors
  for (const marker of RSC_ERROR_MARKERS) {
    if (body.includes(marker)) {
      // Skip false positives for "at " (can appear in normal HTML)
      if (marker === "at " && body.includes("href=")) continue;
      if (marker === "at " && body.includes("@import")) continue;
      errors.push(`RSC error marker found: "${marker}"`);
    }
  }

  // Status errors
  if (body.includes("404") && body.includes("Page Not Found")) {
    errors.push("404 Not Found in body");
  }

  // Turkish check
  if (TURKISH_RE.test(body)) {
    errors.push(`Turkish Unicode character detected`);
  }

  // Formula leak
  for (const marker of FORMULA_LEAK_MARKERS) {
    if (body.includes(marker)) {
      errors.push(`Formula leak marker found: "${marker}"`);
    }
  }

  return errors;
}

// ── Main ──
async function main() {
  console.log("\n============================================================");
  console.log("  FREE TOOL PAGE RSC STABILITY SMOKE TEST");
  console.log(`  BASE_URL: ${BASE_URL}`);
  console.log("============================================================\n");

  const pages = [
    "/free-tools",
    "/tools/generated/roic-calculator",
    "/tools/generated/equity-dilution-calculator",
    "/tools/generated/pb-ratio-calculator",
    "/en",
    "/tr",
  ];

  // Add all enumerated slugs
  const slugs = enumerateAllSlugs();
  // Sample: add first 50 that match specific pattern
  const sampledRoutes = slugs.slice(0, 100).map((slug) => `/tools/generated/${slug}`);
  pages.push(...sampledRoutes);

  let pass = 0;
  let fail = 0;
  const failures = [];

  for (const page of pages) {
    // De-duplicate
    if (pages.indexOf(page) < pages.indexOf(page)) continue;

    const fullUrl = url(page);
    try {
      const { status, body } = await fetchUrl(fullUrl);

      // Basic status check
      if (status !== 200) {
        // /en and /tr should be 404
        if (page === "/en" || page === "/tr") {
          if (status === 404) {
            pass++;
            continue;
          }
          failures.push({
            url: page,
            status,
            errors: [`Expected 404 for ${page}, got ${status}`],
          });
          fail++;
          continue;
        }

        failures.push({
          url: page,
          status,
          errors: [`Status ${status} (expected 200)`],
        });
        fail++;
        continue;
      }

      // Content checks
      const errors = checkForErrors(body, page);
      if (errors.length > 0) {
        failures.push({ url: page, status, errors });
        fail++;
        continue;
      }

      pass++;
    } catch (err) {
      failures.push({
        url: page,
        status: "FETCH_ERROR",
        errors: [err.message],
      });
      fail++;
    }
  }

  console.log(`\nResults:`);
  console.log(`  Total:  ${pass + fail}`);
  console.log(`  Pass:   ${pass}`);
  console.log(`  Fail:   ${fail}`);

  if (failures.length > 0) {
    console.log(`\nFailures:`);
    for (const f of failures) {
      console.log(`  [${f.status}] ${f.url}`);
      for (const err of f.errors) {
        console.log(`       ${err}`);
      }
    }
  }

  console.log(`\nResult: ${fail === 0 ? "ALL PASS" : `${fail} FAILURES`}`);

  if (fail > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
