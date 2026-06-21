// Auto-generated from enerji-yogunlugu-hesaplama-schema.json
import * as z from 'zod';

export interface Enerji_yogunlugu_hesaplamaInput {
  enerji: number;
  hacim: number;
  dataConfidence?: number;
}

export const Enerji_yogunlugu_hesaplamaInputSchema = z.object({
  enerji: z.number().min(0).default(1000000),
  hacim: z.number().min(0).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Enerji_yogunlugu_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.enerji / Math.max(0.0001, input.hacim); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEnerji_yogunlugu_hesaplama(input: Enerji_yogunlugu_hesaplamaInput): Enerji_yogunlugu_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Use calibrated equipment for measurements.","Consider temperature effects on material properties."];
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
    unit: "J/m3",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Enerji_yogunlugu_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Enerji_yogunlugu_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "J/m3",
  breakdownKeys: ["sonuc"],
} as const;

