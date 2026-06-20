// Auto-generated from health-insurance-calculator-schema.json
import * as z from 'zod';

export interface Health_insurance_calculatorInput {
  age: number;
  sumInsured: number;
  familyMembers: number;
  smokerStatus: number;
  preExisting: number;
  occupationRisk: number;
  dataConfidence?: number;
}

export const Health_insurance_calculatorInputSchema = z.object({
  age: z.number().default(30),
  sumInsured: z.number().default(500000),
  familyMembers: z.number().default(1),
  smokerStatus: z.number().default(0),
  preExisting: z.number().default(0),
  occupationRisk: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Health_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sumInsured * 0.02 * (1 + (input.age - 30) * 0.01); results["basePremium"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["basePremium"] = Number.NaN; }
  try { const v = 1 + (input.familyMembers - 1) * 0.2; results["familyMultiplier"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["familyMultiplier"] = Number.NaN; }
  try { const v = 1 + input.smokerStatus * 0.5 + input.preExisting * 0.3; results["riskMultiplier"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riskMultiplier"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["basePremium"])) * (toNumericFormulaValue(results["familyMultiplier"])) * (toNumericFormulaValue(results["riskMultiplier"])) * input.occupationRisk; results["totalPremium"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPremium"] = Number.NaN; }
  return results;
}


export function calculateHealth_insurance_calculator(input: Health_insurance_calculatorInput): Health_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPremium"]);
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


export interface Health_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
