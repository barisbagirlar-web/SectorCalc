// Auto-generated from valentines-day-calculator-schema.json
import * as z from 'zod';

export interface Valentines_day_calculatorInput {
  budget: number;
  numPeople: number;
  giftCost: number;
  dinnerCost: number;
  flowerCost: number;
  otherCost: number;
}

export const Valentines_day_calculatorInputSchema = z.object({
  budget: z.number().default(500),
  numPeople: z.number().default(2),
  giftCost: z.number().default(200),
  dinnerCost: z.number().default(150),
  flowerCost: z.number().default(50),
  otherCost: z.number().default(50),
});

function evaluateAllFormulas(input: Valentines_day_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.giftCost + input.dinnerCost + input.flowerCost + input.otherCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.budget - (results["totalCost"] ?? 0); results["remainingBudget"] = Number.isFinite(v) ? v : 0; } catch { results["remainingBudget"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / input.numPeople; results["costPerPerson"] = Number.isFinite(v) ? v : 0; } catch { results["costPerPerson"] = 0; }
  try { const v = ((results["totalCost"] ?? 0) / input.budget) * 100; results["budgetUtilization"] = Number.isFinite(v) ? v : 0; } catch { results["budgetUtilization"] = 0; }
  try { const v = Math.min(100, (input.giftCost * 0.4 + input.dinnerCost * 0.3 + input.flowerCost * 0.2 + input.otherCost * 0.1) / (input.budget / 100)); results["romanceScore"] = Number.isFinite(v) ? v : 0; } catch { results["romanceScore"] = 0; }
  results["_costPerPerson__TL"] = 0;
  results["__budgetUtilization_"] = 0;
  try { const v = (results["romanceScore"] ?? 0)/100; results["_romanceScore__100"] = Number.isFinite(v) ? v : 0; } catch { results["_romanceScore__100"] = 0; }
  return results;
}


export function calculateValentines_day_calculator(input: Valentines_day_calculatorInput): Valentines_day_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Valentines_day_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
