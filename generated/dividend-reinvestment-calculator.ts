// Auto-generated from dividend-reinvestment-calculator-schema.json
import * as z from 'zod';

export interface Dividend_reinvestment_calculatorInput {
  hisse: number;
  temettu: number;
  fiyat: number;
  yil: number;
  getiri: number;
  dataConfidence?: number;
}

export const Dividend_reinvestment_calculatorInputSchema = z.object({
  hisse: z.number().min(0).default(100),
  temettu: z.number().min(0).default(2),
  fiyat: z.number().min(0).default(50),
  yil: z.number().min(0).default(10),
  getiri: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dividend_reinvestment_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hisse + ((input.temettu * input.hisse) / Math.max(1, input.fiyat)); results["yeniHisse"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yeniHisse"] = Number.NaN; }
  try { const v = (input.hisse + ((input.temettu * input.hisse) / Math.max(1, input.fiyat))) * Math.pow(1 + input.getiri / 100, input.yil) * input.fiyat; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDividend_reinvestment_calculator(input: Dividend_reinvestment_calculatorInput): Dividend_reinvestment_calculatorOutput {
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


export interface Dividend_reinvestment_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Dividend_reinvestment_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

