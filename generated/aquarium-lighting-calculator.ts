// Auto-generated from aquarium-lighting-calculator-schema.json
import * as z from 'zod';

export interface Aquarium_lighting_calculatorInput {
  tankLength: number;
  tankWidth: number;
  tankHeight: number;
  desiredLux: number;
  lightEfficiency: number;
  photoperiod: number;
  electricityCost: number;
}

export const Aquarium_lighting_calculatorInputSchema = z.object({
  tankLength: z.number().default(100),
  tankWidth: z.number().default(40),
  tankHeight: z.number().default(50),
  desiredLux: z.number().default(20),
  lightEfficiency: z.number().default(100),
  photoperiod: z.number().default(8),
  electricityCost: z.number().default(0.15),
});

function evaluateAllFormulas(input: Aquarium_lighting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.desiredLux * (input.tankLength * input.tankWidth) / 10000); results["requiredLumens"] = Number.isFinite(v) ? v : 0; } catch { results["requiredLumens"] = 0; }
  try { const v = ((input.desiredLux * (input.tankLength * input.tankWidth) / 10000) / input.lightEfficiency); results["requiredWatts"] = Number.isFinite(v) ? v : 0; } catch { results["requiredWatts"] = 0; }
  try { const v = (((input.desiredLux * (input.tankLength * input.tankWidth) / 10000) / input.lightEfficiency) * input.photoperiod) / 1000; results["dailyEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["dailyEnergy"] = 0; }
  try { const v = ((((input.desiredLux * (input.tankLength * input.tankWidth) / 10000) / input.lightEfficiency) * input.photoperiod) / 1000) * 30 * input.electricityCost; results["monthlyCost"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyCost"] = 0; }
  return results;
}


export function calculateAquarium_lighting_calculator(input: Aquarium_lighting_calculatorInput): Aquarium_lighting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredWatts"] ?? 0;
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


export interface Aquarium_lighting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
