// Auto-generated from kredi-geri-odeme-payoff-hesaplama-schema.json
import * as z from 'zod';

export interface Kredi_geri_odeme_payoff_hesaplamaInput {
  anapara: number;
  faiz: number;
  odeme: number;
  ekOdeme: number;
  dataConfidence?: number;
}

export const Kredi_geri_odeme_payoff_hesaplamaInputSchema = z.object({
  anapara: z.number().min(0).default(100000),
  faiz: z.number().min(0).default(15),
  odeme: z.number().min(0).default(3000),
  ekOdeme: z.number().min(0).default(1000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kredi_geri_odeme_payoff_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = -Math.log(Math.max(0.0001, 1 - (input.anapara * (input.faiz / 1200)) / (input.odeme + input.ekOdeme))) / Math.log(1 + input.faiz / 1200); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKredi_geri_odeme_payoff_hesaplama(input: Kredi_geri_odeme_payoff_hesaplamaInput): Kredi_geri_odeme_payoff_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Compare multiple loan offers before committing.","Consider total cost including fees."];
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
    unit: "months",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kredi_geri_odeme_payoff_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kredi_geri_odeme_payoff_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "months",
  breakdownKeys: ["sonuc"],
} as const;

