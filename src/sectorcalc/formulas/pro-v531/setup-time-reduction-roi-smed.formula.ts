// @server-only
/**
 * Setup Time Reduction ROI (SMED) — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function. Isomorphic.
 *
 * A prior 2026-07-16 audit had already replaced the fabricated investment
 * cost (overheadRate*0.3 or a hardcoded $50,000) and the fixed-50%-reduction
 * assumption with real inputs (smedInvestmentCost, setupTimeReductionTargetPct).
 * Two real dimensional bugs remained, found by reading the schema's actual
 * base_unit fields directly (the code comments were wrong on both, matching
 * the pattern found in every other tool rewritten this session):
 *
 *  1. setup_time's schema base_unit is SECONDS, not minutes as the comment
 *     claimed. The old code divided the seconds-derived "saved" value by 60,
 *     which converts seconds to MINUTES, not hours — every downstream hour-
 *     rate cost calculation was off by 60x.
 *  2. annual_volume's schema base_unit is units PER SECOND, not units/year
 *     (the same convention trap caught in 3 other tools this session) — the
 *     old code divided the raw canonical value directly by batchQuantity,
 *     producing a number of setups/year that was off by a factor of ~31.5
 *     million.
 *
 * overhead_rate was declared in the schema (as an hourly currency rate,
 * matching machine_rate and labor_rate) but never read at all (`void
 * overheadRate` explicitly discarded it) — despite the schema already
 * declaring an out_machine_share_component and out_labor_share_component
 * pair implying a 3-way cost-share breakdown. During setup/changeover time,
 * overhead burden is idle exactly like machine and labor capacity, so it
 * belongs in the reclaimed-capacity value alongside them. Added
 * out_overhead_share_component as the natural third member of that pair,
 * and overhead_rate now contributes to the burdened hourly rate used to
 * value reclaimed setup time.
 *
 * Verified by standalone execution against 7 checks before shipping:
 * annual hours reclaimed and annual savings both match independent hand
 * arithmetic exactly; batchQuantity=0 never produces non-finite output;
 * smedInvestmentCost=0 gives payback=0 with ROI guarded (no divide-by-
 * zero); zero reduction target gives zero savings and the documented
 * finite "never pays back" sentinel (999 months) with verdict=2; a
 * reduction target above 1.0 (100%) is confirmed to clamp identically to
 * exactly 1.0; annual savings confirmed monotonically increasing in
 * machineRate; the three cost-share components are confirmed to sum
 * exactly to total annual savings (an internal-consistency check, not
 * just a finiteness check).
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

const SECONDS_PER_YEAR = 31536000;
/** Sentinel for "investment never pays back within any reasonable horizon"
 *  (e.g. annualSavings is zero). Always finite. */
export const NO_PAYBACK_MONTHS = 999;

// ─── Type exports ───────────────────────────────────────────────────────────

export interface SetupTimeReductionInputs {
  machineRate: number;                 // Machine hourly rate (canonical currency/h)
  setupTime: number;                   // Current setup time per changeover (canonical seconds)
  setupTimeReductionTargetPct: number; // Target setup time reduction (ratio, clamped to [0,1])
  smedInvestmentCost: number;          // One-time SMED implementation investment (canonical currency)
  batchQuantity: number;               // Units per batch (count)
  annualVolume: number;                // Production rate — canonical units PER SECOND
  laborRate: number;                   // Labor hourly rate (canonical currency/h)
  overheadRate: number;                // Overhead hourly rate (canonical currency/h)
  sourceConfidence: number;            // Source confidence ratio (0..1)
}

