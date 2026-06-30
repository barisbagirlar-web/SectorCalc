// Auto-generated from rent-vs-buy-calculator-schema.json
import * as z from 'zod';

export interface Rent_vs_buy_calculatorInput {
  dataConfidence?: number;
  evFiyati: number;
  yillikKira: number;
}

export const Rent_vs_buy_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  evFiyati: z.number().min(0).default(2000000),
  yillikKira: z.number().min(0).default(120000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rent_vs_buy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["evFiyati"] / Math.max(1, input["yillikKira"]); results["oran"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oran"] = Number.NaN; }
  try { const v = input["evFiyati"] / Math.max(1, input["yillikKira"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateRent_vs_buy_calculator(input: Rent_vs_buy_calculatorInput): Rent_vs_buy_calculatorOutput {
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
    unit: "ratio",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Rent_vs_buy_calculatorOutput {
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

export const Rent_vs_buy_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "ratio",
  breakdownKeys: ["oran"],
} as const;
