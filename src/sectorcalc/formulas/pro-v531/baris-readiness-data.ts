// SectorCalc PRO V5.3.1 — Baris Schema Readiness Classification (BATCH 1 LIVE)
// LIVE_ENGINE_READY: 10 tools with individual deterministic formula files + golden fixtures
// BLOCKED_SOURCE_REQUIRED: 15 tools requiring restricted standard reference data
// BLOCKED_RUNTIME_CONTRACT_MISMATCH: 20 tools without individual formula + fixture

import "server-only";

export interface BarisReadinessRecord {
  tool_key: string;
  tool_id: string;
  category: "LIVE_ENGINE_READY" | "BLOCKED_SOURCE_REQUIRED" | "BLOCKED_RUNTIME_CONTRACT_MISMATCH";
  reason: string;
}

// ── LIVE_ENGINE_READY ──────────────────────────────────────────────────────
// COUNT: 10 — Batch 1 finance/cost/operations tools with real deterministic engines

export const LIVE_ENGINE_READY_TOOLS: BarisReadinessRecord[] = [
  {
    tool_key: "break-even-survival-cash-calculator",
    tool_id: "PRO_031",
    category: "LIVE_ENGINE_READY",
    reason: "Deterministic formula at break-even-survival-cash-calculator.formula.ts. Golden fixture at tests/golden/pro-v531-baris/break-even-survival-cash-calculator.golden.json."
  },
  {
    tool_key: "machine-hourly-rate-proof-report",
    tool_id: "PRO_017",
    category: "LIVE_ENGINE_READY",
    reason: "Deterministic formula at machine-hourly-rate-proof-report.formula.ts. Golden fixture at tests/golden/pro-v531-baris/machine-hourly-rate-proof-report.golden.json."
  },
  {
    tool_key: "loss-making-job-detector",
    tool_id: "PRO_032",
    category: "LIVE_ENGINE_READY",
    reason: "Deterministic formula at loss-making-job-detector.formula.ts. Golden fixture at tests/golden/pro-v531-baris/loss-making-job-detector.golden.json."
  },
  {
    tool_key: "receivables-cost-payment-term-addendum",
    tool_id: "PRO_035",
    category: "LIVE_ENGINE_READY",
    reason: "Deterministic formula at receivables-cost-payment-term-addendum.formula.ts. Golden fixture at tests/golden/pro-v531-baris/receivables-cost-payment-term-addendum.golden.json."
  },
  {
    tool_key: "setup-time-reduction-roi-smed",
    tool_id: "PRO_038",
    category: "LIVE_ENGINE_READY",
    reason: "Deterministic formula at setup-time-reduction-roi-smed.formula.ts. Golden fixture at tests/golden/pro-v531-baris/setup-time-reduction-roi-smed.golden.json."
  },
  {
    tool_key: "product-sku-margin-ranker",
    tool_id: "PRO_034",
    category: "LIVE_ENGINE_READY",
    reason: "Deterministic formula at product-sku-margin-ranker.formula.ts. Golden fixture at tests/golden/pro-v531-baris/product-sku-margin-ranker.golden.json."
  },
  {
    tool_key: "true-employee-cost-statement",
    tool_id: "PRO_036",
    category: "LIVE_ENGINE_READY",
    reason: "Deterministic formula at true-employee-cost-statement.formula.ts. Golden fixture at tests/golden/pro-v531-baris/true-employee-cost-statement.golden.json."
  },
  {
    tool_key: "job-quote-builder-pro-pack",
    tool_id: "PRO_024",
    category: "LIVE_ENGINE_READY",
    reason: "Deterministic formula at job-quote-builder-pro-pack.formula.ts. Golden fixture at tests/golden/pro-v531-baris/job-quote-builder-pro-pack.golden.json."
  },
  {
    tool_key: "machine-investment-feasibility-buy-lease-keep",
    tool_id: "PRO_020",
    category: "LIVE_ENGINE_READY",
    reason: "Deterministic formula at machine-investment-feasibility-buy-lease-keep.formula.ts. Golden fixture at tests/golden/pro-v531-baris/machine-investment-feasibility-buy-lease-keep.golden.json."
  },
  {
    tool_key: "capital-equipment-investment-appraisal-npv-irr",
    tool_id: "PRO_016",
    category: "LIVE_ENGINE_READY",
    reason: "Deterministic formula at capital-equipment-investment-appraisal-npv-irr.formula.ts. Golden fixture at tests/golden/pro-v531-baris/capital-equipment-investment-appraisal-npv-irr.golden.json."
  }
];

