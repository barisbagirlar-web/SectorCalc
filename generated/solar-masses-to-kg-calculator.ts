// Auto-generated from solar-masses-to-kg-calculator-schema.json
import * as z from 'zod';

export interface Solar_masses_to_kg_calculatorInput {
  solarMassValue: number;
  conversionFactor: number;
  decimalPlaces: number;
  uncertaintyPercent: number;
}

export const Solar_masses_to_kg_calculatorInputSchema = z.object({
  solarMassValue: z.number().default(1),
  conversionFactor: z.number().default(1.989e+30),
  decimalPlaces: z.number().default(0),
  uncertaintyPercent: z.number().default(0),
});

function evaluateAllFormulas(input: Solar_masses_to_kg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round(input.solarMassValue * input.conversionFactor * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["massInKg"] = Number.isFinite(v) ? v : 0; } catch { results["massInKg"] = 0; }
  try { const v = 'Converted mass: ' + (Math.round(input.solarMassValue * input.conversionFactor * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces)) + ' kg'; results["conversionResult"] = Number.isFinite(v) ? v : 0; } catch { results["conversionResult"] = 0; }
  try { const v = 'Uncertainty range: ' + (Math.round((input.solarMassValue * input.conversionFactor) * (1 - input.uncertaintyPercent / 100) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces)) + ' to ' + (Math.round((input.solarMassValue * input.conversionFactor) * (1 + input.uncertaintyPercent / 100) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces)) + ' kg'; results["uncertaintyRange"] = Number.isFinite(v) ? v : 0; } catch { results["uncertaintyRange"] = 0; }
  return results;
}


export function calculateSolar_masses_to_kg_calculator(input: Solar_masses_to_kg_calculatorInput): Solar_masses_to_kg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["massInKg"] ?? 0;
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


export interface Solar_masses_to_kg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
