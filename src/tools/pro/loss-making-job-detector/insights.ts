/**
 * Loss-Making Job Detector — insight rules.
 *
 * Consumes the output keys from executeFormula().
 * 5 rules, independently firing.
 */
import type { LossMakingJobOutputs, LossMakingJobInputs } from
  "@/sectorcalc/formulas/pro-v531/loss-making-job-detector.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: LossMakingJobOutputs, inp: LossMakingJobInputs) => boolean;
  severity: Severity;
  message: (out: LossMakingJobOutputs, inp: LossMakingJobInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "loss_making",
    when: (o) => isFinite(o.out_demand_metric) && o.out_demand_metric < 0,
    severity: "crit",
    message: (o, _i, cur) =>
      `This job is loss-making with gross margin of ${cur}${o.out_demand_metric.toFixed(2)}. ` +
      `The unit economics are negative and the job is eroding profit. ` +
      `Immediate pricing or cost structure review recommended.`,
  },
  {
    id: "margin_warning",
    when: (o, i) => isFinite(o.out_utilization_margin) && o.out_utilization_margin > 0 &&
      o.out_utilization_margin < i.targetMargin,
    severity: "opp",
    message: (o, i, cur) =>
      `Contribution margin of ${(o.out_utilization_margin * 100).toFixed(1)}% ` +
      `is below the target of ${(i.targetMargin * 100).toFixed(1)}%. ` +
      `The job is profitable but does not meet margin targets. ` +
      `Consider cost reduction or price adjustment.`,
  },
  {
    id: "high_volume_exposure",
    when: (o, i) => i.annualVolume > 10000 && isFinite(o.out_demand_metric) &&
      o.out_demand_metric < 0,
    severity: "info",
    message: (o, i, cur) =>
      `High annual volume (${i.annualVolume.toLocaleString()} units) combined with ` +
      `loss-making unit economics results in significant total exposure. ` +
      `Estimated total loss at risk: ${cur}${o.out_money_at_risk.toFixed(0)}.`,
  },
  {
    id: "low_confidence",
    when: (o, i) => i.sourceConfidence < 0.7,
    severity: "warn" as Severity,
    message: (_o, i, _cur) =>
      `Source confidence is ${(i.sourceConfidence * 100).toFixed(0)}% — below the 70% ` +
      `reliability threshold. The cost inputs may not reflect actual conditions. ` +
      `Audit the source data before making irreversible decisions.`,
  },
  {
    id: "healthy_margin",
    when: (o, i) => isFinite(o.out_utilization_margin) &&
      o.out_utilization_margin >= i.targetMargin && o.out_utilization_margin > 0.15,
    severity: "info",
    message: (o, i, _cur) =>
      `Contribution margin of ${(o.out_utilization_margin * 100).toFixed(1)}% ` +
      `exceeds the ${(i.targetMargin * 100).toFixed(1)}% target. ` +
      `The job is healthy and contributing positively to overall profitability.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: LossMakingJobOutputs,
  inputs: LossMakingJobInputs,
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
