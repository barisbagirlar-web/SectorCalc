// Auto-generated from pazarlama-roi-hesaplama-schema.json
import * as z from 'zod';

export interface Pazarlama_roi_hesaplamaInput {
  kampanyaGeliri: number;
  kampanyaMaliyeti: number;
  dataConfidence?: number;
}

export const Pazarlama_roi_hesaplamaInputSchema = z.object({
  kampanyaGeliri: z.number().min(0).default(200000),
  kampanyaMaliyeti: z.number().min(0).default(50000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pazarlama_roi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.kampanyaGeliri - input.kampanyaMaliyeti) / Math.max(0.0001, input.kampanyaMaliyeti)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculatePazarlama_roi_hesaplama(input: Pazarlama_roi_hesaplamaInput): Pazarlama_roi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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


export interface Pazarlama_roi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Pazarlama_roi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

