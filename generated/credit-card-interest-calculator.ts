// Auto-generated from credit-card-interest-calculator-schema.json
import * as z from 'zod';

export interface Credit_card_interest_calculatorInput {
  bakiye: number;
  yillikFaiz: number;
  gun: number;
  dataConfidence?: number;
}

export const Credit_card_interest_calculatorInputSchema = z.object({
  bakiye: z.number().min(0).default(10000),
  yillikFaiz: z.number().min(0).default(120),
  gun: z.number().min(0).default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Credit_card_interest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bakiye * (input.yillikFaiz / 36500) * input.gun; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateCredit_card_interest_calculator(input: Credit_card_interest_calculatorInput): Credit_card_interest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Compare multiple loan offers before committing.","Consider total cost including fees."];
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Credit_card_interest_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Credit_card_interest_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

