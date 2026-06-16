// Auto-generated from mannings-equation-calculator-schema.json
import * as z from 'zod';

export interface Mannings_equation_calculatorInput {
  n: number;
  R: number;
  S: number;
  A: number;
}

export const Mannings_equation_calculatorInputSchema = z.object({
  n: z.number().default(0.013),
  R: z.number().default(1),
  S: z.number().default(0.001),
  A: z.number().default(5),
});

function evaluateAllFormulas(input: Mannings_equation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((1 / input.n) * Math.pow(input.R, 2/3) * Math.sqrt(input.S)); results["V"] = Number.isFinite(v) ? v : 0; } catch { results["V"] = 0; }
  try { const v = ((1 / input.n) * input.A * Math.pow(input.R, 2/3) * Math.sqrt(input.S)); results["Q"] = Number.isFinite(v) ? v : 0; } catch { results["Q"] = 0; }
  return results;
}


export function calculateMannings_equation_calculator(input: Mannings_equation_calculatorInput): Mannings_equation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Q"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Mannings_equation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
