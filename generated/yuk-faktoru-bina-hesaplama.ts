// Auto-generated from yuk-faktoru-bina-hesaplama-schema.json
import * as z from 'zod';

export interface Yuk_faktoru_bina_hesaplamaInput {
  maksTalep: number;
  kuruluGuc: number;
  dataConfidence?: number;
}

export const Yuk_faktoru_bina_hesaplamaInputSchema = z.object({
  maksTalep: z.number().min(0).default(150),
  kuruluGuc: z.number().min(0).default(250),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yuk_faktoru_bina_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.maksTalep / Math.max(0.0001, input.kuruluGuc)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateYuk_faktoru_bina_hesaplama(input: Yuk_faktoru_bina_hesaplamaInput): Yuk_faktoru_bina_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
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


export interface Yuk_faktoru_bina_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yuk_faktoru_bina_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

