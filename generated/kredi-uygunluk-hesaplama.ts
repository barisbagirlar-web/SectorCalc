// Auto-generated from kredi-uygunluk-hesaplama-schema.json
import * as z from 'zod';

export interface Kredi_uygunluk_hesaplamaInput {
  netGelir: number;
  yasamGideri: number;
  maxTaksitOrani: number;
  dataConfidence?: number;
}

export const Kredi_uygunluk_hesaplamaInputSchema = z.object({
  netGelir: z.number().min(0).default(30000),
  yasamGideri: z.number().min(0).default(12000),
  maxTaksitOrani: z.number().min(0).max(100).default(35),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kredi_uygunluk_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min((input.netGelir - input.yasamGideri), input.netGelir * input.maxTaksitOrani / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKredi_uygunluk_hesaplama(input: Kredi_uygunluk_hesaplamaInput): Kredi_uygunluk_hesaplamaOutput {
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kredi_uygunluk_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kredi_uygunluk_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

