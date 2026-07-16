import "server-only";
/**
 * True Employee Cost Statement — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Isomorphic — no Node-only or browser-only APIs.
 *
 * Conforms to ProFormulaModule contract for generated-registry.ts.
 * The `calculate` wrapper maps generic Record<string, number> inputs
 * (n_ prefix keys) to typed LaborRateInputs, calls executeFormula(),
 * and wraps the result in ProFormulaResult format.
 *
 * FIX (ported from a759fe2d9 audit, 2026-07-16): every line item except base salary was
 * previously a hardcoded constant (payroll tax 22.5%, health insurance $5000, retirement 5%,
 * paid leave 8%, other benefits 3%, training $2000, equipment/workspace $0, productive hours
 * fixed at 80% of 2080h) -- none backed by a real input. Replaced with 8 real HR-domain
 * inputs, one per report line item.
 */

import type { ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface LaborRateInputs {
  annualSalary: number;                  // Annual base salary (currency)
  payrollTaxRate: number;                // Employer payroll tax rate (ratio, e.g. 0.0765)
  annualBenefitsCost: number;            // Health/retirement/other benefits (currency/yr)
  annualInsuranceCost: number;           // Liability/workers-comp insurance (currency/yr)
  annualTrainingCost: number;            // Training & development (currency/yr)
  annualEquipmentItCost: number;         // Equipment & IT allocation (currency/yr)
  annualWorkspaceFacilityCost: number;   // Workspace/facility allocation (currency/yr)
  targetBillableUtilizationRatio: number; // Productive/billable share of paid hours (0..1)
  sourceConfidence: number;              // Source confidence ratio (0..1)
}

export interface LaborRateOutputs {
  out_base_annual_compensation: number;
  out_employer_payroll_taxes: number;
  out_benefits_cost: number;
  out_paid_leave_cost: number;
  out_training_allocation: number;
  out_equipment_it_cost: number;
  out_workspace_facility_cost: number;
  out_insurance_burden: number;
  out_fully_loaded_annual_cost: number;
  out_monthly_employer_cost: number;
  out_productive_hours_annual: number;
  out_productive_hourly_cost: number;
  out_base_to_loaded_multiplier: number;
  out_primary_cost_driver: number;
  out_decision_state: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

export function executeFormula(inputs: LaborRateInputs): LaborRateOutputs {
  const {
    annualSalary, payrollTaxRate, annualBenefitsCost, annualInsuranceCost,
    annualTrainingCost, annualEquipmentItCost, annualWorkspaceFacilityCost,
    targetBillableUtilizationRatio,
  } = inputs;

  const agw = annualSalary;
  const et = agw * payrollTaxRate;
  const benefitsCost = annualBenefitsCost;
  const tc = annualTrainingCost;
  const equipmentCost = annualEquipmentItCost;
  const workspaceCost = annualWorkspaceFacilityCost;
  const insuranceBurden = annualInsuranceCost;

  // Total fully loaded annual cost: base + taxes + benefits + training + equipment +
  // workspace + insurance (paid leave is time already inside the base salary, not an
  // additive cost -- it's reflected below as reduced productive-hour throughput instead).
  const tec = agw + et + benefitsCost + tc + equipmentCost + workspaceCost + insuranceBurden;

  const utilization = Math.max(0, Math.min(1, targetBillableUtilizationRatio));
  const paidHours = 2080;
  const ph = paidHours * utilization;
  const paidLeaveCost = paidHours * (1 - utilization) * (agw / paidHours);

  const hec = ph > 0 ? tec / ph : Infinity;
  const br = agw > 0 ? tec / agw : 0;
  const monthlyCost = tec / 12;

  const costComponents = [
    agw, et, benefitsCost, paidLeaveCost, tc, equipmentCost, workspaceCost, insuranceBurden,
  ];
  let primaryCostDriver = 0;
  for (let i = 1; i < costComponents.length; i++) {
    if (costComponents[i] > costComponents[primaryCostDriver]) {
      primaryCostDriver = i;
    }
  }

  const decisionState = br <= 1.2 ? 0 : br <= 1.5 ? 1 : 2;

  return {
    out_base_annual_compensation: agw,
    out_employer_payroll_taxes: et,
    out_benefits_cost: benefitsCost,
    out_paid_leave_cost: paidLeaveCost,
    out_training_allocation: tc,
    out_equipment_it_cost: equipmentCost,
    out_workspace_facility_cost: workspaceCost,
    out_insurance_burden: insuranceBurden,
    out_fully_loaded_annual_cost: tec,
    out_monthly_employer_cost: monthlyCost,
    out_productive_hours_annual: ph,
    out_productive_hourly_cost: hec,
    out_base_to_loaded_multiplier: br,
    out_primary_cost_driver: primaryCostDriver,
    out_decision_state: decisionState,
  };
}

// ─── ProFormulaModule contract ──────────────────────────────────────────────

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function get(inputs: Record<string, number>, key: string, fallback = 0): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : fallback;
}

const OUTPUT_KEYS: readonly string[] = [
  "out_base_annual_compensation",
  "out_employer_payroll_taxes",
  "out_benefits_cost",
  "out_paid_leave_cost",
  "out_training_allocation",
  "out_equipment_it_cost",
  "out_workspace_facility_cost",
  "out_insurance_burden",
  "out_fully_loaded_annual_cost",
  "out_monthly_employer_cost",
  "out_productive_hours_annual",
  "out_productive_hourly_cost",
  "out_base_to_loaded_multiplier",
  "out_primary_cost_driver",
  "out_decision_state",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  const typed: LaborRateInputs = {
    annualSalary: get(inputs, "n_annual_base_salary"),
    payrollTaxRate: get(inputs, "n_payroll_tax_rate"),
    annualBenefitsCost: get(inputs, "n_annual_benefits_cost"),
    annualInsuranceCost: get(inputs, "n_annual_insurance_cost"),
    annualTrainingCost: get(inputs, "n_annual_training_cost"),
    annualEquipmentItCost: get(inputs, "n_annual_equipment_it_cost"),
    annualWorkspaceFacilityCost: get(inputs, "n_annual_workspace_facility_cost"),
    targetBillableUtilizationRatio: get(inputs, "n_target_billable_utilization_ratio", 0.8),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = ["n_annual_base_salary"] as const;
  for (const key of mandatory) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push(`Input "${key}" is missing or invalid — using 0`);
    }
  }

  const raw = executeFormula(typed);
  const allOutputs = raw as unknown as Record<string, number>;
  const outputs: Record<string, number> = {};
  for (const key of OUTPUT_KEYS) {
    outputs[key] = allOutputs[key];
  }

  const ok = OUTPUT_KEYS.every((k) => isFiniteNumber(outputs[k]));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings,
    outputKeys: [...OUTPUT_KEYS],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export const toolKey = "true-employee-cost-statement";
export const formulaVersion = "5.3.1-pro-baris.2";

export const sampleInputs: Record<string, number> = {
  n_annual_base_salary: 75000,
  n_payroll_tax_rate: 0.0765,
  n_annual_benefits_cost: 12000,
  n_annual_insurance_cost: 3000,
  n_annual_training_cost: 2000,
  n_annual_equipment_it_cost: 2500,
  n_annual_workspace_facility_cost: 6000,
  n_target_billable_utilization_ratio: 0.8,
  n_source_confidence_ratio: 0.85,
};

export const requiredInputKeys: readonly string[] = [
  "n_annual_base_salary",
  "n_payroll_tax_rate",
  "n_annual_benefits_cost",
  "n_annual_insurance_cost",
  "n_annual_training_cost",
  "n_annual_equipment_it_cost",
  "n_annual_workspace_facility_cost",
  "n_target_billable_utilization_ratio",
  "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
