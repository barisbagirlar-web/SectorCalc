// Auto-generated from bond-price-calculator-schema.json
import * as z from 'zod';

export interface Bond_price_calculatorInput {
  nominal: number;
  kupon: number;
  piyasaFaizi: number;
  vade: number;
  dataConfidence?: number;
}

export const Bond_price_calculatorInputSchema = z.object({
  nominal: z.number().min(0).default(1000),
  kupon: z.number().min(0).default(8),
  piyasaFaizi: z.number().min(0).default(10),
  vade: z.number().min(1).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bond_price_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nominal * (input.kupon / 100); results["kuponOdeme"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kuponOdeme"] = Number.NaN; }
  try { const v = input.nominal / Math.pow(1 + input.piyasaFaizi / 100, input.vade) + (input.nominal * (input.kupon / 100)) * ((1 - Math.pow(1 / (1 + input.piyasaFaizi / 100), input.vade)) / (input.piyasaFaizi / 100)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBond_price_calculator(input: Bond_price_calculatorInput): Bond_price_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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


export interface Bond_price_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Bond_price_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

