// Auto-generated from wood-siding-calculator-schema.json
import * as z from 'zod';

export interface Wood_siding_calculatorInput {
  alan: number;
  tahtaEn: number;
  bindirmePayi: number;
  dataConfidence?: number;
}

export const Wood_siding_calculatorInputSchema = z.object({
  alan: z.number().min(0).default(40),
  tahtaEn: z.number().min(0).default(0.15),
  bindirmePayi: z.number().min(0).default(0.025),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wood_siding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.alan / Math.max(0.0001, (input.tahtaEn - input.bindirmePayi)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateWood_siding_calculator(input: Wood_siding_calculatorInput): Wood_siding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Wood_siding_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Wood_siding_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["sonuc"],
} as const;

