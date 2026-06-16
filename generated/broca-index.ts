// Auto-generated from broca-index-schema.json
import * as z from 'zod';

export interface Broca_indexInput {
  heightCm: number;
  isMale: number;
  frameSize: number;
  customAdjustment: number;
}

export const Broca_indexInputSchema = z.object({
  heightCm: z.number().default(170),
  isMale: z.number().default(1),
  frameSize: z.number().default(0),
  customAdjustment: z.number().default(0),
});

function evaluateAllFormulas(input: Broca_indexInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.heightCm - 100 - 5 * (1 - input.isMale); results["baseWeight"] = Number.isFinite(v) ? v : 0; } catch { results["baseWeight"] = 0; }
  try { const v = 1 + 0.1 * input.frameSize; results["frameFactor"] = Number.isFinite(v) ? v : 0; } catch { results["frameFactor"] = 0; }
  try { const v = (results["baseWeight"] ?? 0) * (results["frameFactor"] ?? 0); results["adjustedWeight"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedWeight"] = 0; }
  try { const v = (results["adjustedWeight"] ?? 0) + input.customAdjustment; results["idealWeight"] = Number.isFinite(v) ? v : 0; } catch { results["idealWeight"] = 0; }
  return results;
}


export function calculateBroca_index(input: Broca_indexInput): Broca_indexOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["idealWeight"] ?? 0;
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


export interface Broca_indexOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