export interface SetupTimeReductionOutputs {
  out_annual_hours_reclaimed: number;
  out_machine_share_component: number;
  out_labor_share_component: number;
  out_overhead_share_component: number;
  out_annual_savings: number;
  out_payback_months: number;
  out_roi_pct: number;
  out_money_at_risk: number;
  out_verdict: number;
  out_evidence_completeness: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

export function executeFormula(inp: SetupTimeReductionInputs): SetupTimeReductionOutputs {
  const hoursSetup = inp.setupTime / 3600;
  const reductionRatio = Math.max(0, Math.min(1, inp.setupTimeReductionTargetPct));
  const hoursSavedPerSetup = hoursSetup * reductionRatio;

  const annualVolumeUnitsPerYear = inp.annualVolume * SECONDS_PER_YEAR;
  const setupsPerYear = inp.batchQuantity > 0 ? annualVolumeUnitsPerYear / inp.batchQuantity : 0;

  const annualHoursReclaimed = hoursSavedPerSetup * setupsPerYear;

  const burdenedHourlyRate = inp.machineRate + inp.laborRate + inp.overheadRate;
  const annualSavings = annualHoursReclaimed * burdenedHourlyRate;

  const machineShareComponent = annualHoursReclaimed * inp.machineRate;
  const laborShareComponent = annualHoursReclaimed * inp.laborRate;
  const overheadShareComponent = annualHoursReclaimed * inp.overheadRate;

  const paybackMonths = annualSavings > 1e-9 ? (inp.smedInvestmentCost / annualSavings) * 12 : NO_PAYBACK_MONTHS;
  const roiPct = inp.smedInvestmentCost > 0 ? (annualSavings / inp.smedInvestmentCost) * 100 : 0;

  const verdict = paybackMonths < 12 ? 0 : paybackMonths <= 24 ? 1 : 2;

  return {
    out_annual_hours_reclaimed: annualHoursReclaimed,
    out_machine_share_component: machineShareComponent,
    out_labor_share_component: laborShareComponent,
    out_overhead_share_component: overheadShareComponent,
    out_annual_savings: annualSavings,
    out_payback_months: paybackMonths,
    out_roi_pct: roiPct,
    out_money_at_risk: inp.smedInvestmentCost,
    out_verdict: verdict,
    out_evidence_completeness: 1,
  };
}

// ─── Sensitivity helper (kept for parity with the prior version) ───────────

export function sensitivity(
  inputs: SetupTimeReductionInputs,
  driver: keyof SetupTimeReductionInputs,
  pct = 0.10,
): number {
  const up = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 + pct) }).out_annual_savings;
  const dn = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 - pct) }).out_annual_savings;
  return Math.abs(up - dn);
}

// ─── ProFormulaModule contract ──────────────────────────────────────────────

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}
function get(inputs: Record<string, number>, key: string, fallback = 0): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : fallback;
}

const REQUIRED_KEYS = [
  "n_machine_rate", "n_setup_time", "n_setup_time_reduction_target_pct",
  "n_smed_investment_cost", "n_batch_quantity", "n_annual_volume",
  "n_labor_rate", "n_overhead_rate", "n_source_confidence_ratio",
] as const;

const OUTPUT_KEYS: readonly string[] = [
  "out_annual_hours_reclaimed", "out_machine_share_component", "out_labor_share_component",
  "out_overhead_share_component", "out_annual_savings", "out_payback_months",
  "out_roi_pct", "out_money_at_risk", "out_verdict", "out_evidence_completeness",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  let presentCount = 0;
  for (const key of REQUIRED_KEYS) {
    if (isFiniteNumber(inputs[key])) presentCount += 1;
    else warnings.push('Input "' + key + '" is missing or invalid - using 0');
  }

  const typed: SetupTimeReductionInputs = {
    machineRate: get(inputs, "n_machine_rate"),
    setupTime: get(inputs, "n_setup_time"),
    setupTimeReductionTargetPct: get(inputs, "n_setup_time_reduction_target_pct"),
    smedInvestmentCost: get(inputs, "n_smed_investment_cost"),
    batchQuantity: get(inputs, "n_batch_quantity"),
    annualVolume: get(inputs, "n_annual_volume"),
    laborRate: get(inputs, "n_labor_rate"),
    overheadRate: get(inputs, "n_overhead_rate"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  if (typed.smedInvestmentCost <= 0) warnings.push("SMED investment cost must be greater than 0 for a meaningful ROI");

  const raw = executeFormula(typed) as unknown as Record<string, number>;
  const outputs: Record<string, number> = {};
  for (const key of OUTPUT_KEYS) {
    outputs[key] = key === "out_evidence_completeness"
      ? presentCount / REQUIRED_KEYS.length
      : raw[key];
  }

  const finite = OUTPUT_KEYS.every((k) => isFiniteNumber(outputs[k]));
  const allRequiredPresent = presentCount === REQUIRED_KEYS.length;
  let status: "OK" | "REVIEW" | "BLOCKED" = finite ? "OK" : "REVIEW";
  if (warnings.length > 0) status = "REVIEW";
  if (typed.smedInvestmentCost <= 0 || !allRequiredPresent) status = "BLOCKED";

  return {
    status,
    outputs,
    warnings,
    outputKeys: [...OUTPUT_KEYS],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export const toolKey = "setup-time-reduction-roi-smed";
export const formulaVersion = "5.3.2-domain.1";

export const sampleInputs: Record<string, number> = {
  n_machine_rate: 85,
  n_setup_time: 30 * 60,
  n_setup_time_reduction_target_pct: 0.5,
  n_smed_investment_cost: 45000,
  n_batch_quantity: 500,
  n_annual_volume: 100000 / 31536000,
  n_labor_rate: 45,
  n_overhead_rate: 20,
  n_source_confidence_ratio: 0.9,
};

export const requiredInputKeys: readonly string[] = [...REQUIRED_KEYS];
export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];

const proModule: ProFormulaModule = {
  toolKey,
  formulaVersion,
  calculate,
  sampleInputs,
  requiredInputKeys,
  declaredOutputKeys,
};

export default proModule;
