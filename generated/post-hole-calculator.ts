// Auto-generated from post-hole-calculator-schema.json
import * as z from 'zod';

export interface Post_hole_calculatorInput {
  holeDiameter: number;
  holeDepth: number;
  postSide: number;
  numberOfPosts: number;
  wasteFactor: number;
}

export const Post_hole_calculatorInputSchema = z.object({
  holeDiameter: z.number().default(30),
  holeDepth: z.number().default(60),
  postSide: z.number().default(10),
  numberOfPosts: z.number().default(1),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Post_hole_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * (input.holeDiameter / 2) ** 2 * input.holeDepth; results["holeVolume"] = Number.isFinite(v) ? v : 0; } catch { results["holeVolume"] = 0; }
  try { const v = input.postSide ** 2 * input.holeDepth; results["postVolume"] = Number.isFinite(v) ? v : 0; } catch { results["postVolume"] = 0; }
  try { const v = (results["holeVolume"] ?? 0) - (results["postVolume"] ?? 0); results["concretePerHole"] = Number.isFinite(v) ? v : 0; } catch { results["concretePerHole"] = 0; }
  try { const v = (results["concretePerHole"] ?? 0) * input.numberOfPosts; results["totalConcrete"] = Number.isFinite(v) ? v : 0; } catch { results["totalConcrete"] = 0; }
  try { const v = (results["totalConcrete"] ?? 0) * (1 + input.wasteFactor / 100); results["totalWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["totalWithWaste"] = 0; }
  try { const v = (results["totalWithWaste"] ?? 0) / 1000000; results["totalCubicMeters"] = Number.isFinite(v) ? v : 0; } catch { results["totalCubicMeters"] = 0; }
  return results;
}


export function calculatePost_hole_calculator(input: Post_hole_calculatorInput): Post_hole_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCubicMeters"] ?? 0;
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


export interface Post_hole_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
