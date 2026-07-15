/**
 * Machine Hourly Rate Proof Report — insight rules.
 *
 * Consumes the out_-prefixed keys from executeFormula() output.
 * 5 rules, independently firing (no mutex groups).
 *
 * Verified: 8/8 semantic tests — each rule fires only in its
 * intended scenario; a balanced baseline fires nothing.
 */
import type { MachineHourlyRateOutputs, MachineHourlyRateInputs } from
  "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";

export type Severity = "crit" | "opp" | "info";

export interface InsightRule {
  id: string;
  when: (out: MachineHourlyRateOutputs, inp: MachineHourlyRateInputs) => boolean;
  severity: Severity;
  message: (out: MachineHourlyRateOutputs, inp: MachineHourlyRateInputs, cur: string) => string;
}

export const INSIGHTS: InsightRule[] = [
  {
    id: "idle_burden",
    when: (o) => Number.isFinite(o.out_premium) && o.out_premium / o.out_rate > 0.15,
    severity: "crit",
    message: (o, _i, cur) =>
      `${((100 * o.out_premium) / o.out_rate).toFixed(0)}% of your hourly rate finances idle ` +
      `capacity (${cur}${o.out_premium.toFixed(2)}/h). Quoting on the naive rate of ` +
      `${cur}${o.out_naive.toFixed(2)}/h loses that amount on every productive hour. Cutting idle ` +
      `share by 5 points is worth more than most price negotiations.`,
  },
  {
    id: "energy_high",
    when: (o) => o.out_energyShare > 0.15,
    severity: "opp",
    message: (o, _i, cur) =>
      `Energy is ${(o.out_energyShare * 100).toFixed(1)}% of total cost ` +
      `(${cur}${o.out_energy.toFixed(0)}/yr) \u2014 well above a typical ~5\u201310% share. A motor ` +
      `efficiency audit or load-shifting review is worth investigating.`,
  },
  {
    id: "labor_dominant",
    when: (o) => o.out_laborShare > 0.60,
    severity: "info",
    message: (o) =>
      `Labor is ${(o.out_laborShare * 100).toFixed(0)}% of the cost base \u2014 this rate is ` +
      `wage-driven. Multi-machine tending or automation moves the needle here, not purchase-price negotiation.`,
  },
  {
    id: "capital_light",
    when: (o) => o.out_capitalShare < 0.15,
    severity: "info",
    message: (o) =>
      `Capital is only ${(o.out_capitalShare * 100).toFixed(0)}% of cost \u2014 this machine is ` +
      `cheap to own, expensive to run. Uptime and labor efficiency matter far more than the price you negotiated.`,
  },
  {
    id: "near_cap_hours",
    when: (_o, i) => i.annualHours > 6000,
    severity: "info",
    message: (_o, i) =>
      `${i.annualHours.toLocaleString()} planned hours/year is 3-shift territory. Confirm ` +
      `maintenance windows are excluded from "planned" hours \u2014 a common source of 5\u20138% silent rate error.`,
  },
];

/** Get all insights that fire for the given computation. */
export function getActiveInsights(
  outputs: MachineHourlyRateOutputs,
  inputs: MachineHourlyRateInputs,
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
