// Auto-generated from beer-pairing-calculator-schema.json
import * as z from 'zod';

export interface Beer_pairing_calculatorInput {
  beerIBU: number;
  beerABV: number;
  foodRichness: number;
  foodSpiciness: number;
  foodAcidity: number;
  dataConfidence?: number;
}

export const Beer_pairing_calculatorInputSchema = z.object({
  beerIBU: z.number().default(30),
  beerABV: z.number().default(5),
  foodRichness: z.number().default(5),
  foodSpiciness: z.number().default(3),
  foodAcidity: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Beer_pairing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.beerIBU * (input.beerABV / 100) * input.foodRichness * input.foodSpiciness; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.beerIBU * (input.beerABV / 100) * input.foodRichness * input.foodSpiciness * (input.foodAcidity); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.foodAcidity; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBeer_pairing_calculator(input: Beer_pairing_calculatorInput): Beer_pairing_calculatorOutput {
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


export interface Beer_pairing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
