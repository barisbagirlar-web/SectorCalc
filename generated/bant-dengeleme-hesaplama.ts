// Auto-generated from bant-dengeleme-hesaplama-schema.json
import * as z from 'zod';

export interface Bant_dengeleme_hesaplamaInput {
  toplamIs: number;
  taktTime: number;
  istasyonSayisi: number;
  dataConfidence?: number;
}

export const Bant_dengeleme_hesaplamaInputSchema = z.object({
  toplamIs: z.number().min(0).default(500),
  taktTime: z.number().min(0).default(50),
  istasyonSayisi: z.number().min(1).default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bant_dengeleme_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.toplamIs / Math.max(0.0001, (input.istasyonSayisi * input.taktTime))) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBant_dengeleme_hesaplama(input: Bant_dengeleme_hesaplamaInput): Bant_dengeleme_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Conduct regular OEE audits for improvement.","Use SMED to reduce setup times."];
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Bant_dengeleme_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Bant_dengeleme_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

