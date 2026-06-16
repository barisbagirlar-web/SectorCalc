// Auto-generated from positive-predictive-value-calculator-schema.json
import * as z from 'zod';

export interface Positive_predictive_value_calculatorInput {
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
}

export const Positive_predictive_value_calculatorInputSchema = z.object({
  truePositives: z.number().default(0),
  falsePositives: z.number().default(0),
  trueNegatives: z.number().default(0),
  falseNegatives: z.number().default(0),
});

function evaluateAllFormulas(input: Positive_predictive_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.truePositives / (input.truePositives + input.falsePositives); results["positive_predictive_value"] = Number.isFinite(v) ? v : 0; } catch { results["positive_predictive_value"] = 0; }
  try { const v = input.truePositives / (input.truePositives + input.falseNegatives); results["sensitivity"] = Number.isFinite(v) ? v : 0; } catch { results["sensitivity"] = 0; }
  try { const v = input.trueNegatives / (input.trueNegatives + input.falsePositives); results["specificity"] = Number.isFinite(v) ? v : 0; } catch { results["specificity"] = 0; }
  try { const v = input.trueNegatives / (input.trueNegatives + input.falseNegatives); results["negative_predictive_value"] = Number.isFinite(v) ? v : 0; } catch { results["negative_predictive_value"] = 0; }
  try { const v = (input.truePositives + input.trueNegatives) / (input.truePositives + input.falsePositives + input.trueNegatives + input.falseNegatives); results["accuracy"] = Number.isFinite(v) ? v : 0; } catch { results["accuracy"] = 0; }
  return results;
}


export function calculatePositive_predictive_value_calculator(input: Positive_predictive_value_calculatorInput): Positive_predictive_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["positive_predictive_value"] ?? 0;
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


export interface Positive_predictive_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
