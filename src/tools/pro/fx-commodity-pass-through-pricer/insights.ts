/**
 * FX & Commodity Pass-Through Pricer — insight rules.
 *
 * 6 rules: pass-through magnitude, threshold crossing, hedge adequacy,
 * driver identification, confidence impact, annual escalation risk.
 */
import type { FxCommodityPassThroughOutputs, FxCommodityPassThroughInputs } from
  "@/sectorcalc/formulas/pro-v531/fx-commodity-pass-through-pricer.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: FxCommodityPassThroughOutputs, inp: FxCommodityPassThroughInputs) => boolean;
  severity: Severity;
  message: (out: FxCommodityPassThroughOutputs, inp: FxCommodityPassThroughInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "high_pass_through",
    when: (o) => o.out_fmeaTrigger >= 2,
    severity: "crit",
    message: (o, _i, cur) =>
      `Total pass-through exceeds 15% — high escalation risk. ` +
      `Money at risk: ${cur}${o.out_moneyAtRisk.toFixed(0)}. ` +
      `Review contract escalation clauses and hedge positions.`,
  },
  {
    id: "moderate_pass_through",
    when: (o) => o.out_fmeaTrigger === 1,
    severity: "info",
    message: (o, _i, cur) =>
      `Total pass-through is between 5-15%. Scenario delta: ` +
      `${cur}${o.out_scenarioDelta.toFixed(0)}. ` +
      `Flag for customer notification per contract terms.`,
  },
  {
    id: "low_pass_through",
    when: (o) => o.out_fmeaTrigger === 0 && o.out_thresholdCrossing === 0,
    severity: "opp",
    message: () =>
      `Total pass-through is under 5% — within normal volatility band. ` +
      `Current pricing and hedge positions adequately absorb market movements.`,
  },
  {
    id: "inadequate_hedge",
    when: (o) => o.out_fmeaTrigger >= 4,
    severity: "crit",
    message: (o) =>
      `Both FX and commodity hedge positions are below 50%. ` +
      `Increased exposure to market volatility. Consider expanding ` +
      `hedge coverage to protect margins. FMEA trigger: ${o.out_fmeaTrigger}.`,
  },
  {
    id: "fx_dominated",
    when: (o) => o.out_sensitivityDriver === 0,
    severity: "info",
    message: () =>
      `FX rate change is the dominant sensitivity driver. ` +
      `Review FX hedge ratio and consider forward contracts.`,
  },
  {
    id: "commodity_dominated",
    when: (o) => o.out_sensitivityDriver === 1,
    severity: "info",
    message: () =>
      `Commodity index change is the dominant sensitivity driver. ` +
      `Review commodity hedge position and supplier pass-through terms.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: FxCommodityPassThroughOutputs,
  inputs: FxCommodityPassThroughInputs,
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
