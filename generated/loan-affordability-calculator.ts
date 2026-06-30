// Auto-generated from loan-affordability-calculator-schema.json
import * as z from 'zod';

export interface Loan_affordability_calculatorInput {
  dataConfidence?: number;
  netGelir: number;
  yasamGideri: number;
  maxTaksitOrani: number;
}

export const Loan_affordability_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  netGelir: z.number().min(0).default(30000),
  yasamGideri: z.number().min(0).default(12000),
  maxTaksitOrani: z.number().min(0).max(100).default(35),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Loan_affordability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min((input["netGelir"] - input["yasamGideri"]), input["netGelir"] * input["maxTaksitOrani"] / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateLoan_affordability_calculator(input: Loan_affordability_calculatorInput): Loan_affordability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Compare multiple loan offers before committing.","Consider total cost including fees."];
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

export interface Loan_affordability_calculatorOutput {
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

export const Loan_affordability_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;
