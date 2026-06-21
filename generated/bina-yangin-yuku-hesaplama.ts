// Auto-generated from bina-yangin-yuku-hesaplama-schema.json
import * as z from 'zod';

export interface Bina_yangin_yuku_hesaplamaInput {
  yaniciKutle: number;
  isilDeger: number;
  katAlani: number;
  dataConfidence?: number;
}

export const Bina_yangin_yuku_hesaplamaInputSchema = z.object({
  yaniciKutle: z.number().min(0).default(5000),
  isilDeger: z.number().min(0).default(18),
  katAlani: z.number().min(0).default(200),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bina_yangin_yuku_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.yaniciKutle * input.isilDeger) / Math.max(0.0001, input.katAlani); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBina_yangin_yuku_hesaplama(input: Bina_yangin_yuku_hesaplamaInput): Bina_yangin_yuku_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low Q factor indicates broader frequency response."];
  const suggestedActions: string[] = ["Verify component tolerances affect circuit performance.","Use proper safety equipment for high voltage/current work."];
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
    unit: "MJ/m2",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Bina_yangin_yuku_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Bina_yangin_yuku_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "MJ/m2",
  breakdownKeys: ["sonuc"],
} as const;

