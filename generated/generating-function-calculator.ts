// Auto-generated from generating-function-calculator-schema.json
import * as z from 'zod';

export interface Generating_function_calculatorInput {
  a0: number;
  a1: number;
  a2: number;
  a3: number;
  a4: number;
  x: number;
  dataConfidence?: number;
}

export const Generating_function_calculatorInputSchema = z.object({
  a0: z.number().default(0),
  a1: z.number().default(0),
  a2: z.number().default(0),
  a3: z.number().default(0),
  a4: z.number().default(0),
  x: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Generating_function_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a0; results["term0"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["term0"] = 0; }
  try { const v = input.a1 * input.x; results["term1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["term1"] = 0; }
  try { const v = input.a2 * input.x ** 2; results["term2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["term2"] = 0; }
  try { const v = input.a3 * input.x ** 3; results["term3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["term3"] = 0; }
  try { const v = input.a4 * input.x ** 4; results["term4"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["term4"] = 0; }
  try { const v = (asFormulaNumber(results["term0"])) + (asFormulaNumber(results["term1"])) + (asFormulaNumber(results["term2"])) + (asFormulaNumber(results["term3"])) + (asFormulaNumber(results["term4"])); results["GF"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["GF"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGenerating_function_calculator(input: Generating_function_calculatorInput): Generating_function_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["GF"]);
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


export interface Generating_function_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
