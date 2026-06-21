// Auto-generated from depo-alan-kapasite-hesaplama-schema.json
import * as z from 'zod';

export interface Depo_alan_kapasite_hesaplamaInput {
  toplamAlan: number;
  rafKullanimi: number;
  paletAlani: number;
  dataConfidence?: number;
}

export const Depo_alan_kapasite_hesaplamaInputSchema = z.object({
  toplamAlan: z.number().min(0).default(5000),
  rafKullanimi: z.number().min(0).max(100).default(60),
  paletAlani: z.number().min(0).default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Depo_alan_kapasite_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.floor((input.toplamAlan * (input.rafKullanimi / 100)) / Math.max(0.0001, input.paletAlani)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDepo_alan_kapasite_hesaplama(input: Depo_alan_kapasite_hesaplamaInput): Depo_alan_kapasite_hesaplamaOutput {
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
    unit: "pallets",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Depo_alan_kapasite_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Depo_alan_kapasite_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "pallets",
  breakdownKeys: ["sonuc"],
} as const;

