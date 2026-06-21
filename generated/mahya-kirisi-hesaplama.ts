// Auto-generated from mahya-kirisi-hesaplama-schema.json
import * as z from 'zod';

export interface Mahya_kirisi_hesaplamaInput {
  catiYuk: number;
  aciklik: number;
  dataConfidence?: number;
}

export const Mahya_kirisi_hesaplamaInputSchema = z.object({
  catiYuk: z.number().min(0).default(8000),
  aciklik: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mahya_kirisi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.catiYuk * Math.pow(input.aciklik, 2)) / 8; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMahya_kirisi_hesaplama(input: Mahya_kirisi_hesaplamaInput): Mahya_kirisi_hesaplamaOutput {
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
    unit: "N.m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Mahya_kirisi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Mahya_kirisi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "N.m",
  breakdownKeys: ["sonuc"],
} as const;

