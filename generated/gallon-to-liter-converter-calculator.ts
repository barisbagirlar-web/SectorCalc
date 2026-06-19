// Auto-generated from gallon-to-liter-converter-calculator-schema.json
import * as z from 'zod';

export interface Gallon_to_liter_converter_calculatorInput {
  containerCount: number;
  gallonsPerContainer: number;
  unitType: number;
  customFactor: number;
  wastePercentage: number;
  outputDecimals: number;
  dataConfidence?: number;
}

export const Gallon_to_liter_converter_calculatorInputSchema = z.object({
  containerCount: z.number().default(1),
  gallonsPerContainer: z.number().default(0),
  unitType: z.number().default(0),
  customFactor: z.number().default(0),
  wastePercentage: z.number().default(0),
  outputDecimals: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gallon_to_liter_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.unitType === 0 ? 3.78541 : 4.54609; results["standardFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["standardFactor"] = 0; }
  try { const v = input.customFactor > 0 ? input.customFactor : (asFormulaNumber(results["standardFactor"])); results["effectiveFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveFactor"] = 0; }
  try { const v = input.containerCount * input.gallonsPerContainer; results["totalGallons"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalGallons"] = 0; }
  try { const v = (asFormulaNumber(results["totalGallons"])) * (asFormulaNumber(results["effectiveFactor"])) * (1 + input.wastePercentage / 100); results["totalLiters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalLiters"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGallon_to_liter_converter_calculator(input: Gallon_to_liter_converter_calculatorInput): Gallon_to_liter_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalLiters"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Gallon_to_liter_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
