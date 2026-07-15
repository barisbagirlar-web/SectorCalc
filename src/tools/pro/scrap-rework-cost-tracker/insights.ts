/**
 * Scrap & Rework Cost Tracker — insight rules.
 *
 * Consumes the output keys from executeFormula().
 * 5 rules, independently firing.
 */
import type { ScrapReworkOutputs, ScrapReworkInputs } from
  "@/sectorcalc/formulas/pro-v531/scrap-rework-cost-tracker.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: ScrapReworkOutputs, inp: ScrapReworkInputs) => boolean;
  severity: Severity;
  message: (out: ScrapReworkOutputs, inp: ScrapReworkInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "scrap_dominant",
    when: (o) => o.out_scrapCost > 0 && o.out_reworkCost > 0 &&
      o.out_scrapCost / (o.out_scrapCost + o.out_reworkCost) > 0.70,
    severity: "crit",
    message: (o, _i, cur) =>
      `Scrap represents ${((o.out_scrapCost / (o.out_scrapCost + o.out_reworkCost)) * 100).toFixed(0)}% ` +
      `of total quality loss (${cur}${o.out_scrapCost.toFixed(0)}). ` +
      `Defect prevention investment (SPC, mistake-proofing) typically yields higher ROI ` +
      `than sorting or rework.`,
  },
  {
    id: "rework_dominant",
    when: (o) => o.out_scrapCost > 0 && o.out_reworkCost > 0 &&
      o.out_reworkCost / (o.out_scrapCost + o.out_reworkCost) > 0.70,
    severity: "opp",
    message: (o, _i, cur) =>
      `Rework is ${((o.out_reworkCost / (o.out_scrapCost + o.out_reworkCost)) * 100).toFixed(0)}% ` +
      `of quality loss (${cur}${o.out_reworkCost.toFixed(0)}). A process capability review ` +
      `(Cpk analysis) may reduce variation and the need for rework routing.`,
  },
  {
    id: "high_defect_rate",
    when: (o) => isFinite(o.out_defectRate) && o.out_defectRate > 0.05,
    severity: "crit",
    message: (o, _i, cur) =>
      `Defect rate is ${(o.out_defectRate * 100).toFixed(1)}% — above the 5% critical threshold. ` +
      `Estimated monthly loss: ${cur}${o.out_monthlyQualityLoss.toFixed(0)}. ` +
      `Immediate process intervention is recommended.`,
  },
  {
    id: "target_achieved",
    when: (o, i) => isFinite(o.out_defectRate) && i.defectRateTargetPct > 0 &&
      o.out_defectRate <= i.defectRateTargetPct / 100,
    severity: "info",
    message: (o) =>
      `Defect rate of ${(o.out_defectRate * 100).toFixed(2)}% is within the target. ` +
      `Current quality controls are effective.`,
  },
  {
    id: "high_loss_per_unit",
    when: (o, i) => isFinite(o.out_defectCostPerUnit) && i.unitMaterialCost > 0 &&
      o.out_defectCostPerUnit > i.unitMaterialCost * 2,
    severity: "opp",
    message: (o, i, cur) =>
      `Each defect costs ${cur}${o.out_defectCostPerUnit.toFixed(2)} — more than 2x the material cost ` +
      `of ${cur}${i.unitMaterialCost.toFixed(2)}. Rework routing or supplier quality ` +
      `may need review.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: ScrapReworkOutputs,
  inputs: ScrapReworkInputs,
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
