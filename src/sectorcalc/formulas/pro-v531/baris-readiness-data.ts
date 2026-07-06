// SectorCalc PRO V5.3.1 — Baris Schema Readiness Classification (FAIL-CLOSED)
// This file classifies all 45 pro_tools_baris_ schemas into readiness categories.
// LIVE_ENGINE_READY: 0 — no tool has individual deterministic formula source + golden fixture.
// BLOCKED_SOURCE_REQUIRED: 15 — tools requiring restricted standard reference data.
// BLOCKED_RUNTIME_CONTRACT_MISMATCH: 30 — tools without individual formula + fixture.

import "server-only";

export interface BarisReadinessRecord {
  tool_key: string;
  tool_id: string;
  category: "LIVE_ENGINE_READY" | "BLOCKED_SOURCE_REQUIRED" | "BLOCKED_RUNTIME_CONTRACT_MISMATCH";
  reason: string;
}

// ── LIVE_ENGINE_READY ──────────────────────────────────────────────────────
// COUNT: 0
// No Baris tool has an individual deterministic formula source file (.formula.ts)
// with golden input fixture, golden output hash, proof_pack_hash, and audit seal.
// Until those artifacts exist, no tool can be LIVE_ENGINE_READY.

export const LIVE_ENGINE_READY_TOOLS: BarisReadinessRecord[] = [];

// ── BLOCKED_SOURCE_REQUIRED ────────────────────────────────────────────────
// Tools where correct formula execution requires standard-specific tables,
// coefficients, or reference values from restricted published standards.

export const BLOCKED_SOURCE_REQUIRED_TOOLS: BarisReadinessRecord[] = [
  {
    tool_key: "pressure-vessel-wall-thickness-mawp-hydrotest-package",
    tool_id: "PRO_004",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires ASME BPVC Section VIII joint efficiency table (UW-12) and allowable stress values by material grade and temperature. User provides allowable_stress and joint_efficiency but correctness depends on standard-specific matching."
  },
  {
    tool_key: "pressure-relief-valve-sizing-sheet-api-520",
    tool_id: "PRO_003",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires API 520 Part 1 discharge coefficient tables (Kd, Kb, Kc, Kv) by valve type and backpressure ratio."
  },
  {
    tool_key: "fillet-weld-sizing-verification-sheet-ec3-aws-d11",
    tool_id: "PRO_012",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires AWS D1.1 Table 2 design strengths and EC3 weld resistance factors."
  },
  {
    tool_key: "structural-connection-verification-dossier-ec3-aisc",
    tool_id: "PRO_011",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires EC3 and AISC 360 connection capacity tables (bolt shear, bearing, weld strengths)."
  },
  {
    tool_key: "bolted-connection-verifier",
    tool_id: "PRO_013",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires EN 1993-1-8, AISC, and VDI 2230 bolt grade tables for preload, slip factor, and bearing resistance."
  },
  {
    tool_key: "bolt-torque-preload-spec-card-vdi-2230",
    tool_id: "PRO_022",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires VDI 2230 extensive friction coefficient tables by surface treatment and lubricant."
  },
  {
    tool_key: "lifting-rigging-crane-plan-suite",
    tool_id: "PRO_005",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires ASME B30 crane capacity charts and EN 13155 lifting accessory ratings."
  },
  {
    tool_key: "gdt-fit-clearance-calculator-iso-286",
    tool_id: "PRO_042",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires ISO 286 tolerance grade tables (IT01-IT18) and fundamental deviation values."
  },
  {
    tool_key: "tolerance-stack-up-root-cause-report-wc-rss",
    tool_id: "PRO_006",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires ISO GPS and ASME Y14.5 tolerance zone definitions."
  },
  {
    tool_key: "measurement-uncertainty-budget-gum-iso-17025",
    tool_id: "PRO_008",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires JCGM GUM coverage factor tables (t-distribution) and ISO/IEC 17025 uncertainty budget format."
  },
  {
    tool_key: "first-article-inspection-report-builder-as9102-lite",
    tool_id: "PRO_010",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires AS9102 form templates and AIAG PPAP guidelines."
  },
  {
    tool_key: "compressed-air-leak-energy-audit-report-iso-11011",
    tool_id: "PRO_009",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires ISO 11011 audit class tables (class I, II, III) and ISO 50001 baseline adjustment procedures."
  },
  {
    tool_key: "cbam-definitive-period-compliance-package",
    tool_id: "PRO_001",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires EU CBAM definitive-period emission benchmarks and certificate price trajectories per CN code."
  },
  {
    tool_key: "cbam-cost-exposure-hedging-forecaster",
    tool_id: "PRO_007",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires EU CBAM certificate price scenarios and sector-specific embedded emission factors."
  },
  {
    tool_key: "cbam-supplier-emissions-data-sheet",
    tool_id: "PRO_021",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires EU CBAM default emission values by country and product category."
  }
];

