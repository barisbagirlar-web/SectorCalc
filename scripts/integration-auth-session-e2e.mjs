#!/usr/bin/env node
/**
 * SectorCalc Integration — Auth → Session → Pro Runtime Regression
 *
 * This script validates the full authenticated pipeline:
 *   1) Route conflict resolution (static assets must return 200)
 *   2) Unauthenticated guard (session/create must return 401)
 *   3) Firebase email login  →  POST /api/auth/login
 *   4) Session cookie create →  POST /api/auth/session  →  __session cookie
 *   5) Pro session creation  →  POST /api/pro-tool-session/create
 *   6) Pro tool execution    →  POST /api/pro-tool-execute
 *
 * Environment:
 *   BARIS_E2E_BASE_URL      (default http://localhost:3000)
 *   BARIS_E2E_TEST_USER_EMAIL
 *   BARIS_E2E_TEST_USER_PASSWORD
 *   BARIS_E2E_TOOL_KEY      (default break-even-survival-cash-calculator)
 *
 * Exit code: 0 = ALL PASS, 1 = any failure.
 * Output is machine parseable:  KEY=STATUS  or  KEY=FAIL:reason
 */

const BASE = process.env.BARIS_E2E_BASE_URL || "http://localhost:3000";
const EMAIL = process.env.BARIS_E2E_TEST_USER_EMAIL || "";
const PASSWORD = process.env.BARIS_E2E_TEST_USER_PASSWORD || "";
const TOOL_KEY = process.env.BARIS_E2E_TOOL_KEY || "break-even-survival-cash-calculator";
const CREDS_PRESENT = EMAIL.length > 0 && PASSWORD.length > 0;

let exitCode = 0;
const results = [];

function pass(key, detail) {
  results.push(`PASS  ${key}  ${detail || ""}`);
  console.log(`  ✅  ${key}  ${detail || ""}`);
}

function fail(key, detail) {
  results.push(`FAIL  ${key}  ${detail || ""}`);
  console.log(`  ❌  ${key}  ${detail || ""}`);
  exitCode = 1;
}

function skip(key, detail) {
  results.push(`SKIP  ${key}  ${detail || ""}`);
  console.log(`  ⏭️  ${key}  ${detail || ""}`);
}

async function getStatus(url, expected = 200) {
  const res = await fetch(url, { redirect: "manual" });
  const ok = res.status === expected;
  if (ok) pass(`GET ${url}`, `= ${expected}`);
  else fail(`GET ${url}`, `expected ${expected}, got ${res.status}`);
  return res;
}

