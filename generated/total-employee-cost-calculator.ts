// Auto-generated from total-employee-cost-calculator-schema.json
import * as z from 'zod';

export interface Total_employee_cost_calculatorInput {
  base_salary: number;
  bonus_percent: number;
  benefits_percent: number;
  payroll_tax_percent: number;
  overhead_percent: number;
  training_cost: number;
  productivity_factor: number;
  turnover_rate: number;
  dataConfidence?: number;
}

export const Total_employee_cost_calculatorInputSchema = z.object({
  base_salary: z.number().min(0).max(10000000).default(60000),
  bonus_percent: z.number().min(0).max(100).default(10),
  benefits_percent: z.number().min(0).max(100).default(30),
  payroll_tax_percent: z.number().min(0).max(20).default(7.65),
  overhead_percent: z.number().min(0).max(100).default(20),
  training_cost: z.number().min(0).max(100000).default(1500),
  productivity_factor: z.number().min(0).max(1).default(0.85),
  turnover_rate: z.number().min(0).max(100).default(15),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Total_employee_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.productivity_factor * input.base_salary; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.productivity_factor * input.base_salary * (1 + (input.bonus_percent / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.productivity_factor * input.base_salary * (1 + (input.bonus_percent / 100)) * ((input.benefits_percent / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.benefits_percent / 100); results["factor_benefits_percent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_benefits_percent"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTotal_employee_cost_calculator(input: Total_employee_cost_calculatorInput): Total_employee_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Scenario simulation","API access"],
  };
}


export interface Total_employee_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
