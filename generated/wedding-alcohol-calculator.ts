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

function evaluateAllFormulas(input: Wedding_alcohol_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.guestCount * (input.alcoholPercentage / 100); results["drinkingGuests"] = Number.isFinite(v) ? v : 0; } catch { results["drinkingGuests"] = 0; }
  try { const v = (results["drinkingGuests"] ?? 0) * input.durationHours * input.drinksPerHour; results["totalDrinks"] = Number.isFinite(v) ? v : 0; } catch { results["totalDrinks"] = 0; }
  try { const v = (results["totalDrinks"] ?? 0) * input.beerRatio; results["beerDrinks"] = Number.isFinite(v) ? v : 0; } catch { results["beerDrinks"] = 0; }
  try { const v = (results["totalDrinks"] ?? 0) * input.wineRatio; results["wineDrinks"] = Number.isFinite(v) ? v : 0; } catch { results["wineDrinks"] = 0; }
  try { const v = (results["totalDrinks"] ?? 0) * input.spiritsRatio; results["spiritsDrinks"] = Number.isFinite(v) ? v : 0; } catch { results["spiritsDrinks"] = 0; }
  results["____Math_round_beerDrinks______drinks_"] = 0;
  results["____Math_round_wineDrinks______drinks_"] = 0;
  results["____Math_round_spiritsDrinks______drinks"] = 0;
  try { const v = Math.round((results["totalDrinks"] ?? 0)) + ' drinks'; results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateWedding_alcohol_calculator(input: Wedding_alcohol_calculatorInput): Wedding_alcohol_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Wedding_alcohol_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
