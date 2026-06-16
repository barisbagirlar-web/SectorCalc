// Auto-generated from social-security-delayed-retirement-calculator-schema.json
import * as z from 'zod';

export interface Social_security_delayed_retirement_calculatorInput {
  fullRetirementAge: number;
  plannedRetirementAge: number;
  primaryInsuranceAmount: number;
  annualDelayCreditRate: number;
}

export const Social_security_delayed_retirement_calculatorInputSchema = z.object({
  fullRetirementAge: z.number().default(67),
  plannedRetirementAge: z.number().default(70),
  primaryInsuranceAmount: z.number().default(2000),
  annualDelayCreditRate: z.number().default(8),
});

function evaluateAllFormulas(input: Social_security_delayed_retirement_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.plannedRetirementAge - input.fullRetirementAge; results["delayYears"] = Number.isFinite(v) ? v : 0; } catch { results["delayYears"] = 0; }
  try { const v = 1 + ((results["delayYears"] ?? 0) * input.annualDelayCreditRate / 100); results["benefitIncreaseFactor"] = Number.isFinite(v) ? v : 0; } catch { results["benefitIncreaseFactor"] = 0; }
  try { const v = input.primaryInsuranceAmount * (results["benefitIncreaseFactor"] ?? 0); results["newMonthlyBenefit"] = Number.isFinite(v) ? v : 0; } catch { results["newMonthlyBenefit"] = 0; }
  try { const v = ((results["benefitIncreaseFactor"] ?? 0) - 1) * 100; results["percentageIncrease"] = Number.isFinite(v) ? v : 0; } catch { results["percentageIncrease"] = 0; }
  return results;
}


export function calculateSocial_security_delayed_retirement_calculator(input: Social_security_delayed_retirement_calculatorInput): Social_security_delayed_retirement_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["newMonthlyBenefit"] ?? 0;
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


export interface Social_security_delayed_retirement_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
