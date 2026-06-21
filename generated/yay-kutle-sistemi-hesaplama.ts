// Auto-generated from yay-kutle-sistemi-hesaplama-schema.json
import * as z from 'zod';

export interface Yay_kutle_sistemi_hesaplamaInput {
  kutle: number;
  yayKatsayisi: number;
  dataConfidence?: number;
}

export const Yay_kutle_sistemi_hesaplamaInputSchema = z.object({
  kutle: z.number().min(0).default(10),
  yayKatsayisi: z.number().min(0).default(1000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yay_kutle_sistemi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(Math.max(0, input.yayKatsayisi / Math.max(0.0001, input.kutle))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateYay_kutle_sistemi_hesaplama(input: Yay_kutle_sistemi_hesaplamaInput): Yay_kutle_sistemi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "rad/s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Yay_kutle_sistemi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yay_kutle_sistemi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "rad/s",
  breakdownKeys: ["sonuc"],
} as const;

