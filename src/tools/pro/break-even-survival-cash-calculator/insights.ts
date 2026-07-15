/**
 * Break-Even & Survival Cash Calculator — insight rules.
 *
 * Consumes the output keys from executeFormula().
 * 5 rules, independently firing.
 */
import type { BreakEvenOutputs, BreakEvenInputs } from
  "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: BreakEvenOutputs, inp: BreakEvenInputs) => boolean;
  severity: Severity;
  message: (out: BreakEvenOutputs, inp: BreakEvenInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "break_even_breached",
    when: (o) => o.out_current_revenue_gap < 0,
    severity: "crit",
    message: (o, _i, cur) =>
      `Current monthly revenue is ${cur}${Math.abs(o.out_current_revenue_gap).toFixed(0)} below break-even. ` +
      `The business is operating at a loss. Immediate cost restructuring or revenue recovery ` +
      `is required.`,
  },
  {
    id: "short_runway",
    when: (o) => o.out_cash_runway_months < 6 && o.out_cash_runway_months > 0,
    severity: "crit",
    message: (o, _i, cur) =>
      `Cash runway is only ${o.out_cash_runway_months.toFixed(1)} months. ` +
      `At the current burn rate of ${cur}${o.out_monthly_cash_burn.toFixed(0)}/mo, ` +
      `the business faces liquidity risk within the next quarter. Urgent funding or ` +
      `expense mitigation needed.`,
  },
  {
    id: "funding_gap_warning",
    when: (o) => o.out_funding_gap > 0,
    severity: "crit",
    message: (o, _i, cur) =>
      `A funding gap of ${cur}${o.out_funding_gap.toFixed(0)} remains after reserve and ` +
      `uncertainty allowances. Survival cash target: ${cur}${o.out_survival_cash_target.toFixed(0)}. ` +
      `Explore bridge financing, cost deferral, or accelerated receivables.`,
  },
  {
    id: "positive_runway",
    when: (o) => o.out_current_revenue_gap >= 0 && o.out_cash_runway_months >= 12,
    severity: "info",
    message: (o, _i, cur) =>
      `Revenue is above break-even and cash runway extends ${o.out_cash_runway_months.toFixed(1)} months. ` +
      `The business has healthy liquidity. Maintain cost discipline and monitor ` +
      `contribution margin trends.`,
  },
  {
    id: "low_confidence",
    when: (_o, i) => i.sourceConfidence < 0.7,
    severity: "crit",
    message: (_o, i, cur) =>
      `Source confidence is ${(i.sourceConfidence * 100).toFixed(0)}% — below the 70% threshold. ` +
      `Break-even and runway projections are highly sensitive to data quality. ` +
      `Verify accounting records before making financing decisions.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: BreakEvenOutputs,
  inputs: BreakEvenInputs,
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
