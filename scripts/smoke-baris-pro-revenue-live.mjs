#!/usr/bin/env node
// SectorCalc PRO V5.3.1 — Live Revenue Smoke Test (Paddle)
// Tests production domain for revenue-critical paths.
// SMOKE_BASE_URL env var required (defaults to https://sectorcalc.com)

const BASE_URL = process.env.SMOKE_BASE_URL || "https://sectorcalc.com";
const LIVE_TOOL = "break-even-survival-cash-calculator";
const ASSISTED_TOOL = "pressure-vessel-wall-thickness-mawp-hydrotest-package";

let failures = 0;
let passed = 0;
let instantUrlCreated = false;
let assistedUrlCreated = false;
let secretLeakFound = false;

function check(label, ok, detail) {
  if (ok) {
    passed++;
    console.log(`  \u2705 PASS: ${label}${detail ? ` \u2014 ${detail}` : ""}`);
  } else {
    failures++;
    console.log(`  \u274c FAIL: ${label}${detail ? ` \u2014 ${detail}` : ""}`);
  }
}

async function smoke() {
  console.log(`\n\u2550\u2550\u2550 Baris PRO Paddle Revenue Smoke Test \u2550\u2550\u2550`);
  console.log(`  Base URL: ${BASE_URL}`);
  console.log(`  Live tool: ${LIVE_TOOL}`);
  console.log(`  Assisted tool: ${ASSISTED_TOOL}`);
  console.log(`  Provider: PADDLE\n`);

  // ── Route checks ──

  // 1. /pro-tools returns 200
  try {
    const r1 = await fetch(`${BASE_URL}/pro-tools`, { method: "GET", redirect: "manual" });
    const ok1 = r1.status === 200 || r1.status === 304;
    check("GET /pro-tools returns 200", ok1, `status ${r1.status}`);
  } catch (e) {
    check("GET /pro-tools", false, `fetch error: ${e.message}`);
  }

  // 2. Live Baris tool page
  try {
    const r2 = await fetch(`${BASE_URL}/tools/pro/${LIVE_TOOL}`, { method: "GET", redirect: "manual" });
    const ok2 = r2.status === 200 || r2.status === 304;
    check(`GET /tools/pro/${LIVE_TOOL} (live tool) returns 200`, ok2, `status ${r2.status}`);
  } catch (e) {
    check(`GET live tool page`, false, `fetch error: ${e.message}`);
  }

  // 3. Assisted Baris tool page
  try {
    const r3 = await fetch(`${BASE_URL}/tools/pro/${ASSISTED_TOOL}`, { method: "GET", redirect: "manual" });
    const ok3 = r3.status === 200 || r3.status === 304;
    check(`GET /tools/pro/${ASSISTED_TOOL} (assisted tool) returns 200`, ok3, `status ${r3.status}`);
  } catch (e) {
    check(`GET assisted tool page`, false, `fetch error: ${e.message}`);
  }

  // 4. /en route must 404
  try {
    const r4 = await fetch(`${BASE_URL}/en/pro-tools`, { method: "GET", redirect: "manual" });
    check("GET /en/pro-tools returns 404 (root-only)", r4.status === 404, `status ${r4.status}`);
  } catch (e) {
    check("GET /en/pro-tools", false, `fetch error: ${e.message}`);
  }

  // ── Checkout checks via Paddle ──

  // 5. Live tool checkout via Paddle
  try {
    const r5 = await fetch(`${BASE_URL}/api/checkout/paddle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "BARIS_PRO_PURCHASE",
        toolKey: LIVE_TOOL,
        userId: "smoke-test-anonymous",
      }),
    });
    const body5 = await r5.text();
    let data5;
    try { data5 = JSON.parse(body5); } catch { data5 = { error: body5 }; }
    const isPaddleOk = r5.status === 200 && data5.checkoutUrl && typeof data5.checkoutUrl === "string";
    const isControlledBlock = r5.status >= 400 && r5.status < 600 &&
      (body5.includes("PADDLE_PRICE_ID_REQUIRED") || body5.includes("Payment system not configured") || body5.includes("Missing env key") || body5.includes("PADDLE_API_KEY"));
    const isStripeLeak = body5.includes("STRIPE_PRICE_ID_REQUIRED") || body5.includes("stripe");
    if (isStripeLeak) secretLeakFound = true;
    check("POST /api/checkout/paddle: live tool",
      isPaddleOk || isControlledBlock,
      isPaddleOk ? `checkout URL created (${data5.checkoutUrl.substring(0, 60)}...)` :
      isControlledBlock ? `controlled block: ${body5.substring(0, 100)}` :
      isStripeLeak ? `STRIPE LEAK: ${body5.substring(0, 100)}` :
      `unexpected: ${r5.status} ${body5.substring(0, 100)}`);
    if (isPaddleOk) instantUrlCreated = true;
    if (isStripeLeak) failures++; // Stripe in Paddle flow = auto-fail
  } catch (e) {
    check("POST /api/checkout/paddle: live tool", false, `fetch error: ${e.message}`);
  }

  // 6. Assisted tool checkout via Paddle
  try {
    const r6 = await fetch(`${BASE_URL}/api/checkout/paddle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "BARIS_PRO_PURCHASE",
        toolKey: ASSISTED_TOOL,
        userId: "smoke-test-anonymous",
      }),
    });
    const body6 = await r6.text();
    let data6;
    try { data6 = JSON.parse(body6); } catch { data6 = { error: body6 }; }
    const isPaddleOk = r6.status === 200 && data6.checkoutUrl && typeof data6.checkoutUrl === "string";
    const isControlledBlock = r6.status >= 400 && r6.status < 600 &&
      (body6.includes("PADDLE_PRICE_ID_REQUIRED") || body6.includes("Payment system not configured") || body6.includes("Missing env key") || body6.includes("PADDLE_API_KEY"));
    const isStripeLeak = body6.includes("STRIPE_PRICE_ID_REQUIRED") || body6.includes("stripe");
    if (isStripeLeak) secretLeakFound = true;
    check("POST /api/checkout/paddle: assisted tool",
      isPaddleOk || isControlledBlock,
      isPaddleOk ? `checkout URL created (${data6.checkoutUrl.substring(0, 60)}...)` :
      isControlledBlock ? `controlled block: ${body6.substring(0, 100)}` :
      isStripeLeak ? `STRIPE LEAK: ${body6.substring(0, 100)}` :
      `unexpected: ${r6.status} ${body6.substring(0, 100)}`);
    if (isPaddleOk) assistedUrlCreated = true;
    if (isStripeLeak) failures++;
  } catch (e) {
    check("POST /api/checkout/paddle: assisted tool", false, `fetch error: ${e.message}`);
  }

  // ── Execute checks ──

  // 7. Execute live tool without entitlement → PRO_ENTITLEMENT_REQUIRED
  try {
    const r7 = await fetch(`${BASE_URL}/api/pro-calculator/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolKey: LIVE_TOOL,
        raw_inputs: {},
        selected_units: {},
        user_profile_mode: "engineering",
      }),
    });
    const data7 = r7.status === 200 ? await r7.json() : r7.status >= 400 ? await r7.json().catch(() => ({})) : {};
    const blocked = data7.pipeline_state === "PRO_ENTITLEMENT_REQUIRED" ||
                     data7.status === "BLOCKED" ||
                     data7.reason === "PRO_ENTITLEMENT_REQUIRED" ||
                     r7.status === 402 || r7.status === 403;
    check("POST execute live tool (no auth) => blocked", blocked,
      `status ${r7.status}, reason: ${data7.reason || data7.pipeline_state || "N/A"}`);
  } catch (e) {
    check("POST execute live tool (no auth)", false, `fetch error: ${e.message}`);
  }

  // 8. Execute assisted tool => ASSISTED_DOSSIER_ONLY
  try {
    const r8 = await fetch(`${BASE_URL}/api/pro-calculator/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolKey: ASSISTED_TOOL,
        raw_inputs: {},
        selected_units: {},
        user_profile_mode: "engineering",
      }),
    });
    const data8 = r8.status === 200 ? await r8.json() : r8.status >= 400 ? await r8.json().catch(() => ({})) : {};
    const blocked = data8.pipeline_state === "ASSISTED_DOSSIER_ONLY" ||
                     data8.status === "BLOCKED" ||
                     data8.reason === "ASSISTED_DOSSIER_ONLY" ||
                     r8.status === 403;
    check("POST execute assisted tool => blocked", blocked,
      `status ${r8.status}, reason: ${data8.reason || data8.pipeline_state || "N/A"}`);
  } catch (e) {
    check("POST execute assisted tool", false, `fetch error: ${e.message}`);
  }

  // ── RSC safety ──
  // 9. _rsc request does not return 429
  try {
    const r9 = await fetch(`${BASE_URL}/pro-tools`, {
      method: "GET",
      headers: { "RSC": "1" },
    });
    check("GET /pro-tools with RSC header", r9.status !== 429,
      `status ${r9.status}${r9.status === 429 ? " (RATE LIMITED)" : ""}`);
  } catch (e) {
    check("RSC request", false, `fetch error: ${e.message}`);
  }

  // ── Secret leak check ──
  check("Response secret leak check", !secretLeakFound,
    secretLeakFound ? "Stripe or secret leaked in checkout response" : "clean");

  // ── Summary ──
  const total = passed + failures;
  console.log(`\n  Checks: ${passed} passed, ${failures} failed out of ${total}`);
  console.log(`  PAYMENT_PROVIDER=PADDLE`);
  console.log(`  CHECKOUT_INSTANT_CREATED=${instantUrlCreated ? "YES" : "NO"}`);
  console.log(`  CHECKOUT_ASSISTED_CREATED=${assistedUrlCreated ? "YES" : "NO"}`);

  if (failures > 0) {
    console.log("\n  \u26a0\ufe0f BARIS_PRO_REVENUE_SMOKE=FAIL (see failures above)\n");
  } else {
    console.log("\n  \u2705 BARIS_PRO_REVENUE_SMOKE=PASS\n");
  }

  process.exit(failures > 0 ? 1 : 0);
}

smoke().catch(err => {
  console.error(`\n  \u274c FATAL: ${err.message}`);
  process.exit(1);
});
