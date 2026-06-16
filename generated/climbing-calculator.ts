// Auto-generated from climbing-calculator-schema.json
import * as z from 'zod';

export interface Climbing_calculatorInput {
  climberMass: number;
  fallFactor: number;
  ratedImpactForce: number;
  ratedMass: number;
  ratedFallFactor: number;
  safetyFactor: number;
}

export const Climbing_calculatorInputSchema = z.object({
  climberMass: z.number().default(80),
  fallFactor: z.number().default(1),
  ratedImpactForce: z.number().default(9),
  ratedMass: z.number().default(80),
  ratedFallFactor: z.number().default(1.77),
  safetyFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Climbing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ratedImpactForce * Math.sqrt((input.climberMass / input.ratedMass) * (input.fallFactor / input.ratedFallFactor)); results["impactForce"] = Number.isFinite(v) ? v : 0; } catch { results["impactForce"] = 0; }
  try { const v = (results["impactForce"] ?? 0) * input.safetyFactor; results["adjustedImpactForce"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedImpactForce"] = 0; }
  return results;
}


export function calculateClimbing_calculator(input: Climbing_calculatorInput): Climbing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["adjustedImpactForce"] ?? 0;
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


export interface Climbing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
