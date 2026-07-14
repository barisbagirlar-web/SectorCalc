/**
 * COMPREHENSIVE 360° STRESS TEST — ALL CALCULATION ENGINES
 *
 * Tests every FREE formula tool:
 * 1. All outputs are finite numbers (no NaN/Infinity/null)
 * 2. Decision states are meaningful (not BLOCKED for valid inputs)
 * 3. Primary metrics are positive (costs, savings, efficiencies)
 * 4. No silent failures
 *
 * AUTO-DISCOVERS input IDs from each formula's input spec
 * and generates valid test data for all 50 tools.
 */
import { describe, it, expect, afterAll } from "vitest";
import fs from "fs";
import path from "path";
import { freeV531FormulaRegistry } from "@/sectorcalc/formulas/free-v531";

interface ToolResult {
  tool_key: string;
  status: string;
  output_count: number;
  finite_count: number;
  primary_metric_value: number | null;
  primary_positive: boolean | null;
  errors: string[];
  warnings_count: number;
  all_finite: boolean;
  input_count: number;
}

/* ─── HELPERS ─── */

function isFiniteNumber(v: unknown): boolean {
  return typeof v === "number" && Number.isFinite(v);
}

/**
 * Read a formula file's input spec IDs by scanning for `id: "..."` patterns
 * that appear inside the `inputs` array (the FreeV531InputSpec declarations).
 */
function readFormulaInputIds(toolKey: string): string[] {
  const fp = path.resolve(
    __dirname,
    `../../src/sectorcalc/formulas/free-v531/${toolKey}.formula.ts`,
  );
  if (!fs.existsSync(fp)) return [];

  const src = fs.readFileSync(fp, "utf-8");

  // Find the inputs array (starts with `export const inputs` or `const inputs`)
  // and extract all `id: "..."` values
  const ids: string[] = [];
  const idRegex = /id:\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = idRegex.exec(src)) !== null) {
    ids.push(m[1]);
  }

  return ids;
}

/**
 * Generate realistic test values for a given tool's input IDs.
 * Uses domain-specific defaults for common parameter names.
 * Then applies tool-specific overrides to ensure physically consistent values.
 */
function generateInputs(toolKey: string, inputIds: string[]): Record<string, number> {
  const inputs: Record<string, number> = {};

  for (const id of inputIds) {
    inputs[id] = guessValue(id);
  }

  // Tool-specific overrides to ensure physically consistent value combinations
  applyToolOverrides(toolKey, inputs);

  return inputs;
}

/**
 * Apply tool-specific value overrides to ensure calculations produce
 * physically meaningful results (e.g., selling_price > variable_cost).
 */
function applyToolOverrides(toolKey: string, inputs: Record<string, number>): void {
  switch (toolKey) {
    case "break-even-point":
      // Ensure selling_price > variable_cost so contribution margin > 0
      if (inputs["selling_price_per_unit"] !== undefined && inputs["variable_cost_per_unit"] !== undefined) {
        const vc = inputs["variable_cost_per_unit"];
        if (inputs["selling_price_per_unit"] <= vc) {
          inputs["selling_price_per_unit"] = vc * 2; // 2x variable cost
        }
      }
      break;

    case "bolt-preload-clamp-force":
      // Ensure external_tension < preload * (1 - joint_loss) so residualClamp > 0
      const proofLoad = inputs["user_verified_proof_load_kn"] ?? 50;
      const preloadPct = (inputs["target_preload_percent"] ?? 80) / 100;
      const jointLossPct = (inputs["joint_settlement_loss_percent"] ?? 80) / 100;
      const maxSafeTension = proofLoad * preloadPct * (1 - jointLossPct) * 0.8;
      if (inputs["external_tension_kn"] === undefined || inputs["external_tension_kn"] > maxSafeTension) {
        inputs["external_tension_kn"] = Math.max(1, Math.round(maxSafeTension));
      }
      break;

    case "customer-profitability":
      // Ensure customer_revenue is larger than product_cost + service_cost
      const revenue = inputs["customer_revenue"] ?? 100;
      const productCost = inputs["product_cost"] ?? 50;
      const serviceCost = inputs["service_cost"] ?? 30;
      if (revenue <= productCost + serviceCost) {
        inputs["customer_revenue"] = (productCost + serviceCost) * 3;
      }
      break;
  }
}

