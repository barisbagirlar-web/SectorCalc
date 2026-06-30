// Auto-generated from sampling-weight-calculator-schema.json
import * as z from 'zod';

export interface Sampling_weight_calculatorInput {
  dataConfidence?: number;
  tabakaPopulasyon: number;
  toplamPopulasyon: number;
  tabakaOrneklem: number;
  toplamOrneklem: number;
}

export const Sampling_weight_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  tabakaPopulasyon: z.number().min(0).default(500),
  toplamPopulasyon: z.number().min(0).default(5000),
  tabakaOrneklem: z.number().min(0).default(50),
  toplamOrneklem: z.number().min(0).default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sampling_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["tabakaPopulasyon"] / Math.max(1, input["toplamPopulasyon"])) / Math.max(0.0001, (input["tabakaOrneklem"] / Math.max(1, input["toplamOrneklem"]))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSampling_weight_calculator(input: Sampling_weight_calculatorInput): Sampling_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["High asymmetry increases injury risk.","Low H-index may indicate limited academic impact."];
  const suggestedActions: string[] = ["Balance training for injury prevention.","Use peer review to validate research quality."];
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
    unit: "weight",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Sampling_weight_calculatorOutput {
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

export const Sampling_weight_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "weight",
  breakdownKeys: [],
} as const;
