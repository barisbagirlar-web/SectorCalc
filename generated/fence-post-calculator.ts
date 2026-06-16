// Auto-generated from fence-post-calculator-schema.json
import * as z from 'zod';

export interface Fence_post_calculatorInput {
  fenceLength: number;
  postSpacing: number;
  numberOfCorners: number;
  numberOfGateOpenings: number;
  postDiameter: number;
  postDepth: number;
}

export const Fence_post_calculatorInputSchema = z.object({
  fenceLength: z.number().default(100),
  postSpacing: z.number().default(2.5),
  numberOfCorners: z.number().default(0),
  numberOfGateOpenings: z.number().default(1),
  postDiameter: z.number().default(0.1),
  postDepth: z.number().default(0.6),
});

function evaluateAllFormulas(input: Fence_post_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil(input.fenceLength / input.postSpacing) + 1 + input.numberOfCorners + input.numberOfGateOpenings * 2; results["totalPosts"] = Number.isFinite(v) ? v : 0; } catch { results["totalPosts"] = 0; }
  try { const v = Math.PI * (input.postDiameter / 2) ** 2 * input.postDepth; results["concretePerPost"] = Number.isFinite(v) ? v : 0; } catch { results["concretePerPost"] = 0; }
  try { const v = (results["totalPosts"] ?? 0) * (results["concretePerPost"] ?? 0); results["concreteTotal"] = Number.isFinite(v) ? v : 0; } catch { results["concreteTotal"] = 0; }
  return results;
}


export function calculateFence_post_calculator(input: Fence_post_calculatorInput): Fence_post_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPosts"] ?? 0;
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


export interface Fence_post_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
