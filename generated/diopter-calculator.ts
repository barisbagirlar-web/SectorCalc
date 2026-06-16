// Auto-generated from diopter-calculator-schema.json
import * as z from 'zod';

export interface Diopter_calculatorInput {
  focalLengthCm: number;
  diopter1: number;
  diopter2: number;
  originalDiopter: number;
  vertexDistanceMm: number;
}

export const Diopter_calculatorInputSchema = z.object({
  focalLengthCm: z.number().default(50),
  diopter1: z.number().default(1),
  diopter2: z.number().default(1),
  originalDiopter: z.number().default(-3),
  vertexDistanceMm: z.number().default(12),
});

function evaluateAllFormulas(input: Diopter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 100 / input.focalLengthCm; results["diopter"] = Number.isFinite(v) ? v : 0; } catch { results["diopter"] = 0; }
  try { const v = input.focalLengthCm / 100; results["focalLengthM"] = Number.isFinite(v) ? v : 0; } catch { results["focalLengthM"] = 0; }
  try { const v = input.diopter1 + input.diopter2; results["combinedDiopter"] = Number.isFinite(v) ? v : 0; } catch { results["combinedDiopter"] = 0; }
  try { const v = 100 / (results["combinedDiopter"] ?? 0); results["combinedFocalLengthCm"] = Number.isFinite(v) ? v : 0; } catch { results["combinedFocalLengthCm"] = 0; }
  try { const v = input.originalDiopter / (1 - (input.vertexDistanceMm / 1000) * input.originalDiopter); results["effectiveDiopter"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveDiopter"] = 0; }
  return results;
}


export function calculateDiopter_calculator(input: Diopter_calculatorInput): Diopter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["diopter"] ?? 0;
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


export interface Diopter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
