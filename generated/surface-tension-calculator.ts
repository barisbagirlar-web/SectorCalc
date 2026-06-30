// Auto-generated from surface-tension-calculator-schema.json
import * as z from 'zod';

export interface Surface_tension_calculatorInput {
  dataConfidence?: number;
  kuvvet: number;
  uzunluk: number;
}

export const Surface_tension_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  kuvvet: z.number().min(0).default(0.05),
  uzunluk: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Surface_tension_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["kuvvet"] / Math.max(0.0001, input["uzunluk"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSurface_tension_calculator(input: Surface_tension_calculatorInput): Surface_tension_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Use calibrated equipment for measurements.","Consider temperature effects on material properties."];
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
    unit: "N/m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Surface_tension_calculatorOutput {
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

export const Surface_tension_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "N/m",
  breakdownKeys: [],
} as const;
