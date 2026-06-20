// Auto-generated from pet-insurance-calculator-schema.json
import * as z from 'zod';

export interface Pet_insurance_calculatorInput {
  age: number;
  breedRisk: number;
  basePremium: number;
  coverageLimit: number;
  deductible: number;
  reimbursement: number;
  dataConfidence?: number;
}

export const Pet_insurance_calculatorInputSchema = z.object({
  age: z.number().default(3),
  breedRisk: z.number().default(1),
  basePremium: z.number().default(25),
  coverageLimit: z.number().default(5000),
  deductible: z.number().default(200),
  reimbursement: z.number().default(80),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pet_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.breedRisk * (1 + input.age * 0.05); results["riskMultiplier"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riskMultiplier"] = Number.NaN; }
  try { const v = input.basePremium * (toNumericFormulaValue(results["riskMultiplier"])) * (input.coverageLimit / 5000) * (input.reimbursement / 80); results["adjustedMonthlyPremium"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustedMonthlyPremium"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["adjustedMonthlyPremium"])) * 12; results["annualCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualCost"] = Number.NaN; }
  try { const v = input.coverageLimit - input.deductible; results["effectiveCoverage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveCoverage"] = Number.NaN; }
  return results;
}


export function calculatePet_insurance_calculator(input: Pet_insurance_calculatorInput): Pet_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedMonthlyPremium"]);
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


export interface Pet_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
