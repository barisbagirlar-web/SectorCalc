// Auto-generated from compound-interest-calculator-schema.json
import * as z from 'zod';

export interface Compound_interest_calculatorInput {
  principal: number;
  annualInterestRate: number;
  compoundingFrequency: string;
  timePeriod: number;
  additionalContribution: number;
  inflationRate: number;
  taxRate: number;
}

export const Compound_interest_calculatorInputSchema = z.object({
  principal: z.number().min(0).max(1000000000).default(10000),
  annualInterestRate: z.number().min(0).max(100).default(5),
  compoundingFrequency: z.enum(['1', '2', '4', '12', '52', '365']).default('12'),
  timePeriod: z.number().min(0).max(100).default(10),
  additionalContribution: z.number().min(0).max(100000000).default(0),
  inflationRate: z.number().min(0).max(100).default(2),
  taxRate: z.number().min(0).max(100).default(0),
});

function evaluateAllFormulas(input: Compound_interest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["effectiveRate"] = (1 + (input.annualInterestRate / 100) / input.compoundingFrequency) ^ input.compoundingFrequency - 1; } catch { results["effectiveRate"] = 0; }
  try { results["futureValueWithoutContributions"] = input.principal * (1 + (input.annualInterestRate / 100) / input.compoundingFrequency) ^ (input.compoundingFrequency * input.timePeriod); } catch { results["futureValueWithoutContributions"] = 0; }
  try { results["futureValueOfContributions"] = input.additionalContribution * (((1 + (input.annualInterestRate / 100) / input.compoundingFrequency) ^ (input.compoundingFrequency * input.timePeriod) - 1) / ((input.annualInterestRate / 100) / input.compoundingFrequency)); } catch { results["futureValueOfContributions"] = 0; }
  try { results["grossFutureValue"] = FV_principal + FV_contributions; } catch { results["grossFutureValue"] = 0; }
  try { results["taxAdjustment"] = 1 - (input.taxRate / 100); } catch { results["taxAdjustment"] = 0; }
  try { results["netFutureValue"] = input.principal + (grossFV - input.principal) * taxFactor; } catch { results["netFutureValue"] = 0; }
  try { results["realFutureValue"] = netFV / (1 + (input.inflationRate / 100)) ^ input.timePeriod; } catch { results["realFutureValue"] = 0; }
  return results;
}


export function calculateCompound_interest_calculator(input: Compound_interest_calculatorInput): Compound_interest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["realFutureValue"] ?? 0;
  const breakdown = {
    totalContributions: values["totalContributions"] ?? 0,
    totalInterestEarned: values["totalInterestEarned"] ?? 0,
    totalTaxPaid: values["totalTaxPaid"] ?? 0,
    inflationLoss: values["inflationLoss"] ?? 0,
    effectiveAnnualRate: values["effectiveAnnualRate"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Inflation Erosion","Tax Drag","Opportunity Cost of Low Compounding Frequency"];
  const suggestedActions: string[] = ["Increase Compounding Frequency","Tax-Efficient Investing","Inflation-Protected Investments","Increase Additional Contributions"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Scenario comparison","Sensitivity analysis"],
  };
}


export interface Compound_interest_calculatorOutput {
  totalWasteCost: number;
  breakdown: { totalContributions: number; totalInterestEarned: number; totalTaxPaid: number; inflationLoss: number; effectiveAnnualRate: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
