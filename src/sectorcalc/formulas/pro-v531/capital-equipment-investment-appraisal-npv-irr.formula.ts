// @server-only
/**
 * Capital Equipment Investment Appraisal — NPV/IRR — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Standard capital budgeting appraisal: discounted
 * NPV, Newton-Raphson/bisection IRR, simple + discounted payback period,
 * profitability index. Pure function, no eval / new Function. Isomorphic —
 * safe to import from both server and client.
 *
 * Verified by standalone execution against 7 independent checks before
 * shipping: a bad-investment case correctly rejects, an all-negative cash
 * flow correctly returns the documented "no valid IRR" sentinel, a zero
 * discount rate reduces to simple sum, a single-year case matches hand
 * arithmetic, an analytically constructed exact-break-even case returns
 * NPV=0.000000 and IRR matching the constructed rate to 4 decimals,
 * NPV is monotonically decreasing in the discount rate, and CAPEX=0 never
 * produces a non-finite output.
 *
 * Pre-tax cash flow model — no depreciation tax shield, no inflation
 * adjustment beyond the user-supplied nominal cash-flow growth rate. This
 * is disclosed explicitly in the report, not silently assumed away.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

/** Sentinel for "no valid IRR exists" (e.g. every cash flow is negative).
 *  Always finite — never Infinity/NaN — per the platform's output contract. */
export const IRR_UNDEFINED = -99;
/** Sentinel for "payback never occurs within the study horizon". */
export const NO_PAYBACK_YEARS = 999;

// --- Type exports -----------------------------------------------------------

export interface CapitalAppraisalInputs {
  capex: number;
  discountRate: number;
  studyYears: number;
  annualCashFlow: number;
  cashFlowGrowthRate: number;
  residualValue: number;
  workingCapital: number;
}

export interface CapitalAppraisalOutputs {
  out_npv: number;
  out_irr: number;
  out_payback_years: number;
  out_discounted_payback_years: number;
  out_profitability_index: number;
  out_decision: number;
  out_irr_minus_hurdle: number;
  out_terminal_pv: number;
  out_evidence_completeness: number;
}

// --- Core math ---------------------------------------------------------------

export interface ScheduleRow { year: number; cashFlow: number; terminal: number; total: number }
export interface Schedule { years: number; rows: ScheduleRow[] }

export function schedule(inp: CapitalAppraisalInputs): Schedule {
  // Defensive cap: physical_hard_bounds enforces a sane range upstream in the
  // real request pipeline, but this loop bound must never trust that alone --
  // an extreme/malformed value reaching calculate() directly (bypassing the
  // guard) would otherwise build an array with millions/billions of entries
  // and exhaust memory. 100 years is far beyond any legitimate study period.
  // A non-finite value is treated as 1 year rather than left to make the loop
  // condition permanently false (t <= NaN is always false), which would
  // silently return an empty schedule and a plausible-looking but wrong NPV
  // instead of a visibly small, honest result.
  const safeStudyYears = Number.isFinite(inp.studyYears) ? inp.studyYears : 1;
  const years = Math.min(100, Math.max(1, Math.round(safeStudyYears)));
  const rows: ScheduleRow[] = [];
  for (let t = 1; t <= years; t++) {
    const cashFlow = inp.annualCashFlow * Math.pow(1 + inp.cashFlowGrowthRate, t - 1);
    const terminal = t === years ? inp.residualValue + inp.workingCapital : 0;
    rows.push({ year: t, cashFlow, terminal, total: cashFlow + terminal });
  }
  return { years, rows };
}

/** NPV at an arbitrary discount rate — the root-finding target for IRR. */
export function npvAt(inp: CapitalAppraisalInputs, rate: number): number {
  const s = schedule(inp);
  let npv = -(inp.capex + inp.workingCapital);
  for (const r of s.rows) npv += r.total / Math.pow(1 + rate, r.year);
  return npv;
}

/** Newton-Raphson with a bisection fallback over a wide bracket. Returns
 *  IRR_UNDEFINED when NPV(rate) does not change sign across the bracket
 *  (e.g. every cash flow is negative — no discount rate makes NPV zero). */
export function irr(inp: CapitalAppraisalInputs): number {
  let rate = 0.1;
  for (let i = 0; i < 100; i++) {
    const f = npvAt(inp, rate);
    const h = 1e-6;
    const fPrime = (npvAt(inp, rate + h) - f) / h;
    if (Math.abs(fPrime) < 1e-12) break;
    const next = rate - f / fPrime;
    if (!Number.isFinite(next) || next <= -0.999) break;
    if (Math.abs(next - rate) < 1e-9) return next;
    rate = next;
  }
  let lo = -0.9;
  let hi = 10;
  let fLo = npvAt(inp, lo);
  const fHi = npvAt(inp, hi);
  if (Math.sign(fLo) === Math.sign(fHi)) return IRR_UNDEFINED;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fMid = npvAt(inp, mid);
    if (Math.abs(fMid) < 1e-6) return mid;
    if (Math.sign(fMid) === Math.sign(fLo)) { lo = mid; fLo = fMid; } else { hi = mid; }
  }
  return (lo + hi) / 2;
}

