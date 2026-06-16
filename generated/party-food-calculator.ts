// Auto-generated from party-food-calculator-schema.json
import * as z from 'zod';

export interface Party_food_calculatorInput {
  adults: number;
  children: number;
  hours: number;
  veggieRatio: number;
}

export const Party_food_calculatorInputSchema = z.object({
  adults: z.number().default(10),
  children: z.number().default(5),
  hours: z.number().default(3),
  veggieRatio: z.number().default(20),
});

function evaluateAllFormulas(input: Party_food_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.adults + input.children; results["totalGuests"] = Number.isFinite(v) ? v : 0; } catch { results["totalGuests"] = 0; }
  try { const v = input.adults * 0.4 + input.children * 0.2; results["mainCourse"] = Number.isFinite(v) ? v : 0; } catch { results["mainCourse"] = 0; }
  try { const v = (results["totalGuests"] ?? 0) * 0.3; results["sideDish"] = Number.isFinite(v) ? v : 0; } catch { results["sideDish"] = 0; }
  try { const v = (results["totalGuests"] ?? 0) * 0.2; results["dessert"] = Number.isFinite(v) ? v : 0; } catch { results["dessert"] = 0; }
  try { const v = (results["totalGuests"] ?? 0) * input.hours * 0.15; results["drinks"] = Number.isFinite(v) ? v : 0; } catch { results["drinks"] = 0; }
  try { const v = (results["mainCourse"] ?? 0) + (results["sideDish"] ?? 0) + (results["dessert"] ?? 0) + (results["drinks"] ?? 0); results["totalFoodUnits"] = Number.isFinite(v) ? v : 0; } catch { results["totalFoodUnits"] = 0; }
  return results;
}


export function calculateParty_food_calculator(input: Party_food_calculatorInput): Party_food_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalFoodUnits"] ?? 0;
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


export interface Party_food_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
