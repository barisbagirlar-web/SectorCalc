/**
 * Product SKU Margin Ranker — insight rules.
 *
 * Consumes the output keys from executeFormula().
 * 5 rules, independently firing.
 */
import type { ProductSkuMarginOutputs, ProductSkuMarginInputs } from
  "@/sectorcalc/formulas/pro-v531/product-sku-margin-ranker.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: ProductSkuMarginOutputs, inp: ProductSkuMarginInputs) => boolean;
  severity: Severity;
  message: (out: ProductSkuMarginOutputs, inp: ProductSkuMarginInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "negative_margin",
    when: (o) => isFinite(o.out_demand_metric) && o.out_demand_metric < 0,
    severity: "crit",
    message: (o, _i, cur) =>
      `This SKU has a negative contribution margin of ${cur}${o.out_demand_metric.toFixed(4)} per unit. ` +
      `Every unit sold is eroding profit. Total annual exposure: ${cur}${o.out_money_at_risk.toFixed(0)}. ` +
      `Immediate pricing review or cost reduction required.`,
  },
  {
    id: "low_margin_vs_target",
    when: (o, i) => isFinite(o.out_utilization_margin) && o.out_utilization_margin > 0 &&
      o.out_utilization_margin < i.targetMargin,
    severity: "opp",
    message: (o, i, _cur) =>
      `Contribution margin ratio of ${(o.out_utilization_margin * 100).toFixed(1)}% ` +
      `is below the target of ${(i.targetMargin * 100).toFixed(1)}%. ` +
      `While the SKU is profitable, it is underperforming relative to margin targets. ` +
      `Consider material cost reduction or value-based pricing.`,
  },
  {
    id: "high_material_sensitivity",
    when: (o, i) => i.materialCost > 0 && isFinite(o.out_utilization_margin) &&
      o.out_utilization_margin < 0.15 && o.out_utilization_margin > 0,
    severity: "info",
    message: (o, i, _cur) =>
      `Material cost represents a significant portion of total unit cost ` +
      `(${((i.materialCost / (o.out_capacity_metric || 1)) * 100).toFixed(0)}% of unit price). ` +
      `This SKU is highly sensitive to raw material price fluctuations. ` +
      `Supplier diversification or hedging is advised.`,
  },
  {
    id: "high_labor_sensitivity",
    when: (o, i) => i.laborRate > 0 && i.cycleTime > 0 && isFinite(o.out_utilization_margin) &&
      o.out_utilization_margin < 0.15 && o.out_utilization_margin > 0,
    severity: "info",
    message: (o, i, _cur) =>
      `Labor intensity is high with a cycle time of ${i.cycleTime} minutes ` +
      `at ${i.laborRate}/h. Process automation or method improvement ` +
      `could significantly improve margin. Current contribution margin: ` +
      `${(o.out_utilization_margin * 100).toFixed(1)}%.`,
  },
  {
    id: "volume_concentration_risk",
    when: (o, i) => isFinite(o.out_demand_metric) && i.annualVolume > 50000 &&
      o.out_demand_metric < 0,
    severity: "crit",
    message: (o, i, cur) =>
      `High volume (${i.annualVolume.toLocaleString()} units/year) combined with ` +
      `negative contribution margin of ${cur}${o.out_demand_metric.toFixed(4)} ` +
      `creates severe profit erosion. Total annual money at risk: ${cur}${o.out_money_at_risk.toFixed(0)}. ` +
      `Strategic SKU rationalization or cost restructuring is critical.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: ProductSkuMarginOutputs,
  inputs: ProductSkuMarginInputs,
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
