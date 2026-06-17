// @ts-nocheck
// Auto-generated from disability-insurance-calculator-schema.json
import * as z from 'zod';

export interface Disability_insurance_calculatorInput {
  annualIncome: number;
  replacementRatio: number;
  benefitPeriodYears: number;
  waitingPeriodMonths: number;
  discountRate: number;
  inflationRate: number;
}

export const Disability_insurance_calculatorInputSchema = z.object({
  annualIncome: z.number().default(50000),
  replacementRatio: z.number().default(60),
  benefitPeriodYears: z.number().default(5),
  waitingPeriodMonths: z.number().default(3),
  discountRate: z.number().default(3),
  inflationRate: z.number().default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Disability_insurance_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.annualIncome * (input.replacementRatio / 100)) / 12; results["monthlyBenefit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyBenefit"] = 0; }
  try { const v = (asFormulaNumber(results["monthlyBenefit"])) * input.benefitPeriodYears * 12; results["totalBenefitsUndiscounted"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalBenefitsUndiscounted"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDisability_insurance_calculator(input: Disability_insurance_calculatorInput): Disability_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBenefitsUndiscounted"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Disability_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
