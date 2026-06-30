// Auto-generated from debt-to-income-ratio-calculator-schema.json
import * as z from 'zod';

export interface Debt_to_income_ratio_calculatorInput {
  dataConfidence?: number;
  aylikBorc: number;
  brutGelir: number;
}

export const Debt_to_income_ratio_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  aylikBorc: z.number().min(0).default(15000),
  brutGelir: z.number().min(0).default(50000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Debt_to_income_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["aylikBorc"] / Math.max(1, input["brutGelir"])) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateDebt_to_income_ratio_calculator(input: Debt_to_income_ratio_calculatorInput): Debt_to_income_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Compare multiple loan offers before committing.","Consider total cost including fees."];
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Debt_to_income_ratio_calculatorOutput {
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

export const Debt_to_income_ratio_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;
