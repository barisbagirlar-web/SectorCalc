/**
 * Receivables Cost / Payment Term Addendum — insight rules.
 *
 * Consumes the output keys from executeFormula().
 * 5 rules, independently firing.
 */
import type { ReceivablesCostOutputs, ReceivablesCostInputs } from
  "@/sectorcalc/formulas/pro-v531/receivables-cost-payment-term-addendum.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: ReceivablesCostOutputs, inp: ReceivablesCostInputs) => boolean;
  severity: Severity;
  message: (out: ReceivablesCostOutputs, inp: ReceivablesCostInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "high_finance_cost",
    when: (o) => isFinite(o.out_utilization_margin) && o.out_utilization_margin > 0.10,
    severity: "crit",
    message: (o, _i, cur) =>
      `Receivables finance cost ratio is ${(o.out_utilization_margin * 100).toFixed(1)}% ` +
      `of revenue amount — above the 10% critical threshold. ` +
      `Immediate payment term renegotiation or early payment discount program recommended. ` +
      `Estimated annual financing cost: ${cur}${o.out_demand_metric.toFixed(0)}.`,
  },
  {
    id: "moderate_finance_cost",
    when: (o) => isFinite(o.out_utilization_margin) &&
      o.out_utilization_margin > 0.05 && o.out_utilization_margin <= 0.10,
    severity: "opp",
    message: (o, _i, cur) =>
      `Receivables finance cost ratio is ${(o.out_utilization_margin * 100).toFixed(1)}% ` +
      `of revenue amount. While within a manageable range, there is room for improvement. ` +
      `Current annual finance cost: ${cur}${o.out_demand_metric.toFixed(0)}.`,
  },
  {
    id: "high_receivables_impact",
    when: (o) => isFinite(o.out_demand_metric) && o.out_demand_metric > 50000,
    severity: "info",
    message: (o, _i, cur) =>
      `Annual receivables finance cost of ${cur}${o.out_demand_metric.toFixed(0)} ` +
      `represents a significant cash flow impact. Consider factoring or supply chain ` +
      `finance as an alternative funding source.`,
  },
  {
    id: "hedge_recommendation",
    when: (o) => isFinite(o.out_utilization_margin) && o.out_utilization_margin > 0.08,
    severity: "opp",
    message: (o, i, cur) =>
      `At ${(o.out_utilization_margin * 100).toFixed(1)}% finance cost ratio, ` +
      `a payment term addendum with a ${(i.annualInterestRate > 0 ? (i.annualInterestRate * 100).toFixed(1) : "N/A")}% ` +
      `factoring rate could reduce carrying costs. ` +
      `Estimated savings: ${cur}${(o.out_demand_metric * 0.15).toFixed(0)} annually.`,
  },
  {
    id: "low_confidence",
    when: (o, i) => i.sourceConfidence < 0.7,
    severity: "info",
    message: (_o, i, _cur) =>
      `Source confidence is ${(i.sourceConfidence * 100).toFixed(0)}% — below the 70% ` +
      `reliability threshold. The receivables cost inputs may not reflect actual ` +
      `payment term structures. Verify against current AR aging.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: ReceivablesCostOutputs,
  inputs: ReceivablesCostInputs,
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
