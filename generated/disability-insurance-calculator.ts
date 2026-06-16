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

function evaluateAllFormulas(input: Disability_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualIncome * (input.replacementRatio / 100)) / 12; results["monthlyBenefit"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyBenefit"] = 0; }
  try { const v = Math.pow(1 + input.discountRate / 100, 1/12) - 1; results["monthlyDiscountRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyDiscountRate"] = 0; }
  try { const v = (results["monthlyBenefit"] ?? 0) * input.benefitPeriodYears * 12; results["totalBenefitsUndiscounted"] = Number.isFinite(v) ? v : 0; } catch { results["totalBenefitsUndiscounted"] = 0; }
  try { const v = (results["monthlyBenefit"] ?? 0) * ((1 - Math.pow(1 + (results["monthlyDiscountRate"] ?? 0), -input.benefitPeriodYears * 12)) / (results["monthlyDiscountRate"] ?? 0)) * Math.pow(1 + (results["monthlyDiscountRate"] ?? 0), -input.waitingPeriodMonths); results["presentValue"] = Number.isFinite(v) ? v : 0; } catch { results["presentValue"] = 0; }
  return results;
}


export function calculateDisability_insurance_calculator(input: Disability_insurance_calculatorInput): Disability_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["presentValue"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
