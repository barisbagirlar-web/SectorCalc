// Auto-generated from variance-calculator-schema.json
import * as z from 'zod';

export interface Variance_calculatorInput {
  n: number;
  sumX: number;
  sumX2: number;
  isPopulation: number;
  dataConfidence?: number;
}

export const Variance_calculatorInputSchema = z.object({
  n: z.number().default(1),
  sumX: z.number().default(0),
  sumX2: z.number().default(0),
  isPopulation: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Variance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.n > 1) ? ( (input.isPopulation == 1) ? (input.sumX2 - (input.sumX * input.sumX) / input.n) / input.n : (input.sumX2 - (input.sumX * input.sumX) / input.n) / (input.n - 1) ) : 0; results["variance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["variance"] = 0; }
  try { const v = (input.n > 0) ? input.sumX / input.n : 0; results["mean"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mean"] = 0; }
  try { const v = (input.n > 1) ? (input.sumX2 - (input.sumX * input.sumX) / input.n) : 0; results["sumOfSquaredDeviations"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sumOfSquaredDeviations"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVariance_calculator(input: Variance_calculatorInput): Variance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["variance"]));
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


export interface Variance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