// ── BLOCKED_SOURCE_REQUIRED ────────────────────────────────────────────────
// Tools requiring standard-specific tables not embedded in formula code.

export const BLOCKED_SOURCE_REQUIRED_TOOLS: BarisReadinessRecord[] = [
  { tool_key: "pressure-vessel-wall-thickness-mawp-hydrotest-package", tool_id: "PRO_004", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate — ASME_BPVC_VIII_1: Requires user-verified joint efficiency (UW-12) and allowable stress values by material grade from licensed ASME BPVC Section II Part D. Hardcoded table values forbidden." },
  { tool_key: "pressure-relief-valve-sizing-sheet-api-520", tool_id: "PRO_003", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate — API_520_P1: Requires user-verified Kd/Kb/Kc/Kv coefficients from licensed API 520 Part 1 copy. Hardcoded discharge coefficient table values forbidden." },
  { tool_key: "fillet-weld-sizing-verification-sheet-ec3-aws-d11", tool_id: "PRO_012", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gates — AWS_D1_1_2025 + EN_1993_EC3: Requires user-verified AWS D1.1 Table 2 permissible stresses and EC3 weld resistance factors from licensed copies. Hardcoded table values and guessed clause numbers forbidden." },
  { tool_key: "structural-connection-verification-dossier-ec3-aisc", tool_id: "PRO_011", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gates — EN_1993_EC3 + AISC_360_22: Requires user-verified EN 1993 and AISC 360 connection capacity values from licensed copies. Hardcoded joint capacity tables forbidden." },
  { tool_key: "bolted-connection-verifier", tool_id: "PRO_013", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gates — EN_1993_EC3 + AISC_360_22 + VDI_2230_B1: Requires user-verified bolt grade/strength tables from EN 1993-1-8, AISC 360, and VDI 2230 friction coefficients. Hardcoded bolt tables forbidden." },
  { tool_key: "bolt-torque-preload-spec-card-vdi-2230", tool_id: "PRO_022", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate — VDI_2230_B1: Requires user-verified friction coefficient tables (mu_total, mu_G, mu_K), tightening factor alpha_A, and preload scatter from licensed VDI 2230 Blatt 1 copy. Invented coefficients forbidden." },
  { tool_key: "lifting-rigging-crane-plan-suite", tool_id: "PRO_005", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gates — ASME_B30 + EN_13155: Requires user-verified load chart values and sling angle capacity factors from licensed ASME B30 and EN 13155 copies. Hardcoded capacity tables forbidden." },
  { tool_key: "gdt-fit-clearance-calculator-iso-286", tool_id: "PRO_042", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate — ISO_286_1: Requires user-verified fundamental deviation values and tolerance grade multipliers (IT01-IT18) from licensed ISO 286-1 copy. Hardcoded tolerance tables forbidden." },
  { tool_key: "tolerance-stack-up-root-cause-report-wc-rss", tool_id: "PRO_006", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gates — ISO_286_1 + ISO_GPS_Y14_5: Requires user-verified geometric tolerance values from engineering drawing and ISO 286-1 tolerance grades. RSS/WC formulas are standard practice; no hardcoded tolerance tables permitted." },
  { tool_key: "measurement-uncertainty-budget-gum-iso-17025", tool_id: "PRO_008", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate — JCGM_GUM: JCGM GUM is public domain (BIPM free download). Coverage factor table k(p, nu) is openly published. Requires user-verified coverage factor input and uncertainty budget structure mapping." },
  { tool_key: "first-article-inspection-report-builder-as9102-lite", tool_id: "PRO_010", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate — AS9102: AS9102 is a form template and process standard. Form builder must map verified fields without reproducing SAE proprietary content. Form layout references cite section numbers only." },
  { tool_key: "compressed-air-leak-energy-audit-report-iso-11011", tool_id: "PRO_009", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate — ISO_11011: Requires user-verified audit class (A/B/C) selection and measurement method mapping. ISO 11011 defines audit classification requirements. No hardcoded measurement uncertainty tables." },
  { tool_key: "cbam-definitive-period-compliance-package", tool_id: "PRO_001", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate — EU_CBAM_DEFINITIVE: Requires official EU definitive-period default values and benchmarks from published Implementing Regulation. Values must include version/date/hash metadata. No third-party summary values." },
  { tool_key: "cbam-cost-exposure-hedging-forecaster", tool_id: "PRO_007", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate — EU_CBAM_DEFINITIVE: Requires official EU CBAM certificate price scenarios and default emission values. Values must be sourced from official EU publications with version/date/hash metadata." },
  { tool_key: "cbam-supplier-emissions-data-sheet", tool_id: "PRO_021", category: "BLOCKED_SOURCE_REQUIRED", reason: "Source gate — EU_CBAM_DEFINITIVE: Requires EU CBAM default emission values per CN code and country of origin from official Implementing Regulation. Must include version/date/hash metadata for each value reference." }
];

// ── BLOCKED_RUNTIME_CONTRACT_MISMATCH ───────────────────────────────────────
// Tools without individual deterministic formula source + golden fixture.

export const BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS: BarisReadinessRecord[] = [
  { tool_key: "ppap-gauge-rr-cpk-ppk-quality-submission-bundle", tool_id: "PRO_002", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "Multi-stage workflow incompatible with single formula-graph runtime." },
  { tool_key: "bank-grade-financial-projection-covenant-model", tool_id: "PRO_015", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "customer-sku-profitability-forensics", tool_id: "PRO_018", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "downtime-scrap-loss-statement", tool_id: "PRO_026", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "energy-efficiency-grant-incentive-feasibility-pack", tool_id: "PRO_029", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "fx-commodity-pass-through-pricer", tool_id: "PRO_030", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "hydraulic-cylinder-pump-sizing", tool_id: "PRO_044", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "machining-cycle-time-part-cost-sheet", tool_id: "PRO_025", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "motor-compressor-replacement-roi", tool_id: "PRO_045", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "oee-loss-monetization-improvement-business-case", tool_id: "PRO_019", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "outsource-vs-in-house-analyzer", tool_id: "PRO_033", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "plant-wide-shop-rate-cost-structure-audit", tool_id: "PRO_014", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "pump-system-curve-npsh-verifier", tool_id: "PRO_041", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "scrap-rework-cost-tracker", tool_id: "PRO_039", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "scope-1-2-3-splitter-for-smes", tool_id: "PRO_037", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "sealed-job-quote-certificate-fire-setup-vade", tool_id: "PRO_023", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "shaft-deflection-critical-speed-check", tool_id: "PRO_043", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "steel-structure-weight-cost-takeoff", tool_id: "PRO_028", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "compressed-air-pipe-sizing-pressure-drop", tool_id: "PRO_040", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." },
  { tool_key: "weld-procedure-cost-consumable-estimation-suite", tool_id: "PRO_027", category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH", reason: "No individual deterministic formula source file and no golden execution fixture exist." }
];

// ── VALIDATION ──────────────────────────────────────────────────────────────

export const ALL_BARIS_TOOLS: BarisReadinessRecord[] = [
  ...LIVE_ENGINE_READY_TOOLS,
  ...BLOCKED_SOURCE_REQUIRED_TOOLS,
  ...BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS
];

export function getBarisToolCategory(toolKey: string): BarisReadinessRecord | null {
  return ALL_BARIS_TOOLS.find(t => t.tool_key === toolKey) ?? null;
}

export function barisClassificationSummary(): { total: number; live: number; blockedSource: number; blockedContract: number } {
  return {
    total: ALL_BARIS_TOOLS.length,
    live: LIVE_ENGINE_READY_TOOLS.length,
    blockedSource: BLOCKED_SOURCE_REQUIRED_TOOLS.length,
    blockedContract: BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS.length
  };
}
