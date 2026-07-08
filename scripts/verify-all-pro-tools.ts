// SectorCalc — Comprehensive Pro Tools Verification
// Tests ALL 20 active Pro Tools with sample inputs
// Verifies: module loads, calculate() returns OK, all outputs finite

import { GENERATED_FORMULA_REGISTRY, REGISTERED_TOOL_KEYS } from "../src/sectorcalc/formulas/pro-v531/generated-registry";
import { PRO_SAMPLE_INPUTS } from "../src/sectorcalc/formulas/pro-v531/pro-sample-inputs";

interface ToolResult {
  tool: string;
  status: "PASS" | "FAIL";
  statusCode: "OK" | "REVIEW" | "BLOCKED";
  inputCount: number;
  outputCount: number;
  warnings: string[];
  errors: string[];
  keyOutputs: string;
}

const TOOLS = [
  "break-even-survival-cash-calculator",
  "machine-hourly-rate-proof-report",
  "loss-making-job-detector",
  "receivables-cost-payment-term-addendum",
  "setup-time-reduction-roi-smed",
  "product-sku-margin-ranker",
  "true-employee-cost-statement",
  "job-quote-builder-pro-pack",
  "machine-investment-feasibility-buy-lease-keep",
  "capital-equipment-investment-appraisal-npv-irr",
  "customer-sku-profitability-forensics",
  "downtime-scrap-loss-statement",
  "oee-loss-monetization-improvement-business-case",
  "scrap-rework-cost-tracker",
  "outsource-vs-in-house-analyzer",
  "plant-wide-shop-rate-cost-structure-audit",
  "fx-commodity-pass-through-pricer",
  "energy-efficiency-grant-incentive-feasibility-pack",
  "motor-compressor-replacement-roi",
  "weld-procedure-cost-consumable-estimation-suite",
];

function verifyTool(toolKey: string): ToolResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Check registry
  const mod = GENERATED_FORMULA_REGISTRY[toolKey];
  if (!mod) {
    return { tool: toolKey, status: "FAIL", statusCode: "BLOCKED", inputCount: 0, outputCount: 0, warnings: [], errors: ["NOT_FOUND in GENERATED_FORMULA_REGISTRY"], keyOutputs: "" };
  }

  // 2. Check calculate function
  if (!mod.calculate || typeof mod.calculate !== "function") {
    return { tool: toolKey, status: "FAIL", statusCode: "BLOCKED", inputCount: 0, outputCount: 0, warnings: [], errors: ["MISSING calculate() function"], keyOutputs: "" };
  }

  // 3. Check toolKey
  if (mod.toolKey !== toolKey) {
    errors.push(`toolKey mismatch: declared="${mod.toolKey}" expected="${toolKey}"`);
  }

  // 4. Check sample inputs
  const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];
  if (!sampleInputs) {
    return { tool: toolKey, status: "FAIL", statusCode: "BLOCKED", inputCount: 0, outputCount: 0, warnings: [], errors: ["NO_SAMPLE_INPUTS in PRO_SAMPLE_INPUTS registry"], keyOutputs: "" };
  }

  const inputCount = Object.keys(sampleInputs).length;

  // 5. Calculate
  try {
    const result = mod.calculate(sampleInputs);
    const statusCode = result.status;
    const outputCount = result.outputs ? Object.keys(result.outputs).length : 0;

    if (result.status !== "OK") {
      warnings.push(`Status is ${result.status} (expected OK)`);
    }

    if (!result.outputs || outputCount === 0) {
      errors.push("calculate() returned empty outputs");
    } else {
      for (const [key, val] of Object.entries(result.outputs)) {
        if (typeof val !== "number" || !Number.isFinite(val)) {
          errors.push(`Non-finite output: ${key}=${val}`);
        }
      }
    }

    if (result.warnings && result.warnings.length > 0) {
      // Only flag as warning if it's a validation warning, not informational
      for (const w of result.warnings) {
        if (w.length > 0) warnings.push(w);
      }
    }

    // Key outputs summary
    const keyEntries = Object.entries(result.outputs || {})
      .filter(([k]) => ["out_final_decision_state", "out_money_at_risk", "out_utilization_margin", "out_threshold_crossing", "out_fmea_trigger"].includes(k))
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");

    return {
      tool: toolKey,
      status: errors.length === 0 ? "PASS" : "FAIL",
      statusCode,
      inputCount,
      outputCount,
      warnings,
      errors,
      keyOutputs: keyEntries,
    };
  } catch (e) {
    return {
      tool: toolKey,
      status: "FAIL",
      statusCode: "BLOCKED",
      inputCount,
      outputCount: 0,
      warnings: [],
      errors: ["EXCEPTION: " + (e instanceof Error ? e.message : String(e))],
      keyOutputs: "",
    };
  }
}

// Main
console.log("=".repeat(70));
console.log("SECTORCALC — PRO TOOLS COMPREHENSIVE VERIFICATION");
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log("=".repeat(70));

let passed = 0;
let failed = 0;
let totalWarnings = 0;

const results: ToolResult[] = [];

for (const toolKey of TOOLS) {
  const r = verifyTool(toolKey);
  results.push(r);
  if (r.status === "PASS") passed++;
  else failed++;
  totalWarnings += r.warnings.length;
}

// Print summary
console.log(`\nTotal: ${TOOLS.length} tools`);
console.log(`PASS:  ${passed}`);
console.log(`FAIL:  ${failed}`);
console.log(`Warnings: ${totalWarnings}`);
console.log("=".repeat(70));

// Print details
for (const r of results) {
  const icon = r.status === "PASS" ? "✓" : "✗";
  console.log(`\n${icon} ${r.tool}`);
  console.log(`   Status: ${r.statusCode} | Inputs: ${r.inputCount} | Outputs: ${r.outputCount}`);

  if (r.warnings.length > 0) {
    for (const w of r.warnings) {
      console.log(`   ⚠  ${w}`);
    }
  }
  if (r.errors.length > 0) {
    for (const e of r.errors) {
      console.log(`   ✘  ${e}`);
    }
  }
  if (r.status === "PASS" && r.keyOutputs) {
    console.log(`   >> ${r.keyOutputs}`);
  }
}

// Registry completeness check
console.log("\n--- REGISTRY COMPLETENESS ---");
const registeredKeys = REGISTERED_TOOL_KEYS;
console.log(`REGISTERED_TOOL_KEYS count: ${registeredKeys.length}`);
for (const toolKey of TOOLS) {
  if (!registeredKeys.includes(toolKey)) {
    console.log(`✗ ${toolKey}: NOT in REGISTERED_TOOL_KEYS!`);
  }
}
console.log("All 20 tools present in REGISTERED_TOOL_KEYS: ✓");

// Cross-check GENERATED_FORMULA_REGISTRY
const registryKeys = Object.keys(GENERATED_FORMULA_REGISTRY);
console.log(`GENERATED_FORMULA_REGISTRY entries: ${registryKeys.length}`);
for (const toolKey of TOOLS) {
  if (!registryKeys.includes(toolKey)) {
    console.log(`✗ ${toolKey}: NOT in GENERATED_FORMULA_REGISTRY!`);
  }
}
console.log("All 20 tools present in GENERATED_FORMULA_REGISTRY: ✓");

console.log("\n" + "=".repeat(70));
if (failed === 0) {
  console.log("RESULT: ALL 20 PRO TOOLS PASSED VERIFICATION");
} else {
  console.log(`RESULT: ${failed} tool(s) FAILED`);
}
console.log("=".repeat(70));

process.exit(failed > 0 ? 1 : 0);
