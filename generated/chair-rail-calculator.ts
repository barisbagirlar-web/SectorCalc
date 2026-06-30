// Auto-generated from chair-rail-calculator-schema.json
import * as z from 'zod';

export interface Chair_rail_calculatorInput {
  dataConfidence?: number;
  duvarUzunlugu: number;
}

export const Chair_rail_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  duvarUzunlugu: z.number().min(0).default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Chair_rail_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["duvarUzunlugu"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateChair_rail_calculator(input: Chair_rail_calculatorInput): Chair_rail_calculatorOutput {
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Chair_rail_calculatorOutput {
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

export const Chair_rail_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: [],
} as const;
