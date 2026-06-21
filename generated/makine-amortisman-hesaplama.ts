// Auto-generated from makine-amortisman-hesaplama-schema.json
import * as z from 'zod';

export interface Makine_amortisman_hesaplamaInput {
  bedel: number;
  kalinti: number;
  uretimKapasite: number;
  dataConfidence?: number;
}

export const Makine_amortisman_hesaplamaInputSchema = z.object({
  bedel: z.number().min(0).default(500000),
  kalinti: z.number().min(0).default(50000),
  uretimKapasite: z.number().min(1).default(1000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Makine_amortisman_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.bedel - input.kalinti) / Math.max(1, input.uretimKapasite); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMakine_amortisman_hesaplama(input: Makine_amortisman_hesaplamaInput): Makine_amortisman_hesaplamaOutput {
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
    unit: "TRY/unit",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Makine_amortisman_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Makine_amortisman_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY/unit",
  breakdownKeys: ["sonuc"],
} as const;

