// SectorCalc PRO V5.3.1 — Baris Schema Readiness Classification
// This file classifies all 45 pro_tools_baris_ schemas into readiness categories.
// LIVE_ENGINE_READY tools have server-side formula implementations.
// BLOCKED_SOURCE_REQUIRED tools cannot execute without restricted standard reference data.
// BLOCKED_RUNTIME_CONTRACT_MISMATCH tools do not fit the current execution contract.

import "server-only";

export interface BarisReadinessRecord {
  tool_key: string;
  tool_id: string;
  category: "LIVE_ENGINE_READY" | "BLOCKED_SOURCE_REQUIRED" | "BLOCKED_RUNTIME_CONTRACT_MISMATCH";
  reason: string;
}

// ── LIVE_ENGINE_READY ──────────────────────────────────────────────────────
// Tools where the calculation uses only open/public arithmetic, financial,
// or physics relationships. All standard-sensitive values are user-provided
// inputs. No restricted standard tables are embedded in formula code.

export const LIVE_ENGINE_READY_TOOLS: BarisReadinessRecord[] = [
  {
    tool_key: "bank-grade-financial-projection-covenant-model",
    tool_id: "PRO_015",
    category: "LIVE_ENGINE_READY",
    reason: "Public financial projection and covenant ratio formulas. All inputs are user-provided financial values."
  },
  {
    tool_key: "break-even-survival-cash-calculator",
    tool_id: "PRO_031",
    category: "LIVE_ENGINE_READY",
    reason: "Open break-even and cash-runway arithmetic. All inputs are user-provided financial/volume values."
  },
  {
    tool_key: "capital-equipment-investment-appraisal-npv-irr",
    tool_id: "PRO_016",
    category: "LIVE_ENGINE_READY",
    reason: "Public NPV/IRR/payback formulas. All inputs are user-provided cash-flow and timing values."
  },
  {
    tool_key: "customer-sku-profitability-forensics",
    tool_id: "PRO_018",
    category: "LIVE_ENGINE_READY",
    reason: "Open cost allocation and margin forensics. User provides all revenue, cost, and volume inputs."
  },
  {
    tool_key: "downtime-scrap-loss-statement",
    tool_id: "PRO_026",
    category: "LIVE_ENGINE_READY",
    reason: "Public downtime and scrap cost arithmetic. User provides all production and cost inputs."
  },
  {
    tool_key: "fx-commodity-pass-through-pricer",
    tool_id: "PRO_030",
    category: "LIVE_ENGINE_READY",
    reason: "Open FX and commodity cost pass-through arithmetic. User provides all pricing inputs."
  },
  {
    tool_key: "job-quote-builder-pro-pack",
    tool_id: "PRO_024",
    category: "LIVE_ENGINE_READY",
    reason: "Public job-quote cost accumulation. User provides all material, labor, and overhead inputs."
  },
  {
    tool_key: "loss-making-job-detector",
    tool_id: "PRO_032",
    category: "LIVE_ENGINE_READY",
    reason: "Open margin-leak detection arithmetic. User provides all cost and revenue inputs."
  },
  {
    tool_key: "machine-hourly-rate-proof-report",
    tool_id: "PRO_017",
    category: "LIVE_ENGINE_READY",
    reason: "Public machine-hour rate calculation. User provides all cost and utilization inputs."
  },
  {
    tool_key: "machine-investment-feasibility-buy-lease-keep",
    tool_id: "PRO_020",
    category: "LIVE_ENGINE_READY",
    reason: "Open buy-vs-lease-vs-keep comparison formulas. User provides all financial inputs."
  },
  {
    tool_key: "machining-cycle-time-part-cost-sheet",
    tool_id: "PRO_025",
    category: "LIVE_ENGINE_READY",
    reason: "Public cycle-time and part-cost arithmetic. User provides all machining and rate inputs."
  },
  {
    tool_key: "motor-compressor-replacement-roi",
    tool_id: "PRO_045",
    category: "LIVE_ENGINE_READY",
    reason: "Open replacement ROI arithmetic. User provides all energy, cost, and performance inputs."
  },
  {
    tool_key: "oee-loss-monetization-improvement-business-case",
    tool_id: "PRO_019",
    category: "LIVE_ENGINE_READY",
    reason: "Public OEE loss monetization. User provides all availability, performance, quality inputs."
  },
  {
    tool_key: "outsource-vs-in-house-analyzer",
    tool_id: "PRO_033",
    category: "LIVE_ENGINE_READY",
    reason: "Open make-vs-buy comparison arithmetic. User provides all cost and volume inputs."
  },
  {
    tool_key: "product-sku-margin-ranker",
    tool_id: "PRO_034",
    category: "LIVE_ENGINE_READY",
    reason: "Public margin ranking arithmetic. User provides all revenue and cost inputs."
  },
  {
    tool_key: "receivables-cost-payment-term-addendum",
    tool_id: "PRO_035",
    category: "LIVE_ENGINE_READY",
    reason: "Open receivables cost and payment-term arithmetic. User provides all financial inputs."
  },
  {
    tool_key: "scrap-rework-cost-tracker",
    tool_id: "PRO_039",
    category: "LIVE_ENGINE_READY",
    reason: "Public scrap and rework cost arithmetic. User provides all defect and cost inputs."
  },
  {
    tool_key: "sealed-job-quote-certificate-fire-setup-vade",
    tool_id: "PRO_023",
    category: "LIVE_ENGINE_READY",
    reason: "Open quote-certificate arithmetic. User provides all pricing and payment-term inputs."
  },
  {
    tool_key: "setup-time-reduction-roi-smed",
    tool_id: "PRO_038",
    category: "LIVE_ENGINE_READY",
    reason: "Public SMED ROI arithmetic. User provides all setup-time and cost inputs."
  },
  {
    tool_key: "true-employee-cost-statement",
    tool_id: "PRO_036",
    category: "LIVE_ENGINE_READY",
    reason: "Open employee cost calculation. User provides all salary, benefit, and overhead inputs."
  },
  {
    tool_key: "weld-procedure-cost-consumable-estimation-suite",
    tool_id: "PRO_027",
    category: "LIVE_ENGINE_READY",
    reason: "Public weld procedure cost arithmetic. User provides all consumable, labor, and rate inputs."
  },
  // Open physics / engineering tools — formulas are public-domain engineering relationships
  {
    tool_key: "compressed-air-pipe-sizing-pressure-drop",
    tool_id: "PRO_040",
    category: "LIVE_ENGINE_READY",
    reason: "Open Darcy-Weisbach / Colebrook pipe flow formulas. User provides pipe and flow inputs."
  },
  {
    tool_key: "energy-efficiency-grant-incentive-feasibility-pack",
    tool_id: "PRO_029",
    category: "LIVE_ENGINE_READY",
    reason: "Open grant feasibility arithmetic. User provides all energy, cost, and grant inputs."
  },
  {
    tool_key: "hydraulic-cylinder-pump-sizing",
    tool_id: "PRO_044",
    category: "LIVE_ENGINE_READY",
    reason: "Public hydraulic sizing formulas (flow, pressure, power). User provides all circuit inputs."
  },
  {
    tool_key: "plant-wide-shop-rate-cost-structure-audit",
    tool_id: "PRO_014",
    category: "LIVE_ENGINE_READY",
    reason: "Open overhead allocation and rate-building formulas. User provides all cost pool inputs."
  },
  {
    tool_key: "pump-system-curve-npsh-verifier",
    tool_id: "PRO_041",
    category: "LIVE_ENGINE_READY",
    reason: "Public pump system curve and NPSH formulas. User provides all system and pump inputs."
  },
  {
    tool_key: "scope-1-2-3-splitter-for-smes",
    tool_id: "PRO_037",
    category: "LIVE_ENGINE_READY",
    reason: "Open emission allocation arithmetic. User provides all activity and emission-factor inputs."
  },
  {
    tool_key: "shaft-deflection-critical-speed-check",
    tool_id: "PRO_043",
    category: "LIVE_ENGINE_READY",
    reason: "Open Euler-Bernoulli beam / critical speed formulas. User provides all geometry and load inputs."
  },
  {
    tool_key: "steel-structure-weight-cost-takeoff",
    tool_id: "PRO_028",
    category: "LIVE_ENGINE_READY",
    reason: "Public weight and cost takeoff arithmetic. User provides all section and unit-cost inputs."
  }
];

