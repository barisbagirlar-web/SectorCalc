/**
 * OEE Loss Monetization & Improvement Business Case — insight rules.
 *
 * Consumes the output keys from executeFormula().
 * 5 rules, independently firing.
 */
import type { OEELossOutputs, OEELossInputs } from
  "@/sectorcalc/formulas/pro-v531/oee-loss-monetization-improvement-business-case.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: OEELossOutputs, inp: OEELossInputs) => boolean;
  severity: Severity;
  message: (out: OEELossOutputs, inp: OEELossInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "low_oee",
    when: (o) => isFinite(o.out_oee_score) && o.out_oee_score < 0.60,
    severity: "crit",
    message: (o, _i, cur) =>
      `Overall OEE is ${(o.out_oee_score * 100).toFixed(1)}% — well below the world-class threshold of 85%. ` +
      `The total monetized loss is ${cur}${o.out_total_oee_loss.toFixed(0)}. ` +
      `A structured improvement program (TPM, SMED, quality at source) is recommended to close the gap.`,
  },
  {
    id: "availability_dominant_loss",
    when: (o) => o.out_total_oee_loss > 0 &&
      o.out_availability_loss_value / o.out_total_oee_loss > 0.5,
    severity: "crit",
    message: (o, _i, cur) =>
      `Availability loss represents ${((o.out_availability_loss_value / o.out_total_oee_loss) * 100).toFixed(0)}% ` +
      `of total OEE loss (${cur}${o.out_availability_loss_value.toFixed(0)}). ` +
      `Downtime reduction (planned maintenance, quick changeover) offers the highest ROI.`,
  },
  {
    id: "positive_roi",
    when: (o) => isFinite(o.out_roi_ratio) && o.out_roi_ratio > 1.0,
    severity: "opp",
    message: (o, _i, cur) =>
      `Improvement investment of ${cur}${o.out_improvement_value.toFixed(0)} (3-year, 30% risk discount) ` +
      `exceeds the improvement cost. ROI ratio: ${o.out_roi_ratio.toFixed(2)}x. ` +
      `Proceed with investment justification.`,
  },
  {
    id: "strong_business_case",
    when: (o) => isFinite(o.out_roi_ratio) && o.out_roi_ratio > 3.0,
    severity: "opp",
    message: (o, _i, cur) =>
      `Strong business case with ROI ratio of ${o.out_roi_ratio.toFixed(2)}x. ` +
      `Improvement value: ${cur}${o.out_improvement_value.toFixed(0)}. ` +
      `Expedite capital approval — the payback period is attractive.`,
  },
  {
    id: "confidence_warning",
    when: (_o, i) => i.sourceConfidence < 0.5,
    severity: "info",
    message: (_o, i) =>
      `Source confidence is ${(i.sourceConfidence * 100).toFixed(0)}% — below the 50% reliability threshold. ` +
      `Verify production data before committing to improvement investments.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: OEELossOutputs,
  inputs: OEELossInputs,
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
