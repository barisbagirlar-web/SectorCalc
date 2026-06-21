// Auto-generated from su-ayak-izi-hesaplama-schema.json
import * as z from 'zod';

export interface Su_ayak_izi_hesaplamaInput {
  uretimHacmi: number;
  tuketilenSu: number;
  dataConfidence?: number;
}

export const Su_ayak_izi_hesaplamaInputSchema = z.object({
  uretimHacmi: z.number().min(0).default(5000),
  tuketilenSu: z.number().min(0).default(15000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Su_ayak_izi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tuketilenSu / Math.max(0.0001, input.uretimHacmi); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSu_ayak_izi_hesaplama(input: Su_ayak_izi_hesaplamaInput): Su_ayak_izi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High environmental score may reduce operational costs.","Low ESG score may increase capital costs."];
  const suggestedActions: string[] = ["Set improvement targets for each ESG pillar.","Consider carbon offset programs for residual emissions."];
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
    unit: "m3/ton",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Su_ayak_izi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Su_ayak_izi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "m3/ton",
  breakdownKeys: ["sonuc"],
} as const;

