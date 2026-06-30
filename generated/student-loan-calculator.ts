// Auto-generated from student-loan-calculator-schema.json
import * as z from 'zod';

export interface Student_loan_calculatorInput {
  dataConfidence?: number;
  tutar: number;
  faiz: number;
  vade: number;
  gracePeriod: number;
}

export const Student_loan_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  tutar: z.number().min(0).default(100000),
  faiz: z.number().min(0).default(12),
  vade: z.number().min(1).default(60),
  gracePeriod: z.number().min(0).default(6),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Student_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["faiz"] === 0 ? input["tutar"] / Math.max(1, input["vade"]) : input["tutar"] * ((input["faiz"] / 1200) * Math.pow(1 + input["faiz"] / 1200, input["vade"] - input["gracePeriod"])) / (Math.pow(1 + input["faiz"] / 1200, input["vade"] - input["gracePeriod"]) - 1); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateStudent_loan_calculator(input: Student_loan_calculatorInput): Student_loan_calculatorOutput {
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

export interface Student_loan_calculatorOutput {
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

export const Student_loan_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;
