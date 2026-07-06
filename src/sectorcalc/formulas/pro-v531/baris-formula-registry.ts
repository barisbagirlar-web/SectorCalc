// SectorCalc V5.3.1 — Baris PRO Schema Formula Registry (FAIL-CLOSED)
// All 45 Baris tools are BLOCKED. No tool has individual deterministic formula source.
// This module exports metadata/classification helpers only.
// It does NOT register any Baris tool as live-executable.
// Server-side only. Never imported by client modules.
import "server-only";

const FORMULA_VERSION = "5.3.1-pro-schema.1";

// ── Blocker registry ────────────────────────────────────────────────────────
// All Baris tools are registered as BLOCKED_RUNTIME_CONTRACT_MISMATCH or
// BLOCKED_SOURCE_REQUIRED. No LIVE tool exists.

export const BARIS_TOOL_IDS: string[] = [
  "bank-grade-financial-projection-covenant-model",
  "bolt-torque-preload-spec-card-vdi-2230",
  "bolted-connection-verifier",
  "break-even-survival-cash-calculator",
  "capital-equipment-investment-appraisal-npv-irr",
  "cbam-cost-exposure-hedging-forecaster",
  "cbam-definitive-period-compliance-package",
  "cbam-supplier-emissions-data-sheet",
  "compressed-air-leak-energy-audit-report-iso-11011",
  "compressed-air-pipe-sizing-pressure-drop",
  "customer-sku-profitability-forensics",
  "downtime-scrap-loss-statement",
  "energy-efficiency-grant-incentive-feasibility-pack",
  "fillet-weld-sizing-verification-sheet-ec3-aws-d11",
  "first-article-inspection-report-builder-as9102-lite",
  "fx-commodity-pass-through-pricer",
  "gdt-fit-clearance-calculator-iso-286",
  "hydraulic-cylinder-pump-sizing",
  "job-quote-builder-pro-pack",
  "lifting-rigging-crane-plan-suite",
  "loss-making-job-detector",
  "machine-hourly-rate-proof-report",
  "machine-investment-feasibility-buy-lease-keep",
  "machining-cycle-time-part-cost-sheet",
  "measurement-uncertainty-budget-gum-iso-17025",
  "motor-compressor-replacement-roi",
  "oee-loss-monetization-improvement-business-case",
  "outsource-vs-in-house-analyzer",
  "plant-wide-shop-rate-cost-structure-audit",
  "ppap-gauge-rr-cpk-ppk-quality-submission-bundle",
  "pressure-relief-valve-sizing-sheet-api-520",
  "pressure-vessel-wall-thickness-mawp-hydrotest-package",
  "product-sku-margin-ranker",
  "pump-system-curve-npsh-verifier",
  "receivables-cost-payment-term-addendum",
  "scope-1-2-3-splitter-for-smes",
  "scrap-rework-cost-tracker",
  "sealed-job-quote-certificate-fire-setup-vade",
  "setup-time-reduction-roi-smed",
  "shaft-deflection-critical-speed-check",
  "steel-structure-weight-cost-takeoff",
  "structural-connection-verification-dossier-ec3-aisc",
  "tolerance-stack-up-root-cause-report-wc-rss",
  "true-employee-cost-statement",
  "weld-procedure-cost-consumable-estimation-suite",
];

// ── Status helpers ─────────────────────────────────────────────────────────

export function isBarisTool(toolKey: string): boolean {
  return BARIS_TOOL_IDS.includes(toolKey);
}

export function isBarisToolLiveExecutable(_toolKey: string): boolean {
  // NO baris tool is live-executable. This function always returns false.
  return false;
}

export { FORMULA_VERSION };
