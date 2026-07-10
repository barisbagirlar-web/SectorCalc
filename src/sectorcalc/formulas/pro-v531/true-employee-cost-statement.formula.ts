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

  // ── Inputs ────────────────────────────────────────────────────────
  const baseSalary       = get(inputs, "n_annual_base_salary");
  const payrollTaxRate   = get(inputs, "n_payroll_tax_rate");
  const healthInsurance  = get(inputs, "n_health_insurance_annual");
  const pensionRate      = get(inputs, "n_pension_contribution_rate");
  const bonusRate        = get(inputs, "n_bonus_target_rate");
  const paidLeaveWeeks   = get(inputs, "n_paid_leave_weeks");
  const trainingBudget   = get(inputs, "n_training_budget_annual");
  const equipmentIT      = get(inputs, "n_equipment_it_annual");
  const workspaceFacility= get(inputs, "n_workspace_facility_annual");
  const recruitmentRate  = get(inputs, "n_recruitment_allocation_rate");
  const otherBenefits    = get(inputs, "n_other_benefits_annual");
  const productiveHours  = get(inputs, "n_productive_hours_per_year");

  // ── Validation ────────────────────────────────────────────────────
  let hasInvalidInput = false;
  if (baseSalary <= 0) { warnings.push("Base salary must be positive"); hasInvalidInput = true; }
  if (payrollTaxRate < 0 || payrollTaxRate > 60) warnings.push("Payroll tax rate out of typical range (0-60%)");
  if (paidLeaveWeeks < 0 || paidLeaveWeeks > 12) warnings.push("Paid leave weeks out of typical range (0-12)");

  // ── Calculations ──────────────────────────────────────────────────
  // Core: determine annual base salary
  // If base salary < 1000, treat as hourly rate * 2080
  const annualBase = baseSalary < 1000 ? baseSalary * 2080 : baseSalary;

  // Payroll taxes (employer portion: social security, medicare, unemployment, etc.)
  const payrollTaxPct = payrollTaxRate > 0 ? payrollTaxRate : 22.5; // default 22.5%
  const payrollTaxes  = annualBase * (payrollTaxPct / 100);

  // Benefits
  const healthCost    = healthInsurance > 0 ? healthInsurance : 0;
  const pension       = pensionRate > 0 ? annualBase * (pensionRate / 100) : 0;
  const bonus         = bonusRate > 0 ? annualBase * (bonusRate / 100) : 0;

  // Paid leave
  const weeklyRate    = annualBase / 52;
  const leaveCost     = paidLeaveWeeks > 0 ? weeklyRate * paidLeaveWeeks : annualBase * 0.08; // default 4 weeks

  // Training & recruitment
  const training      = trainingBudget > 0 ? trainingBudget : annualBase * 0.02;
  const recruitment   = recruitmentRate > 0 ? annualBase * (recruitmentRate / 100) : annualBase * 0.03;

  // Equipment, IT, workspace
  const equipIT       = equipmentIT > 0 ? equipmentIT : annualBase * 0.05;
  const facility      = workspaceFacility > 0 ? workspaceFacility : annualBase * 0.08;

  // Other benefits
  const other         = otherBenefits > 0 ? otherBenefits : 0;

  // Totals
  const totalAnnual = annualBase + payrollTaxes + healthCost + pension + bonus + leaveCost
    + training + recruitment + equipIT + facility + other;

  const monthlyCost  = totalAnnual / 12;

  // Productive hours — capacity utilization adjusted
  const productiveHrs   = productiveHours > 0 ? productiveHours : 2080 * 0.8; // default 1664 hrs

  const hourlyCost      = productiveHrs > 0 ? totalAnnual / productiveHrs : 0;
  const loadedMultiplier = annualBase > 0 ? totalAnnual / annualBase : 0;

  // Cost components indexed: 0=base, 1=payroll, 2=health, 3=pension, 4=bonus,
  // 5=leave, 6=training, 7=recruitment, 8=equipIT, 9=facility, 10=other
  const components = [annualBase, payrollTaxes, healthCost, pension, bonus,
    leaveCost, training, recruitment, equipIT, facility, other];
  let maxVal = 0;
  let primaryDriverIdx = 0;
  for (let i = 0; i < components.length; i++) {
    if (components[i] > maxVal) { maxVal = components[i]; primaryDriverIdx = i; }
  }

  // ── Decision engine ───────────────────────────────────────────────
  // 0 = GOOD (loaded cost < 1.5x base, reasonable burden)
  // 1 = REVIEW (moderately high burden)
  // 2 = BLOCKED (invalid inputs or extreme burden)
  let decision: number;
  if (hasInvalidInput) {
    decision = 2;
  } else if (loadedMultiplier <= 1.5) {
    decision = 0; // GOOD
  } else if (loadedMultiplier <= 2.5) {
    decision = 1; // REVIEW
  } else {
    decision = 2; // BLOCKED — extreme overhead burden
  }

  // ── Outputs ───────────────────────────────────────────────────────
  outputs["out_base_salary"]                = round(annualBase, 2);
  outputs["out_payroll_taxes"]              = round(payrollTaxes, 2);
  outputs["out_health_insurance"]            = round(healthCost, 2);
  outputs["out_pension_contribution"]        = round(pension, 2);
  outputs["out_bonus_allocation"]            = round(bonus, 2);
  outputs["out_paid_leave_cost"]             = round(leaveCost, 2);
  outputs["out_training_cost"]               = round(training, 2);
  outputs["out_recruitment_allocation"]      = round(recruitment, 2);
  outputs["out_equipment_it_cost"]           = round(equipIT, 2);
  outputs["out_workspace_facility_cost"]     = round(facility, 2);
  outputs["out_other_benefits"]              = round(other, 2);
  outputs["out_fully_loaded_annual_cost"]    = round(totalAnnual, 2);
  outputs["out_monthly_cost"]                = round(monthlyCost, 2);
  outputs["out_productive_hours_per_year"]   = round(productiveHrs, 0);
  outputs["out_productive_hourly_cost"]      = round(hourlyCost, 2);
  outputs["out_base_to_loaded_multiplier"]   = round(loadedMultiplier, 3);
  outputs["out_primary_cost_driver"]         = primaryDriverIdx;
  outputs["out_final_decision_state"]        = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
