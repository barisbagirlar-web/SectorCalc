// Auto-generated from stucco-calculator-schema.json
import * as z from 'zod';

export interface Stucco_calculatorInput {
  wallArea: number;
  thickness: number;
  kgPerSqmPerMm: number;
  bagWeight: number;
  wasteFactor: number;
}

export const Stucco_calculatorInputSchema = z.object({
  wallArea: z.number().default(100),
  thickness: z.number().default(20),
  kgPerSqmPerMm: z.number().default(1),
  bagWeight: z.number().default(25),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Stucco_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallArea * input.thickness * input.kgPerSqmPerMm * (1 + input.wasteFactor / 100); results["totalDryMix"] = Number.isFinite(v) ? v : 0; } catch { results["totalDryMix"] = 0; }
  try { const v = Math.ceil((results["totalDryMix"] ?? 0) / input.bagWeight); results["totalBags"] = Number.isFinite(v) ? v : 0; } catch { results["totalBags"] = 0; }
  return results;
}


export function calculateStucco_calculator(input: Stucco_calculatorInput): Stucco_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Gerekli"] ?? 0;
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


export interface Stucco_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
