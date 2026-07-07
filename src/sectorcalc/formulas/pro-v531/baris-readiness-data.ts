// SectorCalc PRO V5.3.1 - Baris Schema Readiness Classification (BATCH 1+2+3 LIVE)
// LIVE_ENGINE_READY: 30 tools
// BLOCKED_SOURCE_REQUIRED: 15 tools
// BLOCKED_RUNTIME_CONTRACT_MISMATCH: 0 tools

import "server-only";

export interface BarisReadinessRecord {
  tool_key: string;
  tool_id: string;
  category: "LIVE_ENGINE_READY" | "BLOCKED_SOURCE_REQUIRED" | "BLOCKED_RUNTIME_CONTRACT_MISMATCH";
  reason: string;
}

export const LIVE_ENGINE_READY_TOOLS: BarisReadinessRecord[] = [
  { tool_key: "break-even-survival-cash-calculator", tool_id: "PRO_031", category: "LIVE_ENGINE_READY", reason: "Batch 1." },
  { tool_key: "machine-hourly-rate-proof-report", tool_id: "PRO_017", category: "LIVE_ENGINE_READY", reason: "Batch 1." },
  { tool_key: "loss-making-job-detector", tool_id: "PRO_032", category: "LIVE_ENGINE_READY", reason: "Batch 1." },
  { tool_key: "receivables-cost-payment-term-addendum", tool_id: "PRO_035", category: "LIVE_ENGINE_READY", reason: "Batch 1." },
  { tool_key: "setup-time-reduction-roi-smed", tool_id: "PRO_038", category: "LIVE_ENGINE_READY", reason: "Batch 1." },
  { tool_key: "product-sku-margin-ranker", tool_id: "PRO_034", category: "LIVE_ENGINE_READY", reason: "Batch 1." },
  { tool_key: "true-employee-cost-statement", tool_id: "PRO_036", category: "LIVE_ENGINE_READY", reason: "Batch 1." },
  { tool_key: "job-quote-builder-pro-pack", tool_id: "PRO_024", category: "LIVE_ENGINE_READY", reason: "Batch 1." },
  { tool_key: "machine-investment-feasibility-buy-lease-keep", tool_id: "PRO_020", category: "LIVE_ENGINE_READY", reason: "Batch 1." },
  { tool_key: "capital-equipment-investment-appraisal-npv-irr", tool_id: "PRO_016", category: "LIVE_ENGINE_READY", reason: "Batch 1." },
  { tool_key: "customer-sku-profitability-forensics", tool_id: "PRO_018", category: "LIVE_ENGINE_READY", reason: "Batch 2." },
  { tool_key: "downtime-scrap-loss-statement", tool_id: "PRO_026", category: "LIVE_ENGINE_READY", reason: "Batch 2." },
  { tool_key: "oee-loss-monetization-improvement-business-case", tool_id: "PRO_019", category: "LIVE_ENGINE_READY", reason: "Batch 2." },
  { tool_key: "scrap-rework-cost-tracker", tool_id: "PRO_039", category: "LIVE_ENGINE_READY", reason: "Batch 2." },
  { tool_key: "outsource-vs-in-house-analyzer", tool_id: "PRO_033", category: "LIVE_ENGINE_READY", reason: "Batch 2." },
  { tool_key: "plant-wide-shop-rate-cost-structure-audit", tool_id: "PRO_014", category: "LIVE_ENGINE_READY", reason: "Batch 2." },
  { tool_key: "fx-commodity-pass-through-pricer", tool_id: "PRO_030", category: "LIVE_ENGINE_READY", reason: "Batch 2." },
  { tool_key: "energy-efficiency-grant-incentive-feasibility-pack", tool_id: "PRO_029", category: "LIVE_ENGINE_READY", reason: "Batch 2." },
  { tool_key: "motor-compressor-replacement-roi", tool_id: "PRO_045", category: "LIVE_ENGINE_READY", reason: "Batch 2." },
  { tool_key: "weld-procedure-cost-consumable-estimation-suite", tool_id: "PRO_027", category: "LIVE_ENGINE_READY", reason: "Batch 2." },
  { tool_key: "machining-cycle-time-part-cost-sheet", tool_id: "PRO_025", category: "LIVE_ENGINE_READY", reason: "Batch 3." },
  { tool_key: "sealed-job-quote-certificate-fire-setup-vade", tool_id: "PRO_023", category: "LIVE_ENGINE_READY", reason: "Batch 3." },
  { tool_key: "steel-structure-weight-cost-takeoff", tool_id: "PRO_028", category: "LIVE_ENGINE_READY", reason: "Batch 3." },
  { tool_key: "compressed-air-pipe-sizing-pressure-drop", tool_id: "PRO_040", category: "LIVE_ENGINE_READY", reason: "Batch 3." },
  { tool_key: "hydraulic-cylinder-pump-sizing", tool_id: "PRO_044", category: "LIVE_ENGINE_READY", reason: "Batch 3." },
  { tool_key: "pump-system-curve-npsh-verifier", tool_id: "PRO_041", category: "LIVE_ENGINE_READY", reason: "Batch 3." },
  { tool_key: "shaft-deflection-critical-speed-check", tool_id: "PRO_043", category: "LIVE_ENGINE_READY", reason: "Batch 3." },
  { tool_key: "scope-1-2-3-splitter-for-smes", tool_id: "PRO_037", category: "LIVE_ENGINE_READY", reason: "Batch 3." },
  { tool_key: "bank-grade-financial-projection-covenant-model", tool_id: "PRO_015", category: "LIVE_ENGINE_READY", reason: "Batch 3." },
  { tool_key: "ppap-gauge-rr-cpk-ppk-quality-submission-bundle", tool_id: "PRO_002", category: "LIVE_ENGINE_READY", reason: "Batch 3." },
];

