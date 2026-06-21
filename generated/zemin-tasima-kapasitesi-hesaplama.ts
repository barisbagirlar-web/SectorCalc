// Auto-generated from zemin-tasima-kapasitesi-hesaplama-schema.json
import * as z from 'zod';

export interface Zemin_tasima_kapasitesi_hesaplamaInput {
  kohezyon: number;
  temelGenislik: number;
  derinlik: number;
  yogunluk: number;
  dataConfidence?: number;
}

export const Zemin_tasima_kapasitesi_hesaplamaInputSchema = z.object({
  kohezyon: z.number().min(0).default(20000),
  temelGenislik: z.number().min(0).default(1),
  derinlik: z.number().min(0).default(1.5),
  yogunluk: z.number().min(0).default(1800),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Zemin_tasima_kapasitesi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (20000 * 30) + (1800 * 9.81 * 1.5 * 18) + (0.5 * 1800 * 9.81 * 1 * 15); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateZemin_tasima_kapasitesi_hesaplama(input: Zemin_tasima_kapasitesi_hesaplamaInput): Zemin_tasima_kapasitesi_hesaplamaOutput {
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Zemin_tasima_kapasitesi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Zemin_tasima_kapasitesi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: ["sonuc"],
} as const;

