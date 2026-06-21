// Auto-generated from hurda-orani-optimizasyon-hesaplama-schema.json
import * as z from 'zod';

export interface Hurda_orani_optimizasyon_hesaplamaInput {
  uretim: number;
  hurda: number;
  birimMaliyet: number;
  dataConfidence?: number;
}

export const Hurda_orani_optimizasyon_hesaplamaInputSchema = z.object({
  uretim: z.number().min(1).default(10000),
  hurda: z.number().min(0).default(500),
  birimMaliyet: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hurda_orani_optimizasyon_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.hurda / Math.max(1, input.uretim)) * 100; results["oran"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oran"] = Number.NaN; }
  try { const v = input.hurda * input.birimMaliyet; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateHurda_orani_optimizasyon_hesaplama(input: Hurda_orani_optimizasyon_hesaplamaInput): Hurda_orani_optimizasyon_hesaplamaOutput {
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Hurda_orani_optimizasyon_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hurda_orani_optimizasyon_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