export const BLOCKED_SOURCE_REQUIRED_TOOLS: BarisReadinessRecord[] = [
  { tool_key: "pressure-vessel-wall-thickness-mawp-hydrotest-package", tool_id: "PRO_004", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate." },
  { tool_key: "pressure-relief-valve-sizing-sheet-api-520", tool_id: "PRO_003", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate." },
  { tool_key: "fillet-weld-sizing-verification-sheet-ec3-aws-d11", tool_id: "PRO_012", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate." },
  { tool_key: "structural-connection-verification-dossier-ec3-aisc", tool_id: "PRO_011", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate." },
  { tool_key: "bolted-connection-verifier", tool_id: "PRO_013", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate." },
  { tool_key: "bolt-torque-preload-spec-card-vdi-2230", tool_id: "PRO_022", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate." },
  { tool_key: "lifting-rigging-crane-plan-suite", tool_id: "PRO_005", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate." },
  { tool_key: "gdt-fit-clearance-calculator-iso-286", tool_id: "PRO_042", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate." },
  { tool_key: "tolerance-stack-up-root-cause-report-wc-rss", tool_id: "PRO_006", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate." },
  { tool_key: "measurement-uncertainty-budget-gum-iso-17025", tool_id: "PRO_008", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate." },
  { tool_key: "first-article-inspection-report-builder-as9102-lite", tool_id: "PRO_010", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate." },
  { tool_key: "compressed-air-leak-energy-audit-report-iso-11011", tool_id: "PRO_009", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate." },
  { tool_key: "cbam-definitive-period-compliance-package", tool_id: "PRO_001", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate." },
  { tool_key: "cbam-cost-exposure-hedging-forecaster", tool_id: "PRO_007", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate." },
  { tool_key: "cbam-supplier-emissions-data-sheet", tool_id: "PRO_021", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate." },
];

export const BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS: BarisReadinessRecord[] = [];

export const ALL_BARIS_TOOLS: BarisReadinessRecord[] = [
  ...LIVE_ENGINE_READY_TOOLS,
  ...BLOCKED_SOURCE_REQUIRED_TOOLS,
  ...BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS
];

export function getBarisToolCategory(toolKey: string) {
  return ALL_BARIS_TOOLS.find(t => t.tool_key === toolKey) ?? null;
}

export function barisClassificationSummary() {
  return {
    total: ALL_BARIS_TOOLS.length,
    live: LIVE_ENGINE_READY_TOOLS.length,
    blockedSource: BLOCKED_SOURCE_REQUIRED_TOOLS.length,
    blockedContract: BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS.length
  };
}
