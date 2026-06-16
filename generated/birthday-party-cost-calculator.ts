// Auto-generated from birthday-party-cost-calculator-schema.json
import * as z from 'zod';

export interface Birthday_party_cost_calculatorInput {
  numGuests: number;
  costPerPlate: number;
  numDrinksPerGuest: number;
  costPerDrink: number;
  cakeCost: number;
  decorationCost: number;
  venueRentalCost: number;
}

export const Birthday_party_cost_calculatorInputSchema = z.object({
  numGuests: z.number().default(10),
  costPerPlate: z.number().default(15),
  numDrinksPerGuest: z.number().default(2),
  costPerDrink: z.number().default(5),
  cakeCost: z.number().default(50),
  decorationCost: z.number().default(30),
  venueRentalCost: z.number().default(100),
});

function evaluateAllFormulas(input: Birthday_party_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numGuests * input.costPerPlate; results["totalFoodCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalFoodCost"] = 0; }
  try { const v = input.numGuests * input.numDrinksPerGuest * input.costPerDrink; results["totalDrinkCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalDrinkCost"] = 0; }
  try { const v = (results["totalFoodCost"] ?? 0) + (results["totalDrinkCost"] ?? 0) + input.cakeCost + input.decorationCost + input.venueRentalCost; results["totalPartyCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalPartyCost"] = 0; }
  try { const v = (results["totalPartyCost"] ?? 0) / input.numGuests; results["costPerGuest"] = Number.isFinite(v) ? v : 0; } catch { results["costPerGuest"] = 0; }
  return results;
}


export function calculateBirthday_party_cost_calculator(input: Birthday_party_cost_calculatorInput): Birthday_party_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["costPerGuest"] ?? 0;
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


export interface Birthday_party_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
