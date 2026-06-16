// Auto-generated from fence-stain-calculator-schema.json
import * as z from 'zod';

export interface Fence_stain_calculatorInput {
  fenceLength: number;
  fenceHeight: number;
  picketWidth: number;
  picketSpacing: number;
  coveragePerGallon: number;
  numberOfCoats: number;
}

export const Fence_stain_calculatorInputSchema = z.object({
  fenceLength: z.number().default(10),
  fenceHeight: z.number().default(1.5),
  picketWidth: z.number().default(0.1),
  picketSpacing: z.number().default(0.05),
  coveragePerGallon: z.number().default(5),
  numberOfCoats: z.number().default(2),
});

function evaluateAllFormulas(input: Fence_stain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * input.fenceLength * input.fenceHeight * input.picketWidth / (input.picketWidth + input.picketSpacing); results["totalArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalArea"] = 0; }
  try { const v = (results["totalArea"] ?? 0) / input.coveragePerGallon; results["stainNeededWithoutCoats"] = Number.isFinite(v) ? v : 0; } catch { results["stainNeededWithoutCoats"] = 0; }
  try { const v = input.fenceLength / (input.picketWidth + input.picketSpacing); results["numberOfPickets"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfPickets"] = 0; }
  try { const v = (results["stainNeededWithoutCoats"] ?? 0) * input.numberOfCoats; results["totalStain"] = Number.isFinite(v) ? v : 0; } catch { results["totalStain"] = 0; }
  return results;
}


export function calculateFence_stain_calculator(input: Fence_stain_calculatorInput): Fence_stain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalStain"] ?? 0;
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


export interface Fence_stain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
