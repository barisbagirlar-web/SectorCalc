// Auto-generated from baseball-bat-speed-calculator-schema.json
import * as z from 'zod';

export interface Baseball_bat_speed_calculatorInput {
  angularVelocity: number;
  batLength: number;
  pivotDistance: number;
  sweetSpotOffset: number;
  batMass: number;
}

export const Baseball_bat_speed_calculatorInputSchema = z.object({
  angularVelocity: z.number().default(1000),
  batLength: z.number().default(84),
  pivotDistance: z.number().default(10),
  sweetSpotOffset: z.number().default(15),
  batMass: z.number().default(900),
});

function evaluateAllFormulas(input: Baseball_bat_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.angularVelocity * Math.PI / 180; results["angularVelocityRadPerS"] = Number.isFinite(v) ? v : 0; } catch { results["angularVelocityRadPerS"] = 0; }
  try { const v = (input.batLength - input.sweetSpotOffset - input.pivotDistance) / 100; results["effectiveRadiusM"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveRadiusM"] = 0; }
  try { const v = input.angularVelocity * Math.PI / 180 * (input.batLength - input.sweetSpotOffset - input.pivotDistance) / 100; results["batSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["batSpeed"] = 0; }
  try { const v = 0.5 * (input.batMass / 1000) * Math.pow(input.angularVelocity * Math.PI / 180 * (input.batLength - input.sweetSpotOffset - input.pivotDistance) / 100, 2); results["kineticEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["kineticEnergy"] = 0; }
  return results;
}


export function calculateBaseball_bat_speed_calculator(input: Baseball_bat_speed_calculatorInput): Baseball_bat_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["batSpeed"] ?? 0;
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


export interface Baseball_bat_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