// ── BLOCKED_RUNTIME_CONTRACT_MISMATCH ───────────────────────────────────────
// Tools without individual deterministic formula source file (.formula.ts)
// and golden execution fixture. Generic registry nodes are insufficient for
// live calculation readiness. (30 tools: 29 previously LIVE + 1 ppap)

export const BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS: BarisReadinessRecord[] = [
  {
    tool_key: "ppap-gauge-rr-cpk-ppk-quality-submission-bundle",
    tool_id: "PRO_002",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "Multi-stage quality submission workflow (GR&R, capability study, control plan, submission dossier) requires sequential execution with intermediate document generation. Single formula-graph runtime does not support multi-stage workflows."
  },
  {
    tool_key: "bank-grade-financial-projection-covenant-model",
    tool_id: "PRO_015",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist. Generic registry nodes are insufficient for live calculation readiness."
  },
  {
    tool_key: "break-even-survival-cash-calculator",
    tool_id: "PRO_031",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "capital-equipment-investment-appraisal-npv-irr",
    tool_id: "PRO_016",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "customer-sku-profitability-forensics",
    tool_id: "PRO_018",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "downtime-scrap-loss-statement",
    tool_id: "PRO_026",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "fx-commodity-pass-through-pricer",
    tool_id: "PRO_030",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "job-quote-builder-pro-pack",
    tool_id: "PRO_024",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "loss-making-job-detector",
    tool_id: "PRO_032",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "machine-hourly-rate-proof-report",
    tool_id: "PRO_017",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "machine-investment-feasibility-buy-lease-keep",
    tool_id: "PRO_020",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "machining-cycle-time-part-cost-sheet",
    tool_id: "PRO_025",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "motor-compressor-replacement-roi",
    tool_id: "PRO_045",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "oee-loss-monetization-improvement-business-case",
    tool_id: "PRO_019",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "outsource-vs-in-house-analyzer",
    tool_id: "PRO_033",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "product-sku-margin-ranker",
    tool_id: "PRO_034",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "receivables-cost-payment-term-addendum",
    tool_id: "PRO_035",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "scrap-rework-cost-tracker",
    tool_id: "PRO_039",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "sealed-job-quote-certificate-fire-setup-vade",
    tool_id: "PRO_023",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "setup-time-reduction-roi-smed",
    tool_id: "PRO_038",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "true-employee-cost-statement",
    tool_id: "PRO_036",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "weld-procedure-cost-consumable-estimation-suite",
    tool_id: "PRO_027",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "compressed-air-pipe-sizing-pressure-drop",
    tool_id: "PRO_040",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "energy-efficiency-grant-incentive-feasibility-pack",
    tool_id: "PRO_029",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "hydraulic-cylinder-pump-sizing",
    tool_id: "PRO_044",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "plant-wide-shop-rate-cost-structure-audit",
    tool_id: "PRO_014",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "pump-system-curve-npsh-verifier",
    tool_id: "PRO_041",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "scope-1-2-3-splitter-for-smes",
    tool_id: "PRO_037",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "shaft-deflection-critical-speed-check",
    tool_id: "PRO_043",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  },
  {
    tool_key: "steel-structure-weight-cost-takeoff",
    tool_id: "PRO_028",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "No individual deterministic formula source file and no golden execution fixture exist."
  }
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
