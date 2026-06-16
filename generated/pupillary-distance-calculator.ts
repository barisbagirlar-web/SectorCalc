// Auto-generated from pupillary-distance-calculator-schema.json
import * as z from 'zod';

export interface Pupillary_distance_calculatorInput {
  rightPd: number;
  leftPd: number;
  workingDistance: number;
  vertexDistance: number;
  centerRotationDistance: number;
}

export const Pupillary_distance_calculatorInputSchema = z.object({
  rightPd: z.number().default(30),
  leftPd: z.number().default(30),
  workingDistance: z.number().default(40),
  vertexDistance: z.number().default(12),
  centerRotationDistance: z.number().default(15),
});

function evaluateAllFormulas(input: Pupillary_distance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rightPd + input.leftPd; results["totalFarPd"] = Number.isFinite(v) ? v : 0; } catch { results["totalFarPd"] = 0; }
  try { const v = input.workingDistance * 10; results["workingDistMm"] = Number.isFinite(v) ? v : 0; } catch { results["workingDistMm"] = 0; }
  try { const v = (results["workingDistMm"] ?? 0) + input.vertexDistance + input.centerRotationDistance; results["effectiveDistance"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveDistance"] = 0; }
  try { const v = input.rightPd * (results["workingDistMm"] ?? 0) / (results["effectiveDistance"] ?? 0); results["rightNearPd"] = Number.isFinite(v) ? v : 0; } catch { results["rightNearPd"] = 0; }
  try { const v = input.leftPd * (results["workingDistMm"] ?? 0) / (results["effectiveDistance"] ?? 0); results["leftNearPd"] = Number.isFinite(v) ? v : 0; } catch { results["leftNearPd"] = 0; }
  try { const v = (results["rightNearPd"] ?? 0) + (results["leftNearPd"] ?? 0); results["totalNearPd"] = Number.isFinite(v) ? v : 0; } catch { results["totalNearPd"] = 0; }
  return results;
}


export function calculatePupillary_distance_calculator(input: Pupillary_distance_calculatorInput): Pupillary_distance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalNearPd"] ?? 0;
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


export interface Pupillary_distance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
