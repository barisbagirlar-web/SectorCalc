// Auto-generated from building-load-factor-calculator-schema.json
import * as z from 'zod';

export interface Building_load_factor_calculatorInput {
  dataConfidence?: number;
  maksTalep: number;
  kuruluGuc: number;
}

export const Building_load_factor_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  maksTalep: z.number().min(0).default(150),
  kuruluGuc: z.number().min(0).default(250),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Building_load_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["maksTalep"] / Math.max(0.0001, input["kuruluGuc"])) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateBuilding_load_factor_calculator(input: Building_load_factor_calculatorInput): Building_load_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
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

export interface Building_load_factor_calculatorOutput {
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

export const Building_load_factor_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;