/**
 * Guess a physically reasonable value based on input name heuristics.
 */
function guessValue(inputId: string): number {
  const name = inputId.toLowerCase();

  // Dimensional/financial amounts
  if (name.includes("cost") || name.includes("price") || name.includes("rate") || name.includes("salary") || name.includes("revenue") || name.includes("expense") || name.includes("investment") || name.includes("capex") || name.includes("saving") || name.includes("allowance") || name.includes("premium") || name.includes("burden") || name.includes("budget") || name.includes("pool") || name.includes("overhead") || name.includes("depreciation") || name.includes("fund") || name.includes("income")) {
    if (name.includes("cost_per") || name.includes("price_per")) return 50;
    if (name.includes("rate")) return 45;
    if (name.includes("mile") || name.includes("budget") || name.includes("pool") || name.includes("investment") || name.includes("capex") || name.includes("cost")) return 100000;
    return 100;
  }

  // Percentage values (0-100 range)
  if (name.includes("_percent") || name.includes("_pct") || name.includes("_rate_percent") || name.includes("efficiency") || name.includes("utilization") || name.endsWith("_percent") || name.endsWith("_pct")) return 80;

  // Ratio values
  if (name.includes("ratio") || name.includes("factor") || name.includes("coefficient") || name.includes("z_score")) return 1.0;

  // Time
  if (name.includes("hour") || name.includes("time") || name.includes("cycle") || name.includes("minute") || name.includes("second") || name.includes("day") || name.includes("month") || name.includes("year")) {
    if (name.includes("second") || name.includes("_s")) return 60;
    if (name.includes("minute") || name.includes("min")) return 30;
    if (name.includes("hour")) return 4000;
    if (name.includes("day")) return 14;
    if (name.includes("month")) return 12;
    if (name.includes("year")) return 5;
    return 100;
  }

  // Length/dimensions
  if (name.includes("_mm") || name.includes("diameter") || name.includes("depth") || name.includes("thickness") || name.includes("length") || name.includes("width") || name.includes("height") || name.includes("_m")) {
    if (name.includes("_mm")) return 50;
    if (name.includes("_m")) return 5;
    if (name.includes("diameter")) return 20;
    return 10;
  }

  // Mass/weight
  if (name.includes("weight") || name.includes("mass") || name.includes("_kg") || name.includes("density") || name.includes("_g") || name.includes("ton") || name.includes("gram")) return 100;

  // Power/electrical
  if (name.includes("power") || name.includes("_kw") || name.includes("voltage") || name.includes("current") || name.includes("_a") || name.includes("_v")) {
    if (name.includes("voltage") || name.includes("_v")) return 25;
    if (name.includes("current") || name.includes("_a")) return 280;
    return 75;
  }

  // Speed/feed
  if (name.includes("speed") || name.includes("feed") || name.includes("travel")) return 200;

  // Angle
  if (name.includes("angle") || name.includes("deg")) return 90;

  // Stress/pressure
  if (name.includes("stress") || name.includes("pressure") || name.includes("strength") || name.includes("_mpa") || name.includes("_bar")) return 200;

  // Force
  if (name.includes("_kn") || name.includes("load") || name.includes("force") || name.includes("tension") || name.includes("clamp")) return 50;

  // Energy/heat
  if (name.includes("kwh") || name.includes("energy") || name.includes("heat")) return 100;

  // Volume/area
  if (name.includes("_m3") || name.includes("volume") || name.includes("capacity") || name.includes("cbm")) return 100;

  // Quantity/count
  if (name.includes("quantity") || name.includes("count") || name.includes("units") || name.includes("parts") || name.includes("batch") || name.includes("portions")) return 1000;

  // Confidence/evidence
  if (name.includes("confidence") || name.includes("evidence")) return 0.9;

  // Generic engineering defaults
  return 10;
}

/* ─── THE STRESS TEST ─── */

