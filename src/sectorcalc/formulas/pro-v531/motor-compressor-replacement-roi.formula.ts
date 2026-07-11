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

export const toolKey = "motor-compressor-replacement-roi";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function safeDiv(n: number, d: number): number { if (!isFiniteNumber(n) || !isFiniteNumber(d) || Math.abs(d) < 1e-12) return 0; return n / d; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const requiredKeys = [
    "n_current_power_kw",
    "n_proposed_power_kw",
    "n_annual_operating_hours",
    "n_energy_price_per_kwh",
    "n_current_maintenance_cost",
    "n_proposed_maintenance_cost",
    "n_replacement_cost",
    "n_useful_life_years",
    "n_discount_rate",
  ];

  for (const key of requiredKeys) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  const current_power = Math.max(0, get(inputs, "n_current_power_kw"));
  const proposed_power = Math.max(0, get(inputs, "n_proposed_power_kw"));
  const annual_hours = Math.max(0, get(inputs, "n_annual_operating_hours"));
  const energy_price = Math.max(0, get(inputs, "n_energy_price_per_kwh"));
  const current_maint = Math.max(0, get(inputs, "n_current_maintenance_cost"));
  const proposed_maint = Math.max(0, get(inputs, "n_proposed_maintenance_cost"));
  const replacement_cost = Math.max(0, get(inputs, "n_replacement_cost"));
  const life_years = Math.max(1, Math.round(get(inputs, "n_useful_life_years")));
  const discount_rate = Math.max(0, get(inputs, "n_discount_rate")) / 100;

  // Baseline (current motor) energy consumption
  const baseline_energy_kwh = current_power * annual_hours;
  const baseline_energy_cost = baseline_energy_kwh * energy_price;

  // Proposed (new motor) energy consumption
  const proposed_energy_kwh = proposed_power * annual_hours;
  const proposed_energy_cost = proposed_energy_kwh * energy_price;

  // Energy saving
  const annual_energy_saving = baseline_energy_cost - proposed_energy_cost;

  // Maintenance saving
  const maintenance_saving = current_maint - proposed_maint;

  // Total annual financial saving
  const annual_financial_saving = annual_energy_saving + maintenance_saving;

  // Simple payback
  const simple_payback_years = annual_financial_saving > 0
    ? replacement_cost / annual_financial_saving
    : life_years; // never pays back

  // ROI
  const total_saving_over_life = annual_financial_saving * life_years;
  const roi_percent = replacement_cost > 0
    ? ((total_saving_over_life - replacement_cost) / replacement_cost) * 100
    : 0;

  // NPV
  let npv = -replacement_cost;
  for (let y = 1; y <= life_years; y++) {
    npv += safeDiv(annual_financial_saving, Math.pow(1 + discount_rate, y));
  }

  // Energy price sensitivity: if energy price rises 10%, how does NPV change?
  const sensitivity_energy_price = energy_price * 1.1;
  const sensitivity_baseline_cost = baseline_energy_kwh * sensitivity_energy_price;
  const sensitivity_proposed_cost = proposed_energy_kwh * sensitivity_energy_price;
  const sensitivity_saving = (sensitivity_baseline_cost - sensitivity_proposed_cost) + maintenance_saving;
  let sensitivity_npv = -replacement_cost;
  for (let y = 1; y <= life_years; y++) {
    sensitivity_npv += safeDiv(sensitivity_saving, Math.pow(1 + discount_rate, y));
  }
  const energy_price_sensitivity = sensitivity_npv - npv;

  // Primary saving driver: 0=energy, 1=maintenance
  const primary_saving_driver = annual_energy_saving >= maintenance_saving ? 0 : 1;

  // Decision state
  let decision: number;
  if (simple_payback_years <= 3 && npv > 0) {
    decision = 0; // GOOD — strong replacement case
  } else if (simple_payback_years <= life_years && npv > 0) {
    decision = 1; // REVIEW — pays back but marginal
  } else {
    decision = 2; // BLOCKED — does not pay back or negative NPV
  }

  outputs["out_baseline_energy_kwh"] = round(baseline_energy_kwh, 0);
  outputs["out_baseline_energy_cost"] = round(baseline_energy_cost, 2);
  outputs["out_proposed_energy_kwh"] = round(proposed_energy_kwh, 0);
  outputs["out_proposed_energy_cost"] = round(proposed_energy_cost, 2);
  outputs["out_annual_energy_saving"] = round(annual_energy_saving, 2);
  outputs["out_maintenance_saving"] = round(maintenance_saving, 2);
  outputs["out_annual_financial_saving"] = round(annual_financial_saving, 2);
  outputs["out_replacement_cost"] = round(replacement_cost, 2);
  outputs["out_simple_payback_years"] = round(simple_payback_years, 2);
  outputs["out_roi_percent"] = round(roi_percent, 2);
  outputs["out_npv"] = round(npv, 2);
  outputs["out_energy_price_sensitivity"] = round(energy_price_sensitivity, 2);
  outputs["out_primary_saving_driver"] = primary_saving_driver;
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
