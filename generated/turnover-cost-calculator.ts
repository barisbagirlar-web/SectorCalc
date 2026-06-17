// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Turnover_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.num_employees + input.annual_turnover_rate + input.avg_salary; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.num_employees + input.annual_turnover_rate + input.avg_salary; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTurnover_cost_calculator(input: Turnover_cost_calculatorInput): Turnover_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
