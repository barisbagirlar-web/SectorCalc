// Auto-generated from scatter-plot-calculator-schema.json
import * as z from 'zod';

export interface Scatter_plot_calculatorInput {
  n: number;
  sumX: number;
  sumY: number;
  sumXY: number;
  sumX2: number;
  sumY2: number;
  dataConfidence?: number;
}

export const Scatter_plot_calculatorInputSchema = z.object({
  n: z.number().default(0),
  sumX: z.number().default(0),
  sumY: z.number().default(0),
  sumXY: z.number().default(0),
  sumX2: z.number().default(0),
  sumY2: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Scatter_plot_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.n * input.sumXY - input.sumX * input.sumY) / (input.n * input.sumX2 - input.sumX * input.sumX); results["slope"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["slope"] = 0; }
  try { const v = (input.sumY - (asFormulaNumber(results["slope"])) * input.sumX) / input.n; results["intercept"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["intercept"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateScatter_plot_calculator(input: Scatter_plot_calculatorInput): Scatter_plot_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["intercept"]);
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


export interface Scatter_plot_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
