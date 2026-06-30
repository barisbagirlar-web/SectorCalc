// Auto-generated from cash-on-cash-return-calculator-schema.json
import * as z from 'zod';

export interface Cash_on_cash_return_calculatorInput {
  dataConfidence?: number;
  yillikNakitAks: number;
  toplamNakitYatirim: number;
}

export const Cash_on_cash_return_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yillikNakitAks: z.number().min(0).default(60000),
  toplamNakitYatirim: z.number().min(0).default(300000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cash_on_cash_return_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["yillikNakitAks"] / Math.max(1, input["toplamNakitYatirim"])) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateCash_on_cash_return_calculator(input: Cash_on_cash_return_calculatorInput): Cash_on_cash_return_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify all property data with official documents.","Consult a mortgage broker for personalized rates."];
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

export interface Cash_on_cash_return_calculatorOutput {
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

export const Cash_on_cash_return_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;
