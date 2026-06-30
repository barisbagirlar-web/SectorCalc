// Auto-generated from business-valuation-multiple-calculator-schema.json
import * as z from 'zod';

export interface Business_valuation_multiple_calculatorInput {
  dataConfidence?: number;
  favok: number;
  carpan: number;
}

export const Business_valuation_multiple_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  favok: z.number().min(0).default(500000),
  carpan: z.number().min(1).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Business_valuation_multiple_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["favok"] * input["carpan"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateBusiness_valuation_multiple_calculator(input: Business_valuation_multiple_calculatorInput): Business_valuation_multiple_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Business_valuation_multiple_calculatorOutput {
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

export const Business_valuation_multiple_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;
