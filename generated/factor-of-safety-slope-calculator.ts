// Auto-generated from factor-of-safety-slope-calculator-schema.json
import * as z from 'zod';

export interface Factor_of_safety_slope_calculatorInput {
  slopeAngle: number;
  cohesion: number;
  frictionAngle: number;
  soilUnitWeight: number;
  slipDepth: number;
  waterDepthAboveSlip: number;
}

export const Factor_of_safety_slope_calculatorInputSchema = z.object({
  slopeAngle: z.number().default(30),
  cohesion: z.number().default(0),
  frictionAngle: z.number().default(25),
  soilUnitWeight: z.number().default(18),
  slipDepth: z.number().default(2),
  waterDepthAboveSlip: z.number().default(0),
});

function evaluateAllFormulas(input: Factor_of_safety_slope_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cohesion + (input.soilUnitWeight * input.slipDepth * Math.cos(input.slopeAngle * Math.PI / 180) ** 2 - 9.81 * input.waterDepthAboveSlip * Math.cos(input.slopeAngle * Math.PI / 180) ** 2) * Math.tan(input.frictionAngle * Math.PI / 180)) / (input.soilUnitWeight * input.slipDepth * Math.sin(input.slopeAngle * Math.PI / 180) * Math.cos(input.slopeAngle * Math.PI / 180)); results["factorOfSafety"] = Number.isFinite(v) ? v : 0; } catch { results["factorOfSafety"] = 0; }
  try { const v = input.cohesion + (input.soilUnitWeight * input.slipDepth * Math.cos(input.slopeAngle * Math.PI / 180) ** 2 - 9.81 * input.waterDepthAboveSlip * Math.cos(input.slopeAngle * Math.PI / 180) ** 2) * Math.tan(input.frictionAngle * Math.PI / 180); results["resistingStress"] = Number.isFinite(v) ? v : 0; } catch { results["resistingStress"] = 0; }
  try { const v = input.soilUnitWeight * input.slipDepth * Math.sin(input.slopeAngle * Math.PI / 180) * Math.cos(input.slopeAngle * Math.PI / 180); results["drivingStress"] = Number.isFinite(v) ? v : 0; } catch { results["drivingStress"] = 0; }
  return results;
}


export function calculateFactor_of_safety_slope_calculator(input: Factor_of_safety_slope_calculatorInput): Factor_of_safety_slope_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["factorOfSafety"] ?? 0;
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


export interface Factor_of_safety_slope_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
