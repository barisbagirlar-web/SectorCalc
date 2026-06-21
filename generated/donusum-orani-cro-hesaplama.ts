// Auto-generated from donusum-orani-cro-hesaplama-schema.json
import * as z from 'zod';

export interface Donusum_orani_cro_hesaplamaInput {
  ziyaretci: number;
  donusum: number;
  dataConfidence?: number;
}

export const Donusum_orani_cro_hesaplamaInputSchema = z.object({
  ziyaretci: z.number().min(1).default(10000),
  donusum: z.number().min(0).default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Donusum_orani_cro_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.donusum / Math.max(1, input.ziyaretci)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDonusum_orani_cro_hesaplama(input: Donusum_orani_cro_hesaplamaInput): Donusum_orani_cro_hesaplamaOutput {
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


export interface Donusum_orani_cro_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Donusum_orani_cro_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

