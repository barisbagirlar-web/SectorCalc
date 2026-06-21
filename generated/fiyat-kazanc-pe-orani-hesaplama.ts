// Auto-generated from fiyat-kazanc-pe-orani-hesaplama-schema.json
import * as z from 'zod';

export interface Fiyat_kazanc_pe_orani_hesaplamaInput {
  hisseFiyati: number;
  hisseBasiKar: number;
  dataConfidence?: number;
}

export const Fiyat_kazanc_pe_orani_hesaplamaInputSchema = z.object({
  hisseFiyati: z.number().min(0).default(100),
  hisseBasiKar: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fiyat_kazanc_pe_orani_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hisseFiyati / Math.max(0.0001, input.hisseBasiKar); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateFiyat_kazanc_pe_orani_hesaplama(input: Fiyat_kazanc_pe_orani_hesaplamaInput): Fiyat_kazanc_pe_orani_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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
    unit: "ratio",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Fiyat_kazanc_pe_orani_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Fiyat_kazanc_pe_orani_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "ratio",
  breakdownKeys: ["sonuc"],
} as const;

