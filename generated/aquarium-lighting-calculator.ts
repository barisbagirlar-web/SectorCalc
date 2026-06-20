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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Aquarium_lighting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.desiredLux * (input.tankLength * input.tankWidth) / 10000); results["requiredLumens"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredLumens"] = Number.NaN; }
  try { const v = ((input.desiredLux * (input.tankLength * input.tankWidth) / 10000) / input.lightEfficiency); results["requiredWatts"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredWatts"] = Number.NaN; }
  try { const v = (((input.desiredLux * (input.tankLength * input.tankWidth) / 10000) / input.lightEfficiency) * input.photoperiod) / 1000; results["dailyEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyEnergy"] = Number.NaN; }
  try { const v = ((((input.desiredLux * (input.tankLength * input.tankWidth) / 10000) / input.lightEfficiency) * input.photoperiod) / 1000) * 30 * input.electricityCost; results["monthlyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyCost"] = Number.NaN; }
  return results;
}


export function calculateAquarium_lighting_calculator(input: Aquarium_lighting_calculatorInput): Aquarium_lighting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["requiredWatts"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
