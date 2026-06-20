// Auto-generated from repeated-measures-anova-calculator-schema.json
import * as z from 'zod';

export interface Repeated_measures_anova_calculatorInput {
  numberOfConditions: number;
  numberOfSubjects: number;
  ssCondition: number;
  ssError: number;
  dataConfidence?: number;
}

export const Repeated_measures_anova_calculatorInputSchema = z.object({
  numberOfConditions: z.number().default(3),
  numberOfSubjects: z.number().default(10),
  ssCondition: z.number().default(100),
  ssError: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Repeated_measures_anova_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfConditions - 1; results["dfCondition"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dfCondition"] = Number.NaN; }
  try { const v = (input.numberOfConditions - 1) * (input.numberOfSubjects - 1); results["dfError"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dfError"] = Number.NaN; }
  try { const v = input.ssCondition / (input.numberOfConditions - 1); results["msCondition"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["msCondition"] = Number.NaN; }
  try { const v = input.ssError / ((input.numberOfConditions - 1) * (input.numberOfSubjects - 1)); results["msError"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["msError"] = Number.NaN; }
  try { const v = (input.ssCondition / (input.numberOfConditions - 1)) / (input.ssError / ((input.numberOfConditions - 1) * (input.numberOfSubjects - 1))); results["F"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["F"] = Number.NaN; }
  try { const v = input.ssCondition / (input.ssCondition + input.ssError); results["eta2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eta2"] = Number.NaN; }
  return results;
}


export function calculateRepeated_measures_anova_calculator(input: Repeated_measures_anova_calculatorInput): Repeated_measures_anova_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["F"]);
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


export interface Repeated_measures_anova_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
