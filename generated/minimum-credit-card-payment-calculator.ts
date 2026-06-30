// Auto-generated from minimum-credit-card-payment-calculator-schema.json
import * as z from 'zod';

export interface Minimum_credit_card_payment_calculatorInput {
  dataConfidence?: number;
  bakiye: number;
  asgariOran: number;
}

export const Minimum_credit_card_payment_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  bakiye: z.number().min(0).default(10000),
  asgariOran: z.number().min(0).max(100).default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Minimum_credit_card_payment_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(input["bakiye"] * input["asgariOran"] / 100, 10); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateMinimum_credit_card_payment_calculator(input: Minimum_credit_card_payment_calculatorInput): Minimum_credit_card_payment_calculatorOutput {
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Minimum_credit_card_payment_calculatorOutput {
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

export const Minimum_credit_card_payment_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;
