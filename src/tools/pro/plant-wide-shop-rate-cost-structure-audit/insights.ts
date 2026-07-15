/**
 * Plant-Wide Shop Rate Cost Structure Audit — insight rules.
 *
 * 6 rules: pricing floor coverage, under-recovery risk, machine group variance,
 * overhead absorption, utilization drag, confidence caveat.
 */
import type { PlantWideShopRateOutputs, PlantWideShopRateInputs } from
  "@/sectorcalc/formulas/pro-v531/plant-wide-shop-rate-cost-structure-audit.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: PlantWideShopRateOutputs, inp: PlantWideShopRateInputs) => boolean;
  severity: Severity;
  message: (out: PlantWideShopRateOutputs, inp: PlantWideShopRateInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "rate_below_pricing_floor",
    when: (o) => o.out_finalDecisionState === 1 || o.out_finalDecisionState === 2,
    severity: "crit",
    message: (o, _i, cur) =>
      `Current shop rate is below the calculated pricing floor. ` +
      `Scenario delta: ${cur}${o.out_scenarioDelta.toFixed(2)} gap. ` +
      `Repricing recommended to cover full cost structure.`,
  },
  {
    id: "rate_above_pricing_floor",
    when: (o) => o.out_finalDecisionState === 0,
    severity: "opp",
    message: (o, _i, cur) =>
      `Current shop rate is at or above the pricing floor. ` +
      `Money at risk: ${cur}${o.out_moneyAtRisk.toFixed(0)} (under-recovery exposure). ` +
      `Rate position is healthy.`,
  },
  {
    id: "high_under_recovery",
    when: (o) => o.out_moneyAtRisk > 50000,
    severity: "crit",
    message: (o, _i, cur) =>
      `Under-recovery exposure is ${cur}${o.out_moneyAtRisk.toFixed(0)} — above 50k threshold. ` +
      `Significant cost is not being recovered at current billing rates. ` +
      `Immediate rate review recommended.`,
  },
  {
    id: "low_utilization",
    when: (o) => o.out_utilizationMargin < 0.65,
    severity: "info",
    message: (o) =>
      `Utilization is ${(o.out_utilizationMargin * 100).toFixed(0)}% — below 65%. ` +
      `Low utilization amplifies under-recovery. Consider demand-building or ` +
      `cost structure adjustment.`,
  },
  {
    id: "overhead_absorption_gap",
    when: (o, i) => i.overheadPool > 0 && o.out_expandedUncertainty > i.currentShopRate * 0.3,
    severity: "info",
    message: (o, _i, cur) =>
      `Overhead absorption rate (${cur}${o.out_expandedUncertainty.toFixed(2)}) ` +
      `is significant relative to current shop rate. Review overhead allocation basis.`,
  },
  {
    id: "low_confidence",
    when: (o) => o.out_evidenceCompleteness < 0.6,
    severity: "crit",
    message: (o) =>
      `Source confidence is ${(o.out_evidenceCompleteness * 100).toFixed(0)}% — below 60%. ` +
      `Audit cost data with verified accounting records before repricing.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: PlantWideShopRateOutputs,
  inputs: PlantWideShopRateInputs,
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
