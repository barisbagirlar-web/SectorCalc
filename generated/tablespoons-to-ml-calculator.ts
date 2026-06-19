// Auto-generated from tablespoons-to-ml-calculator-schema.json
import * as z from 'zod';

export interface Tablespoons_to_ml_calculatorInput {
  tablespoons: number;
  batchSize: number;
  conversionType: number;
  precision: number;
  customFactor: number;
  dataConfidence?: number;
}

export const Tablespoons_to_ml_calculatorInputSchema = z.object({
  tablespoons: z.number().default(1),
  batchSize: z.number().default(1),
  conversionType: z.number().default(1),
  precision: z.number().default(2),
  customFactor: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tablespoons_to_ml_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.customFactor > 0 ? input.customFactor : (input.conversionType === 1 ? 14.7868 : input.conversionType === 2 ? 15 : input.conversionType === 3 ? 17.7582 : 20); results["conversionFactorUsed"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["conversionFactorUsed"] = 0; }
  try { const v = input.tablespoons * input.batchSize; results["totalTablespoons"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTablespoons"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTablespoons_to_ml_calculator(input: Tablespoons_to_ml_calculatorInput): Tablespoons_to_ml_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalTablespoons"]));
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


export interface Tablespoons_to_ml_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
