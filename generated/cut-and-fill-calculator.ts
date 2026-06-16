// Auto-generated from cut-and-fill-calculator-schema.json
import * as z from 'zod';

export interface Cut_and_fill_calculatorInput {
  cutArea1: number;
  cutArea2: number;
  fillArea1: number;
  fillArea2: number;
  distance: number;
  shrinkageFactor: number;
}

export const Cut_and_fill_calculatorInputSchema = z.object({
  cutArea1: z.number().default(50),
  cutArea2: z.number().default(60),
  fillArea1: z.number().default(30),
  fillArea2: z.number().default(40),
  distance: z.number().default(100),
  shrinkageFactor: z.number().default(0.9),
});

function evaluateAllFormulas(input: Cut_and_fill_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.cutArea1 + input.cutArea2) / 2) * input.distance; results["cutVolume"] = Number.isFinite(v) ? v : 0; } catch { results["cutVolume"] = 0; }
  try { const v = ((input.fillArea1 + input.fillArea2) / 2) * input.distance; results["fillVolume"] = Number.isFinite(v) ? v : 0; } catch { results["fillVolume"] = 0; }
  try { const v = (results["fillVolume"] ?? 0) / input.shrinkageFactor; results["adjustedFillVolume"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedFillVolume"] = 0; }
  try { const v = (results["cutVolume"] ?? 0) - (results["adjustedFillVolume"] ?? 0); results["netVolume"] = Number.isFinite(v) ? v : 0; } catch { results["netVolume"] = 0; }
  return results;
}


export function calculateCut_and_fill_calculator(input: Cut_and_fill_calculatorInput): Cut_and_fill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netVolume"] ?? 0;
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


export interface Cut_and_fill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
