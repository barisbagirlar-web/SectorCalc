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

export const toolKey = "loss-making-job-detector";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};


  const mr = get(inputs, "n_machine_rate");
  const mc = get(inputs, "n_material_cost");
  const lr = get(inputs, "n_labor_rate");
  const oh = get(inputs, "n_overhead_rate");
  const dc = get(inputs, "n_defect_or_loss_cost");
  const tm = get(inputs, "n_target_margin");
  const bq = get(inputs, "n_batch_quantity");
  const vol = get(inputs, "n_annual_volume");
  const conf = get(inputs, "n_source_confidence_ratio");
  const total_cost = mr + mc + lr + oh + dc;
  const price = mr * bq;
  const gm = price - total_cost;
  const cm = price > 0 ? gm / price : 0;
  const map = total_cost * (1 + tm);
  const loss = gm < 0 ? Math.abs(gm) : 0;
  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(price, 2);
  outputs["out_demand_metric"] = round(gm, 2);
  outputs["out_capacity_metric"] = round(map, 2);
  outputs["out_utilization_margin"] = round(cm, 4);
  outputs["out_money_at_risk"] = round(loss * vol, 2);
  outputs["out_threshold_crossing"] = cm >= tm ? 0 : 1;
  outputs["out_fmea_trigger"] = loss > 0 ? 1 : 0;
  outputs["out_final_decision_state"] = cm >= tm ? 0 : (cm > 0 ? 1 : 2);


  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
