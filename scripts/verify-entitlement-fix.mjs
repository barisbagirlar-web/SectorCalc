#!/usr/bin/env node
/**
 * verify-entitlement-fix.mjs
 *
 * Live test for the entitlement fix:
 * 1. Create a Pro session via /api/pro-tool-session/create
 * 2. Execute a Pro tool via /api/pro-calculator/execute with the session ID
 * 3. Verify pipeline_state is NOT BLOCKED (i.e. NOT 402 PRO_ENTITLEMENT_REQUIRED)
 *
 * Usage: ID_TOKEN="<firebase-id-token>" node scripts/verify-entitlement-fix.mjs
 */
const BASE = process.env.BASE_URL ?? "https://sectorcalc-bf412.web.app";
const TOOL_KEY = "break-even-survival-cash-calculator";

async function main() {
  const token = process.env.ID_TOKEN;
  if (!token) {
    console.error("FAIL  ID_TOKEN environment variable is required");
    console.error("Usage: ID_TOKEN=\"<token>\" node scripts/verify-entitlement-fix.mjs");
    process.exit(1);
  }

  // ── Step 1: Create session ────────────────────────────────────────
  console.log(`\n[1] POST ${BASE}/api/pro-tool-session/create`);
  console.log(`    toolKey: ${TOOL_KEY}`);

  const sessionRes = await fetch(`${BASE}/api/pro-tool-session/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ toolKey: TOOL_KEY }),
  });

  const sessionBody = await sessionRes.json();
  console.log(`    status: ${sessionRes.status}`);
  console.log(`    response: ${JSON.stringify(sessionBody, null, 2)}`);

  if (!sessionRes.ok) {
    console.error(`\nFAIL  Session creation failed with status ${sessionRes.status}`);
    console.error(`       Error: ${sessionBody.error || "Unknown"}`);
    process.exit(1);
  }

  if (!sessionBody.usageSessionId) {
    console.error("\nFAIL  No usageSessionId in response");
    process.exit(1);
  }

  const sessionId = sessionBody.usageSessionId;
  const remainingRuns = sessionBody.remainingRuns;
  console.log(`\n    ✅ Session created: ${sessionId}`);
  console.log(`    ✅ remainingRuns: ${remainingRuns}`);

  if (remainingRuns !== 3 && remainingRuns !== 999) {
    // 3 = normal, 999 = bypass
    console.warn(`\n    ⚠️  remainingRuns is ${remainingRuns} — expected 3 or 999`);
  }

  // ── Step 2: Execute Pro tool ──────────────────────────────────────
  console.log(`\n[2] POST ${BASE}/api/pro-calculator/execute`);
  console.log(`    toolKey: ${TOOL_KEY}, usageSessionId: ${sessionId}`);

  const executeRes = await fetch(`${BASE}/api/pro-calculator/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      tool_key: TOOL_KEY,
      toolKey: TOOL_KEY,
      usageSessionId: sessionId,
      raw_inputs: {
        initial_investment: 500000,
        annual_net_cash_flow: 120000,
        discount_rate: 0.1,
        analysis_years: 5,
        residual_value: 50000,
        stress_downside_factor: 0.2,
        annual_volume: 10000,
        labor_rate: 45,
        overhead_rate: 25,
        defect_or_loss_cost: 50,
        source_confidence_ratio: 0.85,
        uncertainty_multiplier: 1.5,
      },
      selected_units: {
        initial_investment: "currency_unit",
        annual_net_cash_flow: "currency_unit",
        discount_rate: "percent",
        analysis_years: "year",
        residual_value: "currency_unit",
        stress_downside_factor: "percent",
        annual_volume: "unit_per_h",
        labor_rate: "currency_unit_per_h",
        overhead_rate: "currency_unit_per_h",
        defect_or_loss_cost: "currency_unit",
        source_confidence_ratio: "ratio",
        uncertainty_multiplier: "ratio",
      },
      user_profile_mode: "engineering",
    }),
  });

  const executeBody = await executeRes.json();
  console.log(`    status: ${executeRes.status}`);
  console.log(`    pipeline_state: ${executeBody.pipeline_state || executeBody.status}`);

  // ── Step 3: Check for P0 bug (402 PRO_ENTITLEMENT_REQUIRED) ──────
  const isBlocked = executeBody.status === "BLOCKED"
    || executeBody.pipeline_state === "PRO_ENTITLEMENT_REQUIRED"
    || executeBody.pipeline_state === "BLOCKED"
    || executeRes.status === 402;

  if (isBlocked) {
    console.error(`\n❌ FAIL  P0 BUG STILL PRESENT`);
    console.error(`   Status: ${executeRes.status} — ${executeBody.pipeline_state}`);
    console.error(`   Error: ${executeBody.warnings?.[0]?.message || "Unknown"}`);
    process.exit(1);
  }

  // ── Step 4: Check audit_seal formula_version ─────────────────────
  if (executeBody.audit_seal) {
    const formulaVer = executeBody.audit_seal.formula_version;
    console.log(`    audit_seal.formula_version: ${formulaVer}`);
    if (formulaVer === "stub") {
      console.warn(`    ⚠️  formula_version is still "stub" — formula engine used schema fallback path`);
    }
  }

  // ── Output summary ───────────────────────────────────────────────
  const outputSummary = (executeBody.outputs || []).map((o) => `${o.id}: ${o.value} (${o.status})`).join(", ");
  console.log(`\n✅ PASS  Entitlement fix verified`);
  console.log(`   Tool: ${TOOL_KEY}`);
  console.log(`   Pipeline state: ${executeBody.pipeline_state || executeBody.status}`);
  console.log(`   Outputs: ${outputSummary || "none"}`);
}

main().catch((err) => {
  console.error("UNEXPECTED ERROR:", err);
  process.exit(1);
});
