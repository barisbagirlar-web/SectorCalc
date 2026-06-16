// Auto-generated from rock-climbing-calculator-schema.json
import * as z from 'zod';

export interface Rock_climbing_calculatorInput {
  climberMass: number;
  ropeLength: number;
  fallLength: number;
  ropeImpactForceRating: number;
}

export const Rock_climbing_calculatorInputSchema = z.object({
  climberMass: z.number().default(80),
  ropeLength: z.number().default(30),
  fallLength: z.number().default(5),
  ropeImpactForceRating: z.number().default(8.5),
});

function evaluateAllFormulas(input: Rock_climbing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fallLength / input.ropeLength; results["fallFactor"] = Number.isFinite(v) ? v : 0; } catch { results["fallFactor"] = 0; }
  try { const v = input.ropeImpactForceRating * (input.climberMass / 80) * Math.sqrt((results["fallFactor"] ?? 0) / 1.77); results["impactForce"] = Number.isFinite(v) ? v : 0; } catch { results["impactForce"] = 0; }
  return results;
}


export function calculateRock_climbing_calculator(input: Rock_climbing_calculatorInput): Rock_climbing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["impactForce"] ?? 0;
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


export interface Rock_climbing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
