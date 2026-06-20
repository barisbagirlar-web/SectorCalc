// Auto-generated from stick-of-butter-to-grams-calculator-schema.json
import * as z from 'zod';

export interface Stick_of_butter_to_grams_calculatorInput {
  numberOfSticks: number;
  stickWeight: number;
  packagingWeight: number;
  butterDensity: number;
  precision: number;
  dataConfidence?: number;
}

export const Stick_of_butter_to_grams_calculatorInputSchema = z.object({
  numberOfSticks: z.number().default(1),
  stickWeight: z.number().default(113.4),
  packagingWeight: z.number().default(0),
  butterDensity: z.number().default(0.911),
  precision: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Stick_of_butter_to_grams_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfSticks * input.stickWeight + input.packagingWeight; results["totalGrams"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalGrams"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalGrams"])) / 28.349523125; results["totalOunces"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalOunces"] = Number.NaN; }
  try { const v = input.numberOfSticks * 0.5; results["totalCups"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCups"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalGrams"])) / input.butterDensity; results["totalMilliliters"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMilliliters"] = Number.NaN; }
  return results;
}


export function calculateStick_of_butter_to_grams_calculator(input: Stick_of_butter_to_grams_calculatorInput): Stick_of_butter_to_grams_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalGrams"]);
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


export interface Stick_of_butter_to_grams_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
