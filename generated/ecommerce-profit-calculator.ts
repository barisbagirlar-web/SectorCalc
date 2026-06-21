// Auto-generated from ecommerce-profit-calculator-schema.json
import * as z from 'zod';

export interface Ecommerce_profit_calculatorInput {
  ciro: number;
  cogs: number;
  pazarlama: number;
  operasyon: number;
  dataConfidence?: number;
}

export const Ecommerce_profit_calculatorInputSchema = z.object({
  ciro: z.number().min(0).default(500000),
  cogs: z.number().min(0).default(300000),
  pazarlama: z.number().min(0).default(80000),
  operasyon: z.number().min(0).default(50000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ecommerce_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ciro - input.cogs - input.pazarlama - input.operasyon; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEcommerce_profit_calculator(input: Ecommerce_profit_calculatorInput): Ecommerce_profit_calculatorOutput {
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


export interface Ecommerce_profit_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ecommerce_profit_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

