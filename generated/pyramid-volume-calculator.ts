// Auto-generated from pyramid-volume-calculator-schema.json
import * as z from 'zod';

export interface Pyramid_volume_calculatorInput {
  length: number;
  width: number;
  height: number;
  quantity: number;
}

export const Pyramid_volume_calculatorInputSchema = z.object({
  length: z.number().default(1),
  width: z.number().default(1),
  height: z.number().default(1),
  quantity: z.number().default(1),
});

function evaluateAllFormulas(input: Pyramid_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width; results["baseArea"] = Number.isFinite(v) ? v : 0; } catch { results["baseArea"] = 0; }
  try { const v = (input.length * input.width * input.height / 3) * input.quantity; results["volume"] = Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  return results;
}


export function calculatePyramid_volume_calculator(input: Pyramid_volume_calculatorInput): Pyramid_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["volume"] ?? 0;
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


export interface Pyramid_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
