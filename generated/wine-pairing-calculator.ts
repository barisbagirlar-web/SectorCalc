// Auto-generated from wine-pairing-calculator-schema.json
import * as z from 'zod';

export interface Wine_pairing_calculatorInput {
  wine_acidity: number;
  wine_sweetness: number;
  wine_body: number;
  food_acidity: number;
  food_sweetness: number;
  food_richness: number;
  dataConfidence?: number;
}

export const Wine_pairing_calculatorInputSchema = z.object({
  wine_acidity: z.number().default(5),
  wine_sweetness: z.number().default(5),
  wine_body: z.number().default(5),
  food_acidity: z.number().default(5),
  food_sweetness: z.number().default(5),
  food_richness: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wine_pairing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wine_acidity * input.wine_sweetness * input.wine_body * input.food_acidity; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.wine_acidity * input.wine_sweetness * input.wine_body * input.food_acidity * (input.food_sweetness * input.food_richness); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.food_sweetness * input.food_richness; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateWine_pairing_calculator(input: Wine_pairing_calculatorInput): Wine_pairing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Wine_pairing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
