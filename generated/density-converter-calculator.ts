// Auto-generated from density-converter-calculator-schema.json
import * as z from 'zod';

export interface Density_converter_calculatorInput {
  inputValue: number;
  fromUnit: number;
  toUnit: number;
  precision: number;
}

export const Density_converter_calculatorInputSchema = z.object({
  inputValue: z.number().default(1),
  fromUnit: z.number().default(1),
  toUnit: z.number().default(2),
  precision: z.number().default(2),
});

function evaluateAllFormulas(input: Density_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { const factors = [1, 1000, 16.01846337396, 27679.9047102]; return factors[fromUnit-1] / factors[toUnit-1]; })(); results["conversionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.inputValue * (results["conversionFactor"] ?? 0); results["rawOutput"] = Number.isFinite(v) ? v : 0; } catch { results["rawOutput"] = 0; }
  try { const v = Math.round((results["rawOutput"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["finalOutput"] = Number.isFinite(v) ? v : 0; } catch { results["finalOutput"] = 0; }
  try { const v = (results["finalOutput"] ?? 0) + ' ' + (input.toUnit == 1 ? 'kg/m³' : input.toUnit == 2 ? 'g/cm³' : input.toUnit == 3 ? 'lb/ft³' : 'lb/in³'); results["outputWithUnit"] = Number.isFinite(v) ? v : 0; } catch { results["outputWithUnit"] = 0; }
  try { const v = input.inputValue * [1, 1000, 16.01846337396, 27679.9047102]; results["inputInKgM3"] = Number.isFinite(v) ? v : 0; } catch { results["inputInKgM3"] = 0; }
  return results;
}


export function calculateDensity_converter_calculator(input: Density_converter_calculatorInput): Density_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["outputWithUnit"] ?? 0;
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


export interface Density_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
