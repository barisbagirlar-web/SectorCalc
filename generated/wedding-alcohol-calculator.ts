// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wedding_alcohol_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.guestCount * (input.alcoholPercentage / 100); results["drinkingGuests"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["drinkingGuests"] = 0; }
  try { const v = (asFormulaNumber(results["drinkingGuests"])) * input.durationHours * input.drinksPerHour; results["totalDrinks"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDrinks"] = 0; }
  try { const v = (asFormulaNumber(results["totalDrinks"])) * input.beerRatio; results["beerDrinks"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["beerDrinks"] = 0; }
  try { const v = (asFormulaNumber(results["totalDrinks"])) * input.wineRatio; results["wineDrinks"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wineDrinks"] = 0; }
  try { const v = (asFormulaNumber(results["totalDrinks"])) * input.spiritsRatio; results["spiritsDrinks"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["spiritsDrinks"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWedding_alcohol_calculator(input: Wedding_alcohol_calculatorInput): Wedding_alcohol_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["spiritsDrinks"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
