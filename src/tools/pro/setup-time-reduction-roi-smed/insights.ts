/**
 * Setup Time Reduction ROI (SMED) — insight rules.
 *
 * Consumes the output keys from executeFormula().
 * 5 rules, independently firing.
 */
import type { SetupTimeReductionOutputs, SetupTimeReductionInputs } from
  "@/sectorcalc/formulas/pro-v531/setup-time-reduction-roi-smed.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: SetupTimeReductionOutputs, inp: SetupTimeReductionInputs) => boolean;
  severity: Severity;
  message: (out: SetupTimeReductionOutputs, inp: SetupTimeReductionInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "high_roi",
    when: (o) => isFinite(o.out_utilization_margin) && o.out_utilization_margin > 0.50,
    severity: "opp",
    message: (o, _i, cur) =>
      `SMED investment ROI is ${(o.out_utilization_margin * 100).toFixed(0)}% — ` +
      `well above the 50% threshold. Setup time reduction is a high-return investment. ` +
      `Estimated annual savings: ${cur}${o.out_demand_metric.toFixed(0)}.`,
  },
  {
    id: "fast_payback",
    when: (o) => isFinite(o.out_final_decision_state) && o.out_final_decision_state === 0,
    severity: "opp",
    message: (o, _i, cur) =>
      `Payback period is under 12 months — a strong investment signal. ` +
      `Implementation cost of ${cur}${o.out_money_at_risk.toFixed(0)} ` +
      `is recovered quickly through annual savings of ${cur}${o.out_demand_metric.toFixed(0)}. ` +
      `Priority execution recommended.`,
  },
  {
    id: "moderate_payback",
    when: (o) => isFinite(o.out_final_decision_state) && o.out_final_decision_state === 1,
    severity: "info",
    message: (o, _i, cur) =>
      `Payback period is 12–24 months. The SMED investment of ${cur}${o.out_money_at_risk.toFixed(0)} ` +
      `is viable but not urgent. Consider staging the implementation to spread costs.`,
  },
  {
    id: "high_investment_risk",
    when: (o) => isFinite(o.out_final_decision_state) && o.out_final_decision_state === 2,
    severity: "crit",
    message: (o, _i, cur) =>
      `Payback period exceeds 24 months — the SMED investment of ${cur}${o.out_money_at_risk.toFixed(0)} ` +
      `carries significant risk. Verify setup time reduction assumptions and explore ` +
      `lower-cost alternatives before proceeding.`,
  },
  {
    id: "low_confidence",
    when: (o, i) => i.sourceConfidence < 0.7,
    severity: "info",
    message: (_o, i, _cur) =>
      `Source confidence is ${(i.sourceConfidence * 100).toFixed(0)}% — below the 70% ` +
      `reliability threshold. The setup time and volume data may not reflect actual ` +
      `operating conditions. Time-study validation recommended.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: SetupTimeReductionOutputs,
  inputs: SetupTimeReductionInputs,
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
