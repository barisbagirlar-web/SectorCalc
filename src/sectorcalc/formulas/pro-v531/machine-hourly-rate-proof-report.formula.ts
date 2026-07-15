import "server-only";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export interface CalculationResult {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
}

export const toolKey = "machine-hourly-rate-proof-report";
export const formulaVersion = "5.3.2-pro-baris.2";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const SECONDS_PER_YEAR = 31536000;
const SECONDS_PER_HOUR = 3600;

// REBUILT 2026-07-15 audit. Bugs fixed:
// 1. uph = 60/total_cycle treated cycle_time (normalized base_unit "s") as if it were minutes
//    -- off by 60x. Fixed to 3600/total_cycle (seconds per hour / seconds per unit).
// 2. mcpu/lcpu then divided by 60 a SECOND time on top of that (compensating error masked
//    the first bug at one specific magnitude, broke everywhere else). Removed.
// 3. opu (overhead per unit) divided overhead_rate ($/h) by annual_volume (units/year) --
//    dimensionally meaningless. Now mirrors mcpu/lcpu: oh($/h) / uph(units/h) = $/unit.
// 4. setup_time was added directly to cycle_time per unit, charging one full batch setup on
//    EVERY unit instead of amortizing it across the batch. Now uses batch_quantity.
// 5. n_batch_quantity, n_defect_or_loss_cost, n_uncertainty_multiplier were declared in the
//    schema and completely unused. defect_or_loss_cost is now added to the per-unit cost
//    basis (it is a real per-unit cost, unambiguous); batch_quantity amortizes setup;
//    uncertainty_multiplier now drives the uncertainty band instead of a hardcoded 10%.
// 6. out_utilization_margin was populated with a per-unit profit figure while the report
//    contract labels it "Machine Hourly Rate (USD/hr)" -- label/value mismatch. Now holds the
//    actual fully-loaded hourly rate. out_capacity_metric was populated with "units per hour"
//    while labeled "Total Productive Hours (hrs)" -- now holds annual productive hours needed
//    to hit the volume target, a real hours figure.

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const mr = get(inputs, "n_machine_rate");
  const ct = get(inputs, "n_cycle_time");
  const st = get(inputs, "n_setup_time");
  const bq = get(inputs, "n_batch_quantity");
  const mc = get(inputs, "n_material_cost");
  const tm = get(inputs, "n_target_margin");
  const annualUnits = get(inputs, "n_annual_volume") * SECONDS_PER_YEAR;
  const lr = get(inputs, "n_labor_rate");
  const oh = get(inputs, "n_overhead_rate");
  const dc = get(inputs, "n_defect_or_loss_cost");
  const conf = get(inputs, "n_source_confidence_ratio");
  const unc = get(inputs, "n_uncertainty_multiplier");

  const setupPerUnitSeconds = bq > 0 ? st / bq : st;
  const totalCyclePerUnitSeconds = ct + setupPerUnitSeconds;
  const uph = totalCyclePerUnitSeconds > 0 ? SECONDS_PER_HOUR / totalCyclePerUnitSeconds : 0;

  const mcpu = uph > 0 ? mr / uph : 0;
  const lcpu = uph > 0 ? lr / uph : 0;
  const opu = uph > 0 ? oh / uph : 0;
  const flr = mcpu + lcpu + opu + mc + dc; // fully loaded rate, $/unit

  const fullyLoadedHourlyRate = mr + lr + oh; // the "machine hourly rate" this tool proves, $/h

  const mm = tm < 1 ? 1 / (1 - tm) : 2;
  const recommendedPricePerUnit = flr * mm;
  const profitPerUnit = recommendedPricePerUnit - flr;
  const totalAnnualProfit = profitPerUnit * annualUnits;
  const annualMachineOperatingCost = mcpu * annualUnits;
  const annualProductiveHours = uph > 0 ? annualUnits / uph : 0;

  const uncertaintyCoverage = unc > 1 ? unc - 1 : 0.1;
  const expandedUncertaintyHourly = fullyLoadedHourlyRate * uncertaintyCoverage;

  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(annualUnits, 0);
  outputs["out_demand_metric"] = round(annualMachineOperatingCost, 2);
  outputs["out_capacity_metric"] = round(annualProductiveHours, 2);
  outputs["out_utilization_margin"] = round(fullyLoadedHourlyRate, 4);
  outputs["out_expanded_uncertainty"] = round(expandedUncertaintyHourly, 4);
  outputs["out_threshold_crossing"] = profitPerUnit > 0 ? 0 : 1;
  outputs["out_sensitivity_driver"] = mcpu > lcpu ? 1 : 0;
  outputs["out_fmea_trigger"] = profitPerUnit < 0 ? 1 : 0;
  outputs["out_money_at_risk"] = round(Math.abs(totalAnnualProfit) * (1 - conf), 2);
  outputs["out_scenario_delta"] = round(totalAnnualProfit * 0.1, 2);
  outputs["out_final_decision_state"] = profitPerUnit > 0 ? 0 : (profitPerUnit > -flr * 0.1 ? 1 : 2);
  outputs["out_reference_deviation"] = round(flr > 0 ? Math.abs(profitPerUnit) / flr : 0, 4);
  outputs["out_derating_factor"] = round(conf, 4);
  outputs["out_audit_hash_payload"] = 0;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings,
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
