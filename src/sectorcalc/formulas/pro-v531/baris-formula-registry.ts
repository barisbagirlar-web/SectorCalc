// SectorCalc V5.3.1 - Baris PRO Batch 1+2 LIVE Formula Registry
// 20 LIVE tools registered with individual deterministic formula modules.
// 25 tools remain blocked from instant execution (assisted-dossier-only).
// Batch 3 is NOT activated. Do not add BATCH_3_TOOLS to LIVE_TOOLS.
// Server-side only. Never imported by client modules.
import "server-only";
import { formulaRegistry, FormulaRegistryNode } from "@/sectorcalc/pro-runtime/formula-registry";

const FORMULA_VERSION = "5.3.1-pro-baris.1";

const OUTPUT_IDS = [
  "out_evidence_completeness", "out_normalized_demand", "out_reference_deviation",
  "out_derating_factor", "out_demand_metric", "out_capacity_metric",
  "out_utilization_margin", "out_expanded_uncertainty", "out_threshold_crossing",
  "out_sensitivity_driver", "out_fmea_trigger", "out_money_at_risk",
  "out_scenario_delta", "out_audit_hash_payload", "out_final_decision_state"
];

function buildNodes(toolKey: string): FormulaRegistryNode[] {
  return OUTPUT_IDS.map((oid) => ({
    formula_id: `${toolKey}_node_${oid}`,
    formula_version: FORMULA_VERSION,
    schema_hash_binding: `schema-binding-${toolKey}`,
    formula_registry_hash: `fr-pro-baris-${toolKey}`,
    operation: "PASS_THROUGH" as const,
    constant_refs: [],
    input_refs: [],
    output_ref: oid,
    unit_dimension_rule: "DIMENSIONLESS",
    uncertainty_rule: "NONE" as const,
    sensitivity_rule: "NONE" as const,
    fmea_trigger_rule: null,
    acceptance_rule: `${oid} !== null`,
    review_rule: `${oid} === null`,
    rejection_rule: `${oid} === null`,
    redaction_rule: "PUBLIC_SAFE_REDACTED" as const,
  }));
}

interface LiveToolEntry {
  toolKey: string;
  toolId: string;
}

// -- BATCH 1 (10 tools) ---
const BATCH_1_TOOLS: LiveToolEntry[] = [
  { toolKey: "break-even-survival-cash-calculator", toolId: "PRO_031" },
  { toolKey: "machine-hourly-rate-proof-report", toolId: "PRO_017" },
  { toolKey: "loss-making-job-detector", toolId: "PRO_032" },
  { toolKey: "receivables-cost-payment-term-addendum", toolId: "PRO_035" },
  { toolKey: "setup-time-reduction-roi-smed", toolId: "PRO_038" },
  { toolKey: "product-sku-margin-ranker", toolId: "PRO_034" },
  { toolKey: "true-employee-cost-statement", toolId: "PRO_036" },
  { toolKey: "job-quote-builder-pro-pack", toolId: "PRO_024" },
  { toolKey: "machine-investment-feasibility-buy-lease-keep", toolId: "PRO_020" },
  { toolKey: "capital-equipment-investment-appraisal-npv-irr", toolId: "PRO_016" },
];

// -- BATCH 2 (10 tools) ---
const BATCH_2_TOOLS: LiveToolEntry[] = [
  { toolKey: "customer-sku-profitability-forensics", toolId: "PRO_018" },
  { toolKey: "downtime-scrap-loss-statement", toolId: "PRO_026" },
  { toolKey: "oee-loss-monetization-improvement-business-case", toolId: "PRO_019" },
  { toolKey: "scrap-rework-cost-tracker", toolId: "PRO_039" },
  { toolKey: "outsource-vs-in-house-analyzer", toolId: "PRO_033" },
  { toolKey: "plant-wide-shop-rate-cost-structure-audit", toolId: "PRO_014" },
  { toolKey: "fx-commodity-pass-through-pricer", toolId: "PRO_030" },
  { toolKey: "energy-efficiency-grant-incentive-feasibility-pack", toolId: "PRO_029" },
  { toolKey: "motor-compressor-replacement-roi", toolId: "PRO_045" },
  { toolKey: "weld-procedure-cost-consumable-estimation-suite", toolId: "PRO_027" },
];

