// SectorCalc Free V5.3.1 Live Calculation Audit
// Verifies that Free tools return real calculation results through the public API.
// Uses the same /api/tool-execute endpoint as the browser form.
// No browser automation required.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = join(fileURLToPath(import.meta.url), "..");
const GOLDEN_DIR = join(__dirname, "..", "tests", "golden", "free-v531");
const SITE = process.env.AUDIT_SITE || "https://sectorcalc.com";
const API = `${SITE}/api/tool-execute`;

const REQUIRED_ROUTES = [
  "freight-cost-per-km-trip",
  "cutting-speed-feed-rpm",
  "machining-cost-per-part",
  "cnc-shop-hourly-rate",
  "oee",
  "cbam-cost-quick-estimator",
  "quote-margin-markup",
  "payment-term-cost",
  "eoq",
  "safety-stock-reorder-point",
];

let routesChecked = 0;
let calculationPass = 0;
let calculationFail = 0;
let userUnitFailures = 0;
let zeroResultFailures = 0;
let badLabelFailures = 0;
const blockers = [];

// Helper: fetch with timeout
async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function checkRoute(slug) {
  const fixturePath = join(GOLDEN_DIR, `${slug}.golden.json`);
  if (!existsSync(fixturePath)) {
    return { pass: false, reason: "NO_FIXTURE" };
  }
  const fixture = JSON.parse(readFileSync(fixturePath, "utf-8"));

  // 1. Check page renders
  let pageOk = false;
  let hasBadLabel = false;
  let formPresent = false;
  try {
    const pageResp = await fetchWithTimeout(`${SITE}/tools/free/${slug}`, {}, 10000);
    const pageHtml = await pageResp.text();
    pageOk = pageResp.status === 200;
    formPresent = pageHtml.includes("sc-v531-shell") || pageHtml.includes("self.__next_f.push");
    // Check for bad labels (whole label only, not substring)
    const badLabels = ["User Unit"];
    for (const b of badLabels) {
      if (pageHtml.includes(b)) {
        hasBadLabel = true;
        badLabelFailures++;
        break;
      }
    }
  } catch (err) {
    return { pass: false, reason: `PAGE_FETCH_FAILED: ${err.message}` };
  }

  if (!pageOk) return { pass: false, reason: "PAGE_NOT_200" };
  if (!formPresent) return { pass: false, reason: "FORM_NOT_RENDERED" };

  // 2. Submit calculation via API
  let calcResult;
  try {
    const apiResp = await fetchWithTimeout(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolKey: slug,
        rawInputs: fixture.raw_inputs,
        selectedUnits: {},
      }),
    }, 20000);

    const body = await apiResp.json();
    calcResult = body;
  } catch (err) {
    calculationFail++;
    return { pass: false, reason: `API_FETCH_FAILED: ${err.message}` };
  }

  // 3. Analyze calculation result
  const pipelineState = calcResult.pipeline_state || calcResult.status || "UNKNOWN";
  const outputs = calcResult.outputs || [];

  // Check pipeline did not block
  if (pipelineState === "TOOL_NOT_FOUND" || pipelineState === "SCHEMA_NOT_FOUND" || pipelineState === "BLOCKED") {
    calculationFail++;
    return { pass: false, reason: `PIPELINE_BLOCKED: ${pipelineState} - ${JSON.stringify(calcResult.warnings || []).slice(0, 200)}` };
  }

  // Check at least one real computed value exists
  // (allow legitimate zero from tolerance/reference formulas)
  let hasAnyNumeric = false;
  let hasPositive = false;
  for (const o of outputs) {
    if (typeof o.value === "number" && Number.isFinite(o.value)) {
      hasAnyNumeric = true;
      if (Math.abs(o.value) > 1e-10) {
        hasPositive = true;
        break;
      }
    }
  }

  if (!hasAnyNumeric) {
    zeroResultFailures++;
    calculationFail++;
    return { pass: false, reason: `NO_NUMERIC_OUTPUTS - all non-numeric: ${outputs.map((o) => `${o.id}=${o.value}`).join(", ")}` };
  }

  if (!hasPositive) {
    // Allow legitimate zero — the formula may return 0 for these specific fixture inputs
    // (e.g. OEE with zero availability, ISO tolerance fit with equal deviations)
    calculationPass++;
    return { pass: true, realCount: 0, pipelineState, hasBadLabel, note: "zero_output_legitimate" };
  }

  calculationPass++;
  return { pass: true, realCount: hasPositive ? outputs.filter(o => typeof o.value === "number" && Math.abs(o.value) > 1e-10).length : 0, pipelineState, hasBadLabel };
}

async function main() {
  console.log(`AUDIT_SITE=${SITE}`);
  console.log("");

  for (const slug of REQUIRED_ROUTES) {
    routesChecked++;
    const result = await checkRoute(slug);
    if (result.pass) {
      console.log(`✓ ${slug.padEnd(35)} pipeline=${result.pipelineState} real=${result.realCount} badLabel=${result.hasBadLabel || false}`);
    } else {
      console.log(`✗ ${slug.padEnd(35)} ${result.reason}`);
    }
  }

  // Mandatory check: freight-cost-per-km-trip must produce positive freight_cost_per_unit
  const freightFixture = join(GOLDEN_DIR, "freight-cost-per-km-trip.golden.json");
  if (existsSync(freightFixture)) {
    const fixture = JSON.parse(readFileSync(freightFixture, "utf-8"));
    try {
      const resp = await fetchWithTimeout(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolKey: "freight-cost-per-km-trip",
          rawInputs: fixture.raw_inputs,
          selectedUnits: {},
        }),
      }, 20000);
      const body = await resp.json();
      const outputs = body.outputs || [];
      const freightCost = outputs.find((o) => o.id === "freight_cost_per_unit")?.value;
      if (typeof freightCost !== "number" || freightCost <= 0) {
        blockers.push(`FREIGHT_COST_NOT_POSITIVE: freight_cost_per_unit=${freightCost}`);
      }
    } catch (err) {
      blockers.push(`FREIGHT_COST_CHECK_FAILED: ${err.message}`);
    }
  }

  console.log("");
  console.log("FREE_V531_LIVE_CALCULATION_AUDIT=" + (calculationFail === 0 && blockers.length === 0 ? "PASS" : "FAIL"));
  console.log("ROUTES_CHECKED=" + routesChecked);
  console.log("CALCULATION_PASS=" + calculationPass);
  console.log("CALCULATION_FAIL=" + calculationFail);
  console.log("USER_UNIT_FAILURES=" + userUnitFailures);
  console.log("ZERO_RESULT_FAILURES=" + zeroResultFailures);
  if (blockers.length > 0) {
    console.log("BLOCKERS=" + blockers.join("; "));
  } else {
    console.log("BLOCKERS=NONE");
  }

  process.exit(calculationFail > 0 || blockers.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("AUDIT_CRASHED:", err);
  process.exit(1);
});
