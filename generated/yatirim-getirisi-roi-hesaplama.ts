// Auto-generated from yatirim-getirisi-roi-hesaplama-schema.json
import * as z from 'zod';

export interface Yatirim_getirisi_roi_hesaplamaInput {
  netKar: number;
  maliyet: number;
  dataConfidence?: number;
}

export const Yatirim_getirisi_roi_hesaplamaInputSchema = z.object({
  netKar: z.number().min(0).default(25000),
  maliyet: z.number().min(0).default(100000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yatirim_getirisi_roi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.netKar / Math.max(1, input.maliyet)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateYatirim_getirisi_roi_hesaplama(input: Yatirim_getirisi_roi_hesaplamaInput): Yatirim_getirisi_roi_hesaplamaOutput {
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


export interface Yatirim_getirisi_roi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yatirim_getirisi_roi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

