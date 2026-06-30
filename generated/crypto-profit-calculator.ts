// Auto-generated from crypto-profit-calculator-schema.json
import * as z from 'zod';

export interface Crypto_profit_calculatorInput {
  dataConfidence?: number;
  alis: number;
  satis: number;
  miktar: number;
  komisyon: number;
}

export const Crypto_profit_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  alis: z.number().min(0).default(1000),
  satis: z.number().min(0).default(1500),
  miktar: z.number().min(0).default(10),
  komisyon: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Crypto_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["satis"] - input["alis"]) * input["miktar"] * (1 - input["komisyon"] / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateCrypto_profit_calculator(input: Crypto_profit_calculatorInput): Crypto_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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

export interface Crypto_profit_calculatorOutput {
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

export const Crypto_profit_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;
