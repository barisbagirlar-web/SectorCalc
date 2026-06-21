// Auto-generated from kredi-karti-faiz-hesaplama-schema.json
import * as z from 'zod';

export interface Kredi_karti_faiz_hesaplamaInput {
  bakiye: number;
  yillikFaiz: number;
  gun: number;
  dataConfidence?: number;
}

export const Kredi_karti_faiz_hesaplamaInputSchema = z.object({
  bakiye: z.number().min(0).default(10000),
  yillikFaiz: z.number().min(0).default(120),
  gun: z.number().min(0).default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kredi_karti_faiz_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bakiye * (input.yillikFaiz / 36500) * input.gun; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKredi_karti_faiz_hesaplama(input: Kredi_karti_faiz_hesaplamaInput): Kredi_karti_faiz_hesaplamaOutput {
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


export interface Kredi_karti_faiz_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kredi_karti_faiz_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

