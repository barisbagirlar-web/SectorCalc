// Auto-generated from long-tons-to-kg-calculator-schema.json
import * as z from 'zod';

export interface Long_tons_to_kg_calculatorInput {
  longTons: number;
  quantity: number;
  conversionFactor: number;
  safetyMargin: number;
  decimals: number;
  dataConfidence?: number;
}

export const Long_tons_to_kg_calculatorInputSchema = z.object({
  longTons: z.number().default(0),
  quantity: z.number().default(1),
  conversionFactor: z.number().default(1016.0469088),
  safetyMargin: z.number().default(0),
  decimals: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Long_tons_to_kg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.longTons * input.conversionFactor * input.quantity; results["exactKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["exactKg"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["exactKg"])) * (1 + input.safetyMargin / 100); results["withSafetyKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["withSafetyKg"] = Number.NaN; }
  return results;
}


export function calculateLong_tons_to_kg_calculator(input: Long_tons_to_kg_calculatorInput): Long_tons_to_kg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["withSafetyKg"]);
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


export interface Long_tons_to_kg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