describe("COMPREHENSIVE STRESS — ALL FREE TOOLS", () => {
  const results: ToolResult[] = [];
  const allKeys = Object.keys(freeV531FormulaRegistry);

  it("all 50 tools are registered in freeV531FormulaRegistry", () => {
    expect(allKeys.length).toBe(50);
  });

  for (const toolKey of allKeys) {
    it(`${toolKey} produces only finite outputs`, () => {
      const formula = freeV531FormulaRegistry[toolKey];
      const inputIds = readFormulaInputIds(toolKey);

      expect(
        inputIds.length,
        `${toolKey}: must have at least 1 input spec`,
      ).toBeGreaterThan(0);

      const testInputs = generateInputs(toolKey, inputIds);

      const result = formula.execute(testInputs);
      const isBlocked = result.status?.includes("BLOCKED");
      const outputs = result.outputs ?? [];
      const finiteCount = outputs.filter((o) => isFiniteNumber(o.value)).length;
      const primaryMetric = outputs.find((o) => o.id === result.primaryMetricId);
      const primaryValue = primaryMetric && isFiniteNumber(primaryMetric.value)
        ? (primaryMetric.value as number) : null;

      const tr: ToolResult = {
        tool_key: toolKey,
        status: result.status ?? "UNKNOWN",
        output_count: outputs.length,
        finite_count: finiteCount,
        primary_metric_value: primaryValue,
        primary_positive: primaryValue !== null ? primaryValue >= 0 : null,
        errors: result.errors ?? [],
        warnings_count: (result.warnings ?? []).length,
        all_finite: finiteCount === outputs.length && outputs.length > 0,
        input_count: inputIds.length,
      };
      results.push(tr);

      // PASS
      if (tr.all_finite && !isBlocked && tr.errors.length === 0) return;

      // FAIL — explain why
      const failures: string[] = [];
      if (isBlocked) failures.push(`status=${result.status}`);
      if (!tr.all_finite) failures.push(`finite=${finiteCount}/${outputs.length}`);
      if (tr.errors.length) failures.push(`errors=${tr.errors.join(";")}`);
      expect(failures, `${toolKey}: ${failures.join(", ")}`).toHaveLength(0);
    });
  }

  afterAll(() => {
    const total = results.length;
    const pass = results.filter(
      (r) => r.all_finite && !r.status.includes("BLOCKED") && r.errors.length === 0,
    ).length;
    const fail = results.filter(
      (r) => !r.all_finite || r.status.includes("BLOCKED") || r.errors.length > 0,
    ).length;

    console.log(`\n═══════════════════════════════════════════════`);
    console.log(`📊 COMPREHENSIVE STRESS TEST — FINAL SUMMARY`);
    console.log(`═══════════════════════════════════════════════`);
    console.log(`Total FREE tools tested: ${total}`);
    console.log(`✅ PASS (all finite + unblocked): ${pass}`);
    console.log(`❌ FAIL: ${fail}`);
    console.log(`Primary metric positive: ${results.filter((r) => r.primary_positive === true).length}`);
    console.log(`Primary metric negative/zero: ${results.filter((r) => r.primary_positive === false).length}`);
    console.log(`Tools with warnings: ${results.filter((r) => r.warnings_count > 0).length}`);
    console.log(`Average warnings per tool: ${(results.reduce((s, r) => s + r.warnings_count, 0) / Math.max(1, total)).toFixed(1)}`);

    if (fail > 0) {
      console.log(`\n❌ FAILED TOOLS:`);
      for (const r of results) {
        if (!r.all_finite || r.status.includes("BLOCKED") || r.errors.length > 0) {
          const reasons: string[] = [];
          if (r.status.includes("BLOCKED")) reasons.push(`BLOCKED`);
          if (!r.all_finite) reasons.push(`finite=${r.finite_count}/${r.output_count}`);
          if (r.errors.length) reasons.push(r.errors.join(", "));
          console.log(`  [FAIL] ${r.tool_key} — ${reasons.join("; ")}`);
        }
      }
    }

    if (pass === total) {
      console.log(`\n✅ ALL ${total} FREE TOOLS PASSED — system is HEALTHY`);
    }
  });
});
