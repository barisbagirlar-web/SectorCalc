// Auto-generated from tahvil-fiyat-getiri-hesaplama-schema.json
import * as z from 'zod';

export interface Tahvil_fiyat_getiri_hesaplamaInput {
  nominal: number;
  kupon: number;
  piyasaFaizi: number;
  vade: number;
  dataConfidence?: number;
}

export const Tahvil_fiyat_getiri_hesaplamaInputSchema = z.object({
  nominal: z.number().min(0).default(1000),
  kupon: z.number().min(0).default(8),
  piyasaFaizi: z.number().min(0).default(10),
  vade: z.number().min(1).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tahvil_fiyat_getiri_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nominal * (input.kupon / 100); results["kuponOdeme"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kuponOdeme"] = Number.NaN; }
  try { const v = input.nominal / Math.pow(1 + input.piyasaFaizi / 100, input.vade) + (input.nominal * (input.kupon / 100)) * ((1 - Math.pow(1 / (1 + input.piyasaFaizi / 100), input.vade)) / (input.piyasaFaizi / 100)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTahvil_fiyat_getiri_hesaplama(input: Tahvil_fiyat_getiri_hesaplamaInput): Tahvil_fiyat_getiri_hesaplamaOutput {
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Tahvil_fiyat_getiri_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tahvil_fiyat_getiri_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

