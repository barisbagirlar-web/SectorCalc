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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Generating_function_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a0; results["term0"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["term0"] = Number.NaN; }
  try { const v = input.a1 * input.x; results["term1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["term1"] = Number.NaN; }
  try { const v = input.a2 * input.x ** 2; results["term2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["term2"] = Number.NaN; }
  try { const v = input.a3 * input.x ** 3; results["term3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["term3"] = Number.NaN; }
  try { const v = input.a4 * input.x ** 4; results["term4"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["term4"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["term0"])) + (toNumericFormulaValue(results["term1"])) + (toNumericFormulaValue(results["term2"])) + (toNumericFormulaValue(results["term3"])) + (toNumericFormulaValue(results["term4"])); results["GF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["GF"] = Number.NaN; }
  return results;
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
