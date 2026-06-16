// Auto-generated from mast-calculator-schema.json
import * as z from 'zod';

export interface Mast_calculatorInput {
  mastHeight: number;
  mastDiameter: number;
  windSpeed: number;
  materialYieldStrength: number;
  safetyFactor: number;
}

export const Mast_calculatorInputSchema = z.object({
  mastHeight: z.number().default(10),
  mastDiameter: z.number().default(0.3),
  windSpeed: z.number().default(30),
  materialYieldStrength: z.number().default(250),
  safetyFactor: z.number().default(1.5),
});

function evaluateAllFormulas(input: Mast_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * 1.225 * input.windSpeed ** 2; results["windPressure"] = Number.isFinite(v) ? v : 0; } catch { results["windPressure"] = 0; }
  try { const v = 0.7 * (results["windPressure"] ?? 0) * (input.mastDiameter * input.mastHeight); results["dragForce"] = Number.isFinite(v) ? v : 0; } catch { results["dragForce"] = 0; }
  try { const v = (results["dragForce"] ?? 0) * (input.mastHeight / 2); results["bendingMoment"] = Number.isFinite(v) ? v : 0; } catch { results["bendingMoment"] = 0; }
  try { const v = Math.PI * input.mastDiameter ** 3 / 32; results["sectionModulus"] = Number.isFinite(v) ? v : 0; } catch { results["sectionModulus"] = 0; }
  try { const v = (results["bendingMoment"] ?? 0) / (results["sectionModulus"] ?? 0); results["bendingStressPa"] = Number.isFinite(v) ? v : 0; } catch { results["bendingStressPa"] = 0; }
  try { const v = (results["bendingStressPa"] ?? 0) / 1e6; results["bendingStressMPa"] = Number.isFinite(v) ? v : 0; } catch { results["bendingStressMPa"] = 0; }
  try { const v = input.materialYieldStrength / input.safetyFactor; results["allowableStress"] = Number.isFinite(v) ? v : 0; } catch { results["allowableStress"] = 0; }
  try { const v = (results["bendingStressMPa"] ?? 0) / (results["allowableStress"] ?? 0); results["utilizationRatio"] = Number.isFinite(v) ? v : 0; } catch { results["utilizationRatio"] = 0; }
  return results;
}


export function calculateMast_calculator(input: Mast_calculatorInput): Mast_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["utilizationRatio"] ?? 0;
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


export interface Mast_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
