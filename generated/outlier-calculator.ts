// Auto-generated from outlier-calculator-schema.json
import * as z from 'zod';

export interface Outlier_calculatorInput {
  q1: number;
  q3: number;
  value: number;
  multiplier: number;
}

export const Outlier_calculatorInputSchema = z.object({
  q1: z.number().default(0),
  q3: z.number().default(0),
  value: z.number().default(0),
  multiplier: z.number().default(1.5),
});

function evaluateAllFormulas(input: Outlier_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.q3 - input.q1; results["iqr"] = Number.isFinite(v) ? v : 0; } catch { results["iqr"] = 0; }
  try { const v = input.q1 - input.multiplier * (input.q3 - input.q1); results["lowerBound"] = Number.isFinite(v) ? v : 0; } catch { results["lowerBound"] = 0; }
  try { const v = input.q3 + input.multiplier * (input.q3 - input.q1); results["upperBound"] = Number.isFinite(v) ? v : 0; } catch { results["upperBound"] = 0; }
  try { const v = (input.value < (input.q1 - input.multiplier * (input.q3 - input.q1)) || input.value > (input.q3 + input.multiplier * (input.q3 - input.q1))) ? 'Yes' : 'No'; results["outlierStatus"] = Number.isFinite(v) ? v : 0; } catch { results["outlierStatus"] = 0; }
  return results;
}


export function calculateOutlier_calculator(input: Outlier_calculatorInput): Outlier_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["outlierStatus"] ?? 0;
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


export interface Outlier_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
