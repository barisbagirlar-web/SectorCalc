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

export const toolKey = "setup-time-reduction-roi-smed";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};


  const mr = get(inputs, "n_machine_rate");
  const st = get(inputs, "n_setup_time");
  const bq = get(inputs, "n_batch_quantity");
  const vol = get(inputs, "n_annual_volume");
  const lr = get(inputs, "n_labor_rate");
  const oh = get(inputs, "n_overhead_rate");
  const conf = get(inputs, "n_source_confidence_ratio");
  const saved = st * 0.5;
  const ac = bq > 0 ? vol * 31536000 / bq : 0;
  const ahr = saved * ac / 3600;
  const acv = ahr * (mr - lr);
  const ass = saved * ac / 3600 * mr;
  const ic = oh > 0 ? oh * 0.3 : 50000;
  const pbm = ass > 0 ? (ic / ass) * 12 : 999;
  const roi = ic > 0 ? (ass / ic) * 100 : 0;
  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(ahr, 1);
  outputs["out_demand_metric"] = round(ass, 2);
  outputs["out_capacity_metric"] = round(acv, 2);
  outputs["out_utilization_margin"] = round(roi / 100, 4);
  outputs["out_money_at_risk"] = round(ic, 2);
  outputs["out_threshold_crossing"] = roi > 50 ? 0 : 1;
  outputs["out_fmea_trigger"] = pbm > 24 ? 1 : 0;
  outputs["out_final_decision_state"] = pbm < 12 ? 0 : (pbm <= 24 ? 1 : 2);
  outputs["out_reference_deviation"] = round(Math.abs(st - saved) / (st || 1), 4);
  outputs["out_derating_factor"] = round(conf, 4);
  outputs["out_expanded_uncertainty"] = round(Math.abs(ass * (1 - conf)), 4);
  outputs["out_sensitivity_driver"] = ass > ic ? 1 : 0;
  outputs["out_scenario_delta"] = round(Math.abs(ass * (1 - conf)), 2);
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
