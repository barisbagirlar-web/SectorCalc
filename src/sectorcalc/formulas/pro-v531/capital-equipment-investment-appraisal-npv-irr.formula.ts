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

export const toolKey = "capital-equipment-investment-appraisal-npv-irr";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};


  const capex = get(inputs, "n_initial_investment");
  const cf = get(inputs, "n_annual_net_cash_flow");
  const dr = get(inputs, "n_discount_rate") / 100;
  const yrs = Math.max(1, Math.round(get(inputs, "n_analysis_years")));
  const rv = get(inputs, "n_residual_value");
  const stress = get(inputs, "n_stress_downside_factor");
  const conf = get(inputs, "n_source_confidence_ratio");
  const acf = cf + rv / yrs;
  let npv = -capex;
  for (let y = 1; y <= yrs; y++) npv += acf / Math.pow(1 + dr, y);
  npv += rv / Math.pow(1 + dr, yrs);
  let irr_guess = 0.1;
  for (let iter = 0; iter < 50; iter++) {
    let npv_at = -capex;
    for (let y = 1; y <= yrs; y++) npv_at += acf / Math.pow(1 + irr_guess, y);
    npv_at += rv / Math.pow(1 + irr_guess, yrs);
    if (Math.abs(npv_at) < 0.01) break;
    irr_guess += Math.sign(-npv_at) * 0.005;
  }
  let pb = 0, cum = -capex;
  for (let y = 1; y <= yrs; y++) {
    cum += acf; if (cum >= 0) { pb = y - (cum - acf) / acf; break; }
  }
  const pi = capex > 0 ? (npv + capex) / capex : 0;
  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(cf, 2);
  outputs["out_demand_metric"] = round(npv, 2);
  outputs["out_capacity_metric"] = round(pb, 2);
  outputs["out_utilization_margin"] = round(irr_guess, 4);
  outputs["out_money_at_risk"] = round(Math.abs(npv) * (1 - stress), 2);
  outputs["out_threshold_crossing"] = npv > 0 ? 0 : 1;
  outputs["out_fmea_trigger"] = npv <= 0 ? 1 : 0;
  outputs["out_scenario_delta"] = round(npv * 0.2, 2);
  outputs["out_final_decision_state"] = npv > 0 && irr_guess > dr ? 0 : (npv > 0 ? 1 : 2);


  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
