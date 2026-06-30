// Auto-generated from metacentric-height-calculator-schema.json
import * as z from 'zod';

export interface Metacentric_height_calculatorInput {
  dataConfidence?: number;
  KB: number;
  BM: number;
  KG: number;
}

export const Metacentric_height_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  KB: z.number().min(0).default(3),
  BM: z.number().min(0).default(5),
  KG: z.number().min(0).default(6),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Metacentric_height_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["KB"] + input["BM"] - input["KG"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateMetacentric_height_calculator(input: Metacentric_height_calculatorInput): Metacentric_height_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Low efficiency may indicate equipment or process issues."];
  const suggestedActions: string[] = ["Calibrate all measuring equipment regularly.","Use site-specific data when available."];
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Metacentric_height_calculatorOutput {
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

export const Metacentric_height_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: [],
} as const;
