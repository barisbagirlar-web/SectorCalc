// Auto-generated from miles-to-km-calculator-schema.json
import * as z from 'zod';

export interface Miles_to_km_calculatorInput {
  miles: number;
  precision: number;
  isNautical: number;
  conversionFactorStatute: number;
  conversionFactorNautical: number;
  dataConfidence?: number;
}

export const Miles_to_km_calculatorInputSchema = z.object({
  miles: z.number().default(1),
  precision: z.number().default(2),
  isNautical: z.number().default(0),
  conversionFactorStatute: z.number().default(1.60934),
  conversionFactorNautical: z.number().default(1.852),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Miles_to_km_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.isNautical === 1 ? input.miles * input.conversionFactorNautical : input.miles * input.conversionFactorStatute) ? 1 : 0); results["kilometersRaw"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["kilometersRaw"] = 0; }
  try { const v = ((input.isNautical === 1 ? input.miles * input.conversionFactorNautical : input.miles * input.conversionFactorStatute) ? 1 : 0); results["kilometersRaw_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["kilometersRaw_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMiles_to_km_calculator(input: Miles_to_km_calculatorInput): Miles_to_km_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["kilometersRaw_aux"]));
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


export interface Miles_to_km_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
