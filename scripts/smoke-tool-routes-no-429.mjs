#!/usr/bin/env node

/**
 * smoke-tool-routes-no-429.mjs
 *
 * Tests that public tool routes do NOT return 429.
 * Tests both plain GET and _rsc-prefetch variants.
 *
 * Expected output: each route shows PASS or FAIL with status code.
 * If server is not running, exits non-zero with SERVER_NOT_RUNNING.
 */

const BASE_URL = process.env.SMOKE_BASE_URL || "http://localhost:3000";

const ROUTES = [
  { path: "/", label: "Homepage" },
  { path: "/pro-tools", label: "Pro tools catalog" },
  { path: "/free-tools", label: "Free tools catalog" },
  { path: "/tools/pro/carbon-price-exposure", label: "Pro tool: carbon-price-exposure" },
  { path: "/tools/pro/break-even-survival-cash-calculator", label: "Pro tool: break-even-survival-cash" },
  { path: "/tools/pro/machine-hourly-rate-proof-report", label: "Pro tool: machine-hourly-rate" },
  { path: "/pricing", label: "Pricing page" },
  { path: "/industries", label: "Industries page" },
];

let exitCode = 0;

async function checkRoute(path, label, method = "GET") {
  const url = `${BASE_URL}${path}`;
  const isRsc = path.includes("_rsc");
  const labelSuffix = isRsc ? " [RSC]" : "";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(url, {
      method,
      signal: controller.signal,
      redirect: "manual",
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        ...(isRsc ? { "RSC": "1" } : {}),
      },
    });

    clearTimeout(timeout);

    if (response.status === 429) {
      console.error(`  FAIL: ${label}${labelSuffix} — returned 429`);
      exitCode = 1;
    } else {
      console.log(`  PASS: ${label}${labelSuffix} — ${response.status} ${response.statusText}`);
    }
  } catch (err) {
    if (err.name === "AbortError") {
      console.error(`  FAIL: ${label}${labelSuffix} — request timed out after 10s`);
      exitCode = 1;
    } else if (err.code === "ECONNREFUSED") {
      console.error(`\nSERVER_NOT_RUNNING: Cannot connect to ${BASE_URL}`);
      process.exit(2);
    } else {
      console.error(`  FAIL: ${label}${labelSuffix} — ${err.message}`);
      exitCode = 1;
    }
  }
}

async function main() {
  console.log(`smoke-tool-routes-no-429.mjs — testing public routes against ${BASE_URL}\n`);

  // Test plain GET for each route
  for (const { path, label } of ROUTES) {
    await checkRoute(path, label, "GET");
  }

  // Test RSC-prefetch for each route
  console.log("");
  for (const { path, label } of ROUTES) {
    const rscPath = path.includes("?") ? `${path}&_rsc=test` : `${path}?_rsc=test`;
    await checkRoute(rscPath, label, "GET");
  }

  console.log("");
  if (exitCode === 0) {
    console.log("SMOKE_NO_429=PASS");
  } else {
    console.log("SMOKE_NO_429=FAIL — some routes returned 429");
  }
  process.exit(exitCode);
}

main();
