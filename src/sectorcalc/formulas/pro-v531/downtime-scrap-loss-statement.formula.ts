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

export const toolKey = "downtime-scrap-loss-statement";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const ph = get(inputs, "n_productive_hours");
  const ah = get(inputs, "n_actual_hours");
  const hr = get(inputs, "n_hourly_rate");
  const sq = get(inputs, "n_scrap_quantity");
  const uc = get(inputs, "n_unit_cost");
  const rh = get(inputs, "n_rework_hours");
  const rr = get(inputs, "n_rework_rate");
  const mc = get(inputs, "n_material_cost");
  const drp = get(inputs, "n_defect_rate_pct");
  const conf = get(inputs, "n_source_confidence_ratio");

  if (!isFiniteNumber(inputs["n_productive_hours"])) warnings.push("Missing: n_productive_hours");
  if (!isFiniteNumber(inputs["n_actual_hours"])) warnings.push("Missing: n_actual_hours");
  if (!isFiniteNumber(inputs["n_hourly_rate"])) warnings.push("Missing: n_hourly_rate");

  // GUARD (2026-07-16 audit): Actual Hours cannot exceed Productive Hours -- that would imply
  // negative downtime, which is not physically possible and previously produced a negative
  // downtime_cost (money the shop supposedly "made" from downtime). Clamp to zero and flag
  // for review instead of silently returning a nonsensical negative loss figure.
  let ah_capped = ah;
  if (ah > ph) {
    warnings.push("Actual Hours exceeds Productive Hours; downtime clamped to 0 and flagged for review.");
    ah_capped = ph;
  }
  const downtime_hours = ph - ah_capped;
  const downtime_cost = downtime_hours * hr;
  const scrap_material_loss = sq * uc;
  const rework_loss = rh * rr;
  const total_loss = downtime_cost + scrap_material_loss + rework_loss;
  const defect_per_unit = sq > 0 ? scrap_material_loss / sq : 0;
  const uptime_ratio = ph > 0 ? ah / ph : 0;
  let pareto_driver: number;
  if (downtime_cost > scrap_material_loss) {
    pareto_driver = downtime_cost > rework_loss ? 0 : 2;
  } else {
    pareto_driver = scrap_material_loss > rework_loss ? 1 : 2;
  }

  let decision: number;
  if (total_loss < mc * 0.05) decision = 0;       // OK
  else if (total_loss < mc * 0.15) decision = 1;  // REVIEW
  else decision = 2;                               // ESCALATE

  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(ph, 0);
  outputs["out_reference_deviation"] = round(drp, 4); // NOTE (2026-07-15 audit): drp is now normalized ratio (percent option added to schema); removed redundant /100
  outputs["out_derating_factor"] = round(ph > 0 ? downtime_hours / ph : 0, 4);
  outputs["out_demand_metric"] = round(downtime_cost, 2);
  outputs["out_capacity_metric"] = round(total_loss, 2);
  outputs["out_utilization_margin"] = round(uptime_ratio, 4);
  outputs["out_expanded_uncertainty"] = round(total_loss * 0.1, 2);
  outputs["out_threshold_crossing"] = decision > 0 ? 1 : 0;
  outputs["out_sensitivity_driver"] = pareto_driver;
  outputs["out_fmea_trigger"] = decision > 0 ? 1 : 0;
  outputs["out_money_at_risk"] = round(total_loss, 2);
  outputs["out_scenario_delta"] = round(Math.max(downtime_cost, scrap_material_loss, rework_loss) - Math.min(downtime_cost, scrap_material_loss, rework_loss), 2);
  outputs["out_audit_hash_payload"] = 0;
  outputs["out_downtime_cost_component"] = round(downtime_cost, 2);
  outputs["out_scrap_cost_component"] = round(scrap_material_loss, 2);
  outputs["out_rework_cost_component"] = round(rework_loss, 2);
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  const status: CalculationStatus = !ok ? "REVIEW" : (ah > ph ? "REVIEW" : "OK");
  return { status, outputs, warnings: warnings.length ? warnings : [], outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
