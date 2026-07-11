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

export const toolKey = "energy-efficiency-grant-incentive-feasibility-pack";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function safeDiv(n: number, d: number): number { if (!isFiniteNumber(n) || !isFiniteNumber(d) || Math.abs(d) < 1e-12) return 0; return n / d; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const requiredKeys = [
    "n_baseline_energy_consumption_kwh",
    "n_baseline_energy_price_per_kwh",
    "n_projected_saving_pct",
    "n_gross_project_cost",
    "n_eligible_project_cost",
    "n_grant_incentive_amount",
    "n_annual_maintenance_cost",
    "n_useful_life_years",
    "n_discount_rate",
    "n_energy_price_escalation_pct",
  ];

  for (const key of requiredKeys) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  const baseline_kwh = Math.max(0, get(inputs, "n_baseline_energy_consumption_kwh"));
  const energy_price = Math.max(0, get(inputs, "n_baseline_energy_price_per_kwh"));
  const saving_pct = Math.max(0, Math.min(100, get(inputs, "n_projected_saving_pct")));
  const gross_project_cost = Math.max(0, get(inputs, "n_gross_project_cost"));
  const eligible_project_cost = Math.max(0, get(inputs, "n_eligible_project_cost"));
  const grant_incentive = Math.max(0, get(inputs, "n_grant_incentive_amount"));
  const annual_maint_cost = Math.max(0, get(inputs, "n_annual_maintenance_cost"));
  const useful_life = Math.max(1, Math.round(get(inputs, "n_useful_life_years")));
  const discount_rate = Math.max(0, get(inputs, "n_discount_rate")) / 100;
  const price_escalation_pct = Math.max(0, get(inputs, "n_energy_price_escalation_pct"));

  // Baseline energy cost
  const baseline_energy_cost = baseline_kwh * energy_price;

  // Projected energy saving (kwh)
  const kwh_saving = baseline_kwh * (saving_pct / 100);

  // Energy cost saving with price escalation
  let annual_saving = 0;
  for (let y = 1; y <= useful_life; y++) {
    const escalated_price = energy_price * Math.pow(1 + (price_escalation_pct / 100), y - 1);
    annual_saving += kwh_saving * escalated_price;
  }
  const annual_saving_avg = safeDiv(annual_saving, useful_life);

  // Grant analysis
  const grant_amount = Math.min(grant_incentive, eligible_project_cost);
  const net_investment = gross_project_cost - grant_amount;

  // Simple payback
  const simple_payback_years = annual_saving_avg > 0
    ? net_investment / annual_saving_avg
    : useful_life;

  // ROI
  const total_saving = annual_saving; // already summed over useful life
  const net_cost_for_roi = net_investment + (annual_maint_cost * useful_life);
  const roi_percent = net_cost_for_roi > 0
    ? ((total_saving - net_cost_for_roi) / net_cost_for_roi) * 100
    : 0;

  // NPV
  let npv = -net_investment;
  for (let y = 1; y <= useful_life; y++) {
    const escalated_price = energy_price * Math.pow(1 + (price_escalation_pct / 100), y - 1);
    const year_saving = kwh_saving * escalated_price - annual_maint_cost;
    npv += safeDiv(year_saving, Math.pow(1 + discount_rate, y));
  }

  // Grant dependency: what % of gross project cost is covered by grant
  const grant_dependency_pct = gross_project_cost > 0
    ? (grant_amount / gross_project_cost) * 100
    : 0;

  // Energy price sensitivity: +10% energy price impact on annual saving
  const sensitivity_price = energy_price * 1.1;
  const sensitivity_saving = kwh_saving * sensitivity_price;
  const energy_price_sensitivity = sensitivity_saving - annual_saving_avg;

  // Implementation risk score (0-100): based on payback and grant dependency
  // Lower payback = lower risk; higher grant dependency = lower risk
  const payback_risk = Math.min(100, (simple_payback_years / useful_life) * 100);
  const grant_benefit = grant_dependency_pct * 0.5; // grant reduces risk
  const implementation_risk_score = Math.max(0, Math.min(100, payback_risk - grant_benefit));

  // Decision state
  let decision: number;
  if (npv > 0 && simple_payback_years <= useful_life * 0.3) {
    decision = 0; // GOOD — strong feasibility
  } else if (npv > 0 || simple_payback_years <= useful_life * 0.6) {
    decision = 1; // REVIEW — marginal feasibility
  } else {
    decision = 2; // BLOCKED — poor feasibility
  }

  outputs["out_baseline_energy_cost"] = round(baseline_energy_cost, 2);
  outputs["out_projected_energy_saving"] = round(kwh_saving, 0);
  outputs["out_gross_project_cost"] = round(gross_project_cost, 2);
  outputs["out_eligible_project_cost"] = round(eligible_project_cost, 2);
  outputs["out_grant_amount"] = round(grant_amount, 2);
  outputs["out_net_investment"] = round(net_investment, 2);
  outputs["out_annual_saving"] = round(annual_saving_avg, 2);
  outputs["out_simple_payback_years"] = round(simple_payback_years, 2);
  outputs["out_roi_percent"] = round(roi_percent, 2);
  outputs["out_npv"] = round(npv, 2);
  outputs["out_grant_dependency_pct"] = round(grant_dependency_pct, 2);
  outputs["out_energy_price_sensitivity"] = round(energy_price_sensitivity, 2);
  outputs["out_implementation_risk_score"] = round(implementation_risk_score, 1);
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
