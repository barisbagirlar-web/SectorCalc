// Auto-generated from percent-error-calculator-schema.json
import * as z from 'zod';

export interface Percent_error_calculatorInput {
  measuredValue: number;
  trueValue: number;
  tolerancePercent: number;
  measurementUncertainty: number;
  coverageFactor: number;
}

export const Percent_error_calculatorInputSchema = z.object({
  measuredValue: z.number().default(0),
  trueValue: z.number().default(100),
  tolerancePercent: z.number().default(5),
  measurementUncertainty: z.number().default(0.1),
  coverageFactor: z.number().default(2),
});

function evaluateAllFormulas(input: Percent_error_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.measuredValue - input.trueValue; results["error"] = Number.isFinite(v) ? v : 0; } catch { results["error"] = 0; }
  try { const v = Math.abs((results["error"] ?? 0)); results["absoluteError"] = Number.isFinite(v) ? v : 0; } catch { results["absoluteError"] = 0; }
  try { const v = (results["absoluteError"] ?? 0) / Math.abs(input.trueValue) * 100; results["percentError"] = Number.isFinite(v) ? v : 0; } catch { results["percentError"] = 0; }
  try { const v = input.coverageFactor * input.measurementUncertainty; results["expandedUncertainty"] = Number.isFinite(v) ? v : 0; } catch { results["expandedUncertainty"] = 0; }
  try { const v = Math.abs((results["percentError"] ?? 0)) <= input.tolerancePercent ? 1 : 0; results["withinTolerance"] = Number.isFinite(v) ? v : 0; } catch { results["withinTolerance"] = 0; }
  return results;
}


export function calculatePercent_error_calculator(input: Percent_error_calculatorInput): Percent_error_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["percentError"] ?? 0;
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


export interface Percent_error_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
