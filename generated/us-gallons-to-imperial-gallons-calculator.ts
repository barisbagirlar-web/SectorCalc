// Auto-generated from us-gallons-to-imperial-gallons-calculator-schema.json
import * as z from 'zod';

export interface Us_gallons_to_imperial_gallons_calculatorInput {
  usGallons: number;
  conversionFactor: number;
  roundingPrecision: number;
  batchQuantity: number;
  temperatureC: number;
  measurementUncertainty: number;
  dataConfidence?: number;
}

export const Us_gallons_to_imperial_gallons_calculatorInputSchema = z.object({
  usGallons: z.number().default(0),
  conversionFactor: z.number().default(0.832674),
  roundingPrecision: z.number().default(2),
  batchQuantity: z.number().default(1),
  temperatureC: z.number().default(20),
  measurementUncertainty: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Us_gallons_to_imperial_gallons_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.usGallons * input.conversionFactor * input.batchQuantity; results["imperialUnrounded"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["imperialUnrounded"] = 0; }
  try { const v = input.usGallons * input.conversionFactor * input.batchQuantity; results["imperialUnrounded_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["imperialUnrounded_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateUs_gallons_to_imperial_gallons_calculator(input: Us_gallons_to_imperial_gallons_calculatorInput): Us_gallons_to_imperial_gallons_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["imperialUnrounded_aux"]));
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


export interface Us_gallons_to_imperial_gallons_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
