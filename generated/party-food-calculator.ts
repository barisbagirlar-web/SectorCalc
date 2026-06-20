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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Party_food_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.adults + input.children; results["totalGuests"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalGuests"] = Number.NaN; }
  try { const v = input.adults * 0.4 + input.children * 0.2; results["mainCourse"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mainCourse"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalGuests"])) * 0.3; results["sideDish"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sideDish"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalGuests"])) * 0.2; results["dessert"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dessert"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalGuests"])) * input.hours * 0.15; results["drinks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["drinks"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["mainCourse"])) + (toNumericFormulaValue(results["sideDish"])) + (toNumericFormulaValue(results["dessert"])) + (toNumericFormulaValue(results["drinks"])); results["totalFoodUnits"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFoodUnits"] = Number.NaN; }
  return results;
}


export function calculateParty_food_calculator(input: Party_food_calculatorInput): Party_food_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalFoodUnits"]);
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


export interface Party_food_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
