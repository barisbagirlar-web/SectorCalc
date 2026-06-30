// Auto-generated from monthly-disability-insurance-benefit-calculator-schema.json
import * as z from 'zod';

export interface Monthly_disability_insurance_benefit_calculatorInput {
  dataConfidence?: number;
  aylikGelir: number;
  odemeYuzdesi: number;
}

export const Monthly_disability_insurance_benefit_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  aylikGelir: z.number().min(0).default(15000),
  odemeYuzdesi: z.number().min(0).max(100).default(60),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Monthly_disability_insurance_benefit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["aylikGelir"] * (input["odemeYuzdesi"] / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateMonthly_disability_insurance_benefit_calculator(input: Monthly_disability_insurance_benefit_calculatorInput): Monthly_disability_insurance_benefit_calculatorOutput {
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

export interface Monthly_disability_insurance_benefit_calculatorOutput {
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

export const Monthly_disability_insurance_benefit_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;
