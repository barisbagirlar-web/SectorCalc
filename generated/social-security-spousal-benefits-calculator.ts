// Auto-generated from social-security-spousal-benefits-calculator-schema.json
import * as z from 'zod';

export interface Social_security_spousal_benefits_calculatorInput {
  primaryPIA: number;
  spousePIA: number;
  spouseFilingAge: number;
  spouseFRA: number;
}

export const Social_security_spousal_benefits_calculatorInputSchema = z.object({
  primaryPIA: z.number().default(2000),
  spousePIA: z.number().default(0),
  spouseFilingAge: z.number().default(62),
  spouseFRA: z.number().default(67),
});

function evaluateAllFormulas(input: Social_security_spousal_benefits_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, (input.spouseFRA - input.spouseFilingAge) * 12); results["monthsEarly"] = Number.isFinite(v) ? v : 0; } catch { results["monthsEarly"] = 0; }
  try { const v = Math.max(0, input.primaryPIA * 0.5 - input.spousePIA); results["grossSpousal"] = Number.isFinite(v) ? v : 0; } catch { results["grossSpousal"] = 0; }
  try { const v = (results["monthsEarly"] ?? 0) <= 36 ? (results["monthsEarly"] ?? 0) * 25 / 3600 : 36 * 25 / 3600 + ((results["monthsEarly"] ?? 0) - 36) * 5 / 1200; results["reductionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["reductionFactor"] = 0; }
  try { const v = (results["grossSpousal"] ?? 0) * (1 - (results["reductionFactor"] ?? 0)); results["spousalBenefit"] = Number.isFinite(v) ? v : 0; } catch { results["spousalBenefit"] = 0; }
  return results;
}


export function calculateSocial_security_spousal_benefits_calculator(input: Social_security_spousal_benefits_calculatorInput): Social_security_spousal_benefits_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["spousalBenefit"] ?? 0;
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


export interface Social_security_spousal_benefits_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
