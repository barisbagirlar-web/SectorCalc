// Auto-generated from tohum-ekim-yogunlugu-hesaplama-schema.json
import * as z from 'zod';

export interface Tohum_ekim_yogunlugu_hesaplamaInput {
  siraAraligi: number;
  uzeriMesafe: number;
  binTaneAgirlik: number;
  cimlenme: number;
  dataConfidence?: number;
}

export const Tohum_ekim_yogunlugu_hesaplamaInputSchema = z.object({
  siraAraligi: z.number().min(0).default(0.7),
  uzeriMesafe: z.number().min(0).default(0.2),
  binTaneAgirlik: z.number().min(0).default(350),
  cimlenme: z.number().min(0).default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tohum_ekim_yogunlugu_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (10000 / Math.max(0.0001, (input.siraAraligi * input.uzeriMesafe))) * (input.binTaneAgirlik / 1000) / Math.max(0.0001, (input.cimlenme / 100)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTohum_ekim_yogunlugu_hesaplama(input: Tohum_ekim_yogunlugu_hesaplamaInput): Tohum_ekim_yogunlugu_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low efficiency may indicate equipment or process issues."];
  const suggestedActions: string[] = ["Calibrate all measuring equipment regularly.","Use site-specific data when available."];
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
    unit: "kg/da",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Tohum_ekim_yogunlugu_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tohum_ekim_yogunlugu_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "kg/da",
  breakdownKeys: ["sonuc"],
} as const;

