// Auto-generated from loan-payoff-calculator-schema.json
import * as z from 'zod';

export interface Loan_payoff_calculatorInput {
  dataConfidence?: number;
  anapara: number;
  faiz: number;
  odeme: number;
  ekOdeme: number;
}

export const Loan_payoff_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  anapara: z.number().min(0).default(100000),
  faiz: z.number().min(0).default(15),
  odeme: z.number().min(0).default(3000),
  ekOdeme: z.number().min(0).default(1000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Loan_payoff_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = -Math.log(Math.max(0.0001, 1 - (input["anapara"] * (input["faiz"] / 1200)) / (input["odeme"] + input["ekOdeme"]))) / Math.log(1 + input["faiz"] / 1200); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateLoan_payoff_calculator(input: Loan_payoff_calculatorInput): Loan_payoff_calculatorOutput {
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
    unit: "months",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Loan_payoff_calculatorOutput {
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

export const Loan_payoff_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "months",
  breakdownKeys: [],
} as const;
