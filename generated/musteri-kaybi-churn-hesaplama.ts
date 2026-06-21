// Auto-generated from musteri-kaybi-churn-hesaplama-schema.json
import * as z from 'zod';

export interface Musteri_kaybi_churn_hesaplamaInput {
  donemBasi: number;
  kaybedilen: number;
  dataConfidence?: number;
}

export const Musteri_kaybi_churn_hesaplamaInputSchema = z.object({
  donemBasi: z.number().min(1).default(1000),
  kaybedilen: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Musteri_kaybi_churn_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.kaybedilen / Math.max(1, input.donemBasi)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMusteri_kaybi_churn_hesaplama(input: Musteri_kaybi_churn_hesaplamaInput): Musteri_kaybi_churn_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Musteri_kaybi_churn_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Musteri_kaybi_churn_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

