// Auto-generated from konteyner-yukleme-hesaplama-schema.json
import * as z from 'zod';

export interface Konteyner_yukleme_hesaplamaInput {
  konteynerHacim: number;
  kutuHacim: number;
  istifleme: number;
  dataConfidence?: number;
}

export const Konteyner_yukleme_hesaplamaInputSchema = z.object({
  konteynerHacim: z.number().min(0).default(33),
  kutuHacim: z.number().min(0).default(0.036),
  istifleme: z.number().min(0).max(100).default(85),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Konteyner_yukleme_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.floor((input.konteynerHacim * (input.istifleme / 100)) / Math.max(0.0001, input.kutuHacim)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKonteyner_yukleme_hesaplama(input: Konteyner_yukleme_hesaplamaInput): Konteyner_yukleme_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inventory turnover metrics monthly.","Factor in seasonality for safety stock."];
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
    unit: "boxes",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Konteyner_yukleme_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Konteyner_yukleme_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "boxes",
  breakdownKeys: ["sonuc"],
} as const;

