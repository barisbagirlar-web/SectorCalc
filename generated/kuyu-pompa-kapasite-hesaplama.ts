// Auto-generated from kuyu-pompa-kapasite-hesaplama-schema.json
import * as z from 'zod';

export interface Kuyu_pompa_kapasite_hesaplamaInput {
  debi: number;
  yukseklik: number;
  verim: number;
  dataConfidence?: number;
}

export const Kuyu_pompa_kapasite_hesaplamaInputSchema = z.object({
  debi: z.number().min(0).default(10),
  yukseklik: z.number().min(0).default(50),
  verim: z.number().min(0).default(70),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kuyu_pompa_kapasite_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.debi * input.yukseklik * 9.81) / Math.max(0.0001, (3600 * (input.verim / 100))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKuyu_pompa_kapasite_hesaplama(input: Kuyu_pompa_kapasite_hesaplamaInput): Kuyu_pompa_kapasite_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
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
    unit: "kW",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kuyu_pompa_kapasite_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kuyu_pompa_kapasite_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "kW",
  breakdownKeys: ["sonuc"],
} as const;

