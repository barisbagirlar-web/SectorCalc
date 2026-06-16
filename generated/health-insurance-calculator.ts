// Auto-generated from health-insurance-calculator-schema.json
import * as z from 'zod';

export interface Health_insurance_calculatorInput {
  age: number;
  sumInsured: number;
  familyMembers: number;
  smokerStatus: number;
  preExisting: number;
  occupationRisk: number;
}

export const Health_insurance_calculatorInputSchema = z.object({
  age: z.number().default(30),
  sumInsured: z.number().default(500000),
  familyMembers: z.number().default(1),
  smokerStatus: z.number().default(0),
  preExisting: z.number().default(0),
  occupationRisk: z.number().default(1),
});

function evaluateAllFormulas(input: Health_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sumInsured * 0.02 * (1 + (input.age - 30) * 0.01); results["basePremium"] = Number.isFinite(v) ? v : 0; } catch { results["basePremium"] = 0; }
  try { const v = 1 + (input.familyMembers - 1) * 0.2; results["familyMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["familyMultiplier"] = 0; }
  try { const v = 1 + input.smokerStatus * 0.5 + input.preExisting * 0.3; results["riskMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["riskMultiplier"] = 0; }
  try { const v = (results["basePremium"] ?? 0) * (results["familyMultiplier"] ?? 0) * (results["riskMultiplier"] ?? 0) * input.occupationRisk; results["totalPremium"] = Number.isFinite(v) ? v : 0; } catch { results["totalPremium"] = 0; }
  return results;
}


export function calculateHealth_insurance_calculator(input: Health_insurance_calculatorInput): Health_insurance_calculatorOutput {
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


export interface Health_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
