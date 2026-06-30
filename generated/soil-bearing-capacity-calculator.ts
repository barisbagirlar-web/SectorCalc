// Auto-generated from soil-bearing-capacity-calculator-schema.json
import * as z from 'zod';

export interface Soil_bearing_capacity_calculatorInput {
  dataConfidence?: number;
  kohezyon: number;
  temelGenislik: number;
  derinlik: number;
  yogunluk: number;
}

export const Soil_bearing_capacity_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  kohezyon: z.number().min(0).default(20000),
  temelGenislik: z.number().min(0).default(1),
  derinlik: z.number().min(0).default(1.5),
  yogunluk: z.number().min(0).default(1800),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Soil_bearing_capacity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["kohezyon"] * 30) + (input["yogunluk"] * 9.81 * input["derinlik"] * 18) + (0.5 * input["yogunluk"] * 9.81 * input["temelGenislik"] * 15); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSoil_bearing_capacity_calculator(input: Soil_bearing_capacity_calculatorInput): Soil_bearing_capacity_calculatorOutput {
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

export interface Soil_bearing_capacity_calculatorOutput {
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

export const Soil_bearing_capacity_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: [],
} as const;
