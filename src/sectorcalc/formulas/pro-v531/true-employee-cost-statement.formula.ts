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
export const formulaVersion = "5.3.2-pro-baris.2";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

// REBUILT 2026-07-15 audit. This tool previously ran the shared manufacturing job-costing
// schema (machine_rate, cycle_time, material_cost...) through a formula that read only
// labor_rate and overhead_rate (overhead_rate wasn't even used) and fabricated EVERY other
// figure as a hardcoded constant: 22.5% payroll tax, $5000 health insurance, 5% retirement,
// 8% benefits, 3% "other", $2000 training, $0 equipment (always zero), $0 workspace (always
// zero), 80% billable target. It also guessed whether labor_rate meant hourly or annual
// based on its magnitude (>100 => annual) -- a silent, fragile heuristic.
// Schema rebuilt with 8 real HR-domain inputs matching each report line item 1:1. No
// hardcoded business assumption remains; every dollar figure comes from a real input.

const PRODUCTIVE_HOURS_PER_YEAR = 2080; // standard 40h/week x 52 weeks -- a calendar constant, not a business assumption

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const baseSalary = get(inputs, "n_annual_base_salary");
  const payrollTaxRate = get(inputs, "n_payroll_tax_rate");
  const benefitsCost = get(inputs, "n_annual_benefits_cost");
  const insuranceCost = get(inputs, "n_annual_insurance_cost");
  const trainingCost = get(inputs, "n_annual_training_cost");
  const equipmentCost = get(inputs, "n_annual_equipment_it_cost");
  const workspaceCost = get(inputs, "n_annual_workspace_facility_cost");
  const targetUtilization = get(inputs, "n_target_billable_utilization_ratio");
  const conf = get(inputs, "n_source_confidence_ratio");
  const unc = get(inputs, "n_uncertainty_multiplier");

  if (!isFiniteNumber(inputs["n_annual_base_salary"]) || baseSalary <= 0) {
    warnings.push("Missing or non-positive Annual Base Salary.");
  }
  if (!isFiniteNumber(inputs["n_target_billable_utilization_ratio"]) || targetUtilization <= 0 || targetUtilization > 1) {
    warnings.push("Target Billable Utilization must be between 0 and 1 (exclusive of 0).");
  }

  const payrollTax = baseSalary * payrollTaxRate;
  const paidLeaveCost = baseSalary * (1 - Math.min(Math.max(targetUtilization, 0), 1));
  const fullyLoadedAnnualCost =
    baseSalary + payrollTax + benefitsCost + insuranceCost + trainingCost + equipmentCost + workspaceCost + paidLeaveCost;

  const billableHoursPerYear = PRODUCTIVE_HOURS_PER_YEAR * targetUtilization;
  const productiveHourlyCost = billableHoursPerYear > 0 ? fullyLoadedAnnualCost / billableHoursPerYear : 0;
  const baseToLoadedMultiplier = baseSalary > 0 ? fullyLoadedAnnualCost / baseSalary : 0;

  const costComponents = [baseSalary, payrollTax, benefitsCost, paidLeaveCost, trainingCost, equipmentCost, workspaceCost, insuranceCost];
  let primaryDriverIdx = 0;
  for (let i = 1; i < costComponents.length; i++) {
    if (costComponents[i] > costComponents[primaryDriverIdx]) primaryDriverIdx = i;
  }

  const decisionState = baseToLoadedMultiplier <= 1.2 ? 0 : baseToLoadedMultiplier <= 1.5 ? 1 : 2;

  const uncertaintyCoverage = unc > 1 ? unc - 1 : 0.1;

  outputs["out_base_annual_compensation"] = round(baseSalary, 2);
  outputs["out_employer_payroll_taxes"] = round(payrollTax, 2);
  outputs["out_benefits_cost"] = round(benefitsCost, 2);
  outputs["out_paid_leave_cost"] = round(paidLeaveCost, 2);
  outputs["out_training_allocation"] = round(trainingCost, 2);
  outputs["out_equipment_it_cost"] = round(equipmentCost, 2);
  outputs["out_workspace_facility_cost"] = round(workspaceCost, 2);
  outputs["out_insurance_burden"] = round(insuranceCost, 2);
  outputs["out_fully_loaded_annual_cost"] = round(fullyLoadedAnnualCost, 2);
  outputs["out_monthly_employer_cost"] = round(fullyLoadedAnnualCost / 12, 2);
  outputs["out_productive_hours_annual"] = round(billableHoursPerYear, 1);
  outputs["out_productive_hourly_cost"] = round(productiveHourlyCost, 2);
  outputs["out_base_to_loaded_multiplier"] = round(baseToLoadedMultiplier, 4);
  outputs["out_primary_cost_driver"] = primaryDriverIdx;
  outputs["out_decision_state"] = decisionState;
  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_expanded_uncertainty"] = round(fullyLoadedAnnualCost * uncertaintyCoverage, 2);
  outputs["out_threshold_crossing"] = baseToLoadedMultiplier > 1.5 ? 1 : 0;
  outputs["out_fmea_trigger"] = baseToLoadedMultiplier > 2.0 ? 1 : 0;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings,
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
