// Auto-generated from target-heart-rate-karvonen-calculator-schema.json
import * as z from 'zod';

export interface Target_heart_rate_karvonen_calculatorInput {
  dataConfidence?: number;
  yas: number;
  dinlenmeNabzi: number;
  yogunluk: number;
}

export const Target_heart_rate_karvonen_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yas: z.number().min(10).max(100).default(30),
  dinlenmeNabzi: z.number().min(30).max(120).default(70),
  yogunluk: z.number().min(40).max(100).default(75),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Target_heart_rate_karvonen_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 220 - input["yas"]; results["maxNabiz"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxNabiz"] = Number.NaN; }
  try { const v = ((220 - input["yas"] - input["dinlenmeNabzi"]) * input["yogunluk"] / 100) + input["dinlenmeNabzi"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateTarget_heart_rate_karvonen_calculator(input: Target_heart_rate_karvonen_calculatorInput): Target_heart_rate_karvonen_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult a healthcare professional before starting any diet or exercise program.","Individual results may vary."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "bpm",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Target_heart_rate_karvonen_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Target_heart_rate_karvonen_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "bpm",
  breakdownKeys: ["maxNabiz"],
} as const;
