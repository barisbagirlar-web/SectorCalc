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

export const toolKey = "machine-investment-feasibility-buy-lease-keep";
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
  const lr = get(inputs, "n_labor_rate");
  const oh = get(inputs, "n_overhead_rate");
  const conf = get(inputs, "n_source_confidence_ratio");
  const am = oh * 0.2;
  const alp = capex * 0.25;
  let nb = -capex, nl = 0, nk = 0;
  const asb = cf - am;
  for (let y = 1; y <= yrs; y++) {
    const d = Math.pow(1 + dr, y);
    nb += asb / d; nl += (cf - alp) / d; nk += (cf * 0.5) / d;
  }
  nb += rv / Math.pow(1 + dr, yrs);
  nl += rv * 0.3 / Math.pow(1 + dr, yrs);
  const max = Math.max(nb, nl, nk);
  const dec = max <= 0 ? 3 : (nb >= nl && nb >= nk ? 0 : (nl >= nb && nl >= nk ? 1 : 2));
  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(cf, 2);
  outputs["out_demand_metric"] = round(nb, 2);
  outputs["out_capacity_metric"] = round(nl, 2);
  outputs["out_utilization_margin"] = round(nk, 2);
  outputs["out_money_at_risk"] = round(Math.abs(max) * (1 - stress), 2);
  outputs["out_threshold_crossing"] = max > 0 ? 0 : 1;
  outputs["out_fmea_trigger"] = max <= 0 ? 1 : 0;
  outputs["out_final_decision_state"] = dec;


  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
