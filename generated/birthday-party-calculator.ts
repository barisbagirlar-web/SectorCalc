// Auto-generated from birthday-party-calculator-schema.json
import * as z from 'zod';

export interface Birthday_party_calculatorInput {
  guestCount: number;
  foodCostPerGuest: number;
  drinkCostPerGuest: number;
  decorationCost: number;
  entertainmentCost: number;
  venueRental: number;
  cakeCost: number;
  miscCost: number;
  dataConfidence?: number;
}

export const Birthday_party_calculatorInputSchema = z.object({
  guestCount: z.number().default(20),
  foodCostPerGuest: z.number().default(15),
  drinkCostPerGuest: z.number().default(8),
  decorationCost: z.number().default(100),
  entertainmentCost: z.number().default(200),
  venueRental: z.number().default(300),
  cakeCost: z.number().default(50),
  miscCost: z.number().default(50),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Birthday_party_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.guestCount * input.foodCostPerGuest; results["totalFoodCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFoodCost"] = 0; }
  try { const v = input.guestCount * input.drinkCostPerGuest; results["totalDrinkCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDrinkCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalFoodCost"])) + (asFormulaNumber(results["totalDrinkCost"])) + input.decorationCost + input.entertainmentCost + input.venueRental + input.cakeCost + input.miscCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) / input.guestCount; results["costPerGuest"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["costPerGuest"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBirthday_party_calculator(input: Birthday_party_calculatorInput): Birthday_party_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Birthday_party_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
