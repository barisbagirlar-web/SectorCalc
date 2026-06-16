// Auto-generated from joint-compound-calculator-schema.json
import * as z from 'zod';

export interface Joint_compound_calculatorInput {
  numSheets: number;
  jointLength: number;
  jointWidth: number;
  thickness: number;
  numCoats: number;
  coverageFactor: number;
}

export const Joint_compound_calculatorInputSchema = z.object({
  numSheets: z.number().default(10),
  jointLength: z.number().default(3.6),
  jointWidth: z.number().default(150),
  thickness: z.number().default(1.5),
  numCoats: z.number().default(3),
  coverageFactor: z.number().default(1.2),
});

function evaluateAllFormulas(input: Joint_compound_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numSheets * input.jointLength * (input.jointWidth / 1000) * input.numCoats; results["totalJointArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalJointArea"] = 0; }
  try { const v = input.thickness * input.numCoats; results["totalThickness"] = Number.isFinite(v) ? v : 0; } catch { results["totalThickness"] = 0; }
  try { const v = (input.numSheets * input.jointLength * (input.jointWidth / 1000) * input.thickness * input.numCoats) / input.coverageFactor; results["totalCompound"] = Number.isFinite(v) ? v : 0; } catch { results["totalCompound"] = 0; }
  return results;
}


export function calculateJoint_compound_calculator(input: Joint_compound_calculatorInput): Joint_compound_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCompound"] ?? 0;
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


export interface Joint_compound_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
