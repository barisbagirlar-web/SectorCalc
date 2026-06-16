// Auto-generated from reptile-temperature-calculator-schema.json
import * as z from 'zod';

export interface Reptile_temperature_calculatorInput {
  enclosureLength: number;
  enclosureWidth: number;
  enclosureHeight: number;
  ambientTemp: number;
  desiredTemp: number;
  insulationFactor: number;
}

export const Reptile_temperature_calculatorInputSchema = z.object({
  enclosureLength: z.number().default(60),
  enclosureWidth: z.number().default(45),
  enclosureHeight: z.number().default(45),
  ambientTemp: z.number().default(20),
  desiredTemp: z.number().default(35),
  insulationFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Reptile_temperature_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (2 * (input.enclosureLength * input.enclosureWidth + input.enclosureLength * input.enclosureHeight + input.enclosureWidth * input.enclosureHeight)) / 10000; results["surfaceArea"] = Number.isFinite(v) ? v : 0; } catch { results["surfaceArea"] = 0; }
  try { const v = (input.enclosureLength * input.enclosureWidth * input.enclosureHeight) / 1000; results["volume"] = Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = input.desiredTemp - input.ambientTemp; results["deltaT"] = Number.isFinite(v) ? v : 0; } catch { results["deltaT"] = 0; }
  try { const v = input.insulationFactor * ((2 * (input.enclosureLength * input.enclosureWidth + input.enclosureLength * input.enclosureHeight + input.enclosureWidth * input.enclosureHeight)) / 10000) * (input.desiredTemp - input.ambientTemp); results["requiredWattage"] = Number.isFinite(v) ? v : 0; } catch { results["requiredWattage"] = 0; }
  return results;
}


export function calculateReptile_temperature_calculator(input: Reptile_temperature_calculatorInput): Reptile_temperature_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredWattage"] ?? 0;
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


export interface Reptile_temperature_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
