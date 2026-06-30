// Auto-generated from cold-storage-heat-gain-calculator-schema.json
import * as z from 'zod';

export interface Cold_storage_heat_gain_calculatorInput {
  dataConfidence?: number;
  alan: number;
  U_Katsayi: number;
  disSicaklik: number;
  icSicaklik: number;
}

export const Cold_storage_heat_gain_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  alan: z.number().min(0).default(200),
  U_Katsayi: z.number().min(0).default(0.3),
  disSicaklik: z.number().min(0).default(35),
  icSicaklik: z.number().min(0).default(-20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cold_storage_heat_gain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["alan"] * input["U_Katsayi"] * (input["disSicaklik"] - input["icSicaklik"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateCold_storage_heat_gain_calculator(input: Cold_storage_heat_gain_calculatorInput): Cold_storage_heat_gain_calculatorOutput {
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
    unit: "W",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Cold_storage_heat_gain_calculatorOutput {
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

export const Cold_storage_heat_gain_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "W",
  breakdownKeys: [],
} as const;
