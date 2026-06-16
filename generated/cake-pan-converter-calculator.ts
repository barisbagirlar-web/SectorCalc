// Auto-generated from cake-pan-converter-calculator-schema.json
import * as z from 'zod';

export interface Cake_pan_converter_calculatorInput {
  originalShape: number;
  originalDim1: number;
  originalDim2: number;
  originalDepth: number;
  targetShape: number;
  targetDim1: number;
  targetDim2: number;
  targetDepth: number;
}

export const Cake_pan_converter_calculatorInputSchema = z.object({
  originalShape: z.number().default(1),
  originalDim1: z.number().default(20),
  originalDim2: z.number().default(0),
  originalDepth: z.number().default(5),
  targetShape: z.number().default(1),
  targetDim1: z.number().default(24),
  targetDim2: z.number().default(0),
  targetDepth: z.number().default(5),
});

function evaluateAllFormulas(input: Cake_pan_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.originalShape === 1 ? Math.PI * Math.pow(input.originalDim1/2, 2) : input.originalDim1 * input.originalDim2) * input.originalDepth; results["originalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["originalVolume"] = 0; }
  try { const v = (input.targetShape === 1 ? Math.PI * Math.pow(input.targetDim1/2, 2) : input.targetDim1 * input.targetDim2) * input.targetDepth; results["targetVolume"] = Number.isFinite(v) ? v : 0; } catch { results["targetVolume"] = 0; }
  try { const v = (results["originalVolume"] ?? 0) ? (results["targetVolume"] ?? 0) / (results["originalVolume"] ?? 0) : 0; results["scalingFactor"] = Number.isFinite(v) ? v : 0; } catch { results["scalingFactor"] = 0; }
  return results;
}


export function calculateCake_pan_converter_calculator(input: Cake_pan_converter_calculatorInput): Cake_pan_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["scalingFactor"] ?? 0;
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


export interface Cake_pan_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
