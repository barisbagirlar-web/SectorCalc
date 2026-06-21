// Auto-generated from kapanis-maliyetleri-hesaplama-schema.json
import * as z from 'zod';

export interface Kapanis_maliyetleri_hesaplamaInput {
  krediTutari: number;
  oran: number;
  sabitUcretler: number;
  dataConfidence?: number;
}

export const Kapanis_maliyetleri_hesaplamaInputSchema = z.object({
  krediTutari: z.number().min(0).default(1000000),
  oran: z.number().min(0).default(2),
  sabitUcretler: z.number().min(0).default(10000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kapanis_maliyetleri_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.krediTutari * input.oran / 100) + input.sabitUcretler; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKapanis_maliyetleri_hesaplama(input: Kapanis_maliyetleri_hesaplamaInput): Kapanis_maliyetleri_hesaplamaOutput {
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


export interface Kapanis_maliyetleri_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kapanis_maliyetleri_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

