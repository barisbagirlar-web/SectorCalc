// Auto-generated from anova-f-statistic-calculator-schema.json
import * as z from 'zod';

export interface Anova_f_statistic_calculatorInput {
  grup1: number;
  grup2: number;
  grup1N: number;
  grup2N: number;
  grup1Varyans: number;
  grup2Varyans: number;
  dataConfidence?: number;
}

export const Anova_f_statistic_calculatorInputSchema = z.object({
  grup1: z.number().min(0).default(100),
  grup2: z.number().min(0).default(110),
  grup1N: z.number().min(2).default(30),
  grup2N: z.number().min(2).default(30),
  grup1Varyans: z.number().min(0).default(225),
  grup2Varyans: z.number().min(0).default(225),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Anova_f_statistic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.grup1*input.grup1N+input.grup2*input.grup2N)/(input.grup1N+input.grup2N); results["grandMean"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grandMean"] = Number.NaN; }
  try { const v = input.grup1N*(input.grup1-(toNumericFormulaValue(results["grandMean"])))**2+input.grup2N*(input.grup2-(toNumericFormulaValue(results["grandMean"])))**2; results["ssBetween"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ssBetween"] = Number.NaN; }
  try { const v = (input.grup1N-1)*input.grup1Varyans+(input.grup2N-1)*input.grup2Varyans; results["ssWithin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ssWithin"] = Number.NaN; }
  try { const v = (input.grup1N*(input.grup1-(toNumericFormulaValue(results["grandMean"])))**2+input.grup2N*(input.grup2-(toNumericFormulaValue(results["grandMean"])))**2)/(2-1); results["msBetween"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["msBetween"] = Number.NaN; }
  try { const v = ((input.grup1N-1)*input.grup1Varyans+(input.grup2N-1)*input.grup2Varyans)/(input.grup1N+input.grup2N-2); results["msWithin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["msWithin"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["msBetween"]))/(toNumericFormulaValue(results["msWithin"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateAnova_f_statistic_calculator(input: Anova_f_statistic_calculatorInput): Anova_f_statistic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify statistical assumptions before making decisions.","Use larger sample sizes for better accuracy."];
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
    unit: "F-value",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Anova_f_statistic_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Anova_f_statistic_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "F-value",
  breakdownKeys: ["sonuc"],
} as const;

