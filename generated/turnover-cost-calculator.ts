// Auto-generated from turnover-cost-calculator-schema.json
import * as z from 'zod';

export interface Turnover_cost_calculatorInput {
  num_employees: number;
  annual_turnover_rate: number;
  avg_salary: number;
  recruitment_cost_per_hire: number;
  onboarding_cost_per_hire: number;
  training_cost_per_hire: number;
  lost_productivity_months: number;
  productivity_factor: number;
  dataConfidence?: number;
}

export const Turnover_cost_calculatorInputSchema = z.object({
  num_employees: z.number().min(1).max(100000).default(100),
  annual_turnover_rate: z.number().min(0).max(100).default(15),
  avg_salary: z.number().min(0).max(500000).default(50000),
  recruitment_cost_per_hire: z.number().min(0).max(100000).default(4000),
  onboarding_cost_per_hire: z.number().min(0).max(50000).default(3000),
  training_cost_per_hire: z.number().min(0).max(100000).default(5000),
  lost_productivity_months: z.number().min(0).max(12).default(3),
  productivity_factor: z.number().min(0).max(100).default(50),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Turnover_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1; results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_exposure_hours"] = 0; }
  try { const v = input.num_employees * (input.annual_turnover_rate / 100) * 1 * input.avg_salary; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["direct_labor_cost"] = 0; }
  try { const v = input.num_employees * (input.annual_turnover_rate / 100) * 1 * input.avg_salary * input.productivity_factor; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTurnover_cost_calculator(input: Turnover_cost_calculatorInput): Turnover_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Composite model — validate each cost leg against actuals","Physical exposure factors are normalized estimates"];
  const suggestedActions: string[] = ["Reconcile labor and maintenance legs separately","Benchmark noise/vibration factors with site measurement"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry averages","Customizable cost multipliers"],
  };
}


export interface Turnover_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
