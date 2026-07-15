/**
 * Machine Investment Feasibility: Buy vs Lease vs Keep — insight rules.
 *
 * Consumes the output keys from executeFormula().
 * 6 rules, independently firing.
 */
import type { InvestmentFeasibilityOutputs, InvestmentFeasibilityInputs } from
  "@/sectorcalc/formulas/pro-v531/machine-investment-feasibility-buy-lease-keep.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: InvestmentFeasibilityOutputs, inp: InvestmentFeasibilityInputs) => boolean;
  severity: Severity;
  message: (out: InvestmentFeasibilityOutputs, inp: InvestmentFeasibilityInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "npv_positive",
    when: (o) => o.out_final_decision_state === 0 || o.out_final_decision_state === 1,
    severity: "opp",
    message: (o, _i, cur) =>
      `The recommended scenario (decision ${o.out_final_decision_state === 0 ? "BUY" : "LEASE"}) ` +
      `yields positive NPV with a utilization margin of ${cur}${o.out_utilization_margin.toFixed(0)}. ` +
      `Proceed with detailed due diligence.`,
  },
  {
    id: "high_residual_value",
    when: (o, i) => i.residualValue > 0 && i.initialInvestment > 0 &&
      i.residualValue / i.initialInvestment > 0.2,
    severity: "info",
    message: (o, i, cur) =>
      `Residual value of ${cur}${i.residualValue.toFixed(0)} represents ` +
      `${((i.residualValue / i.initialInvestment) * 100).toFixed(0)}% of initial investment. ` +
      `High residual value assumptions should be verified with equipment appraisers.`,
  },
  {
    id: "lease_over_buy",
    when: (o) => o.out_final_decision_state === 1,
    severity: "info",
    message: (o, _i, cur) =>
      `Leasing yields higher NPV than outright purchase (delta: ${cur}${Math.abs(o.out_scenario_delta).toFixed(0)}). ` +
      `Consider lease terms, maintenance obligations, and end-of-lease buyout options.`,
  },
  {
    id: "keep_recommended",
    when: (o) => o.out_final_decision_state === 2,
    severity: "crit",
    message: (o, _i, cur) =>
      `Maintaining current equipment (KEEP) yields the highest NPV. ` +
      `Capital earmarked for replacement (${cur}${o.out_money_at_risk.toFixed(0)} at risk) ` +
      `may be better allocated elsewhere.`,
  },
  {
    id: "stress_scenario_warning",
    when: (o, i) => i.stressDownsideFactor > 0.5 &&
      o.out_expanded_uncertainty > 0.2 * Math.abs(o.out_utilization_margin || 1),
    severity: "crit",
    message: (o, _i, cur) =>
      `Stress scenario expands uncertainty to ${cur}${o.out_expanded_uncertainty.toFixed(0)}. ` +
      `The margin between scenarios is narrow. A sensitivity analysis on key drivers is advised.`,
  },
  {
    id: "low_confidence",
    when: (_o, i) => i.sourceConfidence < 0.7,
    severity: "crit",
    message: (_o, i, cur) =>
      `Source confidence is ${(i.sourceConfidence * 100).toFixed(0)}% — below the 70% reliability threshold. ` +
      `Verify cash flow projections, discount rate assumptions, and residual value estimates ` +
      `before committing to a ${cur}${i.initialInvestment.toFixed(0)} decision.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: InvestmentFeasibilityOutputs,
  inputs: InvestmentFeasibilityInputs,
  cur: string,
): Array<{ id: string; severity: Severity; message: string }> {
  return INSIGHTS
    .filter((rule) => rule.when(outputs, inputs))
    .map((rule) => ({
      id: rule.id,
      severity: rule.severity,
      message: rule.message(outputs, inputs, cur),
    }));
}
