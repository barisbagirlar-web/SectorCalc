import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export interface CalculationResult {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
}

export const toolKey = "receivables-cost-payment-term-addendum";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};


  const mr = get(inputs, "n_machine_rate");
  const ct = get(inputs, "n_cycle_time");
  const mc = get(inputs, "n_material_cost");
  const bq = get(inputs, "n_batch_quantity");
  const oh = get(inputs, "n_overhead_rate");
  const dc = get(inputs, "n_defect_or_loss_cost");
  const conf = get(inputs, "n_source_confidence_ratio");
  const ra = (mr * ct / 60) * bq + mc * bq;
  const fr = Math.min(Math.max(0.02, oh / mr / 100), 0.25);
  const fc = ra * fr * 60 / 365;
  const ap = ra > 0 ? fc / ra : 0;
  const rp = dc * 0.15;
  const tfc = fc + rp;
  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(ra, 2);
  outputs["out_demand_metric"] = round(fc, 2);
  outputs["out_capacity_metric"] = round(ra + tfc, 2);
  outputs["out_utilization_margin"] = round(ap, 4);
  outputs["out_money_at_risk"] = round(tfc, 2);
  outputs["out_threshold_crossing"] = ap > 0.05 ? 1 : 0;
  outputs["out_fmea_trigger"] = ap > 0.10 ? 1 : 0;
  outputs["out_final_decision_state"] = ap <= 0.05 ? 0 : (ap <= 0.10 ? 1 : 2);


  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
