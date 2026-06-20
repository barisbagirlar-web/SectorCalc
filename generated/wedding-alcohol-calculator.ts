// Auto-generated from wedding-alcohol-calculator-schema.json
import * as z from 'zod';

export interface Wedding_alcohol_calculatorInput {
  guestCount: number;
  alcoholPercentage: number;
  durationHours: number;
  drinksPerHour: number;
  beerRatio: number;
  wineRatio: number;
  spiritsRatio: number;
  dataConfidence?: number;
}

export const Wedding_alcohol_calculatorInputSchema = z.object({
  guestCount: z.number().default(100),
  alcoholPercentage: z.number().default(80),
  durationHours: z.number().default(5),
  drinksPerHour: z.number().default(1.5),
  beerRatio: z.number().default(0.4),
  wineRatio: z.number().default(0.4),
  spiritsRatio: z.number().default(0.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wedding_alcohol_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.guestCount * (input.alcoholPercentage / 100); results["drinkingGuests"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["drinkingGuests"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["drinkingGuests"])) * input.durationHours * input.drinksPerHour; results["totalDrinks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDrinks"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDrinks"])) * input.beerRatio; results["beerDrinks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["beerDrinks"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDrinks"])) * input.wineRatio; results["wineDrinks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wineDrinks"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDrinks"])) * input.spiritsRatio; results["spiritsDrinks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["spiritsDrinks"] = Number.NaN; }
  return results;
}


export function calculateWedding_alcohol_calculator(input: Wedding_alcohol_calculatorInput): Wedding_alcohol_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["spiritsDrinks"]);
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


export interface Wedding_alcohol_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
