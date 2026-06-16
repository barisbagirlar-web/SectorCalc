// Auto-generated from soil-bearing-capacity-calculator-schema.json
import * as z from 'zod';

export interface Soil_bearing_capacity_calculatorInput {
  cohesion: number;
  frictionAngle: number;
  unitWeight: number;
  foundationDepth: number;
  foundationWidth: number;
  safetyFactor: number;
}

export const Soil_bearing_capacity_calculatorInputSchema = z.object({
  cohesion: z.number().default(0),
  frictionAngle: z.number().default(30),
  unitWeight: z.number().default(18),
  foundationDepth: z.number().default(1),
  foundationWidth: z.number().default(1.5),
  safetyFactor: z.number().default(3),
});

function evaluateAllFormulas(input: Soil_bearing_capacity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.frictionAngle * Math.PI / 180; results["φ_rad"] = Number.isFinite(v) ? v : 0; } catch { results["φ_rad"] = 0; }
  try { const v = Math.tan(Math.PI/4 + φ_rad/2) ** 2 * Math.exp(Math.PI * Math.tan(φ_rad)); results["Nq"] = Number.isFinite(v) ? v : 0; } catch { results["Nq"] = 0; }
  try { const v = (φ_rad === 0) ? 5.14 : (((results["Nq"] ?? 0) - 1) / Math.tan(φ_rad)); results["Nc"] = Number.isFinite(v) ? v : 0; } catch { results["Nc"] = 0; }
  try { const v = 2 * ((results["Nq"] ?? 0) + 1) * Math.tan(φ_rad); results["Nγ"] = Number.isFinite(v) ? v : 0; } catch { results["Nγ"] = 0; }
  try { const v = input.cohesion * (results["Nc"] ?? 0) + input.unitWeight * input.foundationDepth * (results["Nq"] ?? 0) + 0.5 * input.unitWeight * input.foundationWidth * Nγ; results["ultimateBearingCapacity"] = Number.isFinite(v) ? v : 0; } catch { results["ultimateBearingCapacity"] = 0; }
  try { const v = (results["ultimateBearingCapacity"] ?? 0) / input.safetyFactor; results["allowableBearingCapacity"] = Number.isFinite(v) ? v : 0; } catch { results["allowableBearingCapacity"] = 0; }
  try { const v = input.cohesion * (results["Nc"] ?? 0); results["cohesionTerm"] = Number.isFinite(v) ? v : 0; } catch { results["cohesionTerm"] = 0; }
  try { const v = input.unitWeight * input.foundationDepth * (results["Nq"] ?? 0); results["surchargeTerm"] = Number.isFinite(v) ? v : 0; } catch { results["surchargeTerm"] = 0; }
  try { const v = 0.5 * input.unitWeight * input.foundationWidth * Nγ; results["selfWeightTerm"] = Number.isFinite(v) ? v : 0; } catch { results["selfWeightTerm"] = 0; }
  return results;
}


export function calculateSoil_bearing_capacity_calculator(input: Soil_bearing_capacity_calculatorInput): Soil_bearing_capacity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["allowableBearingCapacity"] ?? 0;
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


export interface Soil_bearing_capacity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
