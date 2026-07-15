/**
 * Weld Procedure Cost & Consumable Estimation Suite — insight rules.
 *
 * 6 rules: cost-per-meter, consumable efficiency, labor dominance,
 * gas cost impact, overhead drag, confidence caveat.
 */
import type { WeldProcedureOutputs, WeldProcedureInputs } from
  "@/sectorcalc/formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: WeldProcedureOutputs, inp: WeldProcedureInputs) => boolean;
  severity: Severity;
  message: (out: WeldProcedureOutputs, inp: WeldProcedureInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "high_cost_per_meter",
    when: (o) => o.out_costPerMeter > 50,
    severity: "crit",
    message: (o, _i, cur) =>
      `Cost per meter is ${cur}${o.out_costPerMeter.toFixed(2)} — above the 50-threshold. ` +
      `Review weld procedure and consider process optimization.`,
  },
  {
    id: "moderate_cost_per_meter",
    when: (o) => o.out_costPerMeter > 20 && o.out_costPerMeter <= 50,
    severity: "info",
    message: (o, _i, cur) =>
      `Cost per meter is ${cur}${o.out_costPerMeter.toFixed(2)}. Within acceptable range ` +
      `but opportunities for improvement may exist.`,
  },
  {
    id: "low_cost_per_meter",
    when: (o) => o.out_costPerMeter <= 20,
    severity: "opp",
    message: (o, _i, cur) =>
      `Cost per meter is ${cur}${o.out_costPerMeter.toFixed(2)} — competitive. ` +
      `Current weld procedure is cost-efficient.`,
  },
  {
    id: "low_deposition_efficiency",
    when: (o) => o.out_consumableEfficiency < 0.75,
    severity: "crit",
    message: (o) =>
      `Deposition efficiency is ${(o.out_consumableEfficiency * 100).toFixed(1)}% — below 75%. ` +
      `Review welding parameters, wire feed stability, and operator technique.`,
  },
  {
    id: "labor_dominant_cost",
    when: (o) => o.out_sensitivityDriver === 1 && o.out_laborCost > o.out_wireCost * 2,
    severity: "info",
    message: (o, _i, cur) =>
      `Labor cost (${cur}${o.out_laborCost.toFixed(2)}) is the dominant cost driver. ` +
      `Consider improving deposition rate or automating weld passes.`,
  },
  {
    id: "high_overhead_drag",
    when: (o) => o.out_shopOverhead > o.out_laborCost * 0.5,
    severity: "info",
    message: (o, _i, cur) =>
      `Shop overhead (${cur}${o.out_shopOverhead.toFixed(2)}) exceeds 50% of direct labor. ` +
      `Review overhead allocation rates for this weld cell.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: WeldProcedureOutputs,
  inputs: WeldProcedureInputs,
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
