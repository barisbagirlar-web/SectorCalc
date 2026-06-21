// Auto-generated from guven-araligi-hesaplama-schema.json
import * as z from 'zod';

export interface Guven_araligi_hesaplamaInput {
  ortalama: number;
  stdHata: number;
  guvenSeviyesi: number;
  dataConfidence?: number;
}

export const Guven_araligi_hesaplamaInputSchema = z.object({
  ortalama: z.number().min(0).default(100),
  stdHata: z.number().min(0).default(5),
  guvenSeviyesi: z.number().min(1).max(99.9).default(95),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Guven_araligi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.guvenSeviyesi >= 99 ? 2.576 : input.guvenSeviyesi >= 95 ? 1.96 : 1.645; results["Z"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Z"] = Number.NaN; }
  try { const v = 100 - (input.guvenSeviyesi >= 99 ? 2.576 : input.guvenSeviyesi >= 95 ? 1.96 : 1.645) * 5; results["alt"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["alt"] = Number.NaN; }
  try { const v = 100 + (input.guvenSeviyesi >= 99 ? 2.576 : input.guvenSeviyesi >= 95 ? 1.96 : 1.645) * 5; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateGuven_araligi_hesaplama(input: Guven_araligi_hesaplamaInput): Guven_araligi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    alt: toNumericFormulaValue(values["alt"]),
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify statistical assumptions before making decisions.","Use larger sample sizes for better accuracy."];
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
    unit: "number",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Guven_araligi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { alt: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Guven_araligi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "number",
  breakdownKeys: ["alt","sonuc"],
} as const;

