// Auto-generated from slope-intercept-form-calculator-schema.json
import * as z from 'zod';

export interface Slope_intercept_form_calculatorInput {
  slope: number;
  yIntercept: number;
  xValue: number;
  yValue: number;
  dataConfidence?: number;
}

export const Slope_intercept_form_calculatorInputSchema = z.object({
  slope: z.number().default(1),
  yIntercept: z.number().default(0),
  xValue: z.number().default(0),
  yValue: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Slope_intercept_form_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.slope * input.xValue + input.yIntercept; results["y_calc"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["y_calc"] = 0; }
  try { const v = (input.yValue - input.yIntercept) / input.slope; results["x_calc"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["x_calc"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSlope_intercept_form_calculator(input: Slope_intercept_form_calculatorInput): Slope_intercept_form_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["x_calc"]));
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


export interface Slope_intercept_form_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
