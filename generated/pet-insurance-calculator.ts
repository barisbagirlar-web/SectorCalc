// Auto-generated from pet-insurance-calculator-schema.json
import * as z from 'zod';

export interface Pet_insurance_calculatorInput {
  age: number;
  breedRisk: number;
  basePremium: number;
  coverageLimit: number;
  deductible: number;
  reimbursement: number;
}

export const Pet_insurance_calculatorInputSchema = z.object({
  age: z.number().default(3),
  breedRisk: z.number().default(1),
  basePremium: z.number().default(25),
  coverageLimit: z.number().default(5000),
  deductible: z.number().default(200),
  reimbursement: z.number().default(80),
});

function evaluateAllFormulas(input: Pet_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.breedRisk * (1 + input.age * 0.05); results["riskMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["riskMultiplier"] = 0; }
  try { const v = input.basePremium * (results["riskMultiplier"] ?? 0) * (input.coverageLimit / 5000) * (input.reimbursement / 80); results["adjustedMonthlyPremium"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedMonthlyPremium"] = 0; }
  try { const v = (results["adjustedMonthlyPremium"] ?? 0) * 12; results["annualCost"] = Number.isFinite(v) ? v : 0; } catch { results["annualCost"] = 0; }
  try { const v = input.coverageLimit - input.deductible; results["effectiveCoverage"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveCoverage"] = 0; }
  return results;
}


export function calculatePet_insurance_calculator(input: Pet_insurance_calculatorInput): Pet_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["adjustedMonthlyPremium"] ?? 0;
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


export interface Pet_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
