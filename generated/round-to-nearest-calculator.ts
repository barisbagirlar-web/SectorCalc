// Auto-generated from round-to-nearest-calculator-schema.json
import * as z from 'zod';

export interface Round_to_nearest_calculatorInput {
  value: number;
  nearest: number;
  offset: number;
  decimals: number;
  dataConfidence?: number;
}

export const Round_to_nearest_calculatorInputSchema = z.object({
  value: z.number().default(123.456),
  nearest: z.number().default(0.5),
  offset: z.number().default(0),
  decimals: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Round_to_nearest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.value - input.offset) / input.nearest; results["adjustedValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedValue"] = 0; }
  try { const v = (input.value - input.offset) / input.nearest; results["adjustedValue_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedValue_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRound_to_nearest_calculator(input: Round_to_nearest_calculatorInput): Round_to_nearest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedValue_aux"]);
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


export interface Round_to_nearest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
