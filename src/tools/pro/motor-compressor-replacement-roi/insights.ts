/**
 * Motor Compressor Replacement ROI — insight rules.
 *
 * 6 rules: payback attractiveness, npv signal, efficiency gap,
 * maintenance opportunity, confidence caveat, investment scale.
 */
import type { MotorCompressorOutputs, MotorCompressorInputs } from
  "@/sectorcalc/formulas/pro-v531/motor-compressor-replacement-roi.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: MotorCompressorOutputs, inp: MotorCompressorInputs) => boolean;
  severity: Severity;
  message: (out: MotorCompressorOutputs, inp: MotorCompressorInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "fast_payback",
    when: (o) => o.out_scenarioDelta <= 18,
    severity: "opp",
    message: (o, _i, cur) =>
      `Payback of ${o.out_scenarioDelta.toFixed(1)} months is under 18 months — ` +
      `strong investment candidate. Total investment: ${cur}${o.out_moneyAtRisk.toFixed(0)}. ` +
      `Consider fast-track approval.`,
  },
  {
    id: "moderate_payback",
    when: (o) => o.out_scenarioDelta > 18 && o.out_scenarioDelta <= 48,
    severity: "info",
    message: (o, _i, cur) =>
      `Payback of ${o.out_scenarioDelta.toFixed(1)} months is within the 48-month threshold. ` +
      `Annual savings: ${cur}${o.out_utilizationMargin.toFixed(0)}. ` +
      `Review discount rate sensitivity before proceeding.`,
  },
  {
    id: "long_payback",
    when: (o) => o.out_scenarioDelta > 48,
    severity: "crit",
    message: (o, _i, cur) =>
      `Payback of ${o.out_scenarioDelta.toFixed(1)} months exceeds 48-month threshold. ` +
      `Investment: ${cur}${o.out_moneyAtRisk.toFixed(0)}. ` +
      `Consider alternative efficiency measures or negotiate better pricing.`,
  },
  {
    id: "high_efficiency_gap",
    when: (o) => Math.abs(o.out_referenceDeviation) > 0.08,
    severity: "opp",
    message: (o) =>
      `Efficiency gap of ${(Math.abs(o.out_referenceDeviation) * 100).toFixed(1)} percentage points ` +
      `represents substantial energy-saving potential. Replacement yields significant ` +
      `kWh reduction and operating cost improvement.`,
  },
  {
    id: "maintenance_upside",
    when: (o, i) => i.maintenanceSavingPerYear > 0 && o.out_expandedUncertainty > 200,
    severity: "info",
    message: (_o, i, cur) =>
      `Maintenance savings of ${cur}${i.maintenanceSavingPerYear.toFixed(0)}/yr contribute ` +
      `meaningfully to total ROI. Include maintenance history in the business case.`,
  },
  {
    id: "low_confidence",
    when: (o) => o.out_evidenceCompleteness < 0.6,
    severity: "crit",
    message: (o) =>
      `Source confidence is ${(o.out_evidenceCompleteness * 100).toFixed(0)}% — below 60%. ` +
      `Obtain verified motor efficiency data and energy bills before final decision.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: MotorCompressorOutputs,
  inputs: MotorCompressorInputs,
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
