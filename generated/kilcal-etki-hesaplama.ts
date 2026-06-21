// Auto-generated from kilcal-etki-hesaplama-schema.json
import * as z from 'zod';

export interface Kilcal_etki_hesaplamaInput {
  yuzeyGerilimi: number;
  temasAcisi: number;
  yariCap: number;
  yogunluk: number;
  dataConfidence?: number;
}

export const Kilcal_etki_hesaplamaInputSchema = z.object({
  yuzeyGerilimi: z.number().min(0).default(0.073),
  temasAcisi: z.number().min(0).default(0),
  yariCap: z.number().min(0).default(0.0005),
  yogunluk: z.number().min(0).default(1000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kilcal_etki_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (2 * input.yuzeyGerilimi * Math.cos(input.temasAcisi * Math.PI / 180)) / Math.max(0.0001, (input.yogunluk * 9.81 * input.yariCap)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKilcal_etki_hesaplama(input: Kilcal_etki_hesaplamaInput): Kilcal_etki_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Use calibrated equipment for measurements.","Consider temperature effects on material properties."];
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kilcal_etki_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kilcal_etki_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["sonuc"],
} as const;

