// Auto-generated from isi-iletkenligi-donusturucu-hesaplama-schema.json
import * as z from 'zod';

export interface Isi_iletkenligi_donusturucu_hesaplamaInput {
  deger: number;
  kaynak: number;
  dataConfidence?: number;
}

export const Isi_iletkenligi_donusturucu_hesaplamaInputSchema = z.object({
  deger: z.number().min(0).default(1),
  kaynak: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Isi_iletkenligi_donusturucu_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.kaynak === 0 ? input.deger : input.deger * 1.163) ? 1 : 0); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateIsi_iletkenligi_donusturucu_hesaplama(input: Isi_iletkenligi_donusturucu_hesaplamaInput): Isi_iletkenligi_donusturucu_hesaplamaOutput {
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
    unit: "W/mK",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Isi_iletkenligi_donusturucu_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Isi_iletkenligi_donusturucu_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "W/mK",
  breakdownKeys: ["sonuc"],
} as const;

