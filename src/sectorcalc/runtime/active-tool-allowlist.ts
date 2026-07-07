// SectorCalc V5.4 Core — Active Tool Allowlist
// Only tools listed here are active for public execution.
// All other tools are quarantined until rebuilt and verified under V5.4 Core standard.
// This is not a temporary patch — this is the production recovery strategy.
// Canonical slugs: Free uses hyphens, Pro uses underscores (sc_* convention).

export const ACTIVE_FREE_TOOL_SLUGS: readonly string[] = [
  "machining-cost-per-part",
  "cnc-shop-hourly-rate",
  "cutting-speed-feed-rpm",
  "tap-drill-size",
  "iso-286-tolerance-fit",
  "surface-roughness-converter",
  "material-removal-rate",
  "tool-life-tool-cost-per-part",
  "scrap-cost",
  "rework-vs-scrap-decision",
  "thread-dimensions-reference",
  "knurling-drill-point-depth",
  "weld-metal-weight-consumable",
  "fillet-weld-size-strength",
  "welding-cost-per-meter",
  "welding-heat-input",
  "bolt-torque",
  "bolt-preload-clamp-force",
  "steel-weight",
  "beam-load-deflection-quick-check",
  "sheet-metal-bend-allowance",
  "oee",
  "downtime-cost",
  "takt-time-cycle-time",
  "setup-time-cost",
  "line-balancing-efficiency",
  "compressed-air-leak-cost",
  "electric-motor-running-cost",
  "energy-cost-per-part",
  "cbam-cost-quick-estimator",
  "electricity-co2-emissions",
  "diesel-fuel-co2-emissions",
  "product-carbon-footprint-basic",
  "carbon-price-exposure",
  "true-employee-cost",
  "quote-margin-markup",
  "break-even-point",
  "payment-term-cost",
  "machine-investment-payback",
  "customer-profitability",
  "currency-adjusted-pricing",
  "eoq",
  "safety-stock-reorder-point",
  "inventory-carrying-cost",
  "pallet-container-load-cbm",
  "freight-cost-per-km-trip",
  "concrete-volume-order-quantity",
  "rebar-weight-count",
  "recipe-cost-menu-price",
  "fabric-consumption-gsm",
];

// V5.4 Core — First verified Pro pilot with real domain-specific calculations.
// Compressed Air Leak Cost Calculator uses choked flow gas dynamics to
// estimate leakage flow, annual energy loss, leak cost, and repair payback.
//
// Baris PRO V5.3.1 — 45 sellable tools. LIVE tools have deterministic
// server-side formula engines. BLOCKED_SOURCE_REQUIRED tools display an
// assisted dossier request with a CTA for source-file-based review.
export const ACTIVE_PRO_TOOL_SLUGS: readonly string[] = [
  "compressed-air-leak-cost-calculator",
  // Baris PRO V5.3.1 — Batch 1 (finance/cost/operations) 10 tools
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
  // Baris PRO V5.3.1 — Batch 2 (finance/operations/cost) 10 tools
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
  // Baris PRO V5.3.1 — Batch 3 (engineering/physical) 10 tools
  "machining-cycle-time-part-cost-sheet",
  "sealed-job-quote-certificate-fire-setup-vade",
  "steel-structure-weight-cost-takeoff",
  "compressed-air-pipe-sizing-pressure-drop",
  "hydraulic-cylinder-pump-sizing",
  "pump-system-curve-npsh-verifier",
  "shaft-deflection-critical-speed-check",
  "scope-1-2-3-splitter-for-smes",
  "bank-grade-financial-projection-covenant-model",
  "ppap-gauge-rr-cpk-ppk-quality-submission-bundle",
  // Baris PRO V5.3.1 — BLOCKED_SOURCE_REQUIRED 15 tools
  "pressure-vessel-wall-thickness-mawp-hydrotest-package",
  "pressure-relief-valve-sizing-sheet-api-520",
  "fillet-weld-sizing-verification-sheet-ec3-aws-d11",
  "structural-connection-verification-dossier-ec3-aisc",
  "bolted-connection-verifier",
  "bolt-torque-preload-spec-card-vdi-2230",
  "lifting-rigging-crane-plan-suite",
  "gdt-fit-clearance-calculator-iso-286",
  "tolerance-stack-up-root-cause-report-wc-rss",
  "measurement-uncertainty-budget-gum-iso-17025",
  "first-article-inspection-report-builder-as9102-lite",
  "compressed-air-leak-energy-audit-report-iso-11011",
  "cbam-definitive-period-compliance-package",
  "cbam-cost-exposure-hedging-forecaster",
  "cbam-supplier-emissions-data-sheet",
];

export function isActiveFreeTool(slug: string): boolean {
  return ACTIVE_FREE_TOOL_SLUGS.includes(slug);
}

export function isActiveProTool(slug: string): boolean {
  return ACTIVE_PRO_TOOL_SLUGS.includes(slug);
}

export function isActiveTool(slug: string): boolean {
  return isActiveFreeTool(slug) || isActiveProTool(slug);
}
