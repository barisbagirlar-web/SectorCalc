// Auto-generated from fiyat-defter-pb-orani-hesaplama-schema.json
import * as z from 'zod';

export interface Fiyat_defter_pb_orani_hesaplamaInput {
  piyasaDegeri: number;
  ozsermaye: number;
  dataConfidence?: number;
}

export const Fiyat_defter_pb_orani_hesaplamaInputSchema = z.object({
  piyasaDegeri: z.number().min(0).default(5000000),
  ozsermaye: z.number().min(0).default(3000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fiyat_defter_pb_orani_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.piyasaDegeri / Math.max(1, input.ozsermaye); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateFiyat_defter_pb_orani_hesaplama(input: Fiyat_defter_pb_orani_hesaplamaInput): Fiyat_defter_pb_orani_hesaplamaOutput {
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


export interface Fiyat_defter_pb_orani_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Fiyat_defter_pb_orani_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "ratio",
  breakdownKeys: ["sonuc"],
} as const;

