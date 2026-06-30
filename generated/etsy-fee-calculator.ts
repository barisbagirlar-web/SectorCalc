// Auto-generated from etsy-fee-calculator-schema.json
import * as z from 'zod';

export interface Etsy_fee_calculatorInput {
  dataConfidence?: number;
  satis: number;
  listeleme: number;
  islem: number;
  odeme: number;
}

export const Etsy_fee_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  satis: z.number().min(0).default(500),
  listeleme: z.number().min(0).default(3.5),
  islem: z.number().min(0).default(6.5),
  odeme: z.number().min(0).default(3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Etsy_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["listeleme"] + (input["satis"] * input["islem"] / 100) + (input["satis"] * input["odeme"] / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateEtsy_fee_calculator(input: Etsy_fee_calculatorInput): Etsy_fee_calculatorOutput {
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

export interface Etsy_fee_calculatorOutput {
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

export const Etsy_fee_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;
