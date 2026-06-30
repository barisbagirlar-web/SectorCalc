// Auto-generated from va-loan-calculator-schema.json
import * as z from 'zod';

export interface Va_loan_calculatorInput {
  dataConfidence?: number;
  kredi: number;
  finansmanUcreti: number;
}

export const Va_loan_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  kredi: z.number().min(0).default(1000000),
  finansmanUcreti: z.number().min(0).default(2.3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Va_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["kredi"] * (1 + input["finansmanUcreti"] / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateVa_loan_calculator(input: Va_loan_calculatorInput): Va_loan_calculatorOutput {
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Va_loan_calculatorOutput {
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

export const Va_loan_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;
