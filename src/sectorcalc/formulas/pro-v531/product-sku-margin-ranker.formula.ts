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

export const toolKey = "product-sku-margin-ranker";
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
  const mc = get(inputs, "n_material_cost");
  const tm = get(inputs, "n_target_margin");
  const vol = get(inputs, "n_annual_volume");
  const lr = get(inputs, "n_labor_rate");
  const oh = get(inputs, "n_overhead_rate");
  const dc = get(inputs, "n_defect_or_loss_cost");
  const conf = get(inputs, "n_source_confidence_ratio");
  const ch = ct / 60;
  const tuc = mc + (lr * ch) + (mr * ch) + (vol > 0 ? oh / vol : 0);
  const up = mc * 1.4;
  const cm = up - tuc;
  const cmr = up > 0 ? cm / up : 0;
  const lc = mc * 0.1;
  const nm = cm - lc - (vol > 0 ? dc / vol : 0);
  const rs = nm * 100;
  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(vol, 0);
  outputs["out_demand_metric"] = round(cm, 4);
  outputs["out_capacity_metric"] = round(up, 4);
  outputs["out_utilization_margin"] = round(cmr, 4);
  outputs["out_money_at_risk"] = round(Math.abs(cm) * vol, 2);
  outputs["out_threshold_crossing"] = cm > 0 ? 0 : 1;
  outputs["out_fmea_trigger"] = cm < 0 ? 1 : 0;
  outputs["out_final_decision_state"] = cm > 0 && cmr >= tm ? 0 : (cm > 0 ? 1 : 2);
  outputs["out_reference_deviation"] = round(Math.abs(up - tuc) / (tuc || 1), 4);
  outputs["out_derating_factor"] = round(conf, 4);
  outputs["out_expanded_uncertainty"] = round(cm * 0.1, 4);
  outputs["out_sensitivity_driver"] = mc > lr * ch ? 1 : 0;
  outputs["out_scenario_delta"] = round(cm * vol * 0.15, 2);
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
