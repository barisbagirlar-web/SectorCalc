// Auto-generated from pb-ratio-calculator-schema.json
import * as z from 'zod';

export interface Pb_ratio_calculatorInput {
  dataConfidence?: number;
  piyasaDegeri: number;
  ozsermaye: number;
}

export const Pb_ratio_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  piyasaDegeri: z.number().min(0).default(5000000),
  ozsermaye: z.number().min(0).default(3000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pb_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["piyasaDegeri"] / Math.max(1, input["ozsermaye"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculatePb_ratio_calculator(input: Pb_ratio_calculatorInput): Pb_ratio_calculatorOutput {
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

export interface Pb_ratio_calculatorOutput {
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

export const Pb_ratio_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "ratio",
  breakdownKeys: [],
} as const;
