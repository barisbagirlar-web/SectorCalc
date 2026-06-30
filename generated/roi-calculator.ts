// Auto-generated from roi-calculator-schema.json
import * as z from 'zod';

export interface Roi_calculatorInput {
  dataConfidence?: number;
  netKar: number;
  maliyet: number;
}

export const Roi_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  netKar: z.number().min(0).default(25000),
  maliyet: z.number().min(0).default(100000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Roi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["netKar"] / Math.max(1, input["maliyet"])) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateRoi_calculator(input: Roi_calculatorInput): Roi_calculatorOutput {
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Roi_calculatorOutput {
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

export const Roi_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;
