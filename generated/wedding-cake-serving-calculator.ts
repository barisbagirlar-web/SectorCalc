// Auto-generated from wedding-cake-serving-calculator-schema.json
import * as z from 'zod';

export interface Wedding_cake_serving_calculatorInput {
  shape: number;
  tier1Diameter: number;
  tier2Diameter: number;
  tier3Diameter: number;
  servingSize: number;
  guestCount: number;
  dataConfidence?: number;
}

export const Wedding_cake_serving_calculatorInputSchema = z.object({
  shape: z.number().default(0),
  tier1Diameter: z.number().default(6),
  tier2Diameter: z.number().default(0),
  tier3Diameter: z.number().default(0),
  servingSize: z.number().default(2),
  guestCount: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wedding_cake_serving_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.shape * input.tier1Diameter * input.tier2Diameter * input.tier3Diameter; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.shape * input.tier1Diameter * input.tier2Diameter * input.tier3Diameter * (input.servingSize * input.guestCount); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.servingSize * input.guestCount; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWedding_cake_serving_calculator(input: Wedding_cake_serving_calculatorInput): Wedding_cake_serving_calculatorOutput {
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


export interface Wedding_cake_serving_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
