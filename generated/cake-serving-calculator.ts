// Auto-generated from cake-serving-calculator-schema.json
import * as z from 'zod';

export interface Cake_serving_calculatorInput {
  shape: number;
  dim1: number;
  dim2: number;
  servingArea: number;
  dataConfidence?: number;
}

export const Cake_serving_calculatorInputSchema = z.object({
  shape: z.number().default(0),
  dim1: z.number().default(20),
  dim2: z.number().default(0),
  servingArea: z.number().default(25),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cake_serving_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.shape === 0 ? Math.PI * (input.dim1/2) ** 2 : input.dim1 * input.dim2; results["cakeArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cakeArea"] = 0; }
  try { const v = (asFormulaNumber(results["cakeArea"])) / input.servingArea; results["totalServings"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalServings"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCake_serving_calculator(input: Cake_serving_calculatorInput): Cake_serving_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalServings"]);
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


export interface Cake_serving_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
