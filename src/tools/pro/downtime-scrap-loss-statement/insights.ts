/**
 * Downtime & Scrap Loss Statement — insight rules.
 *
 * Consumes the output keys from executeFormula().
 * 5 rules, independently firing.
 */
import type { DowntimeLossOutputs, DowntimeLossInputs } from
  "@/sectorcalc/formulas/pro-v531/downtime-scrap-loss-statement.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: DowntimeLossOutputs, inp: DowntimeLossInputs) => boolean;
  severity: Severity;
  message: (out: DowntimeLossOutputs, inp: DowntimeLossInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "critical_downtime",
    when: (o) => o.out_downtime_cost > 0 &&
      o.out_downtime_cost > o.out_total_loss * 0.5 &&
      o.out_uptime_ratio < 0.85,
    severity: "crit",
    message: (o, _i, cur) =>
      `Downtime accounts for ${((o.out_downtime_cost / o.out_total_loss) * 100).toFixed(0)}% ` +
      `of total loss (${cur}${o.out_downtime_cost.toFixed(0)}) with uptime at ` +
      `${(o.out_uptime_ratio * 100).toFixed(1)}%. ` +
      `Availability improvement (TPM, SMED) typically yields the highest ROI.`,
  },
  {
    id: "scrap_dominant_loss",
    when: (o) => o.out_scrap_material_loss > o.out_rework_loss &&
      o.out_scrap_material_loss > o.out_downtime_cost,
    severity: "opp",
    message: (o, _i, cur) =>
      `Scrap material loss (${cur}${o.out_scrap_material_loss.toFixed(0)}) is the largest ` +
      `cost component. First-pass yield improvement and supplier quality ` +
      `initiatives may reduce scrap significantly.`,
  },
  {
    id: "escalate_loss",
    when: (o) => o.out_decision_state >= 2,
    severity: "crit",
    message: (o, _i, cur) =>
      `Total loss of ${cur}${o.out_total_loss.toFixed(0)} exceeds the 15% escalation ` +
      `threshold. Immediate management review and corrective action plan ` +
      `are recommended.`,
  },
  {
    id: "high_uptime",
    when: (o) => o.out_uptime_ratio > 0.95,
    severity: "info",
    message: (o) =>
      `Uptime ratio of ${(o.out_uptime_ratio * 100).toFixed(1)}% indicates high ` +
      `equipment availability. Current maintenance practices are effective.`,
  },
  {
    id: "confidence_warning",
    when: (_o, i) => i.sourceConfidence < 0.5,
    severity: "info",
    message: () =>
      `Source confidence is below 0.5. Verify downtime and scrap data ` +
      `against production records before making business decisions.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: DowntimeLossOutputs,
  inputs: DowntimeLossInputs,
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
