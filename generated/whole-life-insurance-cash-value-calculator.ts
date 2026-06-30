// Auto-generated from whole-life-insurance-cash-value-calculator-schema.json
import * as z from 'zod';

export interface Whole_life_insurance_cash_value_calculatorInput {
  dataConfidence?: number;
  yillikPrim: number;
  faiz: number;
  yil: number;
}

export const Whole_life_insurance_cash_value_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yillikPrim: z.number().min(0).default(10000),
  faiz: z.number().min(0).default(4),
  yil: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Whole_life_insurance_cash_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["yillikPrim"] * (((Math.pow(1 + input["faiz"] / 100, input["yil"]) - 1) / Math.max(0.0001, (input["faiz"] / 100)))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateWhole_life_insurance_cash_value_calculator(input: Whole_life_insurance_cash_value_calculatorInput): Whole_life_insurance_cash_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review insurance coverage annually.","Consult a retirement planner for personalized strategy."];
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

export interface Whole_life_insurance_cash_value_calculatorOutput {
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

export const Whole_life_insurance_cash_value_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;
