// Auto-generated from life-insurance-needs-calculator-schema.json
import * as z from 'zod';

export interface Life_insurance_needs_calculatorInput {
  annual_income: number;
  years_needed: number;
  current_savings: number;
  outstanding_debts: number;
  education_expenses: number;
  final_expenses: number;
  dataConfidence?: number;
}

export const Life_insurance_needs_calculatorInputSchema = z.object({
  annual_income: z.number().default(50000),
  years_needed: z.number().default(20),
  current_savings: z.number().default(10000),
  outstanding_debts: z.number().default(150000),
  education_expenses: z.number().default(50000),
  final_expenses: z.number().default(20000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Life_insurance_needs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_income * input.years_needed; results["income_replacement"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["income_replacement"] = 0; }
  try { const v = (asFormulaNumber(results["income_replacement"])) + input.outstanding_debts + input.education_expenses + input.final_expenses; results["total_needs"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_needs"] = 0; }
  try { const v = (asFormulaNumber(results["total_needs"])) - input.current_savings; results["recommended_coverage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["recommended_coverage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLife_insurance_needs_calculator(input: Life_insurance_needs_calculatorInput): Life_insurance_needs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["recommended_coverage"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Life_insurance_needs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
