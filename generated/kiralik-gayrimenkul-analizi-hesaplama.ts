// Auto-generated from kiralik-gayrimenkul-analizi-hesaplama-schema.json
import * as z from 'zod';

export interface Kiralik_gayrimenkul_analizi_hesaplamaInput {
  brutKira: number;
  bosluk: number;
  isletme: number;
  kredi: number;
  dataConfidence?: number;
}

export const Kiralik_gayrimenkul_analizi_hesaplamaInputSchema = z.object({
  brutKira: z.number().min(0).default(10000),
  bosluk: z.number().min(0).max(100).default(5),
  isletme: z.number().min(0).default(2000),
  kredi: z.number().min(0).default(5000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kiralik_gayrimenkul_analizi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.brutKira * (1 - input.bosluk / 100)) - input.isletme - input.kredi; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKiralik_gayrimenkul_analizi_hesaplama(input: Kiralik_gayrimenkul_analizi_hesaplamaInput): Kiralik_gayrimenkul_analizi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify all property data with official documents.","Consult a mortgage broker for personalized rates."];
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


export interface Kiralik_gayrimenkul_analizi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kiralik_gayrimenkul_analizi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

