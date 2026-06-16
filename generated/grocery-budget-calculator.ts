// Auto-generated from grocery-budget-calculator-schema.json
import * as z from 'zod';

export interface Grocery_budget_calculatorInput {
  adults: number;
  children: number;
  tripsPerMonth: number;
  avgSpendPerTrip: number;
  coefficientChild: number;
  bufferPercent: number;
}

export const Grocery_budget_calculatorInputSchema = z.object({
  adults: z.number().default(2),
  children: z.number().default(1),
  tripsPerMonth: z.number().default(4),
  avgSpendPerTrip: z.number().default(150),
  coefficientChild: z.number().default(0.7),
  bufferPercent: z.number().default(10),
});

function evaluateAllFormulas(input: Grocery_budget_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tripsPerMonth * input.avgSpendPerTrip * (1 + input.bufferPercent / 100); results["totalMonthlyBudget"] = Number.isFinite(v) ? v : 0; } catch { results["totalMonthlyBudget"] = 0; }
  try { const v = input.tripsPerMonth * input.avgSpendPerTrip * (1 + input.bufferPercent / 100) / 4.33; results["weeklyBudget"] = Number.isFinite(v) ? v : 0; } catch { results["weeklyBudget"] = 0; }
  try { const v = (input.tripsPerMonth * input.avgSpendPerTrip * (1 + input.bufferPercent / 100)) / (input.adults + input.children * input.coefficientChild); results["perPersonBudget"] = Number.isFinite(v) ? v : 0; } catch { results["perPersonBudget"] = 0; }
  return results;
}


export function calculateGrocery_budget_calculator(input: Grocery_budget_calculatorInput): Grocery_budget_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalMonthlyBudget"] ?? 0;
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


export interface Grocery_budget_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
