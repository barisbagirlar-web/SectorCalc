// Auto-generated from yillik-getiri-hesaplama-schema.json
import * as z from 'zod';

export interface Yillik_getiri_hesaplamaInput {
  baslangic: number;
  bitis: number;
  yil: number;
  dataConfidence?: number;
}

export const Yillik_getiri_hesaplamaInputSchema = z.object({
  baslangic: z.number().min(0).default(10000),
  bitis: z.number().min(0).default(20000),
  yil: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yillik_getiri_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.pow(input.bitis / Math.max(1, input.baslangic), 1 / Math.max(1, input.yil)) - 1) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateYillik_getiri_hesaplama(input: Yillik_getiri_hesaplamaInput): Yillik_getiri_hesaplamaOutput {
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Yillik_getiri_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yillik_getiri_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

