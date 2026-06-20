// Auto-generated from poisson-probability-comparison-calculator-schema.json
import * as z from 'zod';

export interface Poisson_probability_comparison_calculatorInput {
  lambdaA: number;
  kA: number;
  lambdaB: number;
  kB: number;
  dataConfidence?: number;
}

export const Poisson_probability_comparison_calculatorInputSchema = z.object({
  lambdaA: z.number().default(2),
  kA: z.number().default(2),
  lambdaB: z.number().default(3),
  kB: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Poisson_probability_comparison_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lambdaA; results["meanA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["meanA"] = Number.NaN; }
  try { const v = input.lambdaA; results["varA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["varA"] = Number.NaN; }
  try { const v = input.lambdaB; results["meanB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["meanB"] = Number.NaN; }
  try { const v = input.lambdaB; results["varB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["varB"] = Number.NaN; }
  return results;
}


export function calculatePoisson_probability_comparison_calculator(input: Poisson_probability_comparison_calculatorInput): Poisson_probability_comparison_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["varB"]);
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


export interface Poisson_probability_comparison_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
