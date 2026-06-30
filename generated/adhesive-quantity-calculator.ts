// Auto-generated from adhesive-quantity-calculator-schema.json
import * as z from 'zod';

export interface Adhesive_quantity_calculatorInput {
  dataConfidence?: number;
  alan: number;
  sarfiyat: number;
}

export const Adhesive_quantity_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  alan: z.number().min(0).default(50),
  sarfiyat: z.number().min(0).default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Adhesive_quantity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["alan"] * input["sarfiyat"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateAdhesive_quantity_calculator(input: Adhesive_quantity_calculatorInput): Adhesive_quantity_calculatorOutput {
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
    unit: "kg",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Adhesive_quantity_calculatorOutput {
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

export const Adhesive_quantity_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "kg",
  breakdownKeys: [],
} as const;
