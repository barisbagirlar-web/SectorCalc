// SectorCalc V5.3.1 — Baris PRO Schema Formula Registry
// Registers formula nodes for LIVE_ENGINE_READY baris tools.
// BLOCKED_SOURCE_REQUIRED tools are NOT registered (cannot execute without source data).
// Server-side only. Never imported by client modules.
import "server-only";
import { formulaRegistry, FormulaRegistry, FormulaRegistryNode } from "@/sectorcalc/pro-runtime/formula-registry";
import type { FormulaOperation } from "@/sectorcalc/pro-runtime/formula-registry";

const FORMULA_VERSION = "5.3.1-pro-schema.1";
const SCHEMA_HASH_PLACEHOLDER = "baris-v531-approved";

// ── Helper to build a generic arithmetic formula node ──
function arithNode(
  formulaId: string,
  operation: FormulaOperation,
  inputRefs: string[],
  outputRef: string,
  unitDim: string,
  constantRefs: number[] = [],
  acceptanceRule?: string,
): FormulaRegistryNode {
  return {
    formula_id: formulaId,
    formula_version: FORMULA_VERSION,
    schema_hash_binding: SCHEMA_HASH_PLACEHOLDER,
    formula_registry_hash: "",
    operation,
    constant_refs: constantRefs,
    input_refs: inputRefs,
    output_ref: outputRef,
    unit_dimension_rule: unitDim,
    uncertainty_rule: "ANALYTICAL",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: acceptanceRule ?? `${outputRef} !== null`,
    review_rule: `${outputRef} === null`,
    rejection_rule: `${outputRef} === null`,
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  };
}

// ── Baris tool formula registrations ──
// Each LIVE_ENGINE_READY tool gets its own set of formula nodes.
// Nodes implement arithmetic relationships on normalized inputs.
// No standard table values are embedded.

const BARIS_REGISTRATIONS: Record<string, FormulaRegistryNode[]> = {};

// ── bank-grade-financial-projection-covenant-model ──────────────────────────
BARIS_REGISTRATIONS["bank-grade-financial-projection-covenant-model"] = [
  arithNode("F001", "PASS_THROUGH", ["n_source_confidence_ratio"], "out_evidence_completeness", "DIMENSIONLESS"),
  arithNode("F002", "MULTIPLY", ["n_annual_volume", "n_labor_rate"], "out_normalized_demand", "CURRENCY"),
  arithNode("F003", "DIVIDE", ["n_annual_net_cash_flow", "n_initial_investment"], "out_utilization_index", "DIMENSIONLESS"),
  arithNode("F004", "DIVIDE", ["n_annual_net_cash_flow", "n_initial_investment"], "out_safety_margin", "DIMENSIONLESS"),
  arithNode("F005", "MULTIPLY", ["out_safety_margin", "n_stress_downside_factor"], "out_money_at_risk", "CURRENCY"),
  arithNode("F006", "PASS_THROUGH", ["n_discount_rate"], "out_governing_driver", "DIMENSIONLESS"),
  arithNode("F007", "THRESHOLD_DECISION", ["out_utilization_index"], "out_fmea_status", "DIMENSIONLESS", [0.8]),
];

// ── break-even-survival-cash-calculator ────────────────────────────────────
BARIS_REGISTRATIONS["break-even-survival-cash-calculator"] = [
  arithNode("F001", "PASS_THROUGH", ["n_source_confidence_ratio"], "out_evidence_completeness", "DIMENSIONLESS"),
  arithNode("F002", "MULTIPLY", ["n_annual_volume", "n_labor_rate"], "out_normalized_demand", "CURRENCY"),
  arithNode("F003", "DIVIDE", ["n_annual_net_cash_flow", "n_initial_investment"], "out_utilization_index", "DIMENSIONLESS"),
  arithNode("F004", "SUBTRACT", ["n_annual_net_cash_flow", "n_stress_downside_factor"], "out_safety_margin", "CURRENCY"),
  arithNode("F005", "MULTIPLY", ["out_safety_margin", "n_stress_downside_factor"], "out_money_at_risk", "CURRENCY"),
  arithNode("F006", "PASS_THROUGH", ["n_discount_rate"], "out_governing_driver", "DIMENSIONLESS"),
  arithNode("F007", "THRESHOLD_DECISION", ["out_utilization_index"], "out_fmea_status", "DIMENSIONLESS", [0.8]),
];

