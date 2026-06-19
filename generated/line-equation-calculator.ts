// Auto-generated from line-equation-calculator-schema.json
import * as z from 'zod';

export interface Line_equation_calculatorInput {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x_val: number;
  dataConfidence?: number;
}

export const Line_equation_calculatorInputSchema = z.object({
  x1: z.number().default(0),
  y1: z.number().default(0),
  x2: z.number().default(0),
  y2: z.number().default(0),
  x_val: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Line_equation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.y2 - input.y1) / (input.x2 - input.x1); results["slope"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["slope"] = 0; }
  try { const v = input.y1 - (asFormulaNumber(results["slope"])) * input.x1; results["intercept"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["intercept"] = 0; }
  try { const v = (asFormulaNumber(results["slope"])) * input.x_val + (asFormulaNumber(results["intercept"])); results["y_at_x"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["y_at_x"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLine_equation_calculator(input: Line_equation_calculatorInput): Line_equation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["slope"]);
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


export interface Line_equation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
