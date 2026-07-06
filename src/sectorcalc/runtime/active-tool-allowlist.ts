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
  "break-even-and-margin-of-safety-analysis",
];

// V5.4 Core — First verified Pro pilot with real domain-specific calculations.
// Compressed Air Leak Cost Calculator uses choked flow gas dynamics to
// estimate leakage flow, annual energy loss, leak cost, and repair payback.
export const ACTIVE_PRO_TOOL_SLUGS: readonly string[] = [
  "compressed-air-leak-cost-calculator",
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
