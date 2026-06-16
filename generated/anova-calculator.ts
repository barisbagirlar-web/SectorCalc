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

function evaluateAllFormulas(input: Anova_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.group1_n + input.group2_n; results["total_n"] = Number.isFinite(v) ? v : 0; } catch { results["total_n"] = 0; }
  try { const v = (input.group1_n * input.group1_mean + input.group2_n * input.group2_mean) / (results["total_n"] ?? 0); results["grand_mean"] = Number.isFinite(v) ? v : 0; } catch { results["grand_mean"] = 0; }
  try { const v = input.group1_n * (input.group1_mean - (results["grand_mean"] ?? 0))**2 + input.group2_n * (input.group2_mean - (results["grand_mean"] ?? 0))**2; results["SSB"] = Number.isFinite(v) ? v : 0; } catch { results["SSB"] = 0; }
  try { const v = (input.group1_n - 1) * input.group1_sd**2 + (input.group2_n - 1) * input.group2_sd**2; results["SSW"] = Number.isFinite(v) ? v : 0; } catch { results["SSW"] = 0; }
  try { const v = 1; results["dfB"] = Number.isFinite(v) ? v : 0; } catch { results["dfB"] = 0; }
  try { const v = (results["total_n"] ?? 0) - 2; results["dfW"] = Number.isFinite(v) ? v : 0; } catch { results["dfW"] = 0; }
  try { const v = (results["SSB"] ?? 0) / (results["dfB"] ?? 0); results["MSB"] = Number.isFinite(v) ? v : 0; } catch { results["MSB"] = 0; }
  try { const v = (results["SSW"] ?? 0) / (results["dfW"] ?? 0); results["MSW"] = Number.isFinite(v) ? v : 0; } catch { results["MSW"] = 0; }
  try { const v = (results["MSB"] ?? 0) / (results["MSW"] ?? 0); results["F"] = Number.isFinite(v) ? v : 0; } catch { results["F"] = 0; }
  return results;
}


export function calculateAnova_calculator(input: Anova_calculatorInput): Anova_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["F"] ?? 0;
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


export interface Anova_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