// ── BLOCKED_SOURCE_REQUIRED ────────────────────────────────────────────────
// Tools where the correct formula execution requires standard-specific tables,
// coefficients, or reference values from restricted published standards.
// The schema user inputs alone are insufficient for production-grade accuracy
// without the standard document context.

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
    reason: "Requires API 520 Part 1 discharge coefficient tables (Kd, Kb, Kc, Kv) by valve type and backpressure ratio. User provides discharge_coefficient but proper sizing depends on standard-specified coefficient combinations."
  },
  {
    tool_key: "fillet-weld-sizing-verification-sheet-ec3-aws-d11",
    tool_id: "PRO_012",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires AWS D1.1 Table 2 design strengths and EC3 weld resistance factors. User provides material_yield_strength and resistance_factor but weld group classification per standard is needed."
  },
  {
    tool_key: "structural-connection-verification-dossier-ec3-aisc",
    tool_id: "PRO_011",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires EC3 and AISC 360 connection capacity tables (bolt shear, bearing, weld strengths, plate capacities). User provides base values but code-specific capacity reduction factors depend on standard tables."
  },
  {
    tool_key: "bolted-connection-verifier",
    tool_id: "PRO_013",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires EN 1993-1-8, AISC, and VDI 2230 bolt grade tables for preload, slip factor, and bearing resistance. User provides resistance_factor but bolt category classification requires standard tables."
  },
  {
    tool_key: "bolt-torque-preload-spec-card-vdi-2230",
    tool_id: "PRO_022",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires VDI 2230 extensive friction coefficient tables by surface treatment, thread tolerance, and lubricant. User provides basic inputs but tightening factor and clamp force depend on VDI-specific coefficient combinations."
  },
  {
    tool_key: "lifting-rigging-crane-plan-suite",
    tool_id: "PRO_005",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires ASME B30 crane capacity charts and EN 13155 lifting accessory ratings. User provides crane_chart_capacity but configuration-specific derating depends on standard load charts."
  },
  {
    tool_key: "gdt-fit-clearance-calculator-iso-286",
    tool_id: "PRO_042",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires ISO 286 tolerance grade tables (IT01-IT18) and fundamental deviation values. User provides tolerance inputs but ISO-standard tolerance zone calculation depends on grade-specific values."
  },
  {
    tool_key: "tolerance-stack-up-root-cause-report-wc-rss",
    tool_id: "PRO_006",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires ISO GPS and ASME Y14.5 tolerance zone definitions. User provides tolerance values but proper worst-case and RSS stack-up depends on standard-specific tolerance zone interpretations."
  },
  {
    tool_key: "measurement-uncertainty-budget-gum-iso-17025",
    tool_id: "PRO_008",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires JCGM GUM coverage factor tables (t-distribution, degrees of freedom) and ISO/IEC 17025 uncertainty budget format. User provides coverage_factor but effective degrees of freedom calculation requires GUM table."
  },
  {
    tool_key: "first-article-inspection-report-builder-as9102-lite",
    tool_id: "PRO_010",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires AS9102 form templates and AIAG PPAP guidelines for dimensional, material, and functional test reporting. User provides measurement inputs but AS9102 compliance structure requires standard forms."
  },
  {
    tool_key: "compressed-air-leak-energy-audit-report-iso-11011",
    tool_id: "PRO_009",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires ISO 11011 audit class tables (class I, II, III) and ISO 50001 baseline adjustment procedures. User provides audit measurements but class-dependent assessment criteria require standard tables."
  },
  {
    tool_key: "cbam-definitive-period-compliance-package",
    tool_id: "PRO_001",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires EU CBAM definitive-period emission benchmarks, default values, and certificate price trajectories per CN code. User provides emission intensities but CBAM compliance calculation requires EU-published default values."
  },
  {
    tool_key: "cbam-cost-exposure-hedging-forecaster",
    tool_id: "PRO_007",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires EU CBAM certificate price scenarios and sector-specific embedded emission factors. User provides carbon price scenarios but hedging strategy depends on EU CBAM market data."
  },
  {
    tool_key: "cbam-supplier-emissions-data-sheet",
    tool_id: "PRO_021",
    category: "BLOCKED_SOURCE_REQUIRED",
    reason: "Requires EU CBAM default emission values by country and product category. User provides supplier-specific data but validation against CBAM defaults requires EU-published reference values."
  }
];

// ── BLOCKED_RUNTIME_CONTRACT_MISMATCH ───────────────────────────────────────
// Tools whose execution pattern (multi-pass, file upload, compliance workflow)
// does not fit the current single-formula-graph runtime contract.

export const BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS: BarisReadinessRecord[] = [
  {
    tool_key: "ppap-gauge-rr-cpk-ppk-quality-submission-bundle",
    tool_id: "PRO_002",
    category: "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
    reason: "Multi-stage quality submission workflow (GR&R, capability study, control plan, submission dossier) requires sequential execution with intermediate document generation. Single formula-graph runtime does not support multi-stage workflows."
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
