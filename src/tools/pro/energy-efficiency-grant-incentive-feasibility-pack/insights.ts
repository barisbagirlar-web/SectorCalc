/**
 * Energy Efficiency Grant & Incentive Feasibility Pack — insight rules.
 *
 * 6 rules: payback attractiveness, grant leverage, carbon saving impact,
 * energy saving magnitude, confidence caveat, long-term roi signal.
 */
import type { EnergyEfficiencyOutputs, EnergyEfficiencyInputs } from
  "@/sectorcalc/formulas/pro-v531/energy-efficiency-grant-incentive-feasibility-pack.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: EnergyEfficiencyOutputs, inp: EnergyEfficiencyInputs) => boolean;
  severity: Severity;
  message: (out: EnergyEfficiencyOutputs, inp: EnergyEfficiencyInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "strong_roi",
    when: (o) => o.out_finalDecisionState === 0,
    severity: "opp",
    message: (o, _i, cur) =>
      `Payback period qualifies for PROCEED recommendation. ` +
      `5-year ROI is attractive. Scenario delta: ${cur}${o.out_scenarioDelta.toFixed(0)} ` +
      `per unit basis. Strong business case for implementation.`,
  },
  {
    id: "review_required",
    when: (o) => o.out_finalDecisionState === 1,
    severity: "info",
    message: (o, _i, cur) =>
      `Payback period falls in the REVIEW zone (3-5 years). ` +
      `Money at risk: ${cur}${o.out_moneyAtRisk.toFixed(0)}. ` +
      `Sensitivity analysis on energy rate and grant assumptions recommended.`,
  },
  {
    id: "hold_decision",
    when: (o) => o.out_finalDecisionState === 2,
    severity: "crit",
    message: (o, _i, cur) =>
      `Payback period exceeds 5 years — HOLD. ` +
      `Money at risk: ${cur}${o.out_moneyAtRisk.toFixed(0)}. ` +
      `Consider alternative technologies or await better grant conditions.`,
  },
  {
    id: "high_grant_leverage",
    when: (o, i) => i.grantCoveragePct > 0.5,
    severity: "opp",
    message: (o, i) =>
      `Grant coverage is ${(i.grantCoveragePct * 100).toFixed(0)}% — significantly reduces ` +
      `net implementation cost. Strongly improves payback and ROI. ` +
      `Ensure grant application deadlines are met.`,
  },
  {
    id: "significant_carbon_reduction",
    when: (o, i) => (i.currentKwhPerYear - i.targetKwhPerYear) * i.emissionFactorKgCo2PerKwh / 1000 > 50,
    severity: "info",
    message: (o, i) => {
      const co2 = (i.currentKwhPerYear - i.targetKwhPerYear) * i.emissionFactorKgCo2PerKwh / 1000;
      return `Estimated CO2 reduction: ${co2.toFixed(1)} tonnes/year. ` +
        `Quantify carbon credit value and regulatory compliance benefit in business case.`;
    },
  },
  {
    id: "low_confidence",
    when: (o) => o.out_evidenceCompleteness < 0.6,
    severity: "crit",
    message: (o) =>
      `Source confidence is ${(o.out_evidenceCompleteness * 100).toFixed(0)}% — below 60%. ` +
      `Obtain verified energy bills, equipment specifications, and grant terms.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: EnergyEfficiencyOutputs,
  inputs: EnergyEfficiencyInputs,
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
