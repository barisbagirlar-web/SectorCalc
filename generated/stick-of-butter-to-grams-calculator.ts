// Auto-generated from stick-of-butter-to-grams-calculator-schema.json
import * as z from 'zod';

export interface Stick_of_butter_to_grams_calculatorInput {
  numberOfSticks: number;
  stickWeight: number;
  packagingWeight: number;
  butterDensity: number;
  precision: number;
}

export const Stick_of_butter_to_grams_calculatorInputSchema = z.object({
  numberOfSticks: z.number().default(1),
  stickWeight: z.number().default(113.4),
  packagingWeight: z.number().default(0),
  butterDensity: z.number().default(0.911),
  precision: z.number().default(2),
});

function evaluateAllFormulas(input: Stick_of_butter_to_grams_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfSticks * input.stickWeight + input.packagingWeight; results["totalGrams"] = Number.isFinite(v) ? v : 0; } catch { results["totalGrams"] = 0; }
  try { const v = (results["totalGrams"] ?? 0) / 28.349523125; results["totalOunces"] = Number.isFinite(v) ? v : 0; } catch { results["totalOunces"] = 0; }
  try { const v = input.numberOfSticks * 0.5; results["totalCups"] = Number.isFinite(v) ? v : 0; } catch { results["totalCups"] = 0; }
  try { const v = (results["totalGrams"] ?? 0) / input.butterDensity; results["totalMilliliters"] = Number.isFinite(v) ? v : 0; } catch { results["totalMilliliters"] = 0; }
  return results;
}


export function calculateStick_of_butter_to_grams_calculator(input: Stick_of_butter_to_grams_calculatorInput): Stick_of_butter_to_grams_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalGrams"] ?? 0;
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


export interface Stick_of_butter_to_grams_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
