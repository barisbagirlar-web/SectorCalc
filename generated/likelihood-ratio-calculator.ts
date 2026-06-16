// Auto-generated from likelihood-ratio-calculator-schema.json
import * as z from 'zod';

export interface Likelihood_ratio_calculatorInput {
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  trueNegatives: number;
}

export const Likelihood_ratio_calculatorInputSchema = z.object({
  truePositives: z.number().default(0),
  falsePositives: z.number().default(0),
  falseNegatives: z.number().default(0),
  trueNegatives: z.number().default(0),
});

function evaluateAllFormulas(input: Likelihood_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.truePositives + input.falseNegatives > 0 ? input.truePositives / (input.truePositives + input.falseNegatives) : 0; results["sensitivity"] = Number.isFinite(v) ? v : 0; } catch { results["sensitivity"] = 0; }
  try { const v = input.trueNegatives + input.falsePositives > 0 ? input.trueNegatives / (input.trueNegatives + input.falsePositives) : 0; results["specificity"] = Number.isFinite(v) ? v : 0; } catch { results["specificity"] = 0; }
  try { const v = (results["specificity"] ?? 0) < 1 ? (results["sensitivity"] ?? 0) / (1 - (results["specificity"] ?? 0)) : 0; results["lrPositive"] = Number.isFinite(v) ? v : 0; } catch { results["lrPositive"] = 0; }
  try { const v = (results["specificity"] ?? 0) > 0 ? (1 - (results["sensitivity"] ?? 0)) / (results["specificity"] ?? 0) : 0; results["lrNegative"] = Number.isFinite(v) ? v : 0; } catch { results["lrNegative"] = 0; }
  return results;
}


export function calculateLikelihood_ratio_calculator(input: Likelihood_ratio_calculatorInput): Likelihood_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["lrPositive"] ?? 0;
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


export interface Likelihood_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
