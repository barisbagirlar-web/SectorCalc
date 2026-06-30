// Auto-generated from pe-ratio-calculator-schema.json
import * as z from 'zod';

export interface Pe_ratio_calculatorInput {
  dataConfidence?: number;
  hisseFiyati: number;
  hisseBasiKar: number;
}

export const Pe_ratio_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  hisseFiyati: z.number().min(0).default(100),
  hisseBasiKar: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pe_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["hisseFiyati"] / Math.max(0.0001, input["hisseBasiKar"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculatePe_ratio_calculator(input: Pe_ratio_calculatorInput): Pe_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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
    unit: "ratio",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Pe_ratio_calculatorOutput {
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

export const Pe_ratio_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "ratio",
  breakdownKeys: [],
} as const;