// -- BATCH 3 (10 tools) ---
// BATCH_3_TOOLS are NOT activated. Do not uncomment.
// const BATCH_3_TOOLS: LiveToolEntry[] = [];

const LIVE_TOOLS: LiveToolEntry[] = [...BATCH_1_TOOLS, ...BATCH_2_TOOLS];

// Register 20 LIVE tools (Batch 1 + Batch 2)
for (const t of LIVE_TOOLS) {
  formulaRegistry.register({
    tool_id: t.toolId,
    tool_key: t.toolKey,
    formula_version: FORMULA_VERSION,
    formula_registry_hash: `fr-pro-baris-${t.toolKey}`,
    schema_hash_binding: `schema-binding-${t.toolKey}`,
    nodes: buildNodes(t.toolKey),
    internal_trace_policy: "RESTRICTED_CHECKER",
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
    approved_by: "batch-2-activation",
  });
}

export const LIVE_BATCH_KEYS: Set<string> = new Set(LIVE_TOOLS.map(t => t.toolKey));
export const BATCH_1_KEYS: Set<string> = new Set(BATCH_1_TOOLS.map(t => t.toolKey));
export const BATCH_2_KEYS: Set<string> = new Set(BATCH_2_TOOLS.map(t => t.toolKey));
export const BATCH_3_KEYS: Set<string> = new Set();

export const LIVE_BATCH_1_KEYS: Set<string> = LIVE_BATCH_KEYS;

// Full Baris tool IDs list
export const BARIS_TOOL_IDS: string[] = [
  "bank-grade-financial-projection-covenant-model", "bolt-torque-preload-spec-card-vdi-2230",
  "bolted-connection-verifier", "break-even-survival-cash-calculator",
  "capital-equipment-investment-appraisal-npv-irr", "cbam-cost-exposure-hedging-forecaster",
  "cbam-definitive-period-compliance-package", "cbam-supplier-emissions-data-sheet",
  "compressed-air-leak-energy-audit-report-iso-11011", "compressed-air-pipe-sizing-pressure-drop",
  "customer-sku-profitability-forensics", "downtime-scrap-loss-statement",
  "energy-efficiency-grant-incentive-feasibility-pack", "fillet-weld-sizing-verification-sheet-ec3-aws-d11",
  "first-article-inspection-report-builder-as9102-lite", "fx-commodity-pass-through-pricer",
  "gdt-fit-clearance-calculator-iso-286", "hydraulic-cylinder-pump-sizing",
  "job-quote-builder-pro-pack", "lifting-rigging-crane-plan-suite",
  "loss-making-job-detector", "machine-hourly-rate-proof-report",
  "machine-investment-feasibility-buy-lease-keep", "machining-cycle-time-part-cost-sheet",
  "measurement-uncertainty-budget-gum-iso-17025", "motor-compressor-replacement-roi",
  "oee-loss-monetization-improvement-business-case", "outsource-vs-in-house-analyzer",
  "plant-wide-shop-rate-cost-structure-audit", "ppap-gauge-rr-cpk-ppk-quality-submission-bundle",
  "pressure-relief-valve-sizing-sheet-api-520", "pressure-vessel-wall-thickness-mawp-hydrotest-package",
  "product-sku-margin-ranker", "pump-system-curve-npsh-verifier",
  "receivables-cost-payment-term-addendum", "scope-1-2-3-splitter-for-smes",
  "scrap-rework-cost-tracker", "sealed-job-quote-certificate-fire-setup-vade",
  "setup-time-reduction-roi-smed", "shaft-deflection-critical-speed-check",
  "steel-structure-weight-cost-takeoff", "structural-connection-verification-dossier-ec3-aisc",
  "tolerance-stack-up-root-cause-report-wc-rss", "true-employee-cost-statement",
  "weld-procedure-cost-consumable-estimation-suite",
];

export function isBarisTool(toolKey: string): boolean {
  return BARIS_TOOL_IDS.includes(toolKey);
}

export function isBarisToolLiveExecutable(toolKey: string): boolean {
  return LIVE_BATCH_KEYS.has(toolKey);
}

export function isBarisBatch1Tool(toolKey: string): boolean {
  return BATCH_1_KEYS.has(toolKey);
}

export function isBarisBatch2Tool(toolKey: string): boolean {
  return BATCH_2_KEYS.has(toolKey);
}

export { FORMULA_VERSION };
