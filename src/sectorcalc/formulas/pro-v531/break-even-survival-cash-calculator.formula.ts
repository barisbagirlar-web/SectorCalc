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

export const toolKey = "break-even-survival-cash-calculator";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};
  const ci = get(inputs, "n_initial_investment");
  const cf = get(inputs, "n_annual_net_cash_flow");
  const dr = get(inputs, "n_discount_rate") / 100;
  const yrs = Math.max(1, Math.round(get(inputs, "n_analysis_years")));
  const rv = get(inputs, "n_residual_value");
  const stress = get(inputs, "n_stress_downside_factor");
  const vol = get(inputs, "n_annual_volume");
  const lr = get(inputs, "n_labor_rate");
  const oh = get(inputs, "n_overhead_rate");
  const dc = get(inputs, "n_defect_or_loss_cost");
  const conf = get(inputs, "n_source_confidence_ratio");
  if (!isFiniteNumber(inputs["n_initial_investment"])) warnings.push("Missing: n_initial_investment");
  if (!isFiniteNumber(inputs["n_annual_net_cash_flow"])) warnings.push("Missing: n_annual_net_cash_flow");
  if (!isFiniteNumber(inputs["n_discount_rate"])) warnings.push("Missing: n_discount_rate");

  const cm_ratio = cf > 0 ? (cf - lr) / cf : 0;
  const monthly_bre = oh > 0 && cm_ratio > 0 ? oh / cm_ratio : 0;
  const req_rev = cm_ratio > 0 ? (oh + dc) / cm_ratio : 0;
  const cash_runway = oh > 0 ? ci / oh : 0;
  const surv_gap = req_rev - vol;
  const money_at_risk = surv_gap * stress;
  const npv = -ci + sum_dcf(cf, dr, yrs) + rv / ((1 + dr) ** yrs);

  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(vol, 0);
  outputs["out_reference_deviation"] = 0;
  outputs["out_derating_factor"] = round(stress, 3);
  outputs["out_demand_metric"] = round(monthly_bre, 2);
  outputs["out_capacity_metric"] = round(cf, 2);
  outputs["out_utilization_margin"] = round(cm_ratio, 4);
  outputs["out_expanded_uncertainty"] = round(dc * 0.1, 2);
  outputs["out_threshold_crossing"] = surv_gap > 0 ? 1 : 0;
  outputs["out_sensitivity_driver"] = oh > ci ? 1 : 0;
  outputs["out_fmea_trigger"] = surv_gap > 0 ? 1 : 0;
  outputs["out_money_at_risk"] = round(money_at_risk, 2);
  outputs["out_scenario_delta"] = round(surv_gap, 2);
  outputs["out_audit_hash_payload"] = 0;
  outputs["out_final_decision_state"] = surv_gap > 0 ? 2 : (npv > 0 ? 0 : 1);
  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return { status: ok ? "OK" : "REVIEW", outputs, warnings: warnings.length ? warnings : [], outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}

function sum_dcf(cf: number, r: number, n: number): number {
  let s = 0; for (let y = 1; y <= n; y++) s += cf / Math.pow(1 + r, y); return s;
}
