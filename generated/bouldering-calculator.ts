// Auto-generated from bouldering-calculator-schema.json
import * as z from 'zod';

export interface Bouldering_calculatorInput {
  bodyMass: number;
  fallHeight: number;
  matThickness: number;
  matStiffness: number;
  g: number;
}

export const Bouldering_calculatorInputSchema = z.object({
  bodyMass: z.number().default(70),
  fallHeight: z.number().default(2),
  matThickness: z.number().default(10),
  matStiffness: z.number().default(50),
  g: z.number().default(9.81),
});

function evaluateAllFormulas(input: Bouldering_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.matThickness / 100; results["matThicknessM"] = Number.isFinite(v) ? v : 0; } catch { results["matThicknessM"] = 0; }
  try { const v = input.matStiffness * 1000; results["matStiffnessNm"] = Number.isFinite(v) ? v : 0; } catch { results["matStiffnessNm"] = 0; }
  try { const v = input.bodyMass * input.g; results["mg"] = Number.isFinite(v) ? v : 0; } catch { results["mg"] = 0; }
  try { const v = Math.sqrt((results["mg"] ?? 0)**2 + 2 * (results["mg"] ?? 0) * (results["matStiffnessNm"] ?? 0) * input.fallHeight); results["discriminant"] = Number.isFinite(v) ? v : 0; } catch { results["discriminant"] = 0; }
  try { const v = ((results["mg"] ?? 0) + (results["discriminant"] ?? 0)) / (results["matStiffnessNm"] ?? 0); results["matCompression"] = Number.isFinite(v) ? v : 0; } catch { results["matCompression"] = 0; }
  try { const v = (results["matStiffnessNm"] ?? 0) * (results["matCompression"] ?? 0); results["maxForce"] = Number.isFinite(v) ? v : 0; } catch { results["maxForce"] = 0; }
  return results;
}


export function calculateBouldering_calculator(input: Bouldering_calculatorInput): Bouldering_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxForce"] ?? 0;
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


export interface Bouldering_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
