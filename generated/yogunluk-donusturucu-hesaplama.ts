// Auto-generated from yogunluk-donusturucu-hesaplama-schema.json
import * as z from 'zod';

export interface Yogunluk_donusturucu_hesaplamaInput {
  deger: number;
  kaynak: number;
  dataConfidence?: number;
}

export const Yogunluk_donusturucu_hesaplamaInputSchema = z.object({
  deger: z.number().min(0).default(1),
  kaynak: z.number().min(0).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yogunluk_donusturucu_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kaynak === 1 ? input.deger : input.kaynak === 2 ? input.deger * 1000 : input.deger * 16.018; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateYogunluk_donusturucu_hesaplama(input: Yogunluk_donusturucu_hesaplamaInput): Yogunluk_donusturucu_hesaplamaOutput {
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
    unit: "kg/m3",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Yogunluk_donusturucu_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yogunluk_donusturucu_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "kg/m3",
  breakdownKeys: ["sonuc"],
} as const;

