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

function evaluateAllFormulas(input: Budget_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rent + input.utilities + input.grocery + input.transportation + input.savings + input.otherExpenses; results["totalExpenses"] = Number.isFinite(v) ? v : 0; } catch { results["totalExpenses"] = 0; }
  try { const v = input.monthlyIncome - (results["totalExpenses"] ?? 0); results["netBalance"] = Number.isFinite(v) ? v : 0; } catch { results["netBalance"] = 0; }
  try { const v = (input.savings / input.monthlyIncome) * 100; results["savingsRate"] = Number.isFinite(v) ? v : 0; } catch { results["savingsRate"] = 0; }
  return results;
}


export function calculateBudget_calculator(input: Budget_calculatorInput): Budget_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netBalance"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
