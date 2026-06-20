// Auto-generated from covariance-calculator-schema.json
import * as z from 'zod';

export interface Covariance_calculatorInput {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  x4: number;
  y4: number;
  dataConfidence?: number;
}

export const Covariance_calculatorInputSchema = z.object({
  x1: z.number().default(0),
  y1: z.number().default(0),
  x2: z.number().default(0),
  y2: z.number().default(0),
  x3: z.number().default(0),
  y3: z.number().default(0),
  x4: z.number().default(0),
  y4: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Covariance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.x1 + input.x2 + input.x3 + input.x4) / 4; results["mean_x"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mean_x"] = Number.NaN; }
  try { const v = (input.y1 + input.y2 + input.y3 + input.y4) / 4; results["mean_y"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mean_y"] = Number.NaN; }
  try { const v = (input.x1 - (toNumericFormulaValue(results["mean_x"]))) * (input.y1 - (toNumericFormulaValue(results["mean_y"]))); results["diff_prod_1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["diff_prod_1"] = Number.NaN; }
  try { const v = (input.x2 - (toNumericFormulaValue(results["mean_x"]))) * (input.y2 - (toNumericFormulaValue(results["mean_y"]))); results["diff_prod_2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["diff_prod_2"] = Number.NaN; }
  try { const v = (input.x3 - (toNumericFormulaValue(results["mean_x"]))) * (input.y3 - (toNumericFormulaValue(results["mean_y"]))); results["diff_prod_3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["diff_prod_3"] = Number.NaN; }
  try { const v = (input.x4 - (toNumericFormulaValue(results["mean_x"]))) * (input.y4 - (toNumericFormulaValue(results["mean_y"]))); results["diff_prod_4"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["diff_prod_4"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["diff_prod_1"])) + (toNumericFormulaValue(results["diff_prod_2"])) + (toNumericFormulaValue(results["diff_prod_3"])) + (toNumericFormulaValue(results["diff_prod_4"])); results["sum_diff_prod"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sum_diff_prod"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["sum_diff_prod"])) / 3; results["covariance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["covariance"] = Number.NaN; }
  return results;
}


export function calculateCovariance_calculator(input: Covariance_calculatorInput): Covariance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["covariance"]);
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


export interface Covariance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
