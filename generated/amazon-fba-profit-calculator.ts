// Auto-generated from amazon-fba-profit-calculator-schema.json
import * as z from 'zod';

export interface Amazon_fba_profit_calculatorInput {
  dataConfidence?: number;
  satis: number;
  urunMaliyeti: number;
  fbaUcreti: number;
  komisyon: number;
}

export const Amazon_fba_profit_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  satis: z.number().min(0).default(200),
  urunMaliyeti: z.number().min(0).default(80),
  fbaUcreti: z.number().min(0).default(30),
  komisyon: z.number().min(0).max(100).default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Amazon_fba_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["satis"] - input["urunMaliyeti"] - input["fbaUcreti"] - (input["satis"] * input["komisyon"] / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateAmazon_fba_profit_calculator(input: Amazon_fba_profit_calculatorInput): Amazon_fba_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Factor in return rates and chargebacks.","Review platform fee schedules regularly."];
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

export interface Amazon_fba_profit_calculatorOutput {
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

export const Amazon_fba_profit_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;
