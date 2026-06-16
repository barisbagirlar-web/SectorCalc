// Auto-generated from slope-stability-calculator-schema.json
import * as z from 'zod';

export interface Slope_stability_calculatorInput {
  slopeAngle: number;
  frictionAngle: number;
  cohesion: number;
  unitWeight: number;
  depth: number;
  porePressureRatio: number;
}

export const Slope_stability_calculatorInputSchema = z.object({
  slopeAngle: z.number().default(30),
  frictionAngle: z.number().default(25),
  cohesion: z.number().default(10),
  unitWeight: z.number().default(18),
  depth: z.number().default(5),
  porePressureRatio: z.number().default(0),
});

function evaluateAllFormulas(input: Slope_stability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.slopeAngle * Math.PI / 180; results["angleRad"] = Number.isFinite(v) ? v : 0; } catch { results["angleRad"] = 0; }
  try { const v = input.frictionAngle * Math.PI / 180; results["frictionRad"] = Number.isFinite(v) ? v : 0; } catch { results["frictionRad"] = 0; }
  try { const v = input.unitWeight * input.depth * Math.pow(Math.cos((results["angleRad"] ?? 0)), 2) - input.porePressureRatio * input.unitWeight * input.depth; results["effectiveNormalStress"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveNormalStress"] = 0; }
  try { const v = input.cohesion + (results["effectiveNormalStress"] ?? 0) * (Math.sin((results["frictionRad"] ?? 0)) / Math.cos((results["frictionRad"] ?? 0))); results["shearStrength"] = Number.isFinite(v) ? v : 0; } catch { results["shearStrength"] = 0; }
  try { const v = input.unitWeight * input.depth * Math.sin((results["angleRad"] ?? 0)) * Math.cos((results["angleRad"] ?? 0)); results["drivingForce"] = Number.isFinite(v) ? v : 0; } catch { results["drivingForce"] = 0; }
  try { const v = (results["shearStrength"] ?? 0) / (results["drivingForce"] ?? 0); results["FS"] = Number.isFinite(v) ? v : 0; } catch { results["FS"] = 0; }
  return results;
}


export function calculateSlope_stability_calculator(input: Slope_stability_calculatorInput): Slope_stability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["FS"] ?? 0;
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


export interface Slope_stability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
