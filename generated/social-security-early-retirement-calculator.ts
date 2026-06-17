// Auto-generated from social-security-early-retirement-calculator-schema.json
import * as z from 'zod';

export interface Social_security_early_retirement_calculatorInput {
  birthYear: number;
  earlyRetirementAge: number;
  monthlyBenefitAtFRA: number;
  scalingFactor: number;
}

export const Social_security_early_retirement_calculatorInputSchema = z.object({
  birthYear: z.number().default(1960),
  earlyRetirementAge: z.number().default(62),
  monthlyBenefitAtFRA: z.number().default(1500),
  scalingFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Social_security_early_retirement_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.birthYear; results["fullRetirementAge"] = Number.isFinite(v) ? v : 0; } catch { results["fullRetirementAge"] = 0; }
  try { const v = input.birthYear; results["monthsEarly"] = Number.isFinite(v) ? v : 0; } catch { results["monthsEarly"] = 0; }
  try { const v = input.birthYear; results["reductionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["reductionFactor"] = 0; }
  try { const v = input.birthYear; results["reducedMonthlyBenefit"] = Number.isFinite(v) ? v : 0; } catch { results["reducedMonthlyBenefit"] = 0; }
  try { const v = input.birthYear; results["reductionPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["reductionPercentage"] = 0; }
  return results;
}


export function calculateSocial_security_early_retirement_calculator(input: Social_security_early_retirement_calculatorInput): Social_security_early_retirement_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["reducedMonthlyBenefit"] ?? 0;
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


export interface Social_security_early_retirement_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
