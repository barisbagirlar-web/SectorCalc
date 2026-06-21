// Auto-generated from burulma-acisi-hesaplama-schema.json
import * as z from 'zod';

export interface Burulma_acisi_hesaplamaInput {
  tork: number;
  uzunluk: number;
  kaymaModulu: number;
  kutupsalAtalet: number;
  dataConfidence?: number;
}

export const Burulma_acisi_hesaplamaInputSchema = z.object({
  tork: z.number().min(0).default(1000),
  uzunluk: z.number().min(0).default(2),
  kaymaModulu: z.number().min(0).default(80000000000),
  kutupsalAtalet: z.number().min(0).default(6.14e-7),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Burulma_acisi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.tork * input.uzunluk) / Math.max(0.0001, (input.kaymaModulu * input.kutupsalAtalet)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBurulma_acisi_hesaplama(input: Burulma_acisi_hesaplamaInput): Burulma_acisi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "rad",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Burulma_acisi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Burulma_acisi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "rad",
  breakdownKeys: ["sonuc"],
} as const;

