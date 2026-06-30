// Auto-generated from mortgage-refinance-calculator-schema.json
import * as z from 'zod';

export interface Mortgage_refinance_calculatorInput {
  dataConfidence?: number;
  eskiTaksit: number;
  yeniTaksit: number;
  kapatmaMasrafi: number;
}

export const Mortgage_refinance_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  eskiTaksit: z.number().min(0).default(12000),
  yeniTaksit: z.number().min(0).default(10000),
  kapatmaMasrafi: z.number().min(0).default(30000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mortgage_refinance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["kapatmaMasrafi"] / Math.max(1, (input["eskiTaksit"] - input["yeniTaksit"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateMortgage_refinance_calculator(input: Mortgage_refinance_calculatorInput): Mortgage_refinance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify all property data with official documents.","Consult a mortgage broker for personalized rates."];
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
    unit: "months",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Mortgage_refinance_calculatorOutput {
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

export const Mortgage_refinance_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "months",
  breakdownKeys: [],
} as const;
