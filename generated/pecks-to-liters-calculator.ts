// Auto-generated from pecks-to-liters-calculator-schema.json
import * as z from 'zod';

export interface Pecks_to_liters_calculatorInput {
  peckType: number;
  peckQuantity: number;
  decimalPlaces: number;
  uncertaintyMargin: number;
  roundingMode: number;
  temperature: number;
  dataConfidence?: number;
}

export const Pecks_to_liters_calculatorInputSchema = z.object({
  peckType: z.number().default(0),
  peckQuantity: z.number().default(1),
  decimalPlaces: z.number().default(2),
  uncertaintyMargin: z.number().default(0),
  roundingMode: z.number().default(0),
  temperature: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pecks_to_liters_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.peckType == 0 ? 8.80977 : 9.09218; results["conversionFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.peckQuantity * (asFormulaNumber(results["conversionFactor"])); results["liters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["liters"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePecks_to_liters_calculator(input: Pecks_to_liters_calculatorInput): Pecks_to_liters_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["liters"]);
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


export interface Pecks_to_liters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
