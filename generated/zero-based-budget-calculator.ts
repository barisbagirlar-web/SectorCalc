// Auto-generated from zero-based-budget-calculator-schema.json
import * as z from 'zod';

export interface Zero_based_budget_calculatorInput {
  totalIncome: number;
  housing: number;
  food: number;
  transport: number;
  savings: number;
  discretionary: number;
}

export const Zero_based_budget_calculatorInputSchema = z.object({
  totalIncome: z.number().default(0),
  housing: z.number().default(0),
  food: z.number().default(0),
  transport: z.number().default(0),
  savings: z.number().default(0),
  discretionary: z.number().default(0),
});

function evaluateAllFormulas(input: Zero_based_budget_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalIncome; results["totalIncome"] = Number.isFinite(v) ? v : 0; } catch { results["totalIncome"] = 0; }
  try { const v = input.housing + input.food + input.transport + input.savings + input.discretionary; results["totalExpenses"] = Number.isFinite(v) ? v : 0; } catch { results["totalExpenses"] = 0; }
  try { const v = input.totalIncome - (input.housing + input.food + input.transport + input.savings + input.discretionary); results["balance"] = Number.isFinite(v) ? v : 0; } catch { results["balance"] = 0; }
  try { const v = input.housing; results["housing"] = Number.isFinite(v) ? v : 0; } catch { results["housing"] = 0; }
  try { const v = input.food; results["food"] = Number.isFinite(v) ? v : 0; } catch { results["food"] = 0; }
  try { const v = input.transport; results["transport"] = Number.isFinite(v) ? v : 0; } catch { results["transport"] = 0; }
  try { const v = input.savings; results["savings"] = Number.isFinite(v) ? v : 0; } catch { results["savings"] = 0; }
  try { const v = input.discretionary; results["discretionary"] = Number.isFinite(v) ? v : 0; } catch { results["discretionary"] = 0; }
  return results;
}


export function calculateZero_based_budget_calculator(input: Zero_based_budget_calculatorInput): Zero_based_budget_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["balance"] ?? 0;
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


export interface Zero_based_budget_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
