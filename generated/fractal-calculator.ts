// Auto-generated from fractal-calculator-schema.json
import * as z from 'zod';

export interface Fractal_calculatorInput {
  numberOfCopies: number;
  scalingFactor: number;
  iterationCount: number;
  initialLength: number;
  dataConfidence?: number;
}

export const Fractal_calculatorInputSchema = z.object({
  numberOfCopies: z.number().default(3),
  scalingFactor: z.number().default(0.333),
  iterationCount: z.number().default(1),
  initialLength: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fractal_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfCopies * input.scalingFactor * input.iterationCount * input.initialLength; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.numberOfCopies * input.scalingFactor * input.iterationCount * input.initialLength; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateFractal_calculator(input: Fractal_calculatorInput): Fractal_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Fractal_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
