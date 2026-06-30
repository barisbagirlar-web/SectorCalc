// Auto-generated from basal-metabolic-rate-mifflin-st-jeor-calculator-schema.json
import * as z from 'zod';

export interface Basal_metabolic_rate_mifflin_st_jeor_calculatorInput {
  dataConfidence?: number;
  agirlik: number;
  boy: number;
  yas: number;
  cinsiyet: number;
}

export const Basal_metabolic_rate_mifflin_st_jeor_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  agirlik: z.number().min(0).default(75),
  boy: z.number().min(0).default(175),
  yas: z.number().min(10).max(100).default(30),
  cinsiyet: z.number().min(0).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Basal_metabolic_rate_mifflin_st_jeor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["cinsiyet"] === 1 ? (10 * input["agirlik"] + 6.25 * input["boy"] - 5 * input["yas"] + 5) : (10 * input["agirlik"] + 6.25 * input["boy"] - 5 * input["yas"] - 161); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateBasal_metabolic_rate_mifflin_st_jeor_calculator(input: Basal_metabolic_rate_mifflin_st_jeor_calculatorInput): Basal_metabolic_rate_mifflin_st_jeor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult a healthcare professional before starting any diet or exercise program.","Individual results may vary."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "kcal",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Basal_metabolic_rate_mifflin_st_jeor_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Basal_metabolic_rate_mifflin_st_jeor_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "kcal",
  breakdownKeys: [],
} as const;