// --- Pure calculation -------------------------------------------------------

export function executeFormula(inp: CapitalAppraisalInputs): CapitalAppraisalOutputs {
  const s = schedule(inp);
  const npv = npvAt(inp, inp.discountRate);
  const irrVal = irr(inp);

  let cum = -(inp.capex + inp.workingCapital);
  let paybackYears = NO_PAYBACK_YEARS;
  for (const r of s.rows) {
    const prevCum = cum;
    cum += r.total;
    if (prevCum < 0 && cum >= 0) {
      paybackYears = r.year - 1 + -prevCum / r.total;
      break;
    }
  }

  let dcum = -(inp.capex + inp.workingCapital);
  let discPaybackYears = NO_PAYBACK_YEARS;
  for (const r of s.rows) {
    const disc = r.total / Math.pow(1 + inp.discountRate, r.year);
    const prevCum = dcum;
    dcum += disc;
    if (prevCum < 0 && dcum >= 0) {
      discPaybackYears = r.year - 1 + -prevCum / disc;
      break;
    }
  }

  const outlay = inp.capex + inp.workingCapital;
  const pvInflows = npv + outlay;
  const profitabilityIndex = outlay > 1e-9 ? pvInflows / outlay : 0;

  const terminalPV = (inp.residualValue + inp.workingCapital) / Math.pow(1 + inp.discountRate, s.years);

  const irrValid = irrVal > IRR_UNDEFINED + 1e-9;
  const decision = npv > 0 && irrValid && irrVal > inp.discountRate ? 1 : 0;
  const irrMinusHurdle = irrValid ? irrVal - inp.discountRate : IRR_UNDEFINED;

  return {
    out_npv: npv,
    out_irr: irrVal,
    out_payback_years: paybackYears,
    out_discounted_payback_years: discPaybackYears,
    out_profitability_index: profitabilityIndex,
    out_decision: decision,
    out_irr_minus_hurdle: irrMinusHurdle,
    out_terminal_pv: terminalPV,
    out_evidence_completeness: 1,
  };
}

// --- ProFormulaModule contract ----------------------------------------------

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}
function get(inputs: Record<string, number>, key: string, fallback = 0): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : fallback;
}

const REQUIRED_KEYS = [
  "n_capex", "n_discount_rate", "n_study_years", "n_annual_cash_flow",
  "n_cash_flow_growth_rate", "n_residual_value", "n_working_capital",
] as const;

const OUTPUT_KEYS: readonly string[] = [
  "out_npv", "out_irr", "out_payback_years", "out_discounted_payback_years",
  "out_profitability_index", "out_decision", "out_irr_minus_hurdle",
  "out_terminal_pv", "out_evidence_completeness",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  let presentCount = 0;
  for (const key of REQUIRED_KEYS) {
    if (isFiniteNumber(inputs[key])) presentCount += 1;
    else warnings.push('Input "' + key + '" is missing or invalid - using 0');
  }

  const typed: CapitalAppraisalInputs = {
    capex: get(inputs, "n_capex"),
    discountRate: get(inputs, "n_discount_rate"),
    studyYears: get(inputs, "n_study_years"),
    annualCashFlow: get(inputs, "n_annual_cash_flow"),
    cashFlowGrowthRate: get(inputs, "n_cash_flow_growth_rate"),
    residualValue: get(inputs, "n_residual_value"),
    workingCapital: get(inputs, "n_working_capital"),
  };

  if (typed.capex <= 0) warnings.push("CAPEX must be greater than 0 for a meaningful appraisal");

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
  if (typed.capex <= 0 || !allRequiredPresent) status = "BLOCKED";

  return {
    status,
    outputs,
    warnings,
    outputKeys: [...OUTPUT_KEYS],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export const toolKey = "capital-equipment-investment-appraisal-npv-irr";
export const formulaVersion = "5.3.2-domain.1";

export const sampleInputs: Record<string, number> = {
  n_capex: 200000,
  n_discount_rate: 0.10,
  n_study_years: 8,
  n_annual_cash_flow: 50000,
  n_cash_flow_growth_rate: 0.03,
  n_residual_value: 20000,
  n_working_capital: 10000,
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
