// Auto-generated from bearing-wall-stress-calculator-schema.json
import * as z from 'zod';

export interface Bearing_wall_stress_calculatorInput {
  dataConfidence?: number;
  yuk: number;
  duvarAlani: number;
}

export const Bearing_wall_stress_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yuk: z.number().min(0).default(200000),
  duvarAlani: z.number().min(0).default(0.3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bearing_wall_stress_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["yuk"] / Math.max(0.0001, input["duvarAlani"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateBearing_wall_stress_calculator(input: Bearing_wall_stress_calculatorInput): Bearing_wall_stress_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Bearing_wall_stress_calculatorOutput {
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

export const Bearing_wall_stress_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: [],
} as const;
