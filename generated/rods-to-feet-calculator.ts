// Auto-generated from rods-to-feet-calculator-schema.json
import * as z from 'zod';

export interface Rods_to_feet_calculatorInput {
  rods: number;
  feetPerRod: number;
  decimalPlaces: number;
  safetyFactor: number;
  tolerance: number;
}

export const Rods_to_feet_calculatorInputSchema = z.object({
  rods: z.number().default(1),
  feetPerRod: z.number().default(16.5),
  decimalPlaces: z.number().default(2),
  safetyFactor: z.number().default(0),
  tolerance: z.number().default(0),
});

function evaluateAllFormulas(input: Rods_to_feet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rods * input.feetPerRod; results["baseFeet"] = Number.isFinite(v) ? v : 0; } catch { results["baseFeet"] = 0; }
  try { const v = (results["baseFeet"] ?? 0) * (1 + input.safetyFactor / 100); results["safetyFeet"] = Number.isFinite(v) ? v : 0; } catch { results["safetyFeet"] = 0; }
  try { const v = Math.round((results["safetyFeet"] ?? 0) * 10 ** input.decimalPlaces) / 10 ** input.decimalPlaces; results["totalFeet"] = Number.isFinite(v) ? v : 0; } catch { results["totalFeet"] = 0; }
  return results;
}


export function calculateRods_to_feet_calculator(input: Rods_to_feet_calculatorInput): Rods_to_feet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalFeet"] ?? 0;
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


export interface Rods_to_feet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
