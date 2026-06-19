// Auto-generated from party-food-calculator-schema.json
import * as z from 'zod';

export interface Party_food_calculatorInput {
  adults: number;
  children: number;
  hours: number;
  veggieRatio: number;
  dataConfidence?: number;
}

export const Party_food_calculatorInputSchema = z.object({
  adults: z.number().default(10),
  children: z.number().default(5),
  hours: z.number().default(3),
  veggieRatio: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Party_food_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.adults + input.children; results["totalGuests"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalGuests"] = 0; }
  try { const v = input.adults * 0.4 + input.children * 0.2; results["mainCourse"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mainCourse"] = 0; }
  try { const v = (asFormulaNumber(results["totalGuests"])) * 0.3; results["sideDish"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sideDish"] = 0; }
  try { const v = (asFormulaNumber(results["totalGuests"])) * 0.2; results["dessert"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dessert"] = 0; }
  try { const v = (asFormulaNumber(results["totalGuests"])) * input.hours * 0.15; results["drinks"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["drinks"] = 0; }
  try { const v = (asFormulaNumber(results["mainCourse"])) + (asFormulaNumber(results["sideDish"])) + (asFormulaNumber(results["dessert"])) + (asFormulaNumber(results["drinks"])); results["totalFoodUnits"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFoodUnits"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateParty_food_calculator(input: Party_food_calculatorInput): Party_food_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalFoodUnits"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
