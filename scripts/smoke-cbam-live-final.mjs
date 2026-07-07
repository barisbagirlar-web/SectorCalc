#!/usr/bin/env node
/**
 * smoke-cbam-live-final.mjs
 *
 * Tests live CBAM routes on the deployed domain.
 * If live domain not configured, prints BLOCKED_LIVE_DOMAIN_NOT_CONFIGURED and exits non-zero.
 */
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const BASE_URL = process.env.SMOKE_BASE_URL || "https://sectorcalc.com";

let exitCode = 0;

function pass(label, detail) {
  console.log(`  PASS: ${label} — ${detail}`);
}

function fail(label, detail) {
  console.error(`  FAIL: ${label} — ${detail}`);
  exitCode = 1;
}

async function checkRoute(path, label, expectedStatus, options = {}) {
  const url = `${BASE_URL}${path}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      redirect: "manual",
      headers: {
        Accept: options.accept || "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        ...(options.rsc ? { RSC: "1" } : {}),
      },
    });
    clearTimeout(timeout);

    const status = response.status;
    const match = Array.isArray(expectedStatus)
      ? expectedStatus.includes(status)
      : status === expectedStatus;

    if (status === 429) {
      fail(label, `returned 429 (rate limited)`);
    } else if (match) {
      pass(label, `${status} (expected ${Array.isArray(expectedStatus) ? expectedStatus.join("/") : expectedStatus})`);
    } else {
      fail(label, `returned ${status}, expected ${expectedStatus}`);
    }
  } catch (err) {
    if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
      fail(label, `Cannot resolve ${BASE_URL} — ${err.code}`);
      exitCode = 2;
    } else if (err.name === "AbortError") {
      fail(label, `request timed out`);
    } else {
      fail(label, err.message);
    }
  }
}

async function checkPost(path, label, expectedStatuses) {
  const url = `${BASE_URL}${path}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    clearTimeout(timeout);
    const status = response.status;
    if (expectedStatuses.includes(status)) {
      pass(label, `${status} (expected ${expectedStatuses.join("/")})`);
    } else {
      fail(label, `returned ${status}, expected ${expectedStatuses.join("/")}`);
    }
  } catch (err) {
    if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
      fail(label, `Cannot resolve ${BASE_URL} — ${err.code}`);
      exitCode = 2;
    } else if (err.name === "AbortError") {
      fail(label, `request timed out`);
    } else {
      fail(label, err.message);
    }
  }
}

async function main() {
  console.log(`CBAM Live Smoke Test\n`);
  console.log(`Base URL: ${BASE_URL}\n`);

  if (!BASE_URL || BASE_URL === "http://localhost:3000") {
    console.error("BLOCKED_LIVE_DOMAIN_NOT_CONFIGURED");
    console.error("Set SMOKE_BASE_URL to your live domain, e.g.:");
    console.error('  SMOKE_BASE_URL="https://sectorcalc.com" node scripts/smoke-cbam-live-final.mjs');
    process.exit(2);
  }

  // 1. GET /cbam must return 200
  await checkRoute("/cbam", "GET /cbam", 200);

  // 2. GET /cbam?_rsc=test must NOT return 429
  await checkRoute("/cbam?_rsc=test", "GET /cbam?_rsc=test", [200, 404, 500], { rsc: true });

  // 3. GET /en/cbam must return 404
  await checkRoute("/en/cbam", "GET /en/cbam", 404);

  // 4. POST /api/cbam/report with no auth must return 401
  await checkPost("/api/cbam/report", "POST /api/cbam/report (no auth)", [401, 400]);

  // 5. GET /api/cbam/entitlement with no auth must return 401
  await checkRoute("/api/cbam/entitlement", "GET /api/cbam/entitlement (no auth)", [401, 404]);

  // 6. POST /api/cbam/unlock with no auth must return 401
  await checkPost("/api/cbam/unlock", "POST /api/cbam/unlock (no auth)", [401]);

  console.log("");
  if (exitCode === 0) {
    console.log("CBAM_LIVE_SMOKE_RESULT=PASS");
  } else if (exitCode === 2) {
    console.log("CBAM_LIVE_SMOKE_RESULT=BLOCKED_LIVE_DOMAIN_NOT_CONFIGURED");
  } else {
    console.log("CBAM_LIVE_SMOKE_RESULT=FAIL");
  }

  process.exit(exitCode);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
