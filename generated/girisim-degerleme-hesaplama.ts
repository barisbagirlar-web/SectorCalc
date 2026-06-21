// Auto-generated from girisim-degerleme-hesaplama-schema.json
import * as z from 'zod';

export interface Girisim_degerleme_hesaplamaInput {
  yatirim: number;
  hisseOrani: number;
  dataConfidence?: number;
}

export const Girisim_degerleme_hesaplamaInputSchema = z.object({
  yatirim: z.number().min(0).default(1000000),
  hisseOrani: z.number().min(0.1).max(99).default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Girisim_degerleme_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yatirim / Math.max(0.0001, input.hisseOrani / 100); results["degerlemeSonrasi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["degerlemeSonrasi"] = Number.NaN; }
  try { const v = (input.yatirim / Math.max(0.0001, input.hisseOrani / 100)) - input.yatirim; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateGirisim_degerleme_hesaplama(input: Girisim_degerleme_hesaplamaInput): Girisim_degerleme_hesaplamaOutput {
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Girisim_degerleme_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Girisim_degerleme_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

