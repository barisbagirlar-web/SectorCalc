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
export const formulaVersion = "5.3.1-pro-baris.2";

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

  // ── Spec: Deterministic Loss Map ───────────────────────────────────
  // DH = max(0, PH - AH)  — prevent negative downtime
  const downtime_hours = Math.max(0, ph - ah);
  // DC = DH × HR
  const downtime_cost = downtime_hours * hr;
  // SC = SQ × UC  (scrap material loss)
  const scrap_cost = sq * uc;
  // RC = RH × RR  (rework labour cost)
  const rework_cost = rh * rr;
  // TL = DC + SC + RC  (total gross loss)
  const total_loss = downtime_cost + scrap_cost + rework_cost;
  // UB = TL × (1 - SCR)  (uncertainty band)
  const uncertainty_band = total_loss * (1 - conf);
  // LR = TL / MC (loss ratio, MC > 0 guard)
  const loss_ratio = mc > 0 ? total_loss / mc : 0;

  const uptime_ratio = ph > 0 ? ah / ph : 0;

  // ── Spec: Decision Tree (Go / Review / Block) ──────────────────────
  // Block: LR > 0.10 OR SCR < 0.50
  const is_blocked = loss_ratio > 0.10 || conf < 0.50;
  // Review: LR > 0.05 OR SCR < 0.80  (and not blocked)
  const is_review = !is_blocked && (loss_ratio > 0.05 || conf < 0.80);
  let decision: number;
  if (is_blocked) decision = 2;
  else if (is_review) decision = 1;
  else decision = 0;

  // ── Pareto driver (0 = downtime, 1 = scrap, 2 = rework) ────────────
  let pareto_driver: number;
  if (downtime_cost > scrap_cost) {
    pareto_driver = downtime_cost > rework_cost ? 0 : 2;
  } else {
    pareto_driver = scrap_cost > rework_cost ? 1 : 2;
  }

  // ── Existing schema outputs (NO new keys) ──────────────────────────
  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(ph, 0);
  outputs["out_reference_deviation"] = round(drp / 100, 4);
  outputs["out_derating_factor"] = round(ph > 0 ? (ph - ah) / ph : 0, 4);
  outputs["out_demand_metric"] = round(downtime_cost, 2);
  outputs["out_capacity_metric"] = round(total_loss, 2);
  outputs["out_utilization_margin"] = round(uptime_ratio, 4);
  outputs["out_expanded_uncertainty"] = round(Math.abs(uncertainty_band), 2);
  outputs["out_threshold_crossing"] = decision > 0 ? 1 : 0;
  outputs["out_sensitivity_driver"] = pareto_driver;
  outputs["out_fmea_trigger"] = decision > 0 ? 1 : 0;
  outputs["out_money_at_risk"] = round(total_loss, 2);
  outputs["out_scenario_delta"] = round(Math.max(downtime_cost, scrap_cost, rework_cost) - Math.min(downtime_cost, scrap_cost, rework_cost), 2);
  outputs["out_audit_hash_payload"] = 0;
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return { status: ok ? "OK" : "REVIEW", outputs, warnings: warnings.length ? warnings : [], outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
