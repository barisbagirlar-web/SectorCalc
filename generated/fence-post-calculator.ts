// Auto-generated from fence-post-calculator-schema.json
import * as z from 'zod';

export interface Fence_post_calculatorInput {
  fenceLength: number;
  postSpacing: number;
  numberOfCorners: number;
  numberOfGateOpenings: number;
  postDiameter: number;
  postDepth: number;
  dataConfidence?: number;
}

export const Fence_post_calculatorInputSchema = z.object({
  fenceLength: z.number().default(100),
  postSpacing: z.number().default(2.5),
  numberOfCorners: z.number().default(0),
  numberOfGateOpenings: z.number().default(1),
  postDiameter: z.number().default(0.1),
  postDepth: z.number().default(0.6),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fence_post_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fenceLength) * (input.postSpacing) * (input.numberOfCorners) * (input.numberOfGateOpenings) * (input.postDiameter) * (input.postDepth); results["concretePerPost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["concretePerPost"] = Number.NaN; }
  try { const v = (input.fenceLength) * (input.postSpacing) * (input.numberOfCorners); results["concretePerPost_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["concretePerPost_aux"] = Number.NaN; }
  return results;
}


export function calculateFence_post_calculator(input: Fence_post_calculatorInput): Fence_post_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["concretePerPost_aux"]);
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


export interface Fence_post_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
