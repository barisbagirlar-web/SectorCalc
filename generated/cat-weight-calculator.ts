// Auto-generated from cat-weight-calculator-schema.json
import * as z from 'zod';

export interface Cat_weight_calculatorInput {
  length: number;
  girth: number;
  breedFactor: number;
  sexFactor: number;
}

export const Cat_weight_calculatorInputSchema = z.object({
  length: z.number().default(30),
  girth: z.number().default(35),
  breedFactor: z.number().default(1),
  sexFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Cat_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.girth * input.girth; results["girthSquared"] = Number.isFinite(v) ? v : 0; } catch { results["girthSquared"] = 0; }
  try { const v = (results["girthSquared"] ?? 0) * input.length; results["volume"] = Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = (results["volume"] ?? 0) / 11800; results["baseWeight"] = Number.isFinite(v) ? v : 0; } catch { results["baseWeight"] = 0; }
  try { const v = (results["baseWeight"] ?? 0) * input.breedFactor * input.sexFactor; results["adjustedWeight"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedWeight"] = 0; }
  return results;
}


export function calculateCat_weight_calculator(input: Cat_weight_calculatorInput): Cat_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["adjustedWeight"] ?? 0;
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


export interface Cat_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
