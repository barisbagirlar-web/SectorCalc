/**
 * Job Quote Builder Pro Pack — insight rules.
 *
 * Consumes the output keys from executeFormula().
 * 5 rules, independently firing.
 */
import type { JobQuoteOutputs, JobQuoteInputs } from
  "@/sectorcalc/formulas/pro-v531/job-quote-builder-pro-pack.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: JobQuoteOutputs, inp: JobQuoteInputs) => boolean;
  severity: Severity;
  message: (out: JobQuoteOutputs, inp: JobQuoteInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "low_margin_warning",
    when: (o, i) => isFinite(o.out_marginPct) && i.targetMargin > 0 &&
      o.out_marginPct < i.targetMargin / 2,
    severity: "crit",
    message: (o, i, cur) =>
      `Margin is ${(o.out_marginPct * 100).toFixed(1)}% — less than half the target of ` +
      `${(i.targetMargin * 100).toFixed(0)}%. Recommended price is ${cur}${o.out_recommendedPrice.toFixed(2)}, ` +
      `but risk-adjusted price yields ${cur}${o.out_riskAdjustedPrice.toFixed(2)}. ` +
      `Review cost structure or renegotiate with customer.`,
  },
  {
    id: "high_labor_burden",
    when: (o) => o.out_laborCost > 0 && o.out_machineCost > 0 &&
      o.out_laborCost > o.out_machineCost * 1.5,
    severity: "opp",
    message: (o, _i, cur) =>
      `Labor cost (${cur}${o.out_laborCost.toFixed(2)}) is more than 1.5x ` +
      `machine cost (${cur}${o.out_machineCost.toFixed(2)}). ` +
      `Consider automation, tooling improvements, or operator training ` +
      `to reduce cycle time and labor burden.`,
  },
  {
    id: "high_uncertainty",
    when: (o, i) => i.uncertaintyMultiplier > 0.3,
    severity: "info",
    message: (o, i, cur) =>
      `Uncertainty multiplier of ${i.uncertaintyMultiplier.toFixed(2)} is above the 0.3 threshold. ` +
      `Risk-adjusted price exceeds recommended price by ` +
      `${cur}${(o.out_riskAdjustedPrice - o.out_recommendedPrice).toFixed(2)}. ` +
      `Consider improving source data quality to reduce uncertainty.`,
  },
  {
    id: "wider_opportunity",
    when: (o, i) => isFinite(o.out_marginPct) && i.targetMargin > 0 &&
      o.out_marginPct > i.targetMargin * 1.5,
    severity: "opp",
    message: (o, i, cur) =>
      `Margin of ${(o.out_marginPct * 100).toFixed(1)}% exceeds target by more than 50%. ` +
      `Final price of ${cur}${o.out_riskAdjustedPrice.toFixed(2)} ` +
      `provides healthy headroom. Consider value-added options or volume discounts.`,
  },
  {
    id: "confidence_warning",
    when: (o, i) => i.sourceConfidence < 0.5,
    severity: "info",
    message: (_o, i) =>
      `Source confidence is ${(i.sourceConfidence * 100).toFixed(0)}% — below the 50% reliability threshold. ` +
      `Inputs may be based on estimates rather than verified data. ` +
      `Audit cost inputs before submitting the final quote.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: JobQuoteOutputs,
  inputs: JobQuoteInputs,
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
