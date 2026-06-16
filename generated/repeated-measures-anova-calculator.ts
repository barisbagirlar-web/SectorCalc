// Auto-generated from repeated-measures-anova-calculator-schema.json
import * as z from 'zod';

export interface Repeated_measures_anova_calculatorInput {
  numberOfConditions: number;
  numberOfSubjects: number;
  ssCondition: number;
  ssError: number;
}

export const Repeated_measures_anova_calculatorInputSchema = z.object({
  numberOfConditions: z.number().default(3),
  numberOfSubjects: z.number().default(10),
  ssCondition: z.number().default(100),
  ssError: z.number().default(50),
});

function evaluateAllFormulas(input: Repeated_measures_anova_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfConditions - 1; results["dfCondition"] = Number.isFinite(v) ? v : 0; } catch { results["dfCondition"] = 0; }
  try { const v = (input.numberOfConditions - 1) * (input.numberOfSubjects - 1); results["dfError"] = Number.isFinite(v) ? v : 0; } catch { results["dfError"] = 0; }
  try { const v = input.ssCondition / (input.numberOfConditions - 1); results["msCondition"] = Number.isFinite(v) ? v : 0; } catch { results["msCondition"] = 0; }
  try { const v = input.ssError / ((input.numberOfConditions - 1) * (input.numberOfSubjects - 1)); results["msError"] = Number.isFinite(v) ? v : 0; } catch { results["msError"] = 0; }
  try { const v = (input.ssCondition / (input.numberOfConditions - 1)) / (input.ssError / ((input.numberOfConditions - 1) * (input.numberOfSubjects - 1))); results["F"] = Number.isFinite(v) ? v : 0; } catch { results["F"] = 0; }
  try { const v = input.ssCondition / (input.ssCondition + input.ssError); results["eta2"] = Number.isFinite(v) ? v : 0; } catch { results["eta2"] = 0; }
  return results;
}


export function calculateRepeated_measures_anova_calculator(input: Repeated_measures_anova_calculatorInput): Repeated_measures_anova_calculatorOutput {
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


export interface Repeated_measures_anova_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
