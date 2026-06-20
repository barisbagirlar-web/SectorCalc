// Auto-generated from disability-insurance-calculator-schema.json
import * as z from 'zod';

export interface Disability_insurance_calculatorInput {
  annualIncome: number;
  replacementRatio: number;
  benefitPeriodYears: number;
  waitingPeriodMonths: number;
  discountRate: number;
  inflationRate: number;
  dataConfidence?: number;
}

export const Disability_insurance_calculatorInputSchema = z.object({
  annualIncome: z.number().default(50000),
  replacementRatio: z.number().default(60),
  benefitPeriodYears: z.number().default(5),
  waitingPeriodMonths: z.number().default(3),
  discountRate: z.number().default(3),
  inflationRate: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Disability_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualIncome * (input.replacementRatio / 100)) / 12; results["monthlyBenefit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyBenefit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["monthlyBenefit"])) * input.benefitPeriodYears * 12; results["totalBenefitsUndiscounted"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBenefitsUndiscounted"] = Number.NaN; }
  return results;
}


export function calculateDisability_insurance_calculator(input: Disability_insurance_calculatorInput): Disability_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBenefitsUndiscounted"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
