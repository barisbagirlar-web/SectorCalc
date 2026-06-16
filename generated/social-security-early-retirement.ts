// Auto-generated from social-security-early-retirement-schema.json
import * as z from 'zod';

export interface Social_security_early_retirementInput {
  currentAge: number;
  fullRetirementAge: number;
  earlyRetirementAge: number;
  fullMonthlyBenefit: number;
}

export const Social_security_early_retirementInputSchema = z.object({
  currentAge: z.number().default(60),
  fullRetirementAge: z.number().default(67),
  earlyRetirementAge: z.number().default(62),
  fullMonthlyBenefit: z.number().default(2000),
});

function evaluateAllFormulas(input: Social_security_early_retirementInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fullRetirementAge - input.earlyRetirementAge) * 12; results["monthsEarly"] = Number.isFinite(v) ? v : 0; } catch { results["monthsEarly"] = 0; }
  try { const v = Math.min((results["monthsEarly"] ?? 0), 36) * (5/9) + Math.max(0, (results["monthsEarly"] ?? 0) - 36) * (5/12); results["reductionPercent"] = Number.isFinite(v) ? v : 0; } catch { results["reductionPercent"] = 0; }
  try { const v = input.fullMonthlyBenefit * (results["reductionPercent"] ?? 0) / 100; results["reductionAmount"] = Number.isFinite(v) ? v : 0; } catch { results["reductionAmount"] = 0; }
  try { const v = input.fullMonthlyBenefit - (results["reductionAmount"] ?? 0); results["monthlyBenefit"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyBenefit"] = 0; }
  return results;
}


export function calculateSocial_security_early_retirement(input: Social_security_early_retirementInput): Social_security_early_retirementOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyBenefit"] ?? 0;
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


export interface Social_security_early_retirementOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
