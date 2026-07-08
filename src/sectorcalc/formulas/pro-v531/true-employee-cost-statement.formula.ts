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

export const toolKey = "true-employee-cost-statement";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};


  const lr = get(inputs, "n_labor_rate");
  const oh = get(inputs, "n_overhead_rate");
  const conf = get(inputs, "n_source_confidence_ratio");
  const agw = lr > 100 ? lr : lr * 2080;
  if (lr < 100) warnings.push("n_labor_rate expected as annual salary, treated as hourly");
  const etr = 0.225;
  const et = agw * etr;
  const hi = 5000;
  const rc = agw * 0.05;
  const plc = agw * 0.08;
  const otb = agw * 0.03;
  const tc = 2000;
  const tec = agw + et + hi + rc + plc + otb + tc;
  const ph = 2080 * 0.8;
  const hec = tec / ph;
  const br = tec / agw;
  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(agw, 2);
  outputs["out_capacity_metric"] = round(tec, 2);
  outputs["out_utilization_margin"] = round(br, 4);
  outputs["out_demand_metric"] = round(hec, 2);
  outputs["out_threshold_crossing"] = br > 1.5 ? 1 : 0;
  outputs["out_fmea_trigger"] = br > 2.0 ? 1 : 0;
  outputs["out_money_at_risk"] = round(tec - agw, 2);
  outputs["out_final_decision_state"] = br <= 1.5 ? 0 : 1;


  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
