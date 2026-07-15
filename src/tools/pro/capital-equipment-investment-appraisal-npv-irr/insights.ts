/**
 * Capital Equipment Investment Appraisal (NPV/IRR) — insight rules.
 *
 * Consumes the output keys from executeFormula().
 * 6 rules, independently firing.
 */
import type { NPVIRROutputs, NPVIRRInputs } from
  "@/sectorcalc/formulas/pro-v531/capital-equipment-investment-appraisal-npv-irr.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: NPVIRROutputs, inp: NPVIRRInputs) => boolean;
  severity: Severity;
  message: (out: NPVIRROutputs, inp: NPVIRRInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "positive_npv",
    when: (o) => o.out_final_decision_state === 0,
    severity: "opp",
    message: (o, i, cur) =>
      `NPV is positive and IRR exceeds the ${(i.discountRate * 100).toFixed(1)}% discount rate. ` +
      `Expanded uncertainty: ${cur}${o.out_expanded_uncertainty.toFixed(0)}. ` +
      `The investment passes the economic feasibility threshold.`,
  },
  {
    id: "irr_below_threshold",
    when: (o) => o.out_final_decision_state === 1,
    severity: "info",
    message: (o, i, cur) =>
      `NPV is positive but IRR is below the ${(i.discountRate * 100).toFixed(1)}% discount rate. ` +
      `The investment adds value but may not meet the required return benchmark. ` +
      `Review hurdle rate assumptions.`,
  },
  {
    id: "negative_npv_hold",
    when: (o) => o.out_final_decision_state === 2,
    severity: "crit",
    message: (o, _i, cur) =>
      `NPV is negative — the investment does not recover its cost of capital. ` +
      `Money at risk: ${cur}${o.out_money_at_risk.toFixed(0)}. ` +
      `Consider alternative capital allocations or renegotiating terms.`,
  },
  {
    id: "high_uncertainty",
    when: (o, i) => o.out_expanded_uncertainty > 0 &&
      i.initialInvestment > 0 &&
      o.out_expanded_uncertainty / Math.abs(o.out_demand_metric || 1) > 0.3,
    severity: "crit",
    message: (o, _i, cur) =>
      `Expanded uncertainty (${cur}${o.out_expanded_uncertainty.toFixed(0)}) ` +
      `exceeds 30% of the demand metric. Key input assumptions carry material risk. ` +
      `Run a probabilistic simulation before committing.`,
  },
  {
    id: "stress_scenario_active",
    when: (o, i) => i.stressDownsideFactor > 0.5 &&
      o.out_fmea_trigger >= 2,
    severity: "crit",
    message: (o, i, cur) =>
      `Stress factor of ${(i.stressDownsideFactor * 100).toFixed(0)}% triggers FMEA flags. ` +
      `Downside scenario could erode ${cur}${o.out_money_at_risk.toFixed(0)} in value. ` +
      `Consider hedging or staged investment.`,
  },
  {
    id: "low_confidence",
    when: (_o, i) => i.sourceConfidence < 0.7,
    severity: "crit",
    message: (o, i, cur) =>
      `Source confidence is ${(i.sourceConfidence * 100).toFixed(0)}% — below the 70% threshold. ` +
      `All NPV/IRR projections are sensitive to underlying data quality. ` +
      `Audit source inputs before presenting to investment committee.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: NPVIRROutputs,
  inputs: NPVIRRInputs,
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
