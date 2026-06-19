// Auto-generated from positive-predictive-value-calculator-schema.json
import * as z from 'zod';

export interface Positive_predictive_value_calculatorInput {
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
  dataConfidence?: number;
}

export const Positive_predictive_value_calculatorInputSchema = z.object({
  truePositives: z.number().default(0),
  falsePositives: z.number().default(0),
  trueNegatives: z.number().default(0),
  falseNegatives: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Positive_predictive_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.truePositives / (input.truePositives + input.falsePositives); results["positive_predictive_value"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["positive_predictive_value"] = 0; }
  try { const v = input.truePositives / (input.truePositives + input.falseNegatives); results["sensitivity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sensitivity"] = 0; }
  try { const v = input.trueNegatives / (input.trueNegatives + input.falsePositives); results["specificity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["specificity"] = 0; }
  try { const v = input.trueNegatives / (input.trueNegatives + input.falseNegatives); results["negative_predictive_value"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["negative_predictive_value"] = 0; }
  try { const v = (input.truePositives + input.trueNegatives) / (input.truePositives + input.falsePositives + input.trueNegatives + input.falseNegatives); results["accuracy"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["accuracy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePositive_predictive_value_calculator(input: Positive_predictive_value_calculatorInput): Positive_predictive_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["positive_predictive_value"]));
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


export interface Positive_predictive_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
