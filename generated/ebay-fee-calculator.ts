// Auto-generated from ebay-fee-calculator-schema.json
import * as z from 'zod';

export interface Ebay_fee_calculatorInput {
  satis: number;
  kategori: number;
  sabit: number;
  dataConfidence?: number;
}

export const Ebay_fee_calculatorInputSchema = z.object({
  satis: z.number().min(0).default(500),
  kategori: z.number().min(0).default(13.25),
  sabit: z.number().min(0).default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ebay_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.satis * input.kategori / 100) + input.sabit; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEbay_fee_calculator(input: Ebay_fee_calculatorInput): Ebay_fee_calculatorOutput {
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


export interface Ebay_fee_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ebay_fee_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

