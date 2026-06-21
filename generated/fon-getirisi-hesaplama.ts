// Auto-generated from fon-getirisi-hesaplama-schema.json
import * as z from 'zod';

export interface Fon_getirisi_hesaplamaInput {
  baslangicNAV: number;
  bitisNAV: number;
  dagitim: number;
  dataConfidence?: number;
}

export const Fon_getirisi_hesaplamaInputSchema = z.object({
  baslangicNAV: z.number().min(0).default(10),
  bitisNAV: z.number().min(0).default(12),
  dagitim: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fon_getirisi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.bitisNAV + input.dagitim - input.baslangicNAV) / Math.max(1, input.baslangicNAV)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateFon_getirisi_hesaplama(input: Fon_getirisi_hesaplamaInput): Fon_getirisi_hesaplamaOutput {
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


export interface Fon_getirisi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Fon_getirisi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

