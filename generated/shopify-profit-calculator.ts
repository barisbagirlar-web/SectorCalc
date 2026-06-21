// Auto-generated from shopify-profit-calculator-schema.json
import * as z from 'zod';

export interface Shopify_profit_calculatorInput {
  satis: number;
  urun: number;
  kargo: number;
  platform: number;
  sabit: number;
  dataConfidence?: number;
}

export const Shopify_profit_calculatorInputSchema = z.object({
  satis: z.number().min(0).default(200),
  urun: z.number().min(0).default(80),
  kargo: z.number().min(0).default(20),
  platform: z.number().min(0).default(2.9),
  sabit: z.number().min(0).default(2.35),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Shopify_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.satis - input.urun - input.kargo - (input.satis * input.platform / 100) - input.sabit; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateShopify_profit_calculator(input: Shopify_profit_calculatorInput): Shopify_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Factor in return rates and chargebacks.","Review platform fee schedules regularly."];
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


export interface Shopify_profit_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Shopify_profit_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

