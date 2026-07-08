/**
 * fix-pro-schema-bounds.mjs
 * 
 * Fixes physical_hard_bounds in all 20 active PRO schemas.
 * The bounds were generated with placeholder values (max=1000000000, seconds for
 * hour fields, etc.) that cause the Physical Bounds Guard to BLOCK realistic
 * human-scale input values.
 *
 * Run: node scripts/fix-pro-schema-bounds.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = join(__dirname, "..", "src/sectorcalc/schemas/pro-v531");

// Active PRO tool slugs that should be fixed
const ACTIVE_SLUGS = [
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

// Bound rules keyed by input.id suffix patterns
// Pattern: { min, max, unit?, reason }
// Order matters: first match wins
const BOUND_RULES = [
  // ── Years (formula treats as direct year count) ──
  { pattern: /^.*analysis_years$/, min: 0, max: 50, unit: "year", reason: "years" },
  { pattern: /^.*equipment_life_years$/, min: 0, max: 30, unit: "year", reason: "years" },

  // ── Hours — formula treats as hours (user enters hours) ──
  { pattern: /^productive_hours$/, min: 0, max: 50000, unit: "h", reason: "hours" },
  { pattern: /^actual_hours$/, min: 0, max: 50000, unit: "h", reason: "hours" },
  { pattern: /^total_productive_hours$/, min: 0, max: 50000, unit: "h", reason: "hours" },
  { pattern: /^.*machine_group_hours$/, min: 0, max: 50000, unit: "h", reason: "hours" },
  { pattern: /^rework_hours$/, min: 0, max: 10000, unit: "h", reason: "hours" },
  { pattern: /^planned_production_time$/, min: 0, max: 50000, unit: "h", reason: "hours" },
  { pattern: /^operating_time$/, min: 0, max: 50000, unit: "h", reason: "hours" },
  { pattern: /^net_operating_time$/, min: 0, max: 50000, unit: "h", reason: "hours" },
  { pattern: /^valuable_operating_time$/, min: 0, max: 50000, unit: "h", reason: "hours" },
  { pattern: /^ideal_cycle_time$/, min: 0, max: 10000, unit: "h", reason: "hours" },
  { pattern: /^annual_operating_hours$/, min: 0, max: 8760, unit: "h/year", reason: "hours per year" },
  { pattern: /^.*overhead_allocation_base$/, min: 0, max: 50000, unit: "h", reason: "hours" },

  // ── Real seconds (small time values — cycle times, weld times) ──
  { pattern: /^cycle_time$/, min: 0, max: 36000, unit: "s", reason: "seconds" },
  { pattern: /^setup_time$/, min: 0, max: 36000, unit: "s", reason: "seconds" },
  { pattern: /^arc_time_min$/, min: 0, max: 36000, unit: "s", reason: "seconds" },
  { pattern: /^weld_time_min$/, min: 0, max: 36000, unit: "s", reason: "seconds" },
  { pattern: /^rework_time_per_unit$/, min: 0, max: 36000, unit: "s", reason: "seconds" },

  // ── Percentage fields — formula uses /100, user enters 0-100 ──
  { pattern: /.*target_margin_pct$/, min: 0, max: 100, unit: "%", reason: "percent" },
  { pattern: /.*utilization_pct$/, min: 0, max: 100, unit: "%", reason: "percent" },
  { pattern: /.*margin_pct$/, min: 0, max: 100, unit: "%", reason: "percent" },
  { pattern: /.*logistics_cost_pct$/, min: 0, max: 100, unit: "%", reason: "percent" },
  { pattern: /.*service_cost_pct$/, min: 0, max: 100, unit: "%", reason: "percent" },
  { pattern: /.*return_rate_pct$/, min: 0, max: 100, unit: "%", reason: "percent" },
  { pattern: /.*defect_rate_pct$/, min: 0, max: 100, unit: "%", reason: "percent" },
  { pattern: /.*grant_coverage_pct$/, min: 0, max: 100, unit: "%", reason: "percent" },
  { pattern: /.*current_efficiency_pct$/, min: 0, max: 100, unit: "%", reason: "percent" },
  { pattern: /.*new_efficiency_pct$/, min: 0, max: 100, unit: "%", reason: "percent" },
  { pattern: /.*efficiency_pct$/, min: 0, max: 100, unit: "%", reason: "percent" },
  { pattern: /^.*pct$/, min: 0, max: 100, unit: "%", reason: "percent" },

  // ── Ratio fields (0-1) — formula treats these as 0-1 ──
  { pattern: /^discount_rate$/, min: 0, max: 1, unit: "ratio", reason: "ratio 0-1" },
  { pattern: /^stress_downside_factor$/, min: 0, max: 1, unit: "ratio", reason: "ratio 0-1" },
  { pattern: /^source_confidence$/, min: 0, max: 1, unit: "ratio", reason: "ratio 0-1" },
  { pattern: /^source_confidence_ratio$/, min: 0, max: 1, unit: "ratio", reason: "ratio 0-1" },
  { pattern: /^uncertainty_multiplier$/, min: 0, max: 5, unit: "ratio", reason: "ratio 0-5" },
  { pattern: /^deposition_efficiency$/, min: 0, max: 1, unit: "ratio", reason: "ratio 0-1" },
  { pattern: /^capacity_utilization$/, min: 0, max: 1, unit: "ratio", reason: "ratio 0-1" },
  { pattern: /^quality_risk_premium$/, min: 0, max: 1, unit: "ratio", reason: "ratio 0-1" },
  { pattern: /^fx_rate_spot$/, min: 0, max: 100, unit: "ratio", reason: "fx rate" },
  { pattern: /^fx_rate_budget$/, min: 0, max: 100, unit: "ratio", reason: "fx rate" },
  { pattern: /^commodity_index_current$/, min: 0, max: 1000, unit: "ratio", reason: "commodity index" },
  { pattern: /^commodity_index_budget$/, min: 0, max: 1000, unit: "ratio", reason: "commodity index" },
  { pattern: /^fx_hedge_pct$/, min: 0, max: 100, unit: "%", reason: "percent" },
  { pattern: /^commodity_hedge_pct$/, min: 0, max: 100, unit: "%", reason: "percent" },
  { pattern: /^material_cost_pct$/, min: 0, max: 100, unit: "%", reason: "percent" },
  { pattern: /^emission_factor$/, min: 0, max: 10, unit: "ratio", reason: "emission factor" },

  // ── Count/quantity fields ──
  { pattern: /^batch_quantity$/, min: 0, max: 100000, unit: "units", reason: "count" },
  { pattern: /^total_parts$/, min: 0, max: 100000, unit: "units", reason: "count" },
  { pattern: /^good_parts$/, min: 0, max: 100000, unit: "units", reason: "count" },
  { pattern: /^total_produced$/, min: 0, max: 10000000, unit: "units", reason: "count" },
  { pattern: /^scrap_quantity$/, min: 0, max: 1000000, unit: "units", reason: "count" },
  { pattern: /^rework_quantity$/, min: 0, max: 1000000, unit: "units", reason: "count" },
  { pattern: /^defect_rate_target$/, min: 0, max: 100, unit: "%", reason: "percent" },
  { pattern: /^monthly_volume$/, min: 0, max: 1000000, unit: "units/month", reason: "monthly volume" },

  // ── Annual volume ──
  { pattern: /^annual_volume$/, min: 0, max: 10000000, unit: "units/year", reason: "annual volume" },

  // ── Currency fields (wide but not absurd) ──
  { pattern: /^initial_investment$/, min: 0, max: 50000000, unit: "USD", reason: "investment cost" },
  { pattern: /^annual_net_cash_flow$/, min: -50000000, max: 50000000, unit: "USD", reason: "annual cash flow" },
  { pattern: /^residual_value$/, min: 0, max: 50000000, unit: "USD", reason: "residual value" },
  { pattern: /^total_annual_cost$/, min: 0, max: 50000000, unit: "USD/year", reason: "annual cost" },
  { pattern: /^machine_group_cost$/, min: 0, max: 10000000, unit: "USD", reason: "machine cost" },
  { pattern: /^overhead_pool$/, min: 0, max: 10000000, unit: "USD", reason: "overhead pool" },
  { pattern: /^machine_rate$/, min: 0, max: 10000, unit: "USD/h", reason: "rate per hour" },
  { pattern: /^current_shop_rate$/, min: 0, max: 10000, unit: "USD/h", reason: "shop rate" },
  { pattern: /^labor_rate$/, min: 0, max: 5000, unit: "USD/h", reason: "labor rate" },
  { pattern: /^overhead_rate$/, min: 0, max: 10000, unit: "USD/h", reason: "overhead rate" },
  { pattern: /^rework_rate$/, min: 0, max: 5000, unit: "USD/h", reason: "rework rate" },
  { pattern: /^hourly_rate$/, min: 0, max: 10000, unit: "USD/h", reason: "hourly rate" },
  { pattern: /^hourly_contribution$/, min: 0, max: 10000, unit: "USD/h", reason: "hourly contribution" },
  { pattern: /^rework_labor_rate$/, min: 0, max: 5000, unit: "USD/h", reason: "rework labor rate" },
  { pattern: /^avg_kwh_rate$/, min: 0, max: 10, unit: "USD/kWh", reason: "electricity rate" },
  { pattern: /^gas_cost_per_min$/, min: 0, max: 100, unit: "USD/h", reason: "gas cost" },
  { pattern: /^material_cost$/, min: 0, max: 50000000, unit: "USD", reason: "material cost" },
  { pattern: /^unit_material_cost$/, min: 0, max: 100000, unit: "USD/unit", reason: "unit material" },
  { pattern: /^unit_labor_cost$/, min: 0, max: 100000, unit: "USD/unit", reason: "unit labor" },
  { pattern: /^unit_price$/, min: 0, max: 1000000, unit: "USD", reason: "unit price" },
  { pattern: /^unit_variable_cost$/, min: 0, max: 1000000, unit: "USD", reason: "unit variable cost" },
  { pattern: /^in_house_material_cost$/, min: 0, max: 1000000, unit: "USD", reason: "in-house cost" },
  { pattern: /^in_house_labor_cost$/, min: 0, max: 1000000, unit: "USD", reason: "in-house cost" },
  { pattern: /^in_house_overhead$/, min: 0, max: 1000000, unit: "USD", reason: "in-house cost" },
  { pattern: /^in_house_setup_cost$/, min: 0, max: 1000000, unit: "USD", reason: "in-house cost" },
  { pattern: /^outsource_unit_price$/, min: 0, max: 1000000, unit: "USD", reason: "outsource cost" },
  { pattern: /^outsource_logistics$/, min: 0, max: 1000000, unit: "USD", reason: "outsource cost" },
  { pattern: /^base_price$/, min: 0, max: 10000000, unit: "USD", reason: "base price" },
  { pattern: /^implementation_cost$/, min: 0, max: 50000000, unit: "USD", reason: "implementation" },
  { pattern: /^maintenance_saving$/, min: 0, max: 5000000, unit: "USD", reason: "maintenance saving" },
  { pattern: /^maintenance_saving_yr$/, min: 0, max: 5000000, unit: "USD", reason: "annual saving" },
  { pattern: /^replacement_cost$/, min: 0, max: 50000000, unit: "USD", reason: "replacement cost" },
  { pattern: /^installation_cost$/, min: 0, max: 5000000, unit: "USD", reason: "installation" },
  { pattern: /^wire_cost_per_kg$/, min: 0, max: 1000, unit: "USD/kg", reason: "wire cost" },
  { pattern: /^defect_or_loss_cost$/, min: 0, max: 50000000, unit: "USD", reason: "defect cost" },
  { pattern: /^improvement_cost$/, min: 0, max: 50000000, unit: "USD", reason: "improvement cost" },
  { pattern: /^unit_cost$/, min: 0, max: 1000000, unit: "USD", reason: "unit cost" },

  // ── Generic fallback for any currency_unit based field ──
  { pattern: /.*currency_unit.*/, min: 0, max: 10000000, unit: "USD", reason: "generic currency" },
];

