// Auto-generated from post-hole-calculator-schema.json
import * as z from 'zod';

export interface Post_hole_calculatorInput {
  holeDiameter: number;
  holeDepth: number;
  postSide: number;
  numberOfPosts: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Post_hole_calculatorInputSchema = z.object({
  holeDiameter: z.number().default(30),
  holeDepth: z.number().default(60),
  postSide: z.number().default(10),
  numberOfPosts: z.number().default(1),
  wasteFactor: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Post_hole_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * (input.holeDiameter / 2) ** 2 * input.holeDepth; results["holeVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["holeVolume"] = 0; }
  try { const v = input.postSide ** 2 * input.holeDepth; results["postVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["postVolume"] = 0; }
  try { const v = (asFormulaNumber(results["holeVolume"])) - (asFormulaNumber(results["postVolume"])); results["concretePerHole"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["concretePerHole"] = 0; }
  try { const v = (asFormulaNumber(results["concretePerHole"])) * input.numberOfPosts; results["totalConcrete"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalConcrete"] = 0; }
  try { const v = (asFormulaNumber(results["totalConcrete"])) * (1 + input.wasteFactor / 100); results["totalWithWaste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWithWaste"] = 0; }
  try { const v = (asFormulaNumber(results["totalWithWaste"])) / 1000000; results["totalCubicMeters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCubicMeters"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePost_hole_calculator(input: Post_hole_calculatorInput): Post_hole_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCubicMeters"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
