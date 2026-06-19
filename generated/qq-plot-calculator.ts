// Auto-generated from qq-plot-calculator-schema.json
import * as z from 'zod';

export interface Qq_plot_calculatorInput {
  sampleMean: number;
  sampleStdDev: number;
  sampleValue: number;
  referenceMean: number;
  referenceStdDev: number;
  dataConfidence?: number;
}

export const Qq_plot_calculatorInputSchema = z.object({
  sampleMean: z.number().default(0),
  sampleStdDev: z.number().default(1),
  sampleValue: z.number().default(0),
  referenceMean: z.number().default(0),
  referenceStdDev: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Qq_plot_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sampleValue - input.sampleMean) / input.sampleStdDev; results["sampleZ"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sampleZ"] = 0; }
  try { const v = input.referenceMean + input.referenceStdDev * ((input.sampleValue - input.sampleMean) / input.sampleStdDev); results["referenceQuantile"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["referenceQuantile"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateQq_plot_calculator(input: Qq_plot_calculatorInput): Qq_plot_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["referenceQuantile"]);
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


export interface Qq_plot_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
