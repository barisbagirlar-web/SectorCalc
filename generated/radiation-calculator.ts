// Auto-generated from radiation-calculator-schema.json
import * as z from 'zod';

export interface Radiation_calculatorInput {
  sourceActivity: number;
  distance: number;
  shieldingThickness: number;
  halfValueLayer: number;
  exposureTime: number;
  gammaConstant: number;
}

export const Radiation_calculatorInputSchema = z.object({
  sourceActivity: z.number().default(1),
  distance: z.number().default(1),
  shieldingThickness: z.number().default(0),
  halfValueLayer: z.number().default(0.5),
  exposureTime: z.number().default(1),
  gammaConstant: z.number().default(1.32),
});

function evaluateAllFormulas(input: Radiation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gammaConstant * input.sourceActivity / (input.distance ** 2); results["unshieldedDoseRate"] = Number.isFinite(v) ? v : 0; } catch { results["unshieldedDoseRate"] = 0; }
  try { const v = Math.exp(-0.693 * input.shieldingThickness / input.halfValueLayer); results["attenuationFactor"] = Number.isFinite(v) ? v : 0; } catch { results["attenuationFactor"] = 0; }
  try { const v = (results["unshieldedDoseRate"] ?? 0) * (results["attenuationFactor"] ?? 0); results["shieldedDoseRate"] = Number.isFinite(v) ? v : 0; } catch { results["shieldedDoseRate"] = 0; }
  try { const v = (results["shieldedDoseRate"] ?? 0) * input.exposureTime; results["totalDose"] = Number.isFinite(v) ? v : 0; } catch { results["totalDose"] = 0; }
  return results;
}


export function calculateRadiation_calculator(input: Radiation_calculatorInput): Radiation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalDose"] ?? 0;
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


export interface Radiation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
