/**
 * Outsource vs In-House Analyzer — insight rules.
 *
 * 6 rules: decision signal, capacity leverage, quality risk,
 * setup cost impact, volume sensitivity, confidence caveat.
 */
import type { OutsourceVsInHouseOutputs, OutsourceVsInHouseInputs } from
  "@/sectorcalc/formulas/pro-v531/outsource-vs-in-house-analyzer.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: OutsourceVsInHouseOutputs, inp: OutsourceVsInHouseInputs) => boolean;
  severity: Severity;
  message: (out: OutsourceVsInHouseOutputs, inp: OutsourceVsInHouseInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "decision_make",
    when: (o) => o.out_finalDecisionState === 0,
    severity: "opp",
    message: (o, _i, cur) =>
      `In-house is the recommended option. Risk-adjusted delta is negative, ` +
      `meaning in-house total cost is lower than outsourcing. Money at risk: ` +
      `${cur}${o.out_moneyAtRisk.toFixed(0)}.`,
  },
  {
    id: "decision_buy",
    when: (o) => o.out_finalDecisionState === 1,
    severity: "opp",
    message: (o, _i, cur) =>
      `Outsourcing is the recommended option. Risk-adjusted delta is positive, ` +
      `meaning outsourcing total cost is lower. Savings per unit: ` +
      `${cur}${o.out_scenarioDelta.toFixed(2)}.`,
  },
  {
    id: "decision_review",
    when: (o) => o.out_finalDecisionState === 2,
    severity: "crit",
    message: (o, _i, cur) =>
      `Costs are too close for a confident decision (within 10% threshold). ` +
      `Money at risk: ${cur}${o.out_moneyAtRisk.toFixed(0)}. ` +
      `Perform detailed sensitivity analysis before proceeding.`,
  },
  {
    id: "low_capacity_utilization",
    when: (o) => o.out_deratingFactor < 0.6,
    severity: "crit",
    message: (o) =>
      `Capacity utilization is ${(o.out_deratingFactor * 100).toFixed(0)}% — below 60%. ` +
      `In-house production may carry significant idle capacity cost. ` +
      `Outsourcing could reduce fixed cost exposure.`,
  },
  {
    id: "high_quality_risk",
    when: (o) => o.out_referenceDeviation > 0.08,
    severity: "info",
    message: (o) =>
      `Quality risk premium is ${(o.out_referenceDeviation * 100).toFixed(1)}% of outsource cost. ` +
      `Factor supplier audit and quality assurance costs into the comparison.`,
  },
  {
    id: "low_confidence",
    when: (o) => o.out_evidenceCompleteness < 0.6,
    severity: "crit",
    message: (o) =>
      `Source confidence is ${(o.out_evidenceCompleteness * 100).toFixed(0)}% — below 60%. ` +
      `Obtain verified cost data from both in-house accounting and supplier quotes.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: OutsourceVsInHouseOutputs,
  inputs: OutsourceVsInHouseInputs,
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
