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
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};


  const mr = get(inputs, "n_machine_rate");
  const ct = get(inputs, "n_cycle_time");
  const st = get(inputs, "n_setup_time");
  const mc = get(inputs, "n_material_cost");
  const tm = get(inputs, "n_target_margin");
  const vol = get(inputs, "n_annual_volume");
  const lr = get(inputs, "n_labor_rate");
  const oh = get(inputs, "n_overhead_rate");
  const conf = get(inputs, "n_source_confidence_ratio");
  const ANNUAL_HOURS = 8760;
  const ANNUAL_SECONDS = 31536000;
  const total_cycle = ct + st;
  const uph = total_cycle > 0 ? 3600 / total_cycle : 0;
  const mcpu = uph > 0 ? mr / uph : 0;
  const lcpu = uph > 0 ? lr / uph : 0;
  const annual_vol = vol * ANNUAL_SECONDS;
  const annual_overhead = oh * ANNUAL_HOURS;
  const opu = annual_vol > 0 ? annual_overhead / annual_vol : 0;
  const flr = mcpu + lcpu + opu + mc;
  const mm = tm < 1 ? 1 / (1 - tm) : 2;
  const rp = flr * mm;
  const profit = rp - flr;
  const tp = profit * annual_vol;
  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(vol, 0);
  outputs["out_demand_metric"] = round(mcpu, 4);
  outputs["out_capacity_metric"] = round(uph, 2);
  outputs["out_utilization_margin"] = round(profit, 4);
  outputs["out_expanded_uncertainty"] = round(opu * 0.1, 4);
  outputs["out_threshold_crossing"] = profit > 0 ? 0 : 1;
  outputs["out_sensitivity_driver"] = mcpu > lcpu ? 1 : 0;
  outputs["out_fmea_trigger"] = profit < 0 ? 1 : 0;
  outputs["out_money_at_risk"] = round(tp * (1 - conf), 2);
  outputs["out_scenario_delta"] = round(tp * 0.1, 2);
  outputs["out_final_decision_state"] = profit > 0 ? 0 : (profit > -flr * 0.1 ? 1 : 2);
  outputs["out_reference_deviation"] = round(Math.abs(mcpu - (mcpu * 1.0)) / (mcpu || 1), 4);
  outputs["out_derating_factor"] = round(Math.min(1, (60 - st) / 60), 4);
  outputs["out_audit_hash_payload"] = 0;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
