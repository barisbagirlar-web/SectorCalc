// Auto-generated from title-insurance-calculator-schema.json
import * as z from 'zod';

export interface Title_insurance_calculatorInput {
  propertyValue: number;
  coverageAmount: number;
  ratePerThousand: number;
  policyFee: number;
  stateTaxRate: number;
}

export const Title_insurance_calculatorInputSchema = z.object({
  propertyValue: z.number().default(300000),
  coverageAmount: z.number().default(300000),
  ratePerThousand: z.number().default(5),
  policyFee: z.number().default(150),
  stateTaxRate: z.number().default(0.5),
});

function evaluateAllFormulas(input: Title_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coverageAmount * (input.ratePerThousand / 1000); results["basePremium"] = Number.isFinite(v) ? v : 0; } catch { results["basePremium"] = 0; }
  try { const v = (results["basePremium"] ?? 0) * input.stateTaxRate / 100; results["stateTax"] = Number.isFinite(v) ? v : 0; } catch { results["stateTax"] = 0; }
  try { const v = (results["basePremium"] ?? 0) + input.policyFee + (results["stateTax"] ?? 0); results["totalPremium"] = Number.isFinite(v) ? v : 0; } catch { results["totalPremium"] = 0; }
  return results;
}


export function calculateTitle_insurance_calculator(input: Title_insurance_calculatorInput): Title_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPremium"] ?? 0;
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


export interface Title_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
