// Auto-generated from stok-devir-hizi-hesaplama-schema.json
import * as z from 'zod';

export interface Stok_devir_hizi_hesaplamaInput {
  yillikCOGS: number;
  ortStok: number;
  dataConfidence?: number;
}

export const Stok_devir_hizi_hesaplamaInputSchema = z.object({
  yillikCOGS: z.number().min(0).default(1200000),
  ortStok: z.number().min(0).default(200000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Stok_devir_hizi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 365 / Math.max(0.0001, input.yillikCOGS / Math.max(0.0001, input.ortStok)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateStok_devir_hizi_hesaplama(input: Stok_devir_hizi_hesaplamaInput): Stok_devir_hizi_hesaplamaOutput {
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
    unit: "days",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Stok_devir_hizi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Stok_devir_hizi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "days",
  breakdownKeys: ["sonuc"],
} as const;

