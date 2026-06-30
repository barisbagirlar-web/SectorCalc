// Auto-generated from soffit-area-calculator-schema.json
import * as z from 'zod';

export interface Soffit_area_calculatorInput {
  dataConfidence?: number;
  cevre: number;
  genislik: number;
}

export const Soffit_area_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  cevre: z.number().min(0).default(80),
  genislik: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Soffit_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["cevre"] * input["genislik"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSoffit_area_calculator(input: Soffit_area_calculatorInput): Soffit_area_calculatorOutput {
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
    unit: "m2",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Soffit_area_calculatorOutput {
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

export const Soffit_area_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m2",
  breakdownKeys: [],
} as const;
