// Auto-generated from monthly-mortgage-payment-calculator-schema.json
import * as z from 'zod';

export interface Monthly_mortgage_payment_calculatorInput {
  dataConfidence?: number;
  kredi: number;
  faiz: number;
  vade: number;
}

export const Monthly_mortgage_payment_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  kredi: z.number().min(0).default(1000000),
  faiz: z.number().min(0).default(12),
  vade: z.number().min(1).default(120),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Monthly_mortgage_payment_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["faiz"] / 1200; results["aylikFaiz"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["aylikFaiz"] = Number.NaN; }
  try { const v = input["faiz"] === 0 ? input["kredi"] / Math.max(1, input["vade"]) : input["kredi"] * ((input["faiz"] / 1200) / (1 - Math.pow(1 + input["faiz"] / 1200, -input["vade"]))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateMonthly_mortgage_payment_calculator(input: Monthly_mortgage_payment_calculatorInput): Monthly_mortgage_payment_calculatorOutput {
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Monthly_mortgage_payment_calculatorOutput {
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

export const Monthly_mortgage_payment_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["aylikFaiz"],
} as const;
