/**
 * Customer SKU Profitability Forensics — insight rules.
 *
 * Consumes the output keys from executeFormula().
 * 5 rules, independently firing.
 */
import type { SKUProfitOutputs, SKUProfitInputs } from
  "@/sectorcalc/formulas/pro-v531/customer-sku-profitability-forensics.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: SKUProfitOutputs, inp: SKUProfitInputs) => boolean;
  severity: Severity;
  message: (out: SKUProfitOutputs, inp: SKUProfitInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "toxic_sku",
    when: (o) => o.out_toxicFlag === 1,
    severity: "crit",
    message: (o, _i, cur) =>
      `This SKU is generating a negative net margin of ${cur}${o.out_netMargin.toFixed(2)} per unit ` +
      `after accounting for logistics, service, and return burdens. ` +
      `Immediate pricing, cost, or portfolio action is required.`,
  },
  {
    id: "low_margin_warning",
    when: (o, i) => o.out_contributionMarginRatio > 0 &&
      o.out_contributionMarginRatio < (i.targetMargin / 100) / 2,
    severity: "crit",
    message: (o, i, cur) =>
      `Contribution margin ratio of ${(o.out_contributionMarginRatio * 100).toFixed(1)}% is less than ` +
      `half the target of ${i.targetMargin.toFixed(1)}%. Current net margin per unit: ` +
      `${cur}${o.out_netMargin.toFixed(2)}. Cost reduction or price adjustment is urgent.`,
  },
  {
    id: "high_logistics_burden",
    when: (o) => o.out_netMargin > 0 &&
      o.out_logisticsBurden > o.out_netMargin * 0.5,
    severity: "opp",
    message: (o, _i, cur) =>
      `Logistics burden of ${cur}${o.out_logisticsBurden.toFixed(2)} per unit exceeds 50% of the ` +
      `net margin of ${cur}${o.out_netMargin.toFixed(2)}. Route optimization or carrier ` +
      `renegotiation may unlock significant upside.`,
  },
  {
    id: "return_rate_risk",
    when: (o, i) => i.returnRatePct > 10,
    severity: "info",
    message: (o, i, cur) =>
      `Return burden of ${cur}${o.out_returnBurden.toFixed(2)} per unit (${i.returnRatePct.toFixed(1)}% ` +
      `of price) is elevated. Investigate root causes — quality, fit, or documentation issues ` +
      `often drive excessive returns.`,
  },
  {
    id: "confidence_warning",
    when: (o, i) => i.sourceConfidence < 0.5,
    severity: "info",
    message: (_o, i, _cur) =>
      `Source confidence is ${(i.sourceConfidence * 100).toFixed(0)}% — below the 50% threshold. ` +
      `Results should be treated as indicative; verify cost allocations and volume data ` +
      `before making decisions.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: SKUProfitOutputs,
  inputs: SKUProfitInputs,
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
