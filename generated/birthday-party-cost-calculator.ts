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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Birthday_party_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numGuests * input.costPerPlate; results["totalFoodCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFoodCost"] = Number.NaN; }
  try { const v = input.numGuests * input.numDrinksPerGuest * input.costPerDrink; results["totalDrinkCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDrinkCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalFoodCost"])) + (toNumericFormulaValue(results["totalDrinkCost"])) + input.cakeCost + input.decorationCost + input.venueRentalCost; results["totalPartyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPartyCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPartyCost"])) / input.numGuests; results["costPerGuest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerGuest"] = Number.NaN; }
  return results;
}


export function calculateBirthday_party_cost_calculator(input: Birthday_party_cost_calculatorInput): Birthday_party_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["costPerGuest"]);
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


export interface Birthday_party_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