async function main() {
  console.log("\n═══════════════════════════════════════════");
  console.log("  SECTORCALC INTEGRATION — AUTH SESSION E2E");
  console.log(`  BASE_URL = ${BASE}`);
  console.log(`  TOOL_KEY = ${TOOL_KEY}`);
  console.log(`  CREDS    = ${CREDS_PRESENT ? "provided" : "MISSING (credential tests skipped)"}`);
  console.log("═══════════════════════════════════════════\n");

  // ── 1. Route conflict resolution ───────────────────────
  console.log("── [1] Route conflict resolution ──");
  const staticRoutes = [
    "/manifest.webmanifest",
    "/icon.png",
    "/favicon.ico",
    "/robots.txt",
  ];
  for (const route of staticRoutes) {
    await getStatus(`${BASE}${route}`, 200);
  }

  // ── 2. Unauthenticated guard ────────────────────────────
  console.log("\n── [2] Unauthenticated guards ──");
  const unauthRes = await fetch(`${BASE}/api/pro-tool-session/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toolKey: TOOL_KEY }),
  });
  if (unauthRes.status === 401) {
    pass("POST /api/pro-tool-session/create (no auth)", "= 401");
  } else {
    fail("POST /api/pro-tool-session/create (no auth)", `expected 401, got ${unauthRes.status}`);
  }

  // Pro pages must return 200 (not 404)
  const proSlugs = [
    "break-even-survival-cash-calculator",
    "machine-hourly-rate-proof-report",
    "job-quote-builder-pro-pack",
    "true-employee-cost-statement",
  ];
  for (const slug of proSlugs) {
    await getStatus(`${BASE}/tools/pro/${slug}`, 200);
  }

  // ── 3–6. Authenticated flow (only when credentials present) ──
  if (!CREDS_PRESENT) {
    console.log("\n── [3-6] Authenticated flow ──");
    skip("AUTH_FLOW", "No test credentials — set BARIS_E2E_TEST_USER_EMAIL and BARIS_E2E_TEST_USER_PASSWORD");
    skip("SESSION_COOKIE", "requires credentials");
    skip("PRO_SESSION", "requires credentials");
    skip("PRO_EXECUTION", "requires credentials");
  } else {
    console.log("\n── [3] Firebase login ──");
    const loginRes = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });
    if (loginRes.status !== 200) {
      const body = await loginRes.json().catch(() => ({}));
      fail("POST /api/auth/login", `expected 200, got ${loginRes.status}: ${body.error || "unknown"}`);
      process.exit(exitCode);
    }
    const loginData = await loginRes.json();
    const idToken = loginData.idToken;
    if (!idToken) {
      fail("POST /api/auth/login", "no idToken in response");
      process.exit(1);
    }
    pass("POST /api/auth/login", `200, idToken acquired`);

    // ── 4. Session cookie ──
    console.log("\n── [4] Session cookie ──");
    // Session cookie endpoint expects idToken and returns Set-Cookie
    const sessionRes = await fetch(`${BASE}/api/auth/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    const setCookie = sessionRes.headers.get("set-cookie") || "";
    const hasSessionCookie = setCookie.includes("__session");
    if (sessionRes.status === 200 && hasSessionCookie) {
      pass("POST /api/auth/session", `200, __session cookie present`);
    } else {
      fail("POST /api/auth/session", `expected 200 + __session cookie, got ${sessionRes.status}, cookie=${hasSessionCookie}`);
    }

    // ── 5. Pro session creation ──
    console.log("\n── [5] Pro session creation ──");
    const sessionCreateRes = await fetch(`${BASE}/api/pro-tool-session/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ toolKey: TOOL_KEY }),
    });
    if (sessionCreateRes.status === 200) {
      const sessionData = await sessionCreateRes.json();
      pass("POST /api/pro-tool-session/create", `200, sessionId=${sessionData.usageSessionId?.slice(0, 16)}... remainingRuns=${sessionData.remainingRuns} creditCost=${sessionData.creditCost}`);

      // ── 6. Pro tool execution ──
      console.log("\n── [6] Pro tool execution ──");
      const execRes = await fetch(`${BASE}/api/pro-tool-execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          toolKey: TOOL_KEY,
          usageSessionId: sessionData.usageSessionId,
          inputs: {
            monthly_fixed_costs: 50000,
            revenue_per_unit: 100,
            variable_cost_per_unit: 60,
            current_units_sold: 800,
            target_units: 1200,
            operating_days_per_year: 250,
            worst_case_revenue_drop_pct: 30,
          },
        }),
      });
      if (execRes.status === 200) {
        const execData = await execRes.json();
        const hasResult = execData.result && (execData.result.break_even_units || execData.result.verdict);
        if (hasResult) {
          pass("POST /api/pro-tool-execute", `200, result produced`);
          console.log(`       break_even_units=${execData.result.break_even_units}`);
          console.log(`       verdict=${execData.result.verdict}`);
        } else {
          fail("POST /api/pro-tool-execute", "200 but result empty or missing expected fields");
        }
      } else {
        const errBody = await execRes.json().catch(() => ({}));
        fail("POST /api/pro-tool-execute", `expected 200, got ${execRes.status}: ${errBody.error || "unknown"}`);
      }
    } else if (sessionCreateRes.status === 402) {
      const errBody = await sessionCreateRes.json().catch(() => ({}));
      fail("POST /api/pro-tool-session/create", "402 INSUFFICIENT_CREDITS — top up the test account");
    } else {
      const errBody = await sessionCreateRes.json().catch(() => ({}));
      fail("POST /api/pro-tool-session/create", `expected 200, got ${sessionCreateRes.status}: ${errBody.error || "unknown"}`);
    }
  }

  // ── Summary ─────────────────────────────────────────────
  const passCount = results.filter((r) => r.startsWith("PASS")).length;
  const failCount = results.filter((r) => r.startsWith("FAIL")).length;
  const skipCount = results.filter((r) => r.startsWith("SKIP")).length;

  console.log(`\n═══════════════════════════════════════════`);
  console.log(`  RESULTS: ${passCount} PASS / ${failCount} FAIL / ${skipCount} SKIP`);
  console.log(`  OVERALL: ${exitCode === 0 ? "✅ ALL ACCEPTED" : "❌ FAILURES DETECTED"}`);
  console.log(`═══════════════════════════════════════════\n`);

  process.exit(exitCode);
}

main().catch((err) => {
  console.error("SCRIPT_CRASH:", err);
  process.exit(1);
});
