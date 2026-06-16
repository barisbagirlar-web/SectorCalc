// Auto-generated from bending-stress-calculator-schema.json
import * as z from 'zod';

export interface Bending_stress_calculatorInput {
  bendingMoment: number;
  sectionModulus: number;
  distanceFromNeutralAxis: number;
  momentOfInertia: number;
}

export const Bending_stress_calculatorInputSchema = z.object({
  bendingMoment: z.number().default(1000),
  sectionModulus: z.number().default(100000),
  distanceFromNeutralAxis: z.number().default(50),
  momentOfInertia: z.number().default(5000000),
});

function evaluateAllFormulas(input: Bending_stress_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.bendingMoment * 1000) / input.sectionModulus; results["bendingStress"] = Number.isFinite(v) ? v : 0; } catch { results["bendingStress"] = 0; }
  try { const v = (input.bendingMoment * 1000 * input.distanceFromNeutralAxis) / input.momentOfInertia; results["bendingStressAlt"] = Number.isFinite(v) ? v : 0; } catch { results["bendingStressAlt"] = 0; }
  return results;
}


export function calculateBending_stress_calculator(input: Bending_stress_calculatorInput): Bending_stress_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bendingStress"] ?? 0;
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


export interface Bending_stress_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
