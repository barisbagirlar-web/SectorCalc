// Auto-generated from bernoulli-denklemi-hesaplama-schema.json
import * as z from 'zod';

export interface Bernoulli_denklemi_hesaplamaInput {
  P1: number;
  v1: number;
  v2: number;
  h1: number;
  h2: number;
  yogunluk: number;
  dataConfidence?: number;
}

export const Bernoulli_denklemi_hesaplamaInputSchema = z.object({
  P1: z.number().min(0).default(200000),
  v1: z.number().min(0).default(2),
  v2: z.number().min(0).default(4),
  h1: z.number().min(0).default(10),
  h2: z.number().min(0).default(5),
  yogunluk: z.number().min(0).default(1000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bernoulli_denklemi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.P1 + 0.5 * input.yogunluk * (input.v1 * input.v1 - input.v2 * input.v2) + input.yogunluk * 9.81 * (input.h1 - input.h2); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBernoulli_denklemi_hesaplama(input: Bernoulli_denklemi_hesaplamaInput): Bernoulli_denklemi_hesaplamaOutput {
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Bernoulli_denklemi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Bernoulli_denklemi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: ["sonuc"],
} as const;

