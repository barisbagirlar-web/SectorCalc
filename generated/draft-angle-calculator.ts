// Auto-generated from draft-angle-calculator-schema.json
import * as z from 'zod';

export interface Draft_angle_calculatorInput {
  dataConfidence?: number;
  parcaDerinlik: number;
  buzulmeOrani: number;
  yanYuzeyUzunluk: number;
}

export const Draft_angle_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  parcaDerinlik: z.number().min(0).default(50),
  buzulmeOrani: z.number().min(0).default(1.5),
  yanYuzeyUzunluk: z.number().min(0).default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Draft_angle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.atan((input["parcaDerinlik"] * (input["buzulmeOrani"] / 100)) / Math.max(0.0001, input["yanYuzeyUzunluk"])) * (180 / Math.PI); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateDraft_angle_calculator(input: Draft_angle_calculatorInput): Draft_angle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Waste in material or time indicates process improvement opportunity."];
  const suggestedActions: string[] = ["Optimize drying/cooling parameters for cycle time reduction.","Monitor defects and adjust process conditions accordingly."];
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
    unit: "degrees",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Draft_angle_calculatorOutput {
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

export const Draft_angle_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "degrees",
  breakdownKeys: [],
} as const;