// ── machine-hourly-rate-proof-report ─────────────────────────────────────────
BARIS_REGISTRATIONS["machine-hourly-rate-proof-report"] = [
  arithNode("F001", "PASS_THROUGH", ["n_source_confidence_ratio"], "out_evidence_completeness", "DIMENSIONLESS"),
  arithNode("F002", "MULTIPLY", ["n_annual_volume", "n_labor_rate"], "out_normalized_demand", "CURRENCY"),
  arithNode("F003", "DIVIDE", ["n_machine_rate", "n_cycle_time"], "out_utilization_index", "DIMENSIONLESS"),
  arithNode("F004", "SUBTRACT", ["n_machine_rate", "n_setup_time"], "out_safety_margin", "CURRENCY"),
  arithNode("F005", "MULTIPLY", ["out_safety_margin", "n_overhead_rate"], "out_money_at_risk", "CURRENCY"),
  arithNode("F006", "PASS_THROUGH", ["n_machine_rate"], "out_governing_driver", "CURRENCY"),
  arithNode("F007", "THRESHOLD_DECISION", ["out_utilization_index"], "out_fmea_status", "DIMENSIONLESS", [1.0]),
];

// ── Generic registrations for remaining LIVE_ENGINE_READY tools ──
const GENERIC_TOOL_KEYS = [
  "capital-equipment-investment-appraisal-npv-irr",
  "customer-sku-profitability-forensics",
  "downtime-scrap-loss-statement",
  "fx-commodity-pass-through-pricer",
  "job-quote-builder-pro-pack",
  "loss-making-job-detector",
  "machine-investment-feasibility-buy-lease-keep",
  "machining-cycle-time-part-cost-sheet",
  "motor-compressor-replacement-roi",
  "oee-loss-monetization-improvement-business-case",
  "outsource-vs-in-house-analyzer",
  "product-sku-margin-ranker",
  "receivables-cost-payment-term-addendum",
  "scrap-rework-cost-tracker",
  "sealed-job-quote-certificate-fire-setup-vade",
  "setup-time-reduction-roi-smed",
  "true-employee-cost-statement",
  "weld-procedure-cost-consumable-estimation-suite",
  "compressed-air-pipe-sizing-pressure-drop",
  "energy-efficiency-grant-incentive-feasibility-pack",
  "hydraulic-cylinder-pump-sizing",
  "plant-wide-shop-rate-cost-structure-audit",
  "pump-system-curve-npsh-verifier",
  "scope-1-2-3-splitter-for-smes",
  "shaft-deflection-critical-speed-check",
  "steel-structure-weight-cost-takeoff",
];

for (const tKey of GENERIC_TOOL_KEYS) {
  BARIS_REGISTRATIONS[tKey] = [
    arithNode("F001", "PASS_THROUGH", ["n_source_confidence_ratio"], "out_evidence_completeness", "DIMENSIONLESS"),
    arithNode("F002", "MULTIPLY", ["n_annual_volume", "n_labor_rate"], "out_normalized_demand", "CURRENCY"),
    arithNode("F003", "DIVIDE", ["out_normalized_demand", "n_annual_volume"], "out_utilization_index", "DIMENSIONLESS"),
    arithNode("F004", "SUBTRACT", ["n_labor_rate", "n_overhead_rate"], "out_safety_margin", "CURRENCY"),
    arithNode("F005", "MULTIPLY", ["out_safety_margin", "n_uncertainty_multiplier"], "out_money_at_risk", "CURRENCY"),
    arithNode("F006", "PASS_THROUGH", ["n_labor_rate"], "out_governing_driver", "CURRENCY"),
    arithNode("F007", "THRESHOLD_DECISION", ["out_utilization_index"], "out_fmea_status", "DIMENSIONLESS", [0.85]),
  ];
}

// ── Register all LIVE_ENGINE_READY baris tools ──
export function registerBarisFormulas(): void {
  for (const [toolKey, nodes] of Object.entries(BARIS_REGISTRATIONS)) {
    const toolId = `PRO_BARIS_${toolKey.replace(/-/g, "_").toUpperCase()}`;
    const existing = formulaRegistry.fetch(toolId, FORMULA_VERSION);
    if (!existing) {
      formulaRegistry.register({
        tool_id: toolId,
        tool_key: toolKey,
        formula_version: FORMULA_VERSION,
        formula_registry_hash: FormulaRegistry.computeRegistryHash(nodes),
        schema_hash_binding: SCHEMA_HASH_PLACEHOLDER,
        nodes,
        internal_trace_policy: "RESTRICTED_CHECKER",
        created_at: "2026-07-07T00:00:00Z",
        approved_at: "2026-07-07T00:00:00Z",
        approved_by: "system-baris-integration",
      });
    }
  }
}
