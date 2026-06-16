// Auto-generated from radiation-exposure-calculator-schema.json
import * as z from 'zod';

export interface Radiation_exposure_calculatorInput {
  sourceActivity: number;
  gammaConstant: number;
  distance: number;
  shieldThickness: number;
  hvl: number;
  conversionFactor: number;
}

export const Radiation_exposure_calculatorInputSchema = z.object({
  sourceActivity: z.number().default(1),
  gammaConstant: z.number().default(0.5),
  distance: z.number().default(1),
  shieldThickness: z.number().default(0),
  hvl: z.number().default(1),
  conversionFactor: z.number().default(8.77),
});

function evaluateAllFormulas(input: Radiation_exposure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sourceActivity * input.gammaConstant) / (input.distance ** 2); results["exposureRate"] = Number.isFinite(v) ? v : 0; } catch { results["exposureRate"] = 0; }
  try { const v = Math.pow(2, -input.shieldThickness / input.hvl); results["attenuationFactor"] = Number.isFinite(v) ? v : 0; } catch { results["attenuationFactor"] = 0; }
  try { const v = (results["exposureRate"] ?? 0) * (results["attenuationFactor"] ?? 0) * input.conversionFactor; results["doseRate"] = Number.isFinite(v) ? v : 0; } catch { results["doseRate"] = 0; }
  return results;
}


export function calculateRadiation_exposure_calculator(input: Radiation_exposure_calculatorInput): Radiation_exposure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["doseRate"] ?? 0;
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


export interface Radiation_exposure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
