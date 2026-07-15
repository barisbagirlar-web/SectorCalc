/**
 * True Employee Cost Statement — insight rules.
 *
 * Consumes the output keys from executeFormula().
 * 5 rules, independently firing.
 */
import type { LaborRateOutputs, LaborRateInputs } from
  "@/sectorcalc/formulas/pro-v531/true-employee-cost-statement.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: LaborRateOutputs, inp: LaborRateInputs) => boolean;
  severity: Severity;
  message: (out: LaborRateOutputs, inp: LaborRateInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "total_cost_vs_salary",
    when: (o) => o.out_base_to_loaded_multiplier > 1.5,
    severity: "crit",
    message: (o, _i, cur) =>
      `Total loaded cost is ${(o.out_base_to_loaded_multiplier * 100).toFixed(0)}% ` +
      `of base salary (${cur}${o.out_fully_loaded_annual_cost.toFixed(0)} vs ${cur}${o.out_base_annual_compensation.toFixed(0)}). ` +
      `A multiplier above 1.5× indicates significant employer burden. Review benefits structure ` +
      `and overhead allocation.`,
  },
  {
    id: "high_tax_burden",
    when: (o) => o.out_employer_payroll_taxes > o.out_base_annual_compensation * 0.3,
    severity: "crit",
    message: (o, _i, cur) =>
      `Employer payroll taxes (${cur}${o.out_employer_payroll_taxes.toFixed(0)}) exceed ` +
      `30% of base salary — ${(o.out_employer_payroll_taxes / o.out_base_annual_compensation * 100).toFixed(1)}%. ` +
      `This represents an above-average statutory burden. Consider jurisdiction-specific ` +
      `tax optimization or incentives.`,
  },
  {
    id: "low_productive_hours_risk",
    when: (o) => o.out_productive_hours_annual < 1500,
    severity: "opp",
    message: (o, _i, cur) =>
      `Productive hours (${o.out_productive_hours_annual.toFixed(0)} hrs/yr) are below the ` +
      `1,500-hour standard threshold. This inflates the effective hourly cost to ` +
      `${cur}${o.out_productive_hourly_cost.toFixed(2)}. Review time allocation and ` +
      `non-productive overhead.`,
  },
  {
    id: "confidence_warning",
    when: (_o, i) => i.sourceConfidence < 0.5,
    severity: "opp",
    message: (_o, _i, _cur) =>
      `Source confidence ratio is below 0.5. Input data quality may affect cost accuracy. ` +
      `Audit base salary, benefits, and tax rates before relying on this analysis.`,
  },
  {
    id: "high_benefits",
    when: (o) => o.out_benefits_cost > o.out_base_annual_compensation * 0.2,
    severity: "opp",
    message: (o, _i, cur) =>
      `Benefits cost (${cur}${o.out_benefits_cost.toFixed(0)}) represents ` +
      `${(o.out_benefits_cost / o.out_base_annual_compensation * 100).toFixed(1)}% ` +
      `of base salary — above the 20% benchmark. Consider a benefits cost-benefit ` +
      `review to identify optimization opportunities without reducing workforce value.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: LaborRateOutputs,
  inputs: LaborRateInputs,
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
