// Auto-generated from budget-calculator-schema.json
import * as z from 'zod';

export interface Budget_calculatorInput {
  monthlyIncome: number;
  rent: number;
  utilities: number;
  grocery: number;
  transportation: number;
  savings: number;
  otherExpenses: number;
  dataConfidence?: number;
}

export const Budget_calculatorInputSchema = z.object({
  monthlyIncome: z.number().default(0),
  rent: z.number().default(0),
  utilities: z.number().default(0),
  grocery: z.number().default(0),
  transportation: z.number().default(0),
  savings: z.number().default(0),
  otherExpenses: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Budget_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rent + input.utilities + input.grocery + input.transportation + input.savings + input.otherExpenses; results["totalExpenses"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalExpenses"] = 0; }
  try { const v = input.monthlyIncome - (asFormulaNumber(results["totalExpenses"])); results["netBalance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netBalance"] = 0; }
  try { const v = (input.savings / input.monthlyIncome) * 100; results["savingsRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["savingsRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBudget_calculator(input: Budget_calculatorInput): Budget_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netBalance"]);
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


export interface Budget_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
