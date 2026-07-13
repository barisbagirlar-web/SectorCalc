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
  const agw = lr * 2080;
  if (lr > 500) warnings.push("n_labor_rate exceeds 500 $/h, verify hourly rate");
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

  // Tool-specific output keys for true-employee-cost-statement
  const productive_hours_per_year = 2080;
  const billable_target_pct = 80;
  const base_salary = agw;
  const employer_tax_pct = 22.5;
  const benefits_cost = hi + rc + otb;
  const training_cost = tc;
  const equipment_cost = 0;
  const overhead_allocation = 0;
  const insurance_burden_val = agw * 0.02;
  const productive_hours = ph;
  const total_loaded = tec;
  const paid_leave_val = productive_hours_per_year * (1 - billable_target_pct / 100) * (base_salary / productive_hours_per_year);

  // Find primary cost driver (index of largest component)
  const costComponents = [
    base_salary,
    et,
    benefits_cost,
    paid_leave_val,
    training_cost,
    equipment_cost,
    overhead_allocation,
    insurance_burden_val,
  ];
  let primaryDriverIdx = 0;
  for (let i = 1; i < costComponents.length; i++) {
    if (costComponents[i] > costComponents[primaryDriverIdx]) {
      primaryDriverIdx = i;
    }
  }

  // Decision state: 0=normal, 1=elevated, 2=high
  const decisionState = br <= 1.2 ? 0 : br <= 1.5 ? 1 : 2;

  outputs["out_base_annual_compensation"] = round(base_salary, 2);
  outputs["out_employer_payroll_taxes"] = round(et, 2);
  outputs["out_benefits_cost"] = round(benefits_cost, 2);
  outputs["out_paid_leave_cost"] = round(paid_leave_val, 2);
  outputs["out_training_allocation"] = round(training_cost, 2);
  outputs["out_equipment_it_cost"] = round(equipment_cost, 2);
  outputs["out_workspace_facility_cost"] = round(overhead_allocation, 2);
  outputs["out_insurance_burden"] = round(insurance_burden_val, 2);
  outputs["out_fully_loaded_annual_cost"] = round(total_loaded, 2);
  outputs["out_monthly_employer_cost"] = round(total_loaded / 12, 2);
  outputs["out_productive_hours_annual"] = round(productive_hours, 1);
  outputs["out_productive_hourly_cost"] = round(hec, 2);
  outputs["out_base_to_loaded_multiplier"] = round(br, 4);
  outputs["out_primary_cost_driver"] = primaryDriverIdx;
  outputs["out_decision_state"] = decisionState;

  // Preserved generic outputs for backward compatibility
  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_expanded_uncertainty"] = round(tec * (1 - conf), 2);
  outputs["out_threshold_crossing"] = br > 1.5 ? 1 : 0;
  outputs["out_fmea_trigger"] = br > 2.0 ? 1 : 0;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