// ── Apply fixes ──

let totalFixed = 0;
let totalSkipped = 0;

for (const slug of ACTIVE_SLUGS) {
  const filePath = join(SCHEMA_DIR, slug + ".schema.json");
  if (!existsSync(filePath)) {
    console.log(`SKIP ${slug}: file not found`);
    totalSkipped++;
    continue;
  }

  const raw = JSON.parse(readFileSync(filePath, "utf8"));
  const inputs = raw.inputs || [];
  let schemaFixed = 0;

  for (const inp of inputs) {
    const id = inp.id;
    const name = inp.name || "";
    const baseUnit = inp.base_unit || "";

    // Find matching rule
    let rule = null;
    for (const r of BOUND_RULES) {
      if (r.pattern.test(id) || r.pattern.test(name.toLowerCase().replace(/[^a-z0-9_]/g, "_"))) {
        rule = r;
        break;
      }
    }

    if (!rule) {
      // For any remaining inputs with absurd bounds, set sensible defaults
      const hb = inp.physical_hard_bounds;
      if (hb && (hb.max > 99999999 || hb.min < -99999999)) {
        // Absurd bounds detected — set reasonable defaults based on base_unit
        if (baseUnit.includes("currency") || baseUnit === "currency_unit" || baseUnit.startsWith("USD")) {
          inp.physical_hard_bounds = { min: 0, max: 10000000, unit: "USD", basis: hb.basis || "PROCESS_LIMIT", violation_behavior: hb.violation_behavior || "BLOCK" };
          schemaFixed++;
        } else if (baseUnit === "ratio") {
          inp.physical_hard_bounds = { min: 0, max: 100, unit: "%", basis: hb.basis || "PROCESS_LIMIT", violation_behavior: hb.violation_behavior || "BLOCK" };
          schemaFixed++;
        } else if (baseUnit === "s") {
          inp.physical_hard_bounds = { min: 0, max: 100000, unit: "s", basis: hb.basis || "PROCESS_LIMIT", violation_behavior: hb.violation_behavior || "BLOCK" };
          schemaFixed++;
        } else if (baseUnit === "unit_per_s") {
          inp.physical_hard_bounds = { min: 0, max: 1000000, unit: "units/h", basis: hb.basis || "PROCESS_LIMIT", violation_behavior: hb.violation_behavior || "BLOCK" };
          schemaFixed++;
        }
      }
      continue;
    }

    // Update bounds — keep only essential fields, remove outdated semantic messages
    inp.physical_hard_bounds = {
      min: rule.min,
      max: rule.max,
      unit: rule.unit || baseUnit,
      basis: inp.physical_hard_bounds?.basis || "PROCESS_LIMIT",
      violation_behavior: inp.physical_hard_bounds?.violation_behavior || "BLOCK",
    };
    schemaFixed++;
  }

  if (schemaFixed > 0) {
    writeFileSync(filePath, JSON.stringify(raw, null, 2), "utf8");
    totalFixed++;
    console.log(`FIXED ${slug}: ${schemaFixed} inputs`);
  } else {
    console.log(`OK ${slug}: no changes`);
  }
}

console.log(`\n=== Done ===`);
console.log(`Schemas modified: ${totalFixed}`);
console.log(`Schemas skipped: ${totalSkipped}`);
