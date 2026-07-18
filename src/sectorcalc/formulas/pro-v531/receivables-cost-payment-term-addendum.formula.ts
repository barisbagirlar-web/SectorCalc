// @server-only
/**
 * Receivables Cost / Payment Term Addendum — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function. Isomorphic.
 *
 * A prior 2026-07-16 audit had already replaced this tool's inputs (it used
 * to run unrelated manufacturing job-costing math through a fabricated
 * financing-rate clamp) with the 4 real receivables-domain inputs. Two real
 * bugs remained in that rebuild, found before shipping:
 *
 *  1. Double-counting: totalFinancingCost was computed as carryingCost
 *     (averageReceivableBalance x rate) PLUS dsoFinancingCost (invoiceVolume
 *     x rate x DSO/365) added together. By the standard DSO identity
 *     (AR balance = revenue x DSO/365), these two terms describe the SAME
 *     receivables position measured two different ways — summing them
 *     roughly doubles the true financing cost whenever the two inputs are
 *     internally consistent (which they should be, by construction).
 *     Verified by execution: the old formula computed $72,471 financing
 *     cost for the example below; the correct single-count cost is $36,000.
 *     Fixed: carryingCost (from the directly stated balance) is now the
 *     sole cost figure. The DSO-derived AR estimate is retained as a
 *     cross-check output (out_ar_consistency_gap_pct) rather than a second
 *     cost term — flags when the two inputs disagree instead of silently
 *     double-billing.
 *  2. average_collection_days' schema base_unit is SECONDS, not days,
 *     despite the "day" unit shown in its hard-bounds display and its DSO
 *     label — caught by reading the schema directly before writing this
 *     formula (same lesson from two earlier tools this session). Converted
 *     with /86400 before use.
 *
 * Verified by standalone execution against 7 checks before shipping:
 * carrying cost and the DSO-implied AR balance both match independent hand
 * arithmetic exactly; invoiceVolume=0 and averageReceivableBalance=0 never
 * produce non-finite output (financing-cost-pct and consistency-gap both
 * guarded); a low rate correctly verdicts 0 and a high rate correctly
 * verdicts 2 (with an intermediate rate landing in the middle tier,
 * confirming all three verdict bands are reachable); cost is confirmed
 * monotonically increasing in the interest rate; collectionDays=0 zeroes
 * the DSO-implied AR estimate without breaking; a synthetically constructed
 * exactly-consistent case (balance set to precisely equal the DSO-implied
 * value) returns a consistency gap of 0.000000%.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

const SECONDS_PER_DAY = 86400;

// ─── Type exports ───────────────────────────────────────────────────────────

export interface ReceivablesCostInputs {
  averageReceivableBalance: number; // Average outstanding AR balance (canonical currency)
  annualInterestRate: number;       // Cost of capital / borrowing rate (ratio, e.g. 0.08)
  averageCollectionDays: number;    // Average days sales outstanding (canonical SECONDS)
  invoiceVolume: number;            // Annual invoiced revenue (canonical currency)
  sourceConfidence: number;         // Source confidence ratio (0..1)
}

export interface ReceivablesCostOutputs {
  out_carrying_cost: number;
  out_financing_cost_pct_of_revenue: number;
  out_implied_ar_from_dso: number;
  out_ar_consistency_gap_pct: number;
  out_collection_days: number;
  out_savings_per_day_dso_reduction: number;
  out_money_at_risk: number;
  out_verdict: number;
  out_evidence_completeness: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

export function executeFormula(inp: ReceivablesCostInputs): ReceivablesCostOutputs {
  const collectionDays = inp.averageCollectionDays / SECONDS_PER_DAY;

  const carryingCost = inp.averageReceivableBalance * inp.annualInterestRate;
  const financingCostPctOfRevenue = inp.invoiceVolume > 0 ? carryingCost / inp.invoiceVolume : 0;

  const impliedArFromDso = inp.invoiceVolume * (collectionDays / 365);
  const arConsistencyGapPct = inp.averageReceivableBalance > 0
    ? Math.abs(inp.averageReceivableBalance - impliedArFromDso) / inp.averageReceivableBalance
    : 0;

  const savingsPerDayDsoReduction = (inp.invoiceVolume / 365) * inp.annualInterestRate;

  const verdict = financingCostPctOfRevenue <= 0.02 ? 0 : financingCostPctOfRevenue <= 0.05 ? 1 : 2;

  return {
    out_carrying_cost: carryingCost,
    out_financing_cost_pct_of_revenue: financingCostPctOfRevenue,
    out_implied_ar_from_dso: impliedArFromDso,
    out_ar_consistency_gap_pct: arConsistencyGapPct,
    out_collection_days: collectionDays,
    out_savings_per_day_dso_reduction: savingsPerDayDsoReduction,
    out_money_at_risk: carryingCost,
    out_verdict: verdict,
    out_evidence_completeness: 1,
  };
}

// ─── Sensitivity helper (kept for parity with the prior version) ───────────

export function sensitivity(
  inputs: ReceivablesCostInputs,
  driver: keyof ReceivablesCostInputs,
  pct = 0.10,
): number {
  const up = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 + pct) }).out_money_at_risk;
  const dn = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 - pct) }).out_money_at_risk;
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
  "n_average_receivable_balance", "n_annual_interest_rate",
  "n_average_collection_days", "n_invoice_volume", "n_source_confidence_ratio",
] as const;

const OUTPUT_KEYS: readonly string[] = [
  "out_carrying_cost", "out_financing_cost_pct_of_revenue", "out_implied_ar_from_dso",
  "out_ar_consistency_gap_pct", "out_collection_days", "out_savings_per_day_dso_reduction",
  "out_money_at_risk", "out_verdict", "out_evidence_completeness",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  let presentCount = 0;
  for (const key of REQUIRED_KEYS) {
    if (isFiniteNumber(inputs[key])) presentCount += 1;
    else warnings.push('Input "' + key + '" is missing or invalid - using 0');
  }

  const typed: ReceivablesCostInputs = {
    averageReceivableBalance: get(inputs, "n_average_receivable_balance"),
    annualInterestRate: get(inputs, "n_annual_interest_rate"),
    averageCollectionDays: get(inputs, "n_average_collection_days"),
    invoiceVolume: get(inputs, "n_invoice_volume"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  if (typed.invoiceVolume <= 0) warnings.push("Invoice volume must be greater than 0 for a meaningful comparison");

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
  if (typed.invoiceVolume <= 0 || !allRequiredPresent) status = "BLOCKED";

  return {
    status,
    outputs,
    warnings,
    outputKeys: [...OUTPUT_KEYS],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export const toolKey = "receivables-cost-payment-term-addendum";
export const formulaVersion = "5.3.2-domain.1";

export const sampleInputs: Record<string, number> = {
  n_average_receivable_balance: 450000,
  n_annual_interest_rate: 0.08,
  n_average_collection_days: 52 * 86400,
  n_invoice_volume: 3200000,
  n_source_confidence_ratio: 0.85,
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
