// Auto-generated from likelihood-ratio-calculator-schema.json
import * as z from 'zod';

export interface Likelihood_ratio_calculatorInput {
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  trueNegatives: number;
  dataConfidence?: number;
}

export const Likelihood_ratio_calculatorInputSchema = z.object({
  truePositives: z.number().default(0),
  falsePositives: z.number().default(0),
  falseNegatives: z.number().default(0),
  trueNegatives: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Likelihood_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.truePositives + input.falseNegatives > 0 ? input.truePositives / (input.truePositives + input.falseNegatives) : 0; results["sensitivity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sensitivity"] = Number.NaN; }
  try { const v = input.trueNegatives + input.falsePositives > 0 ? input.trueNegatives / (input.trueNegatives + input.falsePositives) : 0; results["specificity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["specificity"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["specificity"])) < 1 ? (toNumericFormulaValue(results["sensitivity"])) / (1 - (toNumericFormulaValue(results["specificity"]))) : 0; results["lrPositive"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lrPositive"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["specificity"])) > 0 ? (1 - (toNumericFormulaValue(results["sensitivity"]))) / (toNumericFormulaValue(results["specificity"])) : 0; results["lrNegative"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lrNegative"] = Number.NaN; }
  return results;
}


export function calculateLikelihood_ratio_calculator(input: Likelihood_ratio_calculatorInput): Likelihood_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["lrPositive"]);
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


export interface Likelihood_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
