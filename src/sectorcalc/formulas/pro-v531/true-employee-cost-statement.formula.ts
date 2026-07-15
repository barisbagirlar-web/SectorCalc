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
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface LaborRateInputs {
  annualSalary: number;       // Annual salary or labor rate
  overheadRate: number;       // Overhead allocation rate (%)
  sourceConfidence: number;   // Source confidence ratio (0..1)
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
  const { annualSalary, sourceConfidence } = inputs;

  // Annual gross wage: if input > 100 treat as annual, else treat as hourly * 2080
  const agw = annualSalary > 100 ? annualSalary : annualSalary * 2080;

  // Employer payroll taxes at 22.5%
  const et = agw * 0.225;

  // Health insurance (fixed)
  const hi = 5000;

  // Retirement contribution 5%
  const rc = agw * 0.05;

  // Paid leave cost 8%
  const plc = agw * 0.08;

  // Other benefits 3%
  const otb = agw * 0.03;

  // Training allocation (fixed)
  const tc = 2000;

  // Equipment & IT (simplified)
  const equipmentCost = 0;

  // Workspace / facility cost (simplified)
  const workspaceCost = 0;

  // Insurance burden
  const insuranceBurden = agw * 0.02;

  // Benefits cost total
  const benefitsCost = hi + rc + otb;

  // Total fully loaded annual cost
  const tec = agw + et + hi + rc + plc + otb + tc;

  // Productive hours (80% of 2080)
  const ph = 2080 * 0.8;

  // Productive hourly cost
  const hec = tec / ph;

  // Base-to-loaded multiplier
  const br = tec / agw;

  // Paid leave cost (alternative calculation reflecting non-productive time)
  const paidLeaveCost = 2080 * (1 - 0.8) * (agw / 2080);

  // Monthly employer cost
  const monthlyCost = tec / 12;

  // Primary cost driver: index of largest cost component
  const costComponents = [
    agw,                           // 0: base salary
    et,                            // 1: payroll taxes
    benefitsCost,                  // 2: benefits
    paidLeaveCost,                 // 3: paid leave
    tc,                            // 4: training
    equipmentCost,                 // 5: equipment/IT
    workspaceCost,                 // 6: workspace
    insuranceBurden,               // 7: insurance
  ];
  let primaryCostDriver = 0;
  for (let i = 1; i < costComponents.length; i++) {
    if (costComponents[i] > costComponents[primaryCostDriver]) {
      primaryCostDriver = i;
    }
  }

  // Decision state: 0 = normal, 1 = elevated, 2 = high
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

  const lr = get(inputs, "n_labor_rate");
  if (lr < 100) {
    warnings.push("n_labor_rate expected as annual salary, treated as hourly");
  }

  const typed: LaborRateInputs = {
    annualSalary: lr,
    overheadRate: get(inputs, "n_overhead_rate"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = ["n_labor_rate"] as const;
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
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  n_labor_rate: 75000,
  n_overhead_rate: 15,
  n_source_confidence_ratio: 0.85,
};

export const requiredInputKeys: readonly string[] = [
  "n_labor_rate",
  "n_overhead_rate",
  "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
