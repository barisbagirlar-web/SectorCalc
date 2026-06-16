// Auto-generated from corpulence-index-schema.json
import * as z from 'zod';

export interface Corpulence_indexInput {
  weight: number;
  height: number;
}

export const Corpulence_indexInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
});

function evaluateAllFormulas(input: Corpulence_indexInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.height / 100; results["heightM"] = Number.isFinite(v) ? v : 0; } catch { results["heightM"] = 0; }
  try { const v = Math.pow((results["heightM"] ?? 0), 3); results["heightCubed"] = Number.isFinite(v) ? v : 0; } catch { results["heightCubed"] = 0; }
  try { const v = input.weight / (results["heightCubed"] ?? 0); results["corpulenceIndex"] = Number.isFinite(v) ? v : 0; } catch { results["corpulenceIndex"] = 0; }
  return results;
}


export function calculateCorpulence_index(input: Corpulence_indexInput): Corpulence_indexOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["corpulenceIndex"] ?? 0;
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


export interface Corpulence_indexOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
