// Auto-generated from lawn-fertilizer-calculator-schema.json
import * as z from 'zod';

export interface Lawn_fertilizer_calculatorInput {
  lawnArea: number;
  nitrogenPercent: number;
  nitrogenRatePerSqM: number;
  applicationsPerYear: number;
  bagWeight: number;
  bagCost: number;
}

export const Lawn_fertilizer_calculatorInputSchema = z.object({
  lawnArea: z.number().default(100),
  nitrogenPercent: z.number().default(20),
  nitrogenRatePerSqM: z.number().default(25),
  applicationsPerYear: z.number().default(1),
  bagWeight: z.number().default(10),
  bagCost: z.number().default(0),
});

function evaluateAllFormulas(input: Lawn_fertilizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lawnArea * input.nitrogenRatePerSqM * 0.1 / input.nitrogenPercent * input.applicationsPerYear; results["totalFertilizerWeight_kg"] = Number.isFinite(v) ? v : 0; } catch { results["totalFertilizerWeight_kg"] = 0; }
  try { const v = Math.ceil((input.lawnArea * input.nitrogenRatePerSqM * 0.1 / input.nitrogenPercent * input.applicationsPerYear) / input.bagWeight); results["bagsNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["bagsNeeded"] = 0; }
  try { const v = Math.ceil((input.lawnArea * input.nitrogenRatePerSqM * 0.1 / input.nitrogenPercent * input.applicationsPerYear) / input.bagWeight) * input.bagCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateLawn_fertilizer_calculator(input: Lawn_fertilizer_calculatorInput): Lawn_fertilizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bagsNeeded"] ?? 0;
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


export interface Lawn_fertilizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
