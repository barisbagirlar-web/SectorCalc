// Auto-generated from anova-calculator-schema.json
import * as z from 'zod';

export interface Anova_calculatorInput {
  group1_n: number;
  group1_mean: number;
  group1_sd: number;
  group2_n: number;
  group2_mean: number;
  group2_sd: number;
  confidenceLevel: number;
  dataConfidence?: number;
}

export const Anova_calculatorInputSchema = z.object({
  group1_n: z.number().default(10),
  group1_mean: z.number().default(50),
  group1_sd: z.number().default(10),
  group2_n: z.number().default(10),
  group2_mean: z.number().default(55),
  group2_sd: z.number().default(12),
  confidenceLevel: z.number().default(0.95),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Anova_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.group1_n + input.group2_n; results["total_n"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_n"] = Number.NaN; }
  try { const v = (input.group1_n * input.group1_mean + input.group2_n * input.group2_mean) / (toNumericFormulaValue(results["total_n"])); results["grand_mean"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grand_mean"] = Number.NaN; }
  try { const v = input.group1_n * (input.group1_mean - (toNumericFormulaValue(results["grand_mean"])))**2 + input.group2_n * (input.group2_mean - (toNumericFormulaValue(results["grand_mean"])))**2; results["SSB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SSB"] = Number.NaN; }
  try { const v = (input.group1_n - 1) * input.group1_sd**2 + (input.group2_n - 1) * input.group2_sd**2; results["SSW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SSW"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_n"])) - 2; results["dfW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dfW"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["SSW"])) / (toNumericFormulaValue(results["dfW"])); results["MSW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MSW"] = Number.NaN; }
  return results;
}


export function calculateAnova_calculator(input: Anova_calculatorInput): Anova_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["MSW"]);
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


export interface Anova_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
